import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';
import SocialProofToast from '@/components/SocialProofToast';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import QuizFunnelCTA from '@/components/QuizFunnelCTA';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import CohortBanner from '@/components/CohortBanner';

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
    { value: '14', label: 'Días de garantía' },
  ];

  const valueProps = [
    {
      icon: '🔬',
      title: 'Base científica real',
      desc: 'Cada lección cita estudios peer-reviewed. No dogmas, no pseudociencia. Cronobiología, neuroplasticidad, psicología positiva.',
    },
    {
      icon: '🎓',
      title: 'Certificados verificables',
      desc: 'Al completar cada curso recibes un certificado con código CSV único que cualquier persona puede verificar en nuestra web.',
    },
    {
      icon: '🌙',
      title: 'Personalización astrológica',
      desc: 'Tu carta natal guía tu ruta formativa. No hay dos caminos iguales porque no hay dos cartas iguales.',
    },
    {
      icon: '📖',
      title: 'Multi-formato',
      desc: 'Texto detallado, presentaciones visuales y PDFs descargables. Aprende como prefieras.',
    },
    {
      icon: '🧠',
      title: 'Gamificación inteligente',
      desc: 'XP, rachas, insignias y tabla de clasificación. Aprender sobre ti misma es adictivo cuando hay progreso visible.',
    },
    {
      icon: '💬',
      title: 'Comunidad',
      desc: 'Comparte tu camino con otras personas que toman la astrología en serio. Sin humo, con ciencia.',
    },
  ];

  const comparisonRows = [
    { label: 'Base', selene: 'Estudios peer-reviewed citados', typical: '"Así me lo enseñaron"' },
    { label: 'Certificados', selene: 'Verificables con código CSV', typical: 'Sin validez comprobable' },
    { label: 'Personalización', selene: 'Carta natal integrada', typical: 'Contenido genérico' },
    { label: 'Formato', selene: 'Texto + slides + PDF', typical: 'Solo vídeo' },
    { label: 'Rigor', selene: 'Desmonta mitos activamente', typical: 'Repite mitos' },
    { label: 'Precio curso intro', selene: 'Gratis', typical: '50–200\u20AC' },
  ];

  return (
    <div className="min-h-screen bg-selene-bg">
      <SchemaMarkup data={courseListSchema} />
      <CohortBanner />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial-gold pointer-events-none" />
        <div className="absolute top-10 right-[10%] w-1 h-1 rounded-full bg-selene-gold shadow-[0_0_20px_rgba(155,142,196,0.4)] animate-pulse-gold" />
        <div className="absolute top-28 left-[15%] w-0.5 h-0.5 rounded-full bg-selene-blue-light shadow-[0_0_15px_rgba(107,143,197,0.4)] animate-pulse-gold" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <div className="inline-block text-[11px] text-selene-gold font-semibold px-4 py-1.5 rounded-full border border-selene-gold/20 bg-selene-gold/5 tracking-[0.1em] uppercase">
              ✦ Ciencia y consciencia de lo invisible ✦
            </div>
            <div className="inline-block text-[11px] font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 tracking-[0.1em] uppercase">
              100% Online — A tu ritmo
            </div>
          </div>

          <h1 className="font-display text-[clamp(36px,6vw,64px)] font-normal leading-[1.15] text-gradient-gold max-w-[700px] mx-auto mb-6">
            Tu escuela de consciencia cósmica
          </h1>

          <p className="text-[17px] text-selene-white-dim leading-relaxed font-light max-w-[540px] mx-auto mb-10">
            Cursos que combinan tradición milenaria con neurociencia moderna.
            Tu carta natal guía tu camino. Estudios citados en cada lección.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
            >
              Empieza gratis — Curso introductorio
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center text-[15px] font-semibold text-selene-gold px-10 py-4 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
            >
              Ver catálogo
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-16 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-[32px] text-selene-gold font-semibold">{s.value}</div>
                <div className="text-xs text-selene-white-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campaign Highlights / Novedades ── */}
      <section className="px-6 py-10 max-w-[900px] mx-auto">
        <div className="bg-gradient-to-br from-[#0f0f1a] via-selene-card to-[#0f0f1a] rounded-2xl border border-selene-gold/15 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-selene-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-[11px] text-selene-gold font-semibold tracking-[0.15em] uppercase mb-3">
              Novedades
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Premium card */}
              <div className="bg-selene-bg/50 rounded-xl border border-selene-gold/10 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-selene-gold/15 text-selene-gold tracking-wide">Nuevo</span>
                  <span className="text-[11px] text-selene-white-dim">Premium</span>
                </div>
                <h3 className="text-[16px] font-semibold text-selene-white mb-1.5">
                  Suscripción Premium
                </h3>
                <p className="text-[13px] text-selene-white-dim leading-relaxed mb-3">
                  Acceso ilimitado a todas las lecturas, horóscopo personalizado diario y contenido exclusivo por 9,99 EUR/mes.
                </p>
                <a
                  href="https://selenaura.com/premium"
                  className="inline-flex items-center text-[12px] font-semibold text-selene-gold hover:text-selene-gold-light no-underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descubre Premium &rarr;
                </a>
              </div>

              {/* Weekly theme card */}
              <div className="bg-selene-bg/50 rounded-xl border border-selene-gold/10 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A855F7]/15 text-[#A855F7] tracking-wide">Cosmos</span>
                  <span className="text-[11px] text-selene-white-dim">Esta semana</span>
                </div>
                <h3 className="text-[16px] font-semibold text-selene-white mb-1.5">
                  Luna menguante en Sagitario
                </h3>
                <p className="text-[13px] text-selene-white-dim leading-relaxed mb-3">
                  Tiempo de soltar creencias que ya no sirven y prepararte para nuevos comienzos. Consulta tu horóscopo personalizado.
                </p>
                <a
                  href="https://selenaura.com/horóscopo-diario"
                  className="inline-flex items-center text-[12px] font-semibold text-selene-gold hover:text-selene-gold-light no-underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tu horóscopo de hoy &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — 3 Steps ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Empieza en 3 minutos
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-4">
            Sin complicaciones. Sin tarjeta de crédito. Solo curiosidad.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              icon: '✦',
              title: 'Crea tu cuenta gratis',
              desc: 'Solo necesitas un email. En 30 segundos tienes acceso al curso introductorio completo.',
            },
            {
              step: '2',
              icon: '☽',
              title: 'Introduce tus datos de nacimiento',
              desc: 'Con tu fecha, hora y lugar calculamos tu carta natal. Tu ruta formativa se personaliza automáticamente.',
            },
            {
              step: '3',
              icon: '🎓',
              title: 'Aprende a tu ritmo',
              desc: 'Lecciones de 5 minutos, quizzes interactivos y certificado al completar. Sin presión, sin caducidad.',
            },
          ].map((s) => (
            <Card key={s.step} className="p-6 text-center relative overflow-hidden">
              <div className="absolute top-3 right-4 font-display text-[48px] font-bold text-selene-gold/5">{s.step}</div>
              <div className="text-selene-gold text-2xl mb-3">{s.icon}</div>
              <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">{s.title}</div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed">{s.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Why Selene — Value Props ── */}
      <section className="px-6 py-16 max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            ¿Por qué elegir Selene?
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-4">
            Una academia que no te pide fe ciega — te da evidencia.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {valueProps.map((v, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="text-[32px] mb-4">{v.icon}</div>
              <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">
                {v.title}
              </div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed">
                {v.desc}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Selene vs lo típico
          </h2>
          <GoldDivider />
        </div>

        <div className="rounded-2xl border border-selene-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-selene-elevated">
            <div className="px-5 py-4 text-xs font-semibold text-selene-white-dim uppercase tracking-wider" />
            <div className="px-5 py-4 text-xs font-semibold text-selene-gold uppercase tracking-wider text-center">
              Selene Academia
            </div>
            <div className="px-5 py-4 text-xs font-semibold text-selene-white-dim uppercase tracking-wider text-center">
              Escuelas típicas
            </div>
          </div>

          {/* Table rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 ${
                i % 2 === 0 ? 'bg-selene-card' : 'bg-selene-bg'
              } ${i < comparisonRows.length - 1 ? 'border-b border-selene-border' : ''}`}
            >
              <div className="px-5 py-4 text-[13px] font-semibold text-selene-white flex items-center">
                {row.label}
              </div>
              <div className="px-5 py-4 text-[13px] text-selene-success text-center flex items-center justify-center gap-2">
                <span className="text-selene-success font-bold">✓</span>
                <span>{row.selene}</span>
              </div>
              <div className="px-5 py-4 text-[13px] text-selene-white-dim text-center flex items-center justify-center gap-2 opacity-60">
                <span className="text-selene-rose font-bold">✗</span>
                <span>{row.typical}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certificate Validity ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Certificados con validez verificable
          </h2>
          <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
            Cada certificado de Selene Academia incluye un código CSV único. Cualquier persona
            puede verificar su autenticidad en nuestra web.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Certificate mockup */}
          <div className="bg-gradient-card rounded-2xl border border-selene-border p-8 relative overflow-hidden">
            {/* Decorative corner */}
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

              {/* Highlighted CSV code */}
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
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">
                  1
                </div>
                <div>
                  <div className="text-[14px] text-selene-white font-semibold mb-1">
                    Completa el curso y aprueba la evaluación
                  </div>
                  <div className="text-[13px] text-selene-white-dim leading-relaxed">
                    Cada curso tiene una evaluación final. Al superarla, se genera tu certificado automáticamente.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">
                  2
                </div>
                <div>
                  <div className="text-[14px] text-selene-white font-semibold mb-1">
                    Recibe tu código CSV único
                  </div>
                  <div className="text-[13px] text-selene-white-dim leading-relaxed">
                    El formato <span className="font-mono text-selene-gold/80 text-xs">SEL-YYYY-XXXX-XXXXXX</span> identifica el año, número de certificado y hash de seguridad.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">
                  3
                </div>
                <div>
                  <div className="text-[14px] text-selene-white font-semibold mb-1">
                    Cualquier persona puede verificarlo
                  </div>
                  <div className="text-[13px] text-selene-white-dim leading-relaxed">
                    Comparte tu código y quien lo reciba puede comprobar su autenticidad al instante.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/verificar"
                className="inline-flex items-center gap-2 text-sm font-semibold text-selene-gold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
              >
                Verificar un certificado →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiz Funnel ── */}
      <QuizFunnelCTA />

      {/* ── Course Preview ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">Catálogo formativo</h2>
          <p className="text-sm text-selene-white-dim">De principiante a guía profesional certificada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COURSES.slice(0, 4).map(course => {
            const originalPrice = course.price > 0 ? Math.round(course.price * 2.5) : null;
            const discount = originalPrice ? Math.round((1 - course.price / originalPrice) * 100) : null;
            return (
              <Link key={course.id} href={`/catalogo/${course.id}`} className="no-underline">
              <Card hover className="p-5 relative h-full">
                {/* Discount badge */}
                {discount && (
                  <div className="absolute top-3 right-3 text-[10px] font-bold bg-selene-gold text-selene-bg px-2 py-0.5 rounded-md">
                    -{discount}%
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[28px]">{course.icon}</span>
                  <div className="text-right">
                    {originalPrice ? (
                      <>
                        <span className="text-[11px] text-selene-white-dim line-through mr-2">
                          {(originalPrice / 100).toFixed(2).replace('.', ',')}€
                        </span>
                        <span className="text-[14px] font-bold text-selene-gold">
                          {course.price_label}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-[12px] font-bold px-2.5 py-0.5 rounded-md"
                        style={{ color: '#5BB88F', background: 'rgba(91,184,143,0.1)' }}
                      >
                        {course.price_label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[15px] font-semibold text-selene-white mb-1 leading-tight">{course.title}</div>
                <div className="text-xs text-selene-white-dim mb-3 leading-relaxed">{course.subtitle}</div>
                <div className="flex gap-3 text-[11px] text-selene-white-dim">
                  <span>{course.level}</span>
                  <span>·</span>
                  <span>{course.hours}</span>
                  <span>·</span>
                  <span>{course.modules} módulos</span>
                </div>
              </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-selene-gold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
          >
            Ver los 10 cursos completos →
          </Link>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="px-6 py-12 max-w-[800px] mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 bg-selene-card/50 rounded-xl border border-selene-border px-5 py-3">
            <span className="text-selene-success text-lg">🔒</span>
            <div>
              <div className="text-xs font-semibold text-selene-white">Pago 100% seguro</div>
              <div className="text-[10px] text-selene-white-dim">Stripe · cifrado SSL</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-selene-card/50 rounded-xl border border-selene-border px-5 py-3">
            <span className="text-selene-success text-lg">✓</span>
            <div>
              <div className="text-xs font-semibold text-selene-white">Garantía 14 días</div>
              <div className="text-[10px] text-selene-white-dim">Devolución sin preguntas</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-selene-card/50 rounded-xl border border-selene-border px-5 py-3">
            <span className="text-selene-gold text-lg">🎓</span>
            <div>
              <div className="text-xs font-semibold text-selene-white">Certificado verificable</div>
              <div className="text-[10px] text-selene-white-dim">Código CSV único</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-selene-card/50 rounded-xl border border-selene-border px-5 py-3">
            <span className="text-selene-blue-light text-lg">♾️</span>
            <div>
              <div className="text-xs font-semibold text-selene-white">Acceso ilimitado</div>
              <div className="text-[10px] text-selene-white-dim">De por vida, sin caducidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof & Guarantees ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Nuestra promesa
          </h2>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">🔬</div>
            <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">30+ estudios citados</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">
              Cada afirmación está respaldada por investigaciones publicadas en revistas peer-reviewed. Incluimos las referencias para que las verifiques.
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">14 días de garantía</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">
              Si el curso no cumple tus expectativas, te devolvemos el 100% de tu dinero. Sin preguntas, sin letra pequeña, sin complicaciones.
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">🔒</div>
            <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">Pagos seguros con Stripe</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">
              Tus datos financieros nunca pasan por nuestros servidores. Stripe procesa millones de transacciones al día con cifrado de nivel bancario.
            </div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { initial: 'P', name: 'Patricia G.', location: 'Sevilla · Astrologia Natal', stars: 5, text: 'Llevaba anos leyendo sobre astrologia pero nunca habia encontrado un curso que citase estudios reales. Ahora entiendo mi carta natal de verdad, no solo los memes de signos.' },
            { initial: 'M', name: 'Marina L.', location: 'Buenos Aires · Tarot Intuitivo', stars: 5, text: 'Soy psicologa y buscaba algo con base cientifica para complementar mis sesiones. Este curso superó mis expectativas. Las referencias a neurociencia son un plus enorme.' },
            { initial: 'C', name: 'Carmen D.', location: 'Barcelona · Meditacion Lunar', stars: 5, text: 'El formato de texto + slides me encanta. Puedo estudiar en el metro sin auriculares. Las meditaciones guiadas son un regalo aparte. Mi ansiedad ha mejorado notablemente.' },
            { initial: 'S', name: 'Sofia R.', location: 'Mexico DF · Astrologia Natal', stars: 4, text: 'Lo que mas valoro es que no te piden creer ciegamente. Te dan las fuentes y tu decides. El certificado verificable me dio credibilidad con mis primeras clientas.' },
          ].map((t, i) => (
            <div key={i} className="bg-selene-card/50 rounded-2xl border border-selene-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-selene-gold/15 border border-selene-gold/30 flex items-center justify-center text-selene-gold text-sm font-display font-semibold">{t.initial}</div>
                <div>
                  <div className="text-[13px] text-selene-white font-semibold">{t.name}</div>
                  <div className="text-[11px] text-selene-white-dim">{t.location}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.stars)].map((_, j) => <span key={j} className="text-selene-gold text-xs">★</span>)}
                  {[...Array(5 - t.stars)].map((_, j) => <span key={j} className="text-selene-white-dim/30 text-xs">★</span>)}
                </div>
              </div>
              <p className="text-[13px] text-selene-white-dim leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="bg-selene-card/50 rounded-2xl border border-selene-border p-8 text-center">
          <div className="text-selene-gold text-lg mb-4">✦</div>
          <p className="font-display text-lg text-selene-white italic leading-relaxed mb-4">
            &ldquo;La primera academia que no te pide fe ciega — te da neurociencia, cronobiologia y estudios reales.&rdquo;
          </p>
          <div className="text-sm text-selene-white-dim">— Nuestra filosofia fundacional</div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[28px] font-normal text-selene-white mb-4">
          Tu camino empieza aqui
        </h2>
        <p className="text-sm text-selene-white-dim mb-3 max-w-md mx-auto">
          Curso introductorio 100% gratuito. Sin tarjeta de credito.
          Tu carta natal personaliza tu ruta.
        </p>
        <p className="text-[13px] text-selene-gold/70 mb-8">
          Garantía de devolución de 14 días en todos los cursos de pago.
        </p>
        <Link
          href="/auth?mode=register"
          className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
        >
          Crear mi cuenta gratis
        </Link>
        <p className="text-[11px] text-selene-white-dim/40 mt-4">
          +2.400 personas ya han empezado su camino
        </p>
      </section>

      <Footer />

      {/* CRO Components */}
      <SocialProofToast />
      <StickyMobileCTA />
      <ExitIntentPopup />
    </div>
  );
}
