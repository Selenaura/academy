'use client';

import { openCookieSettings } from './CookieConsent';

export default function CookieSettingsButton() {
  return (
    <button
      onClick={openCookieSettings}
      className="hover:text-selene-white no-underline text-selene-white-dim transition cursor-pointer bg-transparent border-none text-xs"
      style={{ font: 'inherit' }}
    >
      Configurar cookies
    </button>
  );
}
