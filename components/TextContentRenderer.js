'use client';

/**
 * Rich text renderer for lesson text_content.
 * Parses markdown-like patterns into styled React components.
 */

// ── Inline parser: handles **bold**, *italic* ──
function renderInline(text) {
  if (!text) return null;
  // Split on **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} className="text-selene-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={j} className="text-selene-gold/80 italic">{part.slice(1, -1)}</em>;
    }
    return <span key={j}>{part}</span>;
  });
}

// ── Detect numbered list items: "1. Text" or "1) Text" ──
function isNumberedItem(text) {
  return /^\d+[\.\)]\s/.test(text.trim());
}

// ── Detect bullet items: "- Text" or "• Text" ──
function isBulletItem(text) {
  return /^[-•]\s/.test(text.trim());
}

// ── Detect labeled bold patterns like **Error 1 — Title:** or **Tipo 3 — Consulta:** ──
function isLabeledItem(text) {
  return /^\*\*(Error|Intervencion|Intervención|Tipo|Area|Área|Componente|Paso|Fase|Punto|Senal|Señal|Pilar)\s*\d*\s*[—\-:]/i.test(text.trim());
}

// ── Detect concept/term definitions: **Term:** description ──
function isConceptDefinition(text) {
  const t = text.trim();
  if (!t.startsWith('**')) return false;
  const endBold = t.indexOf('**', 2);
  if (endBold === -1) return false;
  const boldContent = t.slice(2, endBold);
  // Must be short (a term/label, not a heading) and followed by content
  return boldContent.length < 60 && boldContent.includes(':') && t.length > endBold + 5;
}

// ── Detect "rule" or "key insight" patterns ──
function isRuleCallout(text) {
  return /^\*\*(Regla de oro|Regla:|Regla fundamental|Principio|Clave:|Importante:|Recuerda:|Atencion:|Atención:)/i.test(text.trim());
}

// ── Detect warning/error patterns ──
function isWarningCallout(text) {
  return /^\*\*(Error critico|Error común|Error tipico|Advertencia|Cuidado|Peligro|No hagas|Evita)/i.test(text.trim());
}

// ── Detect "tip/trick" patterns ──
function isTipCallout(text) {
  return /^\*\*(Truco|Consejo|Tip:|Sugerencia|Recomendacion|Recomendación)/i.test(text.trim());
}

// ── Detect model message / response patterns ──
function isModelMessage(text) {
  return /^\*\*(Mensaje modelo|Respuesta modelo|Respuesta profesional|Ejemplo de mensaje|Ejemplo de respuesta)/i.test(text.trim());
}

// ── Extract title from bold-started paragraph ──
function extractBoldTitle(text) {
  const match = text.match(/^\*\*([^*]+)\*\*\s*(.*)/s);
  if (match) return { title: match[1], body: match[2] };
  return null;
}

// ── Section heading with decorative line ──
function SectionHeading({ children, isFirst }) {
  return (
    <div className={`${isFirst ? 'mt-2' : 'mt-10'} mb-5`}>
      {!isFirst && <div className="w-12 h-[2px] bg-gradient-to-r from-selene-gold/60 to-transparent mb-5" />}
      <h3 className="text-[17px] md:text-[18px] font-display font-semibold text-selene-gold leading-snug tracking-wide">
        {children}
      </h3>
    </div>
  );
}

// ── Callout box (caso práctico, ejercicio, tarea, etc.) ──
function CalloutBox({ icon, label, color, borderColor, bgColor, children }) {
  return (
    <div className={`my-6 p-5 ${bgColor} border-l-[3px] ${borderColor} rounded-r-xl`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className={`text-[13px] font-semibold uppercase tracking-wider ${color}`}>{label}</span>
      </div>
      <div className="text-[14px] text-selene-white-dim leading-[1.85]" style={{ textAlign: 'justify' }}>
        {children}
      </div>
    </div>
  );
}

// ── Rule/insight highlight box ──
function RuleBox({ title, body }) {
  return (
    <div className="my-6 p-5 bg-selene-gold/[0.06] border border-selene-gold/20 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-selene-gold/50" />
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5 shrink-0">💡</span>
        <div>
          {title && <p className="text-[13px] font-semibold text-selene-gold mb-1.5">{title}</p>}
          <p className="text-[14px] text-selene-white-dim leading-[1.85]" style={{ textAlign: 'justify' }}>
            {renderInline(body)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Warning box ──
function WarningBox({ title, body }) {
  return (
    <div className="my-6 p-5 bg-red-500/[0.05] border border-red-500/15 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-400/50" />
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5 shrink-0">⚠️</span>
        <div>
          {title && <p className="text-[13px] font-semibold text-red-400 mb-1.5">{title}</p>}
          <p className="text-[14px] text-selene-white-dim leading-[1.85]" style={{ textAlign: 'justify' }}>
            {renderInline(body)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Tip box ──
function TipBox({ title, body }) {
  return (
    <div className="my-6 p-5 bg-cyan-500/[0.05] border border-cyan-500/15 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400/50" />
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5 shrink-0">✨</span>
        <div>
          {title && <p className="text-[13px] font-semibold text-cyan-400 mb-1.5">{title}</p>}
          <p className="text-[14px] text-selene-white-dim leading-[1.85]" style={{ textAlign: 'justify' }}>
            {renderInline(body)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Model message / quote block ──
function ModelMessage({ title, body }) {
  return (
    <div className="my-6 p-5 bg-selene-purple/[0.06] border-l-[3px] border-selene-purple/40 rounded-r-xl">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💬</span>
          <span className="text-[13px] font-semibold text-selene-purple">{title}</span>
        </div>
      )}
      <p className="text-[14px] text-selene-white/90 leading-[1.85] italic" style={{ textAlign: 'justify' }}>
        {renderInline(body)}
      </p>
    </div>
  );
}

// ── Labeled list item (Error 1, Tipo 2, etc.) ──
function LabeledListItem({ text }) {
  const extracted = extractBoldTitle(text);
  if (!extracted) return <p className="text-[14px] text-selene-white-dim leading-[1.85] mb-4">{renderInline(text)}</p>;

  return (
    <div className="my-4 pl-4 border-l-2 border-selene-white/10">
      <p className="text-[13px] font-semibold text-selene-white mb-1">{extracted.title}</p>
      <p className="text-[14px] text-selene-white-dim leading-[1.85]" style={{ textAlign: 'justify' }}>
        {renderInline(extracted.body)}
      </p>
    </div>
  );
}

// ── Concept definition item ──
function ConceptItem({ text }) {
  const extracted = extractBoldTitle(text);
  if (!extracted) return <p className="text-[14px] text-selene-white-dim leading-[1.85] mb-4">{renderInline(text)}</p>;

  return (
    <div className="my-3 flex gap-2">
      <span className="text-selene-gold/40 mt-1 shrink-0">◆</span>
      <p className="text-[14px] text-selene-white-dim leading-[1.85]">
        <strong className="text-selene-white font-semibold">{extracted.title}</strong>{' '}
        {renderInline(extracted.body)}
      </p>
    </div>
  );
}

// ── Main renderer ──
export default function TextContentRenderer({ text, compact = false }) {
  if (!text) return null;

  const paragraphs = text.split('\n\n');
  const elements = [];
  let headingCount = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (!p) continue;

    // 1. Section heading: standalone **Title**
    if (p.startsWith('**') && p.endsWith('**') && !p.slice(2, -2).includes('**')) {
      headingCount++;
      elements.push(
        <SectionHeading key={i} isFirst={headingCount === 1}>
          {p.replace(/\*\*/g, '')}
        </SectionHeading>
      );
      continue;
    }

    // 2. Caso práctico
    if (/^\*\*Caso pr[aá]ctico/i.test(p)) {
      const ex = extractBoldTitle(p);
      elements.push(
        <CalloutBox key={i} icon="📋" label="Caso práctico" color="text-selene-purple" borderColor="border-selene-purple" bgColor="bg-selene-purple/[0.04]">
          {ex?.title && <p className="text-[13px] font-semibold text-selene-purple/80 mb-2 italic">{ex.title.replace(/^Caso pr[aá]ctico[:\s]*/i, '')}</p>}
          {renderInline(ex?.body || p.replace(/\*\*Caso pr[aá]ctico[^*]*\*\*\s*/i, ''))}
        </CalloutBox>
      );
      continue;
    }

    // 3. Ejercicio guiado
    if (/^\*\*Ejercicio guiado/i.test(p)) {
      const ex = extractBoldTitle(p);
      elements.push(
        <CalloutBox key={i} icon="🎯" label="Ejercicio guiado" color="text-selene-gold" borderColor="border-selene-gold" bgColor="bg-selene-gold/[0.04]">
          {ex?.title && <p className="text-[13px] font-semibold text-selene-gold/80 mb-2 italic">{ex.title.replace(/^Ejercicio guiado[:\s]*/i, '')}</p>}
          {renderInline(ex?.body || p.replace(/\*\*Ejercicio guiado[^*]*\*\*\s*/i, ''))}
        </CalloutBox>
      );
      continue;
    }

    // 4. Tarea para casa
    if (/^\*\*Tarea para casa/i.test(p)) {
      const ex = extractBoldTitle(p);
      elements.push(
        <CalloutBox key={i} icon="📝" label="Tarea para casa" color="text-selene-success" borderColor="border-selene-success" bgColor="bg-selene-success/[0.04]">
          {ex?.title && <p className="text-[13px] font-semibold text-selene-success/80 mb-2 italic">{ex.title.replace(/^Tarea para casa[:\s]*/i, '')}</p>}
          {renderInline(ex?.body || p.replace(/\*\*Tarea para casa[^*]*\*\*\s*/i, ''))}
        </CalloutBox>
      );
      continue;
    }

    // 5. Rule/insight callout
    if (isRuleCallout(p)) {
      const ex = extractBoldTitle(p);
      elements.push(<RuleBox key={i} title={ex?.title} body={ex?.body || p.replace(/\*\*[^*]+\*\*\s*/, '')} />);
      continue;
    }

    // 6. Warning/error callout
    if (isWarningCallout(p)) {
      const ex = extractBoldTitle(p);
      elements.push(<WarningBox key={i} title={ex?.title} body={ex?.body || p.replace(/\*\*[^*]+\*\*\s*/, '')} />);
      continue;
    }

    // 7. Tip/trick callout
    if (isTipCallout(p)) {
      const ex = extractBoldTitle(p);
      elements.push(<TipBox key={i} title={ex?.title} body={ex?.body || p.replace(/\*\*[^*]+\*\*\s*/, '')} />);
      continue;
    }

    // 8. Model message / response
    if (isModelMessage(p)) {
      const ex = extractBoldTitle(p);
      elements.push(<ModelMessage key={i} title={ex?.title} body={ex?.body || p.replace(/\*\*[^*]+\*\*\s*/, '')} />);
      continue;
    }

    // 9. Labeled item (Error N, Tipo N, Componente N, etc.)
    if (isLabeledItem(p)) {
      elements.push(<LabeledListItem key={i} text={p} />);
      continue;
    }

    // 10. Concept definition: **Term:** description (short bold label)
    if (isConceptDefinition(p)) {
      elements.push(<ConceptItem key={i} text={p} />);
      continue;
    }

    // 11. Paragraph with inline bold
    if (p.includes('**')) {
      elements.push(
        <p key={i} className="text-[14px] md:text-[15px] text-selene-white-dim leading-[1.85] mb-5 last:mb-0" style={{ textAlign: 'justify' }}>
          {renderInline(p)}
        </p>
      );
      continue;
    }

    // 12. Regular paragraph
    elements.push(
      <p key={i} className="text-[14px] md:text-[15px] text-selene-white-dim leading-[1.85] mb-5 last:mb-0" style={{ textAlign: 'justify' }}>
        {p}
      </p>
    );
  }

  return <div className={compact ? '' : 'space-y-0'}>{elements}</div>;
}
