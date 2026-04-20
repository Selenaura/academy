import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer } from '@/components/ui';
import { notFound } from 'next/navigation';
import PixelViewContent from './PixelViewContent';
import ChapterSignature from '@/components/ChapterSignature';
import AtlasLabel from '@/components/AtlasLabel';
import Colophon from '@/components/Colophon';

export async function generateStaticParams() {
  return COURSES.map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = COURSES.find(c => c.id === id);
  if (!course) return {};

  const priceText = course.price === 0 ? 'Gratis' : course.price_label;
  const description = `${course.description || course.subtitle} ${course.hours} de contenido · ${course.modules} módulos · ${priceText}. Base científica: ${course.science || ''}`.slice(0, 300);

  return {
    title: `${course.title} — Curso ${priceText} — Selene Academia`,
    description,
    openGraph: {
      title: `${course.title} — Curso ${priceText}`,
      description: course.subtitle,
      url: `https://academy.selenaura.com/catalogo/${course.id}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://academy.selenaura.com/catalogo/${course.id}`,
    },
  };
}

/**
 * Detalle de curso — editorial cream.
 *
 * Patrón "book interior":
 *  - Breadcrumb + ChapterSignature con título del curso
 *  - Kicker smcp "Nivel X · Horas · Módulos"
 *  - Headline en display cream + dek italic
 *  - 3 "notas del autor" en hairline frames (Base científica, Para
 *    quién, Al terminar sabrás) sustituyen los bg-pastel SaaS
 *  - Stats en tnum como cuadro de indicios
 *  - CTA ink chocolate
 *  - § Contenido: módulos como SUB-CAPÍTULOS (§ I, § II...) con
 *    lecciones como listas dentro de cada uno
 *  - CTA final repetido (sticky en mobile)
 */
export default async function CursoDetallePage({ params }) {
  const { id } = await params;
  const course = COURSES.find(c => c.id === id);
  if (!course) notFound();

  // Group lessons by module
  const modules = {};
  course.lessons.forEach(lesson => {
    const m = lesson.module || 1;
    if (!modules[m]) modules[m] = [];
    modules[m].push(lesson);
  });

  const totalLessons = course.lessons.filter(l => l.type === 'lesson' || l.type === 'video').length;
  const totalQuizzes = course.lessons.filter(l => l.type === 'quiz').length;
  const hasExam = course.lessons.some(l => l.type === 'exam');

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || course.subtitle,
    provider: {
      '@type': 'Organization',
      name: 'Selene Academia',
      url: 'https://academy.selenaura.com',
    },
    ...(course.price === 0 && {
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'Free',
      },
    }),
    ...(course.price > 0 && {
      offers: {
        '@type': 'Offer',
        price: (course.price / 100).toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    }),
    educationalLevel: course.level,
    inLanguage: 'es',
    numberOfCredits: course.modules,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: course.hours,
    },
  };

  const href = course.price === 0 ? '/auth?redirect=/dashboard' : `/auth?redirect=/curso/${course.id}`;
  const ctaLabel = course.price === 0 ? 'Empezar gratis' : `Inscribirme · ${course.price_label}`;

  // Notas del autor — array declarativo que se renderiza si hay datos
  const authorNotes = [
    course.science   && { kicker: 'Base científica',     text: course.science,   key: 'science' },
    course.for_whom  && { kicker: 'Para quién es',       text: course.for_whom,  key: 'for_whom' },
    course.outcome   && { kicker: 'Al terminar sabrás',  text: course.outcome,   key: 'outcome' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen atlas-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <PixelViewContent courseId={course.id} title={course.title} price={course.price} />
      <Navbar />

      {/* Breadcrumb editorial */}
      <div className="max-w-content mx-auto px-6 pt-6">
        <Link
          href="/catalogo"
          className="no-underline font-display italic"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            fontVariationSettings: "'opsz' 18, 'SOFT' 60",
          }}
        >
          ← Volver al catálogo
        </Link>
      </div>

      {/* HERO del curso */}
      <section className="max-w-content mx-auto px-6 pt-8 pb-10">
        <ChapterSignature
          title={`NIVEL · ${course.level?.toUpperCase() || ''}`}
          align="center"
          className="mb-8 mx-auto"
        />

        <div className="text-center max-w-[660px] mx-auto">
          <h1
            className="font-display mb-5"
            style={{
              fontSize: 'var(--step-4)',
              lineHeight: '1.05',
              fontWeight: 600,
              color: 'var(--color-text)',
              fontVariationSettings: "'opsz' 96, 'SOFT' 100",
              fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
              letterSpacing: '-0.018em',
              hyphens: 'none',
              WebkitHyphens: 'none',
            }}
          >
            {course.title}
          </h1>

          {course.subtitle && (
            <p
              className="font-display italic mx-auto mb-6 text-[var(--color-text-muted)]"
              lang="es"
              style={{
                fontSize: 'var(--step-1)',
                maxWidth: '54ch',
                lineHeight: '1.55',
                fontVariationSettings: "'opsz' 28, 'SOFT' 60",
              }}
            >
              {course.subtitle}
            </p>
          )}

          {course.description && (
            <p
              className="mx-auto mb-8"
              lang="es"
              style={{
                fontFamily: 'var(--font-body), Lora, Georgia, serif',
                fontSize: 'var(--step-0)',
                maxWidth: '58ch',
                lineHeight: 1.65,
                color: 'var(--color-text)',
                textAlign: 'justify',
                hyphens: 'auto',
              }}
            >
              {course.description}
            </p>
          )}

          {/* Stats editoriales en tnum */}
          <div className="flex justify-center gap-8 flex-wrap mb-8">
            {[
              { label: 'Duración',  value: course.hours },
              { label: 'Módulos',   value: `${course.modules}` },
              { label: 'Lecciones', value: `${totalLessons}` },
              totalQuizzes > 0 && { label: 'Quizzes', value: `${totalQuizzes}` },
              hasExam && { label: 'Certificado', value: '✓' },
            ].filter(Boolean).map(s => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display tnum"
                  style={{
                    fontSize: 'var(--step-1)',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                    fontFeatureSettings: "'tnum' 1, 'liga' 0, 'kern' 1",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <AtlasLabel tone="faint" size="xs" className="mt-1.5 block">
                  {s.label}
                </AtlasLabel>
              </div>
            ))}
          </div>

          {/* Precio prominente */}
          <div className="mb-6">
            {course.price === 0 ? (
              <AtlasLabel tone="ornament" size="md">
                Gratis · Sin tarjeta
              </AtlasLabel>
            ) : (
              <span
                className="font-display tnum"
                style={{
                  fontSize: 'var(--step-3)',
                  fontWeight: 600,
                  color: 'var(--color-text-ornament)',
                  fontVariationSettings: "'opsz' 48, 'SOFT' 100",
                }}
              >
                {course.price_label}
              </span>
            )}
          </div>

          {/* CTA primary */}
          <Link
            href={href}
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
            {ctaLabel}
          </Link>

          {/* Sample notice */}
          {course.is_sample && course.sample_notice && (
            <p
              className="mt-6 font-display italic mx-auto"
              lang="es"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                maxWidth: '52ch',
                fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                lineHeight: 1.55,
              }}
            >
              <AtlasLabel tone="ornament" size="xs" className="inline-flex mr-2">
                Curso de muestra
              </AtlasLabel>
              {course.sample_notice}
            </p>
          )}
        </div>
      </section>

      {/* NOTAS DEL AUTOR — tres hairline frames en cream raised */}
      {authorNotes.length > 0 && (
        <section className="max-w-content-lg mx-auto px-6 py-10">
          <div
            className={`grid gap-4 md:gap-6 ${
              authorNotes.length === 3 ? 'md:grid-cols-3'
              : authorNotes.length === 2 ? 'md:grid-cols-2'
              : 'grid-cols-1 max-w-[640px] mx-auto'
            }`}
          >
            {authorNotes.map(note => (
              <article
                key={note.key}
                className="relative px-6 py-6"
                style={{
                  border: '1px solid var(--color-rule-ornament)',
                  backgroundColor: 'var(--color-surface-raised)',
                }}
              >
                <AtlasLabel tone="ornament" size="xs" className="mb-3">
                  {note.kicker}
                </AtlasLabel>
                <p
                  lang="es"
                  style={{
                    fontFamily: 'var(--font-body), Lora, Georgia, serif',
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    lineHeight: 1.6,
                    textAlign: 'justify',
                    hyphens: 'auto',
                  }}
                >
                  {note.text}
                </p>
              </article>
            ))}
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
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* CONTENIDO — módulos como sub-capítulos */}
      <section className="max-w-content mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <ChapterSignature
            title="EL CONTENIDO"
            align="center"
            className="mb-6 mx-auto"
          />
          <h2
            className="font-display font-medium"
            style={{
              fontSize: 'var(--step-3)',
              color: 'var(--color-text)',
              fontVariationSettings: "'opsz' 48, 'SOFT' 80",
              fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
              letterSpacing: '-0.008em',
            }}
          >
            {Object.keys(modules).length} módulos, {totalLessons} lecciones
          </h2>
        </div>

        <div className="max-w-[720px] mx-auto">
          {Object.entries(modules).map(([moduleNum, lessons], idx) => {
            const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][idx] || `${idx+1}`;
            return (
              <details
                key={moduleNum}
                open={idx === 0}
                className="group border-b py-4"
                style={{ borderColor: 'var(--color-rule)' }}
              >
                <summary className="list-none cursor-pointer flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4 flex-1 min-w-0">
                    <span
                      className="font-display italic shrink-0"
                      style={{
                        fontSize: '20px',
                        color: 'var(--color-text-ornament)',
                        fontVariationSettings: "'opsz' 36, 'SOFT' 80",
                        fontWeight: 400,
                        lineHeight: 1,
                      }}
                    >
                      §&nbsp;{roman}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display leading-tight"
                        style={{
                          fontSize: 'var(--step-1)',
                          fontWeight: 500,
                          color: 'var(--color-text)',
                          fontVariationSettings: "'opsz' 24, 'SOFT' 80",
                          fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                        }}
                      >
                        {course.module_names?.[moduleNum] || `Módulo ${moduleNum}`}
                      </h3>
                      <AtlasLabel tone="faint" size="xs" className="mt-1">
                        {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
                      </AtlasLabel>
                    </div>
                  </div>
                  <span
                    className="shrink-0 transition-transform group-open:rotate-45 font-display"
                    style={{
                      fontSize: '22px',
                      color: 'var(--color-text-ornament)',
                      fontWeight: 300,
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>

                <ol
                  className="pl-12 pt-4 space-y-2.5"
                  style={{ listStyle: 'none' }}
                >
                  {lessons.map((lesson, i) => {
                    const glyph = lesson.type === 'quiz' ? '◇'
                               : lesson.type === 'exam' ? '◈'
                               : '·';
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-baseline gap-3"
                      >
                        <span
                          className="shrink-0"
                          style={{
                            color: 'var(--color-text-ornament)',
                            fontSize: '12px',
                            width: '1.6rem',
                            fontFamily: 'ui-monospace, monospace',
                          }}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="flex-1"
                          style={{
                            fontFamily: 'var(--font-body), Lora, Georgia, serif',
                            fontSize: '14px',
                            color: 'var(--color-text)',
                            lineHeight: 1.5,
                          }}
                        >
                          <span className="mr-1.5 text-[var(--color-text-ornament)]" aria-hidden="true">{glyph}</span>
                          {lesson.title}
                        </span>
                        <span
                          className="shrink-0 font-display italic tnum"
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-faint)',
                            fontVariationSettings: "'opsz' 14, 'SOFT' 50",
                            fontFeatureSettings: "'tnum' 1",
                          }}
                        >
                          {lesson.duration}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </details>
            );
          })}
        </div>

        {/* CTA final */}
        <div className="text-center mt-14">
          <Link
            href={href}
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
            {ctaLabel}
          </Link>
          <p
            className="mt-4 font-display italic"
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              fontVariationSettings: "'opsz' 18, 'SOFT' 60",
            }}
          >
            {course.price === 0
              ? 'Sin tarjeta. Acceso inmediato.'
              : 'Acceso inmediato tras el pago · Garantía 14 días · Todas las ediciones futuras incluidas'}
          </p>
        </div>
      </section>

      {/* COLOFÓN — el diferenciador editorial.
         Si el curso tiene datos de ediciones (course.editions), se
         renderizan. Si no, el componente muestra una primera edición
         genérica — nunca queda vacío. El texto fijo "todas las
         ediciones presentes y futuras sin coste" comunica el valor
         único que ningún competidor LMS tiene. */}
      <div className="max-w-content mx-auto px-6">
        <Colophon
          editions={course.editions}
          courseName={course.title}
        />
      </div>

      <Footer />
    </div>
  );
}
