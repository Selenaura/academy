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
