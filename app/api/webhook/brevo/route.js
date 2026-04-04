import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/webhook/brevo
 * Receives Brevo email engagement webhooks (opens, clicks, bounces, spam, unsubscribes).
 * Updates the leads table with engagement metrics.
 *
 * Brevo payload:
 * {
 *   "event": "opened" | "click" | "hard_bounce" | "soft_bounce" | "spam" | "unsubscribed",
 *   "email": "user@example.com",
 *   "ts_event": 1234567890,
 *   "message-id": "<msg-id>",
 *   "link": "https://..." (for click events)
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { event, email, ts_event } = body;
    const messageId = body['message-id'];

    if (!event || !email) {
      return NextResponse.json({ error: 'Missing event or email' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const eventTime = ts_event ? new Date(ts_event * 1000).toISOString() : new Date().toISOString();

    console.log(`📬 Brevo webhook: ${event} for ${normalizedEmail}`);

    switch (event) {
      case 'opened': {
        const { error } = await supabase.rpc('increment_field', {
          row_email: normalizedEmail,
          field_name: 'opens_count',
        }).catch(() => ({ error: 'rpc not available' }));

        // Fallback: direct update if RPC doesn't exist
        // First get current count, then update
        const { data: lead } = await supabase
          .from('leads')
          .select('opens_count')
          .eq('email', normalizedEmail)
          .single();

        if (lead) {
          await supabase
            .from('leads')
            .update({
              opens_count: (lead.opens_count || 0) + 1,
              last_opened_at: eventTime,
            })
            .eq('email', normalizedEmail);
        }
        break;
      }

      case 'click': {
        const { data: lead } = await supabase
          .from('leads')
          .select('clicks_count')
          .eq('email', normalizedEmail)
          .single();

        if (lead) {
          await supabase
            .from('leads')
            .update({
              clicks_count: (lead.clicks_count || 0) + 1,
              last_clicked_at: eventTime,
            })
            .eq('email', normalizedEmail);
        }

        if (body.link) {
          console.log(`  🔗 Clicked: ${body.link}`);
        }
        break;
      }

      case 'hard_bounce':
      case 'spam':
      case 'unsubscribed': {
        // Stop nurture sequence for these leads
        await supabase
          .from('leads')
          .update({ nurture_step: 999 })
          .eq('email', normalizedEmail);

        console.log(`  🛑 Stopped nurture for ${normalizedEmail} (${event})`);
        break;
      }

      case 'soft_bounce': {
        // Log but don't stop nurture — soft bounces may resolve
        console.log(`  ⚠️ Soft bounce for ${normalizedEmail}`);
        break;
      }

      default:
        console.log(`  ℹ️ Unhandled Brevo event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Brevo webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
