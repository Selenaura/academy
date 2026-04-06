/**
 * Email service using Brevo (formerly Sendinblue) API
 * Requires BREVO_API_KEY env variable
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

const FROM = {
  name: 'Selene Academia',
  email: 'info@selenaura.com',
};

/**
 * Brevo list IDs — create these in Brevo > Contacts > Lists
 * IDs will be set via env var or default to these values
 */
const BREVO_LISTS = {
  lead_magnet: Number(process.env.BREVO_LIST_LEAD_MAGNET) || 2,
  waitlist_master: Number(process.env.BREVO_LIST_WAITLIST) || 3,
};

/**
 * Add or update a contact in Brevo's contact list.
 * This allows seeing all leads in the Brevo dashboard and sending campaigns.
 *
 * @param {Object} params
 * @param {string} params.email - Contact email
 * @param {string} params.source - Lead source (meta_lead_ad, web_form, exit_intent, etc.)
 * @param {string} params.listType - 'lead_magnet' or 'waitlist_master'
 */
export async function addBrevoContact({ email, source = 'web_form', listType = 'lead_magnet' }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ BREVO_API_KEY not set — contact not added to list');
    return { success: false, reason: 'no_api_key' };
  }

  const listId = BREVO_LISTS[listType] || BREVO_LISTS.lead_magnet;

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        listIds: [listId],
        attributes: {
          FUENTE: source,
          FECHA_REGISTRO: new Date().toISOString().split('T')[0],
        },
        updateEnabled: true, // Update existing contact instead of error
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo contact error:', res.status, err);
      return { success: false, reason: err };
    }

    console.log(`👤 Brevo contact added: ${email} → list ${listType} (ID: ${listId})`);
    return { success: true };
  } catch (err) {
    console.error('Brevo contact error:', err);
    return { success: false, reason: err.message };
  }
}

/**
 * Add UTM tracking parameters to an academy URL
 */
function utmUrl(baseUrl, campaign) {
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}utm_source=brevo&utm_medium=email&utm_campaign=${campaign}`;
}

/**
 * Add UTM params to all academy.selenaura.com links in HTML/text content
 * Skips mailto: and unsubscribe links (which already have query params handled separately)
 */
function addUtmsToContent(content, campaign) {
  return content.replace(
    /href="(https:\/\/(?:academy\.selenaura\.com|tarot\.selenaura\.com|selenaura\.com)(?:\/[^"]*?)?)"/g,
    (match, url) => {
      // Skip unsubscribe links — they have their own params
      if (url.includes('/unsubscribe')) return match;
      // Skip links that already have UTM params
      if (url.includes('utm_source=')) return match;
      return `href="${utmUrl(url, campaign)}"`;
    }
  );
}

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
 * Send certificate email after course completion
 */
export async function sendCertificateEmail({ email, userName, courseName, courseId, certCode, courseHours, courseModules }) {
  const verifyUrl = `https://academy.selenaura.com/verificar/${certCode}`;
  const certPageUrl = `https://academy.selenaura.com/curso/${courseId}/certificado`;

  const subject = `🎓 Tu certificado de ${courseName} está listo`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="text-align:center;padding:30px 0 20px;">
              <div style="font-size:28px;margin-bottom:8px;">🌙</div>
              <h1 style="color:#d4a853;font-size:20px;font-weight:normal;margin:0;letter-spacing:1px;">SELENE ACADEMIA</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">🎓</div>
              <h2 style="color:#ffffff;font-size:24px;font-weight:normal;margin:0 0 16px;">
                ¡Enhorabuena${userName ? `, ${userName}` : ''}!
              </h2>
              <p style="color:#b8b8c8;font-size:15px;line-height:1.7;margin:0;">
                Has completado con éxito <strong style="color:#d4a853;">${courseName}</strong> y tu certificado verificable ya está disponible.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #d4a853;border-radius:12px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <div style="color:#6a6a7a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Código de verificación</div>
                    <div style="color:#d4a853;font-size:18px;font-family:monospace;font-weight:bold;letter-spacing:2px;">${certCode}</div>
                    <div style="height:1px;background:#2a2a3a;margin:16px 0;"></div>
                    <div style="color:#b8b8c8;font-size:13px;">${courseName}</div>
                    <div style="color:#6a6a7a;font-size:12px;margin-top:4px;">${courseHours} · ${courseModules} módulos · Evaluación superada</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <a href="${certPageUrl}"
                 style="display:inline-block;padding:14px 40px;background-color:#d4a853;color:#0a0a0f;font-size:15px;font-weight:bold;text-decoration:none;border-radius:30px;">
                Descargar certificado →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 40px;text-align:center;">
              <a href="${verifyUrl}" style="color:#d4a853;font-size:13px;text-decoration:none;">
                🔗 Enlace público de verificación
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
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

  const textContent = `¡Enhorabuena${userName ? `, ${userName}` : ''}!

Has completado con éxito ${courseName} y tu certificado verificable ya está disponible.

Código de verificación: ${certCode}
${courseHours} · ${courseModules} módulos · Evaluación superada

Descargar certificado: ${certPageUrl}
Enlace de verificación: ${verifyUrl}

Selene Academia — academy.selenaura.com`;

  return sendEmail({ to: email, subject, htmlContent, textContent });
}

/**
 * Send lead magnet email (5 Errores Guía Espiritual)
 */
export async function sendLeadMagnetEmail({ email }) {
  const masterUrl = utmUrl('https://academy.selenaura.com/programa/guia-profesional', 'lead_magnet');
  const subject = '🎁 Tu guía: 5 Errores que Cometen los Guías Espirituales';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding:30px 0 20px;">
              <div style="font-size:28px;margin-bottom:8px;">🌙</div>
              <h1 style="color:#d4a853;font-size:20px;font-weight:normal;margin:0;letter-spacing:1px;">SELENE ACADEMIA</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
                Aquí tienes tu guía 🎁
              </h2>
              <p style="color:#b8b8c8;font-size:15px;line-height:1.7;margin:0;">
                Gracias por descargarla. Dentro encontrarás los <strong style="color:#d4a853;">5 errores más graves</strong> que cometen los guías espirituales sin formación profesional — y cómo evitarlos.
              </p>
            </td>
          </tr>

          <!-- 5 errors summary -->
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="color:#d4a853;font-size:16px;font-weight:normal;margin:0 0 16px;">Los 5 errores:</h3>
                    <ol style="color:#b8b8c8;font-size:14px;line-height:2.2;margin:0;padding-left:20px;">
                      <li><strong style="color:#ffffff;">Confundir intuición con competencia</strong> — tu don necesita método</li>
                      <li><strong style="color:#ffffff;">No saber gestionar crisis emocionales</strong> — límites que salvan vidas</li>
                      <li><strong style="color:#ffffff;">Cobrar sin estructura profesional</strong> — sin factura, sin confianza</li>
                      <li><strong style="color:#ffffff;">Ignorar el marco legal</strong> — intrusismo, RGPD, responsabilidad civil</li>
                      <li><strong style="color:#ffffff;">No tener plan de negocio</strong> — el 73% abandona en el primer año</li>
                    </ol>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <p style="color:#b8b8c8;font-size:14px;line-height:1.7;margin:0 0 20px;">
                ¿Quieres corregir estos errores y convertir tu don en una profesión real?<br>
                El <strong style="color:#d4a853;">Máster en Guía Espiritual Profesional</strong> te da la formación completa: 12 módulos, 80 horas, certificación.
              </p>
              <a href="${masterUrl}"
                 style="display:inline-block;padding:14px 40px;background-color:#d4a853;color:#0a0a0f;font-size:15px;font-weight:bold;text-decoration:none;border-radius:30px;">
                Descubrir el Máster →
              </a>
            </td>
          </tr>

          <!-- Tripwire offer -->
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:2px solid #d4a853;border-radius:12px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <div style="font-size:24px;margin-bottom:12px;">🔮</div>
                    <h3 style="color:#d4a853;font-size:18px;font-weight:normal;margin:0 0 12px;">
                      Mientras decides... descubre lo que las estrellas dicen de ti
                    </h3>
                    <p style="color:#b8b8c8;font-size:15px;line-height:1.7;margin:0 0 16px;">
                      Lectura de tarot personalizada con IA, creada a partir de tu fecha de nacimiento y tu pregunta.
                    </p>
                    <div style="margin:0 0 8px;">
                      <span style="color:#6a6a7a;font-size:14px;text-decoration:line-through;">4,99 &euro;</span>
                      <span style="color:#d4a853;font-size:22px;font-weight:bold;margin-left:8px;">1,99 &euro;</span>
                    </div>
                    <p style="color:#FF9F43;font-size:13px;font-weight:bold;margin:0 0 16px;">
                      Solo durante las pr&oacute;ximas 48 horas
                    </p>
                    <a href="${utmUrl('https://tarot.selenaura.com/', 'lead_magnet_tripwire')}"
                       style="display:inline-block;padding:12px 36px;background-color:#d4a853;color:#0a0a0f;font-size:14px;font-weight:bold;text-decoration:none;border-radius:30px;">
                      Quiero mi lectura por 1,99 &euro; →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- More products -->
          <tr>
            <td style="padding:10px 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#d4a853;font-size:14px;margin:0 0 12px;font-weight:bold;">Tambi&eacute;n te puede interesar:</p>
                    <p style="color:#b8b8c8;font-size:14px;line-height:2;margin:0;">
                      🔢 <a href="${utmUrl('https://selenaura.com/numerologia', 'lead_magnet_tripwire')}" style="color:#d4a853;text-decoration:none;">Informe de numerolog&iacute;a personalizado</a> — 7,99 &euro;<br>
                      💕 <a href="${utmUrl('https://selenaura.com/compatibilidad', 'lead_magnet_tripwire')}" style="color:#d4a853;text-decoration:none;">Compatibilidad de pareja astral</a> — 9,99 &euro;
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
          </tr>
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

  const textContent = `¡Aquí tienes tu guía!

5 Errores que Cometen los Guías Espirituales Sin Formación Profesional:

1. Confundir intuición con competencia — tu don necesita método
2. No saber gestionar crisis emocionales — límites que salvan vidas
3. Cobrar sin estructura profesional — sin factura, sin confianza
4. Ignorar el marco legal — intrusismo, RGPD, responsabilidad civil
5. No tener plan de negocio — el 73% abandona en el primer año

¿Quieres corregir estos errores?
Descubre el Máster en Guía Espiritual Profesional: ${masterUrl}

---

🔮 OFERTA ESPECIAL — Solo 48 horas
Lectura de tarot personalizada: 1,99 € (antes 4,99 €)
${utmUrl('https://tarot.selenaura.com/', 'lead_magnet_tripwire')}

También te puede interesar:
🔢 Informe de numerología personalizado — 7,99 € → ${utmUrl('https://selenaura.com/numerologia', 'lead_magnet_tripwire')}
💕 Compatibilidad de pareja astral — 9,99 € → ${utmUrl('https://selenaura.com/compatibilidad', 'lead_magnet_tripwire')}

Selene Academia — academy.selenaura.com`;

  return sendEmail({
    to: email,
    subject,
    htmlContent: addUtmsToContent(htmlContent, 'lead_magnet'),
    textContent,
  });
}

/**
 * Nurture email sequence (5 emails after lead magnet)
 * Schedule: Day 2, Day 4, Day 7, Day 10, Day 14
 */

const NURTURE_HEADER = `
  <tr>
    <td style="text-align:center;padding:30px 0 20px;">
      <div style="font-size:28px;margin-bottom:8px;">🌙</div>
      <h1 style="color:#d4a853;font-size:20px;font-weight:normal;margin:0;letter-spacing:1px;">SELENE ACADEMIA</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
  </tr>`;

const NURTURE_FOOTER = `
  <tr>
    <td style="padding:20px 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4a853,transparent);"></div></td>
  </tr>
  <tr>
    <td style="padding:20px 40px 40px;text-align:center;">
      <p style="color:#6a6a7a;font-size:12px;line-height:1.6;margin:0;">
        Selene Academia — Tu escuela de consciencia cósmica<br>
        <a href="https://academy.selenaura.com" style="color:#6a6a7a;">academy.selenaura.com</a>
        &nbsp;·&nbsp;
        <a href="mailto:info@selenaura.com" style="color:#6a6a7a;">info@selenaura.com</a><br><br>
        <a href="https://academy.selenaura.com/unsubscribe?email=%%EMAIL%%" style="color:#6a6a7a;font-size:11px;">Dejar de recibir estos emails</a>
      </p>
    </td>
  </tr>`;

function nurtureWrap(innerHtml) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${NURTURE_HEADER}
        ${innerHtml}
        ${NURTURE_FOOTER}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const MASTER_URL = 'https://academy.selenaura.com/programa/guia-profesional';

const CTA_BUTTON = `
  <tr>
    <td style="padding:20px 40px;text-align:center;">
      <a href="${MASTER_URL}"
         style="display:inline-block;padding:14px 40px;background-color:#d4a853;color:#0a0a0f;font-size:15px;font-weight:bold;text-decoration:none;border-radius:30px;">
        Ver el Máster completo →
      </a>
    </td>
  </tr>`;

export const NURTURE_EMAILS = [
  // Email 1 — Day 2: "El error más peligroso"
  {
    day: 2,
    subject: 'El error más peligroso de la guía que leíste',
    html: nurtureWrap(`
      <tr>
        <td style="padding:40px 40px 20px;">
          <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
            ¿Leíste la guía? Hay un error que es más grave que los demás.
          </h2>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            El error #2 — <strong style="color:#d4a853;">no saber gestionar crisis emocionales</strong> — es el que más daño puede hacer. No solo a ti, sino a la persona que confía en ti.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Un estudio de la American Psychological Association (2019) encontró que el 38% de quienes ofrecen acompañamiento sin formación en manejo de crisis provocan dependencia emocional involuntaria.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0;">
            En el Módulo 7 del Máster cubrimos exactamente esto: <strong style="color:#ffffff;">protocolos de contención emocional</strong> basados en la terapia IFS de Richard Schwartz y counselling transpersonal.
          </p>
        </td>
      </tr>
      ${CTA_BUTTON}`),
    text: `¿Leíste la guía? Hay un error más grave que los demás.

El error #2 — no saber gestionar crisis emocionales — es el que más daño puede hacer.

Un estudio de la APA (2019) encontró que el 38% de quienes ofrecen acompañamiento sin formación en crisis provocan dependencia emocional involuntaria.

En el Módulo 7 del Máster cubrimos protocolos de contención emocional basados en terapia IFS y counselling transpersonal.

Ver el Máster: ${MASTER_URL}`
  },

  // Email 2 — Day 4: "La diferencia entre intuición y profesión"
  {
    day: 4,
    subject: 'Intuición sin método = riesgo (datos reales)',
    html: nurtureWrap(`
      <tr>
        <td style="padding:40px 40px 20px;">
          <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
            Tu intuición es real. Pero no basta.
          </h2>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Que tengas un don no significa que estés preparada para ejercerlo profesionalmente. Lo mismo pasa con alguien que sabe escuchar pero no es psicóloga, o con alguien que cura con plantas pero no es médica.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            La neurociencia confirma que la intuición existe — el neurocientífico Antonio Damasio la llama <strong style="color:#d4a853;">"marcadores somáticos"</strong>. Pero convertir esa capacidad en una práctica profesional segura requiere tres cosas:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;margin:16px 0;">
            <tr><td style="padding:24px;">
              <p style="color:#b8b8c8;font-size:14px;line-height:2.2;margin:0;">
                🧠 <strong style="color:#ffffff;">Método</strong> — saber qué haces y por qué funciona<br>
                📋 <strong style="color:#ffffff;">Ética</strong> — límites, derivación, consentimiento informado<br>
                📜 <strong style="color:#ffffff;">Marco legal</strong> — facturación, RGPD, seguros
              </p>
            </td></tr>
          </table>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0;">
            El Máster en Guía Espiritual Profesional te da las tres. 80 horas, 12 módulos, certificación verificable.
          </p>
        </td>
      </tr>
      ${CTA_BUTTON}`),
    text: `Tu intuición es real. Pero no basta.

La neurociencia confirma que la intuición existe — Damasio la llama "marcadores somáticos". Pero convertir esa capacidad en profesión requiere:

- Método: saber qué haces y por qué funciona
- Ética: límites, derivación, consentimiento informado
- Marco legal: facturación, RGPD, seguros

El Máster te da las tres. 80 horas, 12 módulos, certificación.

Ver el Máster: ${MASTER_URL}`
  },

  // Email 3 — Day 7: "Qué incluye el Máster (módulo a módulo)"
  {
    day: 7,
    subject: '12 módulos, 80 horas: esto es lo que aprenderás',
    html: nurtureWrap(`
      <tr>
        <td style="padding:40px 40px 20px;">
          <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
            Todo lo que incluye el Máster, paso a paso
          </h2>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 20px;">
            Muchas personas nos preguntan "¿qué voy a aprender exactamente?" Aquí va el resumen:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
            <tr><td style="padding:24px;">
              <p style="color:#b8b8c8;font-size:13px;line-height:2.4;margin:0;">
                📖 Mód. 1-2: Bases científicas de la espiritualidad (neuroteología, psicología transpersonal)<br>
                🧘 Mód. 3-4: Herramientas de acompañamiento (meditación guiada, visualización, respiración)<br>
                🧠 Mód. 5-6: Counselling transpersonal y gestión emocional (IFS, coherencia cardíaca)<br>
                ⚖️ Mód. 7-8: Ética profesional, código deontológico, derivación<br>
                📋 Mód. 9-10: Marco legal España + LATAM, facturación, RGPD, seguros<br>
                💼 Mód. 11-12: Plan de negocio, pricing, captación, marca personal
              </p>
            </td></tr>
          </table>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:20px 0 0;">
            Al terminar: <strong style="color:#d4a853;">certificación profesional con código CSV verificable públicamente</strong>. No es un PDF decorativo — es un certificado que tus futuros clientes pueden comprobar.
          </p>
        </td>
      </tr>

      <!-- Numerología alternative -->
      <tr>
        <td style="padding:10px 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;">
            <tr><td style="padding:20px 24px;">
              <p style="color:#b8b8c8;font-size:14px;line-height:1.7;margin:0;">
                🔢 <strong style="color:#d4a853;">¿Quieres empezar por algo más ligero?</strong><br>
                Descubre qué dice tu numerología personal sobre tu camino como guía. Informe completo por solo 7,99 &euro;.
              </p>
              <p style="margin:12px 0 0;">
                <a href="https://selenaura.com/numerologia" style="color:#d4a853;font-size:14px;text-decoration:none;">
                  Ver mi informe de numerología →
                </a>
              </p>
            </td></tr>
          </table>
        </td>
      </tr>

      ${CTA_BUTTON}`),
    text: `Todo lo que incluye el Máster:

Mód. 1-2: Bases científicas (neuroteología, psicología transpersonal)
Mód. 3-4: Herramientas de acompañamiento
Mód. 5-6: Counselling transpersonal y gestión emocional
Mód. 7-8: Ética profesional y derivación
Mód. 9-10: Marco legal España + LATAM
Mód. 11-12: Plan de negocio y marca personal

Certificación profesional con código CSV verificable.

¿Quieres empezar por algo más ligero?
Informe de numerología personalizado — 7,99 € → https://selenaura.com/numerologia

Ver el Máster: ${MASTER_URL}`
  },

  // Email 4 — Day 10: "El marco legal que nadie te cuenta"
  {
    day: 10,
    subject: '¿Sabías que guiar sin formación puede ser intrusismo?',
    html: nurtureWrap(`
      <tr>
        <td style="padding:40px 40px 20px;">
          <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
            El tema que nadie quiere hablar: la legalidad.
          </h2>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            En España, el artículo 403 del Código Penal tipifica el intrusismo profesional. Si ofreces servicios de acompañamiento emocional o espiritual sin distinguirlos claramente de la psicoterapia, puedes tener un problema legal.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            En Latinoamérica la regulación varía, pero la tendencia es la misma: cada vez más países exigen acreditación para coaching, terapias alternativas y acompañamiento espiritual.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Lo que necesitas para ejercer legalmente:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #2a2a3a;border-radius:12px;margin:0 0 16px;">
            <tr><td style="padding:24px;">
              <p style="color:#b8b8c8;font-size:14px;line-height:2.2;margin:0;">
                ✅ Formación acreditada con certificado verificable<br>
                ✅ Alta como autónoma (España) o régimen fiscal local (LATAM)<br>
                ✅ Consentimiento informado para cada cliente<br>
                ✅ Protocolo de derivación (saber cuándo NO es tu caso)<br>
                ✅ Seguro de responsabilidad civil (recomendado)
              </p>
            </td></tr>
          </table>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0;">
            Los módulos 9 y 10 del Máster cubren todo esto con plantillas descargables y guía paso a paso.
          </p>
        </td>
      </tr>
      ${CTA_BUTTON}`),
    text: `El tema que nadie quiere hablar: la legalidad.

En España, el art. 403 del Código Penal tipifica el intrusismo profesional. En LATAM la tendencia es la misma.

Lo que necesitas:
- Formación acreditada con certificado verificable
- Alta fiscal
- Consentimiento informado
- Protocolo de derivación
- Seguro de responsabilidad civil

Los módulos 9 y 10 del Máster cubren todo esto.

Ver el Máster: ${MASTER_URL}`
  },

  // Email 5 — Day 14: "Última llamada + precio"
  {
    day: 14,
    subject: 'Tu don merece esto (última reflexión)',
    html: nurtureWrap(`
      <tr>
        <td style="padding:40px 40px 20px;">
          <h2 style="color:#ffffff;font-size:22px;font-weight:normal;margin:0 0 16px;">
            Una última cosa antes de dejarte tranquila.
          </h2>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Hace dos semanas descargaste nuestra guía sobre los 5 errores de los guías espirituales. Desde entonces te hemos compartido datos sobre neurociencia, ética, legalidad y lo que incluye el Máster.
          </p>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Si has llegado hasta aquí, probablemente no es casualidad. Sabes que tu don es real. Sabes que necesita estructura.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:1px solid #d4a853;border-radius:12px;margin:0 0 20px;">
            <tr><td style="padding:24px;text-align:center;">
              <div style="color:#d4a853;font-size:18px;font-weight:bold;margin-bottom:8px;">Máster en Guía Espiritual Profesional</div>
              <div style="color:#b8b8c8;font-size:14px;margin-bottom:12px;">80 horas · 12 módulos · 40 lecciones · Certificación CSV</div>
              <div style="color:#ffffff;font-size:24px;font-weight:bold;margin-bottom:4px;">149,99 €</div>
              <div style="color:#b8b8c8;font-size:13px;">o 3 cuotas de 53 € · Acceso de por vida</div>
            </td></tr>
          </table>
          <p style="color:#b8b8c8;font-size:15px;line-height:1.8;margin:0;">
            No te enviaremos más emails sobre esto. Si cuando estés lista quieres volver, el enlace estará ahí.
          </p>
        </td>
      </tr>

      <!-- Downsell section -->
      <tr>
        <td style="padding:10px 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#151520;border:2px solid #d4a853;border-radius:12px;">
            <tr><td style="padding:24px;text-align:center;">
              <p style="color:#d4a853;font-size:16px;font-weight:bold;margin:0 0 12px;">
                Si el M&aacute;ster no es para ti ahora...
              </p>
              <p style="color:#b8b8c8;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Prueba una lectura personalizada desde <strong style="color:#ffffff;">1,99 &euro;</strong> y empieza a conectar con tu camino espiritual a tu ritmo.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding:4px 0;">
                    <a href="https://tarot.selenaura.com/" style="color:#d4a853;font-size:14px;text-decoration:none;">
                      🔮 Lectura de tarot — 1,99 &euro;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;padding:4px 0;">
                    <a href="https://selenaura.com/numerologia" style="color:#d4a853;font-size:14px;text-decoration:none;">
                      🔢 Informe de numerolog&iacute;a — 7,99 &euro;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;padding:4px 0;">
                    <a href="https://selenaura.com/compatibilidad" style="color:#d4a853;font-size:14px;text-decoration:none;">
                      💕 Compatibilidad de pareja — 9,99 &euro;
                    </a>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td>
      </tr>

      ${CTA_BUTTON}`),
    text: `Una última reflexión.

Hace dos semanas descargaste nuestra guía. Desde entonces te hemos compartido datos sobre neurociencia, ética, legalidad y el contenido del Máster.

Si has llegado hasta aquí, probablemente no es casualidad.

Máster en Guía Espiritual Profesional
80 horas · 12 módulos · Certificación CSV
149,99 € o 3 cuotas de 53 €

No te enviaremos más emails sobre esto.

---

Si el Máster no es para ti ahora, prueba una lectura personalizada desde 1,99 €:
🔮 Lectura de tarot — 1,99 € → https://tarot.selenaura.com/
🔢 Informe de numerología — 7,99 € → https://selenaura.com/numerologia
💕 Compatibilidad de pareja — 9,99 € → https://selenaura.com/compatibilidad

Ver el Máster: ${MASTER_URL}`
  },
];

/**
 * Send a specific nurture email by step (0-4)
 */
export async function sendNurtureEmail({ email, step }) {
  const nurture = NURTURE_EMAILS[step];
  if (!nurture) return { success: false, reason: 'invalid_step' };

  const campaign = `nurture_${step + 1}`;

  return sendEmail({
    to: email,
    subject: nurture.subject,
    htmlContent: addUtmsToContent(
      nurture.html.replace('%%EMAIL%%', encodeURIComponent(email)),
      campaign
    ),
    textContent: nurture.text.replace(
      MASTER_URL,
      utmUrl(MASTER_URL, campaign)
    ),
  });
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
