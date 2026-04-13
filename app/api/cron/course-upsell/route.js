export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCourseUpsellEmail } from '@/lib/email';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * GET /api/cron/course-upsell
 * Runs daily. Finds users who completed (or nearly completed) the free
 * "Brújula Interior" course and sends them an upsell email for
 * "Magnetismo Consciente" (€24.99) with BIENVENIDA20 coupon (20% off → €19.99).
 *
 * Conditions to send:
 * - enrollment in brujula-interior with progress >= 0.8
 * - no existing enrollment in magnetismo-consciente
 * - upsell_sent_at is NULL (haven't sent this email yet)
 * - enrolled at least 2 days ago (give them time to finish)
 */
export async function GET(request) {
  const supabase = getSupabase();

  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    let sent = 0;
    let skipped = 0;
    let errors = 0;

    // Find enrollments in brujula-interior with high progress and no upsell sent
    const { data: candidates, error: fetchErr } = await supabase
      .from('enrollments')
      .select('id, user_id, progress, status, enrolled_at')
      .eq('course_id', 'brujula-interior')
      .gte('progress', 0.8)
      .is('upsell_sent_at', null);

    if (fetchErr) {
      console.error('Course upsell cron: DB error', fetchErr);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!candidates || candidates.length === 0) {
      console.log('🔄 Course upsell cron: no candidates');
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    // Get user emails from auth (via profiles or auth.users)
    const userIds = candidates.map(c => c.user_id);

    // Check which candidates already have magnetismo-consciente enrollment
    const { data: existingEnrollments } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', 'magnetismo-consciente')
      .in('user_id', userIds);

    const alreadyEnrolled = new Set((existingEnrollments || []).map(e => e.user_id));

    // Get user emails from auth.users (email not in profiles table)
    // and names from profiles table
    const { data: { users: authUsers }, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) {
      console.error('Course upsell: auth listUsers error', authErr);
      return NextResponse.json({ error: 'Auth error' }, { status: 500 });
    }
    const authMap = new Map(authUsers.map(u => [u.id, u.email]));

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);

    const nameMap = new Map((profiles || []).map(p => [p.id, p.name]));

    // Build combined profile map
    const profileMap = new Map(userIds.map(uid => [uid, {
      email: authMap.get(uid),
      name: nameMap.get(uid),
    }]));

    for (const candidate of candidates) {
      // Skip if enrolled less than 2 days ago
      const enrolledAt = new Date(candidate.enrolled_at);
      const daysSinceEnroll = Math.floor((now - enrolledAt) / (1000 * 60 * 60 * 24));
      if (daysSinceEnroll < 2) {
        skipped++;
        continue;
      }

      // Skip if already enrolled in the next course
      if (alreadyEnrolled.has(candidate.user_id)) {
        // Mark as sent so we don't check again
        await supabase
          .from('enrollments')
          .update({ upsell_sent_at: now.toISOString() })
          .eq('id', candidate.id);
        skipped++;
        continue;
      }

      const profile = profileMap.get(candidate.user_id);
      if (!profile?.email) {
        console.warn(`No email for user ${candidate.user_id}, skipping upsell`);
        skipped++;
        continue;
      }

      // Send the upsell email
      console.log(`📧 Upsell → ${profile.email} (progress: ${Math.round(candidate.progress * 100)}%)`);
      const result = await sendCourseUpsellEmail({
        email: profile.email,
        userName: profile.name?.split(' ')[0] || null,
        completedCourseTitle: 'Despierta tu Brújula Interior',
        nextCourseTitle: 'Magnetismo Consciente',
        nextCourseId: 'magnetismo-consciente',
        nextCoursePrice: 2499,
        couponCode: 'BIENVENIDA20',
        discountPercent: 20,
      });

      if (result.success) {
        await supabase
          .from('enrollments')
          .update({ upsell_sent_at: now.toISOString() })
          .eq('id', candidate.id);
        sent++;
      } else {
        console.error(`❌ Upsell failed for ${profile.email}:`, result.reason);
        errors++;
      }

      // Small delay between sends
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log(`✅ Course upsell cron: ${sent} sent, ${skipped} skipped, ${errors} errors`);
    return NextResponse.json({ processed: candidates.length, sent, skipped, errors });
  } catch (err) {
    console.error('Course upsell cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
