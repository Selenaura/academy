import { COURSES } from '@/lib/constants';
import { BLOG_POSTS } from '@/lib/blog-posts';

export default function sitemap() {
  const baseUrl = 'https://academy.selenaura.com';
  const now = new Date();

  // Static public pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/master`, changeFrequency: 'weekly', priority: 0.9 },
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

  // Public catalog detail pages (indexable by Google)
  const catalogPages = COURSES.map((course) => ({
    url: `${baseUrl}/catalogo/${course.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // NOTE: /curso/{id} pages require authentication — excluded from sitemap
  // Google cannot index them and they show as "Discovered - not indexed"

  // Program landing pages
  const programPages = COURSES
    .filter((c) => c.id === 'guia-profesional' || c.id === 'quirologia-master')
    .map((course) => ({
      url: `${baseUrl}/programa/${course.id}`,
      changeFrequency: 'monthly',
      priority: 0.85,
    }));

  // Blog pages
  const blogIndex = [
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];
  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...catalogPages, ...programPages, ...blogIndex, ...blogPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
