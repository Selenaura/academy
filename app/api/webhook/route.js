import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use service role for webhook (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { user_id, course_id } = session.metadata;

    if (user_id && course_id) {
      // Create enrollment
      const { error: enrollError } = await supabase
        .from('enrollments')
        .upsert({
          user_id,
          course_id,
          status: 'active',
          enrolled_at: new Date().toISOString(),
          stripe_session_id: session.id,
          amount_paid: session.amount_total,
        });

      if (enrollError) {
        console.error('Enrollment error:', enrollError);
      }

      // Record payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id,
          course_id,
          stripe_session_id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: 'completed',
        });

      if (paymentError) {
        console.error('Payment record error:', paymentError);
      }

      console.log(`✅ Enrolled user ${user_id} in course ${course_id}`);
    }
  }

  return NextResponse.json({ received: true });
}
