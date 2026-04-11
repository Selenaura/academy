import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const FROM = {
  name: 'Selene Academia',
  email: 'info@selenaura.com',
};

/**
 * GET /api/cron/cart-abandonment
 * Runs daily (via Vercel Cron). Finds checkout intents from 1-3 hours ago
 * that have no matching successful payment, and sends a recovery email.
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request) {
  const supabase = getSupabase();
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ BREVO_API_KEY not set — cart abandonment emails not sent');
    return NextResponse.json({ error: 'no_api_key' }, { status: 500 });
  }

  try {
    const now = new Date();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(now - 3 * 60 * 60 * 1000).toISOString();

    // Get checkout intents from 1-3 hours ago that haven't been recovered
    const { data: intents, error: intentsError } = await supabase
      .from('checkout_intents')
      .select('*')
      .gte('created_at', threeHoursAgo)
      .lte('created_at', oneHourAgo)
      .eq('recovered', false)
      .order('created_at', { ascending: true });

    if (intentsError) {
      console.error('Cart abandonment cron: DB error', intentsError);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!intents || intents.length === 0) {
      console.log('🛒 Cart abandonment cron: no abandoned carts to process');
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    // Get emails of users who completed payment in the last 3 hours
    const { data: payments } = await supabase
      .from('payments')
      .select('user_id, course_id')
      .eq('status', 'completed')
      .gte('created_at', threeHoursAgo);

    // Also check enrollments directly (covers free enrollments and edge cases)
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id, course_id')
      .gte('enrolled_at', threeHoursAgo);

    // Build a set of "email:courseId" that completed payment
    // We need to match by email through profiles, but since checkout_intents
    // stores email and payments store user_id, we cross-reference via profiles
    const completedEmails = new Set();

    if (payments && payments.length > 0) {
      const userIds = [...new Set(payments.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profiles) {
        for (const payment of payments) {
          const profile = profiles.find(p => p.id === payment.user_id);
          if (profile) {
            completedEmails.add(`${profile.email}:${payment.course_id}`);
          }
        }
      }
    }

    // Also check auth.users for enrollment matches
    if (enrollments && enrollments.length > 0) {
      const userIds = [...new Set(enrollments.map(e => e.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profiles) {
        for (const enrollment of enrollments) {
          const profile = profiles.find(p => p.id === enrollment.user_id);
          if (profile) {
            completedEmails.add(`${profile.email}:${enrollment.course_id}`);
          }
        }
      }
    }

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    // Deduplicate by email+courseId (take the most recent intent per combo)
    const seen = new Set();

    for (const intent of intents) {
      const key = `${intent.email}:${intent.course_id}`;

      // Skip if payment was already completed
      if (completedEmails.has(key)) {
        skipped++;
        // Mark as recovered so we don't check again
        await supabase
          .from('checkout_intents')
          .update({ recovered: true })
          .eq('id', intent.id);
        continue;
      }

      // Skip duplicates (only send one email per email+course)
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);

      // Send recovery email
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://academy.selenaura.com';
      const courseUrl = `${siteUrl}/curso/${intent.course_id}?utm_source=brevo&utm_medium=email&utm_campaign=cart_abandonment`;
      const priceFormatted = intent.course_price
        ? `${(intent.course_price / 100).toFixed(2)} EUR`
        : '';

      const subject = `Has dejado algo pendiente: ${intent.course_name || 'tu curso'}`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f6f3; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h1 style="color: #2d2d2d; font-size: 24px; margin: 0 0 16px;">Tu curso te espera</h1>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Hola,
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Hemos visto que empezaste el proceso de inscripcion en
        <strong>${intent.course_name || 'uno de nuestros cursos'}</strong>
        ${priceFormatted ? `(${priceFormatted})` : ''} pero no lo completaste.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        A veces la vida interrumpe, y lo entendemos. Si todavia te interesa,
        puedes retomar justo donde lo dejaste:
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${courseUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4A843, #5BB8A6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Completar inscripcion
        </a>
      </div>
      <div style="background: #f0f9f6; border-left: 4px solid #5B9E8F; padding: 16px; border-radius: 4px; margin: 24px 0;">
        <p style="color: #3d6b5e; font-size: 14px; margin: 0; line-height: 1.5;">
          <strong>Garantia de 14 dias:</strong> Si despues de empezar el curso
          sientes que no es para ti, te devolvemos el 100% de tu inversion.
          Sin preguntas.
        </p>
      </div>
      <p style="color: #999; font-size: 13px; margin-top: 32px;">
        Si ya completaste tu compra o decidiste no continuar, puedes ignorar este mensaje.
      </p>
    </div>
    <p style="text-align: center; color: #bbb; font-size: 12px; margin-top: 24px;">
      Selene Academia &mdash; Tu viaje de transformacion
    </p>
  </div>
</body>
</html>`.trim();

      const textContent = `Tu curso te espera

Hola,

Hemos visto que empezaste el proceso de inscripcion en "${intent.course_name || 'uno de nuestros cursos'}" pero no lo completaste.

Si todavia te interesa, puedes retomar aqui: ${courseUrl}

Garantia de 14 dias: Si despues de empezar el curso sientes que no es para ti, te devolvemos el 100%. Sin preguntas.

Si ya completaste tu compra o decidiste no continuar, puedes ignorar este mensaje.

— Selene Academia`;

      try {
        const res = await fetch(BREVO_API_URL, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            sender: FROM,
            to: [{ email: intent.email }],
            subject,
            htmlContent,
            textContent,
          }),
        });

        if (res.ok) {
          sent++;
          console.log(`🛒 Cart recovery email sent to ${intent.email} for ${intent.course_id}`);

          // Mark intent as recovered
          await supabase
            .from('checkout_intents')
            .update({ recovered: true })
            .eq('id', intent.id);
        } else {
          const errBody = await res.text();
          console.error(`❌ Brevo error for ${intent.email}:`, errBody);
          errors++;
        }
      } catch (emailErr) {
        console.error(`❌ Email send error for ${intent.email}:`, emailErr);
        errors++;
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`✅ Cart abandonment cron complete: ${sent} sent, ${skipped} skipped, ${errors} errors`);

    return NextResponse.json({
      processed: intents.length,
      sent,
      skipped,
      errors,
    });
  } catch (err) {
    console.error('Cart abandonment cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
