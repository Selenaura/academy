export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNurtureEmail, NURTURE_EMAILS } from '@/lib/email';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * GET /api/cron/nurture
 * Runs daily (via Vercel Cron). Checks all leads and sends the appropriate
 * nurture email based on days since lead creation.
 *
 * Schedule: Day 2, 4, 7, 10, 14 after lead magnet download.
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

  try {
    const now = new Date();
    let totalSent = 0;
    let errors = 0;

    // Only nurture leads that belong to the Master funnel.
    // Other sources (quiz_compatibilidad, lectura-express, exit_intent_landing, etc.)
    // come from selenaura-main and must NOT receive academy master emails.
    const MASTER_LEAD_MAGNETS = ['5-errores-guia-espiritual', 'master_founding'];

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .lt('nurture_step', NURTURE_EMAILS.length)
      .eq('email_sent', true)
      .in('lead_magnet', MASTER_LEAD_MAGNETS)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Nurture cron: DB error', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      console.log('🔄 Nurture cron: no leads to process');
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    // Track emails sent within this invocation to stop the same email from
    // being processed twice if there happen to be multiple leads with the
    // same address across different master funnels.
    const sentThisRun = new Set();

    for (const lead of leads) {
      const step = lead.nurture_step || 0;
      const nextEmail = NURTURE_EMAILS[step];
      if (!nextEmail) continue;

      if (sentThisRun.has(lead.email)) continue;

      // Calculate days since lead was created
      const createdAt = new Date(lead.created_at);
      const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

      // Only send if enough days have passed
      if (daysSinceCreation < nextEmail.day) continue;

      // Prevent sending twice within 20h — check ANY row for this email,
      // not just the current one (guards against duplicate rows + concurrent runs).
      const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString();
      const { count: recentSends } = await supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .eq('email', lead.email)
        .gte('nurture_last_sent', twentyHoursAgo);

      if (recentSends && recentSends > 0) continue;

      // CLAIM the lead BEFORE sending — conditional update on the expected
      // step. If another concurrent invocation already incremented the step,
      // this update will affect 0 rows and we skip the send. This is the
      // optimistic-lock pattern that prevents duplicate sends.
      const { data: claimed, error: claimErr } = await supabase
        .from('leads')
        .update({
          nurture_step: step + 1,
          nurture_last_sent: now.toISOString(),
        })
        .eq('id', lead.id)
        .eq('nurture_step', step) // only claim if step hasn't changed
        .select('id');

      if (claimErr || !claimed || claimed.length === 0) {
        // Another invocation already claimed this lead. Skip.
        continue;
      }

      // Now send — we have exclusive ownership of this step for this email.
      console.log(`📧 Nurture step ${step + 1}/5 → ${lead.email} (day ${daysSinceCreation})`);
      const result = await sendNurtureEmail({ email: lead.email, step });

      if (result.success) {
        sentThisRun.add(lead.email);
        if (result.messageId) {
          await supabase
            .from('leads')
            .update({ brevo_message_id: result.messageId })
            .eq('id', lead.id);
        }
        totalSent++;
      } else {
        // Send failed after claiming: roll back step so the email is retried
        // on the next cron run.
        console.error(`❌ Failed nurture to ${lead.email}:`, result.reason);
        await supabase
          .from('leads')
          .update({
            nurture_step: step,
            nurture_last_sent: lead.nurture_last_sent,
          })
          .eq('id', lead.id);
        errors++;
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`✅ Nurture cron complete: ${totalSent} sent, ${errors} errors, ${leads.length} processed`);

    return NextResponse.json({
      processed: leads.length,
      sent: totalSent,
      errors,
    });
  } catch (err) {
    console.error('Nurture cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
