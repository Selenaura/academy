/**
 * Colophon — tabla de ediciones de un curso.
 *
 * DIFERENCIADOR CLAVE vs toda la competencia LMS:
 * Mindvalley, Sounds True, Domestika — ninguno versiona cursos después
 * de lanzados. Academy los trata como MANUSCRITOS VIVOS: primera edición,
 * segunda edición, revisiones pequeñas en cada solsticio. Estudiantes
 * que compran una edición reciben todas las futuras gratis ("Lectora
 * de por vida").
 *
 * Se renderiza al pie del detalle del curso (/curso/[id] y /master),
 * como el colofón de un libro impreso. Si el curso sólo tiene una
 * edición aún, se muestra una sola fila — sin parecer vacío.
 *
 * Props:
 *   editions: Array<{ number, label, date, changelog?, delta? }>
 *   courseName: string (usado en schema/semántica)
 *
 * Ejemplo de uso:
 *   <Colophon
 *     editions={[
 *       { number: 1, label: 'Primera edición', date: 'Septiembre 2025' },
 *       { number: 2, label: 'Segunda edición', date: 'Abril 2026',
 *         changelog: 'Revisiones de neurobiología del apego + 3 lecciones nuevas' },
 *     ]}
 *     courseName="Astrología Natal"
 *   />
 */
import AtlasLabel from './AtlasLabel';

export default function Colophon({ editions = [], courseName = '' }) {
  // Fallback: si no se pasan ediciones, mostrar la "primera edición"
  // genérica con la fecha de ahora. Es coherente con el patrón literary:
  // un colofón nunca está vacío en un libro real.
  const list = editions.length > 0
    ? editions
    : [{ number: 1, label: 'Primera edición', date: 'Edición actual' }];

  return (
    <aside
      className="mt-20 pt-10"
      style={{ borderTop: '1px solid var(--color-rule-ornament)' }}
      aria-labelledby="colofon-heading"
    >
      <div className="text-center mb-8">
        <AtlasLabel tone="ornament" size="sm" className="mb-2 mx-auto">
          Colofón
        </AtlasLabel>
        <h2
          id="colofon-heading"
          className="font-display italic"
          style={{
            fontSize: 'var(--step-2)',
            fontWeight: 400,
            color: 'var(--color-text)',
            fontVariationSettings: "'opsz' 36, 'SOFT' 60",
            letterSpacing: '-0.005em',
          }}
        >
          Ediciones del manuscrito
        </h2>
        <p
          className="font-display italic mx-auto mt-3"
          lang="es"
          style={{
            fontSize: 'var(--step-0)',
            maxWidth: '52ch',
            color: 'var(--color-text-muted)',
            fontVariationSettings: "'opsz' 24, 'SOFT' 60",
            lineHeight: 1.55,
          }}
        >
          Este curso se revisa cada año. Al adquirirlo recibes todas las
          ediciones presentes y futuras sin coste adicional.
        </p>
      </div>

      {/* Lista de ediciones como registro de imprenta */}
      <ol
        className="max-w-[620px] mx-auto"
        style={{ listStyle: 'none' }}
      >
        {list.map((ed, i) => (
          <li
            key={ed.number || i}
            className="grid py-5"
            style={{
              gridTemplateColumns: '3rem 1fr auto',
              gap: '1.5rem',
              borderBottom:
                i < list.length - 1 ? '1px solid var(--color-rule)' : 'none',
            }}
          >
            {/* Romano editorial del número de edición */}
            <span
              className="font-display italic self-baseline"
              style={{
                fontSize: '20px',
                color: 'var(--color-text-ornament)',
                fontVariationSettings: "'opsz' 36, 'SOFT' 60",
                fontWeight: 400,
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {toRoman(ed.number || i + 1)}
            </span>

            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: 'var(--step-1)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  fontVariationSettings: "'opsz' 24, 'SOFT' 80",
                  fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                  lineHeight: 1.2,
                }}
              >
                {ed.label}
              </h3>
              {ed.changelog && (
                <p
                  className="mt-2"
                  lang="es"
                  style={{
                    fontFamily: 'var(--font-body), Lora, Georgia, serif',
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.55,
                  }}
                >
                  {ed.changelog}
                </p>
              )}
            </div>

            <AtlasLabel
              tone="faint"
              size="xs"
              className="self-baseline whitespace-nowrap"
            >
              {ed.date}
            </AtlasLabel>
          </li>
        ))}
      </ol>

      {/* Imprenta final — frase legal tipo pie editorial */}
      <p
        className="mt-10 text-center font-display italic"
        lang="es"
        style={{
          fontSize: '12px',
          color: 'var(--color-text-faint)',
          fontVariationSettings: "'opsz' 14, 'SOFT' 50",
          letterSpacing: '0.05em',
          lineHeight: 1.6,
        }}
      >
        {courseName ? `${courseName}. ` : ''}Academia Selenaura · MMXXVI
        <br />
        Compuesto en Fraunces y Lora sobre pergamino digital.
      </p>
    </aside>
  );
}

// Romanos pequeños — suficiente para ediciones 1-12
function toRoman(n) {
  const map = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return map[n] || String(n);
}
