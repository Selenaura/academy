import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [profilesRes, enrollmentsRes, paymentsRes, certificatesRes, lessonProgressRes] = await Promise.all([
      admin.from('profiles').select('id, xp, onboarding_complete, created_at, last_active_at'),
      admin.from('enrollments').select('id, user_id, course_id, status, progress, enrolled_at, completed_at, amount_paid'),
      admin.from('payments').select('id, amount, currency, status, created_at, course_id'),
      admin.from('certificates').select('id, issued_at'),
      admin.from('lesson_progress').select('id, status, completed_at'),
    ]);

    if (profilesRes.error) return NextResponse.json({ error: profilesRes.error.message }, { status: 500 });

    const profiles = profilesRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const payments = paymentsRes.data || [];
    const certificates = certificatesRes.data || [];
    const lessonProgress = lessonProgressRes.data || [];

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = todayStr.slice(0, 7);
    const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);
    const last7dStr = new Date(now.getTime() - 7 * 86400000).toISOString();

    const totalUsers = profiles.length;
    const onboarded = profiles.filter(p => p.onboarding_complete).length;
    const registeredToday = profiles.filter(p => p.created_at?.slice(0, 10) === todayStr).length;
    const registeredThisMonth = profiles.filter(p => p.created_at?.slice(0, 7) === thisMonthStr).length;
    const activeLastWeek = profiles.filter(p => p.last_active_at && p.last_active_at >= last7dStr).length;

    // Users with at least one enrollment
    const usersWithCourses = new Set(enrollments.map(e => e.user_id)).size;

    const completedPayments = payments.filter(p => p.status === 'completed' || p.status === 'succeeded');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueThisMonth = completedPayments
      .filter(p => p.created_at?.slice(0, 7) === thisMonthStr)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueLastMonth = completedPayments
      .filter(p => p.created_at?.slice(0, 7) === lastMonthStr)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
    const enrollmentsThisMonth = enrollments.filter(e => e.enrolled_at?.slice(0, 7) === thisMonthStr).length;

    const totalCertificates = certificates.length;
    const completedLessons = lessonProgress.filter(l => l.status === 'completed').length;

    // Revenue by course
    const revenueByCourse = {};
    completedPayments.forEach(p => {
      if (!revenueByCourse[p.course_id]) revenueByCourse[p.course_id] = 0;
      revenueByCourse[p.course_id] += p.amount || 0;
    });

    // Enrollments by course
    const enrollmentsByCourse = {};
    enrollments.forEach(e => {
      if (!enrollmentsByCourse[e.course_id]) enrollmentsByCourse[e.course_id] = { total: 0, active: 0, completed: 0 };
      enrollmentsByCourse[e.course_id].total++;
      if (e.status === 'active') enrollmentsByCourse[e.course_id].active++;
      if (e.status === 'completed') enrollmentsByCourse[e.course_id].completed++;
    });

    // Registration trend (last 30 days) — single pass O(n)
    const dayCountMap = {};
    profiles.forEach(p => {
      const day = p.created_at?.slice(0, 10);
      if (day) dayCountMap[day] = (dayCountMap[day] || 0) + 1;
    });
    const registrationTrend = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      registrationTrend.push({ date: dayStr, count: dayCountMap[dayStr] || 0 });
    }

    return NextResponse.json({
      users: { total: totalUsers, onboarded, registeredToday, registeredThisMonth, activeLastWeek, withCourses: usersWithCourses },
      revenue: { total: totalRevenue, thisMonth: revenueThisMonth, lastMonth: revenueLastMonth, byCourse: revenueByCourse },
      enrollments: { total: totalEnrollments, active: activeEnrollments, completed: completedEnrollments, thisMonth: enrollmentsThisMonth, byCourse: enrollmentsByCourse },
      certificates: { total: totalCertificates },
      lessons: { completed: completedLessons },
      registrationTrend,
    });
  });
}
