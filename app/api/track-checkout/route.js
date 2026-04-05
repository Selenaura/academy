/**
 * POST /api/track-checkout
 * Records a checkout intent before redirecting to Stripe.
 * Used for cart abandonment recovery emails.
 *
 * ── Supabase migration (run in SQL editor): ──
 *
 * CREATE TABLE checkout_intents (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email TEXT NOT NULL,
 *   course_id TEXT NOT NULL,
 *   course_name TEXT,
 *   course_price INTEGER DEFAULT 0,
 *   recovered BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_checkout_intents_email ON checkout_intents(email);
 * CREATE INDEX idx_checkout_intents_created_at ON checkout_intents(created_at);
 */

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, courseId, courseName, coursePrice } = await request.json();

    if (!email || !courseId) {
      return NextResponse.json(
        { error: 'email and courseId are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('checkout_intents')
      .insert({
        email,
        course_id: courseId,
        course_name: courseName || null,
        course_price: coursePrice || 0,
      });

    if (error) {
      console.error('Track checkout error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    return NextResponse.json({ tracked: true });
  } catch (err) {
    console.error('Track checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
