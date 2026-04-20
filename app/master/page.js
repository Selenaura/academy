import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import SpotsCounter from './SpotsCounter';
import WaitlistForm from './WaitlistForm';
import ChapterSignature from '@/components/ChapterSignature';
import AtlasLabel from '@/components/AtlasLabel';
import Colophon from '@/components/Colophon';

export const metadata = {
  title: 'Cohort Fundador — Máster en Guía Espiritual Profesional | Selene Academia',
  description: 'Solo 20 plazas a 99,99 euros (precio normal 149,99 euros). 12 módulos, certificación profesional, 6 disciplinas. Reserva tu plaza en la primera promoción del Máster de Selene Academia.',
  metadataBase: new URL('https://academy.selenaura.com'),
  alternates: { canonical: 'https://academy.selenaura.com/master' },
  openGraph: {
    title: 'Cohort Fundador — Máster en Guía Espiritual Profesional',
    description: 'Solo 20 plazas a 99,99 euros. 12 módulos, certificación, 6 disciplinas. Primera promoción de Selene Academia.',
    siteName: 'Selene Academia',
    locale: 'es_ES',
    type: 'website',
    url: 'https://academy.selenaura.com/master',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cohort Fundador — Máster Guía Espiritual Profesional',
    description: 'Solo 20 plazas a 99,99 euros. Reserva tu plaza ahora.',
  },
};

const MODULES = [
  { num: 1,  name: 'El Método Selene',              desc: 'Marco teórico integrativo: neurociencia + tradición milenaria' },
  { num: 2,  name: 'Integración de disciplinas',    desc: 'Astrología, tarot, quirología, sueños, cronobiología y constelaciones' },
  { num: 3,  name: 'Psicología para guías',         desc: 'Límites, crisis emocionales, ética profesional' },
  { num: 4,  name: 'La sesión profesional',         desc: 'Estructura, flujo, cierre y seguimiento de una consulta real' },
  { num: 5,  name: 'Casos prácticos supervisados',  desc: '7 casos + 3 sesiones supervisadas con clientes reales' },
  { num: 6,  name: 'Tu marca personal',             desc: 'Identidad, propuesta de valor, posicionamiento' },
  { num: 7,  name: 'Modelo de negocio',             desc: 'Pricing, paquetes, ingresos recurrentes, datos de mercado' },
  { num: 8,  name: 'Marketing y captación',         desc: 'Redes, contenido, embudo de clientes sin invertir en ads' },
  { num: 9,  name: 'Legalidad y fiscalidad',        desc: 'Alta autónoma, IAE, RGPD, facturación (España + Latam)' },
  { num: 10, name: 'Plan de lanzamiento',           desc: 'Tu plan de 90 días para lanzar tu práctica profesional' },
  { num: 11, name: 'Directorio profesional',        desc: 'Perfil premium en el directorio Selene verificado' },
  { num: 12, name: 'Certificación y examen final',  desc: 'Evaluación integradora + certificado profesional con código de verificación' },
];

const DISCIPLINES = [
  'Astrología Natal', 'Tarot Intuitivo', 'Quirología',
  'Interpretación de Sueños', 'Cronobiología', 'Constelaciones Familiares',
];

const FAQS = [
  { q: '¿Es presencial u online?',
    a: 'Es 100% online. Todo el contenido es digital y accesible desde cualquier dispositivo, en cualquier país, a tu ritmo. Las sesiones supervisadas se hacen por videollamada en horarios flexibles. No hay clases presenciales.' },
  { q: '¿Cuánto dura el Máster?',
    a: 'El contenido está diseñado para completarse en 3-4 meses, pero tienes acceso de por vida y recibes todas las ediciones futuras sin coste adicional.' },
  { q: '¿El certificado tiene validez?',
    a: 'Es un certificado profesional privado de Selenaura Academia, verificable públicamente con código único. Acredita tu formación y te da acceso al directorio profesional.' },
  { q: '¿Hay política de devolución?',
    a: 'Sí. Garantía de 14 días. Si no es lo que esperabas, te devolvemos el dinero sin preguntas.' },
  { q: '¿Necesito experiencia previa?',
    a: 'Sí, necesitas al menos 2 certificaciones Selene previas. Este máster es el paso final para convertir lo que ya sabes en profesión.' },
  { q: '¿Qué pasa si se agotan las 20 plazas?',
    a: 'Entrarás en lista de espera para la siguiente cohort, pero al precio normal de 149,99 euros. El precio fundador es exclusivo de esta primera promoción.' },
];

const masterSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Máster en Guía Espiritual Profesional',
  description: 'Formación completa de 12 módulos para convertir tu práctica espiritual en profesión. Astrología, tarot, quirología, sueños, cronobiología y constelaciones familiares. Base científica peer-reviewed. Certificado profesional verificable.',
  provider: { '@type': 'Organization', name: 'Selene Academia', url: 'https://academy.selenaura.com' },
  offers: {
    '@type': 'Offer',
    price: '99.99',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/LimitedAvailability',
    validFrom: '2026-01-01',
    url: 'https://academy.selenaura.com/master',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: '12 módulos',
  },
  educationalLevel: 'Advanced',
  inLanguage: 'es',
  numberOfCredits: 12,
  occupationalCredentialAwarded: 'Certificado Profesional de Guía Espiritual',
};

export default function MasterFoundingPage() {
  return (
    <main className="min-h-screen atlas-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(masterSchema) }} />
      <Navbar />

      {/* ════════════════════════════════════════════════════════════
          HERO — El Tomo Principal
          ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-14 md:pt-14 md:pb-16">
        <div className="running-head pt-2 pb-8" aria-hidden="false">
          Selenaura · Academia · El Tomo Principal
        </div>

        <div className="relative max-w-content mx-auto px-6 text-center">
          <ChapterSignature title="EL TOMO PRINCIPAL" align="center" className="mb-6 mx-auto" />

          <AtlasLabel tone="accent" size="sm" className="mb-6 mx-auto">
            Cohort fundador · 20 plazas
          </AtlasLabel>

          <h1
            className="font-display mx-auto mb-5"
            style={{
              fontSize: 'var(--step-4)',
              lineHeight: 1.05,
              fontWeight: 600,
              color: 'var(--color-text)',
              fontVariationSettings: "'opsz' 96, 'SOFT' 100",
              fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
              letterSpacing: '-0.018em',
              maxWidth: '22ch',
              hyphens: 'none',
              WebkitHyphens: 'none',
            }}
          >
            Máster en
            <span
              className="block font-display italic mt-1 text-[var(--color-text-accent)]"
              style={{
                fontSize: 'var(--step-5)',
                fontVariationSettings: "'opsz' 144, 'SOFT' 60",
                fontWeight: 500,
                hyphens: 'none',
                WebkitHyphens: 'none',
              }}
            >
              Guía Espiritual
            </span>
          </h1>

          <p
            className="font-display italic mx-auto mb-10 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-1)',
              maxWidth: '54ch',
              lineHeight: 1.55,
              fontVariationSettings: "'opsz' 28, 'SOFT' 60",
            }}
          >
            Doce módulos, seis disciplinas, certificación profesional.
            El paso final para convertir lo que ya sabes en profesión.
          </p>

          {/* Precio prominente — double-rule gold */}
          <div
            className="relative inline-block px-10 py-8 mb-8"
            style={{
              border: '1px solid rgba(184,151,90,0.55)',
              backgroundColor: 'var(--color-surface-raised)',
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{ inset: 10, border: '1px solid rgba(184,151,90,0.22)' }}
              aria-hidden="true"
            />
            <div className="relative">
              <AtlasLabel tone="faint" size="xs" className="mb-2 mx-auto">
                Precio fundador
              </AtlasLabel>
              <div className="flex items-baseline justify-center gap-4 mb-3 tnum">
                <span
                  className="font-display"
                  style={{
                    fontSize: 'var(--step-1)',
                    color: 'var(--color-text-faint)',
                    textDecoration: 'line-through',
                    fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                    fontWeight: 400,
                  }}
                >
                  149,99 €
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 'var(--step-4)',
                    color: 'var(--color-text-ornament)',
                    fontWeight: 600,
                    fontVariationSettings: "'opsz' 96, 'SOFT' 100",
                    lineHeight: 1,
                  }}
                >
                  99,99 €
                </span>
              </div>
              <div className="mb-4">
                <SpotsCounter />
              </div>
            </div>
          </div>

          {/* CTA dual */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth?redirect=/curso/guia-profesional"
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
              Reservar mi plaza
            </Link>
            <a
              href="#waitlist"
              className="inline-flex items-center px-10 py-4 rounded-xl no-underline"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-body), Lora, Georgia, serif',
                color: 'var(--color-text-ornament)',
                border: '1px solid var(--color-rule-ornament)',
              }}
            >
              Más información
            </a>
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
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § I — LAS SEIS DISCIPLINAS
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <ChapterSignature title="LAS SEIS DISCIPLINAS" align="center" className="mb-6 mx-auto" />
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
            Seis saberes, un mismo método
          </h2>
          <p
            className="font-display italic mx-auto mt-3 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-0)',
              maxWidth: '48ch',
              fontVariationSettings: "'opsz' 24, 'SOFT' 60",
            }}
          >
            El único máster que integra las seis ramas de la guía
            espiritual con base científica.
          </p>
        </div>

        <ol
          className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-2 max-w-3xl mx-auto"
          style={{ listStyle: 'none' }}
        >
          {DISCIPLINES.map((d, i) => (
            <li
              key={d}
              className="py-4 flex items-baseline gap-3"
              style={{ borderTop: '1px solid var(--color-rule)' }}
            >
              <span
                className="font-display italic shrink-0"
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-ornament)',
                  fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                  width: '1.4rem',
                }}
              >
                {['I','II','III','IV','V','VI'][i]}.
              </span>
              <span
                className="font-display"
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text)',
                  fontVariationSettings: "'opsz' 18, 'SOFT' 80",
                  lineHeight: 1.3,
                }}
              >
                {d}
              </span>
            </li>
          ))}
        </ol>
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

      {/* ════════════════════════════════════════════════════════════
          § II — PARA QUIÉN / AL TERMINAR
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          <article
            className="relative px-7 py-7"
            style={{
              border: '1px solid var(--color-rule-ornament)',
              backgroundColor: 'var(--color-surface-raised)',
            }}
          >
            <AtlasLabel tone="ornament" size="xs" className="mb-4">
              Esto es para ti si…
            </AtlasLabel>
            <ul className="space-y-3" style={{ listStyle: 'none' }}>
              {[
                'Ya lees cartas, tarot o sueños — pero no te atreves a cobrar',
                'Quieres vivir de tu don, pero no sabes por dónde empezar',
                'Te falta la estructura: cómo cobrar, qué decir, cómo cumplir con Hacienda',
                'Necesitas practicar con casos reales antes de lanzarte',
              ].map(t => (
                <li
                  key={t}
                  className="flex gap-2.5 items-start"
                  style={{
                    fontFamily: 'var(--font-body), Lora, Georgia, serif',
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    lineHeight: 1.55,
                  }}
                >
                  <span className="text-[var(--color-text-ornament)] shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className="relative px-7 py-7"
            style={{
              border: '1px solid var(--color-rule-ornament)',
              backgroundColor: 'var(--color-surface-raised)',
            }}
          >
            <AtlasLabel tone="ornament" size="xs" className="mb-4">
              Al terminar tendrás
            </AtlasLabel>
            <ul className="space-y-3" style={{ listStyle: 'none' }}>
              {[
                'Tu marca personal lista y tu oferta de servicios definida',
                'Diez o más consultas supervisadas bajo tu cinturón',
                'Tu código ético profesional propio',
                'Perfil premium en el directorio Selene',
                'Plan de lanzamiento de 90 días con todo resuelto',
              ].map(t => (
                <li
                  key={t}
                  className="flex gap-2.5 items-start"
                  style={{
                    fontFamily: 'var(--font-body), Lora, Georgia, serif',
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    lineHeight: 1.55,
                  }}
                >
                  <span className="text-[var(--color-text-ornament)] shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          § III — LAS CUENTAS SIMPLES (ROI editorial)
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <ChapterSignature title="LAS CUENTAS SIMPLES" align="center" className="mb-6 mx-auto" />
          <p
            className="font-display italic mx-auto mb-8 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-0)',
              maxWidth: '52ch',
              fontVariationSettings: "'opsz' 24, 'SOFT' 60",
              lineHeight: 1.6,
            }}
          >
            Una guía espiritual profesional cobra entre 40 y 180 euros
            por sesión en España. En una o dos sesiones ya has
            recuperado tu inversión fundadora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: '40–180 €', label: 'por sesión en España' },
            { value: '1–2',      label: 'sesiones para recuperar la inversión' },
            { value: '1.200 €+', label: 'al mes · 4 sesiones por semana' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div
                className="font-display tnum mb-1"
                style={{
                  fontSize: 'var(--step-2)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  fontVariationSettings: "'opsz' 36, 'SOFT' 100",
                  fontFeatureSettings: "'tnum' 1, 'liga' 0, 'kern' 1",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <AtlasLabel tone="faint" size="xs" className="mx-auto">
                {s.label}
              </AtlasLabel>
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
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          § IV — EL PROGRAMA (12 módulos como Table of Contents)
          Linear/Method pattern + Domestika unit labels
          ════════════════════════════════════════════════════════════ */}
      <section id="programa" className="max-w-content mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <ChapterSignature title="EL PROGRAMA" align="center" className="mb-6 mx-auto" />
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
            Doce módulos, ochenta horas
          </h2>
          <p
            className="font-display italic mx-auto mt-3 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-0)',
              maxWidth: '44ch',
              fontVariationSettings: "'opsz' 24, 'SOFT' 60",
            }}
          >
            Lectura secuencial recomendada. Cada módulo es un capítulo
            con evaluación final.
          </p>
        </div>

        <ol
          className="max-w-[760px] mx-auto"
          style={{ listStyle: 'none' }}
        >
          {MODULES.map(m => (
            <li
              key={m.num}
              className="grid py-5"
              style={{
                gridTemplateColumns: '3.2rem 1fr',
                gap: '1.5rem',
                borderBottom: '1px solid var(--color-rule)',
              }}
            >
              <span
                className="font-display tnum self-baseline"
                style={{
                  fontSize: 'var(--step-1)',
                  fontWeight: 500,
                  color: 'var(--color-text-ornament)',
                  fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                  fontFeatureSettings: "'tnum' 1",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {String(m.num).padStart(2, '0')}
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
                    lineHeight: 1.25,
                  }}
                >
                  {m.name}
                </h3>
                <p
                  className="font-display italic mt-1"
                  lang="es"
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    fontVariationSettings: "'opsz' 18, 'SOFT' 60",
                    lineHeight: 1.55,
                  }}
                >
                  {m.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
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

      {/* ════════════════════════════════════════════════════════════
          § V — LOS TESTIMONIOS
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <ChapterSignature title="LOS TESTIMONIOS" align="center" className="mb-6 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
          {[
            { quote: 'Me dio escalofríos de lo precisa que fue mi lectura. El máster me dio la seguridad de hacer lo mismo para otras personas.',
              name: 'Laura M.', sign: 'Escorpio', detail: 'Ya cobra 60 € por sesión' },
            { quote: 'Por fin algo con ciencia real, no sólo frases bonitas. La guía legal me ahorró meses de investigación.',
              name: 'María C.', sign: 'Acuario', detail: 'Alta como autónoma' },
            { quote: 'Los casos supervisados fueron lo mejor. Cuando hice mi primera sesión real ya sabía exactamente qué hacer.',
              name: 'Ana R.', sign: 'Cáncer', detail: 'Cuatro clientes recurrentes' },
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
                }}
              >
                “
              </span>
              <blockquote
                className="font-display italic pl-5"
                lang="es"
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text)',
                  lineHeight: 1.65,
                  fontVariationSettings: "'opsz' 24, 'SOFT' 60",
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 pl-5">
                <AtlasLabel tone="ornament" size="xs" className="mb-1">
                  {t.name} · {t.sign}
                </AtlasLabel>
                <p
                  className="font-display italic"
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    fontVariationSettings: "'opsz' 14, 'SOFT' 50",
                  }}
                >
                  {t.detail}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRECIO + CTA COMPLETO
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="max-w-[620px] mx-auto text-center">
          <ChapterSignature title="RESERVA TU PLAZA FUNDADORA" align="center" className="mb-6 mx-auto" />
          <p
            className="font-display italic mx-auto mb-10 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-0)',
              maxWidth: '52ch',
              fontVariationSettings: "'opsz' 24, 'SOFT' 60",
              lineHeight: 1.6,
            }}
          >
            Formaciones similares cuestan entre 2.000 y 5.000 €. Éste
            máster incluye todo — casos supervisados, guía legal,
            certificación, directorio — por una fracción.
          </p>

          {/* Caja de precio double-rule */}
          <div
            className="relative px-8 py-9 mb-8"
            style={{
              border: '1px solid rgba(184,151,90,0.55)',
              backgroundColor: 'var(--color-surface-raised)',
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{ inset: 10, border: '1px solid rgba(184,151,90,0.22)' }}
              aria-hidden="true"
            />
            <div className="relative">
              <AtlasLabel tone="faint" size="xs" className="mb-3 mx-auto">
                Precio fundador · solo veinte plazas
              </AtlasLabel>
              <div className="flex items-baseline justify-center gap-4 mb-6 tnum">
                <span
                  className="font-display"
                  style={{
                    fontSize: 'var(--step-1)',
                    color: 'var(--color-text-faint)',
                    textDecoration: 'line-through',
                    fontVariationSettings: "'opsz' 24, 'SOFT' 100",
                  }}
                >
                  149,99 €
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 'var(--step-4)',
                    color: 'var(--color-text-ornament)',
                    fontWeight: 600,
                    fontVariationSettings: "'opsz' 96, 'SOFT' 100",
                    lineHeight: 1,
                  }}
                >
                  99,99 €
                </span>
              </div>

              <ul
                className="text-left max-w-sm mx-auto mb-8 space-y-2.5"
                style={{ listStyle: 'none' }}
              >
                {[
                  '12 módulos · 80 horas de formación',
                  '7 casos prácticos + 3 sesiones supervisadas',
                  'Certificado profesional verificable',
                  'Guía legal y fiscal (España + LATAM)',
                  'Perfil en el directorio profesional Selene',
                  'Acceso de por vida · todas las ediciones futuras incluidas',
                ].map(t => (
                  <li
                    key={t}
                    className="flex gap-2 items-start"
                    style={{
                      fontFamily: 'var(--font-body), Lora, Georgia, serif',
                      fontSize: '14px',
                      color: 'var(--color-text)',
                      lineHeight: 1.5,
                    }}
                  >
                    <span className="text-[var(--color-text-ornament)] shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth?redirect=/curso/guia-profesional"
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
                Reservar mi plaza fundadora
              </Link>

              <p
                className="mt-4 font-display italic"
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  fontVariationSettings: "'opsz' 14, 'SOFT' 50",
                }}
              >
                Pago seguro con Stripe y PayPal · Garantía de 14 días
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WAITLIST
          ════════════════════════════════════════════════════════════ */}
      <section id="waitlist" className="max-w-content mx-auto px-6 py-14">
        <div className="max-w-[560px] mx-auto text-center">
          <ChapterSignature title="QUIERO MÁS INFORMACIÓN" align="center" className="mb-6 mx-auto" />
          <p
            className="font-display italic mb-8 text-[var(--color-text-muted)]"
            lang="es"
            style={{
              fontSize: 'var(--step-0)',
              fontVariationSettings: "'opsz' 24, 'SOFT' 60",
              lineHeight: 1.6,
            }}
          >
            Déjanos tu email y te enviamos todos los detalles del Máster
            y del cohort fundador.
          </p>
          <WaitlistForm />
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

      {/* ════════════════════════════════════════════════════════════
          FAQ
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <ChapterSignature title="PREGUNTAS FRECUENTES" align="center" className="mb-6 mx-auto" />
        </div>

        <div className="max-w-[720px] mx-auto">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group border-b py-5"
              style={{ borderColor: 'var(--color-rule)' }}
            >
              <summary className="list-none cursor-pointer flex items-baseline justify-between gap-4">
                <h3
                  className="font-display flex-1"
                  style={{
                    fontSize: 'var(--step-1)',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    fontVariationSettings: "'opsz' 24, 'SOFT' 80",
                    fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1",
                    lineHeight: 1.3,
                  }}
                >
                  {faq.q}
                </h3>
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
              <p
                className="pt-3"
                lang="es"
                style={{
                  fontFamily: 'var(--font-body), Lora, Georgia, serif',
                  fontSize: '15px',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.65,
                  textAlign: 'justify',
                  hyphens: 'auto',
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA FINAL + COLOFÓN
          ════════════════════════════════════════════════════════════ */}
      <section className="max-w-content mx-auto px-6 pt-10 pb-4 text-center">
        <h2
          className="font-display mx-auto mb-5"
          style={{
            fontSize: 'var(--step-3)',
            color: 'var(--color-text)',
            fontWeight: 500,
            lineHeight: 1.1,
            fontVariationSettings: "'opsz' 48, 'SOFT' 100",
            fontFeatureSettings: "'liga' 0, 'dlig' 0, 'kern' 1, 'calt' 0",
            maxWidth: '20ch',
            letterSpacing: '-0.01em',
          }}
        >
          Tu carrera como guía empieza
          <span
            className="block font-display italic mt-1 text-[var(--color-text-accent)]"
            style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 60" }}
          >
            aquí
          </span>
        </h2>
        <p
          className="font-display italic mb-8 text-[var(--color-text-muted)]"
          lang="es"
          style={{
            fontSize: 'var(--step-0)',
            fontVariationSettings: "'opsz' 24, 'SOFT' 60",
          }}
        >
          20 plazas · Precio fundador · Acceso de por vida
        </p>
        <Link
          href="/auth?redirect=/curso/guia-profesional"
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
          Reservar mi plaza
        </Link>
      </section>

      {/* COLOFÓN — el diferenciador Living Manuscript.
         Para el Máster mostramos un "primera edición" ya con changelog
         de lo que traerá la siguiente, reforzando el mensaje
         "acceso a todas las ediciones futuras incluidas". */}
      <div className="max-w-content mx-auto px-6">
        <Colophon
          courseName="Máster en Guía Espiritual Profesional"
          editions={[
            {
              number: 1,
              label: 'Primera edición · cohort fundador',
              date: 'Abril 2026',
              changelog: 'Veinte plazas, precio fundador 99,99 €. Todas las ediciones futuras incluidas sin coste adicional.',
            },
          ]}
        />
      </div>

      <Footer />
    </main>
  );
}
