import { NextResponse } from 'next/server';
import { sendLeadMagnetEmail, addBrevoContact } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ── Calcular signo solar a partir de fecha de nacimiento ─────────────────────
function getSunSignSlug(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString + 'T12:00:00');
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'tauro';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'geminis';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'escorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagitario';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricornio';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'acuario';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'piscis';
    return null;
  } catch {
    return null;
  }
}

/**
 * POST /api/lead-magnet
 * Receives a lead email (from Meta Lead Ads via Zapier/Make, or manual)
 * Sends the lead magnet email and stores the lead in Supabase
 *
 * Body: { email: string, source?: string, date_of_birth?: string (YYYY-MM-DD), name?: string, country?: string }
 * Headers: x-api-key must match LEAD_WEBHOOK_SECRET env var
 */
export async function POST(request) {
  try {
    // Verify webhook secret (skip in dev if not set)
    const apiKey = request.headers.get('x-api-key');
    const secret = process.env.LEAD_WEBHOOK_SECRET;

    if (secret && apiKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, source = 'meta_lead_ad', date_of_birth, name, country } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = getSupabase();

    // Calcular signo solar si viene fecha de nacimiento
    const signo = getSunSignSlug(date_of_birth) || null;

    // Check if we already sent to this email (avoid duplicates)
    const { data: existing } = await supabase
      .from('leads')
      .select('id, signo')
      .eq('email', normalizedEmail)
      .eq('lead_magnet', '5-errores-guia-espiritual')
      .single();

    if (existing) {
      // Si ya existe pero ahora tenemos el signo y antes no lo teníamos, actualizarlo
      if (signo && !existing.signo) {
        await supabase
          .from('leads')
          .update({ signo, fecha_nacimiento: date_of_birth || null })
          .eq('id', existing.id);

        // Sincronizar signo en Brevo también
        addBrevoContact({
          email: normalizedEmail,
          source,
          listType: 'lead_magnet',
          signo,
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        message: 'Already sent',
        duplicate: true,
      });
    }

    // Send the email
    const emailResult = await sendLeadMagnetEmail({ email: normalizedEmail });

    // Store the lead
    const leadData = {
      email: normalizedEmail,
      source,
      lead_magnet: '5-errores-guia-espiritual',
      email_sent: emailResult.success,
      created_at: new Date().toISOString(),
    };
    if (emailResult.messageId) {
      leadData.brevo_message_id = emailResult.messageId;
    }
    if (signo) {
      leadData.signo = signo;
    }
    if (date_of_birth) {
      leadData.fecha_nacimiento = date_of_birth;
    }
    if (name) {
      leadData.name = name.trim();
    }
    if (country) {
      leadData.country = country.trim().toUpperCase();
    }

    await supabase.from('leads').insert(leadData);

    // ── Schedule nurture email sequence (steps 2-7) ──
    // This was missing and caused 280+ leads to never receive nurture emails
    const now = new Date();
    const nurtureDays = [
      { step: 2, delay_days: 1 },  // Día 1: 3 secretos del signo
      { step: 3, delay_days: 2 },  // Día 2: horóscopo personalizado
      { step: 4, delay_days: 3 },  // Día 3: tarot 0,99€ con PRIMERALUZ
      { step: 5, delay_days: 5 },  // Día 5: Pack Astral 4,99€
      { step: 6, delay_days: 8 },  // Día 8: última oportunidad
      { step: 7, delay_days: 14 }, // Día 14: win-back → Premium
    ];

    const sequenceRows = nurtureDays.map(({ step, delay_days }) => ({
      email: normalizedEmail,
      signo_solar: signo || null,
      step,
      source,
      sent: false,
      next_send_at: new Date(now.getTime() + delay_days * 86400000).toISOString(),
      created_at: now.toISOString(),
    }));

    supabase.from('email_sequence').insert(sequenceRows)
      .then(({ error }) => { if (error) console.error('Email sequence insert error:', error.message); })
      .catch(e => console.error('Email sequence error:', e.message));

    // Also relay to selenaura lead-capture for Meta CAPI + PostHog tracking
    const siteUrl = process.env.SELENAURA_URL || 'https://selenaura.com';
    fetch(`${siteUrl}/api/lead-capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        source,
        signo_solar: signo,
        name,
        country,
      }),
    }).catch(() => {}); // Non-blocking, best-effort

    // Add to Brevo contact list with SIGNO attribute (non-blocking)
    addBrevoContact({
      email: normalizedEmail,
      source,
      listType: 'lead_magnet',
      signo: signo || undefined,
    }).catch(() => {});

    console.log(`Lead magnet sent to ${normalizedEmail} (source: ${source}${signo ? `, signo: ${signo}` : ''})`);

    return NextResponse.json({
      success: true,
      email_sent: emailResult.success,
      signo: signo || null,
    });

  } catch (err) {
    console.error('Lead magnet error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
