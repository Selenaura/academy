import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export const metadata = {
  title: 'Curso Tarot Buenos Aires · Certificación Astrología Argentina — Selene Academia',
  description:
    'Formación holística Argentina con base científica. Curso tarot Buenos Aires, certificación astrología Argentina. Pagá en cuotas con tarjeta local. Certificados verificables.',
  metadataBase: new URL('https://academy.selenaura.com'),
  alternates: {
    canonical: 'https://academy.selenaura.com/argentina',
    languages: {
      'es-AR': 'https://academy.selenaura.com/argentina',
      'es': 'https://academy.selenaura.com',
    },
  },
  openGraph: {
    title: 'Curso Tarot Buenos Aires · Certificación Astrología Argentina',
    description:
      'Formación holística Argentina con metodología científica. Pagá en cuotas con tarjeta local. Certificados verificables con código único.',
    siteName: 'Selene Academia',
    locale: 'es_AR',
    type: 'website',
    url: 'https://academy.selenaura.com/argentina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formación en Guía Espiritual con metodología Selene — Pagá en cuotas',
    description: 'Curso tarot Buenos Aires y certificación astrología Argentina. Formación holística con base científica.',
  },
};

const PAID_COURSES = COURSES.filter((c) => c.price > 0);

const coursePricesARS = {
  'brujula-interior': { usd: 0, label: 'GRATIS' },
  'tarot-intuitivo': { usd: 32, label: 'USD 32' },
  'quirologia-certificacion': { usd: 37, label: 'USD 37' },
  'raices-invisibles': { usd: 32, label: 'USD 32' },
  'suenos-certificacion': { usd: 32, label: 'USD 32' },
  'magnetismo-consciente': { usd: 32, label: 'USD 32' },
  'astrologia-natal': { usd: 37, label: 'USD 37' },
  'cronobiologia': { usd: 26, label: 'USD 26' },
  'guia-profesional': { usd: 159, label: 'USD 159' },
};

const valueProps = [
  {
    icon: '🔬',
    title: 'Metodología con evidencia',
    desc: 'Cada módulo cita estudios peer-reviewed. Neuroplasticidad, cronobiología, psicología cognitiva. Sin dogmas ni fe ciega.',
  },
  {
    icon: '🎓',
    title: 'Certificados verificables',
    desc: 'Al completar recibís un certificado con código CSV único, verificable públicamente. Presentalo a tus clientes con respaldo documentado.',
  },
  {
    icon: '🌙',
    title: 'Ruta personalizada',
    desc: 'Tu carta natal define tu itinerario formativo. La formación holística Argentina más adaptada a tu perfil energético.',
  },
  {
    icon: '📖',
    title: 'Multi-formato',
    desc: 'Texto detallado, presentaciones y PDFs descargables. Sin videos obligatorios — aprendé en el momento y dispositivo que prefieras.',
  },
  {
    icon: '🇦🇷',
    title: 'Comunidad rioplatense',
    desc: 'Conectá con otras guías espirituales de Argentina, Uruguay y el Cono Sur. Red de práctica y derivación de consultas.',
  },
  {
    icon: '💳',
    title: 'Pagá en cuotas',
    desc: 'Tarjeta local, cuotas sin intereses. Precios en USD accesibles con opciones de pago adaptadas al contexto argentino.',
  },
];

const faqs = [
  {
    q: '¿Puedo pagar en cuotas con tarjeta argentina?',
    a: 'Sí. Al finalizar la compra podés seleccionar cuotas con tu tarjeta de crédito local (Visa, Mastercard, Naranja, MODO y otras). La disponibilidad de cuotas sin intereses depende del banco emisor y las promociones vigentes.',
  },
  {
    q: '¿Los precios son en USD o en pesos?',
    a: 'Los precios están en USD para mantener estabilidad. El cobro se realiza al tipo de cambio del procesador de pagos al momento de la transacción. Aceptamos tarjetas argentinas con el recargo según normativa vigente.',
  },
  {
    q: '¿La certificación astrología Argentina tiene validez para ejercer?',
    a: 'Selene emite certificados con código verificable que podés presentar a tus clientes como respaldo formativo. No son títulos universitarios, sino certificaciones de formación especializada en tradición milenaria con metodología científica.',
  },
  {
    q: '¿Qué incluye la formación holística Argentina de Selene?',
    a: 'Incluye cursos de astrología natal, tarot con base simbólica y psicológica, cronobiología, magnetismo consciente y certificación completa como guía espiritual. Todos con fundamento en estudios académicos citados.',
  },
  {
    q: '¿El contenido está adaptado al español rioplatense?',
    a: 'Sí. Todo el contenido usa el voseo y referencias culturales del Río de la Plata. La comunidad y el soporte también operan en español argentino.',
  },
  {
    q: '¿Desde qué provincias se puede acceder?',
    a: 'Desde cualquier provincia argentina con conexión a internet. Tenemos alumnas de CABA, provincia de Buenos Aires, Córdoba, Rosario, Mendoza, y muchas otras. La plataforma es 100% online con acceso de por vida.',
  },
];

export default function ArgentinaPage() {
  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial-gold pointer-events-none" />
        <div className="absolute top-10 right-[10%] w-1 h-1 rounded-full bg-selene-gold shadow-[0_0_20px_rgba(201,168,76,0.4)] animate-pulse-gold" />
        <div
          className="absolute top-28 left-[15%] w-0.5 h-0.5 rounded-full bg-selene-blue-light shadow-[0_0_15px_rgba(107,143,197,0.4)] animate-pulse-gold"
          style={{ animationDelay: '1s' }}
        />

        <div className="relative z-10">
          <div className="inline-block text-[11px] text-selene-gold font-semibold px-4 py-1.5 rounded-full border border-selene-gold/20 bg-selene-gold/5 mb-8 tracking-[0.1em] uppercase">
            ✦ Formación holística Argentina — Con metodología Selene ✦
          </div>

          <h1 className="font-display text-[clamp(30px,5vw,56px)] font-normal leading-[1.15] text-gradient-gold max-w-[760px] mx-auto mb-6">
            Formación en Guía Espiritual con metodología Selene — Pagá en cuotas
          </h1>

          <p className="text-[17px] text-selene-white-dim leading-relaxed font-light max-w-[560px] mx-auto mb-4">
            Curso tarot Buenos Aires y certificación astrología Argentina. La formación holística
            que combina tradición milenaria con neurociencia. Sin pseudociencia, con estudios reales.
          </p>

          <p className="text-[14px] text-selene-white-dim/70 mb-10">
            Pagá en <strong className="text-selene-gold">cuotas con tu tarjeta argentina</strong> —
            Acceso inmediato
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
            >
              Empezá gratis — Curso introductorio
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center text-[15px] font-semibold text-selene-gold px-10 py-4 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
            >
              Ver catálogo completo
            </Link>
          </div>

          <div className="flex justify-center gap-10 mt-16 flex-wrap">
            {[
              { value: '10', label: 'Cursos' },
              { value: '200+', label: 'Lecciones' },
              { value: '30+', label: 'Estudios citados' },
              { value: '6', label: 'Certificaciones' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-[32px] text-selene-gold font-semibold">
                  {s.value}
                </div>
                <div className="text-xs text-selene-white-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué Selene Academia ── */}
      <section className="px-6 py-16 max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            ¿Por qué elegir Selene Academia para tu formación en Argentina?
          </h2>
          <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
            La academia que no te pide fe ciega — te da evidencia. Metodología única para la
            comunidad espiritual argentina.
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
              <div className="text-[13px] text-selene-white-dim leading-relaxed">{v.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Catálogo con precios ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">
            Catálogo — Formación holística Argentina
          </h2>
          <p className="text-sm text-selene-white-dim mb-2">
            Desde fundamentos hasta certificación como guía espiritual profesional
          </p>
          <p className="text-xs text-selene-white-dim/60">
            Precios en USD · Pagá en cuotas con tarjeta local · Acceso de por vida
          </p>
        </div>

        {/* Curso gratuito */}
        <div className="mb-6 rounded-2xl border border-selene-gold/30 bg-selene-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[36px]">🌟</span>
            <div>
              <div className="text-[11px] font-bold text-selene-success uppercase tracking-wider mb-1">
                GRATIS — Empezá acá
              </div>
              <div className="text-[16px] font-semibold text-selene-white font-display">
                Despierta tu Brújula Interior
              </div>
              <div className="text-[13px] text-selene-white-dim mt-1">
                Fundamentos de consciencia espiritual · 12h · 6 módulos
              </div>
            </div>
          </div>
          <Link
            href="/auth?mode=register"
            className="flex-shrink-0 inline-flex items-center text-[14px] font-semibold bg-selene-gold text-selene-bg px-6 py-3 rounded-xl hover:brightness-110 transition no-underline"
          >
            Empezar gratis
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAID_COURSES.slice(0, 6).map((course) => {
            const pricing = coursePricesARS[course.id];
            return (
              <Card key={course.id} hover className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[28px]">{course.icon}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-selene-gold block">
                      {pricing ? pricing.label : 'Ver precio'}
                    </span>
                    <span className="text-[10px] text-selene-white-dim/60">
                      o pagá en cuotas
                    </span>
                  </div>
                </div>
                <div className="text-[15px] font-semibold text-selene-white mb-1 leading-tight font-display">
                  {course.title}
                </div>
                <div className="text-xs text-selene-white-dim mb-3 leading-relaxed">
                  {course.subtitle}
                </div>
                <div className="flex gap-3 text-[11px] text-selene-white-dim">
                  <span>{course.level}</span>
                  <span>·</span>
                  <span>{course.hours}</span>
                  <span>·</span>
                  <span>{course.modules} módulos</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-selene-gold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

      {/* ── Métodos de pago Argentina ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Pagá en cuotas — Sin complicaciones
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-4">
            Opciones de pago pensadas para Argentina para que el acceso a la formación sea
            accesible.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '💳',
              title: 'Tarjeta de crédito',
              desc: 'Cuotas con tarjetas Visa, Mastercard, Naranja y otras tarjetas argentinas. La disponibilidad de cuotas sin interés depende de tu banco.',
              detail: 'Cuotas disponibles',
            },
            {
              icon: '📱',
              title: 'MODO / Billeteras',
              desc: 'Pagá con MODO, Mercado Pago u otras billeteras virtuales. Proceso rápido con confirmación instantánea.',
              detail: 'Acceso inmediato',
            },
            {
              icon: '🏦',
              title: 'Transferencia bancaria',
              desc: 'Transferencia en USD o en pesos al tipo de cambio acordado. Consultá disponibilidad al momento de la compra.',
              detail: 'Confirmación en 24h',
            },
          ].map((m, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="text-[36px] mb-3">{m.icon}</div>
              <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">
                {m.title}
              </div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed mb-3">{m.desc}</div>
              <div className="text-[11px] font-semibold text-selene-gold">{m.detail}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="px-6 py-16 max-w-[700px] mx-auto text-center">
        <div className="bg-selene-card/50 rounded-2xl border border-selene-border p-8">
          <div className="text-selene-gold text-lg mb-4">✦</div>
          <p className="font-display text-lg text-selene-white italic leading-relaxed mb-4">
            &ldquo;Busqué durante meses un curso tarot en Buenos Aires que tuviera rigor real. Selene
            fue lo único que encontré con estudios citados y metodología seria. Terminé la
            certificación en astrología y ya tengo mis primeras consultantes.&rdquo;
          </p>
          <div className="text-sm text-selene-white-dim">— Testimonio de alumna, Buenos Aires</div>
        </div>
      </section>

      {/* ── FAQ Argentina ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Preguntas frecuentes — Argentina
          </h2>
          <GoldDivider />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-selene-border bg-selene-card p-6">
              <div className="text-[15px] font-semibold text-selene-white mb-2">{faq.q}</div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[28px] font-normal text-selene-white mb-4">
          Tu formación holística empieza hoy
        </h2>
        <p className="text-sm text-selene-white-dim mb-2 max-w-md mx-auto">
          Curso introductorio 100% gratuito. Sin tarjeta.
        </p>
        <p className="text-sm text-selene-white-dim mb-8 max-w-md mx-auto">
          Cursos de pago desde{' '}
          <strong className="text-selene-gold">USD 26 · Pagá en cuotas</strong> con tarjeta
          argentina.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
          >
            Crear mi cuenta gratis
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center text-[15px] font-semibold text-selene-gold px-10 py-4 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
