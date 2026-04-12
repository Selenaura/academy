import { Navbar, Footer, MoonIcon, StarIcon, CheckIcon, BookIcon, CertIcon, GoldDivider } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';
import Link from 'next/link';

export const metadata = {
  title: 'Sobre Nosotros — Selene Academia',
  description: 'Nuestra mision: hacer accesible el autoconocimiento profundo, respaldado por neurociencia y estudios peer-reviewed.',
};

export default function SobreNosotros() {
  return (
    <>
      <SchemaMarkup data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Sobre Nosotros — Selene Academia',
        description: 'Nuestra mision: hacer accesible el autoconocimiento profundo, respaldado por ciencia.',
        url: 'https://academy.selenaura.com/sobre-nosotros',
        mainEntity: {
          '@type': 'Organization',
          name: 'Selene Academia',
          url: 'https://academy.selenaura.com',
        },
      }} />

      <Navbar />

      <main className="min-h-screen bg-selene-bg">
        {/* Hero */}
        <section className="relative px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
          <MoonIcon size={48} className="text-selene-gold mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-selene-white mb-6 leading-tight">
            Nuestra mision
          </h1>
          <p className="text-lg md:text-xl text-selene-white-dim leading-relaxed max-w-2xl mx-auto">
            Hacer accesible el autoconocimiento profundo, respaldado por neurociencia
            y estudios peer-reviewed. Porque entenderte no deberia ser un privilegio,
            sino un derecho.
          </p>
          <GoldDivider className="mt-10" />
        </section>

        {/* Story */}
        <section className="px-6 py-16 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-medium text-selene-gold mb-6">
            Nuestra historia
          </h2>
          <div className="space-y-4 text-selene-white-dim leading-relaxed">
            <p>
              Selene Academia nacio de una idea simple pero poderosa: la sabiduria ancestral
              y la neurociencia moderna no son opuestas, sino complementarias. Lo que antiguas
              tradiciones intuian sobre la mente humana, la ciencia contemporanea lo esta
              confirmando con estudios rigurosos.
            </p>
            <p>
              Fundada en Espana, servimos a todo el mundo hispanohablante. Creemos que el
              autoconocimiento profundo — saber quien eres, como funcionas, que necesitas —
              es la base de una vida plena y consciente.
            </p>
            <p>
              Cada curso que creamos pasa por un proceso de investigación donde cruzamos
              fuentes académicas con tradición milenaria, para que cada lección tenga tanto
              rigor como alma.
            </p>
          </div>
        </section>

        {/* Approach */}
        <section className="px-6 py-16 bg-selene-card/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-medium text-selene-gold mb-10 text-center">
              Nuestro enfoque
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <BookIcon size={28} className="text-selene-gold" />,
                  title: 'Base científica',
                  desc: 'Cada curso cita estudios peer-reviewed. No pedimos fe ciega: ofrecemos evidencia que puedes verificar.',
                },
                {
                  icon: <StarIcon size={28} className="text-selene-gold" />,
                  title: 'Aprendizaje multiformato',
                  desc: 'Texto, presentaciones, PDFs descargables y ejercicios prácticos. Aprendes como mejor te funcione.',
                },
                {
                  icon: <MoonIcon size={28} className="text-selene-gold" />,
                  title: 'Personalización por carta natal',
                  desc: 'Tu carta natal guía tu experiencia de aprendizaje, haciendo cada lección relevante para ti.',
                },
                {
                  icon: <CertIcon size={28} className="text-selene-gold" />,
                  title: 'Certificados verificables',
                  desc: 'Al completar un curso, recibes un certificado con código único que cualquier persona puede verificar online.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-selene-card border border-selene-border rounded-2xl p-6">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="font-display text-lg font-medium text-selene-white mb-2">{item.title}</h3>
                  <p className="text-sm text-selene-white-dim leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl font-medium text-selene-gold mb-10">
            En numeros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10', label: 'Cursos' },
              { number: '200+', label: 'Lecciones' },
              { number: '30+', label: 'Estudios citados' },
              { number: '6', label: 'Certificaciones' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-display text-3xl md:text-4xl font-bold text-selene-gold">{stat.number}</div>
                <div className="text-sm text-selene-white-dim mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="px-6 py-16 bg-selene-card/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-selene-gold mb-10">
              Nuestros valores
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                {
                  title: 'Rigor',
                  desc: 'Cada afirmacion se respalda con fuentes verificables. Si la ciencia no lo avala, lo decimos.',
                },
                {
                  title: 'Accesibilidad',
                  desc: 'Conocimiento profundo explicado con claridad, sin jerga innecesaria, a un precio justo.',
                },
                {
                  title: 'Personalizacion',
                  desc: 'No hay dos personas iguales. Tu camino de aprendizaje se adapta a tu carta natal y a tu ritmo.',
                },
                {
                  title: 'Comunidad',
                  desc: 'Aprender es mejor en compania. Fomentamos el intercambio respetuoso entre estudiantes.',
                },
              ].map((value, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckIcon size={20} className="text-selene-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-base font-medium text-selene-white mb-1">{value.title}</h3>
                    <p className="text-sm text-selene-white-dim leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 text-center">
          <GoldDivider className="mb-8" />
          <h2 className="font-display text-2xl md:text-3xl font-medium text-selene-white mb-4">
            Empieza tu camino
          </h2>
          <p className="text-selene-white-dim mb-8 max-w-md mx-auto">
            Descubre quien eres con herramientas milenarias respaldadas por ciencia moderna.
          </p>
          <Link
            href="/auth?mode=register"
            className="inline-block bg-selene-gold text-selene-bg font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition no-underline"
          >
            Crear cuenta gratis
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
