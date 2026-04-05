import './globals.css';
import { WhatsAppButton } from '@/components/ui';
import InstallPWA from '@/components/InstallPWA';

export const metadata = {
  title: {
    default: 'Selene Academia — Tu escuela de consciencia cósmica',
    template: '%s — Selene Academia',
  },
  description: 'Cursos de astrología, tarot, meditación y autoconocimiento respaldados por estudios peer-reviewed. Neurociencia + tradición milenaria. Certificados verificables.',
  metadataBase: new URL('https://academia.selenaura.com'),
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
  },
  verification: {
    // Reemplaza con tu código real de Google Search Console
    // google: 'tu-codigo-de-verificacion',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
          url: 'https://academia.selenaura.com',
          logo: 'https://academia.selenaura.com/icon.svg',
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
          url: 'https://academia.selenaura.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://academia.selenaura.com/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }} />
      </head>
      <body className="bg-selene-bg text-selene-white antialiased">
        {children}
        <WhatsAppButton />
        <InstallPWA />
      </body>
    </html>
  );
}
