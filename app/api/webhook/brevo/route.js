export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook (no user context)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

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
  const supabase = getSupabase();
  try {
    // Verify Brevo webhook token
    const token = request.headers.get('x-brevo-token');
    if (token !== process.env.BREVO_WEBHOOK_TOKEN) {
      console.error('❌ Brevo webhook: invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event, email, ts_event } = body;
    const messageId = body['message-id'];

    if (!event || !email) {
      return NextResponse.json({ error: 'Missing event or email' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const eventTime = ts_event ? new Date(ts_event * 1000).toISOString() : new Date().toISOString();

    console.log(`📬 Brevo webhook: ${event} for ${normalizedEmail}`);

    // Defensive log: persist EVERY event to brevo_events_log for diagnosis.
    // Vercel Hobby clears runtime logs hourly; this gives us a durable audit trail
    // to detect unmatched events (e.g. Brevo sending `unique_opened` instead of `opened`).
    //
    // Confirmed via live traffic 2026-04-21: Brevo actually sends events prefixed
    // with `unique_` (unique_opened, unique_proxy_open) — not bare `opened`/`proxy_open`.
    // The `unique_` prefix means "first event of this type per message per contact in 24h".
    const KNOWN_EVENTS = new Set([
      'opened', 'open', 'unique_opened',
      'click', 'clicks',
      'hard_bounce', 'soft_bounce',
      'spam', 'unsubscribed', 'delivered', 'request',
      'proxy_open', 'unique_proxy_open',
    ]);
    await supabase.from('brevo_events_log').insert({
      event_type: event,
      email: normalizedEmail,
      message_id: messageId || null,
      ts_event: eventTime,
      payload: body,
      matched: KNOWN_EVENTS.has(event),
    });

    // Normalize Brevo event naming variations.
    // Brevo sends `unique_opened` / `unique_proxy_open` (deduplicated per message+contact+24h)
    // and the rarer raw `opened` / `proxy_open`. Both map to an "open" for our purposes.
    // Apple Mail Privacy Protection triggers `unique_proxy_open` — we count it as an
    // open for engagement metrics, but production analytics may want to split them later.
    const normalizedEvent =
      (event === 'open' || event === 'unique_opened' ||
       event === 'proxy_open' || event === 'unique_proxy_open') ? 'opened'
      : (event === 'clicks') ? 'click'
      : event;

    switch (normalizedEvent) {
      case 'opened': {
        // Direct update: get current count, then increment
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
        console.log(`  ℹ️ Unhandled Brevo event: ${event} (logged in brevo_events_log)`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Brevo webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
