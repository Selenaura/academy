import { Navbar, Footer } from '@/components/ui';

export const metadata = {
  title: 'Politica de Privacidad | Selene Academia',
  description: 'Politica de privacidad de Selene Academia por SelenaUra. RGPD y LOPD-GDD.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-selene-bg text-selene-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-selene-gold mb-2">Politica de Privacidad</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 5 de abril de 2026</p>

        <p className="text-selene-white-dim leading-relaxed mb-10">
          En SelenaUra nos comprometemos a proteger tu privacidad. Esta politica explica como recogemos, usamos
          y protegemos tus datos personales de acuerdo con el Reglamento General de Proteccion de Datos (RGPD)
          y la Ley Organica 3/2018 de Proteccion de Datos Personales y garantia de los derechos digitales (LOPD-GDD).
        </p>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">1. Responsable del tratamiento</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Identidad:</strong> SelenaUra</li>
            <li><strong className="text-selene-white">Correo electronico:</strong> info@selenaura.com</li>
            <li><strong className="text-selene-white">Sitio web:</strong> academy.selenaura.com</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">2. Datos personales que recogemos</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">Segun el servicio utilizado, podemos recoger:</p>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Datos de cuenta:</strong> nombre, direccion de correo electronico.</li>
            <li><strong className="text-selene-white">Datos de personalizacion:</strong> fecha de nacimiento, hora de nacimiento, ciudad de nacimiento (para generar tu carta natal y personalizar la experiencia formativa).</li>
            <li><strong className="text-selene-white">Datos de navegacion:</strong> direccion IP, tipo de navegador, paginas visitadas, tiempo de permanencia.</li>
            <li><strong className="text-selene-white">Datos de pago:</strong> procesados integramente por Stripe. SelenaUra no almacena datos de tarjeta de credito ni informacion financiera sensible.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">3. Finalidad del tratamiento</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li>Gestion de tu cuenta de usuario y acceso a la plataforma.</li>
            <li>Personalizacion de tu experiencia formativa mediante tu carta natal.</li>
            <li>Procesamiento de compras y gestion de pagos.</li>
            <li>Envio de comunicaciones comerciales y newsletters (solo con tu consentimiento previo).</li>
            <li>Mejora del servicio y analisis de uso de la plataforma.</li>
            <li>Cumplimiento de obligaciones legales y fiscales.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">4. Base legal del tratamiento</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Consentimiento (art. 6.1.a RGPD):</strong> para el envio de comunicaciones comerciales y el uso de cookies no esenciales.</li>
            <li><strong className="text-selene-white">Ejecucion contractual (art. 6.1.b RGPD):</strong> para la gestion de la cuenta, acceso a cursos y procesamiento de pagos.</li>
            <li><strong className="text-selene-white">Interes legitimo (art. 6.1.f RGPD):</strong> para la mejora del servicio, prevencion de fraude y seguridad de la plataforma.</li>
            <li><strong className="text-selene-white">Obligacion legal (art. 6.1.c RGPD):</strong> para el cumplimiento de obligaciones fiscales y contables.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">5. Destinatarios de los datos</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            Tus datos pueden ser comunicados a los siguientes prestadores de servicios, que actuan como
            encargados del tratamiento:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-selene-white-dim border border-selene-border">
              <thead>
                <tr className="bg-selene-elevated">
                  <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Proveedor</th>
                  <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Funcion</th>
                  <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Pais</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-selene-border">
                  <td className="px-4 py-2">Supabase</td>
                  <td className="px-4 py-2">Autenticacion e infraestructura de base de datos</td>
                  <td className="px-4 py-2">EE.UU.</td>
                </tr>
                <tr className="border-b border-selene-border">
                  <td className="px-4 py-2">Stripe</td>
                  <td className="px-4 py-2">Procesamiento de pagos</td>
                  <td className="px-4 py-2">EE.UU.</td>
                </tr>
                <tr className="border-b border-selene-border">
                  <td className="px-4 py-2">Brevo (Sendinblue)</td>
                  <td className="px-4 py-2">Email marketing y comunicaciones</td>
                  <td className="px-4 py-2">Francia / UE</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Vercel</td>
                  <td className="px-4 py-2">Alojamiento web</td>
                  <td className="px-4 py-2">EE.UU.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">6. Transferencias internacionales</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Algunos de nuestros proveedores tienen sede en Estados Unidos. Estas transferencias internacionales
            se realizan al amparo de clausulas contractuales tipo aprobadas por la Comision Europea (art. 46.2.c RGPD)
            y, en su caso, del Marco de Privacidad de Datos UE-EE.UU. (EU-US Data Privacy Framework). Puedes
            solicitar copia de las garantias adecuadas escribiendo a info@selenaura.com.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">7. Plazos de conservacion</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Datos de cuenta:</strong> mientras se mantenga la relacion contractual y durante el plazo necesario para atender posibles responsabilidades legales.</li>
            <li><strong className="text-selene-white">Datos fiscales y de facturacion:</strong> 5 anos (art. 70 Ley General Tributaria).</li>
            <li><strong className="text-selene-white">Datos de navegacion y cookies:</strong> segun lo indicado en nuestra Politica de Cookies.</li>
            <li><strong className="text-selene-white">Comunicaciones comerciales:</strong> hasta que revoques tu consentimiento.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">8. Tus derechos</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            De acuerdo con el RGPD y la LOPD-GDD, tienes derecho a:
          </p>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li><strong className="text-selene-white">Acceso:</strong> conocer que datos personales tratamos sobre ti.</li>
            <li><strong className="text-selene-white">Rectificacion:</strong> solicitar la correccion de datos inexactos o incompletos.</li>
            <li><strong className="text-selene-white">Supresion:</strong> solicitar la eliminacion de tus datos cuando ya no sean necesarios.</li>
            <li><strong className="text-selene-white">Limitacion:</strong> solicitar que limitemos el tratamiento en determinadas circunstancias.</li>
            <li><strong className="text-selene-white">Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso comun.</li>
            <li><strong className="text-selene-white">Oposicion:</strong> oponerte al tratamiento de tus datos, incluida la elaboracion de perfiles.</li>
          </ul>
          <p className="text-selene-white-dim leading-relaxed mt-3">
            Para ejercer estos derechos, escribe a{' '}
            <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>{' '}
            indicando tu nombre, correo electronico asociado a la cuenta y el derecho que deseas ejercer.
            Responderemos en un plazo maximo de 30 dias.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">9. Delegado de Proteccion de Datos</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Puedes contactar con el responsable de proteccion de datos en{' '}
            <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">10. Derecho a reclamar</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Si consideras que el tratamiento de tus datos personales vulnera tus derechos, puedes presentar
            una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD) a traves de su sede
            electronica:{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
              www.aepd.es
            </a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">11. Modificaciones</h2>
          <p className="text-selene-white-dim leading-relaxed">
            SelenaUra se reserva el derecho de modificar esta politica de privacidad para adaptarla a novedades
            legislativas o jurisprudenciales. Cualquier cambio sera publicado en esta pagina con la fecha de
            actualizacion correspondiente.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
