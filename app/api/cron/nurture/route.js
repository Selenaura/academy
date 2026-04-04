import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNurtureEmail, NURTURE_EMAILS } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/cron/nurture
 * Runs daily (via Vercel Cron). Checks all leads and sends the appropriate
 * nurture email based on days since lead creation.
 *
 * Schedule: Day 2, 4, 7, 10, 14 after lead magnet download.
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request) {
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

    // Get all leads that haven't finished the nurture sequence (step < 5)
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .lt('nurture_step', NURTURE_EMAILS.length)
      .eq('email_sent', true) // only nurture leads who received the lead magnet
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Nurture cron: DB error', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      console.log('🔄 Nurture cron: no leads to process');
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    for (const lead of leads) {
      const step = lead.nurture_step || 0;
      const nextEmail = NURTURE_EMAILS[step];
      if (!nextEmail) continue;

      // Calculate days since lead was created
      const createdAt = new Date(lead.created_at);
      const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

      // Only send if enough days have passed
      if (daysSinceCreation < nextEmail.day) continue;

      // Prevent sending twice in the same day
      if (lead.nurture_last_sent) {
        const lastSent = new Date(lead.nurture_last_sent);
        const hoursSinceLastSent = (now - lastSent) / (1000 * 60 * 60);
        if (hoursSinceLastSent < 20) continue; // min 20h between emails
      }

      // Send the email
      console.log(`📧 Nurture step ${step + 1}/5 → ${lead.email} (day ${daysSinceCreation})`);
      const result = await sendNurtureEmail({ email: lead.email, step });

      if (result.success) {
        // Update lead: increment step, update last sent, save Brevo messageId
        const updateData = {
          nurture_step: step + 1,
          nurture_last_sent: now.toISOString(),
        };
        if (result.messageId) {
          updateData.brevo_message_id = result.messageId;
        }

        await supabase
          .from('leads')
          .update(updateData)
          .eq('id', lead.id);

        totalSent++;
      } else {
        console.error(`❌ Failed nurture to ${lead.email}:`, result.reason);
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
