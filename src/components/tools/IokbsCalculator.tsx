import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, RotateCcw, Sparkles, BookOpen, CheckCircle2, Award, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

interface LessonConfig {
  id: string;
  name: string;
  max: number;
}

interface IokbsCalculatorProps {
  onGradeChange?: (grade: '5' | '6' | '7', bookId: string) => void;
}

const IOKBS_LESSONS: LessonConfig[] = [
  { id: 'tr', name: 'Türkçe', max: 25 },
  { id: 'mat', name: 'Matematik', max: 25 },
  { id: 'fen', name: 'Fen Bilimleri', max: 25 },
  { id: 'sos', name: 'Sosyal Bilgiler', max: 25 },
];

// 2024-2025 MEB İOKBS Yaklaşık Taban Puanları (Diğer Çocuk Kontenjanı)
const GRADE_THRESHOLDS: Record<'5' | '6' | '7', { taban: number; bookId: string; title: string }> = {
  '5': { taban: 458, bookId: 'k5', title: '5. Sınıf Koçluk & Motivasyon' },
  '6': { taban: 452, bookId: 'k6', title: '6. Sınıf Disiplin ve Başarı' },
  '7': { taban: 447, bookId: 'k7', title: '7. Sınıf LGS Hazırlık' },
};

export const IokbsCalculator: React.FC<IokbsCalculatorProps> = ({ onGradeChange }) => {
  const [selectedGrade, setSelectedGrade] = useState<'5' | '6' | '7'>('5');
  const [scores, setScores] = useState<Record<string, { d: number; y: number }>>({
    tr: { d: 23, y: 2 },
    mat: { d: 21, y: 3 },
    fen: { d: 22, y: 2 },
    sos: { d: 23, y: 2 },
  });
  const [showKapResources, setShowKapResources] = useState<boolean>(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  useEffect(() => {
    if (onGradeChange) {
      onGradeChange(selectedGrade, GRADE_THRESHOLDS[selectedGrade].bookId);
    }
  }, [onGradeChange, selectedGrade]);

  const handleChange = (id: string, field: 'd' | 'y', val: number) => {
    const maxQuestions = 25;
    const clampedVal = Math.max(0, Math.min(maxQuestions, isNaN(val) ? 0 : val));

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
    let totalD = 0;
    let totalY = 0;
    let totalNet = 0;
    const lessonNets: Record<string, number> = {};

    IOKBS_LESSONS.forEach((lesson) => {
      const s = scores[lesson.id] || { d: 0, y: 0 };
      totalD += s.d;
      totalY += s.y;
      const net = Math.max(0, s.d - s.y / 3);
      lessonNets[lesson.id] = net;
      totalNet += net;
    });

    const totalEmpty = 100 - (totalD + totalY);

    // MEB İOKBS 5, 6, 7. Sınıf Puanlama Formülü:
    // Standart 100 Taban + (Toplam Net * 4.0) = 100 net 500.000 puan
    // MEB standart sapma simülasyonu: 100 net = 500 puan, 0 net = 100 puan.
    const calculatedPuan = Math.min(500, Math.max(100, 100 + totalNet * 4.0));

    const threshold = GRADE_THRESHOLDS[selectedGrade];
    const isPassing = calculatedPuan >= threshold.taban;
    const diff = calculatedPuan - threshold.taban;

    return {
      totalD,
      totalY,
      totalEmpty,
      totalNet,
      calculatedPuan: Number(calculatedPuan.toFixed(3)),
      lessonNets,
      threshold,
      isPassing,
      diff: Number(diff.toFixed(2)),
    };
  }, [scores, selectedGrade]);

  const handleReset = () => {
    setScores({
      tr: { d: 0, y: 0 },
      mat: { d: 0, y: 0 },
      fen: { d: 0, y: 0 },
      sos: { d: 0, y: 0 },
    });
  };

  const activeRecommendedBook = useMemo(() => {
    const bookId = GRADE_THRESHOLDS[selectedGrade].bookId;
    return BOOKS_DATA.find((b) => b.id === bookId);
  }, [selectedGrade]);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Header Bar: Title, MEB Tag & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white shadow-2xs">
            <Calculator className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#856526] font-bold">
              MEB İOKBS 2025 • STANDART SAPMA UYUMLU
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              İOKBS Bursluluk Puan Hesaplama
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold"
            title="Tüm netleri sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* 2. Sınıf Seçimi: 5. Sınıf, 6. Sınıf, 7. Sınıf */}
      <div className="mb-6 p-4 rounded-xl bg-[#FAF9F6] border border-[#1A1A1A]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C9A86A]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              1. ADIM: SINIFINIZI SEÇİN:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(['5', '6', '7'] as const).map((grade) => {
              const isActive = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  id={`iokbs-grade-${grade}`}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white ring-2 ring-[#C9A86A]/70 shadow-sm scale-[1.02]'
                      : 'bg-white text-[#1A1A1A]/70 hover:bg-[#FAF6EE] border border-[#1A1A1A]/15'
                  }`}
                >
                  [{grade}. SINIF]
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-[#1A1A1A]/60 font-sans mt-2">
          MEB kılavuzuna göre {selectedGrade}. sınıf İOKBS sınavında toplam 100 soru (Türkçe 25, Matematik 25, Fen 25, Sosyal 25) sorulmaktadır ve 3 yanlış 1 doğruyu götürür.
        </p>
      </div>

      {/* 3. 4 Dersin Doğru ve Yanlış Giriş Tablosu */}
      <div className="mb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/60 mb-3 flex items-center justify-between">
          <span>2. ADIM: DERSLERE AİT DOĞRU VE YANLIŞLARI GİRİN:</span>
          <span className="text-[10px] text-[#856526] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
            3 Yanlış = -1 Net
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IOKBS_LESSONS.map((lesson) => {
            const s = scores[lesson.id] || { d: 0, y: 0 };
            const net = Math.max(0, s.d - s.y / 3);
            const emptyCount = lesson.max - (s.d + s.y);

            return (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 flex flex-col justify-between hover:border-[#C9A86A]/50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-serif font-bold text-[#1A1A1A]">
                      {lesson.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1A1A1A] bg-white px-2 py-0.5 rounded-md border border-[#1A1A1A]/12 shadow-2xs">
                      {lesson.max} Soru
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1 font-bold">
                        Doğru (D)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={lesson.max}
                        value={s.d === 0 ? '' : s.d}
                        placeholder="0"
                        onChange={(e) => handleChange(lesson.id, 'd', parseInt(e.target.value) || 0)}
                        className="w-full text-center font-mono font-bold text-sm p-2 rounded-xl border border-[#1A1A1A]/20 bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#C9A86A] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1 font-bold">
                        Yanlış (Y)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={lesson.max}
                        value={s.y === 0 ? '' : s.y}
                        placeholder="0"
                        onChange={(e) => handleChange(lesson.id, 'y', parseInt(e.target.value) || 0)}
                        className="w-full text-center font-mono font-bold text-sm p-2 rounded-xl border border-[#1A1A1A]/20 bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#C9A86A] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1A1A1A]/8 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-[#1A1A1A]/50">
                    Boş: {emptyCount}
                  </span>
                  <div className="font-mono font-bold text-[#856526] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
                    {net.toFixed(2)} Net
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sonuç Özeti Kartı (2025 MEB Puanı + Netler + Aşkar KAP Butonu) */}
      <div className="p-6 bg-[#1A1A1A] text-white rounded-2xl shadow-md border border-[#1A1A1A] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#C9A86A]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A86A] font-bold">
                2025 İOKBS HESAPLAMA SONUCU ({selectedGrade}. SINIF)
              </span>
            </div>
            <div className="text-xs text-[#F8F7F4]/80 font-sans">
              100 soru üzerinden 3 yanlış 1 doğruyu götürerek hesaplanan MEB standart tahmini puan.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                results.isPassing
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {results.isPassing
                  ? 'Bursluluk Kazanma İhtimali Yüksek'
                  : 'Bursluluk Taban Puanına Yakın'}
              </span>
            </span>
          </div>
        </div>

        {/* Puan ve İstatistikler Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Toplam Net
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-white">
              {results.totalNet.toFixed(2)}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">/ 100 Net</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Doğru / Yanlış
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-white">
              {results.totalD} <span className="text-white/40 text-sm">D</span> / {results.totalY} <span className="text-white/40 text-sm">Y</span>
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">{results.totalEmpty} Boş</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Tahmini Taban Puan
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-white">
              ~{results.threshold.taban}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">{selectedGrade}. Sınıf Referansı</span>
          </div>

          <div className="bg-gradient-to-br from-[#C9A86A]/20 to-transparent p-3.5 rounded-xl border border-[#C9A86A]/50 ring-1 ring-[#C9A86A]/30">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-bold mb-1">
              2025 İOKBS PUANI
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-[#C9A86A]">
              {results.calculatedPuan}
            </span>
            <span className="text-[10px] text-white/60 block mt-0.5">500 Tam Puan Üzerinden</span>
          </div>
        </div>

        {/* 5. ZORUNLU BUTON: "Bu puana uygun AŞKAR KAP Kaynakları" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/70 font-sans">
            Mevcut netlerinizi artıracak <strong>{selectedGrade}. Sınıf AŞKAR KAP</strong> (Koçluk & Akıllı Planlama) rehberini anında inceleyin.
          </div>

          <button
            id="btn-iokbs-kap-resources"
            onClick={() => {
              setShowKapResources(true);
              const el = document.getElementById('iokbs-kap-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="w-full sm:w-auto bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4 text-[#1A1A1A]" />
            <span>Bu puana uygun AŞKAR KAP Kaynakları</span>
            <ArrowRight className="w-4 h-4 text-[#1A1A1A]" />
          </button>
        </div>
      </div>

      {/* 6. AŞKAR KAP Kaynakları Bölümü (Önerilen Kitap & Detaylar) */}
      <div id="iokbs-kap-section" className="mt-8 pt-6 border-t border-[#1A1A1A]/10">
        <div className="bg-[#FAF9F6] border-2 border-[#C9A86A]/40 rounded-2xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/20 text-[#856526] text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
                <span>AŞKAR KAP • KOÇLUK & AKILLI PLANLAMA SİSTEMİ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
                {selectedGrade}. Sınıf Bursluluk Başarısı İçin Aşkar KAP Kaynakları
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-white px-3 py-1.5 rounded-lg border border-[#1A1A1A]/10">
              Puan Hedefi: {results.calculatedPuan} ➔ {Math.min(500, Math.round(results.calculatedPuan + 25))} Puan
            </span>
          </div>

          {activeRecommendedBook && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Kitap Görseli */}
              <div className="md:col-span-1 bg-white p-3 rounded-2xl border border-[#1A1A1A]/10 flex items-center justify-center aspect-square shadow-2xs">
                <img
                  src={activeRecommendedBook.image}
                  alt={activeRecommendedBook.title}
                  className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Kitap Açıklaması ve Kazanımlar */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-white px-2 py-0.5 rounded bg-[#1A1A1A]">
                      {activeRecommendedBook.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#856526] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/40">
                      {activeRecommendedBook.altBaslik || `${activeRecommendedBook.pageCount} Sayfa`}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A]">
                    {activeRecommendedBook.title}
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1">
                    {activeRecommendedBook.subtitle}
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#1A1A1A]/10 space-y-2">
                  <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>İOKBS Bursluluk Sınavında Netlerinizi Nasıl Artırır?</span>
                  </div>
                  <ul className="text-xs text-[#1A1A1A]/75 font-sans space-y-1 list-disc list-inside">
                    <li>3 yanlış 1 doğruyu götürür tuzağını önleyen deneme analiz ve sıfır hata yöntemi.</li>
                    <li>Günde düzenli soru çözme ve masada odaklanma disiplini (10 haftalık sistem).</li>
                    <li>Sınav kaygısını azaltan ve dikkat hatalarını sıfırlayan koçluk teknikleri.</li>
                  </ul>
                </div>

                {/* Fiyat ve Butonlar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-baseline gap-2">
                    {activeRecommendedBook.originalPrice && (
                      <span className="text-xs text-[#1A1A1A]/40 line-through font-sans">
                        {activeRecommendedBook.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-serif font-black text-[#1A1A1A]">
                      {activeRecommendedBook.price}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#059669] font-bold">
                      Kargo Yok • Anında PDF İndir
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewBook(activeRecommendedBook)}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 py-2.5 px-3.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                      <span>ÖNİZLE</span>
                    </button>

                    <a
                      href={activeRecommendedBook.shopierUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>SHOPIER İLE İNDİR</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C9A86A]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {previewBook && (
        <PreviewModal
          book={previewBook}
          isOpen={true}
          onClose={() => setPreviewBook(null)}
        />
      )}
    </div>
  );
};
