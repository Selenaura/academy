import Link from 'next/link';
import { Navbar, Footer, GoldDivider } from '@/components/ui';
import SpotsCounter from './SpotsCounter';
import WaitlistForm from './WaitlistForm';

export const metadata = {
  title: 'Cohort Fundador — Master en Guia Espiritual Profesional | Selene Academia',
  description: 'Solo 20 plazas a 99,99 euros (precio normal 149,99 euros). 12 modulos, certificacion profesional, 6 disciplinas. Reserva tu plaza en la primera promocion del Master de Selene Academia.',
  metadataBase: new URL('https://academy.selenaura.com'),
  alternates: { canonical: 'https://academy.selenaura.com/master' },
  openGraph: {
    title: 'Cohort Fundador — Master en Guia Espiritual Profesional',
    description: 'Solo 20 plazas a 99,99 euros. 12 modulos, certificacion, 6 disciplinas. Primera promocion de Selene Academia.',
    siteName: 'Selene Academia',
    locale: 'es_ES',
    type: 'website',
    url: 'https://academy.selenaura.com/master',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cohort Fundador — Master Guia Espiritual Profesional',
    description: 'Solo 20 plazas a 99,99 euros. Reserva tu plaza ahora.',
  },
};

const MODULES = [
  { num: 1, icon: '📖', name: 'El Metodo Selene', desc: 'Marco teorico integrativo: neurociencia + tradicion milenaria' },
  { num: 2, icon: '🔗', name: 'Integracion de disciplinas', desc: 'Astrologia, tarot, quirologia, suenos, cronobiologia y constelaciones' },
  { num: 3, icon: '🧠', name: 'Psicologia para guias', desc: 'Limites, crisis emocionales, etica profesional' },
  { num: 4, icon: '💎', name: 'La sesion profesional', desc: 'Estructura, flujo, cierre y seguimiento de una consulta real' },
  { num: 5, icon: '📋', name: 'Casos practicos supervisados', desc: '7 casos + 3 sesiones supervisadas con clientes reales' },
  { num: 6, icon: '✨', name: 'Tu marca personal', desc: 'Identidad, propuesta de valor, posicionamiento' },
  { num: 7, icon: '💰', name: 'Modelo de negocio', desc: 'Pricing, paquetes, ingresos recurrentes, datos de mercado' },
  { num: 8, icon: '📣', name: 'Marketing y captacion', desc: 'Redes, contenido, embudo de clientes sin invertir en ads' },
  { num: 9, icon: '⚖️', name: 'Legalidad y fiscalidad', desc: 'Alta autonoma, IAE, RGPD, facturacion (Espana + Latam)' },
  { num: 10, icon: '🚀', name: 'Plan de lanzamiento', desc: 'Tu plan de 90 dias para lanzar tu practica profesional' },
  { num: 11, icon: '🌟', name: 'Directorio profesional', desc: 'Perfil premium en el directorio Selene verificado' },
  { num: 12, icon: '🎓', name: 'Certificacion y examen final', desc: 'Evaluacion integradora + certificado profesional con CSV' },
];

const DISCIPLINES = [
  { icon: '⭐', name: 'Astrologia Natal' },
  { icon: '✨', name: 'Tarot Intuitivo' },
  { icon: '🤚', name: 'Quirologia' },
  { icon: '💤', name: 'Interpretacion de Suenos' },
  { icon: '🕐', name: 'Cronobiologia' },
  { icon: '🌳', name: 'Constelaciones Familiares' },
];

const FAQS = [
  {
    q: 'Es 100% online?',
    a: 'Si. Todo el contenido es online, a tu ritmo. Las sesiones supervisadas se hacen por videollamada en horarios flexibles.',
  },
  {
    q: 'Cuanto dura el Master?',
    a: 'El contenido esta disenado para completarse en 3-4 meses, pero tienes acceso de por vida. Sin fecha limite.',
  },
  {
    q: 'El certificado tiene validez?',
    a: 'Es un certificado profesional privado de SelenaUra Academy, verificable publicamente con codigo CSV. Acredita tu formacion y te da acceso al directorio profesional.',
  },
  {
    q: 'Hay politica de devolucion?',
    a: 'Si. Garantia de 14 dias. Si no es lo que esperabas, te devolvemos el dinero sin preguntas.',
  },
  {
    q: 'Necesito experiencia previa?',
    a: 'Si, necesitas al menos 2 certificaciones Selene previas. Este master es el paso final para convertir lo que ya sabes en profesion.',
  },
  {
    q: 'Que pasa si se agotan las 20 plazas?',
    a: 'Entraras en lista de espera para la siguiente cohort, pero al precio normal de 149,99 euros. El precio fundador es exclusivo de esta primera promocion.',
  },
];

const masterSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Master en Guia Espiritual Profesional',
  description: '12 modulos, certificacion profesional, 6 disciplinas. Formacion completa para ejercer como guia espiritual certificado.',
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
    courseWorkload: '12 modulos',
  },
  educationalLevel: 'Advanced',
  inLanguage: 'es',
  numberOfCredits: 12,
  occupationalCredentialAwarded: 'Certificado Profesional de Guia Espiritual',
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-selene-gold/10 border border-selene-gold/20 text-selene-gold text-xs font-medium mb-6 animate-pulse-gold">
            COHORT FUNDADOR — PLAZAS LIMITADAS
          </div>

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal text-selene-white leading-tight mb-6">
            Master en Guia Espiritual<br />
            <span className="text-selene-gold">Profesional</span>
          </h1>

          <p className="text-lg text-selene-white-dim max-w-2xl mx-auto mb-4 leading-relaxed">
            20 plazas a precio especial para la primera promocion.
            12 modulos, certificacion profesional, 6 disciplinas integradas.
          </p>

          <p className="text-sm text-selene-white-dim/60 max-w-xl mx-auto mb-8">
            Formacion basada en neurociencia + tradicion milenaria
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
              Quiero mas informacion
            </a>
          </div>
        </div>
      </section>

      {/* ── 6 disciplinas ── */}
      <section className="py-16 px-6 bg-selene-elevated/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3">
              6 disciplinas en una sola formacion
            </h2>
            <p className="text-sm text-selene-white-dim max-w-lg mx-auto mb-4">
              El unico master que integra las 6 ramas de la guia espiritual con base cientifica.
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
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Ya lees cartas, tarot o suenos — pero no te atreves a cobrar</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Quieres vivir de tu don, pero no sabes por donde empezar</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Te falta la estructura: como cobro? que digo? es legal?</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Necesitas practicar con casos reales antes de lanzarte</li>
            </ul>
          </div>
          <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
            <h3 className="text-selene-gold text-sm font-semibold mb-4">Cuando termines tendras</h3>
            <ul className="space-y-3 text-sm text-selene-white-dim leading-relaxed">
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Tu marca personal lista y tu oferta de servicios definida</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> 10+ consultas supervisadas bajo tu cinturon</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Tu codigo etico profesional propio</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Perfil premium en el directorio Selene</li>
              <li className="flex gap-2"><span className="text-selene-gold shrink-0">&#10003;</span> Plan de lanzamiento de 90 dias con todo resuelto</li>
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
              Una guia espiritual profesional cobra entre 40 y 180 euros por sesion en Espana. En 1-2 sesiones ya has recuperado tu inversion fundadora.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 text-center">
              <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                <p className="text-2xl font-display text-selene-gold mb-1">40-180</p>
                <p className="text-xs text-selene-white-dim">euros por sesion en Espana</p>
              </div>
              <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                <p className="text-2xl font-display text-selene-gold mb-1">1-2</p>
                <p className="text-xs text-selene-white-dim">sesiones para recuperar la inversion</p>
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
              12 modulos — 80 horas de formacion
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
                quote: 'Me dio escalofrios de lo precisa que fue mi lectura. El master me dio la seguridad de hacer lo mismo para otras personas.',
                name: 'Laura M.',
                sign: 'Escorpio',
                detail: 'Ya cobra 60 euros/sesion',
              },
              {
                quote: 'Por fin algo con ciencia real, no solo frases bonitas. La guia legal me ahorro meses de investigacion.',
                name: 'Maria C.',
                sign: 'Acuario',
                detail: 'Alta como autonoma',
              },
              {
                quote: 'Los casos supervisados fueron lo mejor. Cuando hice mi primera sesion real ya sabia exactamente que hacer.',
                name: 'Ana R.',
                sign: 'Cancer',
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
            Formaciones similares cuestan entre 2.000 y 5.000 euros. Este master incluye todo — casos supervisados, guia legal, certificacion y directorio — por una fraccion.
          </p>

          <div className="bg-selene-bg/80 rounded-2xl p-8 border border-selene-gold/20 mb-8">
            <p className="text-xs text-selene-white-dim/40 line-through mb-2">Precio normal: 149,99 euros</p>
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-lg text-selene-white-dim/40 line-through font-display">149,99</span>
              <span className="text-4xl font-display text-selene-gold font-semibold">99,99</span>
            </div>
            <p className="text-xs text-selene-white-dim/60 mb-6">Precio fundador — solo 20 plazas</p>

            <ul className="text-sm text-selene-white-dim space-y-2 mb-8 text-left max-w-sm mx-auto">
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> 12 modulos + 80 horas de formacion</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> 7 casos practicos + 3 sesiones supervisadas</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Certificado profesional verificable</li>
              <li className="flex gap-2"><span className="text-selene-gold">&#10003;</span> Guia legal y fiscal (Espana + Latam)</li>
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
              Pago seguro con Stripe &middot; Garantia de 14 dias
            </p>
          </div>

          {/* Garantia */}
          <div className="flex items-center justify-center gap-3 p-4 bg-selene-elevated/30 rounded-xl border border-selene-border/50 max-w-md mx-auto">
            <span className="text-2xl shrink-0">🛡️</span>
            <div>
              <p className="text-sm text-selene-white font-medium">Garantia de 14 dias</p>
              <p className="text-xs text-selene-white-dim">Si no es lo que esperabas, te devolvemos el dinero. Sin preguntas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waitlist / More info ── */}
      <section className="py-16 px-6" id="waitlist">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3">
            Quiero mas informacion
          </h2>
          <p className="text-sm text-selene-white-dim mb-8">
            Dejanos tu email y te avisaremos con todos los detalles del Master y del cohort fundador.
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
          Tu carrera como guia empieza aqui
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
