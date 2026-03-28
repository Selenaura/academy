import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export const metadata = {
  title: 'Certificación Espiritual en Español para la Comunidad Latina — Selene Academia',
  description:
    'Certificación espiritual en español para hispanohablantes en Estados Unidos. Tarot profesional español, curso astrología hispanohablantes. Pay in 3 installments. Verified certificates.',
  metadataBase: new URL('https://academia.selenaura.com'),
  alternates: {
    canonical: 'https://academia.selenaura.com/hispanos',
    languages: {
      'es-US': 'https://academia.selenaura.com/hispanos',
      'es': 'https://academia.selenaura.com',
    },
  },
  openGraph: {
    title: 'Certificación Espiritual en Español — Para la Comunidad Latina en EEUU',
    description:
      'Tarot profesional español y curso astrología hispanohablantes. Formación espiritual de calidad en tu idioma. Pay in 3 installments.',
    siteName: 'Selene Academia',
    locale: 'es_US',
    type: 'website',
    url: 'https://academia.selenaura.com/hispanos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificación espiritual en español — Para la comunidad latina en EEUU',
    description: 'Formación espiritual profesional en español. Tarot profesional, astrología para hispanohablantes.',
  },
};

const PAID_COURSES = COURSES.filter((c) => c.price > 0);

const coursePricesUS = {
  'brujula-interior': { usd: 0, label: 'FREE' },
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
    icon: '🗣️',
    title: '100% en español',
    desc: 'Todo el contenido, la comunidad y el soporte están en español. Aprende en tu idioma sin barreras de traducción ni adaptaciones parciales.',
  },
  {
    icon: '🔬',
    title: 'Base científica real',
    desc: 'Cada lección cita estudios peer-reviewed publicados en revistas académicas. Cronobiología, neuroplasticidad, psicología positiva.',
  },
  {
    icon: '🎓',
    title: 'Certificados verificables',
    desc: 'Al completar recibes un certificado con código único verificable. Reconocido por clientes en la comunidad hispana de EE. UU.',
  },
  {
    icon: '🌙',
    title: 'Personalización por carta natal',
    desc: 'Tu carta natal define tu ruta formativa. La primera academia espiritual que personaliza el aprendizaje a tu perfil astrológico.',
  },
  {
    icon: '📖',
    title: 'Multi-formato sin videos obligatorios',
    desc: 'Texto completo, presentaciones y PDFs descargables. Compatible con cualquier horario de trabajo, incluso a tiempo parcial.',
  },
  {
    icon: '🤝',
    title: 'Comunidad latina',
    desc: 'Conecta con otras guías espirituales hispanas en EE. UU. y América Latina. Red de práctica y referidos dentro de la comunidad.',
  },
];

const faqs = [
  {
    q: '¿Los cursos están completamente en español?',
    a: 'Sí, todo el contenido — lecciones, PDFs, presentaciones, quizzes, certificados y soporte — está en español. No hay nada en inglés a menos que sea una cita académica que se presenta también traducida.',
  },
  {
    q: '¿Puedo pagar en 3 cuotas?',
    a: 'Sí. Al finalizar la compra puedes seleccionar "Pay in 3 installments" para distribuir el pago en tres meses. Disponible con Visa, Mastercard y American Express emitidas en EE. UU. Sin intereses adicionales según el plan seleccionado.',
  },
  {
    q: '¿Los certificados son reconocidos en Estados Unidos?',
    a: 'Selene Academia emite certificados con código CSV único verificable públicamente. Son ampliamente reconocidos por clientes en la comunidad hispana de EE. UU. como respaldo formativo especializado. No son títulos universitarios regulados por ningún estado.',
  },
  {
    q: '¿Qué diferencia a Selene de otras escuelas espirituales en español?',
    a: 'La mayoría de cursos de tarot profesional en español o curso astrología hispanohablantes se basan únicamente en tradición oral sin respaldo académico. Selene cita estudios reales en cada módulo, desmonta mitos activamente y entrega certificados verificables.',
  },
  {
    q: '¿Puedo ejercer como tarotista o astróloga en EE. UU. con estos certificados?',
    a: 'En la mayoría de estados de EE. UU. no se requiere licencia para ofrecer lecturas espirituales. Nuestros certificados proveen el respaldo formativo para que puedas operar con profesionalismo. Consulta las regulaciones locales de tu estado.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos todas las tarjetas de crédito y débito principales emitidas en EE. UU. (Visa, Mastercard, Amex, Discover), PayPal y Apple Pay. El cargo aparece en tu estado de cuenta en USD.',
  },
];

export default function HispanosPage() {
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
            ✦ Certificación espiritual en español — Para la comunidad latina en EE. UU. ✦
          </div>

          <h1 className="font-display text-[clamp(30px,5vw,56px)] font-normal leading-[1.15] text-gradient-gold max-w-[760px] mx-auto mb-6">
            Certificación espiritual en español — Para la comunidad latina
          </h1>

          <p className="text-[17px] text-selene-white-dim leading-relaxed font-light max-w-[560px] mx-auto mb-4">
            Tarot profesional en español, curso astrología para hispanohablantes. Formación con base
            científica real, en tu idioma, a tu ritmo.
          </p>

          <p className="text-[14px] text-selene-white-dim/70 mb-10">
            <strong className="text-selene-gold">Pay in 3 installments</strong> — No interest ·
            Immediate access
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

      {/* ── Prueba social localizada ── */}
      <section className="px-6 py-10 max-w-[800px] mx-auto">
        <div className="rounded-2xl border border-selene-gold/20 bg-selene-gold/5 p-6 text-center">
          <p className="text-[14px] text-selene-white-dim leading-relaxed">
            La comunidad hispana en EE. UU. tiene acceso a muy poca formación espiritual profesional
            en español. La mayoría de cursos en inglés no reflejan nuestra cosmovisión. Selene fue
            creada para cambiar eso — formación rigurosa, en español, desde la tradición latina.
          </p>
        </div>
      </section>

      {/* ── Por qué Selene Academia ── */}
      <section className="px-6 py-16 max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            ¿Por qué elegir Selene Academia?
          </h2>
          <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
            La primera academia de formación espiritual en español con base científica documentada y
            certificados verificables.
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
            Catálogo de formación espiritual en español
          </h2>
          <p className="text-sm text-selene-white-dim mb-2">
            Desde fundamentos hasta certificación profesional — todo en español
          </p>
          <p className="text-xs text-selene-white-dim/60">
            Prices in USD · Pay in 3 installments · Lifetime access
          </p>
        </div>

        {/* Curso gratuito */}
        <div className="mb-6 rounded-2xl border border-selene-gold/30 bg-selene-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[36px]">🌟</span>
            <div>
              <div className="text-[11px] font-bold text-selene-success uppercase tracking-wider mb-1">
                FREE — Start here
              </div>
              <div className="text-[16px] font-semibold text-selene-white font-display">
                Despierta tu Brújula Interior
              </div>
              <div className="text-[13px] text-selene-white-dim mt-1">
                Fundamentos de consciencia espiritual · 12h · 6 módulos · En español
              </div>
            </div>
          </div>
          <Link
            href="/auth?mode=register"
            className="flex-shrink-0 inline-flex items-center text-[14px] font-semibold bg-selene-gold text-selene-bg px-6 py-3 rounded-xl hover:brightness-110 transition no-underline"
          >
            Start for free
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAID_COURSES.slice(0, 6).map((course) => {
            const pricing = coursePricesUS[course.id];
            return (
              <Card key={course.id} hover className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[28px]">{course.icon}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-selene-gold block">
                      {pricing ? pricing.label : 'See price'}
                    </span>
                    <span className="text-[10px] text-selene-white-dim/60">
                      or pay in installments
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

      {/* ── Métodos de pago EE. UU. ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Pay in 3 installments — Sin intereses
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-4">
            Opciones de pago estándar en EE. UU. para que nada te detenga en tu camino formativo.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '💳',
              title: 'Credit card',
              desc: 'Visa, Mastercard, Amex, Discover. Pay in 3 installments available on plans over USD 49. No interest applied by Selene.',
              detail: '3 installments available',
            },
            {
              icon: '🍎',
              title: 'Apple Pay / Google Pay',
              desc: 'One-tap payment with your phone. Instant confirmation and immediate access to all course content.',
              detail: 'Immediate access',
            },
            {
              icon: '🅿️',
              title: 'PayPal',
              desc: 'Pay with your PayPal balance or linked cards. PayPal Pay Later also available for eligible accounts.',
              detail: 'PayPal Pay Later available',
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
            &ldquo;Viviendo en los Estados Unidos era difícil encontrar formación espiritual seria en
            español. Todo lo que existe en inglés no conecta con nuestra tradición. Selene me dio la
            certificación que necesitaba para ofrecer lecturas a la comunidad latina con
            profesionalismo real.&rdquo;
          </p>
          <div className="text-sm text-selene-white-dim">
            — Testimonio de alumna, comunidad latina EE. UU.
          </div>
        </div>
      </section>

      {/* ── FAQ Hispanos EE. UU. ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Preguntas frecuentes — Comunidad latina EE. UU.
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

      {/* ── Bloque de confianza ── */}
      <section className="px-6 py-10 max-w-[900px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          {[
            {
              icon: '🔒',
              title: 'Pago seguro',
              desc: 'Procesado por Stripe. Tus datos nunca se almacenan en nuestros servidores.',
            },
            {
              icon: '✅',
              title: 'Certificados verificables',
              desc: 'Código CSV único. Cualquiera puede verificar la autenticidad en nuestra web.',
            },
            {
              icon: '♾️',
              title: 'Acceso de por vida',
              desc: 'Una vez inscrita, el contenido es tuyo para siempre. Sin suscripciones ocultas.',
            },
          ].map((t, i) => (
            <div key={i} className="p-5">
              <div className="text-[28px] mb-2">{t.icon}</div>
              <div className="text-[14px] font-semibold text-selene-white mb-1">{t.title}</div>
              <div className="text-[12px] text-selene-white-dim leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[28px] font-normal text-selene-white mb-4">
          Tu certificación espiritual en español empieza aquí
        </h2>
        <p className="text-sm text-selene-white-dim mb-2 max-w-md mx-auto">
          Curso introductorio 100% gratuito. Sin tarjeta de crédito.
        </p>
        <p className="text-sm text-selene-white-dim mb-8 max-w-md mx-auto">
          Cursos de pago desde{' '}
          <strong className="text-selene-gold">USD 26 · Pay in 3 installments</strong>
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
