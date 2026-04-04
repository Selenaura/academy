import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createNotionPage, queryNotionDatabase, updateNotionPage } from '@/lib/notion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const METRICAS_DB = 'ec7c768f1a414dea8ac3f665ed0cd63a';
const TAREAS_DB = '42f93db57f0140388966373b67132cf9';

/**
 * GET /api/cron/weekly-analytics
 * Runs every Monday at 07:00 UTC (Vercel Cron).
 * Collects metrics from Supabase + Brevo, writes summary to Notion,
 * generates AI insights with Claude, and creates tasks for anomalies.
 */
export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── Date range: last 7 days (Mon-Sun) ──
    const now = new Date();
    const endDate = new Date(now);
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 7);

    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const startYMD = startISO.slice(0, 10);
    const endYMD = endISO.slice(0, 10);

    // ISO week label (e.g. "2026-W14")
    const weekLabel = getISOWeekLabel(startDate);

    console.log(`📊 Weekly analytics: ${startYMD} → ${endYMD} (${weekLabel})`);

    // ── Step A: Supabase leads ──
    const leadsMetrics = await collectLeadsMetrics(startISO, endISO);

    // ── Step B: Supabase enrollments + revenue ──
    const enrollmentMetrics = await collectEnrollmentMetrics(startISO, endISO);

    // ── Step C: Brevo email stats ──
    const emailMetrics = await collectBrevoMetrics(startYMD, endYMD);

    // ── Step D: Write to Notion ──
    const openRate = emailMetrics.delivered > 0
      ? Math.round((emailMetrics.opens / emailMetrics.delivered) * 10000) / 100
      : 0;
    const clickRate = emailMetrics.delivered > 0
      ? Math.round((emailMetrics.clicks / emailMetrics.delivered) * 10000) / 100
      : 0;

    const notionProperties = {
      'Semana': { title: [{ text: { content: weekLabel } }] },
      'Fecha Inicio': { date: { start: startYMD } },
      'Leads Nuevos': { number: leadsMetrics.newLeads },
      'Ventas': { number: enrollmentMetrics.newEnrollments },
      'Ingresos': { number: enrollmentMetrics.revenue },
      'Emails Enviados': { number: emailMetrics.sent },
      'Tasa Apertura': { number: openRate },
      'Tasa Clicks': { number: clickRate },
      'Bounces': { number: emailMetrics.hardBounces + emailMetrics.softBounces },
      'Unsubscribes': { number: leadsMetrics.unsubscribes },
    };

    const notionPage = await createNotionPage(METRICAS_DB, notionProperties);
    console.log(`✅ Notion page created: ${notionPage.id}`);

    // ── Step E: AI Analysis with Claude ──
    const previousWeek = await getPreviousWeekMetrics();
    const aiAnalysis = await generateAIInsights({
      weekLabel,
      startYMD,
      endYMD,
      leadsMetrics,
      enrollmentMetrics,
      emailMetrics,
      openRate,
      clickRate,
      previousWeek,
    });

    // ── Step F: Update Notion with AI insights ──
    await updateNotionPage(notionPage.id, {
      'Notas IA': { rich_text: [{ text: { content: truncate(aiAnalysis, 2000) } }] },
    });
    console.log('✅ AI insights added to Notion page');

    // ── Step G: Create tasks for anomalies ──
    const tasksCreated = await createAnomalyTasks(aiAnalysis, previousWeek, {
      leadsMetrics,
      enrollmentMetrics,
      openRate,
    });

    return NextResponse.json({
      success: true,
      week: weekLabel,
      metrics: {
        leads: leadsMetrics.newLeads,
        enrollments: enrollmentMetrics.newEnrollments,
        revenue: enrollmentMetrics.revenue,
        emailsSent: emailMetrics.sent,
        openRate,
        clickRate,
      },
      notionPageId: notionPage.id,
      tasksCreated,
    });
  } catch (err) {
    console.error('Weekly analytics cron error:', err);
    return NextResponse.json({ error: 'Internal error', details: err.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// Data collection helpers
// ─────────────────────────────────────────────

async function collectLeadsMetrics(startISO, endISO) {
  // New leads this week
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startISO)
    .lt('created_at', endISO);

  // Leads by source
  const { data: sourceData } = await supabase
    .from('leads')
    .select('source')
    .gte('created_at', startISO)
    .lt('created_at', endISO);

  const bySource = {};
  if (sourceData) {
    for (const row of sourceData) {
      const src = row.source || 'unknown';
      bySource[src] = (bySource[src] || 0) + 1;
    }
  }

  // Unsubscribes this week
  const { count: unsubscribes } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('nurture_step', 999);
  // Note: nurture_step=999 marks unsubscribed; we count total, not just this week
  // since there's no unsubscribed_at column. A future migration could add one.

  // Average engagement for this week's leads
  const { data: engagementData } = await supabase
    .from('leads')
    .select('opens_count, clicks_count')
    .gte('created_at', startISO)
    .lt('created_at', endISO);

  let avgOpens = 0;
  let avgClicks = 0;
  if (engagementData && engagementData.length > 0) {
    const totals = engagementData.reduce(
      (acc, r) => ({
        opens: acc.opens + (r.opens_count || 0),
        clicks: acc.clicks + (r.clicks_count || 0),
      }),
      { opens: 0, clicks: 0 }
    );
    avgOpens = Math.round((totals.opens / engagementData.length) * 100) / 100;
    avgClicks = Math.round((totals.clicks / engagementData.length) * 100) / 100;
  }

  return {
    newLeads: newLeads || 0,
    bySource,
    unsubscribes: unsubscribes || 0,
    avgOpens,
    avgClicks,
  };
}

async function collectEnrollmentMetrics(startISO, endISO) {
  // New enrollments
  const { data: enrollments, count } = await supabase
    .from('enrollments')
    .select('amount_paid', { count: 'exact' })
    .gte('enrolled_at', startISO)
    .lt('enrolled_at', endISO);

  const revenue = enrollments
    ? enrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0)
    : 0;

  return {
    newEnrollments: count || 0,
    revenue: revenue / 100, // amount_paid is in cents
  };
}

async function collectBrevoMetrics(startYMD, endYMD) {
  const defaults = {
    sent: 0, delivered: 0, opens: 0, clicks: 0,
    hardBounces: 0, softBounces: 0, unsubscriptions: 0,
  };

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ BREVO_API_KEY not set, skipping email metrics');
    return defaults;
  }

  try {
    const res = await fetch(
      `https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=${startYMD}&endDate=${endYMD}`,
      { headers: { 'api-key': apiKey, 'accept': 'application/json' } }
    );

    if (!res.ok) {
      console.error(`Brevo API error ${res.status}: ${await res.text()}`);
      return defaults;
    }

    const data = await res.json();
    return {
      sent: data.requests || 0,
      delivered: data.delivered || 0,
      opens: data.opens || 0,
      clicks: data.clicks || 0,
      hardBounces: data.hardBounces || 0,
      softBounces: data.softBounces || 0,
      unsubscriptions: data.unsubscriptions || 0,
    };
  } catch (err) {
    console.error('Brevo metrics fetch failed:', err.message);
    return defaults;
  }
}

// ─────────────────────────────────────────────
// Notion helpers
// ─────────────────────────────────────────────

async function getPreviousWeekMetrics() {
  try {
    const result = await queryNotionDatabase(
      METRICAS_DB,
      undefined,
      [{ property: 'Fecha Inicio', direction: 'descending' }],
      1
    );

    if (!result.results || result.results.length === 0) return null;

    const p = result.results[0].properties;
    return {
      leads: p['Leads Nuevos']?.number ?? null,
      ventas: p['Ventas']?.number ?? null,
      ingresos: p['Ingresos']?.number ?? null,
      emailsSent: p['Emails Enviados']?.number ?? null,
      openRate: p['Tasa Apertura']?.number ?? null,
      clickRate: p['Tasa Clicks']?.number ?? null,
      bounces: p['Bounces']?.number ?? null,
      unsubscribes: p['Unsubscribes']?.number ?? null,
      semana: p['Semana']?.title?.[0]?.text?.content ?? 'desconocida',
    };
  } catch (err) {
    console.warn('Could not fetch previous week metrics:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// AI Analysis
// ─────────────────────────────────────────────

async function generateAIInsights(data) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ ANTHROPIC_API_KEY not set, skipping AI analysis');
    return 'Análisis IA no disponible (API key no configurada).';
  }

  const prevText = data.previousWeek
    ? `
Semana anterior (${data.previousWeek.semana}):
- Leads: ${data.previousWeek.leads}
- Ventas: ${data.previousWeek.ventas}
- Ingresos: ${data.previousWeek.ingresos}€
- Emails enviados: ${data.previousWeek.emailsSent}
- Tasa apertura: ${data.previousWeek.openRate}%
- Tasa clicks: ${data.previousWeek.clickRate}%
- Bounces: ${data.previousWeek.bounces}
- Unsubscribes: ${data.previousWeek.unsubscribes}`
    : 'No hay datos de la semana anterior.';

  const userPrompt = `Métricas de la semana ${data.weekLabel} (${data.startYMD} a ${data.endYMD}):

LEADS:
- Nuevos leads: ${data.leadsMetrics.newLeads}
- Por fuente: ${JSON.stringify(data.leadsMetrics.bySource)}
- Unsubscribes totales: ${data.leadsMetrics.unsubscribes}
- Media aperturas por lead: ${data.leadsMetrics.avgOpens}
- Media clicks por lead: ${data.leadsMetrics.avgClicks}

VENTAS:
- Nuevas inscripciones: ${data.enrollmentMetrics.newEnrollments}
- Ingresos: ${data.enrollmentMetrics.revenue}€

EMAIL (Brevo):
- Enviados: ${data.emailMetrics.sent}
- Entregados: ${data.emailMetrics.delivered}
- Aperturas: ${data.emailMetrics.opens}
- Clicks: ${data.emailMetrics.clicks}
- Tasa apertura: ${data.openRate}%
- Tasa clicks: ${data.clickRate}%
- Hard bounces: ${data.emailMetrics.hardBounces}
- Soft bounces: ${data.emailMetrics.softBounces}
- Unsubscribes email: ${data.emailMetrics.unsubscriptions}

${prevText}

Genera:
1. 3-5 insights clave sobre el rendimiento de esta semana
2. 2-3 acciones concretas recomendadas
3. Detección de anomalías (si las hay)
4. Comparación con semana anterior (si hay datos)

Formato: texto plano conciso, sin markdown.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: 'Eres el analista de datos de SelenaUra, una escuela online de espiritualidad y desarrollo personal. Analiza las métricas semanales y genera insights accionables en español. Sé conciso y directo.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Anthropic API error ${res.status}: ${errBody}`);
      return 'Error al generar análisis IA.';
    }

    const result = await res.json();
    return result.content?.[0]?.text || 'Sin respuesta del modelo.';
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    return 'Error al generar análisis IA.';
  }
}

// ─────────────────────────────────────────────
// Anomaly detection → Task creation
// ─────────────────────────────────────────────

async function createAnomalyTasks(aiAnalysis, previousWeek, currentMetrics) {
  if (!previousWeek) return 0;

  const tasks = [];

  // CPL spike > 50% (more leads but could also mean quality drop — flag it)
  if (previousWeek.leads > 0 && currentMetrics.leadsMetrics.newLeads > 0) {
    // If leads dropped by more than 50%
    const leadsDrop = (previousWeek.leads - currentMetrics.leadsMetrics.newLeads) / previousWeek.leads;
    if (leadsDrop > 0.5) {
      tasks.push(`ALERTA: Leads cayeron un ${Math.round(leadsDrop * 100)}% vs semana anterior (${currentMetrics.leadsMetrics.newLeads} vs ${previousWeek.leads}). Revisar campañas Meta Ads.`);
    }
  }

  // Open rate drop > 30%
  if (previousWeek.openRate > 0 && currentMetrics.openRate > 0) {
    const openDrop = (previousWeek.openRate - currentMetrics.openRate) / previousWeek.openRate;
    if (openDrop > 0.3) {
      tasks.push(`ALERTA: Tasa de apertura cayó un ${Math.round(openDrop * 100)}% (${currentMetrics.openRate}% vs ${previousWeek.openRate}%). Revisar asuntos de email y deliverability.`);
    }
  }

  // Zero enrollments when previous week had some
  if (previousWeek.ventas > 0 && currentMetrics.enrollmentMetrics.newEnrollments === 0) {
    tasks.push('ALERTA: Cero ventas esta semana (semana anterior tuvo ventas). Revisar funnel de conversión y página de ventas.');
  }

  let created = 0;
  for (const taskTitle of tasks) {
    try {
      await createNotionPage(TAREAS_DB, {
        'Tarea': { title: [{ text: { content: taskTitle } }] },
        'Estado': { select: { name: 'Pendiente' } },
        'Prioridad': { select: { name: 'P1 Alta' } },
        'Área': { select: { name: 'Analytics' } },
        'Origen': { select: { name: 'IA Automático' } },
      });
      created++;
      console.log(`🚨 Task created: ${taskTitle.slice(0, 60)}...`);
    } catch (err) {
      console.error('Failed to create Notion task:', err.message);
    }
  }

  return created;
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function getISOWeekLabel(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
