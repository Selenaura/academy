'use client';

import { useState, useEffect } from 'react';

/**
 * Cohort-based urgency banner — displays a countdown to the next enrollment deadline.
 * This is REAL scarcity: new cohorts start on fixed dates with genuine deadlines.
 * Compliant with Directiva Omnibus (EU 2019/2161).
 */

// ── Active sorteo (set to null when no sorteo is running) ──
const ACTIVE_SORTEO = {
  endDate: '2026-04-25T23:59:59',
  headline: '🎁 Sorteo activo — Gana tu matrícula GRATIS al Máster en Guía Espiritual',
  cta: 'Participar →',
  link: 'https://selenaura.com/sorteo?from=academy',
};

// Next cohort start dates (update manually for each cohort)
const COHORT_DEADLINES = [
  { date: '2026-04-20T23:59:59', label: 'Edición Primavera 2026' },
  { date: '2026-07-15T23:59:59', label: 'Edición Verano 2026' },
  { date: '2026-10-01T23:59:59', label: 'Edición Otoño 2026' },
];

function getNextDeadline() {
  const now = new Date();
  for (const cohort of COHORT_DEADLINES) {
    const deadline = new Date(cohort.date);
    if (deadline > now) return { deadline, label: cohort.label };
  }
  return null;
}

function getTimeLeft(deadline) {
  const now = new Date();
  const diff = deadline - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

export default function CohortBanner() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const next = getNextDeadline();
    if (!next) return;
    setCohort(next);
    setTimeLeft(getTimeLeft(next.deadline));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(next.deadline));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  // Show sorteo banner if active (takes priority over cohort)
  if (ACTIVE_SORTEO && new Date(ACTIVE_SORTEO.endDate) > new Date()) {
    return (
      <div className="bg-gradient-to-r from-[#1a0f14] via-[#1f1018] to-[#1a0f14] border-b border-[#C97B8B]/20 relative">
        <div className="max-w-[900px] mx-auto px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap text-center">
          <span className="text-[#C97B8B] text-sm animate-pulse">✦</span>
          <span className="text-[12px] sm:text-[13px] text-selene-white font-medium">
            {ACTIVE_SORTEO.headline}
          </span>
          <a
            href={ACTIVE_SORTEO.link}
            className="text-[11px] sm:text-[12px] font-semibold bg-[#D4A843] text-[#0A0A0F] px-4 py-1.5 rounded-lg hover:brightness-110 no-underline transition-all whitespace-nowrap"
          >
            {ACTIVE_SORTEO.cta}
          </a>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-selene-white-dim/30 hover:text-selene-white-dim text-sm"
          aria-label="Cerrar"
        >&times;</button>
      </div>
    );
  }

  if (!timeLeft || !cohort) return null;

  return (
    <div className="bg-gradient-to-r from-[#1a1308] via-[#1f1a0a] to-[#1a1308] border-b border-selene-gold/20 relative">
      <div className="max-w-[900px] mx-auto px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap text-center">
        <span className="text-selene-gold text-sm animate-pulse">✦</span>
        <span className="text-[12px] sm:text-[13px] text-selene-white">
          <span className="text-selene-gold font-semibold">{cohort.label}</span>
          <span className="text-selene-white-dim"> — Inscripciones cierran en </span>
          <span className="text-selene-white font-bold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-selene-white-dim/30 hover:text-selene-white-dim text-sm"
        aria-label="Cerrar"
      >&times;</button>
    </div>
  );
}
