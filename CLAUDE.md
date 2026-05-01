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

## ⚠️ Antipatrón crítico — Supabase pagination silent cap

**NUNCA** uses `.from('tabla').select()` directamente en endpoints que sirven analytics, agregaciones o conteos sobre tablas que pueden crecer >1.000 filas.

**Por qué**: Supabase REST tiene un cap implícito de 1.000 rows. El cliente JS no tira error; devuelve un array de 1.000 elementos como si fuera "todo". Bug silente que hizo que el dashboard `/analytics` mostrara `leads_today: 0` el 28/04/2026 cuando había 24 leads ese día (estaban en filas 1001-1091 que el endpoint nunca cargaba).

**Tablas afectadas** (potencialmente >1.000 rows): `leads`, `payments`, `enrollments`, `lesson_progress`, `quiz_attempts`, `compliance_audit_log`.

**Tablas seguras** (acotadas o limit explícito): zodiac signs (12), cron jobs, productos hardcoded.

### Reglas

1. **Para cargar todos los rows** (ej. analytics agregadas): usar `fetchAllPaged()` de `lib/supabase-paged.js`.
   ```js
   import { fetchAllPaged } from '@/lib/supabase-paged';
   const allLeads = await fetchAllPaged(admin, 'leads', 'id, email, created_at');
   ```

2. **Para conteos exactos**: usar `countRows()` (más eficiente que descargar y contar).
   ```js
   const total = await countRows(admin, 'leads');
   ```

3. **Para listados con paginación de UI** (ej. tabla con paginate): usar `.range(start, end)` explícito.
   ```js
   admin.from('leads').select('*').range(0, 19).order('created_at', { ascending: false });
   ```

### Defensa

- **Capa 1 (preventiva)**: helper centralizado en `lib/supabase-paged.js`. Cualquier query agregada debe pasar por aquí.
- **Capa 2 (detectiva)**: `scripts/smoke-analytics.mjs` — corre antes de cada deploy importante.
  ```bash
  node --env-file=.env.local scripts/smoke-analytics.mjs
  ```
- **Capa 3 (alertiva)**: cron `/api/cron/analytics-healthcheck` (06:30 UTC daily). Manda email a `info@selenaura.com` si detecta drift entre DB y endpoint. Disable: `ANALYTICS_ALERT_EMAIL=off` env var.

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
