import './globals.css';
import InstallPWA from '@/components/InstallPWA';

export const metadata = {
  title: {
    default: 'Selene Academia — Tu escuela de consciencia cósmica',
    template: '%s — Selene Academia',
  },
  description: 'Cursos de astrología, tarot, meditación y autoconocimiento respaldados por estudios peer-reviewed. Neurociencia + tradición milenaria. Certificados verificables.',
  metadataBase: new URL('https://academy.selenaura.com'),
  alternates: {
    canonical: '/',
    languages: { 'es': '/' },
  },
  openGraph: {
    title: 'Selene Academia — Ciencia y consciencia de lo invisible',
    description: 'Cursos de astrología, tarot y autoconocimiento con base científica. Tu carta natal guía tu camino.',
    siteName: 'Selene Academia',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selene Academia',
    description: 'Tu escuela de consciencia cósmica — neurociencia + tradición milenaria.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'vDNw7wez4SCnT41XvCEkyoJAz5-zFff4THJB7nLk9_4',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0A0A0F" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Selene Academia',
          url: 'https://academy.selenaura.com',
          logo: 'https://academy.selenaura.com/icon.svg',
          description: 'Cursos de astrologia, tarot y autoconocimiento con base cientifica.',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'info@selenaura.com',
            contactType: 'customer service',
            availableLanguage: 'Spanish'
          },
          sameAs: []
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Selene Academia',
          url: 'https://academy.selenaura.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://academy.selenaura.com/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }} />
      </head>
      <body className="bg-selene-bg text-selene-white antialiased">
        {children}
        <InstallPWA />
      </body>
    </html>
  );
}
