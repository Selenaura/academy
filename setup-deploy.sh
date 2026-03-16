#!/bin/bash
# ═══════════════════════════════════════════════
# SELENE ACADEMIA — Setup & Deploy Script
# Ejecutar desde la carpeta donde descomprimiste selene-academia.tar.gz
# ═══════════════════════════════════════════════

set -e

echo ""
echo "🌙 SELENE ACADEMIA — Setup & Deploy"
echo "════════════════════════════════════"
echo ""

# ── Step 1: Verify we're in the right directory ──
if [ ! -f "package.json" ]; then
  echo "❌ Error: Ejecuta este script desde la carpeta selene-academia/"
  echo "   cd selene-academia && bash setup-deploy.sh"
  exit 1
fi

echo "✅ Directorio correcto: $(pwd)"
echo ""

# ── Step 2: Install dependencies ──
echo "📦 Instalando dependencias..."
npm install
echo ""

# ── Step 3: Initialize git ──
echo "🔧 Inicializando repositorio git..."
git init
git add .
git commit -m "feat: Selene Academia — LMS completo

- Landing page con catálogo de cursos
- Auth con Supabase (email + Google OAuth)
- Onboarding con carta natal → ruta personalizada
- Dashboard con XP, racha, progreso
- Reproductor de vídeo + quizzes interactivos
- Certificados con código verificable
- Perfiles con carta natal integrada
- Stripe checkout + webhook para pagos
- Middleware de autenticación
- Schema SQL para Supabase (6 tablas + RLS)
- Tailwind CSS Quantum Ethereal design system

Stack: Next.js 14 + Supabase + Stripe + Tailwind
Target: academia.selenaura.com"

echo ""
echo "✅ Commit inicial creado"
echo ""

# ── Step 4: Create GitHub repo ──
echo "════════════════════════════════════"
echo "📋 PASO MANUAL — Crear repo en GitHub:"
echo ""
echo "  Opción A (GitHub CLI — recomendado):"
echo "    gh repo create Selenaura/selene-academia --private --source=. --push"
echo ""
echo "  Opción B (Manual):"
echo "    1. Ve a https://github.com/organizations/Selenaura/repositories/new"
echo "    2. Nombre: selene-academia"
echo "    3. Privado: Sí"
echo "    4. NO inicialices con README"
echo "    5. Ejecuta estos comandos:"
echo ""
echo "       git remote add origin git@github.com:Selenaura/selene-academia.git"
echo "       git branch -M main"
echo "       git push -u origin main"
echo ""
echo "════════════════════════════════════"
echo ""

read -p "¿Has hecho push a GitHub? (s/n): " pushed

if [ "$pushed" != "s" ]; then
  echo "⏸️  Cuando hagas push, continúa con los pasos de abajo."
  echo ""
fi

# ── Step 5: Vercel import instructions ──
echo ""
echo "════════════════════════════════════"
echo "📋 PASO MANUAL — Importar en Vercel:"
echo ""
echo "  1. Ve a https://vercel.com/selenauras-projects/~/new"
echo "  2. Import Git Repository → selecciona 'selene-academia'"
echo "  3. Framework Preset: Next.js (se auto-detecta)"
echo "  4. Environment Variables — añade estas:"
echo ""
echo "     NEXT_PUBLIC_SUPABASE_URL        = (tu URL de Supabase)"
echo "     NEXT_PUBLIC_SUPABASE_ANON_KEY   = (tu anon key)"
echo "     STRIPE_SECRET_KEY               = (tu sk_live_... o sk_test_...)"
echo "     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = (tu pk_live_... o pk_test_...)"
echo "     STRIPE_WEBHOOK_SECRET           = (después de crear el webhook)"
echo "     NEXT_PUBLIC_SITE_URL            = https://academia.selenaura.com"
echo ""
echo "  5. Click 'Deploy'"
echo ""
echo "════════════════════════════════════"
echo ""

# ── Step 6: Domain setup instructions ──
echo "════════════════════════════════════"
echo "📋 PASO MANUAL — Configurar dominio:"
echo ""
echo "  En Vercel → selene-academia → Settings → Domains:"
echo "    Añadir: academia.selenaura.com"
echo ""
echo "  En Namecheap → Advanced DNS:"
echo "    Type: CNAME"
echo "    Host: academia"
echo "    Value: cname.vercel-dns.com"
echo "    TTL: Automatic"
echo ""
echo "════════════════════════════════════"
echo ""

echo "🌙 ¡Listo! Cuando completes los pasos, tu academia estará en:"
echo "   https://academia.selenaura.com"
echo ""
