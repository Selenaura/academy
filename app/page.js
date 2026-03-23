import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export default function LandingPage() {
  const stats = [
    { value: String(COURSES.length), label: 'Cursos' },
    { value: '200+', label: 'Lecciones' },
    { value: '30+', label: 'Estudios citados' },
    { value: '7', label: 'Certificaciones' },
  ];

  const features = [
    { icon: '🔬', title: 'Base científica', desc: 'Cada curso cita estudios peer-reviewed. HeartMath, cronobiología, neuroplasticidad.' },
    { icon: '🎓', title: 'Certificaciones', desc: 'Completa cursos, supera evaluaciones y descarga tu certificado verificable.' },
    { icon: '🌙', title: 'Personalizado', desc: 'Tu carta natal guía tu ruta formativa. No hay dos caminos iguales.' },
    { icon: '📱', title: 'A tu ritmo', desc: 'Lecciones interactivas, quizzes, PDFs descargables, acceso 24/7 desde cualquier dispositivo.' },
  ];

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial-gold pointer-events-none" />
        <div className="absolute top-10 right-[10%] w-1 h-1 rounded-full bg-selene-gold shadow-[0_0_20px_rgba(201,168,76,0.4)] animate-pulse-gold" />
        <div className="absolute top-28 left-[15%] w-0.5 h-0.5 rounded-full bg-selene-blue-light shadow-[0_0_15px_rgba(107,143,197,0.4)] animate-pulse-gold" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="inline-block text-[11px] text-selene-gold font-semibold px-4 py-1.5 rounded-full border border-selene-gold/20 bg-selene-gold/5 mb-8 tracking-[0.1em] uppercase">
            ✦ Ciencia y consciencia de lo invisible ✦
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
              href="/auth?mode=login"
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

      {/* ── Features ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-3">¿Por qué Selene?</h2>
          <GoldDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-gradient-card rounded-2xl border border-selene-border p-6 text-center">
              <div className="text-[32px] mb-4">{f.icon}</div>
              <div className="text-[15px] font-semibold text-selene-white mb-2 font-display">{f.title}</div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Course Preview ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">Catálogo formativo</h2>
          <p className="text-sm text-selene-white-dim">De principiante a guía profesional certificada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COURSES.slice(0, 6).map(course => (
            <Card key={course.id} hover className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[28px]">{course.icon}</span>
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                  style={{
                    color: course.price === 0 ? '#5BB88F' : '#C9A84C',
                    background: course.price === 0 ? 'rgba(91,184,143,0.1)' : 'rgba(201,168,76,0.1)',
                  }}
                >
                  {course.price_label}
                </span>
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
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-selene-gold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
          >
            Ver los {COURSES.length} cursos completos →
          </Link>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="px-6 py-16 max-w-[700px] mx-auto text-center">
        <div className="bg-selene-card/50 rounded-2xl border border-selene-border p-8">
          <div className="text-selene-gold text-lg mb-4">✦</div>
          <p className="font-display text-lg text-selene-white italic leading-relaxed mb-4">
            &ldquo;No es otra escuela de astrología. Es la primera que te explica POR QUÉ funciona lo que funciona, con papers de verdad.&rdquo;
          </p>
          <div className="text-sm text-selene-white-dim">— Lo que queremos que digan nuestros alumnos</div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[28px] font-normal text-selene-white mb-4">
          Tu camino empieza aquí
        </h2>
        <p className="text-sm text-selene-white-dim mb-8 max-w-md mx-auto">
          Curso introductorio 100% gratuito. Sin tarjeta de crédito.
          Tu carta natal personaliza tu ruta.
        </p>
        <Link
          href="/auth?mode=register"
          className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
        >
          Crear mi cuenta gratis
        </Link>
      </section>

      <Footer />
    </div>
  );
}
