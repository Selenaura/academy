export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    // Fetch all leads and enrollments in parallel
    const [leadsRes, enrollmentsRes] = await Promise.all([
      admin.from('leads').select('id, email, source, nurture_step, opens_count, clicks_count, created_at'),
      admin.from('enrollments').select('id, user_id, course_id, status, amount_paid, enrolled_at'),
    ]);

    if (leadsRes.error) return NextResponse.json({ error: leadsRes.error.message }, { status: 500 });
    if (enrollmentsRes.error) return NextResponse.json({ error: enrollmentsRes.error.message }, { status: 500 });

    const leads = leadsRes.data || [];
    const enrollments = enrollmentsRes.data || [];

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

    // ── Section 1: Resumen ──
    const totalLeads = leads.length;
    const leadsThisWeek = leads.filter(l => l.created_at >= weekAgo).length;
    const leadsToday = leads.filter(l => l.created_at?.slice(0, 10) === todayStr).length;
    const totalSales = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0);
    const conversionRate = totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : '0.0';

    // ── Section 2: Leads por Fuente ──
    const sourceMap = {};
    leads.forEach(l => {
      const src = l.source || 'unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const leadsBySource = Object.entries(sourceMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // ── Section 3: Funnel de Nurture ──
    const nurtureMap = {};
    leads.forEach(l => {
      const step = l.nurture_step ?? 0;
      nurtureMap[step] = (nurtureMap[step] || 0) + 1;
    });
    const nurtureFunnel = [0, 1, 2, 3, 4, 5, 999].map(step => ({
      step,
      label: step === 999 ? 'Unsubscribed' : `Step ${step}`,
      count: nurtureMap[step] || 0,
    }));

    // ── Section 4: Email Engagement ──
    const totalOpens = leads.reduce((s, l) => s + (l.opens_count || 0), 0);
    const totalClicks = leads.reduce((s, l) => s + (l.clicks_count || 0), 0);
    const avgOpens = totalLeads > 0 ? (totalOpens / totalLeads).toFixed(1) : '0.0';
    const avgClicks = totalLeads > 0 ? (totalClicks / totalLeads).toFixed(1) : '0.0';
    const neverOpened = leads.filter(l => !l.opens_count || l.opens_count === 0).length;
    const engaged = leads.filter(l => l.clicks_count > 0).length;

    // Top engaged leads (by opens + clicks, top 10)
    const topEngaged = [...leads]
      .map(l => ({
        email: maskEmail(l.email),
        opens: l.opens_count || 0,
        clicks: l.clicks_count || 0,
        score: (l.opens_count || 0) + (l.clicks_count || 0) * 3,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // ── Section 5: Últimos Leads ──
    const recentLeads = [...leads]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 20)
      .map(l => ({
        email: maskEmail(l.email),
        source: l.source || 'unknown',
        nurture_step: l.nurture_step ?? 0,
        opens: l.opens_count || 0,
        clicks: l.clicks_count || 0,
        created_at: l.created_at,
      }));

    // ── Section 6: Leads por Día (últimos 30 días) ──
    const dayMap = {};
    leads.forEach(l => {
      const day = l.created_at?.slice(0, 10);
      if (day) dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const leadsPerDay = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      leadsPerDay.push({ date: dayStr, count: dayMap[dayStr] || 0 });
    }

    return NextResponse.json({
      summary: { totalLeads, leadsThisWeek, leadsToday, totalSales, totalRevenue, conversionRate },
      leadsBySource,
      nurtureFunnel,
      engagement: { avgOpens, avgClicks, neverOpened, engaged, topEngaged },
      recentLeads,
      leadsPerDay,
    });
  });
}

function maskEmail(email) {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const masked = local.length <= 2 ? '*'.repeat(local.length) : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}
