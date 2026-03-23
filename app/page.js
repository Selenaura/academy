import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export default function LandingPage() {
  const stats = [
    { value: '10', label: 'Cursos' },
    { value: '200+', label: 'Lecciones' },
    { value: '30+', label: 'Estudios citados' },
    { value: '6', label: 'Certificaciones' },
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

      {/* ── Course Preview ── */}
      <section className="px-6 py-16 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[28px] font-normal text-selene-white mb-2">Catálogo formativo</h2>
          <p className="text-sm text-selene-white-dim">De principiante a guía profesional certificada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COURSES.slice(0, 4).map(course => (
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
            Ver los 10 cursos completos →
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
