import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/unsubscribe
 * Marks a lead as unsubscribed by setting nurture_step to 999
 * This prevents the nurture cron from sending more emails.
 *
 * Body: { email: string }
 */
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Set nurture_step to 999 (beyond max 5) to stop all nurture emails
    const { error } = await supabase
      .from('leads')
      .update({ nurture_step: 999 })
      .eq('email', normalizedEmail);

    if (error) {
      console.error('Unsubscribe DB error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    console.log(`🚫 Unsubscribed: ${normalizedEmail}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
