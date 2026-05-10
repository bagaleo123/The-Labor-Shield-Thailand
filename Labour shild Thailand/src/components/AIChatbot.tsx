import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader as Loader2, Bot, User, Shield } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY) as string;

export default function AIChatbot() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: lang === 'th'
        ? 'สวัสดีครับ ผมคือที่ปรึกษากฎหมายแรงงาน AI ครับ อธิบายสถานการณ์ของคุณได้เลยครับ'
        : lang === 'ru'
        ? 'Здравствуйте! Я AI-консультант по трудовому праву Таиланда. Опишите вашу ситуацию.'
        : "Hello! I'm your AI Thai Labor Law Consultant. Describe your situation and I'll give you a legal assessment based on the Thai Labor Protection Act.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-legal-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query: q, language: lang }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer ?? data.error ?? 'No response.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl shadow-blue-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-800/70 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label={t('aiBtn')}
      >
        <Bot size={20} />
        <span className="text-sm">{t('aiBtn')}</span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/80 border border-slate-700"
          style={{ height: '520px', background: '#0f1f3d' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-800/40" style={{ background: 'rgba(15, 31, 61, 0.98)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{t('aiTitle')}</p>
                <p className="text-blue-400 text-xs">Thai Labor Law 2026</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'assistant' ? 'bg-blue-700/50' : 'bg-slate-700'}`}>
                  {msg.role === 'assistant' ? <Bot size={14} className="text-blue-300" /> : <User size={14} className="text-slate-300" />}
                </div>
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-700/50 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-blue-300" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                  <Loader2 size={14} className="text-blue-400 animate-spin" />
                  <span className="text-slate-400 text-xs">{t('aiThinking')}</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-800/60">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={t('aiPlaceholder')}
                rows={2}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none leading-relaxed"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-2.5 rounded-xl transition-all disabled:cursor-not-allowed shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
