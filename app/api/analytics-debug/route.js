// ═══════════════════════════════════════════════
// /api/analytics-debug — mirror de /api/analytics con auth CRON_SECRET
//
// Creado 28/04/2026 para diagnosticar si el dashboard /analytics no se ve
// por problema de UI o de datos. Si este endpoint devuelve JSON con datos,
// el problema NO es Supabase — es el render del dashboard o la sesión.
//
// Uso desde browser:
//   https://academy.selenaura.com/api/analytics-debug?key=<CRON_SECRET>
//
// Uso desde curl:
//   curl -H "Authorization: Bearer <CRON_SECRET>" https://academy.selenaura.com/api/analytics-debug
// ═══════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllPaged } from '@/lib/supabase-paged';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Auth via Bearer header OR ?key= query param (para abrir en browser).
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 500 });
  }

  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key');
  const authHeader = request.headers.get('authorization') || '';
  const bearerKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const provided = queryKey || bearerKey;

  if (provided !== cronSecret) {
    return NextResponse.json({ error: 'No autorizado — pasa ?key= o Authorization: Bearer' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRole);

  // Paginación delegada a lib/supabase-paged.js. Ver helper para regla de uso.
  let leads, payments;
  try {
    [leads, payments] = await Promise.all([
      fetchAllPaged(admin, 'leads', 'id, email, source, nurture_step, opens_count, clicks_count, created_at'),
      fetchAllPaged(admin, 'payments', 'id, email, product_type, product_id, amount, currency, status, created_at'),
    ]);
  } catch (e) {
    return NextResponse.json({ error: 'fetch failed: ' + e.message }, { status: 500 });
  }
  payments = payments.filter(p => p.status === 'completed');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const totalLeads = leads.length;
  const leadsThisWeek = leads.filter(l => l.created_at >= weekAgo).length;
  const leadsToday = leads.filter(l => l.created_at?.slice(0, 10) === todayStr).length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;
  const totalSales = payments.length;
  const salesThisWeek = payments.filter(p => p.created_at >= weekAgo).length;
  const salesToday = payments.filter(p => p.created_at?.slice(0, 10) === todayStr).length;

  const sourceMap = {};
  leads.forEach(l => {
    const src = l.source || 'unknown';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const leadsBySource = Object.entries(sourceMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  const recentSales = [...payments]
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    .slice(0, 10)
    .map(p => ({
      email: p.email ? p.email.replace(/(.{2}).+(@.+)/, '$1***$2') : null,
      product: p.product_id,
      amount_eur: (p.amount || 0) / 100,
      created_at: p.created_at,
    }));

  return NextResponse.json({
    debug: '✅ Endpoint funciona, datos OK. Si /analytics no muestra esto, el problema es UI/auth.',
    timestamp: now.toISOString(),
    summary: {
      totalLeads,
      leadsThisWeek,
      leadsToday,
      totalSales,
      salesThisWeek,
      salesToday,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      conversionRate: totalLeads > 0 ? Number(((totalSales / totalLeads) * 100).toFixed(2)) : 0,
      avgOrderValue: totalSales > 0 ? Number((totalRevenue / totalSales).toFixed(2)) : 0,
    },
    leadsBySource: leadsBySource.slice(0, 15),
    recentSales,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
