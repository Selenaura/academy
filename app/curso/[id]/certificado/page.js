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
  const [issueDate, setIssueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const certRef = useRef(null);

  useEffect(() => {
    async function loadCertificate() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError('Inicia sesión para ver tu certificado'); setLoading(false); return; }

        // ── 1. Check enrollment ──
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .single();

        if (!enrollment) {
          setError('No estás matriculada en este curso.');
          setLoading(false);
          return;
        }

        // ── 2. Check if certificate already exists ──
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('certificate_code, issued_at')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .single();

        if (existingCert) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, surname')
            .eq('id', user.id)
            .single();
          setUserName(buildName(profile, user));
          setCertCode(existingCert.certificate_code);
          setIssueDate(formatDate(existingCert.issued_at));
          await generateQR(existingCert.certificate_code);
          setLoading(false);
          return;
        }

        // ── 3. Check exam passed (≥70%) ──
        const { data: examAttempt } = await supabase
          .from('quiz_attempts')
          .select('score, passed')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .eq('passed', true)
          .order('attempted_at', { ascending: false })
          .limit(1)
          .single();

        if (!examAttempt) {
          setError('Necesitas aprobar el examen final (≥70%) para obtener tu certificado.');
          setLoading(false);
          return;
        }

        // ── 4. Check lesson completion ──
        const totalLessons = (course.lessons || []).filter(l => l.type === 'lesson').length;
        const { count: completedCount } = await supabase
          .from('lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .eq('status', 'completed');

        if (completedCount < totalLessons) {
          setError(`Has completado ${completedCount || 0} de ${totalLessons} lecciones. Completa todas para obtener tu certificado.`);
          setLoading(false);
          return;
        }

        // ── 5. All checks passed — generate certificate ──
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, surname')
          .eq('id', user.id)
          .single();

        setUserName(buildName(profile, user));

        const year = new Date().getFullYear();
        const code = `SEL-${year}-${params.id.slice(0, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const { error: insertError } = await supabase
          .from('certificates')
          .insert({ user_id: user.id, course_id: params.id, certificate_code: code });

        if (insertError) {
          console.error('Certificate insert error:', insertError);
          setError('Error al generar el certificado. Inténtalo de nuevo.');
          setLoading(false);
          return;
        }

        setCertCode(code);
        setIssueDate(formatDate(new Date().toISOString()));
        await generateQR(code);

        // ── 6. Send certificate email (fire and forget) ──
        fetch('/api/certificate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: params.id, certCode: code }),
        }).catch(() => {});

      } catch (e) {
        console.error('Error loading certificate:', e);
        setError('Error al cargar el certificado.');
      }
      setLoading(false);
    }
    loadCertificate();
  }, [params.id]);

  function buildName(profile, user) {
    if (profile && (profile.name || profile.surname)) {
      return [profile.name, profile.surname].filter(Boolean).join(' ');
    }
    return user.user_metadata?.name || user.email?.split('@')[0] || 'Estudiante';
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function generateQR(code) {
    try {
      let QRCode;
      try {
        QRCode = (await import('qrcode')).default;
      } catch {
        await loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js');
        QRCode = window.QRCode;
      }
      const verifyUrl = `${window.location.origin}/verificar/${code}`;
      const url = await QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#D4A843', light: '#00000000' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(url);
    } catch (e) {
      console.warn('QR generation failed:', e);
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <p className="text-selene-white-dim">Curso no encontrado</p>
      </div>
    );
  }

  // ── PDF Download (A4 landscape) ──
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;

      let jsPDF;
      try {
        jsPDF = (await import('jspdf')).jsPDF;
      } catch {
        await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js');
        jsPDF = window.jspdf.jsPDF;
      }

      const canvas = await html2canvas(certRef.current, {
        backgroundColor: '#0F0F18',
        scale: 3,
        useCORS: true,
        logging: false,
      });

      // A4 landscape: 297 x 210 mm
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = 297;
      const pageH = 210;

      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pageW / pageH;

      let imgW, imgH, offsetX, offsetY;
      if (imgRatio > pageRatio) {
        imgW = pageW;
        imgH = pageW / imgRatio;
        offsetX = 0;
        offsetY = (pageH - imgH) / 2;
      } else {
        imgH = pageH;
        imgW = pageH * imgRatio;
        offsetX = (pageW - imgW) / 2;
        offsetY = 0;
      }

      pdf.setFillColor(15, 15, 24);
      pdf.rect(0, 0, pageW, pageH, 'F');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, imgW, imgH);

      pdf.setProperties({
        title: `Certificado - ${course.title}`,
        subject: `Certificado de finalización emitido por Selene Academia`,
        author: 'Selene Academia',
        keywords: `certificado, ${course.title}, selene academia`,
        creator: 'Selene Academia',
      });

      pdf.save(`Certificado_${course.id}_${certCode}.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
      window.print();
    }
  };

  // ── Share (verification URL) ──
  const handleShare = async () => {
    const url = `${window.location.origin}/verificar/${certCode}`;
    if (navigator.share) {
      await navigator.share({
        title: `Certificado - ${course.title}`,
        text: `He completado "${course.title}" en Selene Academia. Verifica mi certificado:`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Enlace de verificación copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
        <div className="text-selene-gold text-sm">Verificando requisitos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
          <button onClick={() => router.push(`/curso/${params.id}`)} className="text-selene-white-dim hover:text-selene-white">
            <BackIcon />
          </button>
          <span className="text-sm font-medium text-selene-white">Certificado</span>
        </nav>
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-selene-card border border-selene-border flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-selene-white-dim">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="font-display text-xl text-selene-white mb-3">Certificado no disponible</h2>
          <p className="text-sm text-selene-white-dim leading-relaxed mb-6">{error}</p>
          <button
            onClick={() => router.push(`/curso/${params.id}`)}
            className="bg-selene-gold text-selene-bg font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition text-sm"
          >
            Volver al curso
          </button>
        </div>
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

      <div className="max-w-[780px] mx-auto px-5 py-10">
        {/* ═══════ Certificate Card (A4 landscape ratio ≈ 1.414:1) ═══════ */}
        <div
          ref={certRef}
          className="relative overflow-hidden rounded-[20px] text-center border-2 border-selene-gold/25"
          style={{
            aspectRatio: '1.414 / 1',
            background: 'linear-gradient(145deg, #0F0F18 0%, #12121E 40%, #151520 70%, rgba(155,142,196,0.03) 100%)',
            boxShadow: '0 0 80px rgba(155,142,196,0.06), inset 0 0 120px rgba(0,0,0,0.3)',
            padding: 'clamp(32px, 5vw, 56px)',
          }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-selene-gold/30 rounded-tl-sm" />
          <div className="absolute top-5 right-5 w-10 h-10 border-t-2 border-r-2 border-selene-gold/30 rounded-tr-sm" />
          <div className="absolute bottom-5 left-5 w-10 h-10 border-b-2 border-l-2 border-selene-gold/30 rounded-bl-sm" />
          <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-selene-gold/30 rounded-br-sm" />

          {/* Star pattern overlay */}
          <div className="absolute inset-0 star-pattern" />

          {/* Subtle radial glow behind center */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(155,142,196,0.04) 0%, transparent 70%)',
          }} />

          <div className="relative z-10 flex flex-col items-center justify-between h-full">
            {/* Top: Brand */}
            <div>
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <MoonIcon size={26} />
                <span className="font-display text-lg text-selene-gold tracking-[0.12em] font-medium">SELENE ACADEMIA</span>
              </div>
              <div className="font-display text-[10px] text-selene-gold/50 tracking-[0.35em] uppercase">
                Certificado de Finalización
              </div>
            </div>

            {/* Middle: Main content */}
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              {/* Gold divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-px bg-selene-gold/20" />
                <svg width="8" height="8" viewBox="0 0 8 8" className="text-selene-gold/40">
                  <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill="currentColor" />
                </svg>
                <div className="w-12 h-px bg-selene-gold/20" />
              </div>

              <p className="text-[11px] text-selene-white-dim/70 tracking-[0.15em] uppercase mb-3">
                Se certifica que
              </p>

              <div className="font-display text-selene-white font-normal italic mb-3"
                style={{ fontSize: 'clamp(24px, 4.5vw, 38px)' }}>
                {userName}
              </div>

              <p className="text-[13px] text-selene-white-dim leading-relaxed mb-5">
                ha completado con éxito el curso
              </p>

              <div className="font-display text-selene-gold font-medium mb-2"
                style={{ fontSize: 'clamp(18px, 3vw, 26px)' }}>
                {course.title}
              </div>

              <p className="text-[12px] text-selene-white-dim/80 mb-5">
                {course.hours} de formación · {course.modules} módulos · Evaluación superada
              </p>

              {/* Gold divider */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-selene-gold/20" />
                <svg width="8" height="8" viewBox="0 0 8 8" className="text-selene-gold/40">
                  <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill="currentColor" />
                </svg>
                <div className="w-12 h-px bg-selene-gold/20" />
              </div>
            </div>

            {/* Bottom: Signature + QR + Date */}
            <div className="w-full">
              <div className="flex items-end justify-between gap-4">
                {/* Left: Signature */}
                <div className="flex-1 text-center">
                  <div className="font-display text-selene-gold/80 italic text-[16px] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Selene Academia
                  </div>
                  <div className="w-24 h-px bg-selene-gold/30 mx-auto mb-1" />
                  <div className="text-[9px] text-selene-white-dim/60 tracking-[0.1em] uppercase">
                    Direccion Academica
                  </div>
                </div>

                {/* Center: Date + Code */}
                <div className="flex-1 text-center">
                  <div className="text-[11px] text-selene-white-dim mb-1">{issueDate}</div>
                  <div className="text-[10px] text-selene-gold/60 font-mono tracking-[1px]">{certCode}</div>
                </div>

                {/* Right: QR Code */}
                <div className="flex-1 flex flex-col items-center">
                  {qrDataUrl ? (
                    <>
                      <img src={qrDataUrl} alt="QR verificación" className="w-[72px] h-[72px] mb-1" />
                      <div className="text-[8px] text-selene-white-dim/50">Escanea para verificar</div>
                    </>
                  ) : (
                    <div className="w-[72px] h-[72px] border border-selene-gold/20 rounded-lg flex items-center justify-center">
                      <div className="text-[8px] text-selene-white-dim/40">QR</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Actions ═══════ */}
        <div className="flex gap-3 mt-8 justify-center flex-wrap">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-selene-gold text-selene-bg font-semibold px-8 py-3.5 rounded-xl hover:brightness-110 transition text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9,15 12,18 15,15" />
            </svg>
            Descargar PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-selene-gold font-semibold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartir
          </button>
        </div>

        {/* Print styles hint */}
        <p className="text-[11px] text-selene-white-dim/40 text-center mt-4">
          El PDF se genera en formato A4 apaisado, listo para imprimir.
        </p>

        <div className="text-center mt-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-selene-white-dim hover:text-selene-white transition">
            ← Volver al dashboard
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          nav, .actions, button, p.text-center { display: none !important; }
          body { background: #0F0F18 !important; }
          .min-h-screen { min-height: auto !important; }
        }
      `}</style>
    </div>
  );
}
