import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0F',
        borderRadius: '25%',
      }}>
        <div style={{
          fontSize: 280,
          color: '#C9A84C',
          fontFamily: 'serif',
        }}>
          ☽
        </div>
      </div>
    ),
    { ...size }
  );
}
