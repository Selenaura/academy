import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider } from '@/components/ui';

// ── Module names per course (fallback to generic) ──
const MODULE_NAMES = {
  'guia-profesional': {
    1: 'El Método Selene', 2: 'Integración de disciplinas', 3: 'Psicología para guías',
    4: 'La sesión profesional', 5: 'Casos prácticos supervisados', 6: 'Tu marca personal',
    7: 'Modelo de negocio', 8: 'Marketing y captación', 9: 'Legalidad y fiscalidad',
    10: 'Plan de lanzamiento',
  },
  'magnetismo-consciente': {
    1: 'Fundamentos de la atracción', 2: 'Coherencia cardíaca', 3: 'Neuroplasticidad',
    4: 'Epigenética conductual', 5: 'Psicología de la manifestación', 6: 'Tu protocolo personalizado',
  },
  'astrologia-natal': {
    1: 'Los planetas', 2: 'Las casas astrológicas', 3: 'Signos y elementos',
    4: 'Aspectos planetarios', 5: 'Carta natal integrada', 6: 'Tránsitos y progresiones',
    7: 'Luna y nodos', 8: 'Retornos planetarios', 9: 'Lectura para otros', 10: 'Práctica profesional',
  },
  'tarot-intuitivo': {
    1: 'Fundamentos del tarot', 2: 'Arcanos Mayores I', 3: 'Arcanos Mayores II',
    4: 'Arcanos Menores', 5: 'Tiradas y lecturas', 6: 'Práctica profesional',
  },
  'quirologia-certificacion': {
    1: 'Fundamentos de quirología', 2: 'Las manos y los dedos', 3: 'Las líneas principales',
    4: 'Marcas y formaciones', 5: 'Dermatoglifos', 6: 'Práctica profesional',
  },
  'raices-invisibles': {
    1: 'Sistemas familiares', 2: 'Roles transgeneracionales', 3: 'Astrología familiar',
    4: 'Epigenética emocional', 5: 'Terapia sistémica', 6: 'Integración y rituales',
  },
  'suenos-certificacion': {
    1: 'Teoría de los sueños', 2: 'Símbolos oníricos', 3: 'Arquetipos y pesadillas',
    4: 'Diario de sueños', 5: 'Interpretación profesional', 6: 'Práctica y negocio',
  },
  'cronobiologia': {
    1: 'Ritmos biológicos', 2: 'Cronotipos', 3: 'Ciclos lunares',
    4: 'Astrología y tiempo', 5: 'Aplicación práctica', 6: 'Tu protocolo crono',
  },
  'brujula-interior': {
    1: 'Consciencia y autoconocimiento', 2: 'Los cuatro elementos', 3: 'Meditación y neurociencia',
    4: 'Intuición y toma de decisiones', 5: 'Tu mapa energético', 6: 'Integración y camino',
  },
};

const MODULE_ICONS_DEFAULT = ['📖', '🔗', '🧠', '💎', '📋', '✨', '💰', '📣', '⚖️', '🚀', '🌟', '🎯'];

// ── SEO metadata ──
export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = COURSES.find(c => c.id === id);
  if (!course) return {};
  const isMasterMeta = id === 'guia-profesional';
  const metaDescription = isMasterMeta
    ? 'Conviértete en guía espiritual profesional certificada. 12 módulos, 80h, prácticas supervisadas, guía legal y marca personal. Desde €50/mes.'
    : `Programa completo: ${course.modules} módulos, ${course.lessons_count} lecciones, ${course.hours} de formación. ${course.description?.substring(0, 120)}`;
  const metaTitle = isMasterMeta
    ? 'Máster en Guía Espiritual Profesional — Selene Academia'
    : `Programa ${course.title} — Selene Academia`;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL('https://academy.selenaura.com'),
    alternates: { canonical: `https://academy.selenaura.com/programa/${id}` },
    openGraph: {
      title: isMasterMeta ? 'Máster en Guía Espiritual Profesional' : `Programa ${course.title}`,
      description: metaDescription,
      siteName: 'Selene Academia',
      locale: 'es_ES',
      type: 'website',
      url: `https://academy.selenaura.com/programa/${id}`,
    },
  };
}

export async function generateStaticParams() {
  return COURSES.map(c => ({ id: c.id }));
}

export default async function ProgramaPage({ params }) {
  const { id } = await params;
  const course = COURSES.find(c => c.id === id);
  if (!course) notFound();

  const lessons = course.lessons || [];
  const modules = {};
  lessons.forEach(l => {
    const m = l.module || 0;
    if (!modules[m]) modules[m] = [];
    modules[m].push(l);
  });

  const totalLessons = lessons.filter(l => l.type === 'lesson').length;
  const totalQuizzes = lessons.filter(l => l.type === 'quiz').length;
  const totalExams = lessons.filter(l => l.type === 'exam').length;
  const moduleNames = MODULE_NAMES[id] || {};
  const isFree = course.price === 0;
  const isMaster = id === 'guia-profesional';

  return (
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-selene-gold/5 via-transparent to-selene-accent/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-selene-gold/10 border border-selene-gold/20 text-selene-gold text-xs font-medium mb-6">
            {course.icon} {course.level} · {course.modules} módulos · {course.hours}
          </div>

          {isMaster ? (
            <>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal text-selene-white leading-tight mb-6">
                Ya tienes el don.<br />
                <span className="text-selene-gold">Ahora conviértelo en tu profesión.</span>
              </h1>
              <p className="text-lg text-selene-white-dim max-w-2xl mx-auto mb-4 leading-relaxed">
                El máster que te lleva de practicante a profesional certificada — con marca personal,
                ética, casos reales supervisados y todo lo que necesitas para vivir de esto.
              </p>
              <p className="text-sm text-selene-white-dim/70 max-w-xl mx-auto mb-8">
                80 horas · 12 módulos · 7 casos prácticos · 3 sesiones supervisadas · Guía legal y fiscal · Certificación profesional con perfil en el directorio Selene.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal text-selene-white leading-tight mb-6">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-lg text-selene-white-dim max-w-2xl mx-auto mb-4 leading-relaxed">
                  {course.subtitle}
                </p>
              )}
              {course.description && (
                <p className="text-sm text-selene-white-dim/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                  {course.description}
                </p>
              )}
            </>
          )}

          <div className="flex flex-wrap justify-center gap-6 text-sm text-selene-white-dim mb-10">
            <span className="flex items-center gap-1.5">📚 {totalLessons} lecciones</span>
            {totalQuizzes > 0 && <span className="flex items-center gap-1.5">✅ {totalQuizzes} evaluaciones</span>}
            {totalExams > 0 && <span className="flex items-center gap-1.5">🎓 {totalExams} examen final</span>}
            <span className="flex items-center gap-1.5">⏱️ {course.hours}</span>
            {course.certification && <span className="flex items-center gap-1.5">📜 Certificado verificable</span>}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isFree ? '/auth?redirect=/dashboard' : `/auth?redirect=/curso/${id}`}
              className="px-8 py-3.5 rounded-full bg-selene-gold text-selene-bg font-semibold text-base hover:bg-selene-gold/90 transition-all shadow-lg shadow-selene-gold/20"
            >
              {isFree ? 'Empezar gratis' : isMaster ? 'Quiero ser guía profesional ✦' : `Inscribirme — ${course.price_label}`}
            </Link>
            {isMaster && (
              <Link
                href={`/auth?redirect=/curso/${id}`}
                className="px-8 py-3.5 rounded-full border border-selene-gold/30 text-selene-gold font-medium text-base hover:bg-selene-gold/5 transition-all"
              >
                3 cuotas de €50/mes
              </Link>
            )}
          </div>
          {isMaster ? (
            <p className="text-xs text-selene-white-dim/60 mt-4">Requisito: 2+ certificaciones Selene previas</p>
          ) : course.cert_requirements ? (
            <p className="text-xs text-selene-white-dim/60 mt-4">Requisito: {course.cert_requirements}</p>
          ) : null}
        </div>
      </section>

      {/* ── Proceso visual (solo Máster) ── */}
      {isMaster && (
        <section className="py-12 px-6 bg-selene-elevated/20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: '01', icon: '📚', label: '2 certificaciones', desc: 'Tu base de conocimiento' },
                { step: '02', icon: '🌀', label: '12 módulos · 80h', desc: 'De practicante a profesional' },
                { step: '03', icon: '📋', label: '7 casos + 3 supervisadas', desc: 'Práctica con clientes reales' },
                { step: '04', icon: '🚀', label: 'Lanzamiento', desc: 'Tu carrera empieza' },
              ].map((s) => (
                <div key={s.step} className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-selene-gold/10 border border-selene-gold/20 text-xl mb-3">
                    {s.icon}
                  </div>
                  <p className="text-[10px] text-selene-gold/50 font-medium mb-1">PASO {s.step}</p>
                  <p className="text-sm text-selene-white font-medium">{s.label}</p>
                  <p className="text-[11px] text-selene-white-dim mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <GoldDivider />

      {/* ── Para quién / Qué aprenderás ── */}
      {isMaster ? (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
                <h3 className="text-selene-gold text-sm font-semibold mb-4">🎯 Esto es para ti si...</h3>
                <ul className="space-y-3 text-sm text-selene-white-dim leading-relaxed">
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Ya lees cartas, tarot o sueños — pero no te atreves a cobrar</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Quieres vivir de tu don, pero no sabes por dónde empezar</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Te falta la estructura: ¿cómo cobro? ¿qué digo? ¿es legal?</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Necesitas practicar con casos reales antes de lanzarte</li>
                </ul>
              </div>
              <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
                <h3 className="text-selene-gold text-sm font-semibold mb-4">✨ Cuando termines tendrás</h3>
                <ul className="space-y-3 text-sm text-selene-white-dim leading-relaxed">
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Tu marca personal lista y tu oferta de servicios definida</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> 10+ consultas supervisadas bajo tu cinturón</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Tu código ético profesional propio</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Perfil premium en el directorio Selene</li>
                  <li className="flex gap-2"><span className="text-selene-gold shrink-0">✓</span> Plan de lanzamiento de 90 días con todo resuelto</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : (course.for_whom || course.outcome) ? (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {course.for_whom && (
              <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
                <h3 className="text-selene-gold text-sm font-semibold mb-3">🎯 Para quién es</h3>
                <p className="text-sm text-selene-white-dim leading-relaxed">{course.for_whom}</p>
              </div>
            )}
            {course.outcome && (
              <div className="bg-selene-elevated/50 rounded-2xl p-6 border border-selene-border">
                <h3 className="text-selene-gold text-sm font-semibold mb-3">✨ Al terminar podrás</h3>
                <p className="text-sm text-selene-white-dim leading-relaxed">{course.outcome}</p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ── ROI / Ingresos (solo Máster) ── */}
      {isMaster && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-selene-gold/5 to-selene-accent/5 rounded-2xl p-8 border border-selene-gold/20">
              <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-3 text-center">
                Las cuentas son simples
              </h2>
              <p className="text-sm text-selene-white-dim text-center mb-8 max-w-xl mx-auto">
                Una guía espiritual profesional cobra entre €40 y €180 por sesión en España. En 2-3 sesiones ya has recuperado tu inversión en el máster.
              </p>
              <div className="grid sm:grid-cols-3 gap-5 text-center">
                <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                  <p className="text-2xl font-display text-selene-gold mb-1">€40-180</p>
                  <p className="text-xs text-selene-white-dim">por sesión en España</p>
                </div>
                <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                  <p className="text-2xl font-display text-selene-gold mb-1">2-3</p>
                  <p className="text-xs text-selene-white-dim">sesiones para recuperar la inversión</p>
                </div>
                <div className="bg-selene-bg/60 rounded-xl p-5 border border-selene-border">
                  <p className="text-2xl font-display text-selene-gold mb-1">€1.200+</p>
                  <p className="text-xs text-selene-white-dim">ingresos potenciales al mes (4 sesiones/semana)</p>
                </div>
              </div>
              <p className="text-xs text-selene-white-dim/50 text-center mt-5">
                Datos de mercado 2025. Precios por país incluidos en el módulo 7.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Metodología ── */}
      {course.science && (
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-selene-elevated/30 rounded-xl p-5 border border-selene-border/50">
              <h3 className="text-selene-gold text-xs font-semibold mb-2">🔬 Base científica</h3>
              <p className="text-xs text-selene-white-dim/80 leading-relaxed">{course.science}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Qué incluye ── */}
      <section className="py-16 px-6 bg-selene-elevated/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-10 text-center">
            Qué incluye
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📚', title: `${totalLessons} lecciones`, desc: 'Contenido escrito con elementos visuales interactivos: mapas conceptuales, diagramas de proceso, escenarios de decisión.' },
              { icon: '✅', title: 'Evaluaciones por módulo', desc: 'Quiz de opción múltiple con explicaciones detalladas. Escenarios prácticos, no memorización.' },
              { icon: '🎓', title: 'Certificado verificable', desc: 'Al completar todas las lecciones y evaluaciones recibes un certificado con código CSV verificable públicamente.' },
              ...(isMaster ? [
                { icon: '📋', title: '3 casos supervisados', desc: 'Primera consulta, sesión de pareja y crisis existencial. Protocolos reales con situaciones documentadas.' },
                { icon: '💰', title: 'Datos de pricing reales', desc: 'Precios 2025 para España (€40-180/sesión), México, Argentina, Colombia y Chile en moneda local.' },
                { icon: '⚖️', title: 'Guía legal completa', desc: 'Alta autónoma, IAE/CNAE, facturación IVA/IRPF, RGPD. Con equivalencias LATAM.' },
              ] : [
                { icon: '🌙', title: 'Acceso de por vida', desc: 'Una vez inscrita, accedes al contenido para siempre. Incluye futuras actualizaciones sin coste adicional.' },
              ]),
            ].map((item) => (
              <div key={item.title} className="bg-selene-bg/80 rounded-xl p-5 border border-selene-border">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-selene-white text-sm font-semibold mb-2">{item.title}</h3>
                <p className="text-xs text-selene-white-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Programa completo ── */}
      <section className="py-16 px-6" id="programa">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-4 text-center">
            Programa completo
          </h2>
          <p className="text-center text-sm text-selene-white-dim mb-12 max-w-xl mx-auto">
            {course.modules} módulos · {totalLessons} lecciones · {course.hours} de formación
          </p>

          <div className="space-y-6">
            {Object.entries(modules).map(([moduleNum, moduleLessons]) => {
              const num = parseInt(moduleNum);
              const icon = MODULE_ICONS_DEFAULT[num - 1] || '📖';
              const name = moduleNames[num] || `Módulo ${num}`;
              let lessonCounter = 0;

              return (
                <div key={num} className="bg-selene-elevated/50 rounded-2xl border border-selene-border overflow-hidden">
                  <div className="px-6 py-5 border-b border-selene-border/50 bg-selene-elevated/30">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-selene-gold/60 font-medium">MÓDULO {num}</span>
                          <span className="text-xs text-selene-white-dim/40">·</span>
                          <span className="text-xs text-selene-white-dim/60">
                            {moduleLessons.filter(l => l.type === 'lesson').length} lecciones
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-selene-white">{name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-selene-border/30">
                    {moduleLessons.map((lesson) => {
                      if (lesson.type === 'lesson') lessonCounter++;
                      return (
                        <div key={lesson.id} className="px-6 py-3.5 flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
                            ${lesson.type === 'quiz' ? 'bg-selene-accent/10 text-selene-accent border border-selene-accent/20' :
                              lesson.type === 'exam' ? 'bg-selene-gold/10 text-selene-gold border border-selene-gold/20' :
                              'bg-selene-white/5 text-selene-white-dim border border-selene-border'}`}>
                            {lesson.type === 'quiz' ? '✓' : lesson.type === 'exam' ? '★' : lessonCounter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${lesson.type === 'exam' ? 'text-selene-gold font-medium' : 'text-selene-white'}`}>
                              {lesson.title}
                            </p>
                          </div>
                          <span className="text-xs text-selene-white-dim/50 shrink-0">{lesson.duration}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0
                            ${lesson.type === 'quiz' ? 'bg-selene-accent/10 text-selene-accent' :
                              lesson.type === 'exam' ? 'bg-selene-gold/10 text-selene-gold' :
                              'bg-selene-white/5 text-selene-white-dim/60'}`}>
                            {lesson.type === 'lesson' ? 'Lección' : lesson.type === 'quiz' ? 'Quiz' : 'Examen'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Status quo + Testimonios (solo Máster) ── */}
      {isMaster && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Status quo — nombrar el dolor */}
            <div className="bg-selene-elevated/30 rounded-2xl p-8 border border-selene-border mb-12">
              <h2 className="font-display text-2xl md:text-3xl text-selene-white mb-4 text-center">
                ¿Te suena esto?
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <p className="text-3xl mb-3">🎴</p>
                  <p className="text-sm text-selene-white-dim leading-relaxed">
                    Llevas meses leyendo cartas para amigas y familiares gratis. Te dicen que eres buenísima. Pero nunca cobras.
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-3">😶</p>
                  <p className="text-sm text-selene-white-dim leading-relaxed">
                    Quieres poner precio a tus sesiones pero te da miedo. ¿Cuánto cobro? ¿Y si no me toman en serio? ¿Es legal?
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-3">🔄</p>
                  <p className="text-sm text-selene-white-dim leading-relaxed">
                    Sigues en tu trabajo de siempre, sabiendo que tu don podría ser tu profesión. Pero no das el paso.
                  </p>
                </div>
              </div>
              <p className="text-sm text-selene-gold text-center mt-8 font-medium">
                Este máster existe para que dejes de regalar tu talento y empieces a vivir de él.
              </p>
            </div>

            {/* Testimonios */}
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-8 text-center">
              Lo que dicen nuestras alumnas
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  quote: 'Me dio escalofríos de lo precisa que fue mi lectura. El máster me dio la seguridad de hacer lo mismo para otras personas.',
                  name: 'Laura M.',
                  sign: 'Escorpio',
                  detail: 'Ya cobra €60/sesión',
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
                      <p className="text-xs text-selene-white font-medium">{t.name} · {t.sign}</p>
                      <p className="text-[11px] text-selene-gold/70">{t.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing CTA ── */}
      <section className="py-20 px-6 bg-selene-elevated/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl text-selene-gold mb-6">
            {isFree ? 'Empieza gratis ahora' : isMaster ? 'Tu carrera como guía empieza aquí' : 'Inscríbete'}
          </h2>
          {isMaster ? (
            <p className="text-selene-white-dim mb-8">
              Formaciones similares cuestan entre €2.000 y €5.000. Este máster incluye todo — casos supervisados, guía legal, certificación y directorio — por una fracción.
            </p>
          ) : (
            <p className="text-selene-white-dim mb-8">
              Acceso inmediato a {totalLessons > 1 ? `los ${course.modules} módulos` : 'todo el contenido'}. Avanza a tu ritmo.
            </p>
          )}

          <div className="bg-selene-bg/80 rounded-2xl p-8 border border-selene-gold/20 mb-8">
            {isFree ? (
              <p className="text-3xl font-display text-selene-gold mb-6">GRATIS</p>
            ) : isMaster ? (
              <div className="mb-6">
                <p className="text-xs text-selene-white-dim/40 line-through mb-2">Formaciones equivalentes: €2.000-5.000</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <div>
                    <p className="text-xs text-selene-white-dim/60 mb-1">Pago único</p>
                    <p className="text-3xl font-display text-selene-gold">{course.price_label}</p>
                    <p className="text-xs text-selene-white-dim/50 mt-1">€1,25/día durante 4 meses</p>
                  </div>
                  <div className="hidden sm:block w-px h-16 bg-selene-border" />
                  <div>
                    <p className="text-xs text-selene-white-dim/60 mb-1">3 cuotas mensuales</p>
                    <p className="text-3xl font-display text-selene-white">€50<span className="text-lg text-selene-white-dim">/mes</span></p>
                    <p className="text-xs text-selene-white-dim/50 mt-1">Sin intereses</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
                <div>
                  <p className="text-xs text-selene-white-dim/60 mb-1">Pago único</p>
                  <p className="text-3xl font-display text-selene-gold">{course.price_label}</p>
                </div>
              </div>
            )}

            <ul className="text-sm text-selene-white-dim space-y-2 mb-8 text-left max-w-sm mx-auto">
              <li className="flex gap-2"><span className="text-selene-gold">✓</span> {totalLessons} lecciones + evaluaciones</li>
              {course.certification && <li className="flex gap-2"><span className="text-selene-gold">✓</span> Certificado verificable</li>}
              <li className="flex gap-2"><span className="text-selene-gold">✓</span> Acceso de por vida + actualizaciones</li>
              {isMaster && <li className="flex gap-2"><span className="text-selene-gold">✓</span> 3 casos prácticos supervisados</li>}
              {isMaster && <li className="flex gap-2"><span className="text-selene-gold">✓</span> Guía legal y fiscal completa</li>}
              {isMaster && <li className="flex gap-2"><span className="text-selene-gold">✓</span> Perfil en el directorio profesional Selene</li>}
            </ul>

            <Link
              href={isFree ? '/auth?redirect=/dashboard' : `/auth?redirect=/curso/${id}`}
              className="inline-block px-10 py-4 rounded-full bg-selene-gold text-selene-bg font-semibold text-base hover:bg-selene-gold/90 transition-all shadow-lg shadow-selene-gold/20"
            >
              {isFree ? 'Empezar gratis →' : isMaster ? 'Sí, quiero ser guía profesional ✦' : 'Empezar ahora →'}
            </Link>

            {isMaster && (
              <p className="text-xs text-selene-white-dim/50 mt-4">
                Pago seguro con Stripe · Tarjeta, Klarna o cuotas
              </p>
            )}
          </div>

          {/* Garantía */}
          {isMaster && (
            <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-selene-elevated/30 rounded-xl border border-selene-border/50 max-w-md mx-auto">
              <span className="text-2xl shrink-0">🛡️</span>
              <div>
                <p className="text-sm text-selene-white font-medium">Garantía de 14 días</p>
                <p className="text-xs text-selene-white-dim">Si no es lo que esperabas, te devolvemos el dinero. Sin preguntas.</p>
              </div>
            </div>
          )}

          <p className="text-xs text-selene-white-dim/50">
            ¿Preguntas? Escríbenos a <a href="mailto:info@selenaura.com" className="text-selene-gold/60 hover:text-selene-gold">info@selenaura.com</a>
          </p>
        </div>
      </section>

      {/* ── FAQ (solo Máster) ── */}
      {isMaster && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-10 text-center">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Necesito experiencia previa?',
                  a: 'Sí — necesitas al menos 2 certificaciones Selene previas. Este máster es el paso final: convierte lo que ya sabes en una profesión.',
                },
                {
                  q: '¿Puedo vivir de esto?',
                  a: 'En España, una guía espiritual cobra entre €40 y €180 por sesión. Con 4 sesiones a la semana puedes generar €1.200+/mes. En el módulo 7 te damos datos de mercado reales por país.',
                },
                {
                  q: '¿El certificado tiene validez oficial?',
                  a: 'Es un certificado profesional privado de SelenaUra Academy, verificable públicamente con código CSV. No es un título universitario, pero acredita tu formación y te da acceso al directorio profesional.',
                },
                {
                  q: '¿Cuánto tiempo tengo para completarlo?',
                  a: 'Acceso de por vida. El contenido está diseñado para completarse en 3-4 meses a tu ritmo, pero no hay fecha límite.',
                },
                {
                  q: '¿Qué incluye la guía legal?',
                  a: 'Todo: alta autónomo/a, IAE y CNAE correctos, facturación con IVA e IRPF, protección de datos (RGPD), y equivalencias para México, Argentina, Colombia y Chile.',
                },
                {
                  q: '¿Puedo pagar en cuotas?',
                  a: 'Sí — 3 cuotas mensuales de €50, sin intereses. También aceptamos Klarna y todas las tarjetas.',
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-selene-elevated/50 rounded-xl border border-selene-border overflow-hidden">
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
      )}

      {/* ── Bundle pathway (solo Máster) ── */}
      {isMaster && (
        <section className="py-16 px-6 bg-selene-elevated/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl text-selene-gold mb-4">
              ¿Aún no tienes 2 certificaciones?
            </h2>
            <p className="text-sm text-selene-white-dim mb-10 max-w-xl mx-auto">
              El Máster requiere al menos 2 certificaciones Selene previas. Estas son las más populares para empezar tu camino:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'tarot-intuitivo', icon: '✨', title: 'Tarot Intuitivo', price: '€69,99', hours: '25h' },
                { id: 'astrologia-natal', icon: '⭐', title: 'Astrología Natal', price: '€69,99', hours: '30h' },
                { id: 'suenos-certificacion', icon: '💤', title: 'Interpretación de Sueños', price: '€49,99', hours: '18h' },
                { id: 'quirologia-certificacion', icon: '🤚', title: 'Quirología', price: '€49,99', hours: '23h' },
              ].map((cert) => (
                <Link
                  key={cert.id}
                  href={`/programa/${cert.id}`}
                  className="bg-selene-bg/80 rounded-xl p-5 border border-selene-border hover:border-selene-gold/30 transition group"
                >
                  <p className="text-2xl mb-2">{cert.icon}</p>
                  <p className="text-sm text-selene-white font-medium group-hover:text-selene-gold transition">{cert.title}</p>
                  <p className="text-xs text-selene-white-dim mt-1">{cert.hours} · {cert.price}</p>
                </Link>
              ))}
            </div>
            <p className="text-xs text-selene-white-dim/50 mt-6">
              Completa 2 certificaciones → accede al Máster → conviértete en guía profesional
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
