# Task Plan

## Phase 1 — Stability
- [x] Add error boundaries to dashboard, curso/[id], perfil, onboarding (wrap in try/catch or ErrorBoundary component)
- [x] Add loading states: show Spinner while checking auth on protected pages
- [x] Create app/not-found.js with Quantum Ethereal styling and link back to home
- [x] Fix mobile responsiveness: test all pages at 375px, fix overflow/spacing issues
- [x] Run npm run build and fix any warnings or errors

## Phase 2 — Wire real data
- [x] Onboarding: save birth_date, birth_city, interests, experience_level to profiles table on completion
- [x] Dashboard: fetch user enrollments from Supabase, replace hardcoded mock data
- [x] Dashboard: load XP and streak from profiles table
- [x] Course enrollment: clicking "Inscribirse gratis" inserts row into enrollments table
- [x] Lesson progress: mark lesson as completed in lesson_progress table when user finishes video/quiz
- [x] Quiz: save attempt to quiz_attempts table with score and answers
- [x] Profile: load real name, birth data, XP from profiles table

## Phase 3 — Complete features
- [x] Move quiz questions to lib/constants.js (at least 3 questions per quiz lesson in course 1)
- [x] Group lessons by module number in course detail view
- [x] Certificate: on exam pass, generate unique code (SEL-YYYY-XXXX) and insert into certificates table
- [x] Certificate verification: create /verificar/[code] public page that checks certificates table
- [ ] Video player: create YouTube embed component for unlisted videos
- [ ] Stripe checkout: wire "Comprar" button to /api/checkout and redirect to Stripe
- [ ] Auto-navigate to next lesson after completing current one

## Phase 4 — Polish
- [ ] Add hover effects on all cards and buttons
- [ ] Add page load animations (fade-in on mount)
- [ ] SEO: add og:image meta, JSON-LD Course schema on landing and course pages
- [ ] Add sitemap.xml and robots.txt
- [ ] Accessibility: add aria-labels to icon buttons and nav elements
