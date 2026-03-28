import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// GET /api/review?course_id=brujula-interior&limit=5
// Returns spaced review questions due for the user
export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('course_id');
  const limit = parseInt(searchParams.get('limit') || '3');

  // Get items due for review (next_review_at <= now)
  let query = supabase
    .from('user_reviews')
    .select('*, review_items(*)')
    .eq('user_id', user.id)
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(limit);

  if (courseId) {
    query = query.eq('review_items.course_id', courseId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const questions = (data || [])
    .filter(r => r.review_items) // filter nulls from join
    .map(r => ({
      review_id: r.id,
      item_id: r.item_id,
      question: r.review_items.question_text,
      type: r.review_items.question_type,
      options: r.review_items.options,
      correct: r.review_items.correct_answer,
      explanation: r.review_items.explanation,
    }));

  return NextResponse.json({ questions });
}

// POST /api/review — Record review result and update SM-2 interval
export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { review_id, quality } = await request.json();
  // quality: 0-5 (SM-2 scale, 0=forgot, 5=perfect)

  const { data: review } = await supabase
    .from('user_reviews')
    .select('*')
    .eq('id', review_id)
    .eq('user_id', user.id)
    .single();

  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

  // SM-2 algorithm (simplified)
  let { ease_factor, interval_days, repetitions } = review;

  if (quality >= 3) {
    // Correct answer
    if (repetitions === 0) interval_days = 1;
    else if (repetitions === 1) interval_days = 3;
    else interval_days = Math.round(interval_days * ease_factor);
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval_days = 1;
  }

  // Update ease factor
  ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const next_review_at = new Date(Date.now() + interval_days * 86400000).toISOString();

  await supabase
    .from('user_reviews')
    .update({
      ease_factor,
      interval_days,
      repetitions,
      next_review_at,
      last_reviewed_at: new Date().toISOString(),
    })
    .eq('id', review_id);

  return NextResponse.json({ success: true, next_review_at, interval_days });
}
