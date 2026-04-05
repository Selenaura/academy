export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ enrolled: false, progress: 0 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 });
    }

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('status, progress')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (enrollment && enrollment.status === 'active') {
      return NextResponse.json({ enrolled: true, progress: enrollment.progress || 0 });
    }

    return NextResponse.json({ enrolled: false, progress: 0 });
  } catch (error) {
    console.error('Enrollment check error:', error);
    return NextResponse.json({ enrolled: false, progress: 0 });
  }
}
