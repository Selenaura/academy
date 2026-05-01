export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';
import { fetchAllPaged } from '@/lib/supabase-paged';

// Paginación: ver lib/supabase-paged.js — bug del 28/04/2026 documentado allí.
// NUNCA usar `.from(t).select()` sin .range() para tablas que crecen >1000.

export async function GET() {
  return withAdmin(async (admin) => {
    // Fetch all leads, enrollments, and payments in parallel (paginated)
    let leads, enrollments, payments;
    try {
      [leads, enrollments, payments] = await Promise.all([
        fetchAllPaged(admin, 'leads', 'id, email, source, nurture_step, opens_count, clicks_count, created_at'),
        fetchAllPaged(admin, 'enrollments', 'id, user_id, course_id, status, amount_paid, enrolled_at'),
        fetchAllPaged(admin, 'payments', 'id, email, product_type, product_id, amount, currency, status, created_at'),
      ]);
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    payments = payments.filter(p => p.status === 'completed');

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

    // ── Section 1: Resumen ──
    const totalLeads = leads.length;
    const leadsThisWeek = leads.filter(l => l.created_at >= weekAgo).length;
    const leadsToday = leads.filter(l => l.created_at?.slice(0, 10) === todayStr).length;
    const paidEnrollments = enrollments.filter(e => e.amount_paid > 0);
    // Revenue from payments table (cents → euros)
    const totalPaymentsRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;
    // Revenue from enrollments (in case payments table doesn't capture all)
    const totalEnrollmentsRevenue = enrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0) / 100;
    const totalRevenue = Math.max(totalPaymentsRevenue, totalEnrollmentsRevenue);
    const totalSales = payments.length || paidEnrollments.length;
    const salesThisWeek = payments.filter(p => p.created_at >= weekAgo).length;
    const salesToday = payments.filter(p => p.created_at?.slice(0, 10) === todayStr).length;
    const conversionRate = totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : '0.0';
    const avgOrderValue = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00';

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

    // ── Section 7: Ventas por Producto ──
    const productMap = {};
    payments.forEach(p => {
      const key = p.product_id || 'unknown';
      if (!productMap[key]) productMap[key] = { type: p.product_type, count: 0, revenue: 0 };
      productMap[key].count += 1;
      productMap[key].revenue += (p.amount || 0) / 100;
    });
    const salesByProduct = Object.entries(productMap)
      .map(([product, data]) => ({ product, type: data.type, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // ── Section 8: Revenue por Día (últimos 30 días) ──
    const revDayMap = {};
    payments.forEach(p => {
      const day = p.created_at?.slice(0, 10);
      if (day) revDayMap[day] = (revDayMap[day] || 0) + (p.amount || 0) / 100;
    });
    const revenuePerDay = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      revenuePerDay.push({ date: dayStr, revenue: revDayMap[dayStr] || 0 });
    }

    // ── Section 9: Últimas Ventas ──
    const recentSales = [...payments]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 15)
      .map(p => ({
        email: maskEmail(p.email),
        product: p.product_id || 'unknown',
        type: p.product_type || 'unknown',
        amount: (p.amount || 0) / 100,
        currency: p.currency || 'eur',
        created_at: p.created_at,
      }));

    return NextResponse.json({
      summary: { totalLeads, leadsThisWeek, leadsToday, totalSales, salesThisWeek, salesToday, totalRevenue, conversionRate, avgOrderValue },
      leadsBySource,
      nurtureFunnel,
      engagement: { avgOpens, avgClicks, neverOpened, engaged, topEngaged },
      recentLeads,
      leadsPerDay,
      salesByProduct,
      revenuePerDay,
      recentSales,
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
