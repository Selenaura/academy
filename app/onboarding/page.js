'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { MoonIcon, CheckIcon } from '@/components/ui';

const INTERESTS = [
  { id: 'astro', label: 'Astrología', icon: '🌙' },
  { id: 'tarot', label: 'Tarot', icon: '✨' },
  { id: 'med', label: 'Meditación', icon: '🧘' },
  { id: 'crono', label: 'Cronobiología', icon: '🧬' },
  { id: 'quiro', label: 'Quirología', icon: '🤚' },
  { id: 'suenos', label: 'Sueños', icon: '💫' },
];

const EXP_LEVELS = [
  { id: 'none', label: 'Soy nueva en esto' },
  { id: 'basic', label: 'Conozco lo básico' },
  { id: 'inter', label: 'Nivel intermedio' },
  { id: 'adv', label: 'Tengo experiencia' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [interests, setInterests] = useState([]);
  const [experience, setExperience] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  async function handleAnalyze() {
    setAnalyzing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save to profiles table
        await supabase
          .from('profiles')
          .update({
            birth_date: birthDate || null,
            birth_time: birthTime || null,
            birth_city: birthCity || null,
            interests,
            experience_level: experience,
            onboarding_complete: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // Also update user metadata for quick access
        await supabase.auth.updateUser({
          data: { onboarding_complete: true },
        });
      }
    } catch (err) {
      console.error('Error saving onboarding data:', err);
    }

    // Simulate analysis
    setTimeout(() => {
      setAnalyzing(false);
      setStep(3);
    }, 2500);
  }

  const inputClass = "w-full px-4 py-3.5 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition";

  // ── Analyzing overlay ──
  if (analyzing) {
    return (
      <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
        <p className="font-display text-xl text-selene-gold mt-6">Consultando las estrellas...</p>
        <p className="text-sm text-selene-white-dim mt-2">Analizando tu carta natal</p>
      </div>
    );
  }

  // ── Step content ──
  const steps = [
    // Step 0: Birth data
    <>
      <div className="text-center mb-8">
        <div className="text-[40px] mb-4">🌟</div>
        <h2 className="font-display text-2xl font-normal mb-2">Tu mapa cósmico</h2>
        <p className="text-[13px] text-selene-white-dim">Tu carta natal personaliza tu ruta formativa</p>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-selene-white-dim block mb-1.5">Fecha de nacimiento</label>
          <input type="date" className={inputClass} value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs text-selene-white-dim block mb-1.5">Hora de nacimiento (opcional)</label>
          <input type="time" className={inputClass} value={birthTime} onChange={e => setBirthTime(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-selene-white-dim block mb-1.5">Ciudad de nacimiento</label>
          <input className={inputClass} placeholder="Ej: Sevilla, España" value={birthCity} onChange={e => setBirthCity(e.target.value)} />
        </div>
      </div>
      <button onClick={() => setStep(1)} className="w-full mt-6 bg-selene-gold text-selene-bg font-semibold py-3.5 rounded-xl btn-gold-hover">
        Continuar
      </button>
    </>,

    // Step 1: Interests
    <>
      <div className="text-center mb-8">
        <div className="text-[40px] mb-4">✨</div>
        <h2 className="font-display text-2xl font-normal mb-2">¿Qué te llama?</h2>
        <p className="text-[13px] text-selene-white-dim">Selecciona todo lo que te interese</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {INTERESTS.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleInterest(opt.id)}
            className={`rounded-2xl p-4 text-center transition border ${
              interests.includes(opt.id)
                ? 'border-selene-gold bg-selene-gold/5 border-2'
                : 'border-selene-border bg-selene-card'
            }`}
          >
            <div className="text-2xl mb-1.5">{opt.icon}</div>
            <div className={`text-[13px] ${interests.includes(opt.id) ? 'text-selene-gold' : 'text-selene-white-dim'}`}>
              {opt.label}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => setStep(2)} className="w-full mt-6 bg-selene-gold text-selene-bg font-semibold py-3.5 rounded-xl btn-gold-hover">
        Continuar
      </button>
    </>,

    // Step 2: Experience
    <>
      <div className="text-center mb-8">
        <div className="text-[40px] mb-4">🧭</div>
        <h2 className="font-display text-2xl font-normal mb-2">Tu nivel actual</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {EXP_LEVELS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setExperience(opt.id)}
            className={`rounded-2xl p-4 text-left flex items-center justify-between transition border ${
              experience === opt.id
                ? 'border-selene-gold bg-selene-gold/5 border-2'
                : 'border-selene-border bg-selene-card'
            }`}
          >
            <span className={`text-sm ${experience === opt.id ? 'text-selene-gold' : 'text-selene-white'}`}>{opt.label}</span>
            {experience === opt.id && <CheckIcon size={18} className="text-selene-gold" />}
          </button>
        ))}
      </div>
      <button
        onClick={handleAnalyze}
        disabled={!experience}
        className="w-full mt-6 bg-selene-gold text-selene-bg font-semibold py-3.5 rounded-xl btn-gold-hover disabled:opacity-40"
      >
        Generar mi ruta formativa
      </button>
    </>,

    // Step 3: Result
    <>
      <div className="text-center mb-8">
        <div className="text-[48px] mb-4">🌙</div>
        <h2 className="font-display text-2xl font-normal text-selene-gold mb-2">Tu ruta Selene está lista</h2>
        <p className="text-[13px] text-selene-white-dim">Personalizada según tu perfil cósmico</p>
      </div>

      <div className="bg-selene-card rounded-2xl border-2 border-selene-gold/25 p-5 mb-4">
        <div className="text-[11px] text-selene-gold font-semibold mb-3 tracking-[0.1em] uppercase">✦ Tu camino recomendado</div>
        {[
          { n: 1, t: 'Despierta tu Brújula Interior', tag: 'GRATIS', free: true },
          { n: 2, t: 'Magnetismo Consciente', tag: '€24,99', free: false },
          { n: 3, t: 'Astrología Natal Profunda', tag: '€29,99', free: false },
        ].map((c, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-selene-border' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-selene-gold/10 flex items-center justify-center text-xs text-selene-gold font-semibold shrink-0">
              {c.n}
            </div>
            <div className="flex-1 text-sm text-selene-white">{c.t}</div>
            <span className={`text-[11px] font-semibold ${c.free ? 'text-selene-success' : 'text-selene-gold'}`}>{c.tag}</span>
          </div>
        ))}
      </div>

      <div className="bg-selene-blue/10 rounded-xl p-4 border border-selene-blue/15 text-xs text-selene-white-dim leading-relaxed mb-6">
        <strong className="text-selene-blue-light">¿Por qué esta ruta?</strong><br />
        Tus intereses y nivel de experiencia sugieren este camino progresivo.
        Empieza con los fundamentos gratuitos y avanza a tu ritmo.
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full bg-selene-gold text-selene-bg font-semibold text-[15px] py-3.5 rounded-xl btn-gold-hover"
      >
        Empezar mi formación
      </button>
    </>,
  ];

  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[440px]">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 h-0.5 rounded-full transition-colors ${i <= step ? 'bg-selene-gold' : 'bg-selene-border'}`} />
          ))}
        </div>

        {steps[step]}

        {step > 0 && step < 3 && (
          <button onClick={() => setStep(step - 1)} className="block mx-auto mt-3 text-sm text-selene-white-dim hover:text-selene-white transition">
            ← Atrás
          </button>
        )}
      </div>
    </div>
  );
}
