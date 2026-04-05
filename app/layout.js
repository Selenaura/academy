import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ChatWidget from '../components/ChatWidget';
import CookieConsent from '../components/CookieConsent';
import AnalyticsLoader from '../components/AnalyticsLoader';
import ExitIntentPopup from '../components/ExitIntentPopup';

export const metadata = {
  title: 'Selene Academia — Tu escuela de consciencia cósmica',
  description: 'Cursos de astrología, tarot, meditación y autoconocimiento respaldados por estudios peer-reviewed. Neurociencia + tradición milenaria.',
  metadataBase: new URL('https://academy.selenaura.com'),
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body className="bg-selene-bg text-selene-white antialiased">
        {children}
        <ChatWidget />
        {/* Vercel Analytics — first-party, no PII, no consent needed */}
        <Analytics />
        {/* Vercel Speed Insights — first-party, no PII, no consent needed */}
        <SpeedInsights />
        {/* GA4 + Meta Pixel load conditionally via consent */}
        <AnalyticsLoader />
        {/* AEPD-compliant cookie consent banner */}
        <CookieConsent />
        {/* Exit-intent lead capture popup */}
        <ExitIntentPopup />
      </body>
    </html>
  );
}
