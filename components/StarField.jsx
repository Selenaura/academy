/**
 * StarField — cielo sobre el pergamino.
 *
 * 32 estrellas distribuidas pseudoaleatoriamente en el viewport,
 * fixed background, mix-blend-darken para que aparezcan como puntos
 * de tinta sobre el cream sin sobreexponerse. Cada estrella titila
 * de forma desfasada (animation-delay distinto) para que el campo
 * lea como "vivo" pero sin caer en el tópico de "particles.js
 * starfield" SaaS.
 *
 * Sin JS — todo CSS. Posiciones fijas (semilla determinista) para
 * estabilidad visual entre cargas. La animación de twinkle es
 * 4 s ease-in-out con delays distribuidos 0-3.6 s para que nunca
 * dos estrellas brillen al unísono.
 *
 * Accesibilidad: respeta prefers-reduced-motion (estrellas estáticas).
 * z-index: 0 — detrás de todo el contenido editorial pero por encima
 * de body::before (paper noise) y body::after (vignette).
 */

const STARS = [
  // x%, y%, size px, delay s
  [4, 8, 1.4, 0], [12, 22, 0.8, 0.4], [22, 6, 1.0, 0.8], [32, 14, 1.2, 1.2],
  [42, 4, 0.6, 1.6], [55, 10, 1.6, 2.0], [68, 7, 1.0, 2.4], [78, 18, 1.3, 2.8],
  [88, 9, 0.8, 3.2], [96, 22, 1.4, 3.6], [3, 38, 1.0, 0.2], [18, 46, 0.7, 0.6],
  [28, 36, 1.2, 1.0], [44, 42, 1.5, 1.4], [60, 38, 0.9, 1.8], [72, 48, 1.1, 2.2],
  [85, 40, 1.3, 2.6], [94, 52, 0.8, 3.0], [8, 62, 1.2, 3.4], [20, 70, 0.9, 0.1],
  [34, 64, 1.4, 0.5], [48, 72, 1.1, 0.9], [62, 66, 0.7, 1.3], [76, 74, 1.3, 1.7],
  [90, 68, 1.0, 2.1], [6, 86, 1.2, 2.5], [22, 92, 0.8, 2.9], [40, 88, 1.5, 3.3],
  [54, 94, 1.0, 0.7], [70, 90, 1.1, 1.1], [82, 96, 0.9, 1.5], [97, 84, 1.3, 1.9],
];

export default function StarField() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: 'darken' }}
    >
      {STARS.map(([x, y, size, delay], i) => (
        <span
          key={i}
          className="absolute rounded-full starfield-twinkle"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'rgba(45, 31, 20, 0.55)',
            animationDelay: `${delay}s`,
            // Tiny "rays" via box-shadow — gives the star a 4-point
            // halo without needing an SVG. Subtle; you only see it
            // at peak twinkle.
            boxShadow:
              '0 0 4px 0.4px rgba(184,151,90,0.35), 0 0 8px 0.8px rgba(184,151,90,0.18)',
          }}
        />
      ))}
    </div>
  );
}
