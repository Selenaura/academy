'use client';

/**
 * ThemeToggle — atlas día / atlas noche.
 *
 * El sitio se "voltea" cream → indigo (la misma carta celestial leída
 * de día / a medianoche). El switch:
 *   1) Persiste en localStorage 'selenaura-theme' = 'day' | 'night'
 *   2) Aplica data-theme="night" al <html>
 *   3) Respeta prefers-color-scheme la PRIMERA vez (luego prevalece
 *      la elección del usuario)
 *   4) Sincroniza con un script inline early en <head> para evitar
 *      el FOUC (flash of unstyled content) en SSR
 *
 * UI:
 *   - Botón circular hairline gold con luna creciente (día) / sol (noche)
 *   - Aria-label dinámico "Cambiar a modo noche/día"
 *
 * Para integrarse: añadir <ThemeToggle /> al Navbar (esquina derecha).
 */
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'selenaura-theme';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(null); // null = uninitialised

  // Hydrate from <html> (set by inline script in head) on mount
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'night' ? 'night' : 'day');
  }, []);

  function toggle() {
    const next = theme === 'night' ? 'day' : 'night';
    setTheme(next);
    if (next === 'night') {
      document.documentElement.setAttribute('data-theme', 'night');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // storage blocked (incognito + 3rd party) — switch still works
      // for the session, just doesn't persist
    }
  }

  // Don't render anything until hydrated to avoid hydration mismatch
  // (the server doesn't know which theme is active).
  if (theme === null) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ width: 36, height: 36, display: 'inline-block' }}
      />
    );
  }

  const isNight = theme === 'night';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isNight ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
      title={isNight ? 'Atlas de día' : 'Atlas de noche'}
      className={className}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1px solid var(--color-rule-ornament)',
        background: 'transparent',
        color: 'var(--color-text-ornament)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 200ms, transform 200ms',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--color-text-ornament) 12%, transparent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {isNight ? (
        // Sol — clic para volver a día
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
          <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
          <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
        </svg>
      ) : (
        // Luna creciente — clic para ir a noche
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/**
 * THEME_INIT_SCRIPT — string para inyectar como <script> inline en
 * <head> antes del primer render. Esto evita el FOUC: la página
 * arranca ya con data-theme="night" si el usuario lo eligió antes,
 * sin esperar a hidratación de React.
 *
 * Uso:
 *   import { THEME_INIT_SCRIPT } from '@/components/ThemeToggle';
 *   ...
 *   <head>
 *     <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
 *   </head>
 */
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('selenaura-theme');
    if (saved === 'night') {
      document.documentElement.setAttribute('data-theme', 'night');
    }
    // Si no hay preferencia guardada, NO aplicamos prefers-color-scheme
    // automáticamente — la dirección de marca es "atlas de día" por
    // defecto. El usuario elige noche explícitamente.
  } catch (e) {
    // localStorage bloqueado — sigue con el theme default (día)
  }
})();
`;
