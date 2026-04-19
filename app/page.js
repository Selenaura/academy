import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, Card } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';
import ChapterSignature from '@/components/ChapterSignature';
import AtlasLabel from '@/components/AtlasLabel';

/**
 * Home / Landing — Selene Academia
 *
 * Concepto unificado con selenaura.com (ya deployed): esto es el
 * "scriptorium" del atlas celeste. Cada curso es un VOLUMEN, el
 * Máster el tomo principal, las lecciones son § capítulos.
 *
 * Reglas Rococo-Botanical:
 *  • Imágenes SÓLO como accents slim (dividers 10:1) o textura bg
 *    sutil. Nunca backdrop que tape texto.
 *  • Tres voces tipográficas (display Fraunces / ritual italic Lora /
 *    body Lora). Ninguna tarjeta usa bg morado o gradient SaaS.
 *  • Atlas-paper grid como textura mínima; hairline gold como regla
 *    editorial entre secciones.
 *  • Todo hereda el modo día/noche desde tokens semánticos (sin hex).
 */
export default function LandingPage() {
  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: COURSES.map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description || course.subtitle,
        provider: {
          '@type': 'Organization',
          name: 'Selene Academia',
          sameAs: 'https://academy.selenaura.com',
        },
        educationalLevel: course.level,
        numberOfCredits: course.modules,
        timeRequired: `PT${parseInt(course.hours)}H`,
        inLanguage: 'es',
        isAccessibleForFree: course.price === 0,
        ...(course.price > 0 && {
          offers: {
            '@type': 'Offer',
            price: (course.price / 100).toFixed(2),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `https://academy.selenaura.com/auth?mode=register`,
          },
        }),
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: course.hours,
        },
      },
    })),
  };

  const stats = [
    { n: 'X',   label: 'Cursos',          value: '10' },
    { n: 'CC',  label: 'Lecciones',       value: '200+' },
    { n: 'XXX', label: 'Estudios citados', value: '30+' },
    { n: 'VI',  label: 'Certificaciones', value: '6' },
  ];

  // Group courses: free intro, volúmenes (niveles 1-3), tomo principal (master)
  // The "tomo principal" is the flagship master course (guia-profesional).
  const masterCourse = COURSES.find(c => c.id === 'guia-profesional') || COURSES.find(c => c.level === 'Nivel 3');
  const freeCourses  = COURSES.filter(c => c.price === 0);
  const nivel1 = COURSES.filter(c => c.level === 'Nivel 1');
  const nivel2 = COURSES.filter(c => c.level === 'Nivel 2');
  const nivel3 = COURSES.filter(c => c.level === 'Nivel 3' && c.id !== masterCourse?.id);

  const comparisonRows = [
    { label: 'Base',                  selene: 'Estudios peer-reviewed citados',      typical: 'Transmisión oral sin fuentes' },
    { label: 'Certificados',          selene: 'Verificables con código CSV',         typical: 'Sin validez comprobable' },
    { label: 'Personalización',       selene: 'Carta natal integrada',               typical: 'Contenido genérico' },
    { label: 'Formato',               selene: 'Texto + slides + PDF',                typical: 'Sólo vídeo' },
    { label: 'Rigor',                 selene: 'Desmonta mitos activamente',          typical: 'Repite mitos' },
    { label: 'Curso introductorio',   selene: 'Gratis',                              typical: '50 — 200 €' },
  ];

  return (
    <div className="min-h-screen atlas-paper">
      <SchemaMarkup data={courseListSchema} />
      <Navbar />

      {/* ════════════════════════════════════════════════════════════
          HERO — La biblioteca viva
          ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="running-head pt-2 pb-8" aria-hidden="false">
          Selenaura · Academia · Scriptorium
        </div>

        <div className="relative max-w-content mx-auto px-6 z-10 text-center">
          <ChapterSignature
            title="UNA BIBLIOTECA VIVA"
            align="center"
            className="mb-8 mx-auto"
          />

          {/* Headline dual — upright "Cursos de" + italic rose "consciencia" */}
          <h1 className="mx-auto mb-7"
              style={{ maxWidth: '20ch' }}>
            <span className="font-display block"
                  style={{
                    fontSize: 'var(--step-4)',
                    lineHeight: '1.04',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontVariationSettings: "'opsz' 96, 'SOFT' 100",
                    fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
                    letterSpacing: '-0.015em',
                  }}>
              Cursos de
            </span>
            <span className="font-display italic block mt-2"
                  style={{
                    fontSize: 'var(--step-5)',
                    lineHeight: '1.02',
                    fontWeight: 500,
                    color: 'var(--color-text-accent)',
                    fontVariationSettings: "'opsz' 144, 'SOFT' 60",
                    fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
                    letterSpacing: '-0.018em',
                  }}>
              consciencia
            </span>
          </h1>

          <p className="font-display italic mx-auto mb-8 text-[var(--color-text-muted)]"
             lang="es"
             style={{
               fontSize: 'var(--step-1)',
               maxWidth: '52ch',
               lineHeight: '1.55',
               fontVariationSettings: "'opsz' 28, 'SOFT' 60",
             }}>
            Astrología, tarot y meditación escritos como capítulos de un
            libro en curso. Cada lección cita estudios peer-reviewed. Tu
            carta natal guía qué leer primero.
          </p>

          {/* CTA dual — ink primary + ghost secondary */}
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center px-8 py-3.5 rounded-xl no-underline"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-body), Lora, Georgia, serif',
                backgroundColor: 'var(--color-text)',
                color: 'var(--color-surface)',
                letterSpacing: '0.02em',
                boxShadow: 'inset 0 1px 0 rgba(251,246,238,0.15), 0 2px 10px rgba(45,31,20,0.12)',
              }}
            >
              Empezar gratis
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex items-center px-8 py-3.5 rounded-xl no-underline"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-body), Lora, Georgia, serif',
                color: 'var(--color-text-ornament)',
                border: '1px solid var(--color-rule-ornament)',
                letterSpacing: '0.02em',
              }}
            >
              Ver catálogo ↓
            </Link>
          </div>

          {/* Stats editoriales — números arábigos en Fraunces display tnum */}
          <div className="flex justify-center gap-10 flex-wrap mx-auto max-w-[640px]">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-display tnum"
                  style={{
                    fontSize: '2.1rem',
                    fontVariationSettings: "'opsz' 48, 'SOFT' 100",
                    fontFeatureSettings: "'tnum' 1, 'liga' 0, 'kern' 1",
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    lineHeight: 1,
                  }}>
                  {s.value}
                </div>
                <div
                  className="smcp mt-2"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-text-faint)',
                    fontWeight: 600,
                  }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slim lunar divider between sections */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* Trust row — editorial smcp, no emoji */}
      <div className="max-w-content mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[
            'Estudios peer-reviewed',
            'Certificados verificables',
            'Pago seguro · Stripe',
            'Garantía 14 días',
          ].map((t, i, arr) => (
            <span key={t} className="inline-flex items-center gap-x-8">
              <AtlasLabel tone="faint" size="xs">{t}</AtlasLabel>
              {i < arr.length - 1 && (
                <span className="text-[rgba(184,151,90,0.5)] select-none hidden sm:inline">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          § I — EL TOMO PRINCIPAL (Master)
          Featured block con double-rule gold, análogo al Círculo de
          Selene en selenaura.com. El Máster merece su propio marco.
          ════════════════════════════════════════════════════════════ */}
      {masterCourse && (
        <section id="master" className="max-w-content mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <ChapterSignature
              title="EL TOMO PRINCIPAL"
              align="center"
              className="mb-2 mx-auto"
            />
          </div>

          <div className="relative mx-auto" style={{ maxWidth: 720 }}>
            <div
              className="relative atlas-paper-laid pt-12 pb-10 px-8 md:pt-14 md:pb-12 md:px-14"
              style={{
                border: '1px solid rgba(184,151,90,0.55)',
                backgroundColor: 'var(--color-surface-raised)',
              }}
            >
              {/* Inner hairline rule — double-rule editorial */}
              <div
                className="absolute pointer-events-none"
                style={{ inset: 10, border: '1px solid rgba(184,151,90,0.22)' }}
                aria-hidden="true"
              />

              <div className="relative text-center">
                <AtlasLabel tone="ornament" size="sm" className="mb-4">
                  {masterCourse.level} · {masterCourse.modules} módulos
                </AtlasLabel>

                <h2 className="mb-4"
                    style={{
                      fontSize: 'var(--step-3)',
                      lineHeight: '1.1',
                      color: 'var(--color-text)',
                      fontWeight: 500,
                      letterSpacing: '-0.012em',
                    }}>
                  <span className="font-display"
                        style={{
                          fontVariationSettings: "'opsz' 60, 'SOFT' 100",
                          fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
                        }}>
                    {masterCourse.title}
                  </span>
                </h2>

                <p className="font-display italic text-[var(--color-text-muted)] mx-auto mb-7"
                   lang="es"
                   style={{
                     fontSize: 'var(--step-0)',
                     maxWidth: '44ch',
                     lineHeight: '1.6',
                     fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                   }}>
                  {masterCourse.subtitle || masterCourse.description}
                </p>

                {/* Stats de curso — editorial figures */}
                <div className="flex justify-center gap-8 flex-wrap mb-8">
                  {[
                    { label: 'Duración', value: masterCourse.hours },
                    { label: 'Módulos',  value: `${masterCourse.modules}` },
                    { label: 'Nivel',    value: masterCourse.level },
                  ].map((f) => (
                    <div key={f.label} className="text-center">
                      <div className="font-display tnum"
                           style={{
                             fontSize: 'var(--step-1)',
                             fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                             fontWeight: 500,
                             color: 'var(--color-text)',
                             lineHeight: 1,
                           }}>
                        {f.value}
                      </div>
                      <AtlasLabel tone="faint" size="xs" className="mt-1.5 block">
                        {f.label}
                      </AtlasLabel>
                    </div>
                  ))}
                </div>

                {/* Precio editorial */}
                {masterCourse.price > 0 && (
                  <div className="mb-7">
                    <div className="font-display tnum"
                         style={{
                           fontSize: 'var(--step-2)',
                           fontWeight: 600,
                           color: 'var(--color-text-ornament)',
                           fontVariationSettings: "'opsz' 36, 'SOFT' 100",
                         }}>
                      {masterCourse.price_label}
                    </div>
                    <AtlasLabel tone="faint" size="xs" className="mt-1 block">
                      Pago único · acceso permanente
                    </AtlasLabel>
                  </div>
                )}

                <Link
                  href={`/catalogo/${masterCourse.id}`}
                  className="inline-flex items-center px-8 py-3.5 rounded-xl no-underline"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body), Lora, Georgia, serif',
                    backgroundColor: 'var(--color-text)',
                    color: 'var(--color-surface)',
                    letterSpacing: '0.02em',
                    boxShadow: 'inset 0 1px 0 rgba(251,246,238,0.15), 0 2px 10px rgba(45,31,20,0.12)',
                  }}
                >
                  Abrir el volumen
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Slim divider */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § II — EL CATÁLOGO (Tomos menores agrupados por nivel)
          ════════════════════════════════════════════════════════════ */}
      <section id="catalogo" className="max-w-content-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <ChapterSignature
            title="EL CATÁLOGO"
            align="center"
            className="mb-6 mx-auto"
          />
          <h2 className="font-display font-medium"
              style={{
                fontSize: 'var(--step-3)',
                color: 'var(--color-text)',
                fontVariationSettings: "'opsz' 48, 'SOFT' 80",
                fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                letterSpacing: '-0.008em',
              }}>
            Diez volúmenes, un mismo autor
          </h2>
          <p className="font-display italic mx-auto mt-3 text-[var(--color-text-muted)]"
             lang="es"
             style={{
               fontSize: 'var(--step-0)',
               maxWidth: '46ch',
               fontVariationSettings: "'opsz' 24, 'SOFT' 60",
             }}>
            De principiante a guía profesional certificada. 200+
            lecciones escritas, trianguladas con neurociencia.
          </p>
        </div>

        {/* Cuatro agrupaciones como capítulos */}
        {[
          { key: 'free',   kicker: 'Empieza gratis',              courses: freeCourses,  sublabel: 'Tu primer paso sin compromiso' },
          { key: 'niv1',   kicker: 'Nivel I · Fundamentos',       courses: nivel1,       sublabel: 'Bases sólidas con respaldo científico' },
          { key: 'niv2',   kicker: 'Nivel II · Especialización',  courses: nivel2,       sublabel: 'Profundiza en áreas específicas' },
          { key: 'niv3',   kicker: 'Nivel III · Profesional',     courses: nivel3,       sublabel: 'Camino a la certificación profesional' },
        ].filter(g => g.courses.length > 0).map(group => (
          <div key={group.key} className="mb-14 last:mb-0">
            <div className="mb-6">
              <AtlasLabel tone="ornament" size="sm" className="mb-1.5">
                {group.kicker}
              </AtlasLabel>
              <p className="font-display italic text-[var(--color-text-muted)]"
                 style={{
                   fontSize: '14px',
                   fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                 }}>
                {group.sublabel}
              </p>
            </div>

            {/* Grid editorial — TOC entries sin bg-card, sólo hairline rule */}
            <div className={`grid gap-x-10 gap-y-2 ${group.courses.length === 1 ? 'grid-cols-1 max-w-[560px]' : 'grid-cols-1 md:grid-cols-2'}`}>
              {group.courses.map(course => (
                <Link
                  key={course.id}
                  href={`/catalogo/${course.id}`}
                  className="no-underline group block"
                >
                  <article
                    className="border-t py-5 transition-colors"
                    style={{
                      borderColor: 'var(--color-rule)',
                    }}
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
                    <div className="flex items-center gap-4">
                      <AtlasLabel tone="faint" size="xs">{course.hours}</AtlasLabel>
                      <span className="text-[rgba(184,151,90,0.4)] select-none">·</span>
                      <AtlasLabel tone="faint" size="xs">{course.modules} módulos</AtlasLabel>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Slim divider */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent )',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § III — LA DIFERENCIA (Comparativa editorial)
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <ChapterSignature
            title="LA DIFERENCIA"
            align="center"
            className="mb-6 mx-auto"
          />
          <h2 className="font-display font-medium"
              style={{
                fontSize: 'var(--step-3)',
                color: 'var(--color-text)',
                fontVariationSettings: "'opsz' 48, 'SOFT' 80",
                fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                letterSpacing: '-0.008em',
              }}>
            Una academia que no te pide fe
          </h2>
          <p className="font-display italic mx-auto mt-3 text-[var(--color-text-muted)]"
             lang="es"
             style={{
               fontSize: 'var(--step-0)',
               maxWidth: '46ch',
               fontVariationSettings: "'opsz' 24, 'SOFT' 60",
             }}>
            Si no puedes verificarlo, no está en el temario. Cada
            lección incluye el estudio que la sostiene.
          </p>
        </div>

        {/* Comparativa — tabla editorial hairline, sin fondos coloreados */}
        <div className="max-w-[640px] mx-auto">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] gap-x-4 border-b"
               style={{ borderColor: 'var(--color-rule-ornament)' }}>
            <div />
            <div className="pb-3 text-center">
              <AtlasLabel tone="ornament" size="sm">Selene</AtlasLabel>
            </div>
            <div className="pb-3 text-center">
              <AtlasLabel tone="faint" size="sm">Típicos cursos</AtlasLabel>
            </div>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] gap-x-4 py-4 border-b"
              style={{ borderColor: 'var(--color-rule)' }}
            >
              <AtlasLabel tone="ink" size="sm" className="self-center">
                {row.label}
              </AtlasLabel>
              <div className="font-display italic text-center self-center"
                   style={{
                     fontSize: '13px',
                     color: 'var(--color-text)',
                     fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                   }}>
                <span className="text-[var(--color-text-ornament)] mr-1" aria-hidden="true">✓</span>
                {row.selene}
              </div>
              <div className="font-display italic text-center self-center"
                   style={{
                     fontSize: '13px',
                     color: 'var(--color-text-faint)',
                     fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                   }}>
                <span className="mr-1" aria-hidden="true">×</span>
                {row.typical}
              </div>
            </div>
          ))}
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
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § IV — EL CERTIFICADO
          Bloque editorial tipo Acta + proceso en 3 pasos
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <ChapterSignature
            title="EL CERTIFICADO"
            align="center"
            className="mb-6 mx-auto"
          />
          <h2 className="font-display font-medium"
              style={{
                fontSize: 'var(--step-3)',
                color: 'var(--color-text)',
                fontVariationSettings: "'opsz' 48, 'SOFT' 80",
                fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                letterSpacing: '-0.008em',
              }}>
            Un código verificable por cualquier persona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center max-w-4xl mx-auto">
          {/* Certificado mock — editorial cream double-rule */}
          <div className="relative"
               style={{
                 border: '1px solid rgba(184,151,90,0.55)',
                 backgroundColor: 'var(--color-surface-raised)',
                 padding: '2.2rem 1.6rem',
               }}>
            <div className="absolute pointer-events-none"
                 style={{ inset: 8, border: '1px solid rgba(184,151,90,0.22)' }}
                 aria-hidden="true" />
            <div className="relative text-center">
              <AtlasLabel tone="ornament" size="xs" className="mb-3 mx-auto">
                Selene Academia
              </AtlasLabel>
              <p className="font-display italic text-[var(--color-text-muted)] mb-1"
                 style={{ fontSize: '13px', fontVariationSettings: "'opsz' 18, 'SOFT' 60" }}>
                Acta de finalización
              </p>
              <div className="w-10 h-px bg-[var(--color-rule-ornament)] mx-auto my-4" />
              <p className="font-display italic text-[var(--color-text-muted)]"
                 style={{ fontSize: '12px', fontVariationSettings: "'opsz' 18, 'SOFT' 60" }}>
                Otorgada a
              </p>
              <p className="font-display text-[var(--color-text)] mt-1 mb-1"
                 style={{
                   fontSize: 'var(--step-1)',
                   fontWeight: 500,
                   fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                   fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                 }}>
                Luna M. Estévez
              </p>
              <p className="font-display italic text-[var(--color-text-muted)] mt-3"
                 style={{ fontSize: '12px', fontVariationSettings: "'opsz' 18, 'SOFT' 60" }}>
                por completar el volumen
              </p>
              <p className="font-display text-[var(--color-text-accent)] italic mt-1 mb-5"
                 style={{
                   fontSize: '15px',
                   fontWeight: 500,
                   fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                 }}>
                Astrología Natal Profunda
              </p>
              <div className="inline-block px-4 py-2.5"
                   style={{
                     border: '1px solid var(--color-rule-ornament)',
                     backgroundColor: 'color-mix(in oklab, var(--ref-gold) 6%, transparent)',
                   }}>
                <AtlasLabel tone="faint" size="xs" className="mb-1 block">
                  Código de verificación
                </AtlasLabel>
                <code className="tnum"
                      style={{
                        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                        fontSize: '13px',
                        color: 'var(--color-text-ornament)',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                      }}>
                  SEL-2026-0042-A7X9K3
                </code>
              </div>
            </div>
          </div>

          {/* Explanation — three steps editorial */}
          <div>
            <p className="font-display italic mb-6 text-[var(--color-text-muted)]"
               lang="es"
               style={{
                 fontSize: 'var(--step-0)',
                 lineHeight: 1.6,
                 fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                 textAlign: 'justify',
                 hyphens: 'auto',
               }}>
              Cada certificado lleva un código único que cualquier persona
              puede comprobar al instante. Sin intermediarios ni papel.
            </p>
            <ol className="space-y-5 mb-7">
              {[
                'Completa el curso y aprueba la evaluación final.',
                'El acta se emite en tu nombre con código único de verificación.',
                'La compartes — cualquiera puede comprobar su autenticidad con ese código.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-baseline">
                  <span className="font-display italic text-[var(--color-text-ornament)] shrink-0"
                        style={{
                          fontSize: '22px',
                          fontVariationSettings: "'opsz' 36, 'WONK' 0",
                          fontWeight: 400,
                        }}>
                    {['I','II','III'][i]}.
                  </span>
                  <p className="font-display text-[var(--color-text)]"
                     style={{
                       fontSize: 'var(--step-0)',
                       lineHeight: 1.55,
                       fontVariationSettings: "'opsz' 18, 'SOFT' 80",
                     }}>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <Link
              href="/verificar"
              className="inline-flex items-center px-6 py-3 rounded-xl no-underline"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-body), Lora, Georgia, serif',
                color: 'var(--color-text-ornament)',
                border: '1px solid var(--color-rule-ornament)',
                letterSpacing: '0.02em',
              }}
            >
              Verificar un certificado →
            </Link>
          </div>
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
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § V — LOS TESTIMONIOS (epístolas)
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <ChapterSignature
            title="LOS TESTIMONIOS"
            align="center"
            className="mb-6 mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-3xl mx-auto">
          {[
            { name: 'Patricia G.', course: 'Astrología Natal',  text: 'Llevaba años leyendo sobre astrología pero nunca había encontrado un curso que citase estudios reales. Ahora entiendo mi carta natal de verdad.' },
            { name: 'Marina L.',   course: 'Tarot Intuitivo',   text: 'Soy psicóloga y buscaba algo con base científica para complementar mis sesiones. Las referencias a neurociencia son un plus enorme.' },
            { name: 'Carmen D.',   course: 'Meditación Lunar',  text: 'El formato de texto + slides me encanta. Puedo estudiar en el metro sin auriculares. Las meditaciones guiadas son un regalo aparte.' },
            { name: 'Sofía R.',    course: 'Astrología Natal',  text: 'Lo que más valoro es que no te piden creer ciegamente. Te dan las fuentes y tú decides. El certificado verificable me dio credibilidad con mis primeras clientas.' },
          ].map((t, i) => (
            <figure key={i} className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-4 -left-2 font-display italic"
                style={{
                  fontSize: '3rem',
                  color: 'var(--color-rule-ornament)',
                  lineHeight: 1,
                  fontVariationSettings: "'opsz' 96, 'SOFT' 60",
                }}>
                “
              </span>
              <blockquote
                className="font-display italic pl-5"
                lang="es"
                style={{
                  fontSize: 'var(--step-0)',
                  color: 'var(--color-text)',
                  lineHeight: 1.65,
                  fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                }}
              >
                {t.text}
              </blockquote>
              <figcaption
                className="mt-4 pl-5 flex items-baseline gap-3"
              >
                <AtlasLabel tone="ornament" size="xs">{t.name}</AtlasLabel>
                <span className="text-[rgba(184,151,90,0.5)] select-none">·</span>
                <span
                  className="font-display italic"
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    fontVariationSettings: "'opsz' 14, 'SOFT' 50",
                  }}>
                  {t.course}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Slim divider before colophon */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <img
          src="/ornaments/divider-lunar-simple.webp"
          alt=""
          className="block max-w-[min(720px,90vw)] w-full h-auto opacity-70 select-none"
          style={{
            filter: 'sepia(0.18) saturate(0.88) contrast(1.02)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          CTA FINAL + COLOFÓN
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 pt-14 pb-10">
        <div className="text-center mb-10">
          <h2 className="font-display mx-auto mb-4"
              style={{
                maxWidth: '18ch',
                fontSize: 'var(--step-3)',
                color: 'var(--color-text)',
                fontWeight: 500,
                lineHeight: 1.1,
                fontVariationSettings: "'opsz' 48, 'SOFT' 100",
                fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
                letterSpacing: '-0.012em',
              }}>
            Tu camino empieza
            <span className="block font-display italic mt-1 text-[var(--color-text-accent)]"
                  style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 60" }}>
              aquí
            </span>
          </h2>
          <p className="font-display italic mx-auto mb-8 text-[var(--color-text-muted)]"
             lang="es"
             style={{
               fontSize: 'var(--step-0)',
               maxWidth: '46ch',
               lineHeight: 1.6,
               fontVariationSettings: "'opsz' 24, 'SOFT' 60",
             }}>
            Curso introductorio gratuito. Sin tarjeta. Tu carta natal
            personaliza la ruta. Garantía de devolución de 14 días en
            todos los volúmenes de pago.
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
              boxShadow: 'inset 0 1px 0 rgba(251,246,238,0.15), 0 2px 10px rgba(45,31,20,0.12)',
            }}
          >
            Crear mi cuenta gratis
          </Link>
        </div>

        {/* Colofón */}
        <div className="mt-16 pb-4 text-center">
          <span className="colophon-divider" aria-hidden="true" />
          <p className="colophon">
            Compuesto en Fraunces sobre pergamino digital
            <br />
            <span style={{
              fontFeatureSettings: "'smcp' 1",
              letterSpacing: '0.18em',
              color: 'var(--color-text-ornament)',
              fontStyle: 'normal',
            }}>
              Academia Selenaura · MMXXVI
            </span>
          </p>
          <p className="mt-6">
            <a
              href="https://selenaura.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display italic no-underline"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                fontVariationSettings: "'opsz' 18, 'SOFT' 60",
              }}
            >
              ¿Buscas lecturas personalizadas? Visita selenaura.com →
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
