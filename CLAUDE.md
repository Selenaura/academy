# Selene Academia

## Why
LMS de cursos de espiritualidad en español. Marca: SelenaUra. Los cursos combinan tradición (astrología, tarot, meditación) con estudios peer-reviewed (HeartMath, cronobiología, neuroplasticidad).

## What
Next.js 14 (App Router) · Tailwind CSS · Supabase (Auth + Postgres + RLS) · Stripe
Deploy: academy.selenaura.com vía Vercel (auto-deploy on push to main)
Supabase tables: profiles, enrollments, lesson_progress, quiz_attempts, certificates, payments

## How
Verify: `npm run build` — must pass before every commit.
Commit style: `feat:` `fix:` `style:` `refactor:` in English.

## Constraints
- UI text always in Spanish. Never write "IA", "AI", or "inteligencia artificial" in the interface.
- Init Stripe/Supabase clients INSIDE handler functions, never at module level (causes build errors).
- Wrap useSearchParams() in <Suspense> (Next.js 14 requirement).
- Reuse components from components/ui/index.js before creating new ones.
- No placeholder text. Real content always.

## Context docs
Read these BEFORE working on related areas:
- `agent_docs/architecture.md` — file map, routing, data flow
- `agent_docs/design.md` — Quantum Ethereal design system, colors, fonts, Tailwind classes
- `agent_docs/database.md` — Supabase schema, RLS policies, relations

## Planes de sesion
Si el usuario pide ejecutar una sesion del plan, lee el archivo correspondiente en:
`C:\Users\irene\Desktop\SELENE\docs\sesiones\sesion-XX-nombre.md`

Archivos disponibles:
- sesion-03-skill-blog-post.md — Skill /blog-post + 5 articulos (academy)
- sesion-04-segmentacion-signos.md — Segmentacion email por signo (academy + selenaura-main)

## Documentacion interna
- Manual de operaciones: `C:\Users\irene\Desktop\SELENE\docs\manual_operaciones_selenaura.html`
- Plan ejecutivo: `C:\Users\irene\Desktop\SELENE\docs\plan_ejecutivo_selenaura.md`
- Brevo listas: ID 3 (Lead Magnet), ID 4 (Waitlist Master)
- Brevo atributos: FUENTE, FECHA_REGISTRO, SIGNO
