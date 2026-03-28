import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export const metadata = {
  title: 'Certificación Tarotista y Astrología Profesional en México — Selene Academia',
  description:
    'Formación espiritual con base científica en México. Certificación tarotista México, curso tarot México, astrólogo profesional México. Paga en 3 cuotas sin intereses. Certificados verificables.',
  metadataBase: new URL('https://academy.selenaura.com'),
  alternates: {
    canonical: 'https://academy.selenaura.com/mexico',
    languages: {
      'es-MX': 'https://academy.selenaura.com/mexico',
      'es': 'https://academy.selenaura.com',
    },
  },
  openGraph: {
    title: 'Certificación Tarotista y Astrología Profesional en México',
    description:
      'Curso tarot México y formación espiritual con metodología científica. Paga en 3 cuotas sin intereses con OXXO o tarjeta.',
    siteName: 'Selene Academia',
    locale: 'es_MX',
    type: 'website',
    url: 'https://academy.selenaura.com/mexico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certifícate como Guía Espiritual Profesional en México — Selene Academia',
    description: 'Formación espiritual México con base científica. Paga con OXXO o tarjeta.',
  },
};

const PAID_COURSES = COURSES.filter((c) => c.price > 0);

const coursePricesMXN = {
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
    title: 'Base científica real',
    desc: 'Cada lección cita estudios peer-reviewed. Cronobiología, neuroplasticidad, psicología positiva. Nada de dogmas.',
  },
  {
    icon: '🎓',
    title: 'Certificados verificables',
    desc: 'Al completar recibes un certificado con código único verificable en nuestra web. Válido para presentar a clientes en México.',
  },
  {
    icon: '🌙',
    title: 'Personalización astrológica',
    desc: 'Tu carta natal guía tu ruta formativa. No hay dos caminos iguales porque no hay dos cartas iguales.',
  },
  {
    icon: '📖',
    title: 'Multi-formato',
    desc: 'Texto detallado, presentaciones visuales y PDFs descargables. Sin videos obligatorios — aprende a tu ritmo.',
  },
  {
    icon: '🇲🇽',
    title: 'Comunidad mexicana',
    desc: 'Comparte tu práctica con otras guías espirituales de México. Red de apoyo para quienes ejercen en territorio nacional.',
  },
  {
    icon: '💳',
    title: 'Paga como prefieras',
    desc: 'OXXO, tarjeta de crédito o débito. 3 cuotas sin intereses disponibles. Acceso inmediato al confirmar el pago.',
  },
];

const faqs = [
  {
    q: '¿Puedo pagar con OXXO?',
    a: 'Sí. Al finalizar el proceso de compra seleccionas "Pago en efectivo — OXXO" y recibes un voucher para pagar en cualquier OXXO del país. Tienes 72 horas para completar el pago.',
  },
  {
    q: '¿Hay meses sin intereses con tarjeta?',
    a: 'Ofrecemos 3 cuotas sin intereses con tarjetas de crédito participantes (BBVA, Santander, HSBC, Banamex, entre otras). El sistema lo calcula automáticamente al ingresar tu tarjeta.',
  },
  {
    q: '¿Los certificados tienen validez en México?',
    a: 'Selene Academia emite certificados con código CSV único, verificables públicamente. Son reconocidos por clientes particulares y plataformas de bienestar. No son títulos universitarios, sino certificaciones de formación especializada.',
  },
  {
    q: '¿Qué es la certificación tarotista de Selene?',
    a: 'Es un programa que combina el estudio del tarot como sistema simbólico con fundamentos de psicología, neurociencia del ritual y práctica de lecturas. Al completarlo puedes ejercer como tarotista profesional con respaldo formativo documentado.',
  },
  {
    q: '¿Puedo acceder desde cualquier estado de la República?',
    a: 'Sí. La plataforma es 100% online y accesible desde cualquier dispositivo con conexión a internet. Muchas alumnas estudian desde CDMX, Guadalajara, Monterrey y estados del sureste.',
  },
  {
    q: '¿En cuánto tiempo completo un curso?',
    a: 'Cada curso tiene entre 12 y 22 horas de contenido. La mayoría de nuestras alumnas lo completan en 4 a 8 semanas estudiando 3-4 horas por semana, aunque el acceso es de por vida y puedes ir a tu propio ritmo.',
  },
];

export default function MexicoPage() {
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
            ✦ Formación espiritual México — Con base científica ✦
          </div>

          <h1 className="font-display text-[clamp(30px,5vw,56px)] font-normal leading-[1.15] text-gradient-gold max-w-[760px] mx-auto mb-6">
            Certifícate como Guía Espiritual Profesional — Formación con base científica
          </h1>

          <p className="text-[17px] text-selene-white-dim leading-relaxed font-light max-w-[560px] mx-auto mb-4">
            Curso tarot México, certificación tarotista y astrología profesional. Metodología que
            integra tradición milenaria con neurociencia moderna. Pagos con OXXO o tarjeta.
          </p>

          <p className="text-[14px] text-selene-white-dim/70 mb-10">
            Paga en <strong className="text-selene-gold">3 cuotas sin intereses</strong> — Acceso
            inmediato
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
            ¿Por qué elegir Selene Academia para tu formación en México?
          </h2>
          <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
            La primera academia de formación espiritual con metodología científica documentada,
            adaptada a la comunidad hispanohablante de México.
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

      {/* ── Catálogo con precios USD ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">
            Catálogo de formación espiritual México
          </h2>
          <p className="text-sm text-selene-white-dim mb-2">
            Desde fundamentos hasta certificación como astrólogo profesional México o tarotista
          </p>
          <p className="text-xs text-selene-white-dim/60">
            Precios en USD · Paga en 3 cuotas sin intereses con tarjeta o en efectivo con OXXO
          </p>
        </div>

        {/* Curso gratuito destacado */}
        <div className="mb-6 rounded-2xl border border-selene-gold/30 bg-selene-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[36px]">🌟</span>
            <div>
              <div className="text-[11px] font-bold text-selene-success uppercase tracking-wider mb-1">
                GRATIS — Empieza aquí
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
            const pricing = coursePricesMXN[course.id];
            return (
              <Card key={course.id} hover className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[28px]">{course.icon}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-selene-gold block">
                      {pricing ? pricing.label : 'Ver precio'}
                    </span>
                    <span className="text-[10px] text-selene-white-dim/60">
                      o paga en cuotas
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

      {/* ── Métodos de pago México ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Paga en 3 cuotas sin intereses
          </h2>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-4">
            Opciones de pago adaptadas a México para que el dinero no sea un obstáculo en tu
            formación espiritual.
          </p>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '🏪',
              title: 'OXXO',
              desc: 'Pago en efectivo en cualquier OXXO de la República Mexicana. Recibes voucher al instante.',
              detail: 'Sin comisión adicional',
            },
            {
              icon: '💳',
              title: 'Tarjeta de crédito',
              desc: '3 meses sin intereses con BBVA, Santander, HSBC, Banamex y otras tarjetas participantes.',
              detail: 'MSI automático al pagar',
            },
            {
              icon: '🏦',
              title: 'Tarjeta de débito',
              desc: 'Pago único con cualquier tarjeta de débito Visa o Mastercard emitida en México.',
              detail: 'Acceso inmediato',
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
            &ldquo;Llevaba años queriendo certificarme como tarotista en México pero todos los cursos
            eran puro misticismo sin fundamento. Selene me dio la base científica que necesitaba para
            ejercer con confianza y profesionalismo.&rdquo;
          </p>
          <div className="text-sm text-selene-white-dim">— Testimonio de alumna, CDMX</div>
        </div>
      </section>

      {/* ── FAQ México ── */}
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">
            Preguntas frecuentes — México
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
          Tu certificación espiritual empieza hoy
        </h2>
        <p className="text-sm text-selene-white-dim mb-2 max-w-md mx-auto">
          Curso introductorio 100% gratuito. Sin tarjeta de crédito.
        </p>
        <p className="text-sm text-selene-white-dim mb-8 max-w-md mx-auto">
          Cursos de pago desde{' '}
          <strong className="text-selene-gold">USD 26 · 3 cuotas sin intereses</strong> con OXXO o
          tarjeta.
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
