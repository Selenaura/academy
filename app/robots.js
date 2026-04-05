export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/perfil/', '/onboarding/'],
      },
    ],
    sitemap: 'https://academia.selenaura.com/sitemap.xml',
  };
}
