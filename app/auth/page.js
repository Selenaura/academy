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
            className="w-full bg-selene-gold text-selene-bg font-semibold text-[15px] py-3.5 rounded-xl btn-gold-hover disabled:opacity-50"
          >
            {loading ? 'Procesando...' : tab === 'register' ? 'Crear mi cuenta' : 'Entrar'}
          </button>
        </form>

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
