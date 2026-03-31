import Link from 'next/link';

export const metadata = {
  title: 'Politica de Cookies — Selene Academia',
  description: 'Politica de cookies de Selene Academia (academy.selenaura.com).',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-selene-bg text-selene-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-selene-gold-dim text-sm hover:text-selene-gold no-underline">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-selene-gold mt-8 mb-2">Politica de Cookies</h1>
        <p className="text-selene-white-dim text-sm mb-10">Ultima actualizacion: 30 de marzo de 2026</p>

        <div className="space-y-8 text-selene-white-dim leading-relaxed text-[15px]">

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">1. Que son las cookies</h2>
            <p>
              Las cookies son pequenos archivos de texto que los sitios web almacenan en tu
              navegador. Permiten recordar tus preferencias, mantener tu sesion iniciada
              y analizar el uso del sitio para mejorar la experiencia.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">2. Cookies que utilizamos</h2>

            <div className="space-y-4 mt-4">
              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-lg">●</span>
                  <h3 className="text-selene-white font-medium">Cookies estrictamente necesarias</h3>
                </div>
                <p className="text-sm">Imprescindibles para el funcionamiento del sitio. No se pueden desactivar.</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-selene-white-dim/60 border-b border-selene-border">
                        <th className="text-left py-2 pr-4">Cookie</th>
                        <th className="text-left py-2 pr-4">Proveedor</th>
                        <th className="text-left py-2 pr-4">Finalidad</th>
                        <th className="text-left py-2">Duracion</th>
                      </tr>
                    </thead>
                    <tbody className="text-selene-white-dim/80">
                      <tr className="border-b border-selene-border/30">
                        <td className="py-2 pr-4 font-mono">sb-*</td>
                        <td className="py-2 pr-4">Supabase</td>
                        <td className="py-2 pr-4">Sesion de usuario y autenticacion</td>
                        <td className="py-2">Sesion / 1 ano</td>
                      </tr>
                      <tr className="border-b border-selene-border/30">
                        <td className="py-2 pr-4 font-mono">__stripe_mid</td>
                        <td className="py-2 pr-4">Stripe</td>
                        <td className="py-2 pr-4">Prevencion de fraude en pagos</td>
                        <td className="py-2">1 ano</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">__stripe_sid</td>
                        <td className="py-2 pr-4">Stripe</td>
                        <td className="py-2 pr-4">Sesion de pago</td>
                        <td className="py-2">30 min</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-selene-card rounded-lg p-4 border border-selene-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-lg">●</span>
                  <h3 className="text-selene-white font-medium">Cookies de analisis</h3>
                </div>
                <p className="text-sm">Nos ayudan a entender como se usa el sitio para mejorarlo.</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-selene-white-dim/60 border-b border-selene-border">
                        <th className="text-left py-2 pr-4">Cookie</th>
                        <th className="text-left py-2 pr-4">Proveedor</th>
                        <th className="text-left py-2 pr-4">Finalidad</th>
                        <th className="text-left py-2">Duracion</th>
                      </tr>
                    </thead>
                    <tbody className="text-selene-white-dim/80">
                      <tr className="border-b border-selene-border/30">
                        <td className="py-2 pr-4 font-mono">_fbp</td>
                        <td className="py-2 pr-4">Meta Pixel</td>
                        <td className="py-2 pr-4">Seguimiento de conversiones y rendimiento publicitario</td>
                        <td className="py-2">90 dias</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">_fbc</td>
                        <td className="py-2 pr-4">Meta Pixel</td>
                        <td className="py-2 pr-4">Atribucion de clics desde anuncios</td>
                        <td className="py-2">90 dias</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">3. Cookies de terceros</h2>
            <p>
              Los siguientes servicios pueden establecer sus propias cookies cuando interactuas
              con sus funcionalidades integradas en nuestro sitio:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-selene-white">Stripe</strong> — procesamiento seguro de pagos (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">politica de privacidad</a>)</li>
              <li><strong className="text-selene-white">Supabase</strong> — autenticacion y base de datos (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">politica de privacidad</a>)</li>
              <li><strong className="text-selene-white">Meta (Facebook/Instagram)</strong> — pixel de seguimiento (<a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">politica de privacidad</a>)</li>
              <li><strong className="text-selene-white">Google</strong> — autenticacion OAuth (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">politica de privacidad</a>)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">4. Como gestionar las cookies</h2>
            <p>
              Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta
              que desactivar las cookies estrictamente necesarias puede afectar al funcionamiento
              del sitio (por ejemplo, no podras iniciar sesion ni realizar pagos).
            </p>
            <div className="mt-4 bg-selene-card rounded-lg p-4 border border-selene-border">
              <p className="text-sm font-medium text-selene-white mb-2">Instrucciones por navegador:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-selene-gold-dim hover:text-selene-gold no-underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">5. Base legal</h2>
            <p>
              El uso de cookies se ampara en las siguientes normas:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Reglamento (UE) 2016/679 (RGPD)</li>
              <li>Ley Organica 3/2018 (LOPDGDD)</li>
              <li>Ley 34/2002 (LSSI-CE), articulo 22.2</li>
              <li>Directrices de la AEPD sobre cookies (2023)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-selene-white mb-3">6. Actualizaciones</h2>
            <p>
              Esta politica de cookies puede actualizarse para reflejar cambios en los
              servicios utilizados o en la normativa aplicable. La fecha de la ultima
              actualizacion figura al inicio de esta pagina.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-selene-border text-sm text-selene-white-dim/50">
          <p>Otras paginas legales:</p>
          <div className="flex gap-4 mt-2">
            <Link href="/legal" className="text-selene-gold-dim hover:text-selene-gold no-underline">Aviso Legal</Link>
            <Link href="/privacidad" className="text-selene-gold-dim hover:text-selene-gold no-underline">Privacidad</Link>
            <Link href="/condiciones" className="text-selene-gold-dim hover:text-selene-gold no-underline">Condiciones de venta</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
