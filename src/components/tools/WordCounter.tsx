import React, { useState, useMemo } from 'react';
import { Type, Clock, RotateCcw } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingTimeMinutes = Math.ceil(words / 200);

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
    };
  }, [text]);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <Type className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              CANLI METİN ANALİZİ
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Kelime & Karakter Sayacı
            </h3>
          </div>
        </div>

        <button
          onClick={() => setText('')}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1A1A1A]/5 transition-colors border border-[#1A1A1A]/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Temizle</span>
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Metninizi buraya yazın veya yapıştırın..."
        rows={6}
        className="w-full p-4 rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all resize-y font-sans leading-relaxed"
      />

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
        <div className="p-3.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block">Kelime</span>
          <span className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5 block">{stats.words}</span>
        </div>

        <div className="p-3.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block">Karakter</span>
          <span className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5 block">{stats.charsWithSpaces}</span>
        </div>

        <div className="p-3.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block">Boşluksuz</span>
          <span className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5 block">{stats.charsWithoutSpaces}</span>
        </div>

        <div className="p-3.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block">Cümle</span>
          <span className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5 block">{stats.sentences}</span>
        </div>

        <div className="p-3.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block">Paragraf</span>
          <span className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5 block">{stats.paragraphs}</span>
        </div>

        <div className="p-3.5 bg-[#1A1A1A] text-white rounded-xl text-center border border-[#1A1A1A]">
          <span className="text-[9px] font-mono text-[#C9A86A] uppercase tracking-widest flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Okuma
          </span>
          <span className="text-xl font-serif font-bold text-[#C9A86A] mt-0.5 block">
            {stats.readingTimeMinutes} dk
          </span>
        </div>
      </div>
    </div>
  );
};
