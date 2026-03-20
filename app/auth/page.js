'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MoonIcon } from '@/components/ui';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="text-selene-gold text-lg">Cargando...</div>
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

  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, onboarding_complete: false },
          },
        });
        if (signUpError) throw signUpError;
        router.push('/onboarding');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/dashboard');
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

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  const inputClass = "w-full px-4 py-3.5 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50";

  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <MoonIcon size={28} />
            <span className="font-display text-[26px] text-selene-gold tracking-wider">SELENE</span>
          </Link>
          <p className="text-[13px] text-selene-white-dim mt-2">Tu escuela de consciencia cósmica</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-0 mb-8 bg-selene-card rounded-xl p-1 border border-selene-border">
          {['register', 'login'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition ${
                tab === t
                  ? 'bg-selene-elevated text-selene-white border border-selene-border'
                  : 'text-selene-white-dim border border-transparent'
              }`}
            >
              {t === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-selene-card rounded-2xl border border-selene-border p-7">
          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="mb-4">
                <label className="text-xs text-selene-white-dim block mb-1.5">Nombre</label>
                <input
                  className={inputClass}
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-selene-white-dim block mb-1.5">Email</label>
              <input
                className={inputClass}
                placeholder="tu@email.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-selene-white-dim block mb-1.5">Contraseña</label>
              <input
                className={inputClass}
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-selene-rose/10 border border-selene-rose/20 text-sm text-selene-rose">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-selene-gold text-selene-bg font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? 'Procesando...' : tab === 'register' ? 'Crear mi cuenta' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-selene-border" />
            <span className="text-[11px] text-selene-white-dim">o continúa con</span>
            <div className="flex-1 h-px bg-selene-border" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-selene-gold/30 text-selene-gold text-sm font-medium hover:bg-selene-gold/5 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        {tab === 'register' && (
          <p className="text-center text-[11px] text-selene-white-dim mt-4 leading-relaxed">
            Al crear tu cuenta aceptas los{' '}
            <Link href="/legal" className="text-selene-gold/70 hover:text-selene-gold no-underline">Términos de Uso</Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-selene-gold/70 hover:text-selene-gold no-underline">Política de Privacidad</Link>
          </p>
        )}
      </div>
    </div>
  );
}
