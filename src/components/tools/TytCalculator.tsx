import React, { useState, useMemo } from 'react';
import { GraduationCap, RotateCcw } from 'lucide-react';

interface TytLesson {
  id: string;
  name: string;
  max: number;
}

const TYT_LESSONS: TytLesson[] = [
  { id: 'tr', name: 'TYT Türkçe', max: 40 },
  { id: 'sos', name: 'TYT Sosyal Bilimler', max: 20 },
  { id: 'mat', name: 'TYT Temel Matematik', max: 40 },
  { id: 'fen', name: 'TYT Fen Bilimleri', max: 20 },
];

export const TytCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, { d: number; y: number }>>({
    tr: { d: 28, y: 12 },
    sos: { d: 14, y: 6 },
    mat: { d: 25, y: 15 },
    fen: { d: 12, y: 8 },
  });

  const [diploma, setDiploma] = useState<number>(75);

  const handleChange = (id: string, field: 'd' | 'y', val: number) => {
    const lesson = TYT_LESSONS.find((l) => l.id === id);
    const maxQuestions = lesson ? lesson.max : 40;
    const clampedVal = Math.max(0, Math.min(maxQuestions, val || 0));

    setScores((prev) => {
      const current = prev[id] || { d: 0, y: 0 };
      const updated = { ...current, [field]: clampedVal };
      if (updated.d + updated.y > maxQuestions) {
        if (field === 'd') updated.y = maxQuestions - updated.d;
        else updated.d = maxQuestions - updated.y;
      }
      return { ...prev, [id]: updated };
    });
  };

  const results = useMemo(() => {
    let totalNet = 0;
    TYT_LESSONS.forEach((lesson) => {
      const s = scores[lesson.id] || { d: 0, y: 0 };
      const net = Math.max(0, s.d - s.y / 4);
      totalNet += net;
    });

    // TYT Raw Score = 100 + (totalNet * 3.33)
    const rawScore = Math.min(500, Math.round(100 + totalNet * 3.33));
    // OBP = diploma * 5 -> OBP contribution = OBP * 0.12
    const obpContribution = (diploma * 5 * 0.12);
    const placementScore = Math.min(560, Math.round(rawScore + obpContribution));

    return {
      totalNet,
      rawScore,
      obpContribution,
      placementScore,
    };
  }, [scores, diploma]);

  const handleReset = () => {
    setScores({
      tr: { d: 0, y: 0 },
      sos: { d: 0, y: 0 },
      mat: { d: 0, y: 0 },
      fen: { d: 0, y: 0 },
    });
    setDiploma(75);
  };

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <GraduationCap className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              YKS BİRİNCİ OTURUM
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              YKS - TYT Puan Hesaplayıcı
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1A1A1A]/5 transition-colors border border-[#1A1A1A]/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-5">
        {TYT_LESSONS.map((lesson) => {
          const s = scores[lesson.id] || { d: 0, y: 0 };
          const net = Math.max(0, s.d - s.y / 4);

          return (
            <div
              key={lesson.id}
              className="p-4 rounded-xl bg-[#F8F7F4] border border-[#1A1A1A]/10 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-serif font-bold text-[#1A1A1A]">
                  {lesson.name} <span className="text-[#1A1A1A]/40 font-sans font-normal text-[10px]">({lesson.max} Soru)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-[#1A1A1A] bg-white px-2 py-0.5 rounded border border-[#1A1A1A]/10">
                  {net.toFixed(2)} Net
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1">Doğru</label>
                  <input
                    type="number"
                    min="0"
                    max={lesson.max}
                    value={s.d}
                    onChange={(e) => handleChange(lesson.id, 'd', parseInt(e.target.value) || 0)}
                    className="w-full text-center font-mono font-bold text-xs p-2 rounded-lg border border-[#1A1A1A]/15 bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1">Yanlış</label>
                  <input
                    type="number"
                    min="0"
                    max={lesson.max}
                    value={s.y}
                    onChange={(e) => handleChange(lesson.id, 'y', parseInt(e.target.value) || 0)}
                    className="w-full text-center font-mono font-bold text-xs p-2 rounded-lg border border-[#1A1A1A]/15 bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diploma Grade input */}
      <div className="p-4 bg-[#F8F7F4] rounded-xl border border-[#1A1A1A]/10 mb-6 flex items-center justify-between gap-4">
        <div>
          <label className="text-xs font-serif font-bold text-[#1A1A1A] block">Diploma Notu (50 - 100)</label>
          <span className="text-[10px] text-[#1A1A1A]/60 font-sans">Ortaöğretim Başarı Puanı (OBP) katkısı için</span>
        </div>
        <input
          type="number"
          min="50"
          max="100"
          value={diploma}
          onChange={(e) => setDiploma(Math.max(50, Math.min(100, parseInt(e.target.value) || 50)))}
          className="w-24 text-center font-mono font-bold text-sm p-2.5 rounded-lg border border-[#1A1A1A]/15 bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
        />
      </div>

      {/* Results Box */}
      <div className="p-6 bg-[#1A1A1A] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#1A1A1A]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A86A] block mb-1">
            TYT SONUÇ ÖZETİ
          </span>
          <div className="text-xs text-[#F8F7F4]/70 font-sans">
            OBP Katkısı: +{results.obpContribution.toFixed(1)} Puan
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A86A] block uppercase tracking-widest">TYT Net</span>
            <span className="text-2xl font-serif font-black text-white">{results.totalNet.toFixed(2)}</span>
          </div>

          <div className="h-8 w-px bg-white/15" />

          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A86A] block uppercase tracking-widest">Ham Puan</span>
            <span className="text-2xl font-serif font-black text-white">{results.rawScore}</span>
          </div>

          <div className="h-8 w-px bg-white/15" />

          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A86A] block uppercase tracking-widest">Yerleştirme</span>
            <span className="text-2xl font-serif font-black text-[#C9A86A]">{results.placementScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
