import { COURSES } from '@/lib/constants';

const BASE_URL = 'https://academia.selenaura.com';

export default function sitemap() {
  const courseUrls = COURSES.map((course) => ({
    url: `${BASE_URL}/curso/${course.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/auth`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...courseUrls,
  ];
}
