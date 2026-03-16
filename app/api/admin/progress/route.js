import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [
      { data: lessonProgress, error: lpErr },
      { data: quizAttempts, error: qaErr },
    ] = await Promise.all([
      admin.from('lesson_progress')
        .select('id, user_id, course_id, lesson_id, status, completed_at, time_spent_seconds'),
      admin.from('quiz_attempts')
        .select('id, user_id, course_id, lesson_id, score, passed, attempted_at')
        .order('attempted_at', { ascending: false }),
    ]);

    if (lpErr) return NextResponse.json({ error: lpErr.message }, { status: 500 });
    if (qaErr) return NextResponse.json({ error: qaErr.message }, { status: 500 });

    // Lesson stats by course
    const lessonsByCourse = {};
    (lessonProgress || []).forEach(lp => {
      if (!lessonsByCourse[lp.course_id]) lessonsByCourse[lp.course_id] = { completed: 0, inProgress: 0, totalTime: 0 };
      if (lp.status === 'completed') lessonsByCourse[lp.course_id].completed++;
      if (lp.status === 'in_progress') lessonsByCourse[lp.course_id].inProgress++;
      lessonsByCourse[lp.course_id].totalTime += lp.time_spent_seconds || 0;
    });

    // Quiz stats by course
    const quizzesByCourse = {};
    (quizAttempts || []).forEach(qa => {
      if (!quizzesByCourse[qa.course_id]) quizzesByCourse[qa.course_id] = { attempts: 0, passed: 0, totalScore: 0 };
      quizzesByCourse[qa.course_id].attempts++;
      if (qa.passed) quizzesByCourse[qa.course_id].passed++;
      quizzesByCourse[qa.course_id].totalScore += qa.score || 0;
    });

    // Average scores
    Object.keys(quizzesByCourse).forEach(k => {
      const q = quizzesByCourse[k];
      q.avgScore = q.attempts > 0 ? q.totalScore / q.attempts : 0;
      q.passRate = q.attempts > 0 ? q.passed / q.attempts : 0;
    });

    // Quiz stats by lesson (for detailed view)
    const quizzesByLesson = {};
    (quizAttempts || []).forEach(qa => {
      if (!quizzesByLesson[qa.lesson_id]) quizzesByLesson[qa.lesson_id] = { attempts: 0, passed: 0, totalScore: 0 };
      quizzesByLesson[qa.lesson_id].attempts++;
      if (qa.passed) quizzesByLesson[qa.lesson_id].passed++;
      quizzesByLesson[qa.lesson_id].totalScore += qa.score || 0;
    });

    Object.keys(quizzesByLesson).forEach(k => {
      const q = quizzesByLesson[k];
      q.avgScore = q.attempts > 0 ? q.totalScore / q.attempts : 0;
      q.passRate = q.attempts > 0 ? q.passed / q.attempts : 0;
    });

    return NextResponse.json({
      lessons: { byCourse: lessonsByCourse, total: lessonProgress?.length || 0 },
      quizzes: { byCourse: quizzesByCourse, byLesson: quizzesByLesson, totalAttempts: quizAttempts?.length || 0 },
    });
  });
}
