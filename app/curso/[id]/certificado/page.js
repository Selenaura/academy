'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { COURSES } from '@/lib/constants';
import { BackIcon, MoonIcon } from '@/components/ui';
import { createClient } from '@/lib/supabase-browser';

export default function CertificatePage({ params }) {
  const router = useRouter();
  const course = COURSES.find(c => c.id === params.id);
  const supabase = createClient();
  const [userName, setUserName] = useState('');
  const [certCode, setCertCode] = useState('');
  const [loading, setLoading] = useState(true);
  const certRef = useRef(null);

  useEffect(() => {
    async function loadCertificate() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Get profile name
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, surname')
          .eq('id', user.id)
          .single();

        const fullName = profile
          ? [profile.name, profile.surname].filter(Boolean).join(' ')
          : user.user_metadata?.name || user.email?.split('@')[0] || 'Estudiante';
        setUserName(fullName);

        // Check if certificate already exists
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('certificate_code')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .single();

        if (existingCert) {
          setCertCode(existingCert.certificate_code);
        } else {
          // Generate and store new certificate
          const code = `SEL-2026-${params.id.slice(0, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          const { error } = await supabase
            .from('certificates')
            .insert({ user_id: user.id, course_id: params.id, certificate_code: code });
          if (!error) setCertCode(code);
          else setCertCode(code); // Show anyway even if insert fails
        }
      } catch (e) {
        console.error('Error loading certificate:', e);
        setCertCode(`SEL-2026-${params.id.slice(0, 4).toUpperCase()}-PREVIEW`);
        setUserName('Estudiante');
      }
      setLoading(false);
    }
    loadCertificate();
  }, [params.id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <p className="text-selene-white-dim">Curso no encontrado</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    const el = certRef.current;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { backgroundColor: '#0F0F18', scale: 2 });
      const link = document.createElement('a');
      link.download = `Certificado_${course.id}_${certCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      // Fallback: print
      window.print();
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verificar/${certCode}`;
    if (navigator.share) {
      await navigator.share({ title: `Certificado ${course.title}`, text: `He completado ${course.title} en Selene Academia`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Enlace de verificación copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="text-selene-gold animate-pulse">Generando certificado...</div>
      </div>
    );
  }

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
          ref={certRef}
          className="relative overflow-hidden rounded-[20px] p-12 text-center border-2 border-selene-gold/25"
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

            <div className="text-xs text-selene-white-dim mb-1">{today}</div>
            <div className="text-[11px] text-selene-gold-dim font-mono">Código: {certCode}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={handleDownloadPDF} className="bg-selene-gold text-selene-bg font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition text-sm">
            📄 Descargar imagen
          </button>
          <button onClick={handleShare} className="text-selene-gold font-semibold px-8 py-3 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition text-sm">
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
