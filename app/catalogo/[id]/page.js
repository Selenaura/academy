import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return COURSES.map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const course = COURSES.find(c => c.id === params.id);
  if (!course) return {};
  return {
    title: `${course.title} — Selene Academia`,
    description: course.subtitle,
  };
}

export default function CursoDetallePage({ params }) {
  const course = COURSES.find(c => c.id === params.id);
  if (!course) notFound();

  // Group lessons by module
  const modules = {};
  course.lessons.forEach(lesson => {
    const m = lesson.module || 1;
    if (!modules[m]) modules[m] = [];
    modules[m].push(lesson);
  });

  const totalLessons = course.lessons.filter(l => l.type === 'lesson' || l.type === 'video').length;
  const totalQuizzes = course.lessons.filter(l => l.type === 'quiz').length;
  const hasExam = course.lessons.some(l => l.type === 'exam');

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-20 pb-10 max-w-[720px] mx-auto">
        <Link href="/catalogo" className="text-xs text-selene-white-dim hover:text-selene-gold no-underline mb-6 inline-block">
          ← Volver al catálogo
        </Link>

        <div className="flex items-start gap-4 mb-6">
          <span className="text-[48px]">{course.icon}</span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                style={{
                  color: course.price === 0 ? '#5BB88F' : '#C9A84C',
                  background: course.price === 0 ? 'rgba(91,184,143,0.1)' : 'rgba(201,168,76,0.1)',
                }}
              >
                {course.price_label}
              </span>
              <span className="text-[11px] text-selene-white-dim">{course.level}</span>
            </div>
            <h1 className="font-display text-[28px] font-normal text-selene-white leading-tight">{course.title}</h1>
          </div>
        </div>

        <p className="text-[15px] text-selene-white-dim leading-relaxed mb-6">{course.subtitle}</p>

        {course.description && (
          <p className="text-sm text-selene-white-dim leading-relaxed mb-6">{course.description}</p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-selene-gold">{course.hours}</div>
            <div className="text-[11px] text-selene-white-dim">Duración</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-selene-gold">{course.modules}</div>
            <div className="text-[11px] text-selene-white-dim">Módulos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-selene-gold">{totalLessons}</div>
            <div className="text-[11px] text-selene-white-dim">Lecciones</div>
          </div>
          {totalQuizzes > 0 && (
            <div className="text-center">
              <div className="text-lg font-semibold text-selene-gold">{totalQuizzes}</div>
              <div className="text-[11px] text-selene-white-dim">Quizzes</div>
            </div>
          )}
          {hasExam && (
            <div className="text-center">
              <div className="text-lg font-semibold text-selene-gold">🎓</div>
              <div className="text-[11px] text-selene-white-dim">Certificado</div>
            </div>
          )}
        </div>

        {/* Science badge */}
        {course.science && (
          <div className="bg-selene-blue/5 rounded-xl p-4 border border-selene-blue/10 mb-6">
            <div className="text-xs font-semibold text-selene-blue-light mb-1">🔬 Base científica</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.science}</div>
          </div>
        )}

        {/* For whom */}
        {course.for_whom && (
          <div className="bg-selene-gold/5 rounded-xl p-4 border border-selene-gold/10 mb-6">
            <div className="text-xs font-semibold text-selene-gold mb-1">¿Para quién es?</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.for_whom}</div>
          </div>
        )}

        {/* Outcome */}
        {course.outcome && (
          <div className="bg-selene-success/5 rounded-xl p-4 border border-selene-success/10 mb-8">
            <div className="text-xs font-semibold text-selene-success mb-1">Al terminar sabrás</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.outcome}</div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={course.price === 0 ? '/auth?mode=register' : '/auth?mode=register'}
          className="block w-full text-center text-[15px] font-semibold bg-selene-gold text-selene-bg py-3.5 rounded-xl hover:brightness-110 transition no-underline mb-8"
        >
          {course.price === 0 ? 'Empezar gratis' : `Inscribirme — ${course.price_label}`}
        </Link>

        <GoldDivider />
      </section>

      {/* Course content */}
      <section className="px-6 pb-20 max-w-[720px] mx-auto">
        <h2 className="font-display text-xl font-normal text-selene-white mb-6">Contenido del curso</h2>

        {Object.entries(modules).map(([moduleNum, lessons]) => (
          <div key={moduleNum} className="mb-6">
            <div className="text-xs font-semibold text-selene-gold mb-3 uppercase tracking-wider">
              Módulo {moduleNum}
            </div>
            <Card className="divide-y divide-selene-border">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-selene-elevated flex items-center justify-center shrink-0">
                    {lesson.type === 'quiz' ? <span className="text-[10px]">📝</span> :
                     lesson.type === 'exam' ? <span className="text-[10px]">🎓</span> :
                     <span className="text-[10px] text-selene-white-dim">📖</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-selene-white truncate">{lesson.title}</div>
                  </div>
                  <div className="text-[11px] text-selene-white-dim shrink-0">{lesson.duration}</div>
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
          >
            {course.price === 0 ? 'Empezar gratis' : `Inscribirme — ${course.price_label}`}
          </Link>
          <p className="text-xs text-selene-white-dim mt-3">
            {course.price === 0 ? 'Sin tarjeta de crédito. Acceso inmediato.' : 'Acceso inmediato tras el pago. Sin suscripción.'}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
