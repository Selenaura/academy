'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/constants';
import { Card, BackIcon } from '@/components/ui';
import { FlipCards, MatchExercise, HotspotImage, FillBlanks, SortExercise, KeyConcept, ProgressCheck, MultipleChoice, Timeline, ComparisonTable, Scenario, RevealSections } from '@/components/InteractiveElements';
import { ProcessDiagram, ConceptMap, LessonSummary, SpacedReview, AnnotatedImage, BranchingScenario } from '@/components/LearningElements';
import TextContentRenderer from '@/components/TextContentRenderer';

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
        {s.type === 'comparison_table' && (
          <div>
            {s.title && <h4 className="text-sm font-semibold text-selene-gold mb-3">{s.title}</h4>}
            <div className="rounded-lg border border-selene-border overflow-hidden">
              {s.columns && (
                <div className="flex">
                  {s.columns.map((col, ci) => (
                    <div key={ci} className="flex-1 px-3 py-2 bg-selene-elevated text-[11px] font-semibold text-selene-gold uppercase tracking-wider text-center border-b border-selene-border">{col}</div>
                  ))}
                </div>
              )}
              {(s.rows || []).map((row, ri) => (
                <div key={ri} className={`flex ${ri < (s.rows || []).length - 1 ? 'border-b border-selene-border' : ''}`}>
                  {row.label && <div className="flex-1 px-3 py-2 text-[12px] text-selene-white font-medium bg-selene-card">{row.label}</div>}
                  {(row.values || []).map((val, vi) => (
                    <div key={vi} className="flex-1 px-3 py-2 text-[12px] text-selene-white-dim text-center bg-selene-card">{val}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {!['title','content','quote','reflection','summary','next','comparison_table'].includes(s.type) && (
          <div className="text-center">
            <p className="text-[11px] text-selene-white-dim">Slide tipo: {s.type}</p>
            {s.title && <p className="text-[13px] text-selene-white mt-1">{s.title}</p>}
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
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-selene-white-dim">Módulo {data.module} · Lección {data.lesson_number}</span>
      </div>

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
        <TextContentRenderer text={data.text_content} />
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
              case 'fill_blanks': {
                const fbText = el.text || el.template;
                const fbBlanks = el.blanks || (el.answers ? el.answers.map(a => ({ answer: a, hint: '...' })) : []);
                return <FillBlanks key={i} text={fbText} blanks={fbBlanks} title={el.title} />;
              }
              case 'sort': {
                const sortItems = el.items || el.correct_order;
                return <SortExercise key={i} title={el.title} items={sortItems} instruction={el.instruction} />;
              }
              case 'key_concept': return <KeyConcept key={i} term={el.term} definition={el.definition} icon={el.icon} source={el.source} />;
              case 'progress_check': return <ProgressCheck key={i} questions={el.questions} />;
              case 'multiple_choice': return <MultipleChoice key={i} question={el.question} options={el.options} correctIndex={el.correct ?? el.correctIndex} explanation={el.explanation} multiSelect={el.multiSelect} />;
              case 'timeline': return <Timeline key={i} title={el.title} events={el.events} />;
              case 'comparison': return <ComparisonTable key={i} title={el.title} headers={el.headers} rows={el.rows} />;
              case 'scenario': return <Scenario key={i} title={el.title} description={el.description} question={el.question} options={el.options} />;
              case 'reveal': return <RevealSections key={i} title={el.title} sections={el.sections} />;
              case 'process_diagram': return <ProcessDiagram key={i} title={el.title} steps={el.steps} direction={el.direction} />;
              case 'concept_map': return <ConceptMap key={i} title={el.title} centerNode={el.centerNode} nodes={el.nodes} />;
              case 'lesson_summary': return <LessonSummary key={i} title={el.title} points={el.points} citation={el.citation} nextLesson={el.nextLesson} />;
              case 'spaced_review': return <SpacedReview key={i} questions={el.questions} />;
              case 'annotated_image': return <AnnotatedImage key={i} title={el.title} imageUrl={el.imageUrl} altText={el.altText} annotations={el.annotations} />;
              case 'branching_scenario': return <BranchingScenario key={i} title={el.title} scenario={el.scenario} />;
              default: return <div key={i} className="p-3 bg-selene-elevated rounded-lg text-xs text-selene-white-dim">Ejercicio tipo: {el.type}</div>;
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
              {typeof b === 'string'
                ? <><span>{b.includes('ournal') || b.includes('Cureus') ? '📄' : '📖'}</span> {b}</>
                : <><span>{b.type === 'paper' ? '📄' : '📖'}</span> {b.author} ({b.year}). <em>{b.title}</em></>
              }
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
                <span className="text-selene-gold shrink-0">✓</span><span>{typeof p === 'string' ? p : p.question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Master improvements changelog
const MASTER_NOVEDADES = [
  {
    fecha: '2026-03-28',
    categoria: 'Marketing',
    items: [
      { titulo: 'Hero PAS Framework', desc: 'Reescrito con Pain-Agitate-Solution: "Ya tienes el don. Ahora conviértelo en tu profesión."' },
      { titulo: 'CTA en primera persona', desc: 'Botones cambiados a voz Selene: "Quiero ser guía profesional ✦"' },
      { titulo: 'Proceso visual 4 pasos', desc: 'Sección con iconos: Certificaciones → Módulos → Casos supervisados → Lanzamiento' },
      { titulo: 'Sección "Para quién"', desc: 'Reescrita con voice-of-customer emocional: ya practicas pero no cobras, sabes que es tu camino' },
      { titulo: 'ROI con datos reales', desc: '€40-180/sesión, 2-3 sesiones recuperas inversión, €1.200+/mes potencial' },
      { titulo: 'Status quo "¿Te suena esto?"', desc: '3 escenarios: lees gratis para amigos, miedo a cobrar, atrapada en trabajo de oficina' },
      { titulo: '3 testimonios con resultado', desc: 'Laura M. Escorpio "€60/sesión", María C. Acuario "Alta como autónoma", Ana R. Cáncer "4 clientes recurrentes"' },
      { titulo: 'Precio con anclaje', desc: '"Formaciones equivalentes: €2.000-5.000" (tachado) → €149,99 / €50/mes + "€1,25/día"' },
      { titulo: 'Garantía 14 días', desc: 'Escudo visual + texto de garantía de devolución sin preguntas' },
      { titulo: 'FAQ 6 preguntas', desc: 'Resuelve objeciones: tiempo, experiencia previa, vivir de esto, certificado, soporte, requisitos' },
      { titulo: 'Bundle pathway', desc: '"¿Aún no tienes 2 certificaciones?" con cross-sell a tarot €69,99, astrología €69,99, sueños €49,99, quirología €49,99' },
    ]
  },
  {
    fecha: '2026-03-28',
    categoria: 'SEO',
    items: [
      { titulo: 'Meta title optimizado', desc: 'Máster Guía Espiritual Profesional — específico para búsquedas de formación' },
      { titulo: 'Meta description', desc: 'Conviértete en guía espiritual profesional certificada. 10 módulos, casos supervisados, guía legal y marca personal. Desde €50/mes.' },
    ]
  },
  {
    fecha: '2026-03-28',
    categoria: 'Pagos',
    items: [
      { titulo: 'Stripe Tax automático', desc: 'automatic_tax + tax_id_collection activados en checkout (21% IVA España)' },
      { titulo: 'Facturas automáticas', desc: 'invoice_creation activado — cada compra genera factura PDF automáticamente' },
      { titulo: 'Klarna Pay-in-3', desc: 'Opción de pago en 3 plazos sin intereses disponible en España/Europa' },
    ]
  },
  {
    fecha: '2026-03-28',
    categoria: 'Currículo',
    items: [
      { titulo: 'Expansión 40h → 80h', desc: 'Duplicadas las horas del Máster para competir con Scholistico, Cosmograma e iPEC' },
      { titulo: '10 → 12 módulos', desc: 'Añadidos: Casos Prácticos II (3 casos avanzados) + Prácticas Supervisadas (3 sesiones)' },
      { titulo: '30 → 40 lecciones', desc: '10 lecciones nuevas: 4 casos extra (duelo, transición, conflicto familiar, bloqueo) + protocolo supervisión + 3 sesiones' },
      { titulo: 'Bloom\'s taxonomy completo', desc: 'Cubiertos los 6 niveles: Remember→Understand→Apply→Analyze→Evaluate→Create' },
      { titulo: '15 consultas supervisadas', desc: 'Requisito actualizado para certificación — de 10 a 15 consultas' },
    ]
  },
  {
    fecha: '2026-03-28',
    categoria: 'Plataforma',
    items: [
      { titulo: 'Chatbot "Pregunta a Selene"', desc: 'Widget flotante con panel lateral tipo Outlier — responde dudas sobre cursos, certificaciones y astrología' },
      { titulo: 'Centro de ayuda /ayuda', desc: 'Página con FAQ organizado: cursos, Máster, certificaciones, pagos y soporte' },
      { titulo: 'Certificado arreglado', desc: 'Nombre real del usuario (no hardcoded), código persistente en BD, descarga imagen, botón compartir' },
      { titulo: 'Icono ayuda en navbar', desc: 'Icono ? añadido entre dashboard y perfil en la barra de navegación' },
    ]
  },
];

function MasterNovedadesPanel() {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-8 bg-selene-card border border-selene-gold/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-selene-elevated/30 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-selene-gold">Novedades del Máster</div>
            <div className="text-[11px] text-selene-white-dim">{MASTER_NOVEDADES.reduce((sum, g) => sum + g.items.length, 0)} mejoras implementadas</div>
          </div>
        </div>
        <span className="text-selene-white-dim text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5">
          {MASTER_NOVEDADES.map((grupo, gi) => (
            <div key={gi}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  grupo.categoria === 'Marketing' ? 'bg-selene-purple/10 text-selene-purple' :
                  grupo.categoria === 'SEO' ? 'bg-selene-blue/10 text-selene-blue-light' :
                  grupo.categoria === 'Currículo' ? 'bg-selene-gold/10 text-selene-gold' :
                  grupo.categoria === 'Plataforma' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-selene-success/10 text-selene-success'
                }`}>{grupo.categoria}</span>
                <span className="text-[11px] text-selene-white-dim">{grupo.fecha}</span>
              </div>
              <div className="space-y-2">
                {grupo.items.map((item, ii) => (
                  <div key={ii} className="flex gap-3 p-3 bg-selene-elevated/50 rounded-lg border border-selene-border/50">
                    <span className="text-selene-gold shrink-0 text-xs mt-0.5">✦</span>
                    <div>
                      <div className="text-[13px] text-selene-white font-medium">{item.titulo}</div>
                      <div className="text-[12px] text-selene-white-dim mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

          <MasterNovedadesPanel />

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
