import { NextResponse } from 'next/server';
import { sendLeadMagnetEmail, addBrevoContact } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_ORIGINS = [
  'https://selenaura.com',
  'https://www.selenaura.com',
  'https://academy.selenaura.com',
  'https://carta.selenaura.com',
  'https://tarot.selenaura.com',
];

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ── Calcular signo solar a partir de fecha de nacimiento ─────────────────────
function getSunSignSlug(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString + 'T12:00:00');
    const month = date.getMonth() + 1;
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

/** Preflight */
export async function OPTIONS(request) {
  return NextResponse.json({}, { headers: corsHeaders(request) });
}

/**
 * POST /api/lead-capture
 * Public endpoint for web forms (no API key required).
 * Accepts cross-origin requests from SelenaUra domains.
 *
 * Body: { email: string, source?: string, date_of_birth?: string (YYYY-MM-DD) }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, source = 'web_form', date_of_birth } = body;

    if (!email || !email.includes('@') || email.length < 5 || email.length > 200) {
      return NextResponse.json({ error: 'Email válido requerido' }, { status: 400, headers: corsHeaders(request) });
    }

    const normalizedEmail = email.toLowerCase().trim();

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
      // Si ya existe pero ahora tenemos el signo y antes no, actualizarlo
      if (signo && !existing.signo) {
        await supabase
          .from('leads')
          .update({ signo, fecha_nacimiento: date_of_birth || null })
          .eq('id', existing.id);
        // Sincronizar signo en Brevo
        addBrevoContact({
          email: normalizedEmail,
          source,
          listType: 'lead_magnet',
          signo,
        }).catch(() => {});
      }
      return NextResponse.json({ success: true }, { headers: corsHeaders(request) });
    }

    // Send the lead magnet email
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

    await supabase.from('leads').insert(leadData);

    // Add to Brevo contact list with signo attribute
    addBrevoContact({
      email: normalizedEmail,
      source,
      listType: 'lead_magnet',
      signo: signo || undefined,
    }).catch(() => {});

    console.log(`🎯 Web lead captured: ${normalizedEmail} (source: ${source}${signo ? `, signo: ${signo}` : ''})`);

    return NextResponse.json({ success: true }, { headers: corsHeaders(request) });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500, headers: corsHeaders(request) });
  }
}
