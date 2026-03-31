import Link from 'next/link';

export const metadata = {
  title: 'Condiciones de Venta — Selene Academia',
  description: 'Condiciones generales de contratacion y venta de Selene Academia.',
};

export default function CondicionesPage() {
  return (
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-selene-gold-dim text-sm hover:text-selene-gold no-underline">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-selene-gold mt-8 mb-2">Condiciones de Venta</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 30 de marzo de 2026</p>

        <div className="space-y-8 text-selene-white-dim leading-relaxed text-[15px]">

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">1. Ambito de aplicacion</h2>
            <p>
              Las presentes condiciones generales regulan la contratacion de cursos y programas
              formativos ofrecidos por Selene Academia a traves del sitio web academy.selenaura.com.
            </p>
            <p className="mt-3">
              Al realizar una compra, el usuario declara ser mayor de 16 anos y acepta
              integramente estas condiciones.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">2. Descripcion del servicio</h2>
            <p>
              Selene Academia ofrece formacion online no reglada en formato de cursos digitales.
              Cada curso incluye lecciones en texto, diapositivas interactivas, ejercicios
              practicos y evaluaciones, accesibles a traves de la plataforma web.
            </p>
            <p className="mt-3">
              <strong className="text-selene-white">Importante:</strong> Los diplomas y certificados
              expedidos por Selene Academia son titulos propios y no conducen a la obtencion
              de un titulo con validez oficial reconocido por el Ministerio de Educacion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">3. Precios e impuestos</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Los precios se muestran en euros (EUR) e incluyen el IVA aplicable (21%).</li>
              <li>Los precios en otras monedas (USD, MXN, GBP, AUD) son orientativos y pueden variar segun el tipo de cambio en el momento de la transaccion.</li>
              <li>Selene Academia se reserva el derecho de modificar los precios en cualquier momento. Los cambios no afectaran a las compras ya realizadas.</li>
              <li>Cuando se ofrecen pagos a plazos, el precio total y el numero de cuotas se indican antes de la compra.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">4. Proceso de compra</h2>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              <li>El usuario selecciona el curso deseado y hace clic en el boton de inscripcion.</li>
              <li>Se le redirige a la pasarela de pago segura (Stripe) para completar la transaccion.</li>
              <li>Una vez confirmado el pago, el usuario recibe acceso inmediato al contenido del curso.</li>
              <li>Se envia un correo electronico de confirmacion a la direccion asociada a la cuenta.</li>
            </ol>
            <p className="mt-3">
              El contrato se entiende perfeccionado en el momento en que el usuario recibe
              la confirmacion de la matriculacion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">5. Acceso al contenido</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>El acceso a los cursos adquiridos es <strong className="text-selene-white">ilimitado en el tiempo</strong> mientras la plataforma este operativa.</li>
              <li>El acceso es personal e intransferible. Cada cuenta es para uso individual.</li>
              <li>Queda prohibida la descarga, copia, redistribucion o reventa del material formativo.</li>
              <li>Selene Academia se reserva el derecho de suspender el acceso en caso de incumplimiento de estas condiciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">6. Cursos gratuitos</h2>
            <p>
              Algunos cursos se ofrecen de forma gratuita. La inscripcion requiere crear
              una cuenta pero no implica ningun compromiso de pago. Las presentes condiciones
              se aplican igualmente al uso del contenido gratuito en lo relativo a propiedad
              intelectual, uso personal y responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">7. Derecho de desistimiento</h2>
            <div className="bg-selene-card rounded-lg p-4 border border-selene-border mt-3">
              <p>
                De conformidad con el articulo 103.m) del Real Decreto Legislativo 1/2007
                (Ley General para la Defensa de los Consumidores y Usuarios), el derecho
                de desistimiento <strong className="text-selene-white">no sera aplicable</strong> al
                suministro de contenido digital que no se preste en un soporte material
                cuando la ejecucion haya comenzado con el previo consentimiento expreso
                del consumidor.
              </p>
              <p className="mt-3">
                Al completar la compra de un curso, el usuario acepta expresamente que
                el acceso al contenido digital se active de inmediato y reconoce que,
                al hacerlo, pierde su derecho de desistimiento.
              </p>
            </div>
            <p className="mt-4">
              <strong className="text-selene-white">Excepciones:</strong> Si por causas tecnicas
              ajenas al usuario este no pudiera acceder al contenido adquirido tras la compra,
              y el problema no se resuelve en un plazo razonable (72 horas), el usuario podra
              solicitar el reembolso integro escribiendo a info@selenaura.com.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">8. Certificados</h2>
            <p>
              Al completar un curso y superar las evaluaciones correspondientes, el alumno
              puede obtener un certificado digital emitido por Selene Academia. Este certificado:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Acredita las horas de formacion y competencias adquiridas.</li>
              <li>Es un titulo propio de formacion no reglada.</li>
              <li>No tiene validez academica oficial.</li>
              <li>Tiene valor curricular y profesional en el ambito privado.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">9. Metodos de pago</h2>
            <p>
              Los pagos se procesan de forma segura a traves de <strong className="text-selene-white">Stripe</strong>,
              que cumple con los estandares PCI-DSS nivel 1. Se aceptan:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Tarjetas de credito y debito (Visa, Mastercard, American Express)</li>
              <li>Google Pay y Apple Pay</li>
              <li>Otros metodos locales segun disponibilidad de Stripe en cada pais</li>
            </ul>
            <p className="mt-3">
              Selene Academia no almacena ni tiene acceso a los datos completos de
              tu tarjeta de pago.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">10. Responsabilidad</h2>
            <p>
              El contenido de los cursos tiene caracter educativo y orientativo. No sustituye
              el asesoramiento profesional medico, psicologico, legal o financiero. Selene
              Academia no se responsabiliza del uso que el alumno haga de los conocimientos
              adquiridos ni de los resultados profesionales derivados de la formacion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">11. Resolucion de conflictos</h2>
            <p>
              Ante cualquier reclamacion, el usuario puede contactar con info@selenaura.com.
              Nos comprometemos a responder en un plazo maximo de 30 dias.
            </p>
            <p className="mt-3">
              Adicionalmente, la Comision Europea ofrece una plataforma de resolucion
              de litigios en linea accesible en:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-selene-gold-dim hover:text-selene-gold no-underline"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">12. Legislacion aplicable</h2>
            <p>
              Estas condiciones se rigen por la legislacion espanola. Para la resolucion de
              controversias, seran competentes los juzgados y tribunales del domicilio del
              consumidor, de conformidad con la normativa vigente.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-selene-border text-sm text-selene-white-dim/50">
          <p>Otras paginas legales:</p>
          <div className="flex gap-4 mt-2">
            <Link href="/legal" className="text-selene-gold-dim hover:text-selene-gold no-underline">Aviso Legal</Link>
            <Link href="/privacidad" className="text-selene-gold-dim hover:text-selene-gold no-underline">Privacidad</Link>
            <Link href="/cookies" className="text-selene-gold-dim hover:text-selene-gold no-underline">Cookies</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
