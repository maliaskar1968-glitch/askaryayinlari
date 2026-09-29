import React, { useState, useMemo, useEffect } from 'react';
import { Award, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, Plus, Trash2, BookOpen, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

interface SubjectRow {
  id: string;
  name: string;
  hours: number;
  grade: number;
}

type GradeLevel = '5' | '6' | '7' | '8';

interface TakdirCalculatorProps {
  onGradeChange?: (grade: GradeLevel, bookId: string) => void;
}

const DEFAULT_SUBJECTS: Record<GradeLevel, { name: string; hours: number; grade: number }[]> = {
  '5': [
    { name: 'Türkçe', hours: 6, grade: 88 },
    { name: 'Matematik', hours: 5, grade: 82 },
    { name: 'Fen Bilimleri', hours: 4, grade: 86 },
    { name: 'Sosyal Bilgiler', hours: 3, grade: 90 },
    { name: 'Yabancı Dil (İngilizce)', hours: 3, grade: 85 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 95 },
    { name: 'Bilişim Teknolojileri ve Yazılım', hours: 2, grade: 92 },
    { name: 'Görsel Sanatlar', hours: 1, grade: 96 },
    { name: 'Müzik', hours: 1, grade: 94 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 100 },
    { name: 'Seçmeli Ders 1', hours: 2, grade: 88 },
    { name: 'Seçmeli Ders 2', hours: 2, grade: 90 },
  ],
  '6': [
    { name: 'Türkçe', hours: 6, grade: 85 },
    { name: 'Matematik', hours: 5, grade: 80 },
    { name: 'Fen Bilimleri', hours: 4, grade: 84 },
    { name: 'Sosyal Bilgiler', hours: 3, grade: 88 },
    { name: 'Yabancı Dil (İngilizce)', hours: 3, grade: 82 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 92 },
    { name: 'Bilişim Teknolojileri', hours: 2, grade: 90 },
    { name: 'Görsel Sanatlar', hours: 1, grade: 95 },
    { name: 'Müzik', hours: 1, grade: 95 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 98 },
    { name: 'Seçmeli Ders 1', hours: 2, grade: 85 },
    { name: 'Seçmeli Ders 2', hours: 2, grade: 88 },
  ],
  '7': [
    { name: 'Türkçe', hours: 5, grade: 84 },
    { name: 'Matematik', hours: 5, grade: 78 },
    { name: 'Fen Bilimleri', hours: 4, grade: 82 },
    { name: 'Sosyal Bilgiler', hours: 3, grade: 86 },
    { name: 'Yabancı Dil (İngilizce)', hours: 4, grade: 80 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 94 },
    { name: 'Teknoloji ve Tasarım', hours: 2, grade: 90 },
    { name: 'Görsel Sanatlar', hours: 1, grade: 95 },
    { name: 'Müzik', hours: 1, grade: 95 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 98 },
    { name: 'Seçmeli Ders 1', hours: 2, grade: 85 },
    { name: 'Seçmeli Ders 2', hours: 2, grade: 88 },
  ],
  '8': [
    { name: 'Türkçe', hours: 5, grade: 85 },
    { name: 'Matematik', hours: 5, grade: 80 },
    { name: 'Fen Bilimleri', hours: 4, grade: 84 },
    { name: 'T.C. İnkılap Tarihi ve Atatürkçülük', hours: 2, grade: 90 },
    { name: 'Yabancı Dil (İngilizce)', hours: 4, grade: 85 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 95 },
    { name: 'Teknoloji ve Tasarım', hours: 2, grade: 92 },
    { name: 'Görsel Sanatlar', hours: 1, grade: 95 },
    { name: 'Müzik', hours: 1, grade: 95 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 100 },
    { name: 'Seçmeli Dersler', hours: 4, grade: 88 },
  ],
};

const GRADE_BOOK_MAPPING: Record<GradeLevel, string> = {
  '5': 'k5',
  '6': 'k6',
  '7': 'k7',
  '8': 'k8',
};

export const TakdirCalculator: React.FC<TakdirCalculatorProps> = ({ onGradeChange }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('5');
  const [subjects, setSubjects] = useState<SubjectRow[]>(() =>
    DEFAULT_SUBJECTS['5'].map((s, idx) => ({ ...s, id: `sub-${idx}-${Date.now()}` }))
  );
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // Notify parent component on mount or grade change
  useEffect(() => {
    if (onGradeChange) {
      onGradeChange(selectedGrade, GRADE_BOOK_MAPPING[selectedGrade]);
    }
  }, [onGradeChange, selectedGrade]);

  // Switch Grade Level & reset to default MEB curriculum
  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setSubjects(DEFAULT_SUBJECTS[grade].map((s, idx) => ({ ...s, id: `sub-${idx}-${Date.now()}` })));
    if (onGradeChange) {
      onGradeChange(grade, GRADE_BOOK_MAPPING[grade]);
    }
  };

  const handleUpdateSubject = (id: string, field: 'name' | 'hours' | 'grade', value: any) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        if (field === 'hours') {
          const num = Math.max(1, Math.min(10, parseInt(value) || 1));
          return { ...sub, hours: num };
        }
        if (field === 'grade') {
          const num = Math.max(0, Math.min(100, parseFloat(value) || 0));
          return { ...sub, grade: num };
        }
        return { ...sub, [field]: value };
      })
    );
  };

  const handleAddSubject = () => {
    const newSub: SubjectRow = {
      id: `sub-custom-${Date.now()}`,
      name: 'Yeni Seçmeli Ders',
      hours: 2,
      grade: 85,
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const handleDeleteSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReset = () => {
    setSubjects(DEFAULT_SUBJECTS[selectedGrade].map((s, idx) => ({ ...s, id: `sub-${idx}-${Date.now()}` })));
  };

  // Calculation Results
  const results = useMemo(() => {
    let totalWeighted = 0;
    let totalHours = 0;
    let hasFailingGrade = false;
    let failingCount = 0;

    subjects.forEach((sub) => {
      const h = sub.hours || 0;
      const g = sub.grade || 0;
      totalWeighted += g * h;
      totalHours += h;
      if (g < 50) {
        hasFailingGrade = true;
        failingCount++;
      }
    });

    const average = totalHours > 0 ? totalWeighted / totalHours : 0;
    const roundedAvg = Number(average.toFixed(2));

    let documentStatus: 'TAKDİR' | 'TEŞEKKÜR' | 'BELGE_YOK' = 'BELGE_YOK';
    let statusText = 'Belge Alınamaz (Düz Geçiş)';
    let badgeColor = 'bg-stone-500/20 text-stone-300 border-stone-500/40';

    if (hasFailingGrade) {
      statusText = `Belge Alınamaz (${failingCount} Dersten 50 Altı Not Var)`;
      badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
    } else if (roundedAvg >= 85.0) {
      documentStatus = 'TAKDİR';
      statusText = '🏆 TAKDİR BELGESİ KAZANDINIZ';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    } else if (roundedAvg >= 70.0) {
      documentStatus = 'TEŞEKKÜR';
      statusText = '📜 TEŞEKKÜR BELGESİ KAZANDINIZ';
      badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    } else {
      statusText = 'Belge Alınamaz (70 Puan Altı)';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    const neededForTakdir = Math.max(0, 85.0 - roundedAvg);
    const neededForTesekkur = Math.max(0, 70.0 - roundedAvg);

    return {
      totalHours,
      average: roundedAvg,
      documentStatus,
      statusText,
      badgeColor,
      hasFailingGrade,
      failingCount,
      neededForTakdir: Number(neededForTakdir.toFixed(2)),
      neededForTesekkur: Number(neededForTesekkur.toFixed(2)),
    };
  }, [subjects]);

  const activeRecommendedBook = useMemo(() => {
    const bookId = GRADE_BOOK_MAPPING[selectedGrade];
    return BOOKS_DATA.find((b) => b.id === bookId);
  }, [selectedGrade]);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white shadow-2xs">
            <Award className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#856526] font-bold">
              MEB E-OKUL UYUMLU • DÖNEM SONU
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              Takdir Teşekkür Hesaplayıcı
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold self-start sm:self-auto"
          title="MEB standart müfredat notlarına dön"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* 2. Sınıf Seçici: 5, 6, 7, 8 (Ortaokul) & 9, 10, 11, 12 (Lise) */}
      <div className="mb-6 p-4 rounded-xl bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            1. ADIM: SINIFINIZI SEÇİN:
          </span>
          <span className="text-[10px] font-mono text-[#856526] font-semibold bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
            E-Okul Ders Dağılımı
          </span>
        </div>

        {/* Sınıf Butonları */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/50 mr-1">
            ORTAOKUL:
          </span>
          {(['5', '6', '7', '8'] as const).map((grade) => (
            <button
              key={grade}
              id={`btn-takdir-grade-${grade}`}
              onClick={() => handleSelectGrade(grade)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-[#1A1A1A] text-white ring-2 ring-[#C9A86A]/70 shadow-2xs scale-[1.02]'
                  : 'bg-white text-[#1A1A1A]/70 hover:bg-[#FAF6EE] border border-[#1A1A1A]/15'
              }`}
            >
              [{grade}. SINIF]
            </button>
          ))}

          <a
            href="/uygulamalar/lise-ortalama-hesaplama"
            className="ml-auto text-[11px] font-mono font-bold text-[#7c3aed] hover:underline flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200"
          >
            <span>Lise (9, 10, 11, 12) Hesaplayıcısı için tıklayın</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. Ders Notları Tablosu */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70">
            2. ADIM: DERSLERİN HAFTALIK SAATİNİ VE DÖNEM NOTUNU GİRİN:
          </span>
          <button
            onClick={handleAddSubject}
            className="text-[11px] font-mono font-bold text-[#856526] hover:text-[#1A1A1A] flex items-center gap-1 bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#C9A86A]/30 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ders Ekle</span>
          </button>
        </div>

        <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-2xs bg-[#FAF9F6]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider">
                  <th className="p-3 sm:px-4">Ders Adı</th>
                  <th className="p-3 sm:px-4 text-center w-28">Haftalık Saat</th>
                  <th className="p-3 sm:px-4 text-center w-32">Dönem Notu (0-100)</th>
                  <th className="p-3 sm:px-4 text-center w-28 hidden sm:table-cell">Ağırlıklı Puan</th>
                  <th className="p-3 text-center w-12">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
                {subjects.map((sub, idx) => {
                  const weighted = ((sub.grade || 0) * (sub.hours || 0)).toFixed(1);
                  const isFailing = sub.grade < 50;

                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-[#FAF6EE]/50 transition-colors ${
                        isFailing ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td className="p-2.5 sm:px-4 font-medium text-[#1A1A1A]">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                          className="w-full bg-transparent font-sans font-bold text-xs focus:outline-hidden focus:border-b focus:border-[#C9A86A]"
                        />
                      </td>

                      <td className="p-2.5 sm:px-4 text-center">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={sub.hours}
                          onChange={(e) => handleUpdateSubject(sub.id, 'hours', e.target.value)}
                          className="w-16 text-center font-mono font-bold text-xs p-1.5 rounded-lg border border-[#1A1A1A]/15 bg-[#FAF9F6] focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
                        />
                      </td>

                      <td className="p-2.5 sm:px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={sub.grade}
                            onChange={(e) => handleUpdateSubject(sub.id, 'grade', e.target.value)}
                            className={`w-20 text-center font-mono font-bold text-xs p-1.5 rounded-lg border focus:ring-1 focus:outline-hidden ${
                              isFailing
                                ? 'border-red-400 bg-red-50 text-red-700 focus:ring-red-400'
                                : 'border-[#1A1A1A]/15 bg-[#FAF9F6] text-[#1A1A1A] focus:ring-[#C9A86A]'
                            }`}
                          />
                        </div>
                      </td>

                      <td className="p-2.5 sm:px-4 text-center font-mono font-semibold text-[#1A1A1A]/70 hidden sm:table-cell">
                        {weighted}
                      </td>

                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="text-[#1A1A1A]/30 hover:text-red-600 transition-colors p-1 rounded-md"
                          title="Bu dersi sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Sonuç Kutusu (Ortalama + Belge Durumu + Aşkar KAP Kaynakları) */}
      <div className="p-6 bg-[#1A1A1A] text-white rounded-2xl shadow-md border border-[#1A1A1A] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#C9A86A]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A86A] font-bold">
                E-OKUL DÖNEM ORTALAMASI VE BELGE HESAPLAMA ({selectedGrade}. SINIF)
              </span>
            </div>
            <div className="text-xs text-[#F8F7F4]/80 font-sans">
              Haftalık {results.totalHours} ders saati üzerinden MEB ağırlıklı not ortalaması hesaplanmıştır.
            </div>
          </div>

          <div>
            <span
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-2 ${results.badgeColor}`}
            >
              <span>{results.statusText}</span>
            </span>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Dönem Ağırlıklı Ortalaması
            </span>
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#C9A86A]">
              {results.average.toFixed(2)}
            </span>
            <span className="text-[10px] text-white/50 block mt-1">100 Tam Puan Üzerinden</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Belge Kriteri (MEB)
            </span>
            <div className="text-xs text-white/80 space-y-1 mt-1 font-sans">
              <p>Teşekkür: <strong>70.00 - 84.99</strong></p>
              <p>Takdir: <strong>85.00 - 100.00</strong></p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-[#C9A86A] block uppercase tracking-widest font-semibold mb-1">
              Hedef Analizi
            </span>
            <div className="text-xs text-white/80 space-y-1 mt-1 font-sans">
              {results.documentStatus === 'TAKDİR' ? (
                <p className="text-emerald-400 font-bold">Harika! Takdir belgesi almaya hak kazandınız.</p>
              ) : results.documentStatus === 'TEŞEKKÜR' ? (
                <p>Takdir Belgesi için gereken: <strong className="text-[#C9A86A]">+{results.neededForTakdir} Puan</strong></p>
              ) : (
                <p>Teşekkür Belgesi için gereken: <strong className="text-amber-400">+{results.neededForTesekkur} Puan</strong></p>
              )}
            </div>
          </div>
        </div>

        {/* Zayıf Ders Uyarısı */}
        {results.hasFailingGrade && (
          <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center gap-3 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>MEB Yönetmelik Uyarısı:</strong> Dönem notu 50.00'nin altında kalan dersiniz bulunduğu sürece, genel ortalamanız 85.00 üzerinde olsa dahi takdir veya teşekkür belgesi alamazsınız.
            </span>
          </div>
        )}

        {/* İlgili Aşkar Yayınları Başarı & Koçluk Kitabı */}
        {activeRecommendedBook && (
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/75 font-sans">
              Ders başarısını ve dönem ortalamanızı yükseltecek <strong>{selectedGrade}. Sınıf Aşkar Yayınları</strong> koçluk rehberini inceleyin.
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPreviewBook(activeRecommendedBook)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Önizle</span>
              </button>

              <a
                href={activeRecommendedBook.shopierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Shopier ile İndir</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]" />
              </a>
            </div>
          </div>
        )}
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
