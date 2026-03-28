'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { COURSES, LEVELS, getLevel } from '@/lib/constants';
import { getUserStats, BADGES, LEVELS as GAME_LEVELS, getLevelProgress } from '@/lib/gamification';
import { Navbar, ProgressBar } from '@/components/ui';

// ── Icons ─────────────────────────────────────────────
function FireIcon({ size = 20, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0C17 6 12 2 12 2zm0 13a2 2 0 0 1-2-2c0-2 2-4 2-4s2 2 2 4a2 2 0 0 1-2 2z"/></svg>;
}
function PlayIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5,3 19,12 5,21"/></svg>;
}
function StarIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>;
}
function BookIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function ArrowIcon({ size = 14, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>;
}
function LockIcon({ size = 14, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function CheckIcon({ size = 14, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20,6 9,17 4,12"/></svg>;
}
function TrophyIcon({ size = 18, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 2h12v7a6 6 0 0 1-12 0V2z"/></svg>;
}
function ZapIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>;
}

// ── XP Ring ────────────────────────────────────────────
function XpRing({ progress, level, xp, nextLevel }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(progress, 1);

  return (
    <div className="relative w-[108px] h-[108px] shrink-0">
      <svg width="108" height="108" viewBox="0 0 108 108" className="rotate-[-90deg]">
        <circle cx="54" cy="54" r={r} fill="none" stroke="#1e1e2a" strokeWidth="8" />
        <circle
          cx="54" cy="54" r={r} fill="none"
          stroke="url(#xpGrad)" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#e8c96a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-display font-normal text-selene-white leading-none">{level.icon || '✦'}</span>
        <span className="text-[11px] font-bold text-selene-gold mt-0.5">{xp.toLocaleString()}</span>
        <span className="text-[9px] text-selene-white-dim">XP</span>
      </div>
    </div>
  );
}

// ── Streak Dots ────────────────────────────────────────
function StreakDots({ streak }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all ${
            i < Math.min(streak, 7)
              ? 'bg-selene-gold shadow-[0_0_6px_rgba(201,168,76,0.6)]'
              : 'bg-[#1e1e2a] border border-[#2a2a3a]'
          }`}
        />
      ))}
      {streak > 7 && (
        <span className="text-[10px] text-selene-gold font-semibold">+{streak - 7}</span>
      )}
    </div>
  );
}

// ── Daily Reto ─────────────────────────────────────────
const DAILY_QUOTES = [
  '"Tu carta natal no dicta tu destino. Lo describe."',
  '"La intuición no es magia. Es patrón reconocido."',
  '"Cada lección completada es un mapa más preciso."',
  '"El autoconocimiento es la brújula que no defrauda."',
  '"Aprender en silencio es también avanzar."',
];

// ── Main Page ──────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [showAllBadges, setShowAllBadges] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth?mode=login'); return; }
      setUser(user);

      const { data: enrollData } = await supabase
        .from('enrollments')
        .select('course_id, status, progress')
        .eq('user_id', user.id);

      const enrollMap = { 'brujula-interior': { enrolled: true, progress: 0 } };
      (enrollData || []).forEach(e => {
        enrollMap[e.course_id] = { enrolled: true, progress: e.progress || 0 };
      });
      setEnrollments(enrollMap);

      try {
        const userStats = await getUserStats(supabase, user.id);
        setStats(userStats);
      } catch (e) {
        setStats(null);
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      </div>
    );
  }

  // ── Data ──
  const totalXp = stats?.totalXp || 0;
  const gameLevelData = getLevelProgress(totalXp);
  const streak = stats?.streak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const earnedBadges = stats?.badges || [];
  const courseProgress = stats?.courseProgress || {};

  const enrolled = COURSES.filter(c => enrollments[c.id]?.enrolled);
  const explore = COURSES.filter(c => !enrollments[c.id]?.enrolled);

  const completedLessons = stats?.completedLessons || [];
  const completedCount = completedLessons.length || 0;

  const userName = (user?.user_metadata?.name || 'Exploradora').split(' ')[0];

  const dailyQuote = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length];

  function getNextLesson(course) {
    const completedIds = new Set(completedLessons.filter(p => p.course_id === course.id).map(p => p.lesson_id));
    return course.lessons.find(l => l.type === 'lesson' && !completedIds.has(l.id)) || course.lessons[0];
  }

  const allBadgeKeys = Object.keys(BADGES);
  const displayBadges = showAllBadges ? allBadgeKeys : allBadgeKeys.slice(0, 9);

  // First enrolled course for the hero CTA
  const primaryCourse = enrolled[0];
  const primaryNextLesson = primaryCourse ? getNextLesson(primaryCourse) : null;
  const primaryProgress = primaryCourse ? (courseProgress[primaryCourse.id]?.percent || 0) : 0;

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar showAuth={false} showDashboardNav />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-selene-border">
        {/* atmospheric bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d18] via-selene-bg to-[#0a0a12] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[340px] h-[340px] rounded-full bg-selene-gold/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-purple-900/[0.04] blur-2xl pointer-events-none" />

        <div className="relative max-w-[840px] mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* Left: greeting + XP ring */}
            <div className="flex items-center gap-5 flex-1">
              <XpRing
                progress={gameLevelData.progress}
                level={gameLevelData}
                xp={totalXp}
                nextLevel={gameLevelData.nextLevel}
              />
              <div>
                <p className="text-[11px] font-semibold text-selene-gold/80 tracking-[0.12em] uppercase mb-1">
                  {gameLevelData.name}
                </p>
                <h1 className="font-display text-[28px] md:text-[32px] font-normal text-selene-white leading-tight mb-1">
                  Hola, {userName} <span className="text-selene-gold text-[22px]">✦</span>
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  {streak > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <FireIcon size={13} className="text-orange-400" />
                      <span className="text-[12px] text-selene-white-dim">
                        {streak} {streak === 1 ? 'día' : 'días'} de racha
                      </span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-selene-white-dim">Empieza tu racha hoy</span>
                  )}
                  {gameLevelData.nextLevel && (
                    <span className="text-[11px] text-selene-white-dim/60">
                      · {gameLevelData.nextLevel.minXp - totalXp} XP para {gameLevelData.nextLevel.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: continue CTA */}
            {primaryCourse && primaryNextLesson && (
              <Link
                href={`/curso/${primaryCourse.id}`}
                className="group flex-shrink-0 bg-[#16161f] border border-selene-border hover:border-selene-gold/30 rounded-2xl p-4 transition-all min-w-[200px] no-underline"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: `${primaryCourse.color}20` }}
                  >
                    {primaryCourse.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-selene-gold/80 tracking-wide uppercase">Continuar</span>
                </div>
                <p className="text-[13px] font-semibold text-selene-white leading-tight mb-2 line-clamp-2">
                  {primaryNextLesson.title}
                </p>
                <div className="flex items-center justify-between">
                  <div className="h-1 flex-1 rounded-full bg-selene-elevated mr-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-selene-gold/70 transition-all"
                      style={{ width: `${Math.round(primaryProgress * 100)}%` }}
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-selene-gold/10 border border-selene-gold/30 flex items-center justify-center group-hover:bg-selene-gold/20 transition-all">
                    <PlayIcon size={11} className="text-selene-gold ml-0.5" />
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Quote */}
          <div className="mt-5 pt-4 border-t border-selene-border/50">
            <p className="text-[12px] text-selene-white-dim/70 italic">{dailyQuote}</p>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[840px] mx-auto px-5 py-7 space-y-8">

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: <BookIcon size={18} className="text-blue-400" />,
              bg: 'bg-blue-500/5 border-blue-500/15',
              label: 'Lecciones',
              value: completedCount,
              sub: 'completadas',
            },
            {
              icon: <ZapIcon size={18} className="text-selene-gold" />,
              bg: 'bg-selene-gold/5 border-selene-gold/20',
              label: 'XP Total',
              value: totalXp.toLocaleString(),
              sub: gameLevelData.name,
            },
            {
              icon: <FireIcon size={18} className="text-orange-400" />,
              bg: streak > 0 ? 'bg-orange-500/5 border-orange-500/20' : 'bg-selene-card border-selene-border',
              label: 'Racha',
              value: streak,
              sub: streak === 1 ? 'día seguido' : streak === 0 ? 'días' : 'días seguidos',
              extra: streak > 0 ? <StreakDots streak={streak} /> : null,
            },
            {
              icon: <TrophyIcon size={18} className="text-purple-400" />,
              bg: earnedBadges.length > 0 ? 'bg-purple-500/5 border-purple-500/15' : 'bg-selene-card border-selene-border',
              label: 'Insignias',
              value: earnedBadges.length,
              sub: `de ${allBadgeKeys.length} disponibles`,
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} border rounded-2xl p-4 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#0a0a12] flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <div className="text-[22px] font-display font-semibold text-selene-white leading-none mb-0.5">{s.value}</div>
              <div className="text-[10px] text-selene-white-dim mb-2">{s.label}</div>
              {s.extra ? s.extra : (
                <div className="text-[10px] text-selene-white-dim/50">{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* ── STREAK MILESTONE ── */}
        {streak > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-[#1a1208] to-[#0e0e14] p-5">
            <div className="absolute -right-4 -top-4 text-[80px] opacity-[0.06] select-none pointer-events-none rotate-12">🔥</div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-xl">🔥</div>
                <div>
                  <div className="text-[14px] font-semibold text-selene-white">
                    {streak >= 30 ? '¡Ciclo lunar completo!' : streak >= 7 ? '¡Una semana sin parar!' : streak >= 3 ? `¡${streak} días de consistencia!` : `¡${streak} ${streak === 1 ? 'día' : 'días'} de racha!`}
                  </div>
                  <div className="text-[11px] text-selene-white-dim mt-0.5">
                    {streak >= 30
                      ? 'La constancia transforma el conocimiento en sabiduría.'
                      : streak >= 7
                      ? 'Siete días. Los patrones se forman en 21. Sigue.'
                      : streak >= 3
                      ? 'La consistencia es la clave del aprendizaje profundo.'
                      : 'Vuelve mañana para mantener el fuego encendido.'}
                    {longestStreak > streak && (
                      <span className="ml-2 text-orange-300/60">Récord: {longestStreak}d</span>
                    )}
                  </div>
                </div>
              </div>
              <StreakDots streak={streak} />
            </div>
          </div>
        )}

        {/* ── MIS CURSOS ── */}
        {enrolled.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[18px] font-normal text-selene-white">Mis cursos</h2>
                <p className="text-[11px] text-selene-white-dim mt-0.5">Retoma donde lo dejaste</p>
              </div>
              <Link href="/catalogo" className="text-[11px] text-selene-gold hover:text-selene-gold/80 transition flex items-center gap-1 no-underline">
                Ver todos <ArrowIcon size={11} />
              </Link>
            </div>

            <div className="space-y-3">
              {enrolled.map(course => {
                const cp = courseProgress[course.id];
                const pct = cp?.percent || 0;
                const nextLesson = getNextLesson(course);
                const lessonsDone = cp?.completed || 0;
                const lessonsTotal = cp?.total || course.lessons.filter(l => l.type === 'lesson').length;

                return (
                  <Link key={course.id} href={`/curso/${course.id}`} className="no-underline group block">
                    <div className="relative overflow-hidden rounded-2xl border border-selene-border hover:border-selene-gold/25 bg-[#0f0f18] transition-all p-5">
                      {/* progress fill bg */}
                      <div
                        className="absolute left-0 top-0 bottom-0 opacity-[0.04] transition-all pointer-events-none"
                        style={{ width: `${Math.round(pct * 100)}%`, background: course.color }}
                      />

                      <div className="relative flex gap-4 items-center">
                        <div
                          className="w-[54px] h-[54px] rounded-[14px] shrink-0 flex items-center justify-center text-[26px] border"
                          style={{ background: `${course.color}15`, borderColor: `${course.color}30` }}
                        >
                          {course.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="text-[15px] font-semibold text-selene-white leading-tight">{course.title}</div>
                            <span
                              className="text-[11px] font-bold shrink-0 tabular-nums"
                              style={{ color: course.color }}
                            >
                              {Math.round(pct * 100)}%
                            </span>
                          </div>

                          <div className="text-[11px] text-selene-white-dim mb-2.5">
                            {lessonsDone}/{lessonsTotal} lecciones · {course.hours}
                          </div>

                          {/* progress bar */}
                          <div className="h-1.5 rounded-full bg-selene-elevated overflow-hidden mb-3">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${Math.round(pct * 100)}%`, background: course.color }}
                            />
                          </div>

                          {nextLesson && (
                            <div className="flex items-center gap-1.5">
                              <PlayIcon size={10} className="text-selene-white-dim shrink-0" />
                              <span className="text-[11px] text-selene-white-dim truncate">
                                Siguiente: {nextLesson.title}
                              </span>
                              <span className="text-[10px] text-selene-white-dim/40 shrink-0">· {nextLesson.duration}</span>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 w-8 h-8 rounded-full border border-selene-border group-hover:border-selene-gold/40 flex items-center justify-center transition-all">
                          <ArrowIcon size={13} className="text-selene-white-dim group-hover:text-selene-gold transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── INSIGNIAS ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-[18px] font-normal text-selene-white">Insignias</h2>
              <p className="text-[11px] text-selene-white-dim mt-0.5">
                {earnedBadges.length > 0
                  ? `${earnedBadges.length} conseguidas · ${allBadgeKeys.length - earnedBadges.length} por desbloquear`
                  : 'Completa lecciones para ganarlas'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {displayBadges.map(badgeId => {
              const badge = BADGES[badgeId];
              const isEarned = earnedBadges.some(b => b.type === badgeId || b === badgeId);
              return (
                <div
                  key={badgeId}
                  className={`relative rounded-2xl p-3 text-center transition-all ${
                    isEarned
                      ? 'bg-gradient-to-b from-[#1a1610] to-[#0f0f18] border border-selene-gold/25 shadow-[0_0_20px_rgba(201,168,76,0.06)]'
                      : 'bg-[#0c0c15] border border-selene-border/50 opacity-40'
                  }`}
                >
                  {isEarned && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-selene-gold/90 flex items-center justify-center">
                      <CheckIcon size={8} className="text-[#0a0a0f] stroke-2" />
                    </div>
                  )}
                  <div className="text-[28px] mb-1.5 leading-none">
                    {isEarned ? badge.icon : <LockIcon size={18} className="text-selene-white-dim mx-auto" />}
                  </div>
                  <div className={`text-[10px] font-semibold leading-tight ${isEarned ? 'text-selene-white' : 'text-selene-white-dim'}`}>
                    {badge.name}
                  </div>
                </div>
              );
            })}
          </div>

          {allBadgeKeys.length > 9 && (
            <button
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="w-full text-center text-[11px] text-selene-gold hover:text-selene-gold/80 mt-3 py-2 transition"
            >
              {showAllBadges ? 'Mostrar menos' : `Ver todas (${allBadgeKeys.length})`}
            </button>
          )}
        </section>

        {/* ── EXPLORAR ── */}
        {explore.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[18px] font-normal text-selene-white">Descubre</h2>
                <p className="text-[11px] text-selene-white-dim mt-0.5">Tu siguiente certificación</p>
              </div>
              <Link href="/catalogo" className="text-[11px] text-selene-gold hover:text-selene-gold/80 transition flex items-center gap-1 no-underline">
                Catálogo completo <ArrowIcon size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {explore.slice(0, 6).map(course => (
                <Link key={course.id} href={`/curso/${course.id}`} className="no-underline group">
                  <div className="relative overflow-hidden rounded-2xl border border-selene-border hover:border-selene-gold/25 bg-[#0f0f18] transition-all p-4">
                    {/* colored edge */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: course.color }} />

                    <div className="flex gap-3 items-start pl-2">
                      <div
                        className="w-[44px] h-[44px] rounded-[12px] shrink-0 flex items-center justify-center text-[22px] border"
                        style={{ background: `${course.color}15`, borderColor: `${course.color}25` }}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <div className="text-[13px] font-semibold text-selene-white leading-tight">{course.title}</div>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{ color: '#0A0A0F', background: course.color }}
                          >
                            {course.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-selene-white-dim mb-2">{course.level} · {course.hours}</div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[13px] font-bold ${course.price === 0 ? 'text-green-400' : 'text-selene-gold'}`}>
                            {course.price_label}
                          </span>
                          <ArrowIcon size={13} className="text-selene-white-dim group-hover:text-selene-gold transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {explore.length > 6 && (
              <Link href="/catalogo" className="no-underline block mt-3 text-center py-3 rounded-2xl border border-selene-border hover:border-selene-gold/30 text-[12px] text-selene-white-dim hover:text-selene-gold transition">
                Ver {explore.length - 6} cursos más →
              </Link>
            )}
          </section>
        )}

        {/* ── FOOTER ── */}
        <div className="text-center py-4">
          <p className="text-[10px] text-selene-white-dim/40">Selena Academia · Ciencia y consciencia de lo invisible</p>
        </div>

      </div>
    </div>
  );
}
