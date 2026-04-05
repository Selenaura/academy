export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { COURSES } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Installment price per installment count (price in cents, returns cents per installment)
function installmentAmount(totalCents, count) {
  return Math.ceil(totalCents / count);
}

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { courseId, installments } = await request.json();
    const course = COURSES.find(c => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    // Check if user is already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      // Already enrolled — just redirect to course
      return NextResponse.json({ enrolled: true });
    }

    if (course.price === 0) {
      // Free course — enroll directly
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString(),
        });

      if (error) throw error;
      return NextResponse.json({ enrolled: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (installments && installments > 1) {
      // Installment plan: create a subscription with N payments then cancel
      // Use fixed installment price from course config if available, otherwise divide evenly
      const amountPerInstallment = course.installment_price || installmentAmount(course.price, installments);

      // Reuse existing product/price if course has fixed installment config, otherwise create on-the-fly
      let priceId;
      if (course.installment_price && course.installments === installments) {
        // Use the pre-configured recurring price for this course
        const existingPrice = await stripe.prices.list({
          product: course.stripe_price_id ? undefined : undefined,
          active: true,
          type: 'recurring',
          limit: 10,
        });
        // Create a recurring price for the installment amount
        const price = await stripe.prices.create({
          product: 'prod_UEU1iWoYfaIrTD',
          unit_amount: amountPerInstallment,
          currency: 'eur',
          recurring: { interval: 'month', interval_count: 1 },
          lookup_key: `${courseId}_installment_${installments}`,
        });
        priceId = price.id;
      } else {
        const product = await stripe.products.create({
          name: `${course.title} — ${installments} cuotas`,
          metadata: { course_id: courseId },
        });
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: amountPerInstallment,
          currency: 'eur',
          recurring: { interval: 'month', interval_count: 1 },
        });
        priceId = price.id;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        metadata: {
          user_id: user.id,
          course_id: courseId,
          installments: String(installments),
        },
        subscription_data: {
          metadata: {
            user_id: user.id,
            course_id: courseId,
            installments: String(installments),
            max_cycles: String(installments),
          },
        },
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${baseUrl}/curso/${courseId}?enrolled=true`,
        cancel_url: `${baseUrl}/curso/${courseId}`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Single payment — card + Klarna (Klarna offers pay-in-3 natively in Spain/Europe)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      tax_id_collection: { enabled: true },
      metadata: {
        user_id: user.id,
        course_id: courseId,
      },
      payment_method_types: ['card', 'klarna'],
      payment_method_options: {
        klarna: {
          // Klarna auto-shows "Pay in 3" option when available in the customer's region
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.title,
              description: course.subtitle,
              metadata: { course_id: courseId },
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/curso/${courseId}?enrolled=true`,
      cancel_url: `${baseUrl}/curso/${courseId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
