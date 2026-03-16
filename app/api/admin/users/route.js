import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = ['irenellorettrillo@gmail.com'];

export async function GET(request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  // Use service role to read all profiles
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: profiles, error: profilesErr } = await admin
    .from('profiles')
    .select('id, name, sun_sign, experience_level, xp, streak_days, onboarding_complete, created_at')
    .order('created_at', { ascending: false });

  if (profilesErr) {
    return NextResponse.json({ error: profilesErr.message }, { status: 500 });
  }

  // Get auth users for emails
  const { data: { users: authUsers }, error: authErr } = await admin.auth.admin.listUsers({ perPage: 1000 });

  const emailMap = {};
  if (!authErr && authUsers) {
    authUsers.forEach(u => { emailMap[u.id] = u.email; });
  }

  // Get enrollments count per user
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('user_id, course_id, status, enrolled_at');

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
}
