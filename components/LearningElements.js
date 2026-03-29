'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui';

// ── 1. PROCESS DIAGRAM — Step-by-step visual flow ──
export function ProcessDiagram({ title, steps, direction = 'horizontal' }) {
  const [activeStep, setActiveStep] = useState(null);

  if (!steps || !steps.length) return null;

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔄</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title}</h4>
      </div>

      <div className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap justify-center'} gap-2 items-center`}>
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`flex flex-col items-center p-3 rounded-xl border transition min-w-[100px] ${
                activeStep === i
                  ? 'bg-selene-gold/10 border-selene-gold/40 scale-105'
                  : 'bg-selene-elevated border-selene-border hover:border-selene-gold/30'
              }`}
            >
              <span className="text-xl mb-1">{step.icon || `${i + 1}`}</span>
              <span className="text-[11px] text-selene-white font-medium text-center">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <span className={`text-selene-gold/40 text-lg ${direction === 'vertical' ? 'rotate-90' : ''}`}>→</span>
            )}
          </div>
        ))}
      </div>

      {activeStep !== null && steps[activeStep]?.detail && (
        <div className="mt-4 p-3 bg-selene-gold/5 border border-selene-gold/20 rounded-lg animate-fade-in">
          <p className="text-[13px] text-selene-white-dim leading-relaxed">{steps[activeStep].detail}</p>
        </div>
      )}
    </Card>
  );
}

// ── 2. CONCEPT MAP — Interactive node network ──
export function ConceptMap({ title, centerNode, nodes }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!nodes || !nodes.length) return null;

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧠</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title}</h4>
      </div>

      <div className="relative min-h-[250px] flex items-center justify-center">
        {/* Center node */}
        <div className="absolute z-10 bg-selene-gold text-selene-bg px-4 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(201,168,76,0.3)]">
          {centerNode}
        </div>

        {/* Orbital nodes */}
        {nodes.map((node, i) => {
          const angle = (i * 360 / nodes.length - 90) * (Math.PI / 180);
          const radius = 110;
          const x = 50 + Math.cos(angle) * (radius / 2.5);
          const y = 50 + Math.sin(angle) * (radius / 2.5);

          return (
            <button
              key={i}
              onClick={() => setActiveNode(activeNode === i ? null : i)}
              className={`absolute transition-all duration-300 px-3 py-1.5 rounded-lg text-[11px] font-medium border ${
                activeNode === i
                  ? 'bg-selene-gold/15 border-selene-gold text-selene-gold scale-110 z-20'
                  : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/40'
              }`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {node.icon && <span className="mr-1">{node.icon}</span>}
              {node.label}
            </button>
          );
        })}
      </div>

      {activeNode !== null && nodes[activeNode]?.description && (
        <div className="mt-3 p-3 bg-selene-elevated rounded-lg text-[13px] text-selene-white-dim leading-relaxed animate-fade-in">
          <span className="text-selene-gold font-semibold">{nodes[activeNode].label}: </span>
          {nodes[activeNode].description}
        </div>
      )}
    </Card>
  );
}

// ── 3. LESSON SUMMARY INFOGRAPHIC — Visual recap ──
export function LessonSummary({ title, points, citation, nextLesson }) {
  if (!points || !points.length) return null;

  return (
    <div className="my-8 rounded-2xl border border-selene-gold/20 overflow-hidden">
      {/* Header */}
      <div className="bg-selene-gold/10 px-5 py-4 border-b border-selene-gold/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h4 className="text-sm font-semibold text-selene-gold">{title || 'Resumen de la lección'}</h4>
        </div>
      </div>

      {/* Key points */}
      <div className="px-5 py-4 space-y-3">
        {points.map((point, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-selene-gold/10 border border-selene-gold/30 flex items-center justify-center text-selene-gold text-[11px] font-bold mt-0.5">
              {i + 1}
            </div>
            <div>
              <span className="text-[13px] text-selene-white font-medium">
                {typeof point === 'string' ? point : point.title}
              </span>
              {typeof point === 'object' && point.detail && (
                <p className="text-[12px] text-selene-white-dim mt-0.5">{point.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Citation footer */}
      {citation && (
        <div className="px-5 py-3 bg-selene-blue/5 border-t border-selene-border">
          <p className="text-[11px] text-selene-white-dim">
            📚 <span className="font-medium">{citation.researcher} ({citation.year})</span>: {citation.finding}
          </p>
        </div>
      )}

      {/* Next lesson CTA */}
      {nextLesson && (
        <div className="px-5 py-3 bg-selene-elevated border-t border-selene-border text-center">
          <span className="text-[12px] text-selene-gold font-medium">
            Siguiente → {nextLesson}
          </span>
        </div>
      )}
    </div>
  );
}

// ── 4. SPACED REVIEW QUIZ — Questions from previous lessons ──
export function SpacedReview({ questions, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!questions?.length) return null;
  if (completed) return null;

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleAnswer = (optionIdx) => {
    const isCorrect = optionIdx === q.correct;
    setAnswers(prev => ({ ...prev, [current]: { chosen: optionIdx, correct: isCorrect } }));
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (isLast) {
      setCompleted(true);
      const score = Object.values(answers).filter(a => a.correct).length + (answers[current]?.correct ? 1 : 0);
      onComplete?.(score, questions.length);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <Card className="p-5 my-6 border-l-[3px] border-l-selene-blue-light">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔄</span>
          <h4 className="text-sm font-semibold text-selene-blue-light">Repaso de lecciones anteriores</h4>
        </div>
        <span className="text-[11px] text-selene-white-dim">{current + 1}/{questions.length}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition ${
            i < current ? (answers[i]?.correct ? 'bg-green-500' : 'bg-red-500')
            : i === current ? 'bg-selene-gold' : 'bg-selene-border'
          }`} />
        ))}
      </div>

      {q.fromLesson && (
        <p className="text-[10px] text-selene-white-dim/50 mb-2">De: {q.fromLesson}</p>
      )}
      <p className="text-[14px] text-selene-white mb-4">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const chosen = answers[current]?.chosen === i;
          const isRight = i === q.correct;
          return (
            <button
              key={i}
              onClick={() => !showResult && handleAnswer(i)}
              disabled={showResult}
              className={`w-full text-left text-[13px] p-3 rounded-lg border transition ${
                showResult
                  ? isRight ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : chosen ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-selene-elevated border-selene-border text-selene-white-dim opacity-50'
                  : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-3">
          {q.explanation && (
            <p className="text-[12px] text-selene-white-dim mb-3 p-2 bg-selene-elevated rounded-lg">{q.explanation}</p>
          )}
          <button
            onClick={handleNext}
            className="w-full text-sm font-semibold bg-selene-gold text-selene-bg py-2.5 rounded-lg hover:brightness-110 transition"
          >
            {isLast ? 'Completar repaso' : 'Siguiente pregunta'}
          </button>
        </div>
      )}
    </Card>
  );
}

// ── 5. ANNOTATED IMAGE — Image with numbered callouts ──
export function AnnotatedImage({ title, imageUrl, altText, annotations }) {
  const [active, setActive] = useState(null);

  return (
    <Card className="p-5 my-6">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🖼️</span>
          <h4 className="text-sm font-semibold text-selene-gold">{title}</h4>
        </div>
      )}

      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt={altText || ''} className="w-full rounded-lg" />
        ) : (
          <div className="w-full aspect-video bg-selene-elevated rounded-lg flex items-center justify-center">
            <span className="text-selene-white-dim text-sm">{altText || 'Diagrama'}</span>
          </div>
        )}

        {annotations?.map((ann, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            className={`absolute w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
              active === i
                ? 'bg-selene-gold text-selene-bg scale-125 shadow-[0_0_12px_rgba(201,168,76,0.5)] z-10'
                : 'bg-selene-gold/70 text-selene-bg hover:scale-110'
            }`}
            style={{ top: `${ann.y}%`, left: `${ann.x}%`, transform: 'translate(-50%, -50%)' }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Annotation list */}
      <div className="mt-4 space-y-2">
        {annotations?.map((ann, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            className={`w-full text-left flex gap-3 items-start p-2 rounded-lg transition ${
              active === i ? 'bg-selene-gold/10' : 'hover:bg-selene-elevated'
            }`}
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              active === i ? 'bg-selene-gold text-selene-bg' : 'bg-selene-border text-selene-white-dim'
            }`}>{i + 1}</span>
            <div>
              <span className="text-[12px] text-selene-white font-medium">{ann.title}</span>
              {active === i && ann.detail && (
                <p className="text-[11px] text-selene-white-dim mt-1 animate-fade-in">{ann.detail}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ── 6. BRANCHING SCENARIO — Decision tree ──
export function BranchingScenario({ title, scenario }) {
  const [currentNode, setCurrentNode] = useState('start');
  const [history, setHistory] = useState([]);

  const node = scenario?.[currentNode];
  if (!node) return null;

  const handleChoice = (nextId) => {
    setHistory(prev => [...prev, currentNode]);
    setCurrentNode(nextId);
  };

  const goBack = () => {
    if (history.length === 0) return;
    setCurrentNode(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
  };

  const restart = () => {
    setCurrentNode('start');
    setHistory([]);
  };

  return (
    <Card className="p-5 my-6 border-l-[3px] border-l-purple-500/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎭</span>
        <h4 className="text-sm font-semibold" style={{ color: '#BB86FC' }}>{title || 'Escenario'}</h4>
      </div>

      <p className="text-[13px] text-selene-white leading-relaxed mb-4">{node.text}</p>

      {node.choices ? (
        <div className="space-y-2">
          {node.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice.next)}
              className="w-full text-left text-[13px] p-3 rounded-lg border bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30 transition"
            >
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <div className={`p-3 rounded-lg text-sm ${node.outcome === 'good' ? 'bg-green-500/10 text-green-400' : node.outcome === 'bad' ? 'bg-red-500/10 text-red-400' : 'bg-selene-gold/10 text-selene-gold'}`}>
          {node.feedback || 'Fin del escenario'}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {history.length > 0 && (
          <button onClick={goBack} className="text-xs text-selene-white-dim hover:text-selene-gold transition">
            ← Volver
          </button>
        )}
        {!node.choices && (
          <button onClick={restart} className="text-xs text-selene-gold hover:text-selene-gold-light transition ml-auto">
            Reiniciar escenario
          </button>
        )}
      </div>
    </Card>
  );
}
