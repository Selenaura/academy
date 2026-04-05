export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/perfil/', '/onboarding/', '/admin/', '/analytics/', '/unsubscribe/'],
      },
    ],
    sitemap: 'https://academia.selenaura.com/sitemap.xml',
  };
}
