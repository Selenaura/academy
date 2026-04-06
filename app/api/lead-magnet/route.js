import { NextResponse } from 'next/server';
import { sendLeadMagnetEmail, addBrevoContact } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/lead-magnet
 * Receives a lead email (from Meta Lead Ads via Zapier/Make, or manual)
 * Sends the lead magnet email and stores the lead in Supabase
 *
 * Body: { email: string, source?: string }
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
    const { email, source = 'meta_lead_ad' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
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
      return NextResponse.json({
        success: true,
        message: 'Already sent',
        duplicate: true
      });
    }

    // Send the email
    const emailResult = await sendLeadMagnetEmail({ email: normalizedEmail });

    // Store the lead (include Brevo messageId if available)
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

    // Add to Brevo contact list (non-blocking)
    addBrevoContact({ email: normalizedEmail, source, listType: 'lead_magnet' }).catch(() => {});

    console.log(`🎯 Lead magnet sent to ${normalizedEmail} (source: ${source})`);

    return NextResponse.json({
      success: true,
      email_sent: emailResult.success
    });

  } catch (err) {
    console.error('Lead magnet error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
