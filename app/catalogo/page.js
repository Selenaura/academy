import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer } from '@/components/ui';
import ChapterSignature from '@/components/ChapterSignature';
import AtlasLabel from '@/components/AtlasLabel';

export const metadata = {
  title: 'Catálogo — Selene Academia',
  description: 'Explora todos los cursos de astrología, meditación y autoconocimiento con base científica. Desde principiante hasta guía profesional certificada.',
};

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Catálogo de cursos — Selene Academia',
  description: 'Todos los cursos de astrología, meditación y autoconocimiento con base científica.',
  numberOfItems: COURSES.length,
  itemListElement: COURSES.map((course, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://academy.selenaura.com/catalogo/${course.id}`,
    name: course.title,
  })),
};

/**
 * Catálogo — editorial cream coherente con la home del scriptorium.
 * Cada curso es un TOC entry: hairline gold rule + headline + dek
 * italic + precio tnum + metadata smcp. Agrupado por "tomo" (nivel).
 */
export default function CatalogoPage() {
  const levels = [
    { label: 'Tomos menores',  kicker: 'Nivel 0 · Introducción',    filter: c => c.level === 'Nivel 0' },
    { label: 'Los fundamentos', kicker: 'Nivel I · Fundamentos',     filter: c => c.level === 'Nivel 1' },
    { label: 'La especialización', kicker: 'Nivel II · Especialización', filter: c => c.level === 'Nivel 2' },
    { label: 'Los volúmenes mayores', kicker: 'Nivel III · Profesional', filter: c => c.level === 'Nivel 3' },
  ];

  return (
    <div className="min-h-screen atlas-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }} />
      <Navbar />

      {/* HERO */}
      <section className="relative pt-10 pb-12">
        <div className="running-head pt-2 pb-8" aria-hidden="false">
          Selenaura · Academia · Catálogo formativo
        </div>

        <div className="relative max-w-content mx-auto px-6 text-center">
          <ChapterSignature
            title="EL CATÁLOGO"
            align="center"
            className="mb-8 mx-auto"
          />

          <h1
            className="font-display mx-auto mb-5"
            style={{
              fontSize: 'var(--step-4)',
              lineHeight: '1.05',
              fontWeight: 600,
              color: 'var(--color-text)',
              fontVariationSettings: "'opsz' 96, 'SOFT' 100",
              fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
              letterSpacing: '-0.018em',
              maxWidth: '24ch',
              hyphens: 'none',
              WebkitHyphens: 'none',
            }}
          >
            Diez volúmenes,
            <span
              className="block font-display italic mt-1 text-[var(--color-text-accent)]"
              style={{
                fontVariationSettings: "'opsz' 144, 'SOFT' 60",
                fontWeight: 500,
                fontSize: 'var(--step-5)',
                hyphens: 'none',
                WebkitHyphens: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              un mismo autor
            </span>
          </h1>

          <p
            className="font-display italic mx-auto text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-1)',
              maxWidth: '54ch',
              lineHeight: '1.55',
              fontVariationSettings: "'opsz' 28, 'SOFT' 60",
            }}
          >
            {COURSES.length} cursos · de principiante a guía profesional
            certificada. Cada lección cita sus fuentes.
          </p>
        </div>
      </section>

      {/* Slim divider */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* CATÁLOGO por nivel */}
      <section className="max-w-content-lg mx-auto px-6 py-12">
        {levels.map(level => {
          const courses = COURSES.filter(level.filter);
          if (courses.length === 0) return null;
          return (
            <div key={level.label} className="mb-14 last:mb-0">
              <div className="mb-6">
                <AtlasLabel tone="ornament" size="sm" className="mb-1.5">
                  {level.kicker}
                </AtlasLabel>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'var(--step-2)',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    fontVariationSettings: "'opsz' 36, 'SOFT' 80",
                    fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                    letterSpacing: '-0.008em',
                  }}
                >
                  {level.label}
                </h2>
              </div>

              {/* TOC editorial — hairline rows, sin cards */}
              <div
                className={`grid gap-x-10 gap-y-2 ${
                  courses.length === 1
                    ? 'grid-cols-1 max-w-[640px]'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {courses.map(course => (
                  <Link
                    key={course.id}
                    href={`/catalogo/${course.id}`}
                    className="no-underline group block"
                  >
                    <article
                      className="border-t py-5 transition-colors group-hover:border-[var(--color-text-ornament)]"
                      style={{ borderColor: 'var(--color-rule)' }}
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-1.5">
                        <h3
                          className="font-display group-hover:text-[var(--color-text-accent)] transition-colors leading-tight"
                          style={{
                            fontSize: 'var(--step-1)',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            fontVariationSettings: "'opsz' 24, 'SOFT' 80",
                            fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                          }}
                        >
                          {course.title}
                        </h3>
                        {course.price === 0 ? (
                          <AtlasLabel tone="ornament" size="xs" className="shrink-0">
                            Gratis
                          </AtlasLabel>
                        ) : (
                          <span
                            className="font-display tnum shrink-0"
                            style={{
                              fontSize: 'var(--step-1)',
                              fontWeight: 600,
                              color: 'var(--color-text-ornament)',
                              fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                            }}
                          >
                            {course.price_label}
                          </span>
                        )}
                      </div>
                      {course.subtitle && (
                        <p
                          className="font-display italic mb-3"
                          lang="es"
                          style={{
                            fontSize: '14px',
                            color: 'var(--color-text-muted)',
                            fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                            lineHeight: 1.5,
                          }}
                        >
                          {course.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-4 flex-wrap">
                        <AtlasLabel tone="faint" size="xs">{course.hours}</AtlasLabel>
                        <span className="text-[rgba(184,151,90,0.4)] select-none">·</span>
                        <AtlasLabel tone="faint" size="xs">{course.modules} módulos</AtlasLabel>
                        <span className="text-[rgba(184,151,90,0.4)] select-none">·</span>
                        <AtlasLabel tone="faint" size="xs">
                          {course.lessons.length} lecciones
                        </AtlasLabel>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Slim divider */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* CTA final */}
      <section className="max-w-content mx-auto px-6 pt-10 pb-16 text-center">
        <p
          className="font-display italic mb-6 text-[var(--color-text-muted)] mx-auto"
          lang="es"
          style={{
            fontSize: 'var(--step-0)',
            maxWidth: '44ch',
            lineHeight: 1.6,
            fontVariationSettings: "'opsz' 24, 'SOFT' 60",
          }}
        >
          Tu primera ruta se personaliza con tu carta natal al crear cuenta.
        </p>
        <Link
          href="/auth?mode=register"
          className="inline-flex items-center px-10 py-4 rounded-xl no-underline"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--font-body), Lora, Georgia, serif',
            backgroundColor: 'var(--color-text)',
            color: 'var(--color-surface)',
            letterSpacing: '0.02em',
            boxShadow:
              'inset 0 1px 0 rgba(251,246,238,0.15), 0 2px 10px rgba(45,31,20,0.12)',
          }}
        >
          Crear mi cuenta gratis
        </Link>
      </section>

      <Footer />
    </div>
  );
}
