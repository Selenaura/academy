import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [
      { data: profiles, error: profilesErr },
      { data: { users: authUsers }, error: authErr },
      { data: enrollments },
    ] = await Promise.all([
      admin.from('profiles')
        .select('id, name, sun_sign, moon_sign, rising_sign, experience_level, xp, streak_days, onboarding_complete, last_active_at, created_at')
        .order('created_at', { ascending: false }),
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin.from('enrollments').select('user_id, course_id, status, progress, enrolled_at'),
    ]);

    if (profilesErr) {
      return NextResponse.json({ error: profilesErr.message }, { status: 500 });
    }

    const emailMap = {};
    if (!authErr && authUsers) {
      authUsers.forEach(u => { emailMap[u.id] = u.email; });
    }

    const enrollmentMap = {};
    if (enrollments) {
      enrollments.forEach(e => {
        if (!enrollmentMap[e.user_id]) enrollmentMap[e.user_id] = [];
        enrollmentMap[e.user_id].push(e);
      });
    }

    const users = profiles.map(p => ({
      ...p,
      email: emailMap[p.id] || '',
      enrollments: enrollmentMap[p.id] || [],
    }));

    return NextResponse.json({ users, total: users.length });
  });
}
