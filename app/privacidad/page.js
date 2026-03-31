import Link from 'next/link';

export const metadata = {
  title: 'Politica de Privacidad — Selene Academia',
  description: 'Politica de privacidad y proteccion de datos de Selene Academia.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-selene-gold-dim text-sm hover:text-selene-gold no-underline">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-selene-gold mt-8 mb-2">Politica de Privacidad</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 30 de marzo de 2026</p>

        <div className="space-y-8 text-selene-white-dim leading-relaxed text-[15px]">

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">1. Responsable del tratamiento</h2>
            <ul className="list-none mt-3 space-y-2 pl-4 border-l-2 border-selene-border">
              <li><strong className="text-selene-white">Responsable:</strong> Selene Academia</li>
              <li><strong className="text-selene-white">Contacto:</strong> info@selenaura.com</li>
              <li><strong className="text-selene-white">Finalidad:</strong> Gestion de la relacion con alumnos, prestacion de servicios formativos y comunicaciones relacionadas</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos unicamente los datos necesarios para la prestacion del servicio:</p>
            <div className="mt-4 space-y-4">
              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <h3 className="text-selene-white font-medium mb-2">Datos de registro</h3>
                <p>Nombre, direccion de correo electronico. Proporcionados voluntariamente al crear una cuenta o al registrarse con Google.</p>
              </div>
              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <h3 className="text-selene-white font-medium mb-2">Datos de pago</h3>
                <p>Los datos de pago (tarjeta, datos bancarios) son gestionados directamente por Stripe Inc., nuestro proveedor de pagos. Selene Academia no almacena ni tiene acceso a los datos completos de tu tarjeta.</p>
              </div>
              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <h3 className="text-selene-white font-medium mb-2">Datos de uso</h3>
                <p>Progreso en los cursos, lecciones completadas y certificados obtenidos, con el fin de ofrecerte una experiencia formativa personalizada.</p>
              </div>
              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <h3 className="text-selene-white font-medium mb-2">Datos de navegacion</h3>
                <p>Datos anonimos recopilados mediante cookies tecnicas y de analisis (ver <Link href="/cookies" className="text-selene-gold-dim hover:text-selene-gold no-underline">Politica de Cookies</Link>).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">3. Base legal del tratamiento</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-selene-white">Ejecucion de contrato:</strong> tratamos tus datos para gestionar tu matriculacion, darte acceso a los cursos y emitir certificados (art. 6.1.b RGPD).</li>
              <li><strong className="text-selene-white">Consentimiento:</strong> para el envio de comunicaciones comerciales y newsletters (art. 6.1.a RGPD). Puedes retirar el consentimiento en cualquier momento.</li>
              <li><strong className="text-selene-white">Obligacion legal:</strong> para el cumplimiento de obligaciones fiscales y tributarias (art. 6.1.c RGPD).</li>
              <li><strong className="text-selene-white">Interes legitimo:</strong> para la mejora del servicio y la prevencion del fraude (art. 6.1.f RGPD).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">4. Destinatarios de los datos</h2>
            <p>Tus datos podran ser comunicados a los siguientes terceros, unicamente en la medida necesaria para la prestacion del servicio:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-selene-white">Supabase Inc.</strong> — Alojamiento de la base de datos y autenticacion (servidores en la UE).</li>
              <li><strong className="text-selene-white">Stripe Inc.</strong> — Procesamiento de pagos. Cumple con PCI-DSS nivel 1.</li>
              <li><strong className="text-selene-white">Vercel Inc.</strong> — Alojamiento del sitio web.</li>
              <li><strong className="text-selene-white">Brevo (Sendinblue)</strong> — Envio de correos electronicos transaccionales y comerciales.</li>
              <li><strong className="text-selene-white">Google LLC</strong> — Autenticacion OAuth (si eliges registrarte con Google).</li>
            </ul>
            <p className="mt-3">
              No vendemos, alquilamos ni compartimos tus datos personales con terceros
              para fines publicitarios ajenos a Selene Academia.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">5. Transferencias internacionales</h2>
            <p>
              Algunos de nuestros proveedores tienen sede en Estados Unidos (Stripe, Vercel).
              Estas transferencias se realizan al amparo de las Clausulas Contractuales Tipo
              de la Comision Europea y/o del Marco de Privacidad de Datos UE-EE.UU. (EU-US Data Privacy Framework).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">6. Conservacion de datos</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-selene-white">Datos de cuenta:</strong> mientras mantengas tu cuenta activa. Puedes solicitar su eliminacion en cualquier momento.</li>
              <li><strong className="text-selene-white">Datos de facturacion:</strong> conservados durante el plazo legal exigido por la normativa fiscal espanola (4 anos).</li>
              <li><strong className="text-selene-white">Datos de progreso:</strong> mientras mantengas tu cuenta activa.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">7. Tus derechos</h2>
            <p>De conformidad con el RGPD y la LOPDGDD, puedes ejercer los siguientes derechos:</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { right: 'Acceso', desc: 'Conocer que datos tratamos sobre ti' },
                { right: 'Rectificacion', desc: 'Corregir datos inexactos' },
                { right: 'Supresion', desc: 'Solicitar la eliminacion de tus datos' },
                { right: 'Oposicion', desc: 'Oponerte a determinados tratamientos' },
                { right: 'Limitacion', desc: 'Solicitar la limitacion del tratamiento' },
                { right: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado' },
              ].map(({ right, desc }) => (
                <div key={right} className="bg-selene-card rounded-lg p-3 border border-selene-border">
                  <p className="text-selene-white font-medium text-sm">{right}</p>
                  <p className="text-xs mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Para ejercer cualquiera de estos derechos, escribe a <strong className="text-selene-gold-dim">info@selenaura.com</strong> indicando
              el derecho que deseas ejercer y adjuntando copia de tu documento de identidad.
              Responderemos en un plazo maximo de 30 dias.
            </p>
            <p className="mt-3">
              Si consideras que tus derechos no han sido atendidos correctamente, puedes
              presentar una reclamacion ante la <strong className="text-selene-white">Agencia Espanola de Proteccion
              de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">www.aepd.es</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">8. Seguridad</h2>
            <p>
              Adoptamos medidas tecnicas y organizativas adecuadas para proteger tus datos
              personales: cifrado en transito (HTTPS/TLS), autenticacion segura, acceso
              restringido a datos personales y proveedores que cumplen con estandares
              de seguridad reconocidos (SOC 2, PCI-DSS).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">9. Menores de edad</h2>
            <p>
              Los servicios de Selene Academia estan dirigidos a personas mayores de 16 anos.
              No recopilamos conscientemente datos de menores de 16 anos. Si eres padre, madre
              o tutor legal y crees que un menor ha proporcionado datos personales, contacta
              con nosotros en info@selenaura.com para que procedamos a su eliminacion.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-selene-border text-sm text-selene-white-dim/50">
          <p>Otras paginas legales:</p>
          <div className="flex gap-4 mt-2">
            <Link href="/legal" className="text-selene-gold-dim hover:text-selene-gold no-underline">Aviso Legal</Link>
            <Link href="/cookies" className="text-selene-gold-dim hover:text-selene-gold no-underline">Cookies</Link>
            <Link href="/condiciones" className="text-selene-gold-dim hover:text-selene-gold no-underline">Condiciones de venta</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
