'use client';

// ═══════════════════════════════════════════════
// SELENE ACADEMIA — Shared UI Components
// ═══════════════════════════════════════════════

import Link from 'next/link';

// ── Icons ──
export function MoonIcon({ size = 20, className = 'text-selene-gold' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export function PlayIcon({ size = 20, className = 'text-selene-white' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5,3 19,12 5,21" /></svg>;
}

export function CheckIcon({ size = 18, className = 'text-selene-success' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}><polyline points="20,6 9,17 4,12" /></svg>;
}

export function LockIcon({ size = 16, className = 'text-selene-white-dim' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}

export function ArrowIcon({ size = 16, className = 'text-selene-gold' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>;
}

export function BackIcon({ size = 20, className = 'text-selene-white-dim' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>;
}

export function UserIcon({ size = 20, className = 'text-selene-white-dim' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

export function CertIcon({ size = 20, className = 'text-selene-gold' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>;
}

export function BookIcon({ size = 20, className = 'text-selene-gold' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
}

export function GridIcon({ size = 20, className = 'text-selene-white-dim' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}

export function StarIcon({ size = 16, className = 'text-selene-gold' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>;
}

// ── Navbar ──
export function Navbar({ showAuth = true, showDashboardNav = false }) {
  return (
    <nav aria-label="Navegación principal" className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-selene-bg/90 backdrop-blur-xl border-b border-selene-border">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <MoonIcon size={24} />
        <span className="font-display text-[22px] font-semibold text-selene-gold tracking-wider">
          SELENE
        </span>
        <span className="text-[11px] text-selene-white-dim bg-selene-gold/10 px-2 py-0.5 rounded ml-1">
          ACADEMIA
        </span>
      </Link>

      {showDashboardNav && (
        <div className="flex gap-5 items-center">
          <Link href="/dashboard" className="text-selene-gold" aria-label="Dashboard"><GridIcon size={20} className="text-selene-gold" /></Link>
          <Link href="/perfil" aria-label="Mi perfil"><UserIcon size={20} /></Link>
        </div>
      )}

      {showAuth && !showDashboardNav && (
        <div className="flex gap-2 sm:gap-3 items-center">
          <Link href="/auth?mode=login" className="text-xs sm:text-sm text-selene-white-dim hover:text-selene-white px-2 sm:px-4 py-2 no-underline">
            Iniciar sesión
          </Link>
          <Link href="/auth?mode=register" className="text-xs sm:text-sm font-semibold bg-selene-gold text-selene-bg px-3 sm:px-5 py-2.5 rounded-lg hover:brightness-110 no-underline whitespace-nowrap">
            Empezar gratis
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── Progress Bar ──
export function ProgressBar({ value = 0, color = '#C9A84C', height = 4, className = '' }) {
  return (
    <div className={`w-full bg-selene-elevated rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(value * 100, 100)}%`, background: color }}
      />
    </div>
  );
}

// ── Badge ──
export function Badge({ children, color = '#C9A84C', className = '' }) {
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide ${className}`}
      style={{ color: '#0A0A0F', background: color }}
    >
      {children}
    </span>
  );
}

// ── Card ──
export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={`bg-selene-card rounded-2xl border border-selene-border overflow-hidden transition-all duration-300 ${hover ? 'hover:border-selene-gold/30 hover:shadow-[0_0_20px_rgba(201,168,76,0.06)] hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Section Label ──
export function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="font-display text-xl font-medium text-selene-white">{children}</h2>
      {subtitle && <p className="text-sm text-selene-white-dim mt-1">{subtitle}</p>}
    </div>
  );
}

// ── Gold Divider ──
export function GoldDivider({ className = '' }) {
  return <div className={`w-10 h-px bg-selene-gold mx-auto ${className}`} />;
}

// ── Loading Spinner ──
export function Spinner({ text = 'Cargando...' }) {
  return (
    <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      <p className="font-display text-lg text-selene-gold mt-6">{text}</p>
    </div>
  );
}

// ── YouTube Embed ──
export function YouTubeEmbed({ videoId, title = '' }) {
  if (!videoId) return null;
  return (
    <div className="aspect-video w-full bg-selene-card rounded-xl overflow-hidden border border-selene-border">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

// ── Footer ──
export function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-selene-border text-center text-xs text-selene-white-dim">
      <div className="flex items-center justify-center gap-2 mb-3">
        <MoonIcon size={16} className="text-selene-gold-dim" />
        <span className="font-display text-selene-gold-dim tracking-wider">SELENE ACADEMIA</span>
      </div>
      <p>Ciencia y consciencia de lo invisible · selenaura.com</p>
      <div className="mt-2 opacity-50 flex gap-4 justify-center">
        <Link href="/legal" className="hover:text-selene-white no-underline text-selene-white-dim">Aviso Legal</Link>
        <Link href="/privacidad" className="hover:text-selene-white no-underline text-selene-white-dim">Privacidad</Link>
        <Link href="/cookies" className="hover:text-selene-white no-underline text-selene-white-dim">Cookies</Link>
      </div>
    </footer>
  );
}
