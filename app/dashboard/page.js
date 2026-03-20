'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { COURSES, LEVELS, getLevel } from '@/lib/constants';
import { getUserStats, BADGES } from '@/lib/gamification';
import { Navbar, Card, ProgressBar, SectionTitle, BookIcon, CertIcon, StarIcon, ArrowIcon } from '@/components/ui';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showAllBadges, setShowAllBadges] = useState(false);

  // Mock enrollment data (will come from Supabase in production)
  const [enrollments] = useState({
    'brujula-interior': { enrolled: true, progress: 0.35 },
    'magnetismo-consciente': { enrolled: true, progress: 0.12 },
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?mode=login');
        return;
      }
      setUser(user);

      // Load gamification stats
      try {
        const userStats = await getUserStats(supabase, user.id);
        setStats(userStats);
      } catch (e) {
        console.error('Error loading stats:', e);
        // Fallback stats when tables don't exist yet
        setStats(null);
      }

      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Use real stats or fallback
  const totalXp = stats?.totalXp || 0;
  const level = stats?.level || getLevel(0);
  const streak = stats?.streak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const earnedBadgeIds = stats?.badges || [];
  const courseProgress = stats?.courseProgress || {};
  const completedCount = stats?.completedLessons?.length || 0;

  // Level progress bar calculation
  const nextLevel = LEVELS.find(l => l.minXp > totalXp) || LEVELS[LEVELS.length - 1];
  const levelProgress = nextLevel.minXp === Infinity
    ? 1
    : (totalXp - level.minXp) / (nextLevel.minXp - level.minXp);

  const userName = user?.user_metadata?.name || 'Exploradora';

  // Enrolled and explore courses
  const enrolled = COURSES.filter(c => enrollments[c.id]?.enrolled);
  const explore = COURSES.filter(c => !enrollments[c.id]?.enrolled);

  // Find the "continue where you left off" lesson
  function getNextLesson(course) {
    const cp = courseProgress[course.id];
    if (!cp || !cp.lastLesson) {
      return course.lessons[0] || null;
    }
    const completedIds = new Set(
      (stats?.completedLessons || [])
        .filter(p => p.course_id === course.id)
        .map(p => p.lesson_id)
    );
    const next = course.lessons.find(l => !completedIds.has(l.id));
    return next || course.lessons[course.lessons.length - 1];
  }

  // Badge display
  const allBadgeKeys = Object.keys(BADGES);
  const displayBadges = showAllBadges ? allBadgeKeys : allBadgeKeys.slice(0, 6);

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar showAuth={false} showDashboardNav />

      <div className="max-w-[800px] mx-auto px-5 py-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-[26px] font-normal mb-1.5">
            Hola, {userName} <span className="text-xl">✦</span>
          </h1>
          <p className="text-[13px] text-selene-white-dim">
            {streak > 0
              ? <>🔥 Racha de {streak} {streak === 1 ? 'día' : 'días'} · {level.name}</>
              : <>{level.name} · ¡Empieza tu racha hoy!</>
            }
          </p>
        </div>

        {/* XP Progress Card */}
        <Card className="p-5 mb-6 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-[64px] opacity-[0.04] select-none pointer-events-none">
            {totalXp >= 10000 ? '👑' : totalXp >= 5000 ? '🌙' : totalXp >= 2000 ? '⭐' : totalXp >= 500 ? '🚀' : '🌱'}
          </div>
          <div className="flex justify-between items-start mb-1 relative z-10">
            <div>
              <span className="text-xs font-semibold text-selene-gold">{level.name}</span>
              {nextLevel.minXp !== Infinity && (
                <span className="text-[11px] text-selene-white-dim ml-2">
                  → {nextLevel.name}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-selene-gold">{totalXp.toLocaleString()} XP</span>
          </div>
          <ProgressBar value={levelProgress} height={8} className="mb-2" />
          <div className="flex justify-between text-[11px] text-selene-white-dim">
            <span>{level.minXp.toLocaleString()} XP</span>
            <span>{nextLevel.minXp === Infinity ? '∞' : nextLevel.minXp.toLocaleString()} XP</span>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: <BookIcon size={18} />, label: 'Lecciones', value: completedCount },
            { icon: <CertIcon size={18} />, label: 'Cursos activos', value: enrolled.length },
            { icon: <span className="text-lg">🔥</span>, label: 'Racha', value: `${streak}d` },
            { icon: <span className="text-lg">🏆</span>, label: 'Insignias', value: earnedBadgeIds.length },
          ].map((s, i) => (
            <Card key={i} className="p-3.5 text-center">
              <div className="flex justify-center mb-1.5">{s.icon}</div>
              <div className="text-lg font-semibold text-selene-white font-display">{s.value}</div>
              <div className="text-[10px] text-selene-white-dim mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Streak Card */}
        {streak > 0 && (
          <Card className="p-5 mb-6 border-selene-gold/20 bg-gradient-to-r from-selene-card to-selene-gold/5">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔥</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-selene-white mb-0.5">
                  ¡{streak} {streak === 1 ? 'día' : 'días'} de racha!
                </div>
                <p className="text-[12px] text-selene-white-dim" style={{ textAlign: 'justify' }}>
                  {streak >= 30
                    ? 'Un ciclo lunar completo aprendiendo sin parar. Tu dedicación es inspiradora.'
                    : streak >= 7
                    ? 'Llevas una semana entera sin fallar. ¡Sigue así para desbloquear la insignia lunar!'
                    : streak >= 3
                    ? '¡Tres días seguidos! La consistencia es la clave del aprendizaje profundo.'
                    : '¡Buen comienzo! Vuelve mañana para mantener tu racha.'}
                </p>
                {longestStreak > streak && (
                  <div className="text-[11px] text-selene-white-dim mt-1">
                    Tu récord: {longestStreak} días
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-selene-gold" />
                ))}
                {streak < 7 && Array.from({ length: 7 - Math.min(streak, 7) }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-selene-elevated border border-selene-border" />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Badge Showcase */}
        <div className="mb-8">
          <SectionTitle subtitle="Colecciona insignias completando retos">Insignias</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {displayBadges.map(badgeId => {
              const badge = BADGES[badgeId];
              const isEarned = earnedBadgeIds.includes(badgeId);
              return (
                <Card
                  key={badgeId}
                  className={`p-4 text-center transition-all ${
                    isEarned
                      ? 'border-selene-gold/30 bg-gradient-to-b from-selene-card to-selene-gold/5'
                      : 'opacity-40 grayscale'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${isEarned ? '' : 'filter grayscale'}`}>
                    {isEarned ? badge.icon : '🔒'}
                  </div>
                  <div className={`text-[12px] font-semibold mb-0.5 ${isEarned ? 'text-selene-white' : 'text-selene-white-dim'}`}>
                    {badge.name}
                  </div>
                  <div className="text-[10px] text-selene-white-dim leading-tight">
                    {badge.description}
                  </div>
                </Card>
              );
            })}
          </div>
          {allBadgeKeys.length > 6 && (
            <button
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="w-full text-center text-xs text-selene-gold mt-3 hover:text-selene-gold/80 transition"
            >
              {showAllBadges ? 'Mostrar menos' : `Ver todas las insignias (${allBadgeKeys.length})`}
            </button>
          )}
        </div>

        {/* Continue Where You Left Off */}
        {enrolled.length > 0 && (
          <div className="mb-8">
            <SectionTitle subtitle="Retoma tu aprendizaje donde lo dejaste">Continúa aprendiendo</SectionTitle>
            {enrolled.map(course => {
              const enrollment = enrollments[course.id];
              const realProgress = courseProgress[course.id]?.percent;
              const displayProgress = realProgress ?? enrollment.progress;
              const nextLesson = getNextLesson(course);
              const xpForCourse = (stats?.completedLessons || [])
                .filter(p => p.course_id === course.id)
                .reduce((sum, p) => sum + (p.xp_earned || 0), 0);

              return (
                <Link key={course.id} href={`/curso/${course.id}`} className="no-underline block mb-3">
                  <Card hover className="p-5">
                    <div className="flex gap-4 items-start">
                      <div
                        className="w-[52px] h-[52px] rounded-[14px] shrink-0 flex items-center justify-center text-2xl border"
                        style={{ background: `${course.color}18`, borderColor: `${course.color}30` }}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[15px] font-semibold text-selene-white mb-0.5">{course.title}</div>
                            <div className="text-xs text-selene-white-dim">{course.subtitle}</div>
                          </div>
                          <span className="text-[13px] text-selene-gold font-semibold shrink-0 ml-3">
                            {Math.round(displayProgress * 100)}%
                          </span>
                        </div>
                        <ProgressBar value={displayProgress} color={course.color} className="mt-3" />
                        <div className="flex justify-between items-center mt-2">
                          {nextLesson && (
                            <div className="text-[11px] text-selene-white-dim">
                              Siguiente: {nextLesson.title}
                            </div>
                          )}
                          {xpForCourse > 0 && (
                            <div className="text-[11px] text-selene-gold font-semibold">
                              +{xpForCourse} XP
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Explore Courses */}
        <div>
          <SectionTitle subtitle="Descubre tu siguiente paso">Explora cursos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explore.map(course => (
              <Link key={course.id} href={`/curso/${course.id}`} className="no-underline">
                <Card hover className="p-[18px]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[28px]">{course.icon}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide"
                      style={{ color: '#0A0A0F', background: course.color }}
                    >
                      {course.tag}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-selene-white mb-1 leading-tight">{course.title}</div>
                  <div className="text-[11px] text-selene-white-dim mb-2.5">{course.level} · {course.hours}</div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${course.price === 0 ? 'text-selene-success' : 'text-selene-gold'}`}>
                      {course.price_label}
                    </span>
                    <ArrowIcon size={14} className="text-selene-white-dim" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
