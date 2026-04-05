'use client';

import { useState } from 'react';

/**
 * Lead capture form that sends email to /api/lead-capture.
 * Shows inline in landing pages (Mexico, Argentina, etc.)
 * Props:
 *   source - string to tag the lead source (e.g. 'web_mexico', 'web_argentina')
 *   headline - optional custom headline
 *   subtext - optional custom subtext
 *   country - 'mx' | 'ar' | 'es' for localized CTA text
 */
export default function LeadCaptureForm({
  source = 'web_form',
  headline = 'Descarga gratis: 5 errores que comete toda guía espiritual sin formación',
  subtext = 'Una guía con datos reales (APA, neurociencia) que te muestra los riesgos de guiar sin método — y cómo evitarlos.',
  country = 'es',
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const cta = country === 'ar' ? 'Quiero la guía gratis' : 'Quiero la guía gratis';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-selene-gold/30 bg-selene-gold/5 p-8 text-center">
        <div className="text-3xl mb-3">✨</div>
        <h3 className="font-display text-xl text-selene-gold mb-2">
          ¡Revisa tu email!
        </h3>
        <p className="text-sm text-selene-white-dim">
          Te hemos enviado la guía. Si no la ves en unos minutos, revisa tu carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-selene-gold/30 bg-gradient-to-br from-selene-card to-selene-bg p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Left: copy */}
        <div className="flex-1">
          <div className="inline-block text-[10px] font-bold text-selene-success uppercase tracking-wider bg-selene-success/10 px-3 py-1 rounded-full mb-3">
            GRATIS — PDF descargable
          </div>
          <h3 className="font-display text-lg text-selene-white mb-2 leading-tight">
            {headline}
          </h3>
          <p className="text-[13px] text-selene-white-dim leading-relaxed">
            {subtext}
          </p>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} className="flex-shrink-0 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="px-4 py-3 rounded-xl bg-selene-bg border border-selene-border text-selene-white text-sm placeholder:text-selene-white-dim/40 focus:border-selene-gold/50 focus:outline-none w-full sm:w-64"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-selene-gold text-selene-bg text-sm font-semibold hover:brightness-110 transition disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Enviando...' : cta}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-xs text-red-400 mt-2">
              Error al enviar. Inténtalo de nuevo.
            </p>
          )}
          <p className="text-[10px] text-selene-white-dim/40 mt-2 leading-relaxed">
            Responsable: SelenaUra. Finalidad: envio de la guia y comunicaciones formativas.
            Base legal: consentimiento (art. 6.1.a RGPD). Derechos: acceso, rectificacion, supresion
            escribiendo a info@selenaura.com.{' '}
            <a href="/privacidad" className="underline hover:text-selene-white-dim">Privacidad</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
