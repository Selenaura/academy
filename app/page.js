import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, Card, GoldDivider } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';

export default function LandingPage() {
  // Course schema for Google rich snippets
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
    { value: '10', label: 'Cursos' },
    { value: '200+', label: 'Lecciones' },
    { value: '30+', label: 'Estudios citados' },
    { value: '6', label: 'Certificaciones' },
  ];

  // Group courses by level for the catalog
  const levels = [
    { key: 'intro', label: 'Empieza gratis', sublabel: 'Tu primer paso sin compromiso', courses: COURSES.filter(c => c.price === 0) },
    { key: 'nivel1', label: 'Nivel 1 — Fundamentos', sublabel: 'Bases sólidas con respaldo científico', courses: COURSES.filter(c => c.level === 'Nivel 1') },
    { key: 'nivel2', label: 'Nivel 2 — Especialización', sublabel: 'Profundiza en áreas específicas', courses: COURSES.filter(c => c.level === 'Nivel 2') },
    { key: 'nivel3', label: 'Nivel 3 — Profesional', sublabel: 'Camino a la certificación profesional', courses: COURSES.filter(c => c.level === 'Nivel 3') },
  ];

  const comparisonRows = [
    { label: 'Base', selene: 'Estudios peer-reviewed citados', typical: '"Así me lo enseñaron"' },
    { label: 'Certificados', selene: 'Verificables con código CSV', typical: 'Sin validez comprobable' },
    { label: 'Personalización', selene: 'Carta natal integrada', typical: 'Contenido genérico' },
    { label: 'Formato', selene: 'Texto + slides + PDF', typical: 'Solo vídeo' },
    { label: 'Rigor', selene: 'Desmonta mitos activamente', typical: 'Repite mitos' },
    { label: 'Curso introductorio', selene: 'Gratis', typical: '50–200\u20AC' },
  ];

  return (
    <div className="min-h-screen bg-selene-bg">
      <SchemaMarkup data={courseListSchema} />
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="relative px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial-gold pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-block text-[11px] text-selene-gold font-semibold px-4 py-1.5 rounded-full border border-selene-gold/20 bg-selene-gold/5 tracking-[0.1em] uppercase mb-8">
            ✦ Ciencia y consciencia de lo invisible ✦
          </div>

          <h1 className="font-display text-[clamp(36px,6vw,56px)] font-normal leading-[1.15] text-gradient-gold max-w-[700px] mx-auto mb-5">
            Tu escuela de consciencia cósmica
          </h1>

          <p className="text-[17px] text-selene-white-dim leading-relaxed font-light max-w-[520px] mx-auto mb-8">
            Cursos que combinan tradición milenaria con neurociencia moderna.
            Tu carta natal guía tu camino. Estudios citados en cada lección.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
            >
              Empieza gratis
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex items-center text-[15px] font-semibold text-selene-gold px-10 py-4 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
            >
              Ver cursos ↓
            </Link>
          </div>

          <div className="flex justify-center gap-10 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-[28px] text-selene-gold font-semibold">{s.value}</div>
                <div className="text-xs text-selene-white-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust row ── */}
      <div className="flex flex-wrap justify-center gap-6 px-6 py-8 border-y border-selene-border/50">
        {[
          { icon: '🔬', text: 'Estudios peer-reviewed' },
          { icon: '🎓', text: 'Certificados verificables' },
          { icon: '🔒', text: 'Pago seguro · Stripe' },
          { icon: '🛡️', text: 'Garantía 14 días' },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px] text-selene-white-dim">
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      {/* ── 2. Course Catalog ── */}
      <section id="catalogo" className="px-6 py-16 max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">
            Catálogo formativo
          </h2>
          <p className="text-sm text-selene-white-dim">
            De principiante a guía profesional certificada · 10 cursos · 200+ lecciones
          </p>
        </div>

        {levels.map(level => (
          <div key={level.key} className="mb-12 last:mb-0">
            <div className="mb-6">
              <h3 className="font-display text-lg text-selene-white font-medium">{level.label}</h3>
              <p className="text-xs text-selene-white-dim mt-1">{level.sublabel}</p>
            </div>

            <div className={`grid gap-4 ${level.courses.length === 1 ? 'grid-cols-1 max-w-[480px]' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {level.courses.map(course => (
                <Link key={course.id} href={`/catalogo/${course.id}`} className="no-underline">
                  <Card hover className="p-5 h-full relative">
                    {/* Price / Free badge */}
                    <div className="absolute top-4 right-4">
                      {course.price === 0 ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-selene-success/10 text-selene-success border border-selene-success/20">
                          {course.price_label}
                        </span>
                      ) : (
                        <span className="text-[14px] font-bold text-selene-gold">
                          {course.price_label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-3 pr-20">
                      <span className="text-[28px] shrink-0">{course.icon}</span>
                      <div>
                        <h4 className="text-[15px] font-semibold text-selene-white leading-tight">{course.title}</h4>
                        <p className="text-[11px] text-selene-white-dim mt-1 line-clamp-2">{course.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-selene-white-dim">
                      <span className="flex items-center gap-1">
                        <span className="text-selene-lavender">◷</span> {course.hours}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-selene-lavender">▦</span> {course.modules} módulos
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-selene-lavender">◈</span> {course.level}
                      </span>
                    </div>

                    {/* Tag */}
                    {course.tag && course.tag !== 'Masterclass gratuita' && (
                      <div className="mt-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide"
                          style={{ color: '#0C0E1A', background: course.color }}
                        >
                          {course.tag}
                        </span>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <GoldDivider />

      {/* ── 3. Why Selene + Comparison ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            ¿Por qué Selene?
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto">
            Una academia que no te pide fe ciega — te da evidencia.
          </p>
        </div>

        {/* Value props — compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '🔬', title: 'Base científica', desc: 'Cada lección cita estudios peer-reviewed. Cronobiología, neuroplasticidad, psicología positiva.' },
            { icon: '🎓', title: 'Certificados CSV', desc: 'Código de verificación único por certificado. Cualquier persona puede comprobar su autenticidad.' },
            { icon: '📖', title: 'Multi-formato', desc: 'Texto detallado, presentaciones visuales y PDFs descargables. Aprende como prefieras, sin depender de vídeo.' },
          ].map((v, i) => (
            <Card key={i} className="p-5 text-center">
              <div className="text-2xl mb-3">{v.icon}</div>
              <div className="text-[14px] font-semibold text-selene-white mb-1.5 font-display">{v.title}</div>
              <div className="text-[12px] text-selene-white-dim leading-relaxed">{v.desc}</div>
            </Card>
          ))}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-selene-border overflow-hidden">
          <div className="grid grid-cols-3 bg-selene-elevated">
            <div className="px-4 py-3 text-[11px] font-semibold text-selene-white-dim uppercase tracking-wider" />
            <div className="px-4 py-3 text-[11px] font-semibold text-selene-gold uppercase tracking-wider text-center">
              Selene
            </div>
            <div className="px-4 py-3 text-[11px] font-semibold text-selene-white-dim uppercase tracking-wider text-center">
              Típico
            </div>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-selene-card' : 'bg-selene-bg'} ${i < comparisonRows.length - 1 ? 'border-b border-selene-border' : ''}`}
            >
              <div className="px-4 py-3 text-[12px] font-semibold text-selene-white flex items-center">
                {row.label}
              </div>
              <div className="px-4 py-3 text-[12px] text-selene-success text-center flex items-center justify-center gap-1.5">
                <span className="font-bold">✓</span>
                <span>{row.selene}</span>
              </div>
              <div className="px-4 py-3 text-[12px] text-selene-white-dim text-center flex items-center justify-center gap-1.5 opacity-60">
                <span className="text-selene-rose font-bold">✗</span>
                <span>{row.typical}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* ── 4. Certificates ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Certificate mockup */}
          <div className="bg-gradient-card rounded-2xl border border-selene-border p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-selene-gold/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-selene-gold/10 to-transparent" />
            <div className="relative text-center">
              <div className="text-selene-gold text-lg mb-2">✦</div>
              <div className="font-display text-[11px] text-selene-gold uppercase tracking-[0.2em] mb-1">
                Selene Academia
              </div>
              <div className="font-display text-lg text-selene-white mb-1">
                Certificado de Finalización
              </div>
              <div className="w-8 h-px bg-selene-gold/30 mx-auto my-3" />
              <div className="text-[13px] text-selene-white-dim mb-1">Otorgado a</div>
              <div className="font-display text-selene-white text-base mb-3">Luna M. Estévez</div>
              <div className="text-[13px] text-selene-white-dim mb-1">por completar el curso</div>
              <div className="font-display text-selene-gold text-sm mb-4">
                Astrología Natal Profunda
              </div>
              <div className="inline-block bg-selene-gold/10 border border-selene-gold/30 rounded-lg px-4 py-2.5">
                <div className="text-[10px] text-selene-white-dim uppercase tracking-wider mb-1">
                  Código de verificación
                </div>
                <div className="font-mono text-selene-gold text-sm font-semibold tracking-wider">
                  SEL-2026-0042-A7X9K3
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h2 className="font-display text-[24px] font-normal text-selene-white mb-4">
              Certificados verificables
            </h2>
            <p className="text-[14px] text-selene-white-dim leading-relaxed mb-6">
              Cada certificado incluye un código CSV único que cualquier persona puede verificar al instante. Sin intermediarios, sin papel — verificación digital inmediata.
            </p>
            <div className="space-y-3">
              {[
                { n: '1', text: 'Completa el curso y aprueba la evaluación final' },
                { n: '2', text: 'Se genera automáticamente tu certificado con código único' },
                { n: '3', text: 'Compártelo — es verificable por cualquier persona' },
              ].map(step => (
                <div key={step.n} className="flex items-center gap-3">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-selene-gold text-xs font-display font-semibold">
                    {step.n}
                  </div>
                  <span className="text-[13px] text-selene-white-dim">{step.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/verificar"
                className="inline-flex items-center gap-2 text-sm font-semibold text-selene-gold px-6 py-3 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
              >
                Verificar un certificado →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── 5. Testimonials + Final CTA ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        {/* Testimonials — compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { initial: 'P', name: 'Patricia G.', location: 'Sevilla · Astrología Natal', stars: 5, text: 'Llevaba años leyendo sobre astrología pero nunca había encontrado un curso que citase estudios reales. Ahora entiendo mi carta natal de verdad.' },
            { initial: 'M', name: 'Marina L.', location: 'Buenos Aires · Tarot Intuitivo', stars: 5, text: 'Soy psicóloga y buscaba algo con base científica para complementar mis sesiones. Las referencias a neurociencia son un plus enorme.' },
            { initial: 'C', name: 'Carmen D.', location: 'Barcelona · Meditación Lunar', stars: 5, text: 'El formato de texto + slides me encanta. Puedo estudiar en el metro sin auriculares. Las meditaciones guiadas son un regalo aparte.' },
            { initial: 'S', name: 'Sofía R.', location: 'Ciudad de México · Astrología Natal', stars: 4, text: 'Lo que más valoro es que no te piden creer ciegamente. Te dan las fuentes y tú decides. El certificado verificable me dio credibilidad con mis primeras clientas.' },
          ].map((t, i) => (
            <div key={i} className="bg-selene-card/50 rounded-2xl border border-selene-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-selene-gold/15 border border-selene-gold/30 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">{t.initial}</div>
                <div>
                  <div className="text-[12px] text-selene-white font-semibold">{t.name}</div>
                  <div className="text-[10px] text-selene-white-dim">{t.location}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.stars)].map((_, j) => <span key={j} className="text-selene-gold text-xs">★</span>)}
                  {[...Array(5 - t.stars)].map((_, j) => <span key={`e${j}`} className="text-selene-white-dim/30 text-xs">★</span>)}
                </div>
              </div>
              <p className="text-[12px] text-selene-white-dim leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Tu camino empieza aquí
          </h2>
          <p className="text-sm text-selene-white-dim mb-3 max-w-md mx-auto">
            Curso introductorio 100% gratuito. Sin tarjeta de crédito.
            Tu carta natal personaliza tu ruta.
          </p>
          <p className="text-[13px] text-selene-gold/70 mb-6">
            Garantía de devolución de 14 días en todos los cursos de pago.
          </p>
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
          >
            Crear mi cuenta gratis
          </Link>

          {/* Cross-link to selenaura.com */}
          <div className="mt-8 pt-6 border-t border-selene-border/50">
            <p className="text-xs text-selene-white-dim/50 mb-2">
              ¿Buscas lecturas personalizadas, tarot o tu horóscopo diario?
            </p>
            <a
              href="https://selenaura.com"
              className="text-xs text-selene-lavender hover:text-selene-gold no-underline transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visita selenaura.com →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
