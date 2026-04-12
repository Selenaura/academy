import { Navbar, Footer } from '@/components/ui';

export const metadata = {
  title: 'Condiciones de Compra y Uso | Selene Academia',
  description: 'Condiciones generales de compra y uso de Selene Academia por SelenaUra.',
};

export default function CondicionesPage() {
  return (
    <div className="min-h-screen bg-selene-bg text-selene-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-selene-gold mb-2">Condiciones de Compra y Uso</h1>
        <p className="text-selene-white-dim text-sm mb-10">Última actualización: 5 de abril de 2026</p>

        <p className="text-selene-white-dim leading-relaxed mb-10">
          Las presentes condiciones regulan la compra y el uso de los servicios ofrecidos a través de
          Selene Academia (academy.selenaura.com), propiedad de SelenaUra. Al realizar una compra o
          utilizar la plataforma, aceptas íntegramente estas condiciones.
        </p>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">1. Objeto</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Selene Academia es una plataforma de formación online que ofrece acceso a cursos y lecturas
            espirituales en disciplinas como tarot, astrología, quiromancia, interpretación de sueños y
            numerología. Los contenidos combinan tradición simbólica con base científica y están orientados
            al desarrollo personal y la consciencia.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">2. Precios</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li>Todos los precios se muestran en euros e incluyen IVA.</li>
            <li>SelenaUra se reserva el derecho de modificar los precios en cualquier momento. El precio aplicable será el vigente en el momento de la compra.</li>
            <li>Las ofertas y descuentos tienen carácter temporal y se rigen por sus condiciones particulares.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">3. Proceso de compra</h2>
          <ol className="text-selene-white-dim leading-relaxed list-decimal pl-6 space-y-1">
            <li><strong className="text-selene-white">Selección:</strong> Elige el curso o servicio que deseas adquirir.</li>
            <li><strong className="text-selene-white">Checkout:</strong> Serás redirigido a la pasarela de pago segura de Stripe para completar la transacción.</li>
            <li><strong className="text-selene-white">Confirmación:</strong> Recibirás un correo electrónico de confirmación con los detalles de tu compra.</li>
            <li><strong className="text-selene-white">Acceso inmediato:</strong> Una vez confirmado el pago, tendrás acceso instantáneo al contenido adquirido desde tu panel de usuario.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">4. Métodos de pago</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Los pagos se procesan de forma segura a través de Stripe. Aceptamos tarjeta de crédito y débito
            (Visa, Mastercard, American Express). En determinados productos pueden estar disponibles opciones
            de pago fraccionado. SelenaUra no almacena en ningún caso los datos de tu tarjeta; estos son
            gestionados íntegramente por Stripe conforme a los estándares PCI DSS.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">5. Derecho de desistimiento</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            De acuerdo con el Real Decreto Legislativo 1/2007 por el que se aprueba el texto refundido de la
            Ley General para la Defensa de los Consumidores y Usuarios, dispones de un plazo de 14 días
            naturales desde la fecha de compra para ejercer tu derecho de desistimiento sin necesidad de
            justificación.
          </p>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            <strong className="text-selene-white">Excepción:</strong> Conforme al artículo 103.m) de dicha norma,
            el derecho de desistimiento no será aplicable cuando hayas accedido al contenido digital (cursos,
            lecciones, materiales) y hayas dado tu consentimiento expreso para la ejecución del contrato,
            perdiendo con ello el derecho de desistimiento.
          </p>
          <p className="text-selene-white-dim leading-relaxed">
            Para ejercer el desistimiento, escribe a{' '}
            <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>{' '}
            indicando tu nombre, correo de la cuenta y número de pedido. Tramitaremos el reembolso en un plazo
            máximo de 14 días desde la recepción de la solicitud.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">6. Acceso a los contenidos</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Una vez adquirido un curso o servicio, el acceso será ilimitado en el tiempo mientras la plataforma
            Selene Academia permanezca operativa. En caso de cierre o migración de la plataforma, se comunicará
            con al menos 30 días de antelación y se facilitará la descarga de los materiales adquiridos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">7. Certificados</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            Al completar un curso, podrás obtener un <strong className="text-selene-white">certificado privado de
            aprovechamiento</strong> emitido por SelenaUra. Estos certificados son verificables mediante un código CSV
            único a través de nuestra plataforma.
          </p>
          <p className="text-selene-white-dim leading-relaxed">
            Los certificados tienen carácter privado y <strong className="text-selene-white">no constituyen titulación oficial,
            académica ni universitaria</strong> reconocida por el sistema educativo español. No habilitan para el ejercicio
            de profesiones reguladas. Las disciplinas impartidas constituyen formación especializada privada en el ámbito
            del desarrollo personal y el autoconocimiento.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">8. Propiedad intelectual</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Todos los contenidos de los cursos (textos, imágenes, audios, videos, materiales descargables,
            presentaciones y cualquier otro recurso) son propiedad exclusiva de SelenaUra y están protegidos
            por la legislación de propiedad intelectual. Queda expresamente prohibida su reproducción,
            distribución, comunicación pública o puesta a disposición de terceros, total o parcial, sin
            autorización escrita de SelenaUra. El incumplimiento de esta prohibición podrá dar lugar a las
            acciones legales correspondientes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">9. Obligaciones del usuario</h2>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-1">
            <li>Usar la plataforma de forma responsable y conforme a la ley.</li>
            <li>No compartir sus credenciales de acceso con terceros.</li>
            <li>No copiar, grabar, distribuir ni comercializar los contenidos adquiridos.</li>
            <li>No utilizar la plataforma con fines ilícitos o que perjudiquen a otros usuarios.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">10. Limitación de responsabilidad</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Los contenidos de Selene Academia tienen carácter formativo y de desarrollo personal. SelenaUra no
            garantiza resultados concretos derivados de la aplicación de los conocimientos adquiridos. Los
            contenidos no sustituyen el asesoramiento profesional en salud, psicología u otros ámbitos regulados.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">11. Resolución de conflictos</h2>
          <p className="text-selene-white-dim leading-relaxed mb-3">
            Para cualquier controversia derivada de estas condiciones, las partes se someten a los Juzgados y
            Tribunales de Castellón de la Plana (España), salvo que la normativa aplicable imponga un fuero distinto.
          </p>
          <p className="text-selene-white-dim leading-relaxed">
            Asimismo, te informamos de que la Comisión Europea dispone de una plataforma de resolución de litigios
            en línea accesible en{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
              https://ec.europa.eu/consumers/odr
            </a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">12. Contacto</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Para cualquier consulta sobre estas condiciones, contacta con nosotros en{' '}
            <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
