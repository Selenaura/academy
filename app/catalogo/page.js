import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export const metadata = {
  title: 'Catálogo de cursos — Selene Academia',
  description: 'Explora todos los cursos de astrología, meditación y autoconocimiento con base científica. Desde principiante hasta guía profesional certificada.',
};

export default function CatalogoPage() {
  // Group courses by level
  const levels = [
    { label: 'Nivel 0 — Principiante', filter: c => c.level === 'Nivel 0' },
    { label: 'Nivel 1 — Fundamentos', filter: c => c.level === 'Nivel 1' },
    { label: 'Nivel 2 — Intermedio', filter: c => c.level === 'Nivel 2' },
    { label: 'Nivel 3 — Avanzado', filter: c => c.level === 'Nivel 3' },
  ];

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar />

      <section className="px-6 pt-20 pb-8 text-center">
        <h1 className="font-display text-[clamp(28px,5vw,44px)] font-normal text-gradient-gold mb-3">
          Catálogo formativo
        </h1>
        <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-2">
          {COURSES.length} cursos · De principiante a guía profesional certificada
        </p>
        <GoldDivider />
      </section>

      <section className="px-6 pb-20 max-w-[960px] mx-auto">
        {levels.map(level => {
          const courses = COURSES.filter(level.filter);
          if (courses.length === 0) return null;
          return (
            <div key={level.label} className="mb-12">
              <h2 className="font-display text-lg text-selene-white mb-4 pl-1">{level.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                  <Link key={course.id} href={`/catalogo/${course.id}`} className="no-underline">
                    <Card hover className="p-5 h-full">
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
                        <span>{course.hours}</span>
                        <span>·</span>
                        <span>{course.modules} módulos</span>
                        <span>·</span>
                        <span>{course.lessons.length} lecciones</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div className="text-center mt-8">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center text-[15px] font-semibold bg-selene-gold text-selene-bg px-10 py-4 rounded-xl hover:brightness-110 transition no-underline"
          >
            Crear mi cuenta gratis
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
