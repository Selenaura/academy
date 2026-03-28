'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BackIcon } from '@/components/ui';

const FAQ_SECTIONS = [
  {
    title: 'Sobre los cursos',
    icon: '📚',
    questions: [
      {
        q: '¿Qué formato tienen las lecciones?',
        a: 'Cada lección incluye texto explicativo con base científica, diapositivas interactivas, ejercicios prácticos (matching, flip cards, escenarios, mapas conceptuales) y evaluaciones. Todo está diseñado para que aprendas a tu ritmo desde cualquier dispositivo.',
      },
      {
        q: '¿Cuánto tiempo tengo para completar un curso?',
        a: 'El acceso es ilimitado. Una vez inscrita, puedes completar el curso a tu ritmo. No hay fechas límite. Tu progreso se guarda automáticamente.',
      },
      {
        q: '¿Necesito conocimientos previos?',
        a: 'Los cursos de Nivel 1 (Tarot Intuitivo, Astrología Natal, Magnetismo Consciente) no requieren experiencia previa. Los cursos de certificación y el Máster sí requieren haber completado cursos previos.',
      },
      {
        q: '¿Los cursos tienen base científica?',
        a: 'Sí. Cada módulo integra referencias a estudios peer-reviewed en neurociencia, psicología junguiana, cronobiología y otras disciplinas. La ciencia valida, la intuición guía.',
      },
    ],
  },
  {
    title: 'Máster en Guía Espiritual Profesional',
    icon: '👑',
    questions: [
      {
        q: '¿Qué incluye el Máster?',
        a: '12 módulos, 80 horas de formación, 7 casos prácticos detallados, 3 sesiones supervisadas, módulos de marca personal, modelo de negocio, marketing, legalidad (alta como profesional, facturación, RGPD), y un plan de lanzamiento de 90 días. Al completarlo recibes el certificado de Guía Profesional Certificada Selene y tu perfil en el Directorio Profesional.',
      },
      {
        q: '¿Cuáles son los requisitos?',
        a: 'Necesitas haber completado al menos 2 certificaciones Selene (Tarot Intuitivo, Astrología Natal, Interpretación de Sueños o Quirología). Esto garantiza que tienes la base técnica necesaria.',
      },
      {
        q: '¿Puedo vivir de esto?',
        a: 'Sí. El módulo 9 incluye datos reales del sector: profesionales espirituales cobran entre €40-180 por sesión. Con 2-3 sesiones semanales, puedes generar €1.200+/mes. El Máster incluye guía legal completa para darte de alta como profesional.',
      },
      {
        q: '¿Qué es el Directorio Profesional?',
        a: 'Es una página pública en selenaura.com/profesionales donde apareces como guía certificada con tu perfil, especialidades, ubicación y enlace a tus redes. Los visitantes de SelenaUra pueden encontrarte directamente.',
      },
    ],
  },
  {
    title: 'Certificaciones',
    icon: '🎓',
    questions: [
      {
        q: '¿Los certificados son reconocidos?',
        a: 'Los certificados de SelenaUra son verificables digitalmente en selenaura.com/verificar con un código único. Cada certificado incluye tu nombre completo, el curso completado, y la fecha de emisión.',
      },
      {
        q: '¿Cómo verifico mi certificado?',
        a: 'Ve a selenaura.com/verificar e introduce tu código de certificado (formato SEL-2026-XXXX-XXXXXX). Cualquier persona puede verificar la autenticidad de tu certificación.',
      },
      {
        q: '¿Puedo compartir mi certificado?',
        a: 'Sí. Puedes descargar tu certificado como imagen y compartirlo en redes sociales, LinkedIn, o tu web profesional. También puedes compartir el enlace de verificación directamente.',
      },
    ],
  },
  {
    title: 'Pagos y facturación',
    icon: '💳',
    questions: [
      {
        q: '¿Qué métodos de pago aceptáis?',
        a: 'Aceptamos tarjeta de crédito/débito (Visa, Mastercard, American Express) y métodos locales según tu país. Todos los pagos se procesan de forma segura a través de Stripe.',
      },
      {
        q: '¿Puedo pagar en cuotas?',
        a: 'Sí. El Máster ofrece la opción de pago en 3 cuotas de €50/mes. Los cursos individuales se pagan en un único pago.',
      },
      {
        q: '¿Emitís factura?',
        a: 'Sí. Cada compra genera automáticamente una factura con IVA que recibes por email. Si necesitas datos fiscales específicos, puedes introducir tu NIF/CIF durante el proceso de pago.',
      },
      {
        q: '¿Cuál es la política de devolución?',
        a: 'Ofrecemos 14 días de garantía de devolución sin preguntas en todos los cursos y en el Máster. Si no estás satisfecha, contacta a hola@selenaura.com y te reembolsamos íntegramente.',
      },
    ],
  },
  {
    title: 'Cuenta y soporte',
    icon: '🔧',
    questions: [
      {
        q: '¿Cómo accedo a mis cursos?',
        a: 'Inicia sesión en selenaura.com y ve a tu Dashboard. Allí verás todos tus cursos activos con tu progreso. Haz clic en cualquier curso para continuar donde lo dejaste.',
      },
      {
        q: '¿Puedo cambiar mi email o contraseña?',
        a: 'Sí. Ve a tu Perfil desde el Dashboard y actualiza tus datos personales, email o contraseña.',
      },
      {
        q: '¿Cómo contacto con soporte?',
        a: 'Puedes usar el botón de Selene (la luna dorada en la esquina inferior derecha) para consultas rápidas, o escribirnos a hola@selenaura.com para temas que requieran atención personalizada.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-selene-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:text-selene-gold transition"
      >
        <span className="text-[14px] text-selene-white font-medium pr-4">{q}</span>
        <span className="text-selene-white-dim text-sm shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-4 px-1 text-[13px] text-selene-white-dim leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-selene-bg">
      <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
        <Link href="/dashboard" className="text-selene-white-dim hover:text-selene-white">
          <BackIcon />
        </Link>
        <span className="text-sm font-medium text-selene-white">Centro de ayuda</span>
      </nav>

      <div className="max-w-[700px] mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-selene-white mb-3">Centro de ayuda</h1>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto">
            Encuentra respuestas a las preguntas más frecuentes. Si necesitas ayuda personalizada,
            usa el botón de Selene <span className="text-selene-gold">☾</span> en la esquina inferior derecha.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <Link href="/catalogo" className="bg-selene-card border border-selene-border rounded-xl p-4 text-center hover:border-selene-gold/30 transition">
            <span className="text-2xl block mb-2">📚</span>
            <span className="text-xs text-selene-white-dim">Ver cursos</span>
          </Link>
          <Link href="/dashboard" className="bg-selene-card border border-selene-border rounded-xl p-4 text-center hover:border-selene-gold/30 transition">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-xs text-selene-white-dim">Mi progreso</span>
          </Link>
          <Link href="/verificar" className="bg-selene-card border border-selene-border rounded-xl p-4 text-center hover:border-selene-gold/30 transition">
            <span className="text-2xl block mb-2">🎓</span>
            <span className="text-xs text-selene-white-dim">Verificar certificado</span>
          </Link>
        </div>

        {/* FAQ sections */}
        <div className="space-y-8">
          {FAQ_SECTIONS.map((section, i) => (
            <div key={i} className="bg-selene-card border border-selene-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-selene-border/50">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-selene-white">
                  <span>{section.icon}</span>
                  {section.title}
                </h2>
              </div>
              <div className="px-5">
                {section.questions.map((faq, j) => (
                  <FAQItem key={j} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center bg-selene-card border border-selene-gold/20 rounded-xl p-8">
          <div className="text-3xl mb-3">☾</div>
          <h3 className="font-display text-lg text-selene-gold mb-2">¿No encuentras lo que buscas?</h3>
          <p className="text-sm text-selene-white-dim mb-4">
            Habla directamente con Selene usando el botón dorado de la esquina inferior derecha,
            o escríbenos a:
          </p>
          <a href="mailto:hola@selenaura.com" className="text-selene-gold hover:underline text-sm font-medium">
            hola@selenaura.com
          </a>
        </div>
      </div>
    </div>
  );
}
