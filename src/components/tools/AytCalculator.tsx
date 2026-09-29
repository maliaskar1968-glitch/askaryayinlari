import React, { useState, useMemo } from 'react';
import { BookMarked, RotateCcw } from 'lucide-react';

interface AytLesson {
  id: string;
  name: string;
  max: number;
  category: 'ea_soz' | 'say' | 'soz';
}

const AYT_LESSONS: AytLesson[] = [
  { id: 'ed', name: 'AYT Edebiyat', max: 24, category: 'ea_soz' },
  { id: 't1', name: 'AYT Tarih-1', max: 10, category: 'ea_soz' },
  { id: 'c1', name: 'AYT Coğrafya-1', max: 6, category: 'ea_soz' },
  { id: 'mat', name: 'AYT Matematik', max: 40, category: 'say' },
  { id: 'fiz', name: 'AYT Fizik', max: 14, category: 'say' },
  { id: 'kim', name: 'AYT Kimya', max: 13, category: 'say' },
  { id: 'bio', name: 'AYT Biyoloji', max: 13, category: 'say' },
  { id: 't2', name: 'AYT Tarih-2', max: 11, category: 'soz' },
  { id: 'c2', name: 'AYT Coğrafya-2', max: 11, category: 'soz' },
  { id: 'fel', name: 'AYT Felsefe Grubu', max: 12, category: 'soz' },
];

export const AytCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, { d: number; y: number }>>({
    ed: { d: 15, y: 9 },
    t1: { d: 6, y: 4 },
    c1: { d: 4, y: 2 },
    mat: { d: 25, y: 15 },
    fiz: { d: 8, y: 6 },
    kim: { d: 8, y: 5 },
    bio: { d: 8, y: 5 },
    t2: { d: 7, y: 4 },
    c2: { d: 7, y: 4 },
    fel: { d: 8, y: 4 },
  });

  const handleChange = (id: string, field: 'd' | 'y', val: number) => {
    const lesson = AYT_LESSONS.find((l) => l.id === id);
    const maxQuestions = lesson ? lesson.max : 20;
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
    let sayNet = 0;
    let eaNet = 0;
    let sozNet = 0;

    AYT_LESSONS.forEach((lesson) => {
      const s = scores[lesson.id] || { d: 0, y: 0 };
      const net = Math.max(0, s.d - s.y / 4);
      totalNet += net;

      if (['mat', 'fiz', 'kim', 'bio'].includes(lesson.id)) {
        sayNet += net;
      }
      if (['mat', 'ed', 't1', 'c1'].includes(lesson.id)) {
        eaNet += net;
      }
      if (['ed', 't1', 'c1', 't2', 'c2', 'fel'].includes(lesson.id)) {
        sozNet += net;
      }
    });

    const sayPuan = Math.min(500, Math.round(100 + sayNet * 5));
    const eaPuan = Math.min(500, Math.round(100 + eaNet * 5));
    const sozPuan = Math.min(500, Math.round(100 + sozNet * 5));

    return {
      totalNet,
      sayNet,
      eaNet,
      sozNet,
      sayPuan,
      eaPuan,
      sozPuan,
    };
  }, [scores]);

  const handleReset = () => {
    setScores({
      ed: { d: 0, y: 0 },
      t1: { d: 0, y: 0 },
      c1: { d: 0, y: 0 },
      mat: { d: 0, y: 0 },
      fiz: { d: 0, y: 0 },
      kim: { d: 0, y: 0 },
      bio: { d: 0, y: 0 },
      t2: { d: 0, y: 0 },
      c2: { d: 0, y: 0 },
      fel: { d: 0, y: 0 },
    });
  };

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <BookMarked className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              YKS İKİNCİ OTURUM
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              YKS - AYT Puan Hesaplayıcı (Tüm Dersler)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {AYT_LESSONS.map((lesson) => {
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

      {/* AYT Puan Types Breakdown */}
      <div className="p-6 bg-[#1A1A1A] text-white rounded-xl shadow-sm space-y-4 border border-[#1A1A1A]">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A86A] block border-b border-white/10 pb-3">
          AYT ALAN PUANLARI ÖZETİ
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-serif font-bold text-[#F8F7F4] block mb-1">AYT Sayısal (SAY)</span>
            <div className="text-xs text-[#F8F7F4]/60 font-sans">Net: <b className="text-white font-mono">{results.sayNet.toFixed(2)}</b></div>
            <div className="text-xl font-serif font-black text-[#C9A86A] mt-2">{results.sayPuan} Puan</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-serif font-bold text-[#F8F7F4] block mb-1">AYT Eşit Ağırlık (EA)</span>
            <div className="text-xs text-[#F8F7F4]/60 font-sans">Net: <b className="text-white font-mono">{results.eaNet.toFixed(2)}</b></div>
            <div className="text-xl font-serif font-black text-[#C9A86A] mt-2">{results.eaPuan} Puan</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-serif font-bold text-[#F8F7F4] block mb-1">AYT Sözel (SÖZ)</span>
            <div className="text-xs text-[#F8F7F4]/60 font-sans">Net: <b className="text-white font-mono">{results.sozNet.toFixed(2)}</b></div>
            <div className="text-xl font-serif font-black text-[#C9A86A] mt-2">{results.sozPuan} Puan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
