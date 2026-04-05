import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';

export const metadata = {
  title: 'Pagina no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="text-[72px] mb-6">🌙</div>
        <h1 className="font-display text-4xl text-selene-white mb-4 text-center">
          Pagina no encontrada
        </h1>
        <p className="text-selene-white-dim text-center max-w-md mb-10 leading-relaxed">
          Las estrellas no nos han guiado hasta aqui. Quiza el curso que buscas
          ha cambiado de nombre o ya no esta disponible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/catalogo"
            className="bg-selene-gold text-selene-bg font-semibold text-sm px-6 py-3 rounded-xl hover:brightness-110 text-center no-underline"
          >
            Ver catalogo de cursos
          </Link>
          <Link
            href="/"
            className="border border-selene-gold/30 text-selene-gold font-semibold text-sm px-6 py-3 rounded-xl hover:bg-selene-gold/10 text-center no-underline"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
