/**
 * Logo — Selenaura wordmark + planetary glyph.
 *
 * Two variants:
 *   "mark"   — just the glyph (a crescent moon crossed by a line of
 *               3 stars, centred). Use in square contexts: navbar on
 *               mobile, app icon, social avatar.
 *   "full"   — wordmark + glyph side-by-side. The wordmark is set in
 *               Fraunces italic with WONK=0 so it reads as editorial
 *               signature, not decorative. Use in navbar desktop,
 *               colophon, email signatures.
 *
 * Colour: inherits from currentColor (set via parent). Default style
 * passes gold (#B8975A) as currentColor, so the mark tints gold;
 * colophon passes ink to render dark.
 *
 * Built in SVG for crisp rendering at any scale. The glyph is a single
 * 28×28 unit so the stroke widths match the wordmark x-height.
 */
export default function Logo({
  variant = 'full',
  size = 28,
  className = '',
  tone = 'gold',
  showTagline = false,
}) {
  const strokeColor = tone === 'ink'
    ? 'var(--ink)'
    : tone === 'rose'
      ? 'var(--rose-deep)'
      : 'var(--gold)';

  const Mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={variant === 'full'}
      role={variant === 'mark' ? 'img' : undefined}
      aria-label={variant === 'mark' ? 'Selenaura' : undefined}
      style={{ color: strokeColor }}
    >
      {/* Crescent moon — waxing, opens to the right */}
      <path
        d="M21 5.2 A 10.5 10.5 0 1 0 21 22.8 A 7.6 7.6 0 0 1 21 5.2 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* Three tiny stars across the crescent opening — descending in
         size from top to bottom to mimic a celestial descent */}
      <circle cx="23.5" cy="8" r="0.9" fill="currentColor" />
      <circle cx="24" cy="14" r="1.1" fill="currentColor" />
      <circle cx="23.5" cy="20" r="0.7" fill="currentColor" />
      {/* Micro-hairline that joins the stars — the "meridian line"
         of an antique astrolabe */}
      <path
        d="M23.5 8 L 24 14 L 23.5 20"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );

  if (variant === 'mark') return <span className={className}>{Mark}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {Mark}
      <span className="flex flex-col items-start leading-none">
        <span
          className="font-display"
          style={{
            fontSize: `${Math.round(size * 0.72)}px`,
            fontStyle: 'italic',
            fontWeight: 500,
            color: tone === 'ink' ? 'var(--ink)' : 'var(--ink)',
            fontVariationSettings: "'opsz' 36, 'SOFT' 80",
            fontFeatureSettings: "'liga' 0, 'kern' 1",
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          Selenaura
        </span>
        {showTagline && (
          <span
            className="smcp mt-1"
            style={{
              fontSize: `${Math.round(size * 0.28)}px`,
              letterSpacing: '0.24em',
              color: 'var(--gold)',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            Atlas Celeste · MMXXVI
          </span>
        )}
      </span>
    </span>
  );
}
