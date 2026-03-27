'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui';

// ── 1. FLIP CARDS — Click to reveal ──
export function FlipCards({ cards }) {
  const [flipped, setFlipped] = useState(new Set());

  const toggle = (i) => {
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className="relative min-h-[140px] rounded-xl border border-selene-border overflow-hidden transition-all duration-300 text-left"
          style={{ perspective: '1000px' }}
        >
          <div className={`absolute inset-0 p-4 flex flex-col justify-center transition-all duration-300 ${
            flipped.has(i) ? 'opacity-0 scale-95' : 'opacity-100'
          } bg-gradient-to-br from-selene-card to-selene-elevated`}>
            {card.icon && <span className="text-2xl mb-2">{card.icon}</span>}
            <span className="text-sm font-semibold text-selene-white">{card.front}</span>
            <span className="text-[10px] text-selene-gold mt-2">Toca para revelar</span>
          </div>
          <div className={`absolute inset-0 p-4 flex flex-col justify-center transition-all duration-300 ${
            flipped.has(i) ? 'opacity-100' : 'opacity-0 scale-95'
          } bg-selene-gold/5 border-selene-gold/20`}>
            <span className="text-[13px] text-selene-white-dim leading-relaxed">{card.back}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── 2. DRAG & DROP MATCH — Connect items ──
export function MatchExercise({ title, pairs, instruction }) {
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({});
  const [shuffledRight] = useState(() =>
    [...pairs.map((p, i) => ({ text: p.right, idx: i }))].sort(() => Math.random() - 0.5)
  );

  const allCorrect = Object.keys(matches).length === pairs.length &&
    Object.entries(matches).every(([l, r]) => Number(l) === r);

  const handleLeftClick = (i) => {
    if (matches[i] !== undefined) return;
    setSelected(i);
  };

  const handleRightClick = (rightIdx) => {
    if (selected === null) return;
    if (Object.values(matches).includes(rightIdx)) return;
    setMatches(prev => ({ ...prev, [selected]: rightIdx }));
    setSelected(null);
  };

  const reset = () => { setMatches({}); setSelected(null); };

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔗</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title || 'Ejercicio: conecta los pares'}</h4>
      </div>
      {instruction && <p className="text-xs text-selene-white-dim mb-4">{instruction}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={i}
              onClick={() => handleLeftClick(i)}
              disabled={matches[i] !== undefined}
              className={`w-full text-left text-[13px] p-3 rounded-lg border transition ${
                matches[i] !== undefined
                  ? matches[i] === i ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  : selected === i ? 'bg-selene-gold/10 border-selene-gold/40 text-selene-gold'
                  : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30'
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {shuffledRight.map((item, i) => (
            <button
              key={i}
              onClick={() => handleRightClick(item.idx)}
              disabled={Object.values(matches).includes(item.idx)}
              className={`w-full text-left text-[13px] p-3 rounded-lg border transition ${
                Object.values(matches).includes(item.idx)
                  ? Object.entries(matches).find(([,v]) => v === item.idx)?.[0] == item.idx
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-selene-elevated border-selene-border text-selene-white-dim hover:border-selene-gold/30'
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {allCorrect && (
        <div className="mt-4 text-center text-sm text-green-400 font-semibold">
          ✓ Todas las conexiones son correctas
        </div>
      )}
      {Object.keys(matches).length === pairs.length && !allCorrect && (
        <button onClick={reset} className="mt-4 w-full text-sm text-selene-gold border border-selene-gold/30 rounded-lg py-2 hover:bg-selene-gold/5">
          Intentar de nuevo
        </button>
      )}
    </Card>
  );
}

// ── 3. HOTSPOT IMAGE — Click zones on image ──
export function HotspotImage({ imageUrl, altText, hotspots, title }) {
  const [activeSpot, setActiveSpot] = useState(null);

  return (
    <Card className="p-5 my-6 overflow-hidden">
      {title && <h4 className="text-sm font-semibold text-selene-gold mb-3">{title}</h4>}
      <p className="text-xs text-selene-white-dim mb-3">Toca los puntos marcados para ver la información</p>

      <div className="relative inline-block w-full">
        {imageUrl ? (
          <img src={imageUrl} alt={altText || ''} className="w-full rounded-lg" />
        ) : (
          <div className="w-full aspect-[4/3] bg-selene-elevated rounded-lg flex items-center justify-center">
            <span className="text-selene-white-dim text-sm">Imagen de referencia</span>
          </div>
        )}

        {hotspots?.map((spot, i) => (
          <button
            key={i}
            onClick={() => setActiveSpot(activeSpot === i ? null : i)}
            className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
              activeSpot === i
                ? 'bg-selene-gold text-selene-bg scale-125 shadow-[0_0_15px_rgba(201,168,76,0.5)]'
                : 'bg-selene-gold/70 text-selene-bg hover:scale-110 animate-pulse'
            }`}
            style={{ top: `${spot.y}%`, left: `${spot.x}%`, transform: 'translate(-50%, -50%)' }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {activeSpot !== null && hotspots[activeSpot] && (
        <div className="mt-3 p-3 bg-selene-gold/5 border border-selene-gold/20 rounded-lg animate-fade-in">
          <h5 className="text-sm font-semibold text-selene-gold mb-1">{hotspots[activeSpot].title}</h5>
          <p className="text-[13px] text-selene-white-dim leading-relaxed">{hotspots[activeSpot].description}</p>
        </div>
      )}
    </Card>
  );
}

// ── 4. FILL IN THE BLANKS ──
export function FillBlanks({ text, blanks, title }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  if (!text || typeof text !== 'string') return null;
  const parts = text.split(/___(\d+)___/);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setChecked(false);
  };

  const allFilled = blanks.every((_, i) => answers[i]?.trim());
  const score = checked ? blanks.filter((b, i) =>
    answers[i]?.trim().toLowerCase() === b.answer.toLowerCase()
  ).length : 0;

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✏️</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title || 'Completa los espacios'}</h4>
      </div>

      <div className="text-[14px] text-selene-white-dim leading-[2.2]">
        {parts.map((part, i) => {
          if (i % 2 === 0) return <span key={i}>{part}</span>;
          const blankIdx = parseInt(part);
          const blank = blanks[blankIdx];
          if (!blank) return null;
          const isCorrect = checked && answers[blankIdx]?.trim().toLowerCase() === blank.answer.toLowerCase();
          const isWrong = checked && !isCorrect && answers[blankIdx]?.trim();
          return (
            <span key={i} className="inline-block mx-1">
              <input
                type="text"
                value={answers[blankIdx] || ''}
                onChange={(e) => handleChange(blankIdx, e.target.value)}
                placeholder={blank.hint || '...'}
                className={`w-[120px] text-center text-[13px] px-2 py-1 rounded border bg-selene-elevated outline-none transition ${
                  isCorrect ? 'border-green-500 text-green-400' :
                  isWrong ? 'border-red-500 text-red-400' :
                  'border-selene-border text-selene-white focus:border-selene-gold'
                }`}
              />
              {isWrong && <span className="text-[10px] text-red-400 ml-1">({blank.answer})</span>}
            </span>
          );
        })}
      </div>

      <button
        onClick={() => setChecked(true)}
        disabled={!allFilled}
        className="mt-4 w-full text-sm font-semibold bg-selene-gold text-selene-bg py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40"
      >
        {checked ? `${score}/${blanks.length} correctas` : 'Comprobar respuestas'}
      </button>
    </Card>
  );
}

// ── 5. SORTING EXERCISE — Order items correctly ──
export function SortExercise({ title, items, instruction }) {
  const [order, setOrder] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);

  const moveUp = (i) => {
    if (i === 0) return;
    const next = [...order];
    [next[i-1], next[i]] = [next[i], next[i-1]];
    setOrder(next);
    setChecked(false);
  };

  const moveDown = (i) => {
    if (i === order.length - 1) return;
    const next = [...order];
    [next[i], next[i+1]] = [next[i+1], next[i]];
    setOrder(next);
    setChecked(false);
  };

  const isCorrect = checked && order.every((item, i) => item === items[i]);

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">↕️</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title || 'Ordena correctamente'}</h4>
      </div>
      {instruction && <p className="text-xs text-selene-white-dim mb-4">{instruction}</p>}

      <div className="space-y-2">
        {order.map((item, i) => (
          <div key={item} className={`flex items-center gap-2 p-3 rounded-lg border transition ${
            checked
              ? item === items[i] ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
              : 'bg-selene-elevated border-selene-border'
          }`}>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveUp(i)} disabled={i === 0} className="text-selene-white-dim hover:text-selene-gold disabled:opacity-20 text-xs">▲</button>
              <button onClick={() => moveDown(i)} disabled={i === order.length - 1} className="text-selene-white-dim hover:text-selene-gold disabled:opacity-20 text-xs">▼</button>
            </div>
            <span className="text-[13px] text-selene-white flex-1">{item}</span>
            <span className="text-[11px] text-selene-white-dim w-5 text-center">{i + 1}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setChecked(true)}
        className="mt-4 w-full text-sm font-semibold bg-selene-gold text-selene-bg py-2.5 rounded-lg hover:brightness-110 transition"
      >
        {isCorrect ? '✓ Orden correcto' : checked ? 'Intentar de nuevo' : 'Comprobar orden'}
      </button>
    </Card>
  );
}

// ── 6. KEY CONCEPT HIGHLIGHT ──
export function KeyConcept({ term, definition, icon, source }) {
  return (
    <div className="my-5 p-4 bg-selene-gold/5 border-l-3 border-selene-gold rounded-r-lg" style={{ borderLeftWidth: '3px' }}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm font-semibold text-selene-gold">{term}</span>
      </div>
      <p className="text-[13px] text-selene-white-dim leading-relaxed">{definition}</p>
      {source && <p className="text-[11px] text-selene-white-dim/60 mt-2 italic">{source}</p>}
    </div>
  );
}

// ── 7. PROGRESS CHECK — Self-assessment (supports string[] or object[] with quiz) ──
export function ProgressCheck({ questions }) {
  const [answers, setAnswers] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const total = questions?.length || 0;

  if (!total) return null;

  // Detect if questions are strings (checklist) or objects (quiz format)
  const isQuizFormat = typeof questions[0] === 'object' && questions[0]?.question;

  if (isQuizFormat) {
    const answered = Object.keys(quizAnswers).length;
    return (
      <Card className="p-5 my-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h4 className="text-sm font-semibold text-selene-gold">Autoevaluación</h4>
          <span className="text-[11px] text-selene-white-dim ml-auto">{answered}/{total}</span>
        </div>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const chosen = quizAnswers[i];
            const isAnswered = chosen !== undefined;
            const isCorrect = isAnswered && chosen === q.correct;
            return (
              <div key={i} className="border border-selene-border rounded-lg p-3">
                <p className="text-[13px] text-selene-white mb-2">{q.question}</p>
                <div className="space-y-1.5">
                  {q.options?.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => !isAnswered && setQuizAnswers(prev => ({ ...prev, [i]: j }))}
                      disabled={isAnswered}
                      className={`w-full text-left text-[12px] px-3 py-2 rounded border transition ${
                        isAnswered
                          ? j === q.correct ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : chosen === j ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : 'bg-selene-elevated border-selene-border text-selene-white-dim opacity-40'
                          : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {isAnswered && q.explanation && (
                  <p className="text-[11px] text-selene-white-dim mt-2 p-2 bg-selene-elevated rounded">{q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
        {answered === total && (
          <div className="mt-4 text-center text-sm text-green-400 font-semibold">
            ✓ {Object.values(quizAnswers).filter((v, i) => v === questions[i]?.correct).length}/{total} correctas
          </div>
        )}
      </Card>
    );
  }

  // Simple checklist format (string[])
  const answered = Object.keys(answers).length;
  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎯</span>
        <h4 className="text-sm font-semibold text-selene-gold">Autoevaluación</h4>
        <span className="text-[11px] text-selene-white-dim ml-auto">{answered}/{total}</span>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-3">
            <button
              onClick={() => setAnswers(prev => {
                const next = { ...prev };
                next[i] ? delete next[i] : next[i] = true;
                return next;
              })}
              className={`mt-0.5 w-5 h-5 rounded shrink-0 border transition flex items-center justify-center ${
                answers[i] ? 'bg-selene-gold border-selene-gold text-selene-bg' : 'border-selene-border hover:border-selene-gold/50'
              }`}
            >
              {answers[i] && <span className="text-xs">✓</span>}
            </button>
            <span className="text-[13px] text-selene-white-dim leading-relaxed">{typeof q === 'string' ? q : q?.question || JSON.stringify(q)}</span>
          </div>
        ))}
      </div>

      {answered === total && (
        <div className="mt-4 text-center text-sm text-green-400 font-semibold">
          ✓ Has completado la autoevaluación
        </div>
      )}
    </Card>
  );
}

// ── 8. MULTIPLE CHOICE QUIZ — Single or multi-answer ──
export function MultipleChoice({ question, options, correctIndex, explanation, multiSelect }) {
  const [selected, setSelected] = useState(multiSelect ? new Set() : null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (i) => {
    if (submitted) return;
    if (multiSelect) {
      setSelected(prev => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
      });
    } else {
      setSelected(i);
    }
  };

  const isCorrect = multiSelect
    ? submitted && correctIndex.every(c => selected.has(c)) && selected.size === correctIndex.length
    : submitted && selected === correctIndex;

  const getOptionStyle = (i) => {
    if (!submitted) {
      const isActive = multiSelect ? selected.has(i) : selected === i;
      return isActive
        ? 'bg-selene-gold/10 border-selene-gold/40 text-selene-gold'
        : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30';
    }
    const isRight = multiSelect ? correctIndex.includes(i) : i === correctIndex;
    const wasChosen = multiSelect ? selected.has(i) : selected === i;
    if (isRight) return 'bg-green-500/10 border-green-500/30 text-green-400';
    if (wasChosen && !isRight) return 'bg-red-500/10 border-red-500/30 text-red-400';
    return 'bg-selene-elevated border-selene-border text-selene-white-dim opacity-50';
  };

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">❓</span>
        <h4 className="text-sm font-semibold text-selene-gold">Pregunta</h4>
      </div>
      <p className="text-[14px] text-selene-white mb-4">{question}</p>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full text-left text-[13px] p-3 rounded-lg border transition ${getOptionStyle(i)}`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={multiSelect ? selected.size === 0 : selected === null}
          className="mt-4 w-full text-sm font-semibold bg-selene-gold text-selene-bg py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40"
        >
          Comprobar
        </button>
      )}

      {submitted && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
          {explanation && <p className="mt-1 text-selene-white-dim text-[12px]">{explanation}</p>}
        </div>
      )}
    </Card>
  );
}

// ── 9. TIMELINE — Chronological events ──
export function Timeline({ title, events }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📅</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title || 'Línea temporal'}</h4>
      </div>

      <div className="relative ml-4">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-selene-gold/20" />

        {events.map((ev, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="relative pl-6 pb-5 block w-full text-left group"
          >
            <div className={`absolute left-[-4px] top-1 w-[9px] h-[9px] rounded-full border-2 transition ${
              expanded === i ? 'bg-selene-gold border-selene-gold' : 'bg-selene-bg border-selene-gold/40 group-hover:border-selene-gold'
            }`} />
            <div className="text-[11px] text-selene-gold font-semibold">{ev.date || ev.year}</div>
            <div className="text-[13px] text-selene-white">{ev.title}</div>
            {expanded === i && ev.detail && (
              <div className="mt-2 text-[12px] text-selene-white-dim leading-relaxed animate-fade-in">
                {ev.detail}
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ── 10. COMPARISON TABLE — Side by side ──
export function ComparisonTable({ title, headers, rows }) {
  return (
    <Card className="p-5 my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⚖️</span>
        <h4 className="text-sm font-semibold text-selene-gold">{title || 'Comparación'}</h4>
      </div>

      <div className="rounded-lg border border-selene-border overflow-hidden">
        <div className={`grid gap-0 ${headers.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {headers.map((h, i) => (
            <div key={i} className="px-3 py-2.5 bg-selene-elevated text-[11px] font-semibold text-selene-gold uppercase tracking-wider text-center border-b border-selene-border">
              {h}
            </div>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={i} className={`grid ${headers.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} ${i < rows.length - 1 ? 'border-b border-selene-border' : ''}`}>
            {row.map((cell, j) => (
              <div key={j} className={`px-3 py-2.5 text-[12px] text-center ${
                j === 0 ? 'text-selene-white font-medium' : 'text-selene-white-dim'
              } ${i % 2 === 0 ? 'bg-selene-card' : 'bg-selene-bg'}`}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── 11. SCENARIO / CASE STUDY — Interactive decision ──
export function Scenario({ title, description, question, options }) {
  const [choice, setChoice] = useState(null);

  return (
    <Card className="p-5 my-6 border-l-[3px] border-l-purple-500/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎭</span>
        <h4 className="text-sm font-semibold" style={{ color: '#BB86FC' }}>{title || 'Caso práctico'}</h4>
      </div>
      <p className="text-[13px] text-selene-white-dim leading-relaxed mb-4 italic">{description}</p>
      <p className="text-[13px] text-selene-white font-medium mb-3">{question}</p>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setChoice(i)}
            className={`w-full text-left text-[13px] p-3 rounded-lg border transition ${
              choice === i
                ? opt.correct
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-selene-elevated border-selene-border text-selene-white hover:border-selene-gold/30'
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {choice !== null && options[choice]?.feedback && (
        <div className="mt-3 p-3 bg-selene-elevated rounded-lg text-[12px] text-selene-white-dim leading-relaxed animate-fade-in">
          {options[choice].feedback}
        </div>
      )}
    </Card>
  );
}

// ── 12. REVEAL / ACCORDION — Progressive disclosure ──
export function RevealSections({ title, sections }) {
  const [open, setOpen] = useState(new Set());

  const toggle = (i) => {
    setOpen(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <Card className="p-5 my-6">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📚</span>
          <h4 className="text-sm font-semibold text-selene-gold">{title}</h4>
        </div>
      )}

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={i} className="rounded-lg border border-selene-border overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 bg-selene-elevated hover:bg-selene-card transition text-left"
            >
              <span className="text-[13px] text-selene-white font-medium">{s.title}</span>
              <span className={`text-selene-gold transition-transform ${open.has(i) ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open.has(i) && (
              <div className="px-4 py-3 text-[13px] text-selene-white-dim leading-relaxed animate-fade-in bg-selene-bg">
                {s.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
