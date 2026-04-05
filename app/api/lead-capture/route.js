import { NextResponse } from 'next/server';
import { sendLeadMagnetEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/lead-capture
 * Public endpoint for web forms (no API key required).
 * Basic rate-limiting via simple checks.
 *
 * Body: { email: string, source?: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, source = 'web_form' } = body;

    if (!email || !email.includes('@') || email.length < 5 || email.length > 200) {
      return NextResponse.json({ error: 'Email válido requerido' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if we already sent to this email (avoid duplicates)
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('lead_magnet', '5-errores-guia-espiritual')
      .single();

    if (existing) {
      // Still show success to user (don't reveal if email exists)
      return NextResponse.json({ success: true });
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

    await supabase.from('leads').insert(leadData);

    console.log(`🎯 Web lead captured: ${normalizedEmail} (source: ${source})`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
