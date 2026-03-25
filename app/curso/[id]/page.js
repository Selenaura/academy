'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Card, ProgressBar, Badge, BackIcon, PlayIcon, CheckIcon, LockIcon, ArrowIcon } from '@/components/ui';

// ── Chevron Icons for slide navigation ──
function ChevronLeftIcon({ size = 20, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15,18 9,12 15,6"/></svg>;
}
function ChevronRightIcon({ size = 20, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9,6 15,12 9,18"/></svg>;
}
function BookOpenIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>;
}

// ── Slide Renderer ──
function SlideViewer({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!slides || slides.length === 0) return null;

  const slide = slides[currentSlide];
  const total = slides.length;

  function goTo(idx) {
    if (idx >= 0 && idx < total) setCurrentSlide(idx);
  }

  function renderSlide(s) {
    switch (s.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-[260px] px-6">
            <h3 className="font-display text-2xl md:text-[28px] font-normal text-selene-white leading-tight mb-3">{s.title}</h3>
            {s.subtitle && <p className="text-sm text-selene-white-dim">{s.subtitle}</p>}
          </div>
        );

      case 'content':
        return (
          <div className="flex flex-col justify-center min-h-[260px] px-6 py-5">
            <h4 className="font-display text-lg text-selene-gold mb-4">{s.title}</h4>
            <p className="text-[14px] text-selene-white-dim leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-[260px] px-8 py-5">
            <div className="text-3xl text-selene-gold/40 mb-3">"</div>
            <p className="text-[15px] text-selene-white italic leading-relaxed mb-4 max-w-[520px]">{s.text}</p>
            {s.source && <p className="text-[11px] text-selene-white-dim">{s.source}</p>}
          </div>
        );

      case 'reflection':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-[260px] px-8 py-5">
            <div className="w-12 h-12 rounded-full bg-selene-gold/10 border border-selene-gold/20 flex items-center justify-center mb-4">
              <span className="text-xl">~</span>
            </div>
            <p className="text-xs font-semibold text-selene-gold tracking-wide uppercase mb-3">Pausa y reflexiona</p>
            <p className="text-[15px] text-selene-white leading-relaxed max-w-[520px]">{s.question}</p>
          </div>
        );

      case 'summary':
        return (
          <div className="flex flex-col justify-center min-h-[260px] px-6 py-5">
            <h4 className="font-display text-lg text-selene-gold mb-4">Resumen</h4>
            <ul className="space-y-2.5">
              {(s.points || []).map((pt, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] text-selene-white-dim leading-relaxed">
                  <span className="text-selene-gold shrink-0 mt-0.5">*</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'next':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-[260px] px-8 py-5">
            <div className="text-2xl mb-3">--{'>'}</div>
            <p className="text-xs font-semibold text-selene-white-dim tracking-wide uppercase mb-3">Siguiente leccion</p>
            <p className="text-[14px] text-selene-white leading-relaxed max-w-[520px]">{s.text}</p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-[260px] px-6">
            <p className="text-[14px] text-selene-white-dim">{JSON.stringify(s)}</p>
          </div>
        );
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Slide content */}
      <div className="bg-gradient-to-br from-selene-card to-selene-elevated relative">
        {renderSlide(slide)}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-selene-border bg-selene-card">
        <button
          onClick={() => goTo(currentSlide - 1)}
          disabled={currentSlide === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-selene-elevated transition disabled:opacity-20"
        >
          <ChevronLeftIcon size={18} className="text-selene-white-dim" />
        </button>

        <span className="text-[12px] text-selene-white-dim tabular-nums">
          {currentSlide + 1} / {total}
        </span>

        <button
          onClick={() => goTo(currentSlide + 1)}
          disabled={currentSlide === total - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-selene-elevated transition disabled:opacity-20"
        >
          <ChevronRightIcon size={18} className="text-selene-white-dim" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1 pb-3 bg-selene-card">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-1.5 h-1.5 rounded-full transition ${i === currentSlide ? 'bg-selene-gold' : 'bg-selene-white/15 hover:bg-selene-white/30'}`}
          />
        ))}
      </div>
    </Card>
  );
}

export default function CoursePage({ params }) {
  const router = useRouter();
  const course = COURSES.find(c => c.id === params.id);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch lesson JSON when a lesson is selected
  useEffect(() => {
    if (!activeLesson || activeLesson.type !== 'lesson' || !course) {
      setLessonData(null);
      return;
    }
    let cancelled = false;
    setLessonLoading(true);
    setLessonData(null);

    fetch(`/courses/${course.id}/${activeLesson.id}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => { if (!cancelled) setLessonData(data); })
      .catch(() => { if (!cancelled) setLessonData(null); })
      .finally(() => { if (!cancelled) setLessonLoading(false); });

    return () => { cancelled = true; };
  }, [activeLesson, course]);

  // Navigate to adjacent lesson
  const navigateLesson = useCallback((direction) => {
    if (!course || !activeLesson) return;
    const lessons = course.lessons;
    const idx = lessons.findIndex(l => l.id === activeLesson.id);
    const nextIdx = idx + direction;
    if (nextIdx >= 0 && nextIdx < lessons.length) {
      setActiveLesson(lessons[nextIdx]);
    }
  }, [course, activeLesson]);

  async function handleEnroll() {
    if (enrolling) return;
    setEnrolling(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.enrolled) {
        router.refresh();
      } else {
        alert(data.error || 'Error al procesar. Intentalo de nuevo.');
      }
    } catch (err) {
      alert('Error de conexion. Intentalo de nuevo.');
    } finally {
      setEnrolling(false);
    }
  }

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

  // Helper: find lesson index
  const activeLessonIdx = activeLesson ? course.lessons.findIndex(l => l.id === activeLesson.id) : -1;
  const hasPrev = activeLessonIdx > 0;
  const hasNext = activeLessonIdx >= 0 && activeLessonIdx < course.lessons.length - 1;

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

  // ── Lesson Content View ──
  if (activeLesson && activeLesson.type === 'lesson') {
    return (
      <div className="min-h-screen bg-selene-bg">
        {/* Top nav */}
        <nav className="sticky top-0 z-50 px-6 py-3.5 flex items-center gap-3 border-b border-selene-border bg-selene-bg/90 backdrop-blur-xl">
          <button onClick={() => setActiveLesson(null)} className="text-selene-white-dim hover:text-selene-white">
            <BackIcon />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-selene-white truncate">{activeLesson.title}</div>
            <div className="text-[11px] text-selene-white-dim">
              Modulo {activeLesson.module} · {course.title}
            </div>
          </div>
          <div className="text-[11px] text-selene-white-dim shrink-0">
            {activeLessonIdx + 1} / {course.lessons.length}
          </div>
        </nav>

        <div className="max-w-[720px] mx-auto px-5 py-6">
          {/* Video player */}
          {activeLesson.videoUrl && (
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <video
                controls
                controlsList="nodownload"
                className="w-full h-full"
                preload="metadata"
              >
                <source src={activeLesson.videoUrl} type="video/mp4" />
                Tu navegador no soporta el reproductor de vídeo.
              </video>
            </div>
          )}

          {/* Loading state */}
          {lessonLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
              <p className="text-sm text-selene-white-dim mt-4">Cargando leccion...</p>
            </div>
          )}

          {/* Lesson content */}
          {!lessonLoading && lessonData && (
            <>
              {/* Title */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpenIcon size={14} className="text-selene-gold" />
                  <span className="text-[11px] text-selene-gold font-semibold tracking-wide uppercase">
                    Leccion {lessonData.lesson_number}
                  </span>
                </div>
                <h1 className="font-display text-[24px] md:text-[28px] font-normal text-selene-white leading-tight">
                  {lessonData.title}
                </h1>
              </div>

              {/* Text content */}
              <Card className="p-6 md:p-8 mb-6">
                <div className="prose-selene">
                  {lessonData.text_content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-[14px] md:text-[15px] text-selene-white-dim leading-[1.8] mb-5 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>

              {/* Slides */}
              {lessonData.slides && lessonData.slides.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-selene-white-dim mb-3 flex items-center gap-2">
                    <span>Diapositivas</span>
                    <span className="text-[11px] text-selene-white-dim font-normal">({lessonData.slides.length})</span>
                  </h3>
                  <SlideViewer slides={lessonData.slides} />
                </div>
              )}

              {/* Citation */}
              {lessonData.citation && (
                <div className="bg-selene-blue/5 rounded-xl p-4 border border-selene-blue/10 mb-6">
                  <div className="text-xs font-semibold text-selene-blue-light mb-1.5">Referencia cientifica</div>
                  <div className="text-[13px] text-selene-white-dim leading-relaxed">
                    <span className="text-selene-white font-medium">{lessonData.citation.researcher} ({lessonData.citation.year})</span>
                    {' — '}
                    {lessonData.citation.finding}
                  </div>
                </div>
              )}

              {/* Complete lesson button */}
              <button className="w-full bg-selene-gold text-selene-bg font-semibold py-3.5 rounded-xl hover:brightness-110 transition mb-4">
                Completar leccion
              </button>

              {/* Prev / Next navigation */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => navigateLesson(-1)}
                  disabled={!hasPrev}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-selene-border text-sm text-selene-white-dim hover:border-selene-gold/30 hover:text-selene-white transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeftIcon size={16} /> Anterior
                </button>
                <button
                  onClick={() => navigateLesson(1)}
                  disabled={!hasNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-selene-border text-sm text-selene-white-dim hover:border-selene-gold/30 hover:text-selene-white transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  Siguiente <ChevronRightIcon size={16} />
                </button>
              </div>

              {/* Lesson list (collapsible) */}
              <details className="group">
                <summary className="text-sm font-semibold text-selene-white-dim mb-3 cursor-pointer list-none flex items-center gap-2">
                  <ChevronRightIcon size={14} className="text-selene-white-dim group-open:rotate-90 transition-transform" />
                  Todas las lecciones
                </summary>
                <div className="mt-2">
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
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] truncate ${lesson.id === activeLesson.id ? 'text-selene-gold' : 'text-selene-white'}`}>{lesson.title}</div>
                        <div className="text-[11px] text-selene-white-dim">
                          {lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'exam' ? 'Evaluacion' : 'Leccion'} · {lesson.duration}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </details>
            </>
          )}

          {/* Error / no data */}
          {!lessonLoading && !lessonData && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-sm text-selene-white-dim mb-4">No se pudo cargar el contenido de esta leccion.</p>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-sm text-selene-gold hover:underline"
              >
                Volver al curso
              </button>
            </div>
          )}
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
          <div className="flex gap-4 text-xs text-selene-white-dim flex-wrap relative z-10">
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
          <div className="text-xs font-semibold text-selene-blue-light mb-1.5">Base científica</div>
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
                   <BookOpenIcon size={14} className="text-selene-white-dim" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-selene-white font-medium mb-0.5 truncate">{lesson.title}</div>
                  <div className="text-[11px] text-selene-white-dim">
                    {lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'exam' ? 'Evaluación' : 'Lección'} · {lesson.duration}
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
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-selene-gold text-selene-bg font-semibold px-8 py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-60"
            >
              {enrolling ? 'Procesando...' : course.price === 0 ? 'Inscribirse gratis' : `Comprar por ${course.price_label}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
