import { Navbar, Footer } from '@/components/ui';

export const metadata = {
  title: 'Aviso Legal | Selene Academia',
  description: 'Aviso legal y condiciones de uso de Selene Academia por SelenaUra.',
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-selene-bg text-selene-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-selene-gold mb-2">Aviso Legal</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 5 de abril de 2026</p>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">1. Datos identificativos del titular</h2>
          <p className="text-selene-white-dim leading-relaxed mb-2">
            En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
            Informacion y de Comercio Electronico (LSSI-CE), se informa al usuario de los siguientes datos:
          </p>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Nombre comercial:</strong> SelenaUra</li>
            <li><strong className="text-selene-white">Dominio:</strong> academy.selenaura.com</li>
            <li><strong className="text-selene-white">Correo electronico:</strong> info@selenaura.com</li>
            <li><strong className="text-selene-white">Pais:</strong> Espana</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">2. Actividad</h2>
          <p className="text-selene-white-dim leading-relaxed">
            SelenaUra opera la plataforma Selene Academia, dedicada a la formacion online en desarrollo personal
            y consciencia. Ofrecemos cursos, lecturas y recursos formativos en disciplinas como tarot, astrologia,
            quiromancia, interpretacion de suenos y numerologia, siempre desde un enfoque que integra base
            cientifica y tradicion simbolica.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">3. Propiedad intelectual e industrial</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Todos los contenidos del sitio web, incluyendo a titulo enunciativo pero no limitativo textos, imagenes,
            graficos, logotipos, iconos, software, materiales audiovisuales y diseno grafico, son propiedad de
            SelenaUra o de sus licenciantes, y estan protegidos por las leyes espanolas e internacionales de
            propiedad intelectual e industrial. Queda prohibida su reproduccion, distribucion, comunicacion publica
            o transformacion sin autorizacion expresa y por escrito de SelenaUra.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">4. Condiciones de uso</h2>
          <p className="text-selene-white-dim leading-relaxed">
            El usuario se compromete a utilizar el sitio web y sus servicios de conformidad con la ley, la moral,
            el orden publico y las presentes condiciones. Se compromete a no utilizar los contenidos con fines
            ilicitos, lesivos de derechos de terceros o que puedan danar, inutilizar o deteriorar el sitio web.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">5. Limitacion de responsabilidad</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            SelenaUra no se hace responsable de:
          </p>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li>Errores u omisiones en los contenidos del sitio web.</li>
            <li>Danos derivados del uso o imposibilidad de uso del sitio.</li>
            <li>Interrupciones del servicio por causas tecnicas, de fuerza mayor o ajenas a su control.</li>
            <li>Contenidos de sitios web de terceros a los que se pueda acceder desde enlaces en esta pagina.</li>
            <li>Los resultados individuales que cada usuario obtenga de la aplicacion de los conocimientos adquiridos.</li>
          </ul>
          <p className="text-selene-white-dim leading-relaxed mt-3">
            Los contenidos formativos de Selene Academia tienen caracter educativo y de desarrollo personal.
            No sustituyen el asesoramiento profesional en salud, psicologia u otros ambitos regulados.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">6. Enlaces a terceros</h2>
          <p className="text-selene-white-dim leading-relaxed">
            El sitio web puede contener enlaces a paginas de terceros. SelenaUra no asume responsabilidad por
            los contenidos, politicas de privacidad o practicas de dichos sitios externos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">7. Legislacion aplicable y jurisdiccion</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Las presentes condiciones se rigen por la legislacion espanola. Para la resolucion de cualquier
            controversia derivada del uso de este sitio web, las partes se someten expresamente a los Juzgados
            y Tribunales de Castellon de la Plana (Espana), con renuncia a cualquier otro fuero que pudiera
            corresponderles, salvo que la normativa aplicable imponga un fuero distinto.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">8. Contacto</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros
            en <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
