import { Navbar, Footer } from '@/components/ui';

export const metadata = {
  title: 'Política de Cookies | Selene Academia',
  description: 'Política de cookies de Selene Academia por SelenaUra.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-selene-bg text-selene-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-selene-gold mb-2">Política de Cookies</h1>
        <p className="text-selene-white-dim text-sm mb-10">Última actualización: 5 de abril de 2026</p>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">1. Qué son las cookies</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un
            sitio web. Permiten que el sitio recuerde tus preferencias, mantenga tu sesión iniciada y recopile
            información sobre cómo utilizas la página para mejorar tu experiencia.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">2. Base legal</h2>
          <p className="text-selene-white-dim leading-relaxed">
            El uso de cookies se rige por el artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la
            Información y de Comercio Electrónico (LSSI-CE) y por el Reglamento General de Protección de Datos (RGPD).
            Las cookies esenciales se instalan en base al interés legítimo para el correcto funcionamiento del sitio.
            Las cookies analíticas y de marketing requieren tu consentimiento previo.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">3. Tipos de cookies que utilizamos</h2>

          <div className="mb-6">
            <h3 className="font-display text-lg text-selene-white mb-2">Cookies esenciales (sin consentimiento)</h3>
            <p className="text-selene-white-dim leading-relaxed mb-3">
              Son necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-selene-white-dim border border-selene-border">
                <thead>
                  <tr className="bg-selene-elevated">
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Cookie</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Proveedor</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Finalidad</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-selene-border">
                    <td className="px-4 py-2">sb-access-token</td>
                    <td className="px-4 py-2">Supabase</td>
                    <td className="px-4 py-2">Token de acceso para autenticación</td>
                    <td className="px-4 py-2">Sesión</td>
                  </tr>
                  <tr className="border-b border-selene-border">
                    <td className="px-4 py-2">sb-refresh-token</td>
                    <td className="px-4 py-2">Supabase</td>
                    <td className="px-4 py-2">Token de renovación de sesión</td>
                    <td className="px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">cookie_consent</td>
                    <td className="px-4 py-2">SelenaUra</td>
                    <td className="px-4 py-2">Almacena tu elección sobre cookies</td>
                    <td className="px-4 py-2">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-display text-lg text-selene-white mb-2">Cookies analíticas (con consentimiento)</h3>
            <p className="text-selene-white-dim leading-relaxed mb-3">
              Nos ayudan a entender cómo los usuarios interactúan con la plataforma para mejorar el servicio.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-selene-white-dim border border-selene-border">
                <thead>
                  <tr className="bg-selene-elevated">
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Cookie</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Proveedor</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Finalidad</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-selene-border">
                    <td className="px-4 py-2">_vercel_insights</td>
                    <td className="px-4 py-2">Vercel Analytics</td>
                    <td className="px-4 py-2">Análisis de rendimiento y uso del sitio</td>
                    <td className="px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">_ga, _ga_*</td>
                    <td className="px-4 py-2">Google Analytics (GA4)</td>
                    <td className="px-4 py-2">Análisis de tráfico y comportamiento de usuarios</td>
                    <td className="px-4 py-2">2 años</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-selene-white mb-2">Cookies de marketing (con consentimiento)</h3>
            <p className="text-selene-white-dim leading-relaxed mb-3">
              Permiten medir la eficacia de nuestras campañas publicitarias y mostrar contenido relevante.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-selene-white-dim border border-selene-border">
                <thead>
                  <tr className="bg-selene-elevated">
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Cookie</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Proveedor</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Finalidad</th>
                    <th className="px-4 py-2 text-left text-selene-white border-b border-selene-border">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">_fbp, _fbc</td>
                    <td className="px-4 py-2">Meta Pixel (Facebook)</td>
                    <td className="px-4 py-2">Seguimiento de conversiones publicitarias</td>
                    <td className="px-4 py-2">90 días</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">4. Cómo gestionar las cookies</h2>
          <p className="text-selene-white-dim leading-relaxed mb-4">
            Puedes configurar tu navegador para rechazar o eliminar cookies. A continuación te indicamos cómo
            hacerlo en los navegadores más comunes:
          </p>
          <ul className="text-selene-white-dim leading-relaxed list-disc pl-6 space-y-2">
            <li>
              <strong className="text-selene-white">Google Chrome:</strong> Configuración &rarr; Privacidad y seguridad &rarr;
              Cookies y otros datos de sitios. Más información en{' '}
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
                support.google.com
              </a>.
            </li>
            <li>
              <strong className="text-selene-white">Mozilla Firefox:</strong> Opciones &rarr; Privacidad y seguridad &rarr;
              Cookies y datos del sitio. Más información en{' '}
              <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
                support.mozilla.org
              </a>.
            </li>
            <li>
              <strong className="text-selene-white">Safari:</strong> Preferencias &rarr; Privacidad &rarr; Gestionar datos de sitios web.
              Más información en{' '}
              <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
                support.apple.com
              </a>.
            </li>
            <li>
              <strong className="text-selene-white">Microsoft Edge:</strong> Configuración &rarr; Privacidad, búsqueda y servicios &rarr;
              Cookies y permisos del sitio. Más información en{' '}
              <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-selene-gold hover:underline">
                support.microsoft.com
              </a>.
            </li>
          </ul>
          <p className="text-selene-white-dim leading-relaxed mt-4">
            Ten en cuenta que deshabilitar las cookies esenciales puede afectar al funcionamiento de la plataforma,
            incluyendo la imposibilidad de iniciar sesión.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl text-selene-gold mb-3">5. Contacto</h2>
          <p className="text-selene-white-dim leading-relaxed">
            Si tienes cualquier duda sobre nuestra política de cookies, puedes escribirnos a{' '}
            <a href="mailto:info@selenaura.com" className="text-selene-gold hover:underline">info@selenaura.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
