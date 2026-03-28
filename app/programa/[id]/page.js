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
  return {
    title: `Programa ${course.title} — Selene Academia`,
    description: `Programa completo: ${course.modules} módulos, ${course.lessons_count} lecciones, ${course.hours} de formación. ${course.description?.substring(0, 120)}`,
    metadataBase: new URL('https://academy.selenaura.com'),
    alternates: { canonical: `https://academy.selenaura.com/programa/${id}` },
    openGraph: {
      title: `Programa ${course.title}`,
      description: course.description,
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
              {isFree ? 'Empezar gratis' : `Inscribirme — ${course.price_label}`}
            </Link>
            {isMaster && (
              <Link
                href={`/auth?redirect=/curso/${id}`}
                className="px-8 py-3.5 rounded-full border border-selene-gold/30 text-selene-gold font-medium text-base hover:bg-selene-gold/5 transition-all"
              >
                3 cuotas de €50
              </Link>
            )}
          </div>
          {course.cert_requirements && (
            <p className="text-xs text-selene-white-dim/60 mt-4">Requisito: {course.cert_requirements}</p>
          )}
        </div>
      </section>

      <GoldDivider />

      {/* ── Para quién / Qué aprenderás ── */}
      {(course.for_whom || course.outcome) && (
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

      {/* ── Pricing CTA ── */}
      <section className="py-20 px-6 bg-selene-elevated/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl text-selene-gold mb-6">
            {isFree ? 'Empieza gratis ahora' : 'Inscríbete'}
          </h2>
          <p className="text-selene-white-dim mb-8">
            Acceso inmediato a {totalLessons > 1 ? `los ${course.modules} módulos` : 'todo el contenido'}. Avanza a tu ritmo.
          </p>

          <div className="bg-selene-bg/80 rounded-2xl p-8 border border-selene-gold/20 mb-8">
            {isFree ? (
              <p className="text-3xl font-display text-selene-gold mb-6">GRATIS</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
                <div>
                  <p className="text-xs text-selene-white-dim/60 mb-1">Pago único</p>
                  <p className="text-3xl font-display text-selene-gold">{course.price_label}</p>
                </div>
                {isMaster && (
                  <>
                    <div className="hidden sm:block w-px h-12 bg-selene-border" />
                    <div>
                      <p className="text-xs text-selene-white-dim/60 mb-1">3 cuotas mensuales</p>
                      <p className="text-3xl font-display text-selene-white">€50<span className="text-lg text-selene-white-dim">/mes</span></p>
                    </div>
                  </>
                )}
              </div>
            )}

            <ul className="text-sm text-selene-white-dim space-y-2 mb-8 text-left max-w-sm mx-auto">
              <li className="flex gap-2"><span className="text-selene-gold">✓</span> {totalLessons} lecciones + evaluaciones</li>
              {course.certification && <li className="flex gap-2"><span className="text-selene-gold">✓</span> Certificado verificable</li>}
              <li className="flex gap-2"><span className="text-selene-gold">✓</span> Acceso de por vida + actualizaciones</li>
              {isMaster && <li className="flex gap-2"><span className="text-selene-gold">✓</span> 3 casos prácticos supervisados</li>}
              {isMaster && <li className="flex gap-2"><span className="text-selene-gold">✓</span> Guía legal y fiscal completa</li>}
            </ul>

            <Link
              href={isFree ? '/auth?redirect=/dashboard' : `/auth?redirect=/curso/${id}`}
              className="inline-block px-10 py-4 rounded-full bg-selene-gold text-selene-bg font-semibold text-base hover:bg-selene-gold/90 transition-all shadow-lg shadow-selene-gold/20"
            >
              {isFree ? 'Empezar gratis →' : 'Empezar ahora →'}
            </Link>
          </div>

          <p className="text-xs text-selene-white-dim/50">
            ¿Preguntas? Escríbenos a <a href="mailto:info@selenaura.com" className="text-selene-gold/60 hover:text-selene-gold">info@selenaura.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
