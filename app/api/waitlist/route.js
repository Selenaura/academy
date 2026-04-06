import { NextResponse } from 'next/server';
import { addBrevoContact } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Send a simple waitlist confirmation email via Brevo
 */
async function sendWaitlistConfirmation({ email }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set — waitlist email not sent');
    return { success: false, reason: 'no_api_key' };
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="text-align:center;padding:30px 0 20px;">
              <div style="font-size:28px;margin-bottom:8px;">&#127769;</div>
              <h1 style="color:#d4a853;font-size:20px;font-weight:normal;margin:0;letter-spacing:1px;">SELENE ACADEMIA</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
                Estas en la lista de espera
              </h2>
              <p style="color:#b8b8c8;font-size:15px;line-height:1.7;margin:0;">
                Gracias por tu interes en el <strong style="color:#d4a853;">Master en Guia Espiritual Profesional</strong> — Cohort Fundador.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="color:#b8b8c8;font-size:14px;line-height:1.8;margin:0;">
                      Solo hay <strong style="color:#d4a853;">20 plazas</strong> a precio fundador (99,99 euros en lugar de 149,99 euros).
                      Te avisaremos cuando se abra la inscripcion con todos los detalles.
                    </p>
                    <p style="color:#b8b8c8;font-size:14px;line-height:1.8;margin:16px 0 0;">
                      El Master incluye: 12 modulos, 80 horas, 6 disciplinas integradas, casos supervisados, guia legal y certificacion profesional.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <a href="https://academy.selenaura.com/master?utm_source=brevo&utm_medium=email&utm_campaign=waitlist_master"
                 style="display:inline-block;background-color:#d4a853;color:#0a0a0f;text-decoration:none;padding:14px 36px;border-radius:25px;font-size:15px;font-weight:bold;">
                Ver pagina del Master
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px 20px;text-align:center;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a3a,transparent);margin-bottom:20px;"></div>
              <p style="color:#666;font-size:11px;margin:0;">
                Selene Academia &middot; selenaura.com
              </p>
              <p style="color:#666;font-size:11px;margin:4px 0 0;">
                <a href="https://academy.selenaura.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#666;text-decoration:underline;">Darme de baja</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'Selene Academia', email: 'info@selenaura.com' },
        to: [{ email }],
        subject: 'Estas en la lista de espera del Master Fundador',
        htmlContent,
      }),
    });

    const data = await res.json();
    return { success: res.ok, messageId: data.messageId };
  } catch (err) {
    console.error('Brevo send error:', err);
    return { success: false, reason: 'send_failed' };
  }
}

/**
 * POST /api/waitlist
 * Saves email to leads table with source='waitlist_master' and sends confirmation
 * Body: { email: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('lead_magnet', 'master_founding')
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already on waitlist',
        duplicate: true,
      });
    }

    // Send confirmation email
    const emailResult = await sendWaitlistConfirmation({ email: normalizedEmail });

    // Store lead
    const leadData = {
      email: normalizedEmail,
      source: 'waitlist_master',
      lead_magnet: 'master_founding',
      email_sent: emailResult.success,
      created_at: new Date().toISOString(),
    };
    if (emailResult.messageId) {
      leadData.brevo_message_id = emailResult.messageId;
    }

    await supabase.from('leads').insert(leadData);

    // Add to Brevo waitlist contact list (non-blocking)
    addBrevoContact({ email: normalizedEmail, source: 'waitlist_master', listType: 'waitlist_master' }).catch(() => {});

    console.log(`Waitlist: ${normalizedEmail} added for master founding cohort`);

    return NextResponse.json({
      success: true,
      email_sent: emailResult.success,
    });

  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
