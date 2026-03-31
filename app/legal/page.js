import Link from 'next/link';

export const metadata = {
  title: 'Aviso Legal — Selene Academia',
  description: 'Aviso legal y condiciones de uso de Selene Academia (academy.selenaura.com).',
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-selene-gold-dim text-sm hover:text-selene-gold no-underline">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-selene-gold mt-8 mb-2">Aviso Legal</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 30 de marzo de 2026</p>

        <div className="space-y-8 text-selene-white-dim leading-relaxed text-[15px]">

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">1. Datos identificativos</h2>
            <p>
              En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
              Sociedad de la Informacion y de Comercio Electronico (LSSI-CE), se informa al usuario
              de los datos del titular de este sitio web:
            </p>
            <ul className="list-none mt-4 space-y-2 pl-4 border-l-2 border-selene-border">
              <li><strong className="text-selene-white">Denominacion comercial:</strong> Selene Academia</li>
              <li><strong className="text-selene-white">Sitio web:</strong> academy.selenaura.com</li>
              <li><strong className="text-selene-white">Email de contacto:</strong> info@selenaura.com</li>
              <li><strong className="text-selene-white">Actividad:</strong> Formacion online no reglada en desarrollo personal y bienestar</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">2. Naturaleza de la formacion</h2>
            <p>
              Las ensenanzas impartidas por Selene Academia constituyen <strong className="text-selene-white">formacion
              no reglada</strong>. Los diplomas y certificados expedidos por este centro
              no conducen a la obtencion de un titulo con validez oficial reconocido por
              el Ministerio de Educacion y Formacion Profesional de Espana.
            </p>
            <p className="mt-3">
              Los certificados acreditan la realizacion y aprovechamiento de la formacion
              recibida, con indicacion de las horas lectivas y competencias adquiridas,
              y tienen valor curricular y profesional en el ambito privado.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">3. Objeto y ambito de aplicacion</h2>
            <p>
              El presente aviso legal regula el uso del sitio web academy.selenaura.com
              y de los subdominios asociados a SelenaUra. El acceso y uso de este sitio
              web atribuye la condicion de usuario e implica la aceptacion plena de todas
              las condiciones aqui publicadas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">4. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web — incluyendo textos, imagenes, disenos,
              graficos, logotipos, iconos, software, material formativo y audiovisual —
              estan protegidos por la legislacion espanola e internacional de propiedad
              intelectual e industrial.
            </p>
            <p className="mt-3">
              Queda prohibida la reproduccion, distribucion, comunicacion publica,
              transformacion o cualquier otra forma de explotacion de los contenidos
              sin autorizacion expresa y por escrito de Selene Academia.
            </p>
            <p className="mt-3">
              Los alumnos matriculados obtienen una licencia personal, intransferible
              y no exclusiva para acceder al material de los cursos adquiridos. Esta
              licencia no autoriza la redistribucion, reventa ni uso comercial del material.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">5. Responsabilidad</h2>
            <p>
              Selene Academia no garantiza la disponibilidad continua e ininterrumpida
              del sitio web, pudiendo producirse interrupciones por mantenimiento,
              actualizaciones o causas ajenas a nuestro control.
            </p>
            <p className="mt-3">
              La informacion proporcionada en los cursos tiene caracter educativo
              y orientativo. No sustituye en ningun caso el asesoramiento profesional
              medico, psicologico, legal o financiero. El usuario es responsable del
              uso que haga de los conocimientos adquiridos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">6. Enlaces externos</h2>
            <p>
              Este sitio web puede contener enlaces a paginas de terceros. Selene Academia
              no se responsabiliza del contenido, politicas de privacidad ni practicas de
              dichos sitios externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">7. Legislacion aplicable y jurisdiccion</h2>
            <p>
              Las presentes condiciones se rigen por la legislacion espanola. Para la
              resolucion de cualquier controversia derivada del uso de este sitio web,
              las partes se someten a los juzgados y tribunales del domicilio del usuario,
              de conformidad con la legislacion vigente en materia de consumidores y usuarios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">8. Modificaciones</h2>
            <p>
              Selene Academia se reserva el derecho de modificar el presente aviso legal
              en cualquier momento. Las modificaciones entraran en vigor desde su publicacion
              en este sitio web. Se recomienda revisar esta pagina periodicamente.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-selene-border text-sm text-selene-white-dim/50">
          <p>Otras paginas legales:</p>
          <div className="flex gap-4 mt-2">
            <Link href="/privacidad" className="text-selene-gold-dim hover:text-selene-gold no-underline">Privacidad</Link>
            <Link href="/cookies" className="text-selene-gold-dim hover:text-selene-gold no-underline">Cookies</Link>
            <Link href="/condiciones" className="text-selene-gold-dim hover:text-selene-gold no-underline">Condiciones de venta</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
