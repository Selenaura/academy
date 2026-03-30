import './globals.css';
import Script from 'next/script';
import ChatWidget from '../components/ChatWidget';

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
        {/* Meta Pixel — set NEXT_PUBLIC_META_PIXEL_ID in Vercel env vars */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">{`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}</Script>
            <noscript>
              <img height="1" width="1" style={{display:'none'}}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt="" />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
