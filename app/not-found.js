import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[72px] mb-4 opacity-60">🌑</div>
        <h1 className="font-display text-3xl text-selene-gold mb-3">Página no encontrada</h1>
        <p className="text-sm text-selene-white-dim mb-8 leading-relaxed">
          Esta página se ha perdido entre las estrellas. Vuelve al inicio para
          continuar tu camino.
        </p>
        <Link
          href="/"
          className="inline-block bg-selene-gold text-selene-bg font-semibold px-8 py-3.5 rounded-xl btn-gold-hover no-underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
