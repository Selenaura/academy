'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Card, BackIcon } from '@/components/ui';
import { FlipCards, MatchExercise, HotspotImage, FillBlanks, SortExercise, KeyConcept, ProgressCheck } from '@/components/InteractiveElements';

// Slide viewer component
function SlideViewer({ slides }) {
  const [idx, setIdx] = useState(0);
  if (!slides || !slides.length) return null;
  const s = slides[idx];

  return (
    <div className="bg-selene-card border border-selene-border rounded-xl overflow-hidden">
      <div className="min-h-[200px] p-5 flex flex-col justify-center">
        {s.type === 'title' && (
          <div className="text-center">
            <h4 className="font-display text-xl text-selene-white mb-1">{s.title}</h4>
            {s.subtitle && <p className="text-xs text-selene-white-dim">{s.subtitle}</p>}
          </div>
        )}
        {s.type === 'content' && (
          <div>
            <h4 className="text-sm font-semibold text-selene-gold mb-2">{s.title}</h4>
            <p className="text-[13px] text-selene-white-dim leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        )}
        {s.type === 'quote' && (
          <div className="text-center px-4">
            <p className="text-[14px] text-selene-white italic mb-2">&ldquo;{s.text}&rdquo;</p>
            {s.source && <p className="text-[11px] text-selene-white-dim">{s.source}</p>}
          </div>
        )}
        {s.type === 'reflection' && (
          <div className="text-center px-4">
            <p className="text-xs text-selene-gold font-semibold mb-2">REFLEXIÓN</p>
            <p className="text-[14px] text-selene-white">{s.question}</p>
          </div>
        )}
        {s.type === 'summary' && (
          <div>
            <h4 className="text-sm font-semibold text-selene-gold mb-2">Resumen</h4>
            <ul className="space-y-1.5">
              {(s.points || []).map((p, i) => (
                <li key={i} className="text-[13px] text-selene-white-dim flex gap-2">
                  <span className="text-selene-gold shrink-0">•</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {s.type === 'next' && (
          <div className="text-center">
            <p className="text-xs text-selene-white-dim mb-1">SIGUIENTE</p>
            <p className="text-[13px] text-selene-white">{s.text}</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-selene-border bg-selene-elevated/50">
        <button onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0} className="text-xs text-selene-white-dim disabled:opacity-20">← Ant</button>
        <span className="text-[11px] text-selene-white-dim">{idx + 1}/{slides.length}</span>
        <button onClick={() => idx < slides.length - 1 && setIdx(idx + 1)} disabled={idx === slides.length - 1} className="text-xs text-selene-white-dim disabled:opacity-20">Sig →</button>
      </div>
    </div>
  );
}

// Lesson content viewer
function LessonView({ courseId, lessonId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/courses/${courseId}/${lessonId}.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  if (loading) return <div className="py-10 text-center text-selene-white-dim">Cargando...</div>;
  if (!data) return <div className="py-10 text-center text-selene-white-dim">Sin contenido aún para esta lección.</div>;

  const course = COURSES.find(c => c.id === courseId);
  const lesson = course?.lessons?.find(l => l.id === lessonId);

  return (
    <div>
      <button onClick={onClose} className="text-sm text-selene-gold mb-4 hover:underline">← Volver al curso</button>

      <h2 className="font-display text-2xl text-selene-white mb-1">{data.title}</h2>
      <p className="text-xs text-selene-white-dim mb-6">Módulo {data.module} · Lección {data.lesson_number}</p>

      {/* Video if available */}
      {lesson?.videoUrl && (
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
          <video controls controlsList="nodownload" className="w-full h-full" preload="metadata">
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Text content */}
      <Card className="p-6 mb-6">
        <div className="text-[14px] text-selene-white-dim leading-[1.8]">
          {data.text_content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={i} className="text-[16px] font-display font-semibold text-selene-gold mt-8 mb-3 first:mt-0">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            const isCaso = paragraph.startsWith('**Caso práctico');
            const isEjercicio = paragraph.startsWith('**Ejercicio guiado');
            const isTarea = paragraph.startsWith('**Tarea para casa');
            if (isCaso) {
              return (
                <div key={i} className="my-6 p-5 bg-selene-purple/5 border-l-[3px] border-selene-purple rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📋</span>
                    <span className="text-sm font-semibold text-selene-purple">Caso práctico</span>
                  </div>
                  <p className="text-[14px] text-selene-white-dim leading-[1.8]" style={{ textAlign: 'justify' }}>
                    {paragraph.replace(/\*\*Caso práctico[^*]*\*\*\s*/, '')}
                  </p>
                </div>
              );
            }
            if (isEjercicio) {
              return (
                <div key={i} className="my-6 p-5 bg-selene-gold/5 border-l-[3px] border-selene-gold rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm font-semibold text-selene-gold">Ejercicio guiado</span>
                  </div>
                  <p className="text-[14px] text-selene-white-dim leading-[1.8]" style={{ textAlign: 'justify' }}>
                    {paragraph.replace(/\*\*Ejercicio guiado[^*]*\*\*\s*/, '')}
                  </p>
                </div>
              );
            }
            if (isTarea) {
              return (
                <div key={i} className="my-6 p-5 bg-selene-success/5 border-l-[3px] border-selene-success rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📝</span>
                    <span className="text-sm font-semibold text-selene-success">Tarea para casa</span>
                  </div>
                  <p className="text-[14px] text-selene-white-dim leading-[1.8]" style={{ textAlign: 'justify' }}>
                    {paragraph.replace(/\*\*Tarea para casa[^*]*\*\*\s*/, '')}
                  </p>
                </div>
              );
            }
            const hasBold = paragraph.includes('**');
            if (hasBold) {
              const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="mb-4 last:mb-0" style={{ textAlign: 'justify' }}>
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={j} className="text-selene-white font-semibold">{part.replace(/\*\*/g, '')}</strong>
                      : <span key={j}>{part}</span>
                  )}
                </p>
              );
            }
            return <p key={i} className="mb-4 last:mb-0" style={{ textAlign: 'justify' }}>{paragraph}</p>;
          })}
        </div>
      </Card>

      {/* Slides */}
      {data.slides?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-selene-white mb-3">Diapositivas ({data.slides.length})</h3>
          <SlideViewer slides={data.slides} />
        </div>
      )}

      {/* Interactive exercises */}
      {data.interactive?.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-semibold text-selene-white mb-3">Ejercicios interactivos</h3>
          {data.interactive.map((el, i) => {
            switch (el.type) {
              case 'flip_cards': return <FlipCards key={i} cards={el.cards} />;
              case 'match': return <MatchExercise key={i} title={el.title} pairs={el.pairs} instruction={el.instruction} />;
              case 'hotspot': return <HotspotImage key={i} imageUrl={el.imageUrl} altText={el.altText} hotspots={el.hotspots} title={el.title} />;
              case 'fill_blanks': return <FillBlanks key={i} text={el.text} blanks={el.blanks} title={el.title} />;
              case 'sort': return <SortExercise key={i} title={el.title} items={el.items} instruction={el.instruction} />;
              case 'key_concept': return <KeyConcept key={i} term={el.term} definition={el.definition} icon={el.icon} source={el.source} />;
              case 'progress_check': return <ProgressCheck key={i} questions={el.questions} />;
              default: return null;
            }
          })}
        </div>
      )}

      {/* Citations */}
      {data.citation && (
        <div className="bg-selene-blue/5 rounded-xl p-4 border border-selene-blue/10 mb-4">
          <div className="text-xs font-semibold text-selene-blue-light mb-2">Referencias científicas</div>
          {Array.isArray(data.citation) ? data.citation.map((c, i) => (
            <div key={i} className="text-[13px] text-selene-white-dim mb-1.5 last:mb-0">
              <span className="text-selene-white font-medium">{c.researcher} ({c.year})</span>
              {' — '}{c.finding}
            </div>
          )) : (
            <div className="text-[13px] text-selene-white-dim">
              <span className="text-selene-white font-medium">{data.citation.researcher} ({data.citation.year})</span>
              {' — '}{data.citation.finding}
            </div>
          )}
        </div>
      )}

      {/* Bibliography */}
      {data.bibliography?.length > 0 && (
        <div className="bg-selene-elevated/50 rounded-xl p-4 border border-selene-border mb-4">
          <div className="text-xs font-semibold text-selene-white-dim mb-2">Bibliografía</div>
          {data.bibliography.map((b, i) => (
            <div key={i} className="text-[12px] text-selene-white-dim mb-1 last:mb-0">
              {b.author} ({b.year}). <em>{b.title}</em>. {b.type === 'paper' ? '📄' : '📖'}
            </div>
          ))}
        </div>
      )}

      {/* Homework */}
      {data.homework && (
        <div className="bg-selene-gold/5 rounded-xl p-4 border border-selene-gold/20 mb-4">
          <div className="text-xs font-semibold text-selene-gold mb-2">📋 Tarea para casa</div>
          <p className="text-[13px] text-selene-white-dim leading-relaxed mb-2">{data.homework.task}</p>
          <div className="flex gap-4 text-[11px] text-selene-white-dim">
            {data.homework.duration && <span>⏱ {data.homework.duration}</span>}
            {data.homework.materials && <span>📦 {data.homework.materials}</span>}
          </div>
        </div>
      )}

      {/* Quiz points */}
      {data.quiz_points?.length > 0 && (
        <div className="bg-selene-elevated/50 rounded-xl p-4 border border-selene-border">
          <div className="text-xs font-semibold text-selene-white-dim mb-2">Puntos clave para el quiz</div>
          <ul className="space-y-1">
            {data.quiz_points.map((p, i) => (
              <li key={i} className="text-[12px] text-selene-white-dim flex gap-2">
                <span className="text-selene-gold shrink-0">✓</span><span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdminContenidoPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Course list view
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
          <Link href="/admin" className="text-selene-white-dim hover:text-selene-white"><BackIcon /></Link>
          <span className="text-sm font-medium text-selene-white">Admin — Todo el contenido</span>
        </nav>

        <div className="max-w-[800px] mx-auto px-5 py-8">
          <h1 className="font-display text-2xl text-selene-white mb-2">Contenido de todos los cursos</h1>
          <p className="text-sm text-selene-white-dim mb-8">Acceso directo a todas las lecciones sin restricción de compra ni inscripción.</p>

          <div className="space-y-3">
            {COURSES.map(course => {
              const lessonCount = course.lessons?.filter(l => l.type === 'lesson').length || 0;
              const quizCount = course.lessons?.filter(l => l.type === 'quiz' || l.type === 'exam').length || 0;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="w-full text-left bg-selene-card border border-selene-border rounded-xl p-5 hover:border-selene-gold/30 transition"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{course.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-semibold text-selene-white">{course.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-selene-gold/10 text-selene-gold">{course.price_label}</span>
                        {course.certification && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-selene-purple/10 text-selene-purple">🎓 CERT</span>}
                      </div>
                      <p className="text-xs text-selene-white-dim mb-2">{course.subtitle}</p>
                      <div className="flex gap-4 text-[11px] text-selene-white-dim">
                        <span>{lessonCount} lecciones</span>
                        <span>{quizCount} evaluaciones</span>
                        <span>{course.modules} módulos</span>
                        <span>{course.hours}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Lesson view
  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-selene-bg">
        <nav className="sticky top-0 z-50 px-6 py-3.5 flex items-center gap-3 border-b border-selene-border bg-selene-bg/90 backdrop-blur-xl">
          <button onClick={() => setSelectedLesson(null)} className="text-selene-white-dim hover:text-selene-white"><BackIcon /></button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-selene-white truncate">{selectedLesson.title}</div>
            <div className="text-[11px] text-selene-white-dim">{selectedCourse.title}</div>
          </div>
        </nav>
        <div className="max-w-[720px] mx-auto px-5 py-6">
          <LessonView courseId={selectedCourse.id} lessonId={selectedLesson.id} onClose={() => setSelectedLesson(null)} />
        </div>
      </div>
    );
  }

  // Course detail view — all lessons unlocked
  const lessonsByModule = {};
  (selectedCourse.lessons || []).forEach(l => {
    if (!lessonsByModule[l.module]) lessonsByModule[l.module] = [];
    lessonsByModule[l.module].push(l);
  });

  return (
    <div className="min-h-screen bg-selene-bg">
      <nav className="sticky top-0 z-50 px-6 py-3.5 flex items-center gap-3 border-b border-selene-border bg-selene-bg/90 backdrop-blur-xl">
        <button onClick={() => setSelectedCourse(null)} className="text-selene-white-dim hover:text-selene-white"><BackIcon /></button>
        <div>
          <span className="text-sm font-medium text-selene-white">{selectedCourse.icon} {selectedCourse.title}</span>
          <span className="text-[11px] text-selene-white-dim ml-2">{selectedCourse.price_label}</span>
        </div>
      </nav>

      <div className="max-w-[700px] mx-auto px-5 py-6">
        {/* Course info */}
        <Card className="p-5 mb-6">
          <p className="text-[13px] text-selene-white-dim leading-relaxed mb-3">{selectedCourse.description}</p>
          <div className="bg-selene-blue/5 rounded-lg p-3 border border-selene-blue/10">
            <div className="text-[11px] font-semibold text-selene-blue-light mb-1">Base científica</div>
            <div className="text-[12px] text-selene-white-dim">{selectedCourse.science}</div>
          </div>
        </Card>

        {/* Lessons by module */}
        {Object.entries(lessonsByModule).map(([mod, lessons]) => (
          <div key={mod} className="mb-6">
            <h3 className="text-xs font-semibold text-selene-gold tracking-wide uppercase mb-3">Módulo {mod}</h3>
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => lesson.type === 'lesson' && setSelectedLesson(lesson)}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border transition ${
                    lesson.type === 'lesson'
                      ? 'bg-selene-card border-selene-border hover:border-selene-gold/30 cursor-pointer'
                      : 'bg-selene-elevated/50 border-selene-border/50 cursor-default'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-selene-elevated border border-selene-border">
                    {lesson.type === 'quiz' ? <span className="text-xs">📝</span> :
                     lesson.type === 'exam' ? <span className="text-xs">🎓</span> :
                     <span className="text-[10px] text-selene-white-dim">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-selene-white truncate">{lesson.title}</div>
                    <div className="text-[11px] text-selene-white-dim">
                      {lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'exam' ? 'Examen' : 'Lección'} · {lesson.duration}
                    </div>
                  </div>
                  {lesson.type === 'lesson' && <span className="text-selene-gold text-xs">Ver →</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        {(!selectedCourse.lessons || selectedCourse.lessons.length === 0) && (
          <div className="text-center py-16">
            <p className="text-selene-white-dim">Este curso aún no tiene lecciones definidas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
