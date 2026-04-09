import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Selene Academia — Tu escuela de consciencia cósmica';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0C0E1A 0%, #242845 50%, #1C1F38 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: '2px solid #9B8EC4',
            borderRadius: 16,
            display: 'flex',
          }}
        />

        {/* Moon icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          ☽
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            color: '#D4A843',
            marginBottom: 16,
            display: 'flex',
            letterSpacing: '0.02em',
          }}
        >
          Selene Academia
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#F0EDE4',
            opacity: 0.85,
            display: 'flex',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Tu escuela de consciencia cósmica
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 20,
            color: '#A8A4A0',
            display: 'flex',
          }}
        >
          Neurociencia + Tradición Milenaria · Cursos con certificado
        </div>
      </div>
    ),
    { ...size }
  );
}
