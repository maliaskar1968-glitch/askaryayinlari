import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

interface LessonConfig {
  id: string;
  name: string;
  max: number;
  weight: number;
}

const LGS_LESSONS: LessonConfig[] = [
  { id: 'tr', name: 'Türkçe', max: 20, weight: 4.33 },
  { id: 'ink', name: 'T.C. İnkılap Tarihi', max: 10, weight: 1.66 },
  { id: 'din', name: 'Din Kültürü', max: 10, weight: 1.66 },
  { id: 'ing', name: 'Yabancı Dil (İngilizce)', max: 10, weight: 1.66 },
  { id: 'mat', name: 'Matematik', max: 20, weight: 4.33 },
  { id: 'fen', name: 'Fen Bilimleri', max: 20, weight: 4.33 },
];

export const LgsCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, { d: number; y: number }>>({
    tr: { d: 15, y: 5 },
    ink: { d: 7, y: 3 },
    din: { d: 7, y: 3 },
    ing: { d: 7, y: 3 },
    mat: { d: 12, y: 8 },
    fen: { d: 14, y: 6 },
  });

  const handleChange = (id: string, field: 'd' | 'y', val: number) => {
    const lesson = LGS_LESSONS.find((l) => l.id === id);
    const maxQuestions = lesson ? lesson.max : 20;
    const clampedVal = Math.max(0, Math.min(maxQuestions, val || 0));

    setScores((prev) => {
      const current = prev[id] || { d: 0, y: 0 };
      const updated = { ...current, [field]: clampedVal };
      // Ensure D + Y <= maxQuestions
      if (updated.d + updated.y > maxQuestions) {
        if (field === 'd') updated.y = maxQuestions - updated.d;
        else updated.d = maxQuestions - updated.y;
      }
      return { ...prev, [id]: updated };
    });
  };

  const results = useMemo(() => {
    let totalNet = 0;
    let weightedSum = 0;
    const lessonNets: Record<string, number> = {};

    LGS_LESSONS.forEach((lesson) => {
      const s = scores[lesson.id] || { d: 0, y: 0 };
      const net = Math.max(0, s.d - s.y / 3);
      lessonNets[lesson.id] = net;
      totalNet += net;
      weightedSum += net * lesson.weight;
    });

    // LGS Score Formula approx: Taban (195) + weighted sum
    const estimatedPuan = Math.min(500, Math.round(195 + weightedSum * 1.55));

    return {
      totalNet,
      estimatedPuan,
      lessonNets,
    };
  }, [scores]);

  const handleReset = () => {
    setScores({
      tr: { d: 0, y: 0 },
      ink: { d: 0, y: 0 },
      din: { d: 0, y: 0 },
      ing: { d: 0, y: 0 },
      mat: { d: 0, y: 0 },
      fen: { d: 0, y: 0 },
    });
  };

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <Calculator className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              MEB UYUMLU SİSTEM
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              LGS Puan Hesaplayıcı (2025 MEB)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {LGS_LESSONS.map((lesson) => {
          const s = scores[lesson.id] || { d: 0, y: 0 };
          const net = Math.max(0, s.d - s.y / 3);

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

      {/* Result Display Box */}
      <div className="mt-6 p-6 bg-[#1A1A1A] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#1A1A1A]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A86A] block mb-1">
            SONUÇ ÖZETİ // 2025 MEB
          </span>
          <div className="text-xs text-[#F8F7F4]/70 font-sans">
            Tüm derslerin katsayılı standart hesaplamasıdır.
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A86A] block uppercase tracking-widest">Toplam Net</span>
            <span className="text-2xl font-serif font-black text-white">{results.totalNet.toFixed(2)}</span>
          </div>

          <div className="h-8 w-px bg-white/15" />

          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A86A] block uppercase tracking-widest">Tahmini LGS Puanı</span>
            <span className="text-2xl font-serif font-black text-[#C9A86A]">{results.estimatedPuan}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
