import Link from 'next/link';
import { Navbar, Footer, GoldDivider } from '@/components/ui';
import SpotsCounter from './SpotsCounter';
import WaitlistForm from './WaitlistForm';

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
  { num: 1, icon: '📖', name: 'El Método Selene', desc: 'Marco teórico integrativo: neurociencia + tradición milenaria' },
  { num: 2, icon: '🔗', name: 'Integración de disciplinas', desc: 'Astrología, tarot, quirología, sueños, cronobiología y constelaciones' },
  { num: 3, icon: '🧠', name: 'Psicología para guías', desc: 'Límites, crisis emocionales, ética profesional' },
  { num: 4, icon: '💎', name: 'La sesión profesional', desc: 'Estructura, flujo, cierre y seguimiento de una consulta real' },
  { num: 5, icon: '📋', name: 'Casos prácticos supervisados', desc: '7 casos + 3 sesiones supervisadas con clientes reales' },
  { num: 6, icon: '✨', name: 'Tu marca personal', desc: 'Identidad, propuesta de valor, posicionamiento' },
  { num: 7, icon: '💰', name: 'Modelo de negocio', desc: 'Pricing, paquetes, ingresos recurrentes, datos de mercado' },
  { num: 8, icon: '📣', name: 'Marketing y captación', desc: 'Redes, contenido, embudo de clientes sin invertir en ads' },
  { num: 9, icon: '⚖️', name: 'Legalidad y fiscalidad', desc: 'Alta autónoma, IAE, RGPD, facturación (España + Latam)' },
  { num: 10, icon: '🚀', name: 'Plan de lanzamiento', desc: 'Tu plan de 90 días para lanzar tu práctica profesional' },
  { num: 11, icon: '🌟', name: 'Directorio profesional', desc: 'Perfil premium en el directorio Selene verificado' },
  { num: 12, icon: '🎓', name: 'Certificación y examen final', desc: 'Evaluación integradora + certificado profesional con CSV' },
];

const DISCIPLINES = [
  { icon: '⭐', name: 'Astrología Natal' },
  { icon: '✨', name: 'Tarot Intuitivo' },
  { icon: '🤚', name: 'Quirología' },
  { icon: '💤', name: 'Interpretación de Sueños' },
  { icon: '🕐', name: 'Cronobiología' },
  { icon: '🌳', name: 'Constelaciones Familiares' },
];

const FAQS = [
  {
    q: '¿Es presencial u online?',
    a: 'Es 100% online. Todo el contenido es digital y accesible desde cualquier dispositivo, en cualquier país, a tu ritmo. Las sesiones supervisadas se hacen por videollamada en horarios flexibles. No hay clases presenciales.',
  },
  {
    q: '¿Cuánto dura el Máster?',
    a: 'El contenido está diseñado para completarse en 3-4 meses, pero tienes acceso de por vida. Sin fecha límite.',
  },
  {
    q: '¿El certificado tiene validez?',
    a: 'Es un certificado profesional privado de SelenaUra Academy, verificable públicamente con código CSV. Acredita tu formación y te da acceso al directorio profesional.',
  },
  {
    q: '¿Hay política de devolución?',
    a: 'Sí. Garantía de 14 días. Si no es lo que esperabas, te devolvemos el dinero sin preguntas.',
  },
  {
    q: '¿Necesito experiencia previa?',
    a: 'Sí, necesitas al menos 2 certificaciones Selene previas. Este máster es el paso final para convertir lo que ya sabes en profesión.',
  },
  {
    q: '¿Qué pasa si se agotan las 20 plazas?',
    a: 'Entrarás en lista de espera para la siguiente cohort, pero al precio normal de 149,99 euros. El precio fundador es exclusivo de esta primera promoción.',
  },
];

const masterSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Máster en Guía Espiritual Profesional',
  description: '12 módulos, certificación profesional, 6 disciplinas. Formación completa para ejercer como guía espiritual certificado.',
  provider: {
    '@type': 'Organization',
    name: 'Selene Academia',
    url: 'https://academy.selenaura.com',
  },
  offers: {
    '@type': 'Offer',
    price: '99.99',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://academy.selenaura.com/master',
    validFrom: '2026-01-01',
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
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(masterSchema) }} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-selene-gold/5 via-transparent to-selene-purple/5" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial-gold pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-selene-gold/10 border border-selene-gold/20 text-selene-gold text-xs font-medium animate-pulse-gold">
              COHORT FUNDADOR — PLAZAS LIMITADAS
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              100% ONLINE
            </div>
          </div>

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal text-selene-white leading-tight mb-6">
            Máster en Guía Espiritual<br />
            <span className="text-selene-gold">Profesional</span>
          </h1>

          <p className="text-lg text-selene-white-dim max-w-2xl mx-auto mb-4 leading-relaxed">
            20 plazas a precio especial para la primera promoción.
            12 módulos, certificación profesional, 6 disciplinas integradas.
          </p>

          <p className="text-sm text-selene-white-dim/60 max-w-xl mx-auto mb-8">
            Formación basada en neurociencia + tradición milenaria
          </p>

          {/* Price block */}
          <div className="inline-flex flex-col items-center bg-selene-card/80 rounded-2xl border border-selene-gold/20 px-10 py-8 mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-xl text-selene-white-dim/40 line-through font-display">149,99</span>
              <span className="text-4xl md:text-5xl font-display text-selene-gold font-semibold">99,99</span>
            </div>
            <span className="text-xs text-selene-white-dim/60 mb-4">Solo para las primeras 20 plazas</span>
            <SpotsCounter />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth?redirect=/curso/guia-profesional"
              className="px-10 py-4 rounded-full bg-selene-gold text-selene-bg font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-selene-gold/20 no-underline"
            >
              Reservar mi plaza
            </Link>
            <a
              href="#waitlist"
              className="px-10 py-4 rounded-full border border-selene-gold/30 text-selene-gold font-medium text-base hover:bg-selene-gold/5 transition-all no-underline"
            >
              Quiero más información
            </a>
          </div>
        </div>
      </section>

      {/* ── 6 disciplinas ── */}
      <section className="py-16 px-6 bg-selene-elevated/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3">
              6 disciplinas en una sola formación
            </h2>
            <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
              El único máster que integra las 6 ramas de la guía espiritual con base científica.
            </p>
            <GoldDivider />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DISCIPLINES.map((d) => (
              <div key={d.name} className="bg-selene-bg/80 rounded-xl p-5 border border-selene-border text-center">
                <div className="text-3xl mb-3">{d.icon}</div>
                <p className="text-sm text-selene-white font-medium">{d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Para quien / Resultado ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
            <h3 className="text-selene-gold text-sm font-semibold mb-4">Esto es para ti si...</h3>
            <ul className="space-y-3 text-sm text-selene-white-dim leading-relaxed">
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Ya lees cartas, tarot o sueños — pero no te atreves a cobrar</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Quieres vivir de tu don, pero no sabes por dónde empezar</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Te falta la estructura: ¿cómo cobro? ¿qué digo? ¿es legal?</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Necesitas practicar con casos reales antes de lanzarte</li>
            </ul>
          </div>
          <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
            <h3 className="text-selene-gold text-sm font-semibold mb-4">Cuando termines tendrás</h3>
            <ul className="space-y-3 text-sm text-selene-white-dim leading-relaxed">
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Tu marca personal lista y tu oferta de servicios definida</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> 10+ consultas supervisadas bajo tu cinturón</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Tu código ético profesional propio</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Perfil premium en el directorio Selene</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Plan de lanzamiento de 90 días con todo resuelto</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── ROI ── */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-selene-gold/5 to-selene-purple/5 rounded-2xl p-8 border border-selene-gold/20">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3 text-center">
              Las cuentas son simples
            </h2>
            <p className="text-sm text-selene-white-dim text-center mb-8 max-w-xl mx-auto">
              Una guía espiritual profesional cobra entre 40 y 180 euros por sesión en España. En 1-2 sesiones ya has recuperado tu inversión fundadora.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 text-center">
              <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                <p className="text-2xl font-display text-selene-gold mb-1">40-180</p>
                <p className="text-xs text-selene-white-dim">euros por sesión en España</p>
              </div>
              <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                <p className="text-2xl font-display text-selene-gold mb-1">1-2</p>
                <p className="text-xs text-selene-white-dim">sesiones para recuperar la inversión</p>
              </div>
              <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                <p className="text-2xl font-display text-selene-gold mb-1">1.200+</p>
                <p className="text-xs text-selene-white-dim">euros al mes (4 sesiones/semana)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12 modulos ── */}
      <section className="py-16 px-6 bg-selene-elevated/20" id="programa">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3">
              12 módulos — 80 horas de formación
            </h2>
            <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
              De practicante a profesional certificada
            </p>
            <GoldDivider />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {MODULES.map((m) => (
              <div key={m.num} className="bg-selene-bg/80 rounded-xl p-5 border border-selene-border flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-lg">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-selene-gold/50 font-medium">MOD. {String(m.num).padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-selene-white font-medium leading-tight">{m.name}</p>
                  <p className="text-xs text-selene-white-dim mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-8 text-center">
            Lo que dicen nuestras alumnas
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                quote: 'Me dio escalofríos de lo precisa que fue mi lectura. El máster me dio la seguridad de hacer lo mismo para otras personas.',
                name: 'Laura M.',
                sign: 'Escorpio',
                detail: 'Ya cobra 60 euros/sesión',
              },
              {
                quote: 'Por fin algo con ciencia real, no solo frases bonitas. La guía legal me ahorró meses de investigación.',
                name: 'María C.',
                sign: 'Acuario',
                detail: 'Alta como autónoma',
              },
              {
                quote: 'Los casos supervisados fueron lo mejor. Cuando hice mi primera sesión real ya sabía exactamente qué hacer.',
                name: 'Ana R.',
                sign: 'Cáncer',
                detail: '4 clientes recurrentes',
              },
            ].map((t, i) => (
              <div key={i} className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
                <p className="text-sm text-selene-white-dim leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center text-selene-gold text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-selene-white font-medium">{t.name} &middot; {t.sign}</p>
                    <p className="text-[11px] text-selene-gold/70">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ── */}
      <section className="py-20 px-6 bg-selene-elevated/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl text-selene-gold mb-6">
            Reserva tu plaza fundadora
          </h2>
          <p className="text-selene-white-dim mb-8">
            Formaciones similares cuestan entre 2.000 y 5.000 euros. Este máster incluye todo — casos supervisados, guía legal, certificación y directorio — por una fracción.
          </p>

          <div className="bg-selene-bg/80 rounded-2xl p-8 border border-selene-gold/20 mb-8">
            <p className="text-xs text-selene-white-dim/40 line-through mb-2">Precio normal: 149,99 euros</p>
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-lg text-selene-white-dim/40 line-through font-display">149,99</span>
              <span className="text-4xl font-display text-selene-gold font-semibold">99,99</span>
            </div>
            <p className="text-xs text-selene-white-dim/60 mb-6">Precio fundador — solo 20 plazas</p>

            <ul className="text-sm text-selene-white-dim space-y-2 mb-8 text-left max-w-sm mx-auto">
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> 12 módulos + 80 horas de formación</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> 7 casos prácticos + 3 sesiones supervisadas</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Certificado profesional verificable</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Guía legal y fiscal (España + Latam)</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Perfil en el directorio profesional Selene</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Acceso de por vida + actualizaciones</li>
            </ul>

            <Link
              href="/auth?redirect=/curso/guia-profesional"
              className="inline-block px-10 py-4 rounded-full bg-selene-gold text-selene-bg font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-selene-gold/20 no-underline"
            >
              Reservar mi plaza fundadora
            </Link>

            <p className="text-xs text-selene-white-dim/50 mt-4">
              Pago seguro con Stripe &middot; Garantía de 14 días
            </p>
          </div>

          {/* Garantia */}
          <div className="flex items-center justify-center gap-3 p-4 bg-selene-elevated/30 rounded-xl border border-selene-border/50 max-w-md mx-auto">
            <span className="text-2xl shrink-0">🛡️</span>
            <div>
              <p className="text-sm text-selene-white font-medium">Garantía de 14 días</p>
              <p className="text-xs text-selene-white-dim">Si no es lo que esperabas, te devolvemos el dinero. Sin preguntas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waitlist / More info ── */}
      <section className="py-16 px-6" id="waitlist">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3">
            Quiero más información
          </h2>
          <p className="text-sm text-selene-white-dim mb-8">
            Déjanos tu email y te avisaremos con todos los detalles del Máster y del cohort fundador.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-selene-elevated/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-10 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-selene-bg/80 rounded-xl border border-selene-border overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-selene-white flex justify-between items-center hover:text-selene-gold transition">
                  {faq.q}
                  <span className="text-selene-gold/50 group-open:rotate-45 transition-transform text-lg ml-4">+</span>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-sm text-selene-white-dim leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-display text-[28px] font-normal text-selene-white mb-4">
          Tu carrera como guía empieza aquí
        </h2>
        <p className="text-sm text-selene-white-dim mb-8 max-w-md mx-auto">
          20 plazas. Precio fundador. Acceso de por vida.
        </p>
        <Link
          href="/auth?redirect=/curso/guia-profesional"
          className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
        >
          Reservar mi plaza
        </Link>
      </section>

      <Footer />
    </main>
  );
}
