import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { COURSES } from '@/lib/constants';
import { sendWelcomeEmail, sendInstallmentEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use service role for webhook (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function enrollUser(user_id, course_id, stripe_session_id, amount) {
  const { error: enrollError } = await supabase
    .from('enrollments')
    .upsert({
      user_id,
      course_id,
      status: 'active',
      enrolled_at: new Date().toISOString(),
      stripe_session_id,
      amount_paid: amount,
    });

  if (enrollError) console.error('Enrollment error:', enrollError);

  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id,
      course_id,
      stripe_session_id,
      amount,
      currency: 'eur',
      status: 'completed',
    });

  if (paymentError) console.error('Payment record error:', paymentError);

  console.log(`✅ Enrolled user ${user_id} in course ${course_id}`);
}

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

  // ── Single payment (card or Klarna) ──
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { user_id, course_id } = session.metadata || {};

    // Only handle 'payment' mode here — subscriptions are handled in invoice.paid
    if (user_id && course_id && session.mode === 'payment') {
      await enrollUser(user_id, course_id, session.id, session.amount_total);

      // Send welcome email
      const course = COURSES.find(c => c.id === course_id);
      if (course && session.customer_email) {
        await sendWelcomeEmail({
          email: session.customer_email,
          courseName: course.title,
          courseId: course_id,
          userName: session.customer_details?.name || null,
        });
      }
    }
  }

  // ── Installment plan: track payments and auto-cancel after N cycles ──
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return NextResponse.json({ received: true });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const { user_id, course_id, max_cycles } = subscription.metadata || {};
    if (!user_id || !course_id || !max_cycles) return NextResponse.json({ received: true });

    const maxCycles = parseInt(max_cycles, 10);
    const paidCount = subscription.metadata?.paid_cycles
      ? parseInt(subscription.metadata.paid_cycles, 10) + 1
      : 1;

    // Update paid_cycles counter
    await stripe.subscriptions.update(subscriptionId, {
      metadata: { ...subscription.metadata, paid_cycles: String(paidCount) },
    });

    // First installment: enroll the user + send welcome email
    if (paidCount === 1) {
      await enrollUser(user_id, course_id, subscriptionId, invoice.amount_paid);

      const course = COURSES.find(c => c.id === course_id);
      const customerEmail = invoice.customer_email;
      if (course && customerEmail) {
        await sendWelcomeEmail({
          email: customerEmail,
          courseName: course.title,
          courseId: course_id,
          userName: null,
        });
      }
    } else {
      // Send installment confirmation for subsequent payments
      const course = COURSES.find(c => c.id === course_id);
      const customerEmail = invoice.customer_email;
      if (course && customerEmail) {
        await sendInstallmentEmail({
          email: customerEmail,
          courseName: course.title,
          installmentNumber: paidCount,
          totalInstallments: maxCycles,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        });
      }
    }

    // Record this installment payment
    await supabase.from('payments').insert({
      user_id,
      course_id,
      stripe_session_id: subscriptionId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'completed',
      installment_number: paidCount,
      installments_total: maxCycles,
    });

    // Cancel subscription when all installments paid
    if (paidCount >= maxCycles) {
      await stripe.subscriptions.cancel(subscriptionId);
      console.log(`✅ Installment plan complete for ${user_id} / ${course_id} (${maxCycles} payments)`);
    }
  }

  return NextResponse.json({ received: true });
}
