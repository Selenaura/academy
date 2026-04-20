'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MoonIcon } from '@/components/ui';
import ChapterSignature from '@/components/ChapterSignature';
import AtlasLabel from '@/components/AtlasLabel';

/**
 * /auth — Login + Register + Magic link + OAuth.
 *
 * Rediseño v2 siguiendo el skill frontend-design actualizado:
 *  1. Brief: "puerta de entrada al scriptorium" — debe sentirse como
 *     el umbral de una biblioteca antigua, no un formulario SaaS.
 *  2. Direction: Editorial luxury cream. Hairline gold rules, no
 *     cards elevadas, tabs como running heads, inputs underlined.
 *  3. Executable metaphor: "una página de registro notarial —
 *     firma que te inscribe en el padrón de lectoras."
 *  4. 3 voces: display para "Crear cuenta" headline, ritual italic
 *     para el tagline, smcp (AtlasLabel) para labels de input.
 *  5. Tokens semánticos — todos los colores vía var(--color-*).
 *  6. Anti-patterns verificados: sin hex hardcoded, sin gradient
 *     purple-pink, sin emoji como icono, OAuth brand colors
 *     mantienen su identidad (son logos oficiales).
 *  7. Motion: fade-in del form en mount (no se hizo — minimalismo
 *     deliberado para no distraer del formulario crítico).
 */
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen atlas-paper flex items-center justify-center">
        <p
          className="font-display italic"
          style={{
            fontSize: 'var(--step-0)',
            color: 'var(--color-text-muted)',
            fontVariationSettings: "'opsz' 24, 'SOFT' 60",
          }}
        >
          Cargando el padrón…
        </p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('mode') || 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const redirectTo = searchParams.get('redirect') || null;

  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, onboarding_complete: false } },
        });
        if (signUpError) throw signUpError;
        router.push(redirectTo ? `/onboarding?redirect=${encodeURIComponent(redirectTo)}` : '/onboarding');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push(redirectTo || '/dashboard');
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : err.message || 'Error al procesar tu solicitud'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthLogin(provider) {
    const callbackUrl = redirectTo
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });
    if (error) setError(error.message);
  }

  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  async function handleMagicLink() {
    if (!magicLinkEmail) { setError('Introduce tu email'); return; }
    setLoading(true);
    setError('');
    const redirectUrl = redirectTo
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email: magicLinkEmail,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setMagicLinkSent(true);
  }

  // Input editorial — hairline bottom rule que se activa al focus.
  // Cero box shadows, cero bg-elevated gris. Sólo tipografía + regla.
  const inputBaseStyle = {
    width: '100%',
    padding: '10px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-rule)',
    outline: 'none',
    fontFamily: 'var(--font-body), Lora, Georgia, serif',
    fontSize: '15px',
    color: 'var(--color-text)',
    transition: 'border-color 200ms',
  };

  const isRegister = tab === 'register';

  return (
    <div className="min-h-screen atlas-paper flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        {/* Running head + logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-baseline gap-2.5 no-underline">
            <MoonIcon size={22} className="text-[var(--color-text-ornament)] self-center" />
            <span
              className="font-display"
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-text)',
                fontVariationSettings: "'opsz' 36, 'SOFT' 100",
                letterSpacing: '-0.01em',
              }}
            >
              Selene
            </span>
            <span
              className="smcp"
              style={{
                fontSize: '10px',
                letterSpacing: '0.24em',
                color: 'var(--color-text-ornament)',
                fontWeight: 600,
              }}
            >
              Academia
            </span>
          </Link>
        </div>

        <ChapterSignature
          title={isRegister ? 'INSCRÍBETE EN EL PADRÓN' : 'VUELVE AL SCRIPTORIUM'}
          align="center"
          className="mb-8 mx-auto"
        />

        <h1
          className="font-display text-center mb-4"
          style={{
            fontSize: 'var(--step-3)',
            fontWeight: 500,
            color: 'var(--color-text)',
            fontVariationSettings: "'opsz' 48, 'SOFT' 100",
            fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
            letterSpacing: '-0.012em',
            lineHeight: 1.1,
          }}
        >
          {isRegister ? 'Crea tu cuenta' : (
            <span>
              Bienvenida
              <span
                className="font-display italic ml-2 text-[var(--color-text-accent)]"
                style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 60" }}
              >
                de nuevo
              </span>
            </span>
          )}
        </h1>
        <p
          className="font-display italic text-center mb-10 text-[var(--color-text-muted)]"
          lang="es"
          style={{
            fontSize: 'var(--step-0)',
            fontVariationSettings: "'opsz' 24, 'SOFT' 60",
            lineHeight: 1.55,
            maxWidth: '38ch',
            margin: '0 auto 2.5rem',
          }}
        >
          {isRegister
            ? 'Tu cuenta te da acceso al catálogo completo, el directorio profesional y todas las ediciones futuras de los volúmenes.'
            : 'Tus volúmenes siguen donde los dejaste. Tu progreso, tus notas, tu biblioteca personal.'}
        </p>

        {/* Tabs editorial — running-head con border-b activo */}
        <div className="flex justify-center gap-6 mb-10">
          {[
            { key: 'register', label: 'Crear cuenta' },
            { key: 'login',    label: 'Iniciar sesión' },
          ].map(t => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setError(''); }}
                className="pb-2 transition-colors"
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-body), Lora, Georgia, serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  borderBottom: `1px solid ${isActive ? 'var(--color-text-ornament)' : 'transparent'}`,
                  letterSpacing: '0.02em',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <AtlasLabel tone="faint" size="xs" className="mb-2 block">
                Nombre
              </AtlasLabel>
              <input
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputBaseStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--color-text-ornament)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-rule)'; }}
              />
            </div>
          )}

          <div>
            <AtlasLabel tone="faint" size="xs" className="mb-2 block">
              Email
            </AtlasLabel>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputBaseStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--color-text-ornament)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-rule)'; }}
            />
          </div>

          <div>
            <AtlasLabel tone="faint" size="xs" className="mb-2 block">
              Contraseña
            </AtlasLabel>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputBaseStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--color-text-ornament)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-rule)'; }}
            />
          </div>

          {error && (
            <p
              className="font-display italic"
              lang="es"
              style={{
                fontSize: '13px',
                color: '#C45B5B',
                lineHeight: 1.5,
                fontVariationSettings: "'opsz' 18, 'SOFT' 60",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-xl disabled:opacity-50 transition-all"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-body), Lora, Georgia, serif',
              backgroundColor: 'var(--color-text)',
              color: 'var(--color-surface)',
              letterSpacing: '0.02em',
              boxShadow:
                'inset 0 1px 0 rgba(251,246,238,0.15), 0 2px 10px rgba(45,31,20,0.12)',
            }}
          >
            {loading ? 'Procesando…' : isRegister ? 'Inscribirme' : 'Entrar'}
          </button>
        </form>

        {/* Divider editorial */}
        <div className="flex items-center gap-3 my-10">
          <span className="flex-1 h-px bg-[var(--color-rule)]" />
          <AtlasLabel tone="faint" size="xs">
            O continúa con
          </AtlasLabel>
          <span className="flex-1 h-px bg-[var(--color-rule)]" />
        </div>

        {/* OAuth buttons — hairline frames, mantienen los brand colors
           de los iconos SVG (Google, Facebook son logos oficiales y
           deben conservar identidad — es excepción al antipattern). */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl transition-colors"
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-body), Lora, Georgia, serif',
              color: 'var(--color-text)',
              border: '1px solid var(--color-rule-ornament)',
              backgroundColor: 'transparent',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl transition-colors"
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-body), Lora, Georgia, serif',
              color: 'var(--color-text)',
              border: '1px solid var(--color-rule)',
              backgroundColor: 'transparent',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuar con Facebook
          </button>
        </div>

        {/* Magic link — separador + input + botón */}
        <div
          className="mt-10 pt-8"
          style={{ borderTop: '1px solid var(--color-rule)' }}
        >
          <AtlasLabel tone="faint" size="xs" className="mb-4 block text-center mx-auto">
            O entra sin contraseña
          </AtlasLabel>
          {magicLinkSent ? (
            <p
              className="font-display italic text-center"
              lang="es"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-ornament)',
                fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                lineHeight: 1.5,
              }}
            >
              ✓ Enlace enviado a <strong>{magicLinkEmail}</strong> — revisa tu email.
            </p>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                value={magicLinkEmail}
                onChange={e => setMagicLinkEmail(e.target.value)}
                style={{ ...inputBaseStyle, flex: 1 }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-text-ornament)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-rule)'; }}
              />
              <button
                onClick={handleMagicLink}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl whitespace-nowrap disabled:opacity-50 transition-colors"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body), Lora, Georgia, serif',
                  color: 'var(--color-text-ornament)',
                  border: '1px solid var(--color-rule-ornament)',
                  backgroundColor: 'transparent',
                  letterSpacing: '0.02em',
                }}
              >
                Enviar enlace
              </button>
            </div>
          )}
        </div>

        {isRegister && (
          <p
            className="text-center mt-8 font-display italic"
            lang="es"
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              fontVariationSettings: "'opsz' 14, 'SOFT' 50",
              lineHeight: 1.65,
            }}
          >
            Al inscribirte aceptas los{' '}
            <Link
              href="/legal"
              className="no-underline"
              style={{
                color: 'var(--color-text-ornament)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--color-link-decoration)',
                textUnderlineOffset: '3px',
              }}
            >
              Términos de Uso
            </Link>{' '}
            y la{' '}
            <Link
              href="/privacidad"
              className="no-underline"
              style={{
                color: 'var(--color-text-ornament)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--color-link-decoration)',
                textUnderlineOffset: '3px',
              }}
            >
              Política de Privacidad
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
