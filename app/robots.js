export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/perfil/', '/onboarding/', '/api/'],
      },
    ],
    sitemap: 'https://academy.selenaura.com/sitemap.xml',
  };
}
