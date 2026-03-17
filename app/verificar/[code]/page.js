'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { COURSES } from '@/lib/constants';
import { MoonIcon, CheckIcon } from '@/components/ui';

export default function VerifyCertificatePage({ params }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    async function verify() {
      const { data } = await supabase
        .from('certificates')
        .select('certificate_code, course_id, issued_at, profiles(name, surname, document_type, document_number)')
        .eq('certificate_code', params.code)
        .single();

      if (data) setCertificate(data);
      setLoading(false);
    }
    verify();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
        <p className="text-sm text-selene-white-dim mt-4">Verificando certificado...</p>
      </div>
    );
  }

  const course = certificate ? COURSES.find(c => c.id === certificate.course_id) : null;
  const issuedDate = certificate ? new Date(certificate.issued_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const fullName = [certificate?.profiles?.name, certificate?.profiles?.surname].filter(Boolean).join(' ') || 'Estudiante';
  const docType = { dni: 'DNI', nie: 'NIE', pasaporte: 'Pasaporte' }[certificate?.profiles?.document_type];
  const docNumber = certificate?.profiles?.document_number;
  // Mask document number: show first 3 and last 1, rest as *
  const maskedDoc = docNumber && docNumber.length > 4
    ? docNumber.slice(0, 3) + '·'.repeat(docNumber.length - 4) + docNumber.slice(-1)
    : docNumber;

  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 no-underline mb-10">
          <MoonIcon size={24} />
          <span className="font-display text-xl text-selene-gold tracking-wider">SELENE ACADEMIA</span>
        </Link>

        {certificate ? (
          <div className="bg-selene-card rounded-2xl border border-selene-success/30 p-8">
            <div className="w-14 h-14 rounded-full bg-selene-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckIcon size={28} className="text-selene-success" />
            </div>
            <h1 className="font-display text-2xl text-selene-success mb-2">Certificado válido</h1>
            <p className="text-sm text-selene-white-dim mb-6">Este certificado es auténtico y verificable</p>

            <div className="space-y-3 text-left bg-selene-elevated rounded-xl p-5 mb-6">
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider">Titular</div>
                <div className="text-sm text-selene-white font-medium">{fullName}</div>
              </div>
              {docType && maskedDoc && (
                <div>
                  <div className="text-[11px] text-selene-white-dim uppercase tracking-wider">{docType}</div>
                  <div className="text-sm text-selene-white font-mono">{maskedDoc}</div>
                </div>
              )}
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider">Curso</div>
                <div className="text-sm text-selene-white font-medium">{course?.title || certificate.course_id}</div>
                {course && (
                  <div className="text-[11px] text-selene-white-dim">{course.hours} de formación · {course.modules} módulos</div>
                )}
              </div>
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider">Fecha de emisión</div>
                <div className="text-sm text-selene-white font-medium">{issuedDate}</div>
              </div>
              <div>
                <div className="text-[11px] text-selene-white-dim uppercase tracking-wider">Código</div>
                <div className="text-sm text-selene-gold font-mono">{certificate.certificate_code}</div>
              </div>
            </div>

            <Link href="/" className="text-sm text-selene-white-dim hover:text-selene-white transition no-underline">
              ← Volver a Selene Academia
            </Link>
          </div>
        ) : (
          <div className="bg-selene-card rounded-2xl border border-selene-rose/30 p-8">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="font-display text-2xl text-selene-rose mb-2">Certificado no encontrado</h1>
            <p className="text-sm text-selene-white-dim mb-2">
              El código <span className="font-mono text-selene-white">{params.code}</span> no corresponde a ningún certificado.
            </p>
            <p className="text-xs text-selene-white-dim mb-6">
              Verifica que el código sea correcto o contacta con soporte.
            </p>
            <Link href="/" className="text-sm text-selene-white-dim hover:text-selene-white transition no-underline">
              ← Volver a Selene Academia
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
