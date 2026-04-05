import { COURSES } from '@/lib/constants';

export async function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const course = COURSES.find((c) => c.id === params.id);
  if (!course) {
    return { title: 'Curso no encontrado — Selene Academia' };
  }

  const price = course.price > 0 ? `€${(course.price / 100).toFixed(2)}` : 'Gratis';

  return {
    title: `${course.title} — Selene Academia`,
    description: `${course.subtitle}. ${course.description?.slice(0, 120) || ''} ${course.level} · ${course.hours} · ${course.modules} módulos.`,
    openGraph: {
      title: `${course.title} — ${price}`,
      description: course.subtitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} — Selene Academia`,
      description: course.subtitle,
    },
  };
}

export default function CourseLayout({ children, params }) {
  const course = COURSES.find((c) => c.id === params.id);

  // Course JSON-LD schema for Google rich snippets
  const courseSchema = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description || course.subtitle,
        provider: {
          '@type': 'Organization',
          name: 'Selene Academia',
          url: 'https://academy.selenaura.com',
        },
        educationalLevel: course.level,
        numberOfCredits: course.modules,
        timeRequired: `PT${parseInt(course.hours) || 2}H`,
        inLanguage: 'es',
        isAccessibleForFree: course.price === 0,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: course.hours,
        },
        ...(course.price > 0 && {
          offers: {
            '@type': 'Offer',
            price: (course.price / 100).toFixed(2),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `https://academy.selenaura.com/curso/${course.id}`,
          },
        }),
      }
    : null;

  return (
    <>
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      {children}
    </>
  );
}
