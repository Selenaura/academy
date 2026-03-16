import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [
      { data: profiles },
      { data: enrollments },
      { data: payments },
      { data: certificates },
      { data: lessonProgress },
    ] = await Promise.all([
      admin.from('profiles').select('id, xp, onboarding_complete, created_at, last_active_at'),
      admin.from('enrollments').select('id, user_id, course_id, status, progress, enrolled_at, completed_at, amount_paid'),
      admin.from('payments').select('id, amount, currency, status, created_at, course_id'),
      admin.from('certificates').select('id, issued_at'),
      admin.from('lesson_progress').select('id, status, completed_at'),
    ]);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last7d = new Date(now.getTime() - 7 * 86400000);
    const last30d = new Date(now.getTime() - 30 * 86400000);

    const totalUsers = profiles?.length || 0;
    const onboarded = profiles?.filter(p => p.onboarding_complete).length || 0;
    const registeredToday = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
    const registeredThisMonth = profiles?.filter(p => new Date(p.created_at) >= thisMonth).length || 0;
    const activeLastWeek = profiles?.filter(p => p.last_active_at && new Date(p.last_active_at) >= last7d).length || 0;

    const completedPayments = (payments || []).filter(p => p.status === 'completed' || p.status === 'succeeded');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueThisMonth = completedPayments
      .filter(p => new Date(p.created_at) >= thisMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueLastMonth = completedPayments
      .filter(p => new Date(p.created_at) >= lastMonth && new Date(p.created_at) < thisMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalEnrollments = enrollments?.length || 0;
    const activeEnrollments = enrollments?.filter(e => e.status === 'active').length || 0;
    const completedEnrollments = enrollments?.filter(e => e.status === 'completed').length || 0;
    const enrollmentsThisMonth = enrollments?.filter(e => new Date(e.enrolled_at) >= thisMonth).length || 0;

    const totalCertificates = certificates?.length || 0;
    const completedLessons = lessonProgress?.filter(l => l.status === 'completed').length || 0;

    // Revenue by course
    const revenueByCourse = {};
    completedPayments.forEach(p => {
      if (!revenueByCourse[p.course_id]) revenueByCourse[p.course_id] = 0;
      revenueByCourse[p.course_id] += p.amount || 0;
    });

    // Enrollments by course
    const enrollmentsByCourse = {};
    (enrollments || []).forEach(e => {
      if (!enrollmentsByCourse[e.course_id]) enrollmentsByCourse[e.course_id] = { total: 0, active: 0, completed: 0 };
      enrollmentsByCourse[e.course_id].total++;
      if (e.status === 'active') enrollmentsByCourse[e.course_id].active++;
      if (e.status === 'completed') enrollmentsByCourse[e.course_id].completed++;
    });

    // Registration trend (last 30 days)
    const registrationTrend = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 86400000);
      const dayStr = day.toISOString().slice(0, 10);
      const count = (profiles || []).filter(p => p.created_at?.slice(0, 10) === dayStr).length;
      registrationTrend.push({ date: dayStr, count });
    }

    return NextResponse.json({
      users: { total: totalUsers, onboarded, registeredToday, registeredThisMonth, activeLastWeek },
      revenue: { total: totalRevenue, thisMonth: revenueThisMonth, lastMonth: revenueLastMonth, byCourse: revenueByCourse },
      enrollments: { total: totalEnrollments, active: activeEnrollments, completed: completedEnrollments, thisMonth: enrollmentsThisMonth, byCourse: enrollmentsByCourse },
      certificates: { total: totalCertificates },
      lessons: { completed: completedLessons },
      registrationTrend,
    });
  });
}
