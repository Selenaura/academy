import { COURSES } from '@/lib/constants';

export default function sitemap() {
  const baseUrl = 'https://academia.selenaura.com';
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/auth`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sobre-nosotros`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/condiciones`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/verificar`, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic course pages
  const coursePages = COURSES.map((course) => ({
    url: `${baseUrl}/curso/${course.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...coursePages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
