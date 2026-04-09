'use client';

import { useState, useEffect } from 'react';

const TOTAL_SPOTS = 20;

export default function SpotsCounter() {
  const [remaining, setRemaining] = useState(TOTAL_SPOTS);

  useEffect(() => {
    // In production, this would fetch from an API/database.
    // For now, use localStorage to simulate spot tracking.
    const stored = localStorage.getItem('master_founding_spots');
    if (stored !== null) {
      setRemaining(Math.max(0, Math.min(TOTAL_SPOTS, parseInt(stored, 10))));
    }
  }, []);

  const filledPercent = ((TOTAL_SPOTS - remaining) / TOTAL_SPOTS) * 100;

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-2xl font-display text-selene-gold font-semibold">{remaining}</span>
        <span className="text-xs text-selene-white-dim">de {TOTAL_SPOTS} plazas disponibles</span>
      </div>
      <div className="w-full h-2.5 bg-selene-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${filledPercent}%`,
            background: remaining <= 5
              ? '#FF6B6B'
              : remaining <= 10
                ? '#FF9F43'
                : '#D4A843',
          }}
        />
      </div>
      {remaining <= 5 && remaining > 0 && (
        <p className="text-xs text-selene-rose mt-1.5 animate-pulse">Ultimas plazas disponibles</p>
      )}
      {remaining === 0 && (
        <p className="text-xs text-selene-white-dim mt-1.5">Plazas agotadas — unete a la lista de espera</p>
      )}
    </div>
  );
}
