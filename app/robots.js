export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/perfil/', '/onboarding/', '/api/'],
      },
    ],
    sitemap: 'https://academia.selenaura.com/sitemap.xml',
  };
}
