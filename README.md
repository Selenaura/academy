# 🌙 Selene Academia

**Tu escuela de consciencia cósmica** — Plataforma LMS completa con astrología, tarot, meditación y autoconocimiento respaldados por estudios peer-reviewed.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Auth + DB:** Supabase (Free tier)
- **Pagos:** Stripe
- **Hosting:** Vercel
- **Estilo:** Tailwind CSS + Quantum Ethereal design system
- **Dominio:** academia.selenaura.com

## Arquitectura

```
academia.selenaura.com
├── /                    → Landing page (pública)
├── /auth                → Login / Registro (Supabase Auth)
├── /auth/callback       → OAuth redirect (Google)
├── /onboarding          → Datos nacimiento → Ruta personalizada
├── /dashboard           → Hub principal (protegido)
├── /curso/[id]          → Detalle curso + lecciones + quizzes
├── /curso/[id]/certificado → Certificado descargable
├── /perfil              → Perfil + carta natal + settings
├── /api/checkout        → Crear sesión Stripe
└── /api/webhook         → Webhook Stripe (confirmar pagos)
```

## Setup rápido

### 1. Crear proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) → New Project
2. Nombre: `selene-academia` | Región: `eu-central-1`
3. En **SQL Editor**, ejecuta el contenido de `supabase-schema.sql`
4. En **Authentication → Providers**, activa:
   - Email (ya activo por defecto)
   - Google (necesita OAuth client en Google Cloud Console)
5. En **Authentication → URL Configuration**:
   - Site URL: `https://academia.selenaura.com`
   - Redirect URLs: `https://academia.selenaura.com/auth/callback`

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Rellena con tus credenciales de Supabase y Stripe.

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

### 4. Deploy en Vercel

```bash
# Opción A: CLI
npx vercel

# Opción B: GitHub
# 1. Push a GitHub (org Selenaura / repo selene-academia)
# 2. Importar en Vercel → seleccionar repo
# 3. Configurar env vars en Vercel dashboard
```

### 5. Configurar dominio

En Vercel → Settings → Domains → `academia.selenaura.com`

En Namecheap DNS:
```
CNAME  academia  cname.vercel-dns.com
```

### 6. Configurar Stripe Webhook

En Stripe Dashboard → Developers → Webhooks:
- URL: `https://academia.selenaura.com/api/webhook`
- Eventos: `checkout.session.completed`

## Costes mensuales

| Servicio | Plan | Coste |
|----------|------|-------|
| Supabase | Free | €0 (500MB DB, 50K auth users) |
| Vercel | Hobby | €0 (100GB bandwidth) |
| Stripe | Pay-as-you-go | 1.4% + €0.25/transacción |
| **Total fijo** | | **€0/mes** |

vs. Podia actual: **€39/mes → ahorro de €468/año**

## Estructura de archivos

```
selene-academia/
├── app/
│   ├── globals.css          # Tailwind + Quantum Ethereal
│   ├── layout.js            # Root layout + metadata
│   ├── page.js              # Landing page
│   ├── auth/
│   │   ├── page.js          # Login / Register
│   │   └── callback/route.js # OAuth callback
│   ├── onboarding/page.js   # 4-step onboarding
│   ├── dashboard/page.js    # Student hub
│   ├── curso/[id]/
│   │   ├── page.js          # Course detail + lessons
│   │   └── certificado/page.js # Certificate view
│   ├── perfil/page.js       # User profile
│   └── api/
│       ├── checkout/route.js # Stripe checkout
│       └── webhook/route.js  # Stripe webhook
├── components/ui/index.js   # Shared components
├── lib/
│   ├── constants.js         # Courses, levels, XP
│   ├── supabase-browser.js  # Client-side Supabase
│   └── supabase-server.js   # Server-side Supabase
├── middleware.js             # Auth protection
├── supabase-schema.sql      # Database schema
├── tailwind.config.js       # Design tokens
└── vercel.json              # Deploy config
```

## Próximos pasos

- [ ] Crear proyecto Supabase y ejecutar schema
- [ ] Configurar Google OAuth
- [ ] Crear productos en Stripe (precios por curso)
- [ ] Push a GitHub y deploy en Vercel
- [ ] Configurar DNS academia.selenaura.com
- [ ] Subir vídeos del Curso 1 (Cloudflare R2 o YouTube unlisted)
- [ ] Conectar Brevo para emails post-compra
- [ ] Pinterest Tag + Meta Pixel en academia subdomain

---

*Selene Academia — Ciencia y consciencia de lo invisible*
*selenaura.com*
