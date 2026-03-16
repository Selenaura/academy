# Database (Supabase)

Project: lerfefvqfwdsubchzqyk.supabase.co
All tables in `public` schema. All have RLS enabled. All FK to auth.users(id) ON DELETE CASCADE.

## profiles
id (uuid PK → auth.users), name, birth_date, birth_time, birth_city,
sun_sign, moon_sign, rising_sign, interests (text[]), experience_level,
xp (int default 0), streak_days (int default 0), last_active_at, onboarding_complete (bool),
created_at, updated_at (auto-trigger)
Auto-created by trigger handle_new_user on auth.users INSERT.

## enrollments
id (uuid PK), user_id, course_id (text matches COURSES[].id in constants.js),
status ('active'|'completed'|'cancelled'), progress (float 0-1),
enrolled_at, completed_at, stripe_session_id, amount_paid
UNIQUE(user_id, course_id)

## lesson_progress
id (uuid PK), user_id, course_id, lesson_id (text matches lessons[].id in constants.js),
status ('not_started'|'in_progress'|'completed'), completed_at, time_spent_seconds
UNIQUE(user_id, lesson_id)

## quiz_attempts
id (uuid PK), user_id, course_id, lesson_id, score (float 0-1),
answers (jsonb), passed (bool), attempted_at

## certificates
id (uuid PK), user_id, course_id, certificate_code (text UNIQUE), issued_at
UNIQUE(user_id, course_id)

## payments
id (uuid PK), user_id, course_id, stripe_session_id, amount (int cents), currency, status, created_at

## RLS policies
Each table: users can SELECT/INSERT/UPDATE their own rows (auth.uid() = user_id).
certificates and payments: INSERT only via service role (webhook).

## Accessing from code
Client components: import { createClient } from '@/lib/supabase-browser'
Server components: import { createClient } from '@/lib/supabase-server'
Webhook (no user context): import { createClient } from '@supabase/supabase-js' with SUPABASE_SERVICE_ROLE_KEY
