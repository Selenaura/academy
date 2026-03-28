/**
 * Email service using Brevo (formerly Sendinblue) API
 * Requires BREVO_API_KEY env variable
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const FROM = {
  name: 'Selene Academia',
  email: 'info@selenaura.com',
};

/**
 * Send an email via Brevo's transactional API
 */
async function sendEmail({ to, subject, htmlContent, textContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ BREVO_API_KEY not set — email not sent:', subject);
    return { success: false, reason: 'no_api_key' };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: FROM,
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo error:', res.status, err);
      return { success: false, reason: err };
    }

    const data = await res.json();
    console.log(`📧 Email sent to ${to}: ${subject} (messageId: ${data.messageId})`);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, reason: err.message };
  }
}

/**
 * Send welcome email after course purchase
 */
export async function sendWelcomeEmail({ email, courseName, courseId, userName }) {
  const dashboardUrl = 'https://academy.selenaura.com/dashboard';
  const courseUrl = `https://academy.selenaura.com/curso/${courseId}`;
  const programUrl = courseId === 'guia-profesional'
    ? 'https://academy.selenaura.com/programa/guia-profesional'
    : courseUrl;

  const subject = `¡Bienvenida al ${courseName}! Tu acceso está listo ✨`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding:30px 0 20px;">
              <div style="font-size:28px;margin-bottom:8px;">🌙</div>
              <h1 style="color:#d4a853;font-size:20px;font-weight:normal;margin:0;letter-spacing:1px;">
                SELENE ACADEMIA
              </h1>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div>
            </td>
          </tr>

          <!-- Welcome -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <h2 style="color:#ffffff;font-size:24px;font-weight:normal;margin:0 0 16px;">
                ¡Bienvenida${userName ? `, ${userName}` : ''}! ✨
              </h2>
              <p style="color:#b8b8c8;font-size:15px;line-height:1.7;margin:0;">
                Tu inscripción en <strong style="color:#d4a853;">${courseName}</strong> se ha completado con éxito.
                Ya tienes acceso completo a todo el contenido.
              </p>
            </td>
          </tr>

          <!-- Course info card -->
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="color:#d4a853;font-size:16px;font-weight:normal;margin:0 0 16px;">
                      📚 Tu curso incluye:
                    </h3>
                    ${courseId === 'guia-profesional' ? `
                    <ul style="color:#b8b8c8;font-size:14px;line-height:2;margin:0;padding-left:20px;">
                      <li>30 lecciones detalladas en 10 módulos</li>
                      <li>150 preguntas de evaluación con explicación</li>
                      <li>3 casos prácticos supervisados</li>
                      <li>Datos de pricing reales (España + LATAM)</li>
                      <li>Guía legal y fiscal completa</li>
                      <li>Certificado verificable con código CSV</li>
                      <li>Perfil premium en el directorio Selene</li>
                    </ul>
                    ` : `
                    <ul style="color:#b8b8c8;font-size:14px;line-height:2;margin:0;padding-left:20px;">
                      <li>Lecciones con contenido multimedia e interactivo</li>
                      <li>Evaluaciones por módulo</li>
                      <li>Certificado verificable al completar</li>
                      <li>Acceso de por vida + actualizaciones</li>
                    </ul>
                    `}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <a href="${courseUrl}"
                 style="display:inline-block;padding:14px 40px;background-color:#d4a853;color:#0a0a0f;font-size:15px;font-weight:bold;text-decoration:none;border-radius:30px;">
                Empezar ahora →
              </a>
            </td>
          </tr>

          <!-- Next steps -->
          <tr>
            <td style="padding:20px 40px;">
              <h3 style="color:#d4a853;font-size:14px;font-weight:normal;margin:0 0 12px;">
                Próximos pasos:
              </h3>
              <ol style="color:#b8b8c8;font-size:13px;line-height:2;margin:0;padding-left:20px;">
                <li>Accede a tu <a href="${dashboardUrl}" style="color:#d4a853;text-decoration:none;">panel de alumna</a></li>
                <li>Empieza por la primera lección del Módulo 1</li>
                <li>Completa cada evaluación para desbloquear badges</li>
                <li>Al terminar, descarga tu certificado verificable</li>
              </ol>
            </td>
          </tr>

          ${courseId === 'guia-profesional' ? `
          <!-- Program link -->
          <tr>
            <td style="padding:10px 40px 20px;text-align:center;">
              <a href="${programUrl}" style="color:#d4a853;font-size:13px;text-decoration:none;">
                📋 Ver el programa completo del Máster
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Gold divider -->
          <tr>
            <td style="padding:10px 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 40px;text-align:center;">
              <p style="color:#6a6a7a;font-size:12px;line-height:1.6;margin:0;">
                Selene Academia — Tu escuela de consciencia cósmica<br>
                <a href="https://academy.selenaura.com" style="color:#6a6a7a;">academy.selenaura.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@selenaura.com" style="color:#6a6a7a;">info@selenaura.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `¡Bienvenida${userName ? `, ${userName}` : ''}!

Tu inscripción en ${courseName} se ha completado con éxito.
Ya tienes acceso completo a todo el contenido.

Accede a tu curso: ${courseUrl}
Panel de alumna: ${dashboardUrl}

Próximos pasos:
1. Empieza por la primera lección del Módulo 1
2. Completa cada evaluación para desbloquear badges
3. Al terminar, descarga tu certificado verificable

Selene Academia — academy.selenaura.com`;

  return sendEmail({ to: email, subject, htmlContent, textContent });
}

/**
 * Send installment payment confirmation
 */
export async function sendInstallmentEmail({ email, courseName, installmentNumber, totalInstallments, amount, currency }) {
  const subject = `Cuota ${installmentNumber}/${totalInstallments} recibida — ${courseName}`;

  const formattedAmount = currency === 'eur'
    ? `€${(amount / 100).toFixed(2)}`
    : `$${(amount / 100).toFixed(2)}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="text-align:center;padding:30px 0;">
              <div style="font-size:28px;">🌙</div>
              <h1 style="color:#d4a853;font-size:18px;font-weight:normal;margin:8px 0 0;">SELENE ACADEMIA</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <h2 style="color:#ffffff;font-size:20px;font-weight:normal;margin:0 0 12px;">
                Cuota ${installmentNumber} de ${totalInstallments} recibida ✓
              </h2>
              <p style="color:#b8b8c8;font-size:14px;margin:0;">
                Hemos recibido tu pago de <strong style="color:#d4a853;">${formattedAmount}</strong> para <strong style="color:#d4a853;">${courseName}</strong>.
              </p>
              ${installmentNumber < totalInstallments ? `
              <p style="color:#6a6a7a;font-size:13px;margin:16px 0 0;">
                Quedan ${totalInstallments - installmentNumber} cuota${totalInstallments - installmentNumber > 1 ? 's' : ''} pendiente${totalInstallments - installmentNumber > 1 ? 's' : ''}.
              </p>
              ` : `
              <p style="color:#d4a853;font-size:14px;margin:16px 0 0;">
                🎉 ¡Has completado todos los pagos! Gracias por tu confianza.
              </p>
              `}
            </td>
          </tr>
          <tr>
            <td style="padding:10px 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
          <tr>
            <td style="padding:20px 40px 40px;text-align:center;">
              <p style="color:#6a6a7a;font-size:12px;margin:0;">
                Selene Academia · <a href="https://academy.selenaura.com" style="color:#6a6a7a;">academy.selenaura.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({ to: email, subject, htmlContent, textContent: `Cuota ${installmentNumber}/${totalInstallments} recibida (${formattedAmount}) para ${courseName}.` });
}
