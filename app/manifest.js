export default function manifest() {
  return {
    name: 'Selene Academia — Tu escuela de consciencia cósmica',
    short_name: 'Selene Academia',
    description: 'Cursos de astrología, tarot y autoconocimiento con base científica.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0F',
    theme_color: '#C9A84C',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['education', 'lifestyle'],
    lang: 'es',
  }
}
