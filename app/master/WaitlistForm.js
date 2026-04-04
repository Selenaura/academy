'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.duplicate
          ? 'Ya estabas en la lista. Te avisaremos pronto.'
          : 'Hecho. Te avisaremos con todos los detalles.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Algo ha fallado. Intentalo de nuevo.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de conexion. Intentalo de nuevo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-selene-success/10 border border-selene-success/20 rounded-xl p-6 text-center">
        <p className="text-lg text-selene-success mb-1">&#10003;</p>
        <p className="text-sm text-selene-white font-medium">{message}</p>
        <p className="text-xs text-selene-white-dim mt-2">Revisa tu bandeja de entrada (y spam).</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-5 py-3.5 rounded-xl bg-selene-elevated border border-selene-border text-selene-white text-sm placeholder:text-selene-white-dim/40 focus:border-selene-gold/50 focus:outline-none transition"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-8 py-3.5 rounded-xl bg-selene-gold text-selene-bg font-semibold text-sm hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {status === 'loading' ? 'Enviando...' : 'Avisame'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-selene-rose mt-1 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
