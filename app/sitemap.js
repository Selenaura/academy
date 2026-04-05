import { COURSES } from '@/lib/constants';

export default function sitemap() {
  const baseUrl = 'https://academia.selenaura.com';
  const now = new Date();

  // Static public pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/master`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/auth`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sobre-nosotros`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ayuda`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/verificar`, changeFrequency: 'monthly', priority: 0.4 },

    // LATAM landing pages (SEO + Meta Ads)
    { url: `${baseUrl}/argentina`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/mexico`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hispanos`, changeFrequency: 'monthly', priority: 0.7 },

    // Legal pages
    { url: `${baseUrl}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/condiciones`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic course detail pages
  const coursePages = COURSES.map((course) => ({
    url: `${baseUrl}/curso/${course.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Public catalog detail pages (same courses, public view)
  const catalogPages = COURSES.map((course) => ({
    url: `${baseUrl}/catalogo/${course.id}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Program landing pages
  const programPages = COURSES
    .filter((c) => c.id === 'guia-profesional' || c.id === 'quirologia-master')
    .map((course) => ({
      url: `${baseUrl}/programa/${course.id}`,
      changeFrequency: 'monthly',
      priority: 0.85,
    }));

  return [...staticPages, ...coursePages, ...catalogPages, ...programPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
