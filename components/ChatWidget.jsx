'use client';

import { useState, useRef, useEffect } from 'react';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hola ✦ Soy Selene, tu guía en la academia. Puedo ayudarte con dudas sobre cursos, certificaciones, tu progreso, o cualquier pregunta sobre astrología, tarot y desarrollo espiritual. ¿En qué puedo ayudarte?',
};

function formatMessage(text) {
  // Bold: **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Unordered lists: lines starting with - or •
  formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-4 my-1 space-y-0.5">$&</ul>');
  // Numbered lists: lines starting with 1. 2. etc
  formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-selene-gold/60"
            style={{
              animation: 'selene-bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-selene-white-dim ml-2">Selene está escribiendo...</span>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('Error de conexión');

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Disculpa, no he podido procesar tu mensaje ahora mismo. ¿Podrías intentarlo de nuevo? ✦',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-selene-gold/20 transition-all duration-300 hover:scale-110 hover:shadow-selene-gold/40 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A0 50%, #C9A84C 100%)',
        }}
        aria-label="Consulta con Selene"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Moon */}
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          {/* Star */}
          <path d="M17 4l.5 1.5L19 6l-1.5.5L17 8l-.5-1.5L15 6l1.5-.5L17 4z" fill="#0A0A0F" />
        </svg>
      </button>

      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[380px] z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--bg)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A0 100%)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif" }}>
                Pregunta a Selene ✦
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--white-dim)' }}>
                Tu guía en la academia
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'var(--white-dim)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarGutter: 'stable' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.08) 100%)',
                        border: '1px solid rgba(201,168,76,0.25)',
                        color: 'var(--white)',
                      }
                    : {
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--white)',
                      }
                }
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-bl-md"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="shrink-0 px-4 py-3"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--card)',
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-selene-white-dim/50 disabled:opacity-50"
              style={{ color: 'var(--white)' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30"
              style={{
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #C9A84C 0%, #E8D5A0 100%)'
                  : 'var(--border)',
              }}
              aria-label="Enviar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: 'var(--white-dim)', opacity: 0.5 }}>
            Consulta con Selene ✦ SelenaUra Academia
          </p>
        </div>
      </div>

      {/* Keyframe animation for typing dots */}
      <style jsx global>{`
        @keyframes selene-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
