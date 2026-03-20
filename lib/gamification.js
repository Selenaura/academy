// ═══════════════════════════════════════════════
// SELENE ACADEMIA — Gamification Engine
// ═══════════════════════════════════════════════

import { COURSES, LEVELS, XP_REWARDS, getLevel } from './constants';

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
 */
export async function recordLessonComplete(supabase, userId, courseId, lessonId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return null;

  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson) return null;

  // Determine XP based on lesson type
  let xp = XP_REWARDS.lesson_complete;
  if (lesson.type === 'quiz') xp = XP_REWARDS.quiz_pass;
  if (lesson.type === 'exam') xp = XP_REWARDS.exam_pass;

  // Insert progress (upsert — ignore if already completed)
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert(
      { user_id: userId, course_id: courseId, lesson_id: lessonId, xp_earned: xp },
      { onConflict: 'user_id,course_id,lesson_id', ignoreDuplicates: true }
    );

  if (progressError) {
    console.error('Error recording progress:', progressError);
    return null;
  }

  // Update streak and total XP
  await updateStreak(supabase, userId, xp);

  // Check for new badges
  const newBadges = await checkBadges(supabase, userId);

  return { xp, newBadges };
}

/**
 * Update the user's daily streak and total XP.
 */
export async function updateStreak(supabase, userId, xpToAdd = 0) {
  const today = new Date().toISOString().split('T')[0];

  // Get current streak record
  const { data: existing } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existing) {
    // First ever activity — create streak record
    const level = getLevel(xpToAdd);
    await supabase.from('user_streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
      total_xp: xpToAdd,
      level: level.name,
    });
    return;
  }

  const lastDate = existing.last_activity_date;
  let newStreak = existing.current_streak;

  if (lastDate === today) {
    // Already active today — just add XP
    newStreak = existing.current_streak;
  } else {
    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      newStreak = existing.current_streak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const newTotalXp = existing.total_xp + xpToAdd;
  const newLevel = getLevel(newTotalXp);
  const newLongest = Math.max(existing.longest_streak, newStreak);

  // Add streak bonus XP
  const streakBonus = lastDate !== today ? XP_REWARDS.streak_day : 0;
  const finalXp = newTotalXp + streakBonus;

  await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
      total_xp: finalXp,
      level: getLevel(finalXp).name,
    })
    .eq('user_id', userId);
}

/**
 * Check and award any new badges the user has earned.
 * Returns an array of newly earned badge IDs.
 */
export async function checkBadges(supabase, userId) {
  // Get current data
  const [
    { data: progress },
    { data: streakData },
    { data: existingBadges },
    { data: quizzes },
  ] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', userId),
    supabase.from('user_streaks').select('*').eq('user_id', userId).single(),
    supabase.from('user_badges').select('badge_id').eq('user_id', userId),
    supabase.from('quiz_results').select('*').eq('user_id', userId),
  ]);

  const earned = new Set((existingBadges || []).map(b => b.badge_id));
  const newBadges = [];

  function award(badgeId) {
    if (!earned.has(badgeId)) {
      newBadges.push(badgeId);
      earned.add(badgeId);
    }
  }

  const completedLessons = progress || [];
  const streak = streakData?.current_streak || 0;
  const passedQuizzes = (quizzes || []).filter(q => q.passed);

  // first-lesson: at least 1 completed lesson
  if (completedLessons.length >= 1) award('first-lesson');

  // first-quiz: at least 1 passed quiz
  if (passedQuizzes.length >= 1) award('first-quiz');

  // Streak badges
  if (streak >= 3) award('streak-3');
  if (streak >= 7) award('streak-7');
  if (streak >= 30) award('streak-30');

  // course-complete: check if any course has all lessons completed
  for (const course of COURSES) {
    if (course.lessons.length === 0) continue;
    const courseLessons = new Set(course.lessons.map(l => l.id));
    const completed = completedLessons.filter(p => p.course_id === course.id).map(p => p.lesson_id);
    const allDone = [...courseLessons].every(id => completed.includes(id));
    if (allDone) {
      award('course-complete');
      break;
    }
  }

  // perfect-quiz: 100% on any quiz
  if (passedQuizzes.some(q => q.score === 100)) award('perfect-quiz');

  // Time-based badges — check the hour of the latest progress entry
  if (completedLessons.length > 0) {
    const latestTime = new Date(completedLessons[completedLessons.length - 1].completed_at);
    const hour = latestTime.getHours();
    if (hour >= 22 || hour < 4) award('night-owl');
    if (hour >= 4 && hour < 7) award('early-bird');
  }

  // Insert new badges
  if (newBadges.length > 0) {
    await supabase.from('user_badges').insert(
      newBadges.map(badge_id => ({ user_id: userId, badge_id }))
    );
  }

  return newBadges;
}

/**
 * Get full user stats for the dashboard.
 */
export async function getUserStats(supabase, userId) {
  const [
    { data: streakData },
    { data: badges },
    { data: progress },
  ] = await Promise.all([
    supabase.from('user_streaks').select('*').eq('user_id', userId).single(),
    supabase.from('user_badges').select('*').eq('user_id', userId),
    supabase.from('user_progress').select('*').eq('user_id', userId),
  ]);

  const totalXp = streakData?.total_xp || 0;
  const level = getLevel(totalXp);
  const streak = streakData?.current_streak || 0;
  const longestStreak = streakData?.longest_streak || 0;
  const earnedBadges = (badges || []).map(b => b.badge_id);
  const completedLessons = progress || [];

  // Calculate per-course progress
  const courseProgress = {};
  for (const course of COURSES) {
    if (course.lessons.length === 0) continue;
    const completed = completedLessons.filter(p => p.course_id === course.id);
    courseProgress[course.id] = {
      completed: completed.length,
      total: course.lessons.length,
      percent: completed.length / course.lessons.length,
      lastLesson: completed.length > 0
        ? completed.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0]
        : null,
    };
  }

  return {
    totalXp,
    level,
    streak,
    longestStreak,
    badges: earnedBadges,
    completedLessons,
    courseProgress,
  };
}
