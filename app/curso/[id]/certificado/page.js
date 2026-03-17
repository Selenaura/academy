'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { COURSES } from '@/lib/constants';
import { Spinner, BackIcon, MoonIcon, Card } from '@/components/ui';

const SITE_URL = 'https://academy.selenaura.com';

export default function CertificatePage({ params }) {
  const router = useRouter();
  const supabase = createClient();
  const course = COURSES.find(c => c.id === params.id);

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [needsData, setNeedsData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [formName, setFormName] = useState('');
  const [formSurname, setFormSurname] = useState('');
  const [formDocType, setFormDocType] = useState('dni');
  const [formDocNumber, setFormDocNumber] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth?mode=login'); return; }

      const [certRes, profileRes] = await Promise.all([
        supabase.from('certificates').select('certificate_code, issued_at').eq('user_id', user.id).eq('course_id', params.id).single(),
        supabase.from('profiles').select('name, surname, document_type, document_number').eq('id', user.id).single(),
      ]);

      if (certRes.data) setCertificate(certRes.data);

      const p = profileRes.data;
      setProfile(p);

      if (p) {
        setFormName(p.name || '');
        setFormSurname(p.surname || '');
        setFormDocType(p.document_type || 'dni');
        setFormDocNumber(p.document_number || '');
      }

      // Check if personal data is complete for certificate
      if (certRes.data && (!p?.name || !p?.surname || !p?.document_type || !p?.document_number)) {
        setNeedsData(true);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveData(e) {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formSurname.trim() || !formDocNumber.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').update({
      name: formName.trim(),
      surname: formSurname.trim(),
      document_type: formDocType,
      document_number: formDocNumber.trim().toUpperCase(),
    }).eq('id', user.id);

    if (error) {
      setFormError('Error al guardar los datos');
      setSaving(false);
      return;
    }

    setProfile({ name: formName.trim(), surname: formSurname.trim(), document_type: formDocType, document_number: formDocNumber.trim().toUpperCase() });
    setNeedsData(false);
    setSaving(false);
  }

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

  // Data collection form
  if (needsData) {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
          <button onClick={() => router.push('/dashboard')} className="text-selene-white-dim hover:text-selene-white" aria-label="Volver">
            <BackIcon />
          </button>
          <span className="text-sm font-medium text-selene-white">Datos del certificado</span>
        </nav>

        <div className="max-w-md mx-auto px-5 py-10">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">📋</div>
            <h1 className="font-display text-2xl text-selene-white mb-2">Datos personales</h1>
            <p className="text-sm text-selene-white-dim">
              Para emitir tu certificado necesitamos verificar tus datos de identidad. Estos datos aparecerán en el certificado oficial.
            </p>
          </div>

          <form onSubmit={handleSaveData} className="space-y-4">
            <div>
              <label className="block text-xs text-selene-white-dim mb-1.5">Nombre</label>
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="w-full px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50"
              />
            </div>

            <div>
              <label className="block text-xs text-selene-white-dim mb-1.5">Apellidos</label>
              <input
                type="text"
                value={formSurname}
                onChange={e => setFormSurname(e.target.value)}
                placeholder="Tus apellidos"
                required
                className="w-full px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50"
              />
            </div>

            <div>
              <label className="block text-xs text-selene-white-dim mb-1.5">Tipo de documento</label>
              <select
                value={formDocType}
                onChange={e => setFormDocType(e.target.value)}
                className="w-full px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition"
              >
                <option value="dni">DNI</option>
                <option value="nie">NIE</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-selene-white-dim mb-1.5">Número de documento</label>
              <input
                type="text"
                value={formDocNumber}
                onChange={e => setFormDocNumber(e.target.value)}
                placeholder="12345678A"
                required
                className="w-full px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50"
              />
            </div>

            {formError && <p className="text-selene-rose text-sm">{formError}</p>}

            <p className="text-[11px] text-selene-white-dim/60 leading-relaxed">
              Tus datos se utilizan exclusivamente para la emisión del certificado y se almacenan de forma segura conforme a la normativa de protección de datos (RGPD).
            </p>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-selene-gold text-selene-bg font-semibold py-3 rounded-xl hover:brightness-110 transition text-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Continuar al certificado'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Certificate display
  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || 'Estudiante';
  const docLabel = { dni: 'DNI', nie: 'NIE', pasaporte: 'Pasaporte' }[profile?.document_type] || 'Documento';
  const docNumber = profile?.document_number || '';
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  const verifyUrl = `${SITE_URL}/verificar/${certificate.certificate_code}`;

  return (
    <div className="min-h-screen bg-selene-bg">
      <nav aria-label="Navegación del certificado" className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
        <button onClick={() => router.push('/dashboard')} className="text-selene-white-dim hover:text-selene-white" aria-label="Volver">
          <BackIcon />
        </button>
        <span className="text-sm font-medium text-selene-white">Certificado</span>
      </nav>

      <div className="max-w-[650px] mx-auto px-5 py-10">
        {/* Certificate Card */}
        <div
          id="certificate"
          className="relative overflow-hidden rounded-[20px] p-8 sm:p-12 text-center border-2 border-selene-gold/25"
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

            <p className="text-sm text-selene-white-dim mb-3">Se certifica que</p>

            <div className="font-display text-[28px] sm:text-[32px] text-selene-white font-normal italic mb-1">
              {fullName}
            </div>

            {docNumber && (
              <p className="text-[12px] text-selene-white-dim mb-4">
                {docLabel}: {docNumber}
              </p>
            )}

            <p className="text-sm text-selene-white-dim leading-relaxed mb-5">
              ha completado con éxito el curso
            </p>

            <div className="font-display text-[22px] text-selene-gold font-medium mb-2">
              {course.title}
            </div>

            <p className="text-[13px] text-selene-white-dim mb-6">
              {course.hours} de formación · {course.modules} módulos · {course.lessons_count} lecciones · Evaluación superada
            </p>

            <div className="w-16 h-px bg-selene-gold/30 mx-auto mb-5" />

            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 text-xs text-selene-white-dim mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5">Fecha de emisión</p>
                <p className="text-selene-white">{issuedDate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5">Código de verificación</p>
                <p className="text-selene-gold font-mono">{certificate.certificate_code}</p>
              </div>
            </div>

            <p className="text-[10px] text-selene-white-dim/50">
              Verificable en {SITE_URL}/verificar/{certificate.certificate_code}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-selene-gold text-selene-bg font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition text-sm"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Certificado — ${course.title}`, url: verifyUrl });
              } else {
                navigator.clipboard.writeText(verifyUrl);
              }
            }}
            className="text-selene-gold font-semibold px-8 py-3 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition text-sm"
          >
            🔗 Compartir enlace
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
