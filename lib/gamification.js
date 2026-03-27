// ═══════════════════════════════════════════════
// SELENE ACADEMIA — Gamification Engine
// ═══════════════════════════════════════════════

import { COURSES } from './constants';

// ── XP Rewards ──
export const XP_REWARDS = {
  lesson_complete: 25,
  quiz_pass: 50,
  quiz_perfect: 100,
  exam_pass: 150,
  module_complete: 100,
  course_complete: 500,
  streak_day: 10,
};

// ── Level system ──
export const LEVELS = [
  { level: 1, name: 'Semilla', minXp: 0, icon: '🌱' },
  { level: 2, name: 'Brote', minXp: 100, icon: '🌿' },
  { level: 3, name: 'Raíz', minXp: 400, icon: '🌳' },
  { level: 4, name: 'Flor', minXp: 900, icon: '🌸' },
  { level: 5, name: 'Fruto', minXp: 1600, icon: '🍎' },
  { level: 6, name: 'Estrella', minXp: 2500, icon: '⭐' },
  { level: 7, name: 'Luna', minXp: 3600, icon: '🌙' },
  { level: 8, name: 'Sol', minXp: 4900, icon: '☀️' },
  { level: 9, name: 'Cosmos', minXp: 6400, icon: '🌌' },
  { level: 10, name: 'Infinito', minXp: 8100, icon: '✦' },
];

export function getLevel(xp) {
  return LEVELS.reduce((acc, l) => xp >= l.minXp ? l : acc, LEVELS[0]);
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = LEVELS.find(l => l.minXp > xp) || null;
  return {
    ...current,
    xp,
    nextLevel: next,
    progress: next ? (xp - current.minXp) / (next.minXp - current.minXp) : 1,
  };
}

// ── Badge Definitions ──
export const BADGES = {
  'first-lesson': {
    id: 'first-lesson',
    name: 'Primera Lección',
    description: 'Completaste tu primera lección',
    icon: '🌱',
  },
  'first-quiz': {
    id: 'first-quiz',
    name: 'Primera Prueba',
    description: 'Aprobaste tu primer quiz',
    icon: '📝',
  },
  'streak-3': {
    id: 'streak-3',
    name: 'Racha de 3 días',
    description: '3 días seguidos aprendiendo',
    icon: '🔥',
  },
  'streak-7': {
    id: 'streak-7',
    name: 'Semana Imparable',
    description: '7 días seguidos aprendiendo',
    icon: '⚡',
  },
  'streak-30': {
    id: 'streak-30',
    name: 'Maestría Lunar',
    description: '30 días seguidos — un ciclo lunar completo',
    icon: '🌕',
  },
  'course-complete': {
    id: 'course-complete',
    name: 'Curso Completado',
    description: 'Completaste un curso entero',
    icon: '🎓',
  },
  'perfect-quiz': {
    id: 'perfect-quiz',
    name: 'Perfección',
    description: '100% en un quiz',
    icon: '💎',
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Lección completada después de las 22h',
    icon: '🦉',
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Madrugadora Estelar',
    description: 'Lección completada antes de las 7h',
    icon: '🌅',
  },
};

/**
 * Record a lesson completion, award XP, update streak, and check badges.
 * Uses real tables: lesson_progress, profiles, user_badges
 */
export async function recordLessonComplete(supabase, userId, courseId, lessonId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return null;

  const lesson = course.lessons?.find(l => l.id === lessonId);
  let xp = XP_REWARDS.lesson_complete;
  if (lesson?.type === 'quiz') xp = XP_REWARDS.quiz_pass;
  if (lesson?.type === 'exam') xp = XP_REWARDS.exam_pass;

  // Upsert lesson_progress
  await supabase
    .from('lesson_progress')
    .upsert(
      { user_id: userId, course_id: courseId, lesson_id: lessonId, status: 'completed', completed_at: new Date().toISOString() },
      { onConflict: 'user_id,course_id,lesson_id', ignoreDuplicates: true }
    );

  // Add XP via DB function (handles level up)
  const { data: xpResult } = await supabase.rpc('add_xp', { p_user_id: userId, p_amount: xp });

  // Streak is updated by DB trigger automatically

  // Check for new badges
  const newBadges = await checkBadges(supabase, userId);

  return { xp, xpResult, newBadges };
}

// Streak is now handled by DB trigger on lesson_progress
// No need for updateStreak function — the trigger fires on INSERT/UPDATE

/**
 * Check and award any new badges the user has earned.
 * Returns an array of newly earned badge IDs.
 */
export async function checkBadges(supabase, userId) {
  const [
    { data: progress },
    { data: profile },
    { data: existingBadges },
    { data: quizzes },
  ] = await Promise.all([
    supabase.from('lesson_progress').select('*').eq('user_id', userId).eq('status', 'completed'),
    supabase.from('profiles').select('streak_days, xp').eq('id', userId).single(),
    supabase.from('user_badges').select('badge_type').eq('user_id', userId),
    supabase.from('quiz_attempts').select('*').eq('user_id', userId),
  ]);

  const earned = new Set((existingBadges || []).map(b => b.badge_type));
  const newBadges = [];

  function award(type) {
    if (!earned.has(type)) {
      const badge = BADGES[type];
      if (badge) {
        newBadges.push(type);
        earned.add(type);
      }
    }
  }

  const completed = progress || [];
  const streak = profile?.streak_days || 0;
  const xp = profile?.xp || 0;
  const passedQuizzes = (quizzes || []).filter(q => q.passed);

  if (completed.length >= 1) award('first-lesson');
  if (passedQuizzes.length >= 1) award('first-quiz');
  if (streak >= 3) award('streak-3');
  if (streak >= 7) award('streak-7');
  if (streak >= 30) award('streak-30');
  if (passedQuizzes.some(q => q.score >= 1.0)) award('perfect-quiz');
  if (xp >= 500) award('xp-500');
  if (xp >= 1000) award('xp-1000');

  // Course complete check
  for (const course of COURSES) {
    if (!course.lessons || course.lessons.length === 0) continue;
    const lessonIds = new Set(course.lessons.filter(l => l.type === 'lesson').map(l => l.id));
    const done = completed.filter(p => p.course_id === course.id).map(p => p.lesson_id);
    if ([...lessonIds].every(id => done.includes(id))) {
      award('course-complete');
      break;
    }
  }

  // Time-based badges
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 4) award('night-owl');
  if (hour >= 4 && hour < 7) award('early-bird');

  // Insert new badges
  if (newBadges.length > 0) {
    await supabase.from('user_badges').insert(
      newBadges.map(badge_type => ({
        user_id: userId,
        badge_type,
        badge_name: BADGES[badge_type].name,
        badge_icon: BADGES[badge_type].icon,
      }))
    );
  }

  return newBadges;
}

/**
 * Get full user stats for the dashboard.
 */
export async function getUserStats(supabase, userId) {
  const [
    { data: profile },
    { data: badges },
    { data: progress },
  ] = await Promise.all([
    supabase.from('profiles').select('xp, streak_days, longest_streak, level').eq('id', userId).single(),
    supabase.from('user_badges').select('*').eq('user_id', userId),
    supabase.from('lesson_progress').select('*').eq('user_id', userId).eq('status', 'completed'),
  ]);

  const totalXp = profile?.xp || 0;
  const level = getLevelProgress(totalXp);
  const streak = profile?.streak_days || 0;
  const longestStreak = profile?.longest_streak || 0;
  const earnedBadges = (badges || []).map(b => ({
    type: b.badge_type,
    name: b.badge_name,
    icon: b.badge_icon,
    earnedAt: b.earned_at,
  }));
  const completedLessons = progress || [];

  const courseProgress = {};
  for (const course of COURSES) {
    if (!course.lessons || course.lessons.length === 0) continue;
    const lessons = course.lessons.filter(l => l.type === 'lesson');
    const done = completedLessons.filter(p => p.course_id === course.id);
    courseProgress[course.id] = {
      completed: done.length,
      total: lessons.length,
      percent: lessons.length > 0 ? done.length / lessons.length : 0,
    };
  }

  return { totalXp, level, streak, longestStreak, badges: earnedBadges, courseProgress };
}
