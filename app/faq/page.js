import { Navbar, Footer, GoldDivider } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';
import Link from 'next/link';

const faqs = [
  {
    q: '¿Qué es Selene Academia?',
    a: 'Selene Academia es una escuela 100% online de autoconocimiento que combina tradiciones milenarias (astrología, tarot, meditación) con neurociencia moderna y estudios peer-reviewed. Ofrecemos cursos estructurados, ejercicios prácticos y certificaciones verificables. Todo el contenido es digital: accedes desde cualquier dispositivo, en cualquier lugar del mundo, a tu ritmo.',
  },
  {
    q: '¿Los cursos son presenciales u online?',
    a: 'Todos nuestros cursos son 100% online. No hay clases presenciales ni horarios fijos. Accedes al contenido desde tu ordenador, tablet o móvil cuando quieras. Tienes acceso de por vida y puedes avanzar a tu ritmo desde cualquier país.',
  },
  {
    q: '¿Los cursos tienen base cientifica?',
    a: 'Si. Cada curso cita estudios academicos publicados en revistas peer-reviewed. No pedimos fe ciega: proporcionamos las fuentes para que puedas verificarlas por ti misma. Contamos con mas de 30 estudios citados a lo largo de nuestro catalogo.',
  },
  {
    q: '¿El certificado es oficial?',
    a: 'Nuestros certificados acreditan que has completado satisfactoriamente un programa formativo en Selene Academia. No son titulos universitarios oficiales, pero si certificaciones verificables con un codigo unico que cualquier persona o empresa puede comprobar en nuestra web.',
  },
  {
    q: '¿Puedo conseguir trabajo con este certificado?',
    a: 'Nuestros certificados demuestran competencias especificas en areas de autoconocimiento y bienestar. Son utiles para profesionales del coaching, terapias alternativas, desarrollo personal y bienestar. Muchas de nuestras alumnas han incorporado estos conocimientos a su practica profesional.',
  },
  {
    q: '¿Cuanto tiempo tengo acceso al curso?',
    a: 'Una vez comprado, tienes acceso de por vida al contenido del curso, incluyendo todas las actualizaciones futuras. Aprende a tu ritmo, sin prisas.',
  },
  {
    q: '¿Que pasa si no me gusta?',
    a: 'Ofrecemos una garantia de devolucion de 14 dias sin preguntas. Si el curso no cumple tus expectativas, te devolvemos el 100% de tu dinero. Sin letra pequena.',
  },
  {
    q: '¿Puedo pagar a plazos?',
    a: 'Si, ofrecemos facilidades de pago en cursos seleccionados. Puedes dividir el pago en cuotas mensuales sin intereses. Consulta las opciones disponibles en la pagina de cada curso.',
  },
  {
    q: '¿Necesito conocimientos previos?',
    a: 'No. Nuestros cursos estan disenados para todos los niveles. Cada programa empieza desde los fundamentos y avanza progresivamente. Si ya tienes experiencia, podras profundizar en aspectos que quizas no conocias.',
  },
  {
    q: '¿Como funciona la personalizacion por carta natal?',
    a: 'Al registrarte, puedes introducir tus datos de nacimiento. Con ellos calculamos tu carta natal, que se usa para personalizar ejemplos, ejercicios y recomendaciones dentro de los cursos. Es como tener un tutor que habla directamente de tu configuracion energetica.',
  },
  {
    q: '¿Hay comunidad o soporte?',
    a: 'Si. Contamos con soporte por email y WhatsApp para resolver dudas. Ademas, estamos construyendo espacios de comunidad para que las alumnas puedan compartir experiencias y aprendizajes.',
  },
  {
    q: '¿Puedo descargar el contenido?',
    a: 'Los materiales complementarios (PDFs, guias, plantillas) son descargables. El contenido principal de las lecciones esta disponible online para garantizar que siempre accedas a la version mas actualizada.',
  },
  {
    q: '¿En que formato estan las lecciones?',
    a: 'Las lecciones combinan texto explicativo, presentaciones visuales, PDFs descargables y ejercicios practicos. Creemos en el aprendizaje multiformato para que puedas estudiar como mejor te funcione. El audio se reserva exclusivamente para las meditaciones guiadas.',
  },
  {
    q: '¿Como verifico mi certificado?',
    a: 'Cada certificado tiene un codigo unico. Cualquier persona puede ir a academy.selenaura.com/verificar, introducir el codigo y confirmar la autenticidad del certificado, incluyendo el nombre del curso y la fecha de emision.',
  },
  {
    q: '¿Qué métodos de pago aceptáis?',
    a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay y Klarna (pago aplazado) a través de Stripe, una de las plataformas de pago más seguras del mundo. Tus datos financieros nunca pasan por nuestros servidores.',
  },
  {
    q: '¿Sois una universidad acreditada?',
    a: 'No, Selene Academia no es una universidad ni un centro de formacion reglada. Somos una escuela online independiente especializada en autoconocimiento con base cientifica. Nuestros certificados son certificados privados de aprovechamiento, no titulos oficiales ni academicos. Las disciplinas que impartimos (astrologia, tarot, meditacion) constituyen formacion especializada privada.',
  },
  {
    q: '¿Ofreceis factura?',
    a: 'Si, emitimos factura por todas las compras. Si necesitas factura con datos fiscales especificos (por ejemplo, para deduccion como formacion profesional), contactanos y te la preparamos.',
  },
  {
    q: '¿Puedo acceder desde Latinoamerica?',
    a: 'Si, nuestros cursos estan disponibles para todo el mundo hispanohablante. Los precios se muestran en euros y aceptamos tarjetas internacionales (Visa, Mastercard, American Express) a traves de Stripe. El contenido esta optimizado para cualquier zona horaria.',
  },
  {
    q: '¿Que diferencia a Selene de otras escuelas de astrologia o tarot?',
    a: 'Tres cosas: base cientifica (cada leccion cita estudios peer-reviewed), certificados verificables con codigo unico, y personalizacion por carta natal. No pedimos fe ciega: ofrecemos evidencia que puedes verificar por ti misma.',
  },
];

export const metadata = {
  title: 'Preguntas frecuentes — Selene Academia',
  description: 'Resolvemos tus dudas sobre cursos, certificados, metodos de pago, garantia de devolucion y mas.',
};

export default function FAQ() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return (
    <>
      <SchemaMarkup data={faqSchema} />

      <Navbar />

      <main className="min-h-screen bg-selene-bg">
        {/* Hero */}
        <section className="px-6 pt-20 pb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-selene-white mb-4">
            Preguntas frecuentes
          </h1>
          <p className="text-selene-white-dim max-w-xl mx-auto">
            Todo lo que necesitas saber sobre Selene Academia. Si no encuentras tu respuesta,
            escribenos por WhatsApp o email.
          </p>
          <GoldDivider className="mt-8" />
        </section>

        {/* FAQ Accordion */}
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-selene-card border border-selene-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-selene-white font-medium hover:text-selene-gold transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4">{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-selene-white-dim shrink-0 transition-transform group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-selene-white-dim leading-relaxed border-t border-selene-border/50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 text-center bg-selene-card/30">
          <h2 className="font-display text-xl font-medium text-selene-white mb-3">
            ¿Aun tienes dudas?
          </h2>
          <p className="text-selene-white-dim mb-6 text-sm">
            Escribenos y te respondemos en menos de 24 horas.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:info@selenaura.com"
              className="text-sm font-semibold bg-selene-gold text-selene-bg px-6 py-2.5 rounded-lg hover:brightness-110 no-underline"
            >
              Enviar email
            </a>
            <Link
              href="/auth?mode=register"
              className="text-sm font-semibold border border-selene-gold text-selene-gold px-6 py-2.5 rounded-lg hover:bg-selene-gold/10 no-underline"
            >
              Empezar gratis
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
