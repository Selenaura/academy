'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState('pending'); // pending | loading | done | error

  async function handleUnsubscribe() {
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decodeURIComponent(email) }),
      });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Georgia, 'Times New Roman', serif",
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌙</div>
        <h1 style={{
          color: '#d4a853',
          fontSize: '20px',
          fontWeight: 'normal',
          letterSpacing: '1px',
          marginBottom: '32px',
        }}>
          SELENE ACADEMIA
        </h1>

        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
          marginBottom: '32px',
        }} />

        {status === 'pending' && (
          <>
            <h2 style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 'normal',
              marginBottom: '16px',
            }}>
              ¿Deseas dejar de recibir nuestros emails?
            </h2>
            <p style={{
              color: '#b8b8c8',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}>
              {email
                ? `Cancelaremos los emails para ${decodeURIComponent(email)}.`
                : 'Cancelaremos los emails de la secuencia de nurture.'}
            </p>
            <button
              onClick={handleUnsubscribe}
              style={{
                padding: '14px 40px',
                backgroundColor: '#d4a853',
                color: '#0a0a0f',
                fontSize: '15px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              Sí, cancelar emails
            </button>
            <p style={{
              color: '#6a6a7a',
              fontSize: '12px',
              marginTop: '16px',
            }}>
              Esto solo cancela los emails de la secuencia informativa.<br />
              Si compraste un curso, seguirás recibiendo emails transaccionales.
            </p>
          </>
        )}

        {status === 'loading' && (
          <p style={{ color: '#b8b8c8', fontSize: '16px' }}>Procesando...</p>
        )}

        {status === 'done' && (
          <>
            <h2 style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 'normal',
              marginBottom: '16px',
            }}>
              ✓ Listo
            </h2>
            <p style={{
              color: '#b8b8c8',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}>
              No recibirás más emails de nuestra parte.<br />
              Gracias por habernos dado una oportunidad. 🌙
            </p>
            <a
              href="https://academy.selenaura.com"
              style={{
                color: '#d4a853',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Volver a Selene Academia
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 style={{
              color: '#FF6B6B',
              fontSize: '22px',
              fontWeight: 'normal',
              marginBottom: '16px',
            }}>
              Hubo un error
            </h2>
            <p style={{
              color: '#b8b8c8',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}>
              No pudimos procesar tu solicitud. Por favor, escríbenos a{' '}
              <a href="mailto:info@selenaura.com" style={{ color: '#d4a853' }}>
                info@selenaura.com
              </a>{' '}
              y te daremos de baja manualmente.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#b8b8c8',
        fontFamily: "Georgia, serif",
      }}>
        Cargando...
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
