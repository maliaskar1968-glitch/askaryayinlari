import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle, Edit3, RotateCcw, Sparkles, BookOpen, ExternalLink, Eye, Award, Check, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

type GradeKey = '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'mezun';

interface GradeConfig {
  key: GradeKey;
  label: string;
  defaultTasks: [string, string, string];
  bookId: string;
  badge: string;
  advice: string;
}

const GRADE_CONFIGS: Record<GradeKey, GradeConfig> = {
  '5': {
    key: '5',
    label: '5. Sınıf (Ortaokul Başlangıç)',
    defaultTasks: [
      '20 Paragraf Sorusu Çöz (Anlam Bilgisi)',
      '10 Beceri Temelli Matematik Problemi',
      '1 Konu Tekrarı (Günün Ders Notu Çıkarma)'
    ],
    bookId: 'k5',
    badge: '5. SINIF KOÇLUK',
    advice: 'Ortaokulda başarının sırrı ders çalışmak değil, sistemsizliği yenmektir. Günde 3 görevle temelini kur.'
  },
  '6': {
    key: '6',
    label: '6. Sınıf (Ortaokul Disiplin)',
    defaultTasks: [
      '25 Paragraf Sorusu Çöz & Süre Tut',
      '15 Matematik Yeni Nesil Soru Çözümü',
      'Fen veya Sosyal Kavram Haritası Çıkar'
    ],
    bookId: 'k6',
    badge: '6. SINIF DİSİPLİN',
    advice: '6. sınıfta kazanılan çalışma disiplini, 8. sınıfta LGS şampiyonluğunu getirir.'
  },
  '7': {
    key: '7',
    label: '7. Sınıf (LGS Ön Hazırlık)',
    defaultTasks: [
      '30 Paragraf Sorusu & Sözcükte Anlam',
      '20 LGS Tipi Sayısal Soru (Matematik/Fen)',
      '1 Sözel Ders Konu Check-Up ve Özet'
    ],
    bookId: 'k7',
    badge: '7. SINIF LGS HAZIRLIK',
    advice: 'LGS hazırlığı 8. sınıfta değil, 7. sınıfta sağlam adımlarla başlar.'
  },
  '8': {
    key: '8',
    label: '8. Sınıf (LGS 2026)',
    defaultTasks: [
      '30 Yeni Nesil LGS Paragraf Sorusu',
      '20 Yeni Nesil Matematik / Fen Analizi',
      '1 Deneme Analizi veya Sıfır Hata Defteri İncelemesi'
    ],
    bookId: 'k8',
    badge: '8. SINIF LGS KOÇLUK',
    advice: 'Her gün sadece bu 3 görevi tamamla, haftada 21 kritik LGS kazanımını eksiksiz kapat.'
  },
  '9': {
    key: '9',
    label: '9. Sınıf (Liseye Uyum)',
    defaultTasks: [
      '30 Sayfa Kitap Okuma veya Paragraf Çözümü',
      '25 Temel Matematik Soru Çözümü',
      '1 Sayısal Ders Notu (Fizik/Kimya/Biyoloji)'
    ],
    bookId: 'k9',
    badge: '9. SINIF LİSE UYUM',
    advice: 'Lisenin ilk yılında not ortalamanı ve ders çalışma ritmini yüksek tut.'
  },
  '10': {
    key: '10',
    label: '10. Sınıf (Temel & Alan Seçimi)',
    defaultTasks: [
      '30 Paragraf & Problem Çözümü',
      '25 Matematik / Fen Soru Çözümü',
      'Haftalık Ders Tekrarı & Formül Çıkarma'
    ],
    bookId: 'k10',
    badge: '10. SINIF TEMEL ATMA',
    advice: 'Alan seçiminde ve YKS temelinde 10. sınıf konuları belirleyicidir.'
  },
  '11': {
    key: '11',
    label: '11. Sınıf (YKS Ön Hazırlık)',
    defaultTasks: [
      '35 TYT Paragraf & Geometri Sorusu',
      '30 11. Sınıf Alan Sorusu (AYT Temeli)',
      '1 Branş Eksik Konu Tamamlama'
    ],
    bookId: 'k11',
    badge: '11. SINIF YKS TEMELİ',
    advice: '11. sınıfı sağlam bitiren öğrenci, 12. sınıfa 1-0 önde başlar.'
  },
  '12': {
    key: '12',
    label: '12. Sınıf (YKS 2025/2026)',
    defaultTasks: [
      '40 TYT Soru Çözümü (Türkçe Paragraf + Problem)',
      '30 AYT Branş Sorusu Çözümü',
      '1 Branş Denemesi & Hata Analizi'
    ],
    bookId: 'k_yks',
    badge: '12. SINIF YKS KOÇLUK',
    advice: 'YKS maratonunda az ve öz odaklanmak, devasa ve yarım kalan listelerden bin kat etkilidir.'
  },
  'mezun': {
    key: 'mezun',
    label: 'Mezun (YKS Derece Hazırlık)',
    defaultTasks: [
      '40 TYT Karma Soru + 10 Geometri Rutini',
      '40 AYT İleri Düzey Soru Çözümü',
      '1 Tam Deneme Analizi & Sıfır Hata Defteri'
    ],
    bookId: 'k_yks',
    badge: 'MEZUN YKS KOÇLUK',
    advice: 'Mezun senesinde başarının anahtarı günlük disiplin ve deneme ameliyatıdır.'
  }
};

const getTodayDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const AltinIsTracker: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeKey>(() => {
    try {
      return (localStorage.getItem('askar_3altin_active_grade') as GradeKey) || '8';
    } catch {
      return '8';
    }
  });

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Tasks for the selected grade: [task1, task2, task3]
  const [tasks, setTasks] = useState<[string, string, string]>(() => {
    try {
      const saved = localStorage.getItem(`askar_3altin_tasks_${selectedGrade}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) return parsed as [string, string, string];
      }
    } catch {
      // fallback
    }
    return GRADE_CONFIGS[selectedGrade].defaultTasks;
  });

  // Completed status for today: [bool, bool, bool]
  const [completed, setCompleted] = useState<[boolean, boolean, boolean]>(() => {
    try {
      const saved = localStorage.getItem(`askar_3altin_completed_${selectedGrade}_${todayStr}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) return parsed as [boolean, boolean, boolean];
      }
    } catch {
      // fallback
    }
    return [false, false, false];
  });

  // History for last 7 days: { [dateStr]: number (count 0-3) }
  const [history, setHistory] = useState<Record<string, number>>({});

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // When grade changes, load tasks and completed state
  useEffect(() => {
    try {
      localStorage.setItem('askar_3altin_active_grade', selectedGrade);
      const savedTasks = localStorage.getItem(`askar_3altin_tasks_${selectedGrade}`);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length === 3) {
          setTasks(parsed as [string, string, string]);
        } else {
          setTasks(GRADE_CONFIGS[selectedGrade].defaultTasks);
        }
      } else {
        setTasks(GRADE_CONFIGS[selectedGrade].defaultTasks);
      }

      const savedCompleted = localStorage.getItem(`askar_3altin_completed_${selectedGrade}_${todayStr}`);
      if (savedCompleted) {
        setCompleted(JSON.parse(savedCompleted));
      } else {
        setCompleted([false, false, false]);
      }
    } catch {
      setTasks(GRADE_CONFIGS[selectedGrade].defaultTasks);
      setCompleted([false, false, false]);
    }
  }, [selectedGrade, todayStr]);

  // Load history for last 7 days for the selected grade
  useEffect(() => {
    const hist: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      try {
        const data = localStorage.getItem(`askar_3altin_completed_${selectedGrade}_${dStr}`);
        if (data) {
          const arr = JSON.parse(data);
          hist[dStr] = Array.isArray(arr) ? arr.filter(Boolean).length : 0;
        } else {
          hist[dStr] = 0;
        }
      } catch {
        hist[dStr] = 0;
      }
    }
    setHistory(hist);
  }, [selectedGrade, completed, todayStr]);

  const toggleTask = (index: number) => {
    const updated: [boolean, boolean, boolean] = [completed[0], completed[1], completed[2]];
    updated[index] = !updated[index];
    setCompleted(updated);
    try {
      localStorage.setItem(`askar_3altin_completed_${selectedGrade}_${todayStr}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(tasks[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editText.trim()) {
      const updated: [string, string, string] = [tasks[0], tasks[1], tasks[2]];
      updated[index] = editText.trim();
      setTasks(updated);
      try {
        localStorage.setItem(`askar_3altin_tasks_${selectedGrade}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
    setEditingIndex(null);
  };

  const handleResetToDefaults = () => {
    const defaults = GRADE_CONFIGS[selectedGrade].defaultTasks;
    setTasks(defaults);
    try {
      localStorage.setItem(`askar_3altin_tasks_${selectedGrade}`, JSON.stringify(defaults));
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = completed.filter(Boolean).length;
  const currentConfig = GRADE_CONFIGS[selectedGrade];

  const matchedBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === currentConfig.bookId);
  }, [currentConfig.bookId]);

  // Last 7 days info for the weekly chart
  const last7Days = useMemo(() => {
    const days = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const name = dayNames[d.getDay()];
      const isToday = i === 0;
      const count = isToday ? completedCount : (history[dStr] || 0);
      days.push({ dateStr: dStr, name, count, isToday });
    }
    return days;
  }, [history, completedCount]);

  return (
    <div className="bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-3xl p-5 sm:p-8 shadow-sm">
      {/* 1. Üst Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2563eb] font-bold">
            DİSİPLİN & ALIŞKANLIK SİSTEMİ • AŞKAR YAYINLARI
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#2563eb] tracking-tight">
            GÜNDE SADECE 3 ALTIN İŞ
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-0.5">
            Her gün devasa listeler yapıp yarım bırakmak yerine, sadece 3 kritik işi bitirerek istikrar kazan.
          </p>
        </div>

        {/* Sınıf Seç Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 shrink-0">
            Sınıf Seç:
          </label>
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as GradeKey)}
              className="bg-white border-2 border-[#2563eb]/40 hover:border-[#2563eb] text-[#1A1A1A] text-xs font-sans font-bold py-2 pl-3 pr-8 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#2563eb] cursor-pointer appearance-none"
            >
              {Object.values(GRADE_CONFIGS).map((cfg) => (
                <option key={cfg.key} value={cfg.key}>
                  {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#2563eb] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Sınıfa Özel Koçluk Tavsiyesi Barı */}
      <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-[#2563eb]">
            {currentConfig.badge} TAVSİYESİ:
          </span>
          <p className="text-[#1A1A1A]/80 font-sans leading-relaxed">
            {currentConfig.advice}
          </p>
        </div>
      </div>

      {/* 3. DEFTER TASARIMI (Çizgili Not Defteri Görünümü) */}
      <div className="mb-8 relative rounded-3xl overflow-hidden border-2 border-[#D8C7A5] bg-[#FFFDF9] shadow-md">
        {/* Defter Spiral & Çizgi Efekti */}
        <div className="bg-[#FAF3E0] px-5 py-3 border-b border-[#D8C7A5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 border border-red-500 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500 inline-block shadow-2xs" />
            <span className="ml-2 text-xs font-mono font-bold uppercase tracking-wider text-[#856526]">
              {currentConfig.label} • GÜNLÜK ALTIN LİSTE
            </span>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="text-[10px] font-mono text-[#856526] hover:text-[#1A1A1A] flex items-center gap-1 font-bold cursor-pointer"
            title="Önerilen 3 göreve sıfırla"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Önerilenleri Yükle</span>
          </button>
        </div>

        {/* Çizgili Kağıt Alanı */}
        <div className="p-5 sm:p-8 space-y-4 divide-y divide-[#EBDDBE]/60">
          {tasks.map((taskText, index) => {
            const isDone = completed[index];
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className={`pt-4 first:pt-0 flex items-start gap-3 sm:gap-4 transition-all ${
                  isDone ? 'opacity-90' : ''
                }`}
              >
                {/* Altın Numara & Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(index)}
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all cursor-pointer shadow-2xs ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-[#FAF3E0] border-2 border-[#D8C7A5] text-[#856526] hover:border-[#2563eb] hover:text-[#2563eb]'
                  }`}
                  title={isDone ? 'Görevi tamamlandı olarak işaretle' : 'Görevi tamamla'}
                >
                  {isDone ? <Check className="w-5 h-5 text-white" /> : index + 1}
                </button>

                {/* Görev Metni veya Düzenleme Alanı */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(index);
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        autoFocus
                        className="w-full bg-white border border-[#2563eb] rounded-xl px-3 py-1.5 text-xs font-serif text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]"
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="bg-[#2563eb] text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 cursor-pointer"
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <span
                        onClick={() => toggleTask(index)}
                        className={`text-sm sm:text-base font-serif cursor-pointer select-none leading-relaxed transition-all ${
                          isDone
                            ? 'line-through text-[#1A1A1A]/40'
                            : 'text-[#1A1A1A] font-medium'
                        }`}
                      >
                        {taskText}
                      </span>

                      <button
                        onClick={() => handleStartEdit(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#856526] hover:text-[#2563eb] rounded cursor-pointer"
                        title="Görevi düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-[#856526]/70 mt-0.5 block">
                    Altın İş #{index + 1} • {isDone ? 'Tamamlandı ✨' : 'Bekliyor'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Defter Alt Barı / Günlük Durum */}
        <div className="bg-[#FAF3E0] px-5 py-3 border-t border-[#D8C7A5] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A]">
            <span>Günün Durumu:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                completedCount === 3
                  ? 'bg-emerald-500 text-white'
                  : completedCount > 0
                  ? 'bg-amber-400 text-[#1A1A1A]'
                  : 'bg-stone-200 text-[#1A1A1A]'
              }`}
            >
              {completedCount} / 3 TAMAMLANDI
            </span>
            {completedCount === 3 && (
              <span className="text-xs font-sans text-emerald-700 font-bold hidden sm:inline">
                Tebrikler, bugünün altın görevlerini bitirdin! 🎉
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-[#856526]">
            Otomatik kaydedildi (localStorage)
          </span>
        </div>
      </div>

      {/* 4. HAFTALIK GRAFİK (Sınıfa Göre Son 7 Gün Takibi) */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2563eb]" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">
              HAFTALIK İSTİKRAR GRAFİĞİ ({currentConfig.label}):
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#1A1A1A]/60">
            Son 7 Günlük Görev Performansı
          </span>
        </div>

        {/* Bar Grafiği */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-2">
          {last7Days.map((d, idx) => {
            const heightPercent = d.count === 3 ? 100 : d.count === 2 ? 66 : d.count === 1 ? 33 : 8;
            const barBg = d.count === 3
              ? 'bg-emerald-500'
              : d.count === 2
              ? 'bg-blue-500'
              : d.count === 1
              ? 'bg-amber-400'
              : 'bg-stone-200';

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-mono font-bold text-[#1A1A1A]/70">
                  {d.count}/3
                </div>
                {/* Bar Kutusu */}
                <div className="w-full h-24 sm:h-28 bg-[#FAF9F6] rounded-xl border border-[#1A1A1A]/10 p-1 flex flex-col justify-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-500 ${barBg} ${
                      d.isToday ? 'ring-2 ring-[#2563eb]' : ''
                    }`}
                  />
                </div>
                {/* Gün İsmi */}
                <div className="text-center">
                  <span
                    className={`text-[10px] sm:text-xs font-mono block ${
                      d.isToday ? 'font-bold text-[#2563eb]' : 'text-[#1A1A1A]/60'
                    }`}
                  >
                    {d.name}
                  </span>
                  {d.isToday && (
                    <span className="text-[9px] font-mono font-bold text-[#2563eb] block">
                      Bugün
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SONUÇ BARI: "Sınıfına Uygun AŞKAR Kaynağını Gör" ve Kitaba Doğrudan Link */}
      {matchedBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2563eb]/20 text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={matchedBook.image}
              alt={matchedBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{currentConfig.badge} İÇİN ÖNERİLEN REHBER KİTAP:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {matchedBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                Günde 3 Altın İş disiplinini hayatına geçirmek ve seviyene özel başarı haritasını uygulamak için hemen incele.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(matchedBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={matchedBook.shopierUrl}
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
