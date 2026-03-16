'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MoonIcon } from '@/components/ui';

function AuthForm() {
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

  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  async function handleOAuthLogin(provider) {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
        const names = { google: 'Google', apple: 'Apple', github: 'GitHub' };
        setError(`El acceso con ${names[provider] || provider} no está disponible todavía. Usa email y contraseña o Magic Link.`);
      } else {
        setError(error.message);
      }
    }
  }

  async function handleMagicLink() {
    if (!magicLinkEmail) return;
    setError('');
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: magicLinkEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpError) throw otpError;
      setMagicLinkSent(true);
    } catch (err) {
      setError(err.message || 'Error al enviar el enlace');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3.5 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50";

  return (
    <div className="w-full max-w-[420px]">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 no-underline">
          <MoonIcon size={28} />
          <span className="font-display text-[26px] text-selene-gold tracking-wider">SELENE</span>
        </Link>
        <p className="text-[13px] text-selene-white-dim mt-2">Tu escuela de consciencia cosmica</p>
      </div>

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
            {t === 'register' ? 'Crear cuenta' : 'Iniciar sesion'}
          </button>
        ))}
      </div>

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
            <label className="text-xs text-selene-white-dim block mb-1.5">Contrasena</label>
            <input
              className={inputClass}
              placeholder="--------"
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

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-selene-border" />
          <span className="text-[11px] text-selene-white-dim">o continúa con</span>
          <div className="flex-1 h-px bg-selene-border" />
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Google */}
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-selene-border text-selene-white text-sm font-medium hover:bg-selene-elevated/50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          {/* Apple */}
          <button
            onClick={() => handleOAuthLogin('apple')}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-selene-border text-selene-white text-sm font-medium hover:bg-selene-elevated/50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continuar con Apple
          </button>

          {/* GitHub */}
          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-selene-border text-selene-white text-sm font-medium hover:bg-selene-elevated/50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continuar con GitHub
          </button>
        </div>

        {/* Magic Link */}
        <div className="mt-6 pt-6 border-t border-selene-border">
          <p className="text-[11px] text-selene-white-dim mb-3 text-center">Acceder sin contraseña</p>
          {magicLinkSent ? (
            <div className="text-center p-4 rounded-xl bg-selene-success/10 border border-selene-success/20">
              <p className="text-sm text-selene-success">Enlace enviado a {magicLinkEmail}</p>
              <p className="text-[11px] text-selene-white-dim mt-1">Revisa tu bandeja de entrada</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                className={inputClass}
                placeholder="tu@email.com"
                value={magicLinkEmail}
                onChange={e => setMagicLinkEmail(e.target.value)}
              />
              <button
                onClick={handleMagicLink}
                disabled={loading || !magicLinkEmail}
                className="shrink-0 bg-selene-elevated border border-selene-border text-selene-gold text-sm font-medium px-4 py-3 rounded-xl hover:border-selene-gold/30 transition disabled:opacity-40"
              >
                Enviar enlace
              </button>
            </div>
          )}
        </div>
      </div>

      {tab === 'register' && (
        <p className="text-center text-[11px] text-selene-white-dim mt-4 leading-relaxed">
          Al crear tu cuenta aceptas los Terminos de Uso y la Politica de Privacidad
        </p>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6 py-12">
      <Suspense fallback={
        <div className="w-12 h-12 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}
