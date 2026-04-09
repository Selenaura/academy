export default function manifest() {
  return {
    name: 'Selene Academia — Tu escuela de consciencia cósmica',
    short_name: 'Selene Academia',
    description: 'Cursos de astrología, tarot y autoconocimiento con base científica.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0E1A',
    theme_color: '#D4A843',
    orientation: 'portrait',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
    categories: ['education', 'lifestyle'],
    lang: 'es',
  }
}
