'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Card, ProgressBar, Badge, BackIcon, PlayIcon, CheckIcon, LockIcon, ArrowIcon } from '@/components/ui';

export default function CoursePage({ params }) {
  const router = useRouter();
  const course = COURSES.find(c => c.id === params.id);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-selene-white-dim mb-4">Curso no encontrado</p>
          <Link href="/dashboard" className="text-selene-gold">← Volver al dashboard</Link>
        </div>
      </div>
    );
  }

  // Mock enrollment (in production, fetch from Supabase)
  const isEnrolled = course.id === 'brujula-interior' || course.id === 'magnetismo-consciente';
  const progress = course.id === 'brujula-interior' ? 0.35 : course.id === 'magnetismo-consciente' ? 0.12 : 0;

  // Mock completed lessons
  const completedLessons = course.lessons.length > 0
    ? new Set(course.lessons.slice(0, Math.floor(course.lessons.length * progress)).map(l => l.id))
    : new Set();

  // Mock quiz questions
  const quizQuestions = [
    {
      q: '¿Qué estructura cerebral se modifica con la práctica meditativa según los estudios de neuroplasticidad?',
      options: ['El hipocampo', 'La corteza prefrontal', 'La amígdala', 'Todas las anteriores'],
      correct: 3,
    },
    {
      q: '¿Qué protocolo tiene la mayor base de evidencia peer-reviewed para meditación?',
      options: ['Visualización creativa', 'MBSR (Mindfulness-Based Stress Reduction)', 'Meditación trascendental', 'Yoga nidra'],
      correct: 1,
    },
    {
      q: 'La cronobiología estudia:',
      options: ['Los horóscopos diarios', 'Los ritmos biológicos y su sincronización', 'La astrología natal', 'Las fases lunares exclusivamente'],
      correct: 1,
    },
  ];

  // ── Quiz/Exam View ──
  if (activeLesson && (activeLesson.type === 'quiz' || activeLesson.type === 'exam')) {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
          <button onClick={() => { setActiveLesson(null); setQuizAnswers({}); setQuizSubmitted(false); }} className="text-selene-white-dim hover:text-selene-white">
            <BackIcon />
          </button>
          <span className="text-sm font-medium text-selene-white">{activeLesson.title}</span>
        </nav>

        <div className="max-w-[640px] mx-auto px-5 py-8">
          <div className="text-center mb-10">
            <div className="text-4xl mb-3">{activeLesson.type === 'exam' ? '🎓' : '📝'}</div>
            <h2 className="font-display text-[22px] font-normal mb-1.5">
              {activeLesson.type === 'exam' ? 'Evaluación Final' : activeLesson.title}
            </h2>
            <p className="text-[13px] text-selene-white-dim">{quizQuestions.length} preguntas · Necesitas 70% para aprobar</p>
          </div>

          {quizQuestions.map((q, qi) => (
            <Card key={qi} className="p-5 mb-4">
              <div className="text-sm font-medium text-selene-white mb-4 leading-relaxed">
                <span className="text-selene-gold mr-2">{qi + 1}.</span>{q.q}
              </div>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const selected = quizAnswers[qi] === oi;
                  const isCorrect = quizSubmitted && oi === q.correct;
                  const isWrong = quizSubmitted && selected && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      disabled={quizSubmitted}
                      className={`text-left p-3 rounded-xl text-[13px] transition border ${
                        isCorrect ? 'bg-selene-success/10 border-selene-success text-selene-success' :
                        isWrong ? 'bg-selene-rose/10 border-selene-rose text-selene-rose' :
                        selected ? 'bg-selene-gold/5 border-selene-gold/50 text-selene-gold' :
                        'bg-selene-elevated border-selene-border text-selene-white-dim hover:border-selene-gold/30'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}

          {!quizSubmitted ? (
            <button
              onClick={() => Object.keys(quizAnswers).length === quizQuestions.length && setQuizSubmitted(true)}
              disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
              className="w-full mt-2 bg-selene-gold text-selene-bg font-semibold py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-40"
            >
              Enviar respuestas
            </button>
          ) : (
            <div className="text-center mt-6">
              <Card className="p-6 border-selene-gold/25 bg-gradient-to-b from-selene-card to-selene-gold/5">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-display text-xl text-selene-gold mb-2">¡Evaluación completada!</h3>
                <p className="text-sm text-selene-white-dim mb-1">
                  Resultado: {quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length}/{quizQuestions.length} correctas
                </p>
                <p className="text-[13px] text-selene-success">Has desbloqueado el certificado</p>
                <button
                  onClick={() => router.push(`/curso/${course.id}/certificado`)}
                  className="mt-4 bg-selene-gold text-selene-bg font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition"
                >
                  Ver mi certificado
                </button>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Video Player View ──
  if (activeLesson && activeLesson.type === 'video') {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
          <button onClick={() => setActiveLesson(null)} className="text-selene-white-dim hover:text-selene-white">
            <BackIcon />
          </button>
          <div>
            <div className="text-sm font-medium text-selene-white">{activeLesson.title}</div>
            <div className="text-[11px] text-selene-white-dim">{course.title}</div>
          </div>
        </nav>

        <div className="max-w-[720px] mx-auto">
          {/* Video area */}
          <div className="aspect-video bg-gradient-to-br from-selene-card to-selene-elevated flex items-center justify-center relative border-b border-selene-border">
            <div className="absolute inset-0 star-pattern" />
            <div className="w-[72px] h-[72px] rounded-full bg-selene-gold/15 flex items-center justify-center cursor-pointer border-2 border-selene-gold/40 hover:bg-selene-gold/25 transition z-10">
              <PlayIcon size={28} className="text-selene-gold" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <span className="text-[11px] text-selene-white-dim">0:00</span>
              <div className="flex-1 h-[3px] bg-selene-white/20 rounded-full">
                <div className="w-0 h-full bg-selene-gold rounded-full" />
              </div>
              <span className="text-[11px] text-selene-white-dim">{activeLesson.duration}</span>
            </div>
          </div>

          {/* Lesson info */}
          <div className="px-5 py-6">
            <h2 className="font-display text-[22px] font-normal mb-2">{activeLesson.title}</h2>
            <div className="flex gap-4 text-xs text-selene-white-dim mb-5">
              <span>{activeLesson.duration}</span>
              <span>·</span>
              <span>{course.title}</span>
            </div>

            <div className="bg-selene-blue/5 rounded-xl p-4 border border-selene-blue/10 mb-5">
              <div className="text-xs font-semibold text-selene-blue-light mb-1.5">📚 Base científica</div>
              <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.science}</div>
            </div>

            {/* Lesson list */}
            <h3 className="text-sm font-semibold mb-3 text-selene-white-dim">Todas las lecciones</h3>
            {course.lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`flex items-center gap-3 py-3 w-full text-left ${i > 0 ? 'border-t border-selene-border' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                  completedLessons.has(lesson.id) ? 'bg-selene-success/15' :
                  lesson.id === activeLesson.id ? 'bg-selene-gold/15 border border-selene-gold/30' :
                  'bg-selene-elevated'
                }`}>
                  {completedLessons.has(lesson.id) ? <CheckIcon size={14} /> :
                   lesson.type === 'quiz' || lesson.type === 'exam' ? <span className="text-xs">{lesson.type === 'exam' ? '🎓' : '📝'}</span> :
                   <span className="text-[10px] text-selene-white-dim">{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className={`text-[13px] ${lesson.id === activeLesson.id ? 'text-selene-gold' : 'text-selene-white'}`}>{lesson.title}</div>
                  <div className="text-[11px] text-selene-white-dim">{lesson.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Course Overview ──
  return (
    <div className="min-h-screen bg-selene-bg">
      <nav className="sticky top-0 z-50 px-6 py-3.5 flex items-center gap-3 border-b border-selene-border bg-selene-bg/90 backdrop-blur-xl">
        <button onClick={() => router.push('/dashboard')} className="text-selene-white-dim hover:text-selene-white">
          <BackIcon />
        </button>
        <span className="text-sm font-medium text-selene-white">Detalle del curso</span>
      </nav>

      <div className="max-w-[680px] mx-auto px-5 py-6">
        {/* Header */}
        <Card className="p-7 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #12121A, ${course.color}08)`, borderColor: `${course.color}30` }}>
          <div className="absolute -top-5 -right-5 text-[80px] opacity-[0.06]">{course.icon}</div>
          <Badge color={course.color} className="relative z-10">{course.tag}</Badge>
          <h1 className="font-display text-[26px] font-normal mt-4 mb-1.5 relative z-10">{course.title}</h1>
          <p className="text-sm text-selene-white-dim leading-relaxed mb-4 relative z-10">{course.subtitle}</p>
          <div className="flex gap-2 sm:gap-4 text-xs text-selene-white-dim flex-wrap relative z-10">
            <span>{course.level}</span><span>·</span>
            <span>{course.hours}</span><span>·</span>
            <span>{course.modules} módulos</span><span>·</span>
            <span className={`font-bold ${course.price === 0 ? 'text-selene-success' : 'text-selene-gold'}`}>{course.price_label}</span>
          </div>

          {isEnrolled && progress > 0 && (
            <div className="mt-4 relative z-10">
              <div className="flex justify-between text-[11px] text-selene-white-dim mb-1">
                <span>Progreso</span><span>{Math.round(progress * 100)}%</span>
              </div>
              <ProgressBar value={progress} color={course.color} />
            </div>
          )}
        </Card>

        {/* Description */}
        <Card className="p-5 mb-4">
          <h3 className="text-sm font-semibold text-selene-white mb-2">Descripción</h3>
          <p className="text-[13px] text-selene-white-dim leading-relaxed">{course.description}</p>
        </Card>

        {/* Science basis */}
        <div className="bg-selene-blue/5 rounded-2xl p-[18px] border border-selene-blue/10 mb-4">
          <div className="text-xs font-semibold text-selene-blue-light mb-1.5">🔬 Base científica</div>
          <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.science}</div>
        </div>

        {/* For whom & outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <div className="text-xs font-semibold text-selene-gold mb-1.5">¿Para quién?</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.for_whom}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs font-semibold text-selene-success mb-1.5">Resultado</div>
            <div className="text-[13px] text-selene-white-dim leading-relaxed">{course.outcome}</div>
          </Card>
        </div>

        {/* Lessons */}
        {course.lessons.length > 0 ? (
          <div>
            <h3 className="font-display text-lg font-medium mb-4">Contenido del curso</h3>
            {course.lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => isEnrolled ? setActiveLesson(lesson) : null}
                disabled={!isEnrolled}
                className="flex items-center gap-3.5 p-4 w-full bg-selene-card border border-selene-border rounded-xl text-left mb-2 hover:border-selene-gold/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className={`w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center border ${
                  completedLessons.has(lesson.id) ? 'bg-selene-success/10 border-selene-success/20' : 'bg-selene-elevated border-selene-border'
                }`}>
                  {completedLessons.has(lesson.id) ? <CheckIcon size={16} /> :
                   lesson.type === 'quiz' ? <span className="text-sm">📝</span> :
                   lesson.type === 'exam' ? <span className="text-sm">🎓</span> :
                   <PlayIcon size={14} className="text-selene-white-dim" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-selene-white font-medium mb-0.5 truncate">{lesson.title}</div>
                  <div className="text-[11px] text-selene-white-dim">
                    {lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'exam' ? 'Evaluación' : 'Vídeo'} · {lesson.duration}
                  </div>
                </div>
                <ArrowIcon size={14} className="text-selene-white-dim shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <LockIcon size={32} className="text-selene-white-dim mx-auto" />
            <p className="text-sm text-selene-white-dim mt-3 mb-4">Inscríbete para ver el contenido completo</p>
            <button className="bg-selene-gold text-selene-bg font-semibold px-8 py-3.5 rounded-xl hover:brightness-110 transition">
              {course.price === 0 ? 'Inscribirse gratis' : `Comprar por ${course.price_label}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
