'use client';

import { useState, useEffect, useCallback } from 'react';

// Spanish women names + cities — realistic combinations
const PROOF_DATA = [
  { name: 'Laura', city: 'Madrid' },
  { name: 'Ana', city: 'Barcelona' },
  { name: 'Carmen', city: 'Valencia' },
  { name: 'Paula', city: 'Sevilla' },
  { name: 'Marta', city: 'Malaga' },
  { name: 'Sara', city: 'Zaragoza' },
  { name: 'Elena', city: 'Bilbao' },
  { name: 'Lucia', city: 'Alicante' },
  { name: 'Clara', city: 'Castellon' },
  { name: 'Irene', city: 'Granada' },
  { name: 'Alba', city: 'Murcia' },
  { name: 'Nuria', city: 'Palma' },
  { name: 'Julia', city: 'Valladolid' },
  { name: 'Maria', city: 'Vigo' },
  { name: 'Sofia', city: 'Gijon' },
  { name: 'Andrea', city: 'Cordoba' },
  { name: 'Daniela', city: 'Santander' },
  { name: 'Cristina', city: 'Pamplona' },
  { name: 'Teresa', city: 'San Sebastian' },
  { name: 'Rocio', city: 'Cadiz' },
  { name: 'Valeria', city: 'Tenerife' },
  { name: 'Marina', city: 'Las Palmas' },
  { name: 'Ines', city: 'Salamanca' },
  { name: 'Alejandra', city: 'Mexico DF' },
  { name: 'Camila', city: 'Bogota' },
  { name: 'Valentina', city: 'Buenos Aires' },
  { name: 'Fernanda', city: 'Lima' },
  { name: 'Isabella', city: 'Santiago' },
];

const ACTIONS = [
  'se ha inscrito en el curso gratuito',
  'ha empezado su carta natal',
  'se ha unido a Selene Academia',
  'ha completado su primera leccion',
];

function getRandomTime() {
  const mins = Math.floor(Math.random() * 25) + 2;
  return `hace ${mins} min`;
}

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const showToast = useCallback(() => {
    if (dismissed) return;
    const person = PROOF_DATA[Math.floor(Math.random() * PROOF_DATA.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setCurrent({ ...person, action, time: getRandomTime() });
    setVisible(true);

    // Auto-hide after 4s
    setTimeout(() => setVisible(false), 4000);
  }, [dismissed]);

  useEffect(() => {
    // Don't show on first 8 seconds — let user settle
    const initialDelay = setTimeout(() => {
      showToast();
    }, 8000);

    // Then show every 25-40 seconds
    const interval = setInterval(() => {
      showToast();
    }, 25000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [showToast]);

  if (!current || dismissed) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-[100] max-w-[320px] md:bottom-6 md:left-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="bg-selene-card/95 backdrop-blur-lg border border-selene-border rounded-xl px-4 py-3 shadow-2xl shadow-black/40 flex items-start gap-3">
        {/* Avatar circle */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-selene-gold/15 border border-selene-gold/30 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">
          {current.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-selene-white leading-snug">
            <span className="font-semibold">{current.name}</span>
            <span className="text-selene-white-dim"> de {current.city}</span>
          </p>
          <p className="text-[12px] text-selene-white-dim leading-snug mt-0.5">
            {current.action}
          </p>
          <p className="text-[10px] text-selene-white-dim/50 mt-1">{current.time}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
            setVisible(false);
          }}
          className="flex-shrink-0 text-selene-white-dim/30 hover:text-selene-white-dim text-xs mt-0.5"
          aria-label="Cerrar"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
