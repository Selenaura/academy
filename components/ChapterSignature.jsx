/**
 * ChapterSignature — § I, § II… signatura editorial entre secciones.
 *
 * El símbolo § (seccion) es el atributo más característico de un texto
 * jurídico-académico clásico (códigos legales, manuales del s. XIX,
 * Cabinet Magazine en su forma de sumario). Combinado con un romano
 * comunica de inmediato: "esto se ha COMPUESTO, no se ha maquetado".
 *
 * Composición: el símbolo y el romano en italic Fraunces WONK=1, una
 * pausa visual de 1.5 caracteres, y luego el título de capítulo en
 * smcp dorado. Una hairline gold debajo, al ancho exacto del bloque,
 * reforzada con dos micro-fleurones laterales para evitar la
 * sensación de "linea horizontal genérica".
 *
 * Props:
 *   numeral — 'I' | 'II' | 'III'… (string libre)
 *   title   — texto del capítulo (visible)
 *   align   — 'left' (default) | 'center'
 */
export default function ChapterSignature({
  numeral = 'I',
  title,
  plate,        // optional: PLATE roman for the chapter (e.g. "I", "II")
  plateLabel,   // optional: short Latin or Spanish label for the plate
  align = 'left',
  className = '',
}) {
  const wrapAlign =
    align === 'center' ? 'mx-auto text-center' : 'mr-auto text-left';
  const innerAlign =
    align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <div className={`${wrapAlign} ${className}`} style={{ maxWidth: '32ch' }}>
      {/* Title only — the user removed the §+roman prefix because the
         arbitrary numeration ("§ I", "§ II"…) added visual weight
         without adding meaning. The chapter is now identified by the
         smcp title alone, with the hairline + fleurons below as the
         editorial mark of section break. The factual Plate label
         (rendered below by the parent prop) is what carries the
         section's reference number now — and Plates have actual
         function (they point to the engraving). */}
      <div className={`flex items-baseline gap-3 ${innerAlign}`}>
        <span
          className="smcp text-[var(--ink)] font-semibold"
          style={{
            fontSize: 'var(--step-0)',
            letterSpacing: '0.22em',
          }}
        >
          {title}
        </span>
      </div>
      {/* Hairline + micro-fleurons. Pure CSS, no SVG dependency. */}
      <div className={`flex items-center gap-2 mt-2 ${innerAlign}`}>
        <span
          className="text-[var(--gold)] select-none"
          style={{ fontSize: '0.55em', opacity: 0.55 }}
          aria-hidden="true"
        >
          ❦
        </span>
        <span
          className="h-px bg-[rgba(184,151,90,0.45)]"
          style={{ width: align === 'center' ? '4rem' : '6rem' }}
          aria-hidden="true"
        />
        <span
          className="text-[var(--gold)] select-none"
          style={{ fontSize: '0.55em', opacity: 0.55 }}
          aria-hidden="true"
        >
          ❦
        </span>
      </div>

      {/* Optional plate label — "PLATE I · ATLAS CELESTE". Echoes
         antique illustrated books where each chapter referred to the
         engraved plate that accompanied it. */}
      {plate && (
        <div className={`flex ${innerAlign}`}>
          <span className="plate-label">
            Plate&nbsp;{plate}
            {plateLabel && <span className="text-[var(--ink-lighter)] font-normal" style={{ letterSpacing: '0.18em' }}>·&nbsp;{plateLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
