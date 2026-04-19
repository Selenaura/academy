import './globals.css';
import { Fraunces, Lora } from 'next/font/google';
import InstallPWA from '@/components/InstallPWA';

// Fraunces variable — same display font as selenaura-main. Loads with
// the three optical-feature axes (opsz / SOFT / WONK) so we can drive
// the editorial typography system from CSS variables.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-display',
  display: 'swap',
});

// Lora — refined serif body, pairs with Fraunces. Replaces the old
// sans Outfit which read as SaaS rather than editorial.
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

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
    <html lang="es" className={`${fraunces.variable} ${lora.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#FBF6EE" />
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
          description: 'Cursos de astrología, tarot y autoconocimiento con base científica.',
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
            target: 'https://academy.selenaura.com/catalogo?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }} />
      </head>
      <body
        className="antialiased"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--ink)',
        }}
      >
        {children}
        <InstallPWA />
      </body>
    </html>
  );
}
