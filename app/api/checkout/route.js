import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { COURSES } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { courseId } = await request.json();
    const course = COURSES.find(c => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (course.price === 0) {
      // Free course — enroll directly
      const { error } = await supabase
        .from('enrollments')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString(),
        });

      if (error) throw error;
      return NextResponse.json({ enrolled: true });
    }

    // Paid course — create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        course_id: courseId,
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
            unit_amount: course.price, // Already in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/curso/${courseId}?enrolled=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/curso/${courseId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
