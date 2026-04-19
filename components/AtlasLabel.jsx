/**
 * AtlasLabel — kicker / category / breadcrumb chip uniforme.
 *
 * Adoptado del pattern de Pitchfork features. Un solo componente
 * para reemplazar las cinco variantes de "kicker" que la web tenía
 * hasta hoy (smcp + uppercase + lowercase italic + plain caps + dots).
 *
 * Reglas tipográficas (Pitchfork Walfork):
 *   - text-transform: uppercase
 *   - letter-spacing: 0.125em (su signature exacto)
 *   - font-weight: 600
 *   - font-size: 11-14 px según tono
 *
 * Variantes de tono:
 *   "ornament"  → oro discreto (default — la mayoría de kickers)
 *   "muted"     → gris muted (breadcrumbs, meta)
 *   "ink"       → tinta plena (énfasis, headers de sección)
 *   "accent"    → rose-deep (warnings, sale, etc.)
 *
 * Tamaños:
 *   "xs"        → 10px (chips densas, footer)
 *   "sm"        → 11px (kickers default)
 *   "md"        → 12px (encabezados de sección)
 *   "lg"        → 14px (botones)
 *
 * Uso:
 *   <AtlasLabel>Lectura · Tarot</AtlasLabel>
 *   <AtlasLabel tone="muted" size="xs">Inicio · Lecturas · Tarot</AtlasLabel>
 *   <AtlasLabel as="a" href="/lecturas">Ver catálogo</AtlasLabel>
 */
const TONE_COLOR = {
  ornament: 'var(--color-text-ornament)',
  muted:    'var(--color-text-muted)',
  ink:      'var(--color-text)',
  accent:   'var(--color-text-accent)',
  faint:    'var(--color-text-faint)',
};

const SIZE_PX = {
  xs: '10px',
  sm: '11px',
  md: '12px',
  lg: '14px',
};

export default function AtlasLabel({
  children,
  tone = 'ornament',
  size = 'sm',
  as: Component = 'span',
  className = '',
  separator,
  style,
  ...rest
}) {
  return (
    <Component
      className={`atlas-label ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5em',
        textTransform: 'uppercase',
        letterSpacing: '0.125em',
        fontWeight: 600,
        fontSize: SIZE_PX[size] || SIZE_PX.sm,
        fontFamily: 'var(--font-body), Lora, Georgia, serif',
        color: TONE_COLOR[tone] || TONE_COLOR.ornament,
        lineHeight: 1.15,
        ...style,
      }}
      {...rest}
    >
      {separator && (
        <span aria-hidden="true" style={{
          display: 'inline-block',
          width: '1.4rem',
          height: '1px',
          background: 'currentColor',
          opacity: 0.45,
        }} />
      )}
      {children}
      {separator && (
        <span aria-hidden="true" style={{
          display: 'inline-block',
          width: '1.4rem',
          height: '1px',
          background: 'currentColor',
          opacity: 0.45,
        }} />
      )}
    </Component>
  );
}
