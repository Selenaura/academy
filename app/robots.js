export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/curso/', '/dashboard/', '/perfil/', '/onboarding/', '/admin/', '/analytics/', '/unsubscribe/'],
      },
    ],
    sitemap: 'https://academy.selenaura.com/sitemap.xml',
  };
}
