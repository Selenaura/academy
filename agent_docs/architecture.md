# Architecture

## Routes
/ — Landing (public). Course catalog, hero, CTA.
/auth — Login/Register. Supabase Auth (email + Google OAuth). useSearchParams needs Suspense.
/auth/callback — OAuth redirect handler (server route).
/onboarding — 4 steps: birth data → interests → experience → personalized route. Saves to profiles table.
/dashboard — Student hub. Shows enrolled courses with progress, XP bar, streak, explore section.
/curso/[id] — Course detail. Lessons list grouped by module. Video player. Quiz with scoring.
/curso/[id]/certificado — Certificate with unique verifiable code. PDF download (not yet implemented).
/perfil — User profile. Natal chart summary, stats, settings, logout.

## API Routes
/api/checkout — POST. Creates Stripe Checkout session for paid courses. Returns { url } or { enrolled: true } for free.
/api/webhook — POST. Stripe webhook. On checkout.session.completed: creates enrollment + payment record.

## Key files
components/ui/index.js — All shared components: Navbar, Footer, Card, Badge, ProgressBar, Spinner, Icons (Moon, Play, Check, Lock, Arrow, Back, User, Cert, Book, Grid, Star).
lib/constants.js — COURSES array (6 courses with id, title, price, lessons, science base), LEVELS, XP_REWARDS.
lib/supabase-browser.js — createClient() for client components.
lib/supabase-server.js — createClient() for server components (uses cookies).
middleware.js — Redirects unauthenticated users from protected routes to /auth.

## Data flow
1. User registers → Supabase creates auth.user → trigger creates profiles row
2. User completes onboarding → updates profiles with birth_date, interests, experience
3. User enrolls in free course → insert into enrollments
4. User enrolls in paid course → Stripe Checkout → webhook → insert enrollment + payment
5. User completes lesson → insert/update lesson_progress → recalculate enrollment.progress
6. User passes exam → insert certificate with unique code → award XP
