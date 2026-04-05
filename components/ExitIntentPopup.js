'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_SUBMITTED = 'selene_lead_submitted';
const SESSION_KEY_SHOWN = 'selene_exit_popup_shown';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [fadingIn, setFadingIn] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY_SHOWN)) return;
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED)) return;
    sessionStorage.setItem(SESSION_KEY_SHOWN, '1');
    setVisible(true);
    // trigger fade-in on next frame
    requestAnimationFrame(() => setFadingIn(true));
  }, []);

  const close = useCallback(() => {
    setFadingIn(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  useEffect(() => {
    // Already submitted or already shown this session
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED)) return;
    if (sessionStorage.getItem(SESSION_KEY_SHOWN)) return;

    // Desktop: mouse leaves viewport from top
    function handleMouseLeave(e) {
      if (e.clientY <= 0) show();
    }
    document.addEventListener('mouseleave', handleMouseLeave);

    // Mobile: quick scroll up (swipe to leave)
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();

    function handleScroll() {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const dt = currentTime - lastTime;
      const dy = lastScrollY - currentY; // positive = scrolling up

      if (dt > 0 && dy > 0) {
        const speed = dy / dt; // px per ms
        // Fast upward scroll near top of page
        if (speed > 2 && currentY < 200) {
          show();
        }
      }

      lastScrollY = currentY;
      lastTime = currentTime;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [show]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'exit_intent' }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem(STORAGE_KEY_SUBMITTED, '1');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: fadingIn ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
        transition: 'background-color 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        style={{
          opacity: fadingIn ? 1 : 0,
          transform: fadingIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
        className="relative w-full max-w-md rounded-2xl border-2 border-selene-gold/50 bg-gradient-to-br from-selene-card to-selene-bg p-8 shadow-2xl shadow-selene-gold/10"
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-selene-white-dim hover:text-selene-white hover:bg-selene-white/10 transition text-xl leading-none"
          aria-label="Cerrar"
        >
          &times;
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">&#10024;</div>
            <h3 className="font-display text-xl text-selene-gold mb-2">
              &#161;Revisa tu email!
            </h3>
            <p className="text-sm text-selene-white-dim">
              Te hemos enviado la gu&#237;a. Si no la ves en unos minutos, revisa tu carpeta de spam.
            </p>
            <button
              onClick={close}
              className="mt-6 px-6 py-2 rounded-xl bg-selene-gold/20 text-selene-gold text-sm hover:bg-selene-gold/30 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-block text-[10px] font-bold text-selene-success uppercase tracking-wider bg-selene-success/10 px-3 py-1 rounded-full mb-3">
                GRATIS &mdash; PDF descargable
              </div>
              <h3 className="font-display text-xl text-selene-white mb-2 leading-tight">
                Espera... &#191;te vas sin tu gu&#237;a gratuita?
              </h3>
              <p className="text-lg font-display text-selene-gold mb-3">
                5 errores que comete toda gu&#237;a espiritual
              </p>
              <p className="text-[13px] text-selene-white-dim leading-relaxed">
                Una gu&#237;a con datos reales (APA, neurociencia) que te muestra los riesgos
                de guiar sin m&#233;todo &mdash; y c&#243;mo evitarlos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                required
                className="w-full px-4 py-3 rounded-xl bg-selene-bg border border-selene-border text-selene-white text-sm placeholder:text-selene-white-dim/40 focus:border-selene-gold/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 rounded-xl bg-selene-gold text-selene-bg text-sm font-semibold hover:brightness-110 transition disabled:opacity-50"
              >
                {status === 'loading' ? 'Enviando...' : 'Quiero la gu\u00EDa gratis'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-400 text-center">
                  Error al enviar. Int&#233;ntalo de nuevo.
                </p>
              )}
              <p className="text-[10px] text-selene-white-dim/40 text-center leading-relaxed">
                Responsable: SelenaUra. Finalidad: envio de la guia y comunicaciones formativas.
                Base legal: consentimiento (art. 6.1.a RGPD). Puedes ejercer tus derechos o darte de baja
                en cualquier momento escribiendo a info@selenaura.com.{' '}
                <a href="/privacidad" className="underline hover:text-selene-white-dim" target="_blank" rel="noopener noreferrer">
                  Politica de privacidad
                </a>.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
