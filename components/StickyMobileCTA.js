'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyMobileCTA({
  text = 'Empieza gratis',
  href = '/auth?mode=register',
  subtitle = 'Curso introductorio + carta natal',
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Show after scrolling past the hero (~500px)
          setVisible(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] md:hidden"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Gradient fade edge */}
      <div className="h-4 bg-gradient-to-t from-selene-bg/95 to-transparent" />

      <div className="bg-selene-bg/95 backdrop-blur-xl border-t border-selene-gold/20 px-4 pb-[env(safe-area-inset-bottom,8px)] pt-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-selene-white-dim truncate">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="flex-shrink-0 bg-selene-gold text-selene-bg text-[13px] font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition no-underline whitespace-nowrap"
          >
            {text}
          </Link>
        </div>
      </div>
    </div>
  );
}
