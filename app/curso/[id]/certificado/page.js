'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { COURSES } from '@/lib/constants';
import { Spinner, BackIcon, MoonIcon } from '@/components/ui';

export default function CertificatePage({ params }) {
  const router = useRouter();
  const supabase = createClient();
  const course = COURSES.find(c => c.id === params.id);

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadCertificate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth?mode=login'); return; }

      const [certRes, profileRes] = await Promise.all([
        supabase.from('certificates').select('certificate_code, issued_at').eq('user_id', user.id).eq('course_id', params.id).single(),
        supabase.from('profiles').select('name').eq('id', user.id).single(),
      ]);

      if (certRes.data) setCertificate(certRes.data);
      setUserName(profileRes.data?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Estudiante');
      setLoading(false);
    }
    loadCertificate();
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <p className="text-selene-white-dim">Curso no encontrado</p>
      </div>
    );
  }

  if (loading) return <Spinner text="Cargando certificado..." />;

  if (!certificate) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-selene-white-dim mb-4">Aún no tienes certificado para este curso</p>
          <button onClick={() => router.push(`/curso/${course.id}`)} className="text-selene-gold text-sm">
            ← Volver al curso
          </button>
        </div>
      </div>
    );
  }

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-selene-bg">
      <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
        <button onClick={() => router.push('/dashboard')} className="text-selene-white-dim hover:text-selene-white">
          <BackIcon />
        </button>
        <span className="text-sm font-medium text-selene-white">Certificado</span>
      </nav>

      <div className="max-w-[600px] mx-auto px-5 py-10">
        {/* Certificate Card */}
        <div
          className="relative overflow-hidden rounded-[20px] p-6 sm:p-12 text-center border-2 border-selene-gold/25"
          style={{
            background: 'linear-gradient(145deg, #0F0F18 0%, #151520 50%, rgba(201,168,76,0.03) 100%)',
            boxShadow: '0 0 60px rgba(201,168,76,0.08)',
          }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-selene-gold/30" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-selene-gold/30" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-selene-gold/30" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-selene-gold/30" />

          {/* Star pattern */}
          <div className="absolute inset-0 star-pattern" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MoonIcon size={28} />
              <span className="font-display text-lg text-selene-gold tracking-[0.1em]">SELENE ACADEMIA</span>
            </div>

            <div className="font-display text-xs text-selene-gold-dim tracking-[0.3em] uppercase mb-6">
              Certificado de Finalización
            </div>

            <div className="w-16 h-px bg-selene-gold/30 mx-auto mb-6" />

            <div className="font-display text-[32px] text-selene-white font-normal italic mb-2">
              {userName}
            </div>

            <p className="text-sm text-selene-white-dim leading-relaxed mb-6">
              ha completado con éxito el curso
            </p>

            <div className="font-display text-[22px] text-selene-gold font-medium mb-2">
              {course.title}
            </div>

            <p className="text-[13px] text-selene-white-dim mb-6">
              {course.hours} · {course.modules} módulos · Evaluación superada
            </p>

            <div className="w-16 h-px bg-selene-gold/30 mx-auto mb-6" />

            <div className="text-xs text-selene-white-dim mb-1">{issuedDate}</div>
            <div className="text-[11px] text-selene-gold-dim font-mono">Código: {certificate.certificate_code}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <button className="bg-selene-gold text-selene-bg font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition text-sm">
            📄 Descargar PDF
          </button>
          <button className="text-selene-gold font-semibold px-8 py-3 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition text-sm">
            Compartir
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-selene-white-dim hover:text-selene-white transition">
            ← Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
