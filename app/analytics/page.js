'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const REFRESH_INTERVAL = 60_000; // 60 seconds

const SOURCE_LABELS = {
  'lead-magnet': 'Lead Magnet',
  'meta-ads-guia': 'Meta Ads (Guía Espiritual)',
  'meta-ads-compatibilidad': 'Meta Ads (Compatibilidad LATAM)',
  'meta-ads': 'Meta Ads (Webhook)',
  'lectura-express': 'Lectura Express',
  'lectura_express': 'Lectura Express',
  'compatibilidad_tool': 'Compatibilidad (Tool)',
  'compatibilidad': 'Compatibilidad',
  'instagram_comment': 'Instagram',
  'exit_intent_landing': 'Exit Intent (Landing)',
  'exit_intent': 'Exit Intent',
  'carta_natal_gratis': 'Carta Natal Gratis',
  'organic': 'Orgánico',
  'waitlist_master': 'Waitlist Master',
  'unknown': 'Desconocido',
};

const STEP_LABELS = {
  0: 'Nuevo (sin nurture)',
  1: 'Welcome enviado',
  2: '3 Secretos (día 1)',
  3: 'Horóscopo (día 2)',
  4: 'Oferta Tarot (día 3)',
  5: 'Pack Astral (día 5)',
  6: 'Última oportunidad (día 8)',
  7: 'Win-back (día 14)',
  8: 'Reminder Tarot (día 4)',
  999: 'Desuscrito',
};

const STEP_COLORS = {
  0: 'bg-selene-blue',
  1: 'bg-selene-teal',
  2: 'bg-selene-success',
  3: 'bg-selene-gold',
  4: 'bg-selene-rose',
  5: 'bg-selene-purple',
  999: 'bg-red-500/60',
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `Error ${res.status}`);
        return;
      }
      setData(await res.json());
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-selene-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-selene-white-dim font-body">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4 font-body">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-selene-gold/20 text-selene-gold rounded-lg border border-selene-gold/30 hover:bg-selene-gold/30 transition font-body">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { summary, leadsBySource, nurtureFunnel, engagement, recentLeads, leadsPerDay } = data;
  const maxLeadsPerDay = Math.max(...leadsPerDay.map(d => d.count), 1);
  const maxSourceCount = Math.max(...leadsBySource.map(s => s.count), 1);
  const activeFunnel = nurtureFunnel.filter(f => f.step !== 999);
  const maxFunnelCount = Math.max(...activeFunnel.map(f => f.count), 1);
  const unsubscribed = nurtureFunnel.find(f => f.step === 999);

  return (
    <div className="min-h-screen bg-selene-bg text-selene-white font-body">
      {/* Header */}
      <header className="border-b border-selene-border bg-selene-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-selene-white-dim hover:text-selene-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-semibold text-selene-gold">Analytics Dashboard</h1>
              <p className="text-xs text-selene-white-dim mt-0.5">
                Selene Academia — Datos en tiempo real
                {lastUpdated && <span className="ml-2 opacity-60">Actualizado: {lastUpdated.toLocaleTimeString('es-ES')}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-selene-elevated hover:bg-selene-hover border border-selene-border transition"
            title="Refrescar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-selene-white-dim">
              <polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ═══ Section 1: Resumen en Tiempo Real ═══ */}
        <section>
          <SectionTitle>Resumen en Tiempo Real</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard label="Total Leads" value={summary.totalLeads} />
            <KpiCard label="Leads esta semana" value={summary.leadsThisWeek} accent="teal" />
            <KpiCard label="Leads hoy" value={summary.leadsToday} accent="blue" />
            <KpiCard label="Total Ventas" value={summary.totalSales} accent="purple" />
            <KpiCard label="Ingresos Totales" value={`${summary.totalRevenue.toFixed(0)}\u00A0\u20AC`} accent="success" />
            <KpiCard label="Tasa Conversion" value={`${summary.conversionRate}%`} accent="rose" />
          </div>
        </section>

        {/* ═══ Section 2: Leads por Fuente ═══ */}
        <section>
          <SectionTitle>Leads por Fuente</SectionTitle>
          <div className="bg-selene-card border border-selene-border rounded-xl p-5">
            {leadsBySource.length === 0 ? (
              <p className="text-selene-white-dim text-sm text-center py-8">Sin datos de fuentes</p>
            ) : (
              <div className="space-y-3">
                {leadsBySource.map(({ source, count }) => (
                  <div key={source} className="flex items-center gap-3">
                    <span className="text-sm text-selene-white-dim w-44 sm:w-52 truncate flex-shrink-0">
                      {SOURCE_LABELS[source] || source}
                    </span>
                    <div className="flex-1 bg-selene-bg rounded-full h-7 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-selene-gold/70 to-selene-gold rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${Math.max((count / maxSourceCount) * 100, 8)}%` }}
                      >
                        <span className="text-xs font-semibold text-selene-bg">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ Section 3: Funnel de Nurture ═══ */}
        <section>
          <SectionTitle>Funnel de Nurture</SectionTitle>
          <div className="bg-selene-card border border-selene-border rounded-xl p-5">
            <div className="space-y-3">
              {activeFunnel.map(({ step, count }) => {
                const pct = maxFunnelCount > 0 ? (count / maxFunnelCount) * 100 : 0;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-sm text-selene-white-dim w-44 sm:w-52 flex-shrink-0">
                      {STEP_LABELS[step] || `Step ${step}`}
                    </span>
                    <div className="flex-1 bg-selene-bg rounded-full h-8 overflow-hidden relative">
                      <div
                        className={`h-full ${STEP_COLORS[step] || 'bg-selene-gold'} rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${Math.max(pct, 8)}%`, opacity: 0.8 }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {unsubscribed && unsubscribed.count > 0 && (
              <div className="mt-4 pt-4 border-t border-selene-border flex items-center gap-3">
                <span className="text-sm text-red-400/80 w-44 sm:w-52 flex-shrink-0">{STEP_LABELS[999]}</span>
                <span className="text-sm font-semibold text-red-400">{unsubscribed.count}</span>
              </div>
            )}
          </div>
        </section>

        {/* ═══ Section 4: Email Engagement ═══ */}
        <section>
          <SectionTitle>Email Engagement</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <MetricCard label="Avg. Opens" value={engagement.avgOpens} sub="por lead" />
            <MetricCard label="Avg. Clicks" value={engagement.avgClicks} sub="por lead" />
            <MetricCard label="Nunca abrieron" value={engagement.neverOpened} sub="leads" accent="rose" />
            <MetricCard label="Engaged (clicks)" value={engagement.engaged} sub="leads" accent="success" />
          </div>

          {/* Top Engaged Leads */}
          {engagement.topEngaged.length > 0 && (
            <div className="bg-selene-card border border-selene-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-selene-gold-light mb-3">Top Leads Engaged</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-selene-white-dim border-b border-selene-border">
                      <th className="text-left py-2 pr-4 font-medium">Email</th>
                      <th className="text-right py-2 px-3 font-medium">Opens</th>
                      <th className="text-right py-2 px-3 font-medium">Clicks</th>
                      <th className="text-right py-2 pl-3 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagement.topEngaged.map((lead, i) => (
                      <tr key={i} className="border-b border-selene-border/50 hover:bg-selene-elevated/50 transition">
                        <td className="py-2 pr-4 text-selene-white font-mono text-xs">{lead.email}</td>
                        <td className="py-2 px-3 text-right text-selene-blue-light">{lead.opens}</td>
                        <td className="py-2 px-3 text-right text-selene-success">{lead.clicks}</td>
                        <td className="py-2 pl-3 text-right text-selene-gold font-semibold">{lead.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ═══ Section 5: Ultimos Leads ═══ */}
        <section>
          <SectionTitle>Ultimos 20 Leads</SectionTitle>
          <div className="bg-selene-card border border-selene-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-selene-white-dim bg-selene-elevated/50 border-b border-selene-border">
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-3 font-medium">Fuente</th>
                    <th className="text-center py-3 px-3 font-medium">Nurture</th>
                    <th className="text-right py-3 px-3 font-medium">Opens</th>
                    <th className="text-right py-3 px-3 font-medium">Clicks</th>
                    <th className="text-right py-3 px-4 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead, i) => (
                    <tr key={i} className="border-b border-selene-border/30 hover:bg-selene-elevated/30 transition">
                      <td className="py-2.5 px-4 font-mono text-xs text-selene-white">{lead.email}</td>
                      <td className="py-2.5 px-3 text-selene-white-dim text-xs">{SOURCE_LABELS[lead.source] || lead.source}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.nurture_step === 999
                            ? 'bg-red-500/20 text-red-400'
                            : lead.nurture_step >= 5
                              ? 'bg-selene-success/20 text-selene-success'
                              : 'bg-selene-gold/20 text-selene-gold'
                        }`}>
                          {lead.nurture_step === 999 ? 'Unsub' : `Step ${lead.nurture_step}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-selene-blue-light">{lead.opens}</td>
                      <td className="py-2.5 px-3 text-right text-selene-success">{lead.clicks}</td>
                      <td className="py-2.5 px-4 text-right text-selene-white-dim text-xs">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══ Section 6: Leads por Dia ═══ */}
        <section>
          <SectionTitle>Leads por Dia (ultimos 30 dias)</SectionTitle>
          <div className="bg-selene-card border border-selene-border rounded-xl p-5">
            <div className="flex items-end gap-1 h-40 sm:h-48">
              {leadsPerDay.map(({ date, count }) => {
                const height = maxLeadsPerDay > 0 ? (count / maxLeadsPerDay) * 100 : 0;
                const dayLabel = date.slice(8, 10);
                const isToday = date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 hidden group-hover:block bg-selene-elevated border border-selene-border rounded px-2 py-1 text-xs text-selene-white whitespace-nowrap z-10">
                      {date}: {count} leads
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] text-selene-gold mb-1 hidden sm:block">{count}</span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${isToday ? 'bg-selene-gold' : 'bg-selene-gold/50 group-hover:bg-selene-gold/80'}`}
                      style={{ height: `${Math.max(height, count > 0 ? 4 : 1)}%` }}
                    />
                    {/* Show day label every few bars */}
                    <span className={`text-[9px] mt-1 ${isToday ? 'text-selene-gold font-bold' : 'text-selene-white-dim/50'} ${parseInt(dayLabel) % 5 === 0 || isToday ? 'block' : 'hidden sm:block'}`}>
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-selene-white-dim/50">
            Auto-refresh cada 60 segundos — Selene Academia Analytics
          </p>
        </div>
      </main>
    </div>
  );
}

// ── KPI Card Component ──
function KpiCard({ label, value, accent = 'gold' }) {
  const borderColors = {
    gold: 'border-selene-gold/40',
    teal: 'border-selene-teal/40',
    blue: 'border-selene-blue/40',
    purple: 'border-selene-purple/40',
    success: 'border-selene-success/40',
    rose: 'border-selene-rose/40',
  };
  const textColors = {
    gold: 'text-selene-gold',
    teal: 'text-selene-teal',
    blue: 'text-selene-blue-light',
    purple: 'text-selene-purple',
    success: 'text-selene-success',
    rose: 'text-selene-rose',
  };
  return (
    <div className={`bg-selene-card border ${borderColors[accent]} rounded-xl p-4 text-center hover:bg-selene-elevated/50 transition`}>
      <p className={`text-2xl sm:text-3xl font-display font-bold ${textColors[accent]}`}>{value}</p>
      <p className="text-xs text-selene-white-dim mt-1">{label}</p>
    </div>
  );
}

// ── Metric Card Component ──
function MetricCard({ label, value, sub, accent = 'gold' }) {
  const textColors = {
    gold: 'text-selene-gold',
    success: 'text-selene-success',
    rose: 'text-selene-rose',
    blue: 'text-selene-blue-light',
  };
  return (
    <div className="bg-selene-card border border-selene-border rounded-xl p-4 text-center">
      <p className={`text-xl sm:text-2xl font-display font-bold ${textColors[accent]}`}>{value}</p>
      <p className="text-xs text-selene-white-dim mt-1">{label}</p>
      {sub && <p className="text-[10px] text-selene-white-dim/50 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Section Title Component ──
function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-display font-semibold text-selene-gold-light mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-selene-gold" />
      {children}
    </h2>
  );
}
