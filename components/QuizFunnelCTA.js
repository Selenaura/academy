'use client';

import { useState } from 'react';
import Link from 'next/link';

const QUIZ_QUESTIONS = [
  {
    q: 'Cuando tienes un problema importante, lo primero que haces es...',
    options: [
      { text: 'Analizar los datos y buscar informacion', archetype: 'sabio' },
      { text: 'Escuchar mi instinto — suelo acertar', archetype: 'intuitivo' },
      { text: 'Hablar con alguien de confianza', archetype: 'guia' },
      { text: 'Meditar o buscar un momento de silencio', archetype: 'mistico' },
    ],
  },
  {
    q: 'Te sientes mas conectada contigo misma cuando...',
    options: [
      { text: 'Aprendo algo nuevo que explica como funciono', archetype: 'sabio' },
      { text: 'Estoy en la naturaleza o bajo las estrellas', archetype: 'mistico' },
      { text: 'Ayudo a alguien a entenderse mejor', archetype: 'guia' },
      { text: 'Tengo un presentimiento y se cumple', archetype: 'intuitivo' },
    ],
  },
  {
    q: 'Si pudieras desarrollar un don, elegirias...',
    options: [
      { text: 'Leer las cartas natales como un libro abierto', archetype: 'sabio' },
      { text: 'Percibir la energia de las personas al instante', archetype: 'intuitivo' },
      { text: 'Guiar a otros en su proceso de transformacion', archetype: 'guia' },
      { text: 'Conectar con dimensiones mas profundas de la realidad', archetype: 'mistico' },
    ],
  },
];

const ARCHETYPES = {
  sabio: {
    name: 'La Sabia',
    icon: '🔮',
    desc: 'Tu mente analitica es tu mayor fortaleza. Necesitas entender el porqué de todo — y eso te hace una estudiante excepcional.',
    course: 'Astrologia Natal Profunda',
    courseId: 'astrologia-natal',
  },
  intuitivo: {
    name: 'La Intuitiva',
    icon: '✨',
    desc: 'Tu intuicion es un don natural. Con el entrenamiento adecuado, puede convertirse en una herramienta de precision extraordinaria.',
    course: 'Tarot Intuitivo',
    courseId: 'tarot-intuitivo',
  },
  guia: {
    name: 'La Guia',
    icon: '🌟',
    desc: 'Tienes un don natural para acompanar a otros. Tu camino es aprender para ensenar — y tienes el potencial de transformar vidas.',
    course: 'Registros Akashicos',
    courseId: 'registros-akashicos',
  },
  mistico: {
    name: 'La Mistica',
    icon: '🌙',
    desc: 'Percibes capas de realidad que otros no ven. Tu sensibilidad es un superpoder que merece ser cultivado con metodo.',
    course: 'Meditacion con Base Cientifica',
    courseId: 'meditacion-cientifica',
  },
};

export default function QuizFunnelCTA() {
  const [step, setStep] = useState(-1); // -1 = CTA, 0-2 = questions, 3 = result
  const [scores, setScores] = useState({ sabio: 0, intuitivo: 0, guia: 0, mistico: 0 });
  const [result, setResult] = useState(null);

  function handleAnswer(archetype) {
    const newScores = { ...scores, [archetype]: scores[archetype] + 1 };
    setScores(newScores);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(ARCHETYPES[winner]);
      setStep(QUIZ_QUESTIONS.length);
    }
  }

  // Initial CTA state
  if (step === -1) {
    return (
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="bg-gradient-to-br from-selene-card to-selene-bg rounded-2xl border-2 border-selene-gold/30 p-8 md:p-10 text-center relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-selene-gold/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-selene-gold/5 to-transparent" />

          <div className="relative">
            <div className="inline-block text-[10px] font-bold text-selene-gold uppercase tracking-wider bg-selene-gold/10 px-3 py-1 rounded-full mb-4">
              Test de 60 segundos
            </div>
            <h2 className="font-display text-[24px] md:text-[28px] font-normal text-selene-white mb-3">
              Descubre tu arquetipo espiritual
            </h2>
            <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-6 leading-relaxed">
              3 preguntas. 1 minuto. Descubre cual es tu don dormido
              y que camino formativo encaja contigo.
            </p>
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-2 text-[15px] font-semibold bg-selene-gold text-selene-bg px-8 py-3.5 rounded-xl hover:brightness-110 transition"
            >
              Hacer el test gratis
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Questions
  if (step < QUIZ_QUESTIONS.length) {
    const question = QUIZ_QUESTIONS[step];
    return (
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="bg-selene-card rounded-2xl border border-selene-gold/30 p-8 md:p-10">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[11px] text-selene-white-dim">
              Pregunta {step + 1} de {QUIZ_QUESTIONS.length}
            </div>
            <div className="flex-1 h-1 bg-selene-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-selene-gold rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="font-display text-lg text-selene-white mb-6 leading-snug">
            {question.q}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.archetype)}
                className="w-full text-left px-5 py-4 rounded-xl border border-selene-border bg-selene-bg hover:border-selene-gold/40 hover:bg-selene-gold/5 transition text-[14px] text-selene-white-dim hover:text-selene-white"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Result
  if (result) {
    return (
      <section className="px-6 py-16 max-w-[800px] mx-auto">
        <div className="bg-gradient-to-br from-selene-card to-selene-bg rounded-2xl border-2 border-selene-gold/30 p-8 md:p-10 text-center">
          <div className="text-4xl mb-4">{result.icon}</div>
          <div className="text-[11px] font-bold text-selene-gold uppercase tracking-wider mb-2">
            Tu arquetipo es
          </div>
          <h3 className="font-display text-2xl text-selene-white mb-3">{result.name}</h3>
          <p className="text-sm text-selene-white-dim max-w-md mx-auto mb-6 leading-relaxed">
            {result.desc}
          </p>

          <div className="bg-selene-bg/60 rounded-xl border border-selene-border p-4 mb-6 inline-block">
            <p className="text-[11px] text-selene-white-dim uppercase tracking-wider mb-1">
              Curso recomendado para ti
            </p>
            <p className="text-selene-gold font-display font-medium">{result.course}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center justify-center text-[14px] font-semibold bg-selene-gold text-selene-bg px-8 py-3.5 rounded-xl hover:brightness-110 transition no-underline"
            >
              Empieza gratis
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center text-[14px] font-semibold text-selene-gold px-8 py-3.5 rounded-xl border border-selene-gold/30 hover:bg-selene-gold/5 transition no-underline"
            >
              Ver todos los cursos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
