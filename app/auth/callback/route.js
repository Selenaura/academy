export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user needs onboarding
      const { data: { user } } = await supabase.auth.getUser();
      const onboardingComplete = user?.user_metadata?.onboarding_complete;

      if (!onboardingComplete) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/auth?mode=login&error=auth_failed`);
}
