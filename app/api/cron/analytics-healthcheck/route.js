// ═══════════════════════════════════════════════
// /api/cron/analytics-healthcheck — verificación diaria de integridad analytics
//
// Ejecuta el equivalente a smoke-analytics.mjs cada día. Si detecta drift
// entre lo que la DB tiene y lo que el endpoint /api/analytics-debug devuelve,
// envía email de alerta a info@selenaura.com (o ANALYTICS_ALERT_EMAIL).
//
// SCHEDULE: 06:30 UTC (registrado en vercel.json)
//
// Auth: Bearer CRON_SECRET. Vercel cron lo añade automáticamente.
// ═══════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllPaged } from '@/lib/supabase-paged';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TOLERANCE_PCT = 0.01; // 1%

async function supabaseCount(supabaseUrl, serviceKey, table, filter = '') {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*${filter ? '&' + filter : ''}`;
  const r = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  const range = r.headers.get('content-range');
  if (!range) throw new Error(`No content-range for ${table}`);
  return parseInt(range.split('/')[1], 10);
}

async function sendAlertEmail(brevoKey, subject, html) {
  const to = process.env.ANALYTICS_ALERT_EMAIL || 'info@selenaura.com';
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'SelenaUra Healthcheck', email: 'selene@selenaura.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  return r.ok;
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const brevoKey = process.env.BREVO_API_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase config missing' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const issues = [];
  const stats = {};

  try {
    // 1. Comparar leads count via endpoint (paginated) vs SQL count exacto
    const allLeads = await fetchAllPaged(admin, 'leads', 'id, created_at');
    const dbLeadsCount = await supabaseCount(supabaseUrl, serviceKey, 'leads');
    stats.leads = { paged: allLeads.length, db: dbLeadsCount };

    const leadsDelta = Math.abs(allLeads.length - dbLeadsCount);
    const leadsDeltaPct = dbLeadsCount > 0 ? leadsDelta / dbLeadsCount : 0;
    if (leadsDeltaPct > TOLERANCE_PCT) {
      issues.push({
        severity: 'critical',
        check: 'leads_count_drift',
        msg: `DB=${dbLeadsCount}, paginated=${allLeads.length}, delta=${leadsDelta} (${(leadsDeltaPct * 100).toFixed(2)}%)`,
      });
    }

    // 2. Verificar leads de hoy aparecen
    const today = new Date().toISOString().slice(0, 10);
    const todayLeadsInDb = await supabaseCount(supabaseUrl, serviceKey, 'leads', `created_at=gte.${today}T00:00:00`);
    const todayLeadsInPaged = allLeads.filter(l => l.created_at?.slice(0, 10) === today).length;
    stats.todayLeads = { db: todayLeadsInDb, paged: todayLeadsInPaged };

    if (todayLeadsInDb > 0 && todayLeadsInPaged === 0) {
      issues.push({
        severity: 'critical',
        check: 'today_leads_invisible',
        msg: `DB tiene ${todayLeadsInDb} leads hoy pero pagination devuelve 0 — bug de paginación reapareció`,
      });
    }

    // 3. Comparar payments completed
    const allPayments = await fetchAllPaged(admin, 'payments', 'id, status');
    const completed = allPayments.filter(p => p.status === 'completed').length;
    const dbCompleted = await supabaseCount(supabaseUrl, serviceKey, 'payments', 'status=eq.completed');
    stats.salesCompleted = { paged: completed, db: dbCompleted };

    if (completed !== dbCompleted) {
      issues.push({
        severity: 'warning',
        check: 'sales_count_mismatch',
        msg: `DB=${dbCompleted}, paginated=${completed}, mismatch`,
      });
    }
  } catch (e) {
    issues.push({ severity: 'critical', check: 'execution_error', msg: e.message });
  }

  // Si hay issues, mandar email alerta
  if (issues.length > 0 && brevoKey) {
    const html = `
      <h2 style="color:#c00;">🚨 Analytics Healthcheck — drift detectado</h2>
      <p>El cron diario de verificación de analytics encontró discrepancias entre la DB y los endpoints. Esto típicamente indica que ha reaparecido el bug del cap implícito de Supabase (1.000 rows).</p>
      <h3>Issues</h3>
      <ul>
        ${issues.map(i => `<li><strong>[${i.severity.toUpperCase()}]</strong> ${i.check}: ${i.msg}</li>`).join('')}
      </ul>
      <h3>Stats</h3>
      <pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;">${JSON.stringify(stats, null, 2)}</pre>
      <h3>Cómo arreglar</h3>
      <ol>
        <li>Buscar en el código <code>.from('tabla').select(</code> sin <code>.range()</code> en endpoints que sirven analytics.</li>
        <li>Sustituir por <code>fetchAllPaged()</code> de <code>lib/supabase-paged.js</code>.</li>
        <li>Correr <code>node --env-file=.env.local scripts/smoke-analytics.mjs</code> hasta que pase 4/4.</li>
        <li>Deploy.</li>
      </ol>
      <p style="color:#888;font-size:12px;">Este aviso se envía solo cuando hay drift. Si no recibes correos diarios, todo está bien.</p>`;

    await sendAlertEmail(brevoKey, '🚨 Analytics drift detectado — academy.selenaura.com', html);
  }

  return NextResponse.json({
    ok: issues.length === 0,
    issues,
    stats,
    timestamp: new Date().toISOString(),
  });
}
