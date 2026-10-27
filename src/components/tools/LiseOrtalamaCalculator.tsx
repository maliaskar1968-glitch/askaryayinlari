import React, { useState, useMemo, useEffect } from 'react';
import { Award, Calculator, Clock, AlertTriangle, CheckCircle2, RotateCcw, Plus, Trash2, BookOpen, ExternalLink, Eye, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

type LiseGrade = '9' | '10' | '11' | '12';
type ActiveTab = 'ortalama' | 'takdir' | 'devamsizlik';

interface SubjectRow {
  id: string;
  name: string;
  hours: number;
  grade: number;
}

const DEFAULT_LISE_SUBJECTS: Record<LiseGrade, { name: string; hours: number; grade: number }[]> = {
  '9': [
    { name: 'Türk Dili ve Edebiyatı', hours: 5, grade: 82 },
    { name: 'Matematik', hours: 6, grade: 75 },
    { name: 'Fizik', hours: 2, grade: 78 },
    { name: 'Kimya', hours: 2, grade: 80 },
    { name: 'Biyoloji', hours: 2, grade: 84 },
    { name: 'Tarih', hours: 2, grade: 88 },
    { name: 'Coğrafya', hours: 2, grade: 85 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 95 },
    { name: 'Birinci Yabancı Dil (İngilizce)', hours: 4, grade: 85 },
    { name: 'İkinci Yabancı Dil (Almanca/Fransızca)', hours: 2, grade: 88 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 98 },
    { name: 'Görsel Sanatlar / Müzik', hours: 2, grade: 95 },
    { name: 'Sağlık Bilgisi ve Trafik Kültürü', hours: 1, grade: 90 },
    { name: 'Seçmeli Ders 1', hours: 2, grade: 85 },
    { name: 'Seçmeli Ders 2', hours: 2, grade: 88 },
  ],
  '10': [
    { name: 'Türk Dili ve Edebiyatı', hours: 5, grade: 80 },
    { name: 'Matematik', hours: 6, grade: 72 },
    { name: 'Fizik', hours: 2, grade: 75 },
    { name: 'Kimya', hours: 2, grade: 78 },
    { name: 'Biyoloji', hours: 2, grade: 82 },
    { name: 'Tarih', hours: 2, grade: 86 },
    { name: 'Coğrafya', hours: 2, grade: 84 },
    { name: 'Felsefe', hours: 2, grade: 88 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 95 },
    { name: 'Birinci Yabancı Dil (İngilizce)', hours: 4, grade: 82 },
    { name: 'İkinci Yabancı Dil (Almanca)', hours: 2, grade: 86 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 98 },
    { name: 'Görsel Sanatlar / Müzik', hours: 2, grade: 94 },
    { name: 'Seçmeli Ders', hours: 4, grade: 85 },
  ],
  '11': [
    { name: 'Türk Dili ve Edebiyatı', hours: 5, grade: 84 },
    { name: 'Tarih', hours: 2, grade: 86 },
    { name: 'Felsefe', hours: 2, grade: 88 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 95 },
    { name: 'Birinci Yabancı Dil (İngilizce)', hours: 4, grade: 85 },
    { name: 'İkinci Yabancı Dil (Almanca)', hours: 2, grade: 88 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 98 },
    { name: 'Seçmeli İleri Matematik', hours: 6, grade: 74 },
    { name: 'Seçmeli Alan Dersi 1 (Fizik / Coğrafya)', hours: 4, grade: 78 },
    { name: 'Seçmeli Alan Dersi 2 (Kimya / Psikoloji)', hours: 4, grade: 80 },
    { name: 'Seçmeli Alan Dersi 3 (Biyoloji / Sosyoloji)', hours: 4, grade: 82 },
  ],
  '12': [
    { name: 'Türk Dili ve Edebiyatı', hours: 5, grade: 86 },
    { name: 'T.C. İnkılap Tarihi ve Atatürkçülük', hours: 2, grade: 90 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', hours: 2, grade: 96 },
    { name: 'Birinci Yabancı Dil (İngilizce)', hours: 4, grade: 88 },
    { name: 'İkinci Yabancı Dil (Almanca)', hours: 2, grade: 90 },
    { name: 'Beden Eğitimi ve Spor', hours: 2, grade: 100 },
    { name: 'Seçmeli İleri Matematik', hours: 6, grade: 78 },
    { name: 'Seçmeli Alan Dersi 1', hours: 4, grade: 80 },
    { name: 'Seçmeli Alan Dersi 2', hours: 4, grade: 82 },
    { name: 'Seçmeli Alan Dersi 3', hours: 4, grade: 85 },
    { name: 'Seçmeli Proje / Destek', hours: 2, grade: 92 },
  ]
};

const GRADE_BOOK_MAPPING: Record<LiseGrade, string> = {
  '9': 'k9',
  '10': 'k10',
  '11': 'k11',
  '12': 'k_yks'
};

interface LiseOrtalamaCalculatorProps {
  onGradeChange?: (grade: LiseGrade, bookId: string) => void;
}

export const LiseOrtalamaCalculator: React.FC<LiseOrtalamaCalculatorProps> = ({ onGradeChange }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ortalama');
  const [selectedGrade, setSelectedGrade] = useState<LiseGrade>('9');
  const [subjects, setSubjects] = useState<SubjectRow[]>(() =>
    DEFAULT_LISE_SUBJECTS['9'].map((s, idx) => ({ ...s, id: `lise-9-${idx}` }))
  );

  // Devamsızlık State
  const [unexcusedDays, setUnexcusedDays] = useState<number>(3.5); // Özürsüz (max 10 gün)
  const [excusedDays, setExcusedDays] = useState<number>(5.0); // Özürlü/Raporlu (max 20 gün)

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectHours, setNewSubjectHours] = useState(2);
  const [newSubjectGrade, setNewSubjectGrade] = useState(85);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  useEffect(() => {
    onGradeChange?.(selectedGrade, GRADE_BOOK_MAPPING[selectedGrade]);
  }, [selectedGrade]);

  // Switch grade
  const handleGradeChange = (grade: LiseGrade) => {
    setSelectedGrade(grade);
    onGradeChange?.(grade, GRADE_BOOK_MAPPING[grade]);
    setSubjects(
      DEFAULT_LISE_SUBJECTS[grade].map((s, idx) => ({
        ...s,
        id: `lise-${grade}-${idx}-${Date.now()}`
      }))
    );
  };

  const handleReset = () => {
    setSubjects(
      DEFAULT_LISE_SUBJECTS[selectedGrade].map((s, idx) => ({
        ...s,
        id: `lise-${selectedGrade}-${idx}-${Date.now()}`
      }))
    );
    setUnexcusedDays(3.5);
    setExcusedDays(5.0);
  };

  const updateSubject = (id: string, field: 'grade' | 'hours', val: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === 'grade') {
          return { ...s, grade: Math.min(100, Math.max(0, val || 0)) };
        }
        return { ...s, hours: Math.min(10, Math.max(1, val || 1)) };
      })
    );
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    setSubjects((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newSubjectName.trim(),
        hours: newSubjectHours,
        grade: newSubjectGrade
      }
    ]);
    setNewSubjectName('');
    setNewSubjectHours(2);
    setNewSubjectGrade(85);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Ortalama & Belge Analizi
  const stats = useMemo(() => {
    let totalWeighted = 0;
    let totalHours = 0;
    let failingCount = 0;
    const failingSubjects: string[] = [];

    subjects.forEach((s) => {
      totalWeighted += s.grade * s.hours;
      totalHours += s.hours;
      if (s.grade < 50) {
        failingCount++;
        failingSubjects.push(s.name);
      }
    });

    const average = totalHours > 0 ? Number((totalWeighted / totalHours).toFixed(2)) : 0;
    const hasFailingGrade = failingCount > 0;
    const exceedsAttendanceForCertificate = unexcusedDays > 5;

    let certificate: 'Takdir Belgesi' | 'Teşekkür Belgesi' | 'Belge Alamaz' = 'Belge Alamaz';
    let certificateReason = '';

    if (hasFailingGrade) {
      certificate = 'Belge Alamaz';
      certificateReason = `${failingCount} adet 50 altı zayıf dersiniz olduğu için E-Okul mevzuatı gereği belge verilemez.`;
    } else if (exceedsAttendanceForCertificate) {
      certificate = 'Belge Alamaz';
      certificateReason = `Özürsüz devamsızlığınız 5 günü aştığı için (${unexcusedDays} gün), MEB Madde 160 gereği takdir/teşekkür belgesi alamazsınız.`;
    } else if (average >= 85.0) {
      certificate = 'Takdir Belgesi';
      certificateReason = 'Tebrikler! 85,00 ve üzeri ortalama ve sıfır zayıfla Takdir Belgesi almaya hak kazandınız.';
    } else if (average >= 70.0) {
      certificate = 'Teşekkür Belgesi';
      certificateReason = 'Tebrikler! 70,00 - 84,99 aralığında ortalama ve sıfır zayıfla Teşekkür Belgesi almaya hak kazandınız.';
    } else {
      certificate = 'Belge Alamaz';
      certificateReason = 'Dönem ağırlıklı ortalamanız 70,00 barajının altında kaldığı için belge alamazsınız.';
    }

    return {
      average,
      totalHours,
      hasFailingGrade,
      failingCount,
      failingSubjects,
      exceedsAttendanceForCertificate,
      certificate,
      certificateReason
    };
  }, [subjects, unexcusedDays]);

  // Devamsızlık Analizi
  const attendanceStats = useMemo(() => {
    const totalDays = Number((unexcusedDays + excusedDays).toFixed(1));
    const remainingUnexcused = Number(Math.max(0, 10 - unexcusedDays).toFixed(1));
    const remainingTotal = Number(Math.max(0, 30 - totalDays).toFixed(1));

    const isFailedUnexcused = unexcusedDays > 10;
    const isFailedTotal = totalDays > 30;
    const isFailed = isFailedUnexcused || isFailedTotal;
    const isNoCertificate = unexcusedDays > 5;

    let statusText = 'Güvenli Durum';
    let statusColor = 'bg-emerald-500/20 text-emerald-700 border-emerald-400';

    if (isFailed) {
      statusText = 'SINIFTA KALDI (Devamsızlıktan Kalma)';
      statusColor = 'bg-red-500 text-white border-red-600';
    } else if (unexcusedDays >= 8 || totalDays >= 25) {
      statusText = 'KRİTİK RİSK (Sınıfta Kalma Tehlikesi)';
      statusColor = 'bg-red-50 text-red-700 border-red-300';
    } else if (isNoCertificate) {
      statusText = 'DİKKAT (Takdir/Teşekkür Belgesi Alamaz)';
      statusColor = 'bg-amber-50 text-amber-800 border-amber-300';
    }

    return {
      totalDays,
      remainingUnexcused,
      remainingTotal,
      isFailed,
      isFailedUnexcused,
      isFailedTotal,
      isNoCertificate,
      statusText,
      statusColor
    };
  }, [unexcusedDays, excusedDays]);

  const recommendedBook = useMemo(() => {
    const bookId = GRADE_BOOK_MAPPING[selectedGrade];
    return BOOKS_DATA.find((b) => b.id === bookId);
  }, [selectedGrade]);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#7c3aed] rounded-xl text-white shadow-2xs">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7c3aed] font-bold">
              MEB ORTAÖĞRETİM YÖNETMELİĞİ UYUMLU
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              Lise Ortalama, Takdir ve Devamsızlık Hesaplayıcı
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold self-start sm:self-auto"
          title="Varsayılan notlara ve devamsızlığa dön"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* 2. Sınıf Seçici: 9, 10, 11, 12 */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            SINIFINIZI SEÇİN:
          </span>
          <span className="text-[10px] font-mono text-[#7c3aed] font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {selectedGrade}. Sınıf Müfredatı
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['9', '10', '11', '12'] as LiseGrade[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradeChange(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedGrade === g
                  ? 'bg-[#7c3aed] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
              }`}
            >
              {g}. Sınıf
            </button>
          ))}
        </div>
      </div>

      {/* 3. 3 SEKME BUTONLARI (Ortalama, Takdir-Teşekkür, Devamsızlık Hakkı) */}
      <div className="mb-6 grid grid-cols-3 gap-2 border-b border-[#1A1A1A]/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('ortalama')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ortalama'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-stone-200/70 border border-[#1A1A1A]/10'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#C9A86A]" />
          <span>1. ORTALAMA HESAPLA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('takdir')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'takdir'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-stone-200/70 border border-[#1A1A1A]/10'
          }`}
        >
          <Award className="w-4 h-4 text-[#7c3aed]" />
          <span>2. TAKDİR - TEŞEKKÜR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('devamsizlik')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'devamsizlik'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-stone-200/70 border border-[#1A1A1A]/10'
          }`}
        >
          <Clock className="w-4 h-4 text-red-500" />
          <span>3. DEVAMSIZLIK HAKKI</span>
        </button>
      </div>

      {/* 4. CANLI ÖZET KARTI (Tüm sekmelerin üzerinde anlık özet) */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2E1065] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A86A] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{selectedGrade}. SINIF LİSE PERFORMANS ÖZETİ</span>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Dönem Ortalaması: <span className="text-[#C9A86A]">{stats.average.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-white/70 font-sans mt-0.5">
            Toplam {stats.totalHours} Saat Haftalık Ders • {stats.failingCount > 0 ? `${stats.failingCount} Zayıf Ders` : 'Zayıf Ders Yok'} • Özürsüz Devamsızlık: {unexcusedDays} Gün
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              stats.certificate === 'Takdir Belgesi'
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                : stats.certificate === 'Teşekkür Belgesi'
                ? 'bg-blue-400/20 text-blue-300 border-blue-400/50'
                : 'bg-stone-700/50 text-stone-300 border-stone-600'
            }`}
          >
            Belge Durumu: {stats.certificate}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono ${
              attendanceStats.isFailed
                ? 'bg-red-500 text-white font-bold'
                : attendanceStats.isNoCertificate
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            Devamsızlık: {attendanceStats.statusText}
          </span>
        </div>
      </div>

      {/* 5. SEKME İÇERİKLERİ */}

      {/* SEKME 1: ORTALAMA HESAPLAMA TABLOSU */}
      {activeTab === 'ortalama' && (
        <div className="space-y-6">
          <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-2xs bg-[#FAF9F6]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-3 sm:px-4">Ders Adı</th>
                    <th className="p-3 sm:px-4 text-center w-24">Haftalık Saat</th>
                    <th className="p-3 sm:px-4 text-center w-36">Dönem Notu (0-100)</th>
                    <th className="p-3 sm:px-4 text-center w-28">Ağırlıklı Puan</th>
                    <th className="p-3 sm:px-4 text-center w-16">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
                  {subjects.map((sub) => {
                    const weighted = (sub.grade * sub.hours).toFixed(1);
                    const isFailing = sub.grade < 50;

                    return (
                      <tr key={sub.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                        <td className="p-3 sm:px-4">
                          <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A]">
                            {sub.name}
                          </span>
                          {isFailing && (
                            <span className="ml-2 text-[9px] font-mono text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              50 ALTI ZAYIF
                            </span>
                          )}
                        </td>

                        <td className="p-3 sm:px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sub.hours}
                            onChange={(e) => updateSubject(sub.id, 'hours', parseInt(e.target.value) || 1)}
                            className="w-14 text-center py-1 border border-[#1A1A1A]/20 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6] focus:ring-1 focus:ring-[#7c3aed]"
                          />
                        </td>

                        <td className="p-3 sm:px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.grade}
                            onChange={(e) => updateSubject(sub.id, 'grade', parseFloat(e.target.value) || 0)}
                            className={`w-20 text-center py-1 border rounded-lg text-xs font-mono font-bold bg-[#FAF9F6] focus:ring-1 focus:ring-[#7c3aed] ${
                              isFailing ? 'border-red-400 text-red-700 bg-red-50/50' : 'border-[#1A1A1A]/20 text-[#1A1A1A]'
                            }`}
                          />
                        </td>

                        <td className="p-3 sm:px-4 text-center font-mono font-bold text-[#7c3aed]">
                          {weighted}
                        </td>

                        <td className="p-3 sm:px-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeSubject(sub.id)}
                            className="text-[#1A1A1A]/40 hover:text-red-600 transition-colors p-1"
                            title="Dersi sil"
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

          {/* Yeni Seçmeli Ders Ekle */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Yeni Seçmeli Ders Adı..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1 bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-hidden focus:ring-1 focus:ring-[#7c3aed]"
            />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#1A1A1A]/60">Saat:</span>
              <input
                type="number"
                min="1"
                max="8"
                value={newSubjectHours}
                onChange={(e) => setNewSubjectHours(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-white border border-[#1A1A1A]/20 rounded-xl py-2 text-xs font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#1A1A1A]/60">Not:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={newSubjectGrade}
                onChange={(e) => setNewSubjectGrade(parseInt(e.target.value) || 0)}
                className="w-16 text-center bg-white border border-[#1A1A1A]/20 rounded-xl py-2 text-xs font-mono font-bold"
              />
            </div>
            <button
              type="button"
              onClick={addSubject}
              className="bg-[#7c3aed] hover:bg-purple-700 text-white text-xs font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ders Ekle</span>
            </button>
          </div>
        </div>
      )}

      {/* SEKME 2: TAKDİR & TEŞEKKÜR ANALİZİ */}
      {activeTab === 'takdir' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Belge Durumu Kartı */}
            <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">
                  MEB E-OKUL BELGE KARARI:
                </span>
              </div>

              <div className="py-2">
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
                  {stats.certificate}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
                  {stats.certificateReason}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 text-xs font-sans space-y-1.5">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-[#1A1A1A]/70">Dönem Not Ortalaması:</span>
                  <strong className="font-mono font-bold text-base text-[#7c3aed]">
                    {stats.average.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-[#1A1A1A]/70">Takdir Belgesi Barajı:</span>
                  <span className="font-mono font-semibold">85,00 ve üzeri</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-[#1A1A1A]/70">Teşekkür Belgesi Barajı:</span>
                  <span className="font-mono font-semibold">70,00 - 84,99</span>
                </div>
              </div>
            </div>

            {/* Yönetmelik Kontrol Kriterleri */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">
                  MEB LİSE YÖNETMELİK KRİTERLERİ:
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                {/* 50 Altı Zayıf Kuralı */}
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  stats.hasFailingGrade
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {stats.hasFailingGrade ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="font-bold block">1. Kriter: 50 Puan Altı Ders Olmamalı</strong>
                    <span className="text-[11px] leading-relaxed block mt-0.5">
                      {stats.hasFailingGrade
                        ? `Dikkat: ${stats.failingSubjects.join(', ')} dersiniz 50 puanın altında olduğu için ortalamanız yeterli olsa dahi belge verilemez.`
                        : 'Harika! 50 puan altında zayıf dersiniz bulunmuyor.'}
                    </span>
                  </div>
                </div>

                {/* Özürsüz 5 Gün Devamsızlık Kuralı */}
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  stats.exceedsAttendanceForCertificate
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {stats.exceedsAttendanceForCertificate ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="font-bold block">2. Kriter: Özürsüz Devamsızlık 5 Günü Aşmamalı</strong>
                    <span className="text-[11px] leading-relaxed block mt-0.5">
                      {stats.exceedsAttendanceForCertificate
                        ? `Özürsüz devamsızlığınız ${unexcusedDays} gün. MEB Madde 160 uyarınca 5 günü aşan öğrenciler belge alamaz!`
                        : `Özürsüz devamsızlığınız ${unexcusedDays} gün. 5 gün sınırını aşmadığınız için belge alabilirsiniz.`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 3: LİSE DEVAMSIZLIK HAKKI HESAPLAMA */}
      {activeTab === 'devamsizlik' && (
        <div className="space-y-6">
          {/* Devamsızlık Girişi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10">
            {/* Özürsüz Devamsızlık */}
            <div className="bg-white p-4 rounded-xl border border-[#1A1A1A]/15 shadow-2xs space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block">
                Özürsüz Devamsızlık Günü (Max 10 Gün):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={unexcusedDays}
                  onChange={(e) => setUnexcusedDays(parseFloat(e.target.value) || 0)}
                  className="w-full text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#7c3aed] focus:outline-hidden"
                />
                <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-2 rounded-xl border border-red-200 shrink-0">
                  Gün
                </span>
              </div>
              <p className="text-[10px] text-[#1A1A1A]/50">
                10 günü geçerse (10.5 gün olursa) sınıfta kalınır!
              </p>
            </div>

            {/* Özürlü Devamsızlık (Raporlu / İzinli) */}
            <div className="bg-white p-4 rounded-xl border border-[#1A1A1A]/15 shadow-2xs space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block">
                Özürlü / Raporlu Devamsızlık (Max 20 Gün):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={excusedDays}
                  onChange={(e) => setExcusedDays(parseFloat(e.target.value) || 0)}
                  className="w-full text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#7c3aed] focus:outline-hidden"
                />
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-2 rounded-xl border border-blue-200 shrink-0">
                  Gün
                </span>
              </div>
              <p className="text-[10px] text-[#1A1A1A]/50">
                Sağlık raporu veya veli izin dilekçesiyle verilen günler.
              </p>
            </div>
          </div>

          {/* Devamsızlık Sonuç Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Toplam Devamsızlık */}
            <div className="p-4 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 font-bold block mb-1">
                TOPLAM DEVAMSIZLIK
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
                {attendanceStats.totalDays} / 30 Gün
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (attendanceStats.totalDays / 30) * 100)}%` }}
                  className={`h-full ${
                    attendanceStats.totalDays > 30 ? 'bg-red-600' : attendanceStats.totalDays >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">
                Kalan Toplam Hak: {attendanceStats.remainingTotal} gün
              </span>
            </div>

            {/* Kalan Özürsüz Hak */}
            <div className="p-4 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 font-bold block mb-1">
                KALAN ÖZÜRSÜZ HAK
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-black text-red-600">
                {attendanceStats.remainingUnexcused} Gün
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (unexcusedDays / 10) * 100)}%` }}
                  className={`h-full ${
                    unexcusedDays > 10 ? 'bg-red-600' : unexcusedDays >= 8 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">
                Kullanılan Özürsüz: {unexcusedDays} gün (Max 10)
              </span>
            </div>

            {/* Belge Hakkı Durumu */}
            <div className="p-4 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 font-bold block mb-1">
                BELGE ALMA DURUMU
              </span>
              <div className={`text-base sm:text-lg font-serif font-bold ${
                attendanceStats.isNoCertificate ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {attendanceStats.isNoCertificate ? 'Belge Alamaz ❌' : 'Belge Alabilir ✅'}
              </div>
              <p className="text-[10px] text-[#1A1A1A]/60 font-sans mt-1 leading-snug">
                {attendanceStats.isNoCertificate
                  ? 'Özürsüz devamsızlık 5 günü aştığı için takdir/teşekkür belgesi verilmez.'
                  : 'Özürsüz devamsızlık 5 gün altında olduğu için belge almaya engel yoktur.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. AŞKAR LİSE KOÇLUK KAYNAĞI ÖNERİSİ */}
      {recommendedBook && (
        <div className="mt-8 p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2E1065] text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={recommendedBook.image}
              alt={recommendedBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{selectedGrade}. SINIF LİSE BAŞARI VE DİSİPLİN REHBERİ:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {recommendedBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                Lise derslerini düzenli takip etmek, yazılılardan yüksek puan almak ve devamsızlık disiplinini kurmak için koçluk sistemini incele.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(recommendedBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={recommendedBook.shopierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>SHOPIER İLE İNDİR</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]" />
            </a>
          </div>
        </div>
      )}

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
