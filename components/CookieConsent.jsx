'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'selene_cookie_consent';
const CONSENT_MAX_AGE_DAYS = 365;

function getConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Check if consent has expired (12 months)
    if (parsed.timestamp && Date.now() - parsed.timestamp > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(categories) {
  const consent = {
    necessary: true,
    analytics: categories.analytics || false,
    marketing: categories.marketing || false,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
}

// Exported so other components (e.g., footer link) can reopen the banner
export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('openCookieSettings'));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    }

    const handleReopen = () => {
      const current = getConsent();
      setAnalytics(current?.analytics || false);
      setMarketing(current?.marketing || false);
      setShowConfig(true);
      setVisible(true);
    };

    window.addEventListener('openCookieSettings', handleReopen);
    return () => window.removeEventListener('openCookieSettings', handleReopen);
  }, []);

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
  };

  const saveSelection = () => {
    saveConsent({ analytics, marketing });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Configuración de cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto rounded-2xl border border-[#2A2A35] bg-[#12121A] shadow-2xl shadow-black/60 p-5 sm:p-6">
        {/* Header text */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Usamos cookies para analizar el tráfico y personalizar anuncios. Las cookies necesarias
          siempre están activas. Puedes aceptar, rechazar o configurar tus preferencias.{' '}
          <Link href="/cookies" className="text-[#C9A84C] underline underline-offset-2 hover:brightness-110">
            Política de cookies
          </Link>
        </p>

        {/* Category toggles (expanded) */}
        {showConfig && (
          <div className="mb-4 space-y-3">
            {/* Necessary - always on */}
            <div className="flex items-center justify-between rounded-lg border border-[#2A2A35] bg-[#0A0A0F] px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">Necesarias</span>
                <p className="text-xs text-gray-500 mt-0.5">Imprescindibles para el funcionamiento del sitio</p>
              </div>
              <span className="text-xs text-gray-500 italic">Siempre activas</span>
            </div>

            {/* Analytics */}
            <label className="flex items-center justify-between rounded-lg border border-[#2A2A35] bg-[#0A0A0F] px-4 py-3 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-white">Analíticas</span>
                <p className="text-xs text-gray-500 mt-0.5">Google Analytics 4 — nos ayuda a mejorar la experiencia</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-5 h-5 rounded accent-[#C9A84C] cursor-pointer"
              />
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between rounded-lg border border-[#2A2A35] bg-[#0A0A0F] px-4 py-3 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-white">Marketing</span>
                <p className="text-xs text-gray-500 mt-0.5">Meta Pixel — anuncios personalizados en redes sociales</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="w-5 h-5 rounded accent-[#C9A84C] cursor-pointer"
              />
            </label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {!showConfig ? (
            <>
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#2A2A35] text-sm font-semibold text-white bg-transparent hover:bg-white/5 transition"
              >
                Rechazar todo
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#2A2A35] text-sm font-semibold text-white bg-transparent hover:bg-white/5 transition"
              >
                Configurar
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#C9A84C] text-[#0A0A0F] hover:brightness-110 transition"
              >
                Aceptar todo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#2A2A35] text-sm font-semibold text-white bg-transparent hover:bg-white/5 transition"
              >
                Rechazar todo
              </button>
              <button
                onClick={saveSelection}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#C9A84C] text-[#0A0A0F] hover:brightness-110 transition"
              >
                Guardar preferencias
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
