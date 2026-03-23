'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, GoldDivider, Card } from '@/components/ui';

export default function VerificarPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null); // null | 'loading' | { found: true, ... } | { found: false }

  function handleVerify(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setResult('loading');

    // Mock verification — will connect to Supabase later
    setTimeout(() => {
      if (trimmed.toUpperCase().startsWith('SEL-')) {
        setResult({
          found: true,
          studentName: '***a M. E.',
          courseTitle: 'Astrología Natal Profunda',
          issueDate: '15 de marzo de 2026',
          code: trimmed.toUpperCase(),
        });
      } else {
        setResult({ found: false });
      }
    }, 800);
  }

  function handleReset() {
    setCode('');
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar />

      <section className="px-6 pt-20 pb-24 max-w-[560px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block text-[11px] text-selene-gold font-semibold px-4 py-1.5 rounded-full border border-selene-gold/20 bg-selene-gold/5 mb-6 tracking-[0.1em] uppercase">
            Verificador de certificados
          </div>

          <h1 className="font-display text-[clamp(28px,5vw,40px)] font-normal text-selene-white mb-4">
            Verificar certificado
          </h1>

          <p className="text-[15px] text-selene-white-dim leading-relaxed max-w-md mx-auto mb-4">
            Introduce el código CSV que aparece en el certificado para comprobar su autenticidad.
          </p>

          <GoldDivider />
        </div>

        {/* Verification form */}
        {!result || result === 'loading' ? (
          <Card className="p-8">
            <form onSubmit={handleVerify}>
              <label className="block text-[13px] text-selene-white-dim mb-2 font-semibold uppercase tracking-wider">
                Código del certificado
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="SEL-2026-XXXX-XXXXXX"
                className="w-full bg-selene-bg border border-selene-border rounded-xl px-5 py-4 text-selene-white font-mono text-[15px] tracking-wider placeholder:text-selene-white-dim/40 focus:outline-none focus:border-selene-gold/50 transition mb-5"
                autoFocus
              />

              <button
                type="submit"
                disabled={!code.trim() || result === 'loading'}
                className="w-full text-[15px] font-semibold bg-selene-gold text-selene-bg py-4 rounded-xl hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {result === 'loading' ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-4 h-4 border-2 border-selene-bg/30 border-t-selene-bg rounded-full animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  'Verificar'
                )}
              </button>
            </form>

            <p className="text-[12px] text-selene-white-dim/60 text-center mt-5 leading-relaxed">
              El formato del código es <span className="font-mono text-selene-white-dim/80">SEL-YYYY-XXXX-XXXXXX</span>
              <br />y se encuentra en la parte inferior del certificado.
            </p>
          </Card>
        ) : result.found ? (
          /* ── Success state ── */
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-selene-success/10 border border-selene-success/20 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-selene-success">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <h2 className="font-display text-xl text-selene-white mb-1">Certificado válido</h2>
              <p className="text-[13px] text-selene-success">Este certificado es auténtico y fue emitido por Selene Academia.</p>
            </div>

            <div className="bg-selene-bg rounded-xl border border-selene-border p-5 space-y-4 mb-6">
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider mb-1">Código CSV</div>
                <div className="font-mono text-selene-gold text-sm font-semibold tracking-wider">{result.code}</div>
              </div>
              <div className="h-px bg-selene-border" />
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider mb-1">Estudiante</div>
                <div className="text-[14px] text-selene-white">{result.studentName}</div>
              </div>
              <div className="h-px bg-selene-border" />
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider mb-1">Curso completado</div>
                <div className="text-[14px] text-selene-white">{result.courseTitle}</div>
              </div>
              <div className="h-px bg-selene-border" />
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider mb-1">Fecha de emisión</div>
                <div className="text-[14px] text-selene-white">{result.issueDate}</div>
              </div>
            </div>

            <p className="text-[12px] text-selene-white-dim/60 text-center mb-6 leading-relaxed">
              Los datos del estudiante se muestran parcialmente por privacidad.
            </p>

            <button
              onClick={handleReset}
              className="w-full text-[14px] font-semibold text-selene-gold py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition"
            >
              Verificar otro certificado
            </button>
          </Card>
        ) : (
          /* ── Not found state ── */
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-selene-rose/10 border border-selene-rose/20 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-selene-rose">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h2 className="font-display text-xl text-selene-white mb-1">Certificado no encontrado</h2>
              <p className="text-[13px] text-selene-white-dim leading-relaxed max-w-sm mx-auto">
                No hemos encontrado ningún certificado con ese código. Comprueba que lo has introducido correctamente.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full text-[14px] font-semibold text-selene-gold py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition"
            >
              Intentar de nuevo
            </button>
          </Card>
        )}

        {/* Back link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-selene-white-dim hover:text-selene-white transition no-underline"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
