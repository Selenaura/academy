import { createClient } from '@/lib/supabase-server';
import { sendCertificateEmail } from '@/lib/email';
import { COURSES } from '@/lib/constants';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { courseId, certCode } = await request.json();
    if (!courseId || !certCode) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const course = COURSES.find(c => c.id === courseId);
    if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

    // Get profile name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, surname')
      .eq('id', user.id)
      .single();

    const userName = profile
      ? [profile.name, profile.surname].filter(Boolean).join(' ')
      : user.user_metadata?.name || '';

    const result = await sendCertificateEmail({
      email: user.email,
      userName,
      courseName: course.title,
      courseId,
      certCode,
      courseHours: course.hours,
      courseModules: course.modules,
    });

    return Response.json(result);
  } catch (err) {
    console.error('Certificate email error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
