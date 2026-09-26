import React, { useState, useEffect, useMemo } from 'react';
import { Target, Sparkles, Plus, Trash2, CheckCircle2, AlertOctagon, BookOpen, ExternalLink, Eye, ArrowRight, RotateCcw, Calendar, TrendingUp } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

interface MistakeItem {
  id: string;
  subject: string;
  topic: string;
  wrongCount: number;
}

interface ExamRecord {
  id: string;
  examName: string;
  grade: '5' | '6' | '7' | '8';
  date: string;
  mistakes: MistakeItem[];
}

const COMMON_TOPIC_SUGGESTIONS: Record<string, string[]> = {
  'Türkçe': ['Paragrafta Anlam & Ana Fikir', 'Cümlede Anlam', 'Fiilimsiler (Eylemsiler)', 'Yazım Kuralları ve Noktalama', 'Sözel Mantık ve Muhakeme'],
  'Matematik': ['Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Doğrusal Denklemler', 'Yeni Nesil Beceri Temelli Sorular', 'Veri Analizi & Olasılık'],
  'Fen Bilimleri': ['Mevsimler ve İklim', 'DNA ve Genetik Kod', 'Basınç (Katı, Sıvı, Gaz)', 'Madde ve Endüstri', 'Basit Makineler'],
  'Sosyal / İnkılap': ['Bir Kahraman Doğuyor', 'Milli Uyanış: Bağımsızlık Yolunda', 'Ya İstiklal Ya Ölüm', 'Atatürk İlkeleri'],
  'Din Kültürü': ['Kader İnancı', 'Zekat ve Sadaka', 'Din ve Hayat'],
  'İngilizce': ['Friendship', 'Teen Life', 'In the Kitchen', 'On the Phone']
};

const INITIAL_DEMO_EXAMS: ExamRecord[] = [
  {
    id: 'demo-1',
    examName: 'MEB 1. Dönem İzleme Denemesi',
    grade: '8',
    date: '2026-09-15',
    mistakes: [
      { id: 'm1', subject: 'Matematik', topic: 'Yeni Nesil Beceri Temelli Sorular', wrongCount: 3 },
      { id: 'm2', subject: 'Türkçe', topic: 'Paragrafta Anlam & Ana Fikir', wrongCount: 2 },
      { id: 'm3', subject: 'Fen Bilimleri', topic: 'Basınç (Katı, Sıvı, Gaz)', wrongCount: 2 },
    ]
  },
  {
    id: 'demo-2',
    examName: 'Kurumsal Başarı Denemesi 2',
    grade: '8',
    date: '2026-09-22',
    mistakes: [
      { id: 'm4', subject: 'Matematik', topic: 'Yeni Nesil Beceri Temelli Sorular', wrongCount: 2 },
      { id: 'm5', subject: 'Matematik', topic: 'Kareköklü İfadeler', wrongCount: 2 },
      { id: 'm6', subject: 'Türkçe', topic: 'Paragrafta Anlam & Ana Fikir', wrongCount: 2 },
      { id: 'm7', subject: 'Fen Bilimleri', topic: 'DNA ve Genetik Kod', wrongCount: 1 },
    ]
  }
];

const GRADE_BOOK_MAPPING: Record<'5' | '6' | '7' | '8', string> = {
  '5': 'k5',
  '6': 'k6',
  '7': 'k7',
  '8': 'k8',
};

interface KapAnalysisPanelProps {
  onGradeChange?: (grade: string, bookId: string) => void;
}

export const KapAnalysisPanel: React.FC<KapAnalysisPanelProps> = ({ onGradeChange }) => {
  const [selectedGrade, setSelectedGrade] = useState<'5' | '6' | '7' | '8'>('8');
  const [examName, setExamName] = useState('');
  const [currentSubject, setCurrentSubject] = useState('Türkçe');
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentWrongCount, setCurrentWrongCount] = useState<number>(1);
  const [currentMistakesList, setCurrentMistakesList] = useState<MistakeItem[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // Load saved exams from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('askar_kap_exam_analyses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExams(parsed);
          return;
        }
      }
      setExams(INITIAL_DEMO_EXAMS);
      localStorage.setItem('askar_kap_exam_analyses', JSON.stringify(INITIAL_DEMO_EXAMS));
    } catch {
      setExams(INITIAL_DEMO_EXAMS);
    }
  }, []);

  // Save to localStorage when exams change
  const saveExamsToStorage = (updated: ExamRecord[]) => {
    setExams(updated);
    try {
      localStorage.setItem('askar_kap_exam_analyses', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  // Sync active grade with parent
  useEffect(() => {
    if (onGradeChange) {
      onGradeChange(selectedGrade, GRADE_BOOK_MAPPING[selectedGrade]);
    }
  }, [onGradeChange, selectedGrade]);

  const handleSelectGrade = (grade: '5' | '6' | '7' | '8') => {
    setSelectedGrade(grade);
    if (onGradeChange) {
      onGradeChange(grade, GRADE_BOOK_MAPPING[grade]);
    }
  };

  // Add mistake to the pending list for current exam
  const handleAddMistake = (topicToAdd?: string) => {
    const finalTopic = (topicToAdd || currentTopic).trim();
    if (!finalTopic) return;

    const newItem: MistakeItem = {
      id: `mistake-${Date.now()}-${Math.random()}`,
      subject: currentSubject,
      topic: finalTopic,
      wrongCount: currentWrongCount || 1,
    };

    setCurrentMistakesList((prev) => [...prev, newItem]);
    setCurrentTopic('');
    setCurrentWrongCount(1);
  };

  const handleRemovePendingMistake = (id: string) => {
    setCurrentMistakesList((prev) => prev.filter((m) => m.id !== id));
  };

  // Save full exam record
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanExamName = examName.trim() || `${selectedGrade}. Sınıf Denemesi ${exams.length + 1}`;
    if (currentMistakesList.length === 0) return;

    const newRecord: ExamRecord = {
      id: `exam-${Date.now()}`,
      examName: cleanExamName,
      grade: selectedGrade,
      date: new Date().toISOString().split('T')[0],
      mistakes: currentMistakesList,
    };

    const updated = [newRecord, ...exams];
    saveExamsToStorage(updated);
    setExamName('');
    setCurrentMistakesList([]);
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter((ex) => ex.id !== id);
    saveExamsToStorage(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Tüm kayıtlı deneme analizlerini silmek istediğinize emin misiniz?')) {
      saveExamsToStorage([]);
    }
  };

  // Aggregation Engine: Calculate Top 3 Weakest Topics
  const analysisResult = useMemo(() => {
    // Filter exams for selected grade (or all if user wants general look)
    const relevantExams = exams.filter((ex) => ex.grade === selectedGrade);
    const targetExams = relevantExams.length > 0 ? relevantExams : exams;

    const topicMap: Record<string, { topic: string; subject: string; totalWrong: number; examCount: number }> = {};
    let totalMistakesCount = 0;

    targetExams.forEach((ex) => {
      ex.mistakes.forEach((m) => {
        const key = `${m.subject}:::${m.topic.toLowerCase().trim()}`;
        totalMistakesCount += m.wrongCount;
        if (!topicMap[key]) {
          topicMap[key] = {
            topic: m.topic,
            subject: m.subject,
            totalWrong: 0,
            examCount: 0,
          };
        }
        topicMap[key].totalWrong += m.wrongCount;
        topicMap[key].examCount += 1;
      });
    });

    const sortedTopics = Object.values(topicMap).sort((a, b) => b.totalWrong - a.totalWrong);
    const top3 = sortedTopics.slice(0, 3);

    return {
      top3,
      totalExams: targetExams.length,
      totalMistakesCount,
      allTopicsCount: sortedTopics.length,
    };
  }, [exams, selectedGrade]);

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
            <Target className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#856526] font-bold">
              KAP SİSTEMİ • AKILLI KAZANIM ANALİZİ
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              KAP Dijital Kazanım Analiz Paneli
            </h2>
          </div>
        </div>

        {exams.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors border border-red-200 cursor-pointer font-bold self-start sm:self-auto"
            title="Tüm denemeleri temizle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Geçmişi Sıfırla</span>
          </button>
        )}
      </div>

      {/* 2. Sınıf Seçimi: 5, 6, 7 ve 8. Sınıf LGS */}
      <div className="mb-6 p-4 rounded-xl bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            1. ADIM: HANGİ SINIF DÜZEYİ İÇİN ANALİZ YAPIYORSUNUZ?
          </span>

          <div className="flex items-center gap-2">
            {(['5', '6', '7', '8'] as const).map((grade) => (
              <button
                key={grade}
                id={`btn-kap-grade-${grade}`}
                onClick={() => handleSelectGrade(grade)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-[#1A1A1A] text-white ring-2 ring-[#C9A86A]/70 shadow-2xs scale-[1.02]'
                    : 'bg-white text-[#1A1A1A]/70 hover:bg-[#FAF6EE] border border-[#1A1A1A]/15'
                }`}
              >
                [{grade}. SINIF{grade === '8' ? ' LGS' : ''}]
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Deneme Adı ve Yanlış Konuları Ekleme Formu */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1A1A1A]/10">
          <Sparkles className="w-4 h-4 text-[#C9A86A]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            2. ADIM: YENİ DENEME VE YANLIŞ YAPILAN KONULARI GİRİN:
          </span>
        </div>

        {/* Deneme Adı */}
        <div>
          <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1">
            Deneme Sınavının Adı:
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="Örn: Özdebir 1. LGS Denemesi, Okul Kazanım İzleme 2"
            className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:ring-2 focus:ring-[#C9A86A] focus:outline-hidden"
          />
        </div>

        {/* Yanlış Konu Girişi */}
        <div className="p-4 bg-white rounded-xl border border-[#1A1A1A]/10 space-y-4">
          <div className="text-xs font-serif font-bold text-[#1A1A1A]">
            Yanlış Yapılan Kazanımı / Konuyu Seçin veya Yazın:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ders Seçici */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
                Ders:
              </label>
              <select
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
              >
                {Object.keys(COMMON_TOPIC_SUGGESTIONS).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Konu Adı */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
                Yanlış Çıkan Konu:
              </label>
              <input
                type="text"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                placeholder="Örn: Paragrafta Ana Fikir veya Çarpanlar"
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
              />
            </div>

            {/* Yanlış Sayısı ve Ekle Butonu */}
            <div className="flex items-end gap-2">
              <div className="w-24">
                <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
                  Yanlış Sayısı:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={currentWrongCount}
                  onChange={(e) => setCurrentWrongCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-2 py-2 text-xs font-mono font-bold text-[#1A1A1A]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddMistake()}
                disabled={!currentTopic.trim()}
                className="flex-1 bg-[#1A1A1A] hover:bg-black disabled:bg-[#1A1A1A]/30 text-white py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Listeye Ekle</span>
              </button>
            </div>
          </div>

          {/* Sık Karşılaşılan Konu Önerileri (Hızlı Tıkla-Ekle) */}
          {COMMON_TOPIC_SUGGESTIONS[currentSubject] && (
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 block mb-1.5 font-semibold">
                {currentSubject} Hızlı Konu Önerileri (Tıkla ve Ekle):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TOPIC_SUGGESTIONS[currentSubject].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleAddMistake(topic)}
                    className="text-[11px] font-sans font-medium bg-[#FAF6EE] hover:bg-[#C9A86A]/20 text-[#856526] border border-[#C9A86A]/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bu Deneme İçin Eklenen Yanlışlar Listesi */}
        {currentMistakesList.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-[#1A1A1A]/10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block">
              Bu Denemeye Eklenen Yanlış Konular ({currentMistakesList.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentMistakesList.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#1A1A1A]/10 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] font-bold text-white bg-[#1A1A1A] px-2 py-0.5 rounded">
                      {m.subject}
                    </span>
                    <span className="font-medium text-[#1A1A1A] truncate">{m.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {m.wrongCount} Yanlış
                    </span>
                    <button
                      onClick={() => handleRemovePendingMistake(m.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveExam}
                className="bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                <span>Denemeyi Kaydet & Analizi Güncelle</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. EN ÇOK EKSİK ÇIKAN İLK 3 KAZANIM (KAP BİLGİSAYAR ANALİZİ) */}
      <div className="p-6 bg-[#1A1A1A] text-white rounded-2xl shadow-md border border-[#1A1A1A] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#C9A86A]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A86A] font-bold">
                KAP KAZANIM ANALİZ RAPORU ({selectedGrade}. SINIF)
              </span>
            </div>
            <div className="text-xs text-[#F8F7F4]/80 font-sans">
              Kayıtlı {analysisResult.totalExams} deneme sınavı üzerinden biriken {analysisResult.totalMistakesCount} yanlış soru analiz edildi.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-white/15">
              {analysisResult.top3.length > 0 ? 'En Kritik 3 Kazanım Belirlendi' : 'Deneme Ekleyiniz'}
            </span>
          </div>
        </div>

        {/* En Eksik 3 Konu Listesi */}
        {analysisResult.top3.length > 0 ? (
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
              🔥 EN ÇOK EKSİK ÇIKAN İLK 3 KAZANIM / KONU:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.top3.map((item, idx) => {
                const priorityBadge =
                  idx === 0
                    ? { label: '1. EN ACİL EKSİK', color: 'bg-red-500/20 text-red-300 border-red-500/40' }
                    : idx === 1
                    ? { label: '2. KRİTİK ALAN', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
                    : { label: '3. GELİŞTİRİLMELİ', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-[#C9A86A]/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-bold ${priorityBadge.color}`}>
                          {priorityBadge.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded">
                          {item.totalWrong} Yanlış
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-[#C9A86A] font-semibold mb-1">
                        {item.subject}
                      </div>
                      <h4 className="text-base font-serif font-bold text-white leading-snug">
                        {item.topic}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[11px] text-[#F8F7F4]/70 font-sans leading-relaxed">
                      💡 <strong>KAP Koçluk Reçetesi:</strong> Bu konudan 3 gün boyunca her gün 15 yeni nesil soru çözün ve yanlış defteri analizini uygulayın.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10 text-xs text-white/60">
            Henüz analiz için yanlış konu eklenmedi. Yukarıdaki formdan deneme sınavınızı ve yanlış yaptığınız konuları giriniz.
          </div>
        )}

        {/* 5. ZORUNLU BÖLÜM: Sonuçta AŞKAR KAP Kitaplarına Link */}
        {activeRecommendedBook && (
          <div className="mt-6 pt-5 border-t border-white/15 bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>BU EKSİKLERİ KAPATACAK AŞKAR KAP KOÇLUK KAYNAĞI:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {activeRecommendedBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans">
                {selectedGrade}. sınıf deneme analiz ve disiplin planı ile bu 3 eksik kazanımı 10 günde telafi edin.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewBook(activeRecommendedBook)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>ÖNİZLE</span>
              </button>

              <a
                href={activeRecommendedBook.shopierUrl}
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
      </div>

      {/* 6. Kayıtlı Denemeler Geçmişi (localStorage İnceleme) */}
      {exams.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Kayıtlı Denemeler ({exams.length} Deneme Saklanıyor):</span>
            </span>
            <span className="text-[11px] font-mono text-[#856526] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
              Cihazınızda Otomatik Kayıtlıdır (localStorage)
            </span>
          </div>

          <div className="space-y-2.5">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-white bg-[#1A1A1A] px-2 py-0.5 rounded text-[10px]">
                      {ex.grade}. SINIF
                    </span>
                    <span className="font-bold text-[#1A1A1A]">{ex.examName}</span>
                    <span className="text-[#1A1A1A]/40 font-mono text-[10px]">({ex.date})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-[#1A1A1A]/70">
                    {ex.mistakes.map((m, mIdx) => (
                      <span key={mIdx} className="bg-white px-2 py-0.5 rounded border border-[#1A1A1A]/10">
                        {m.subject}: <strong>{m.topic}</strong> ({m.wrongCount}Y)
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteExam(ex.id)}
                  className="text-stone-400 hover:text-red-600 p-1 self-end sm:self-auto cursor-pointer"
                  title="Bu denemeyi sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
