import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Clock, Calendar, Sparkles, BookOpen, ExternalLink, Eye, ArrowRight, Quote, RefreshCw, CheckCircle2, Flame, Award } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

// Robust cross-browser countdown calculation to June 15, 09:30
const calculateRemainingTime = () => {
  const now = new Date();
  const currentMs = now.getTime();

  // Target: 15 Haziran 2026, 09:30 (Month is 0-indexed: 5 = June)
  let target = new Date(2026, 5, 15, 9, 30, 0, 0).getTime();

  // If the environment/system clock has passed June 15, 2026 (e.g. testing in late 2026),
  // dynamically advance to the upcoming June 15 exam so the timer is ALWAYS alive and ticking!
  if (currentMs >= target) {
    let nextYear = now.getFullYear();
    const candidateThisYear = new Date(nextYear, 5, 15, 9, 30, 0, 0).getTime();
    if (currentMs >= candidateThisYear) {
      nextYear += 1;
    }
    target = new Date(nextYear, 5, 15, 9, 30, 0, 0).getTime();
  }

  const diff = Math.max(1000, target - currentMs);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs: diff };
};

const MOTIVATION_QUOTES = [
  { text: "Hedefine giden yol, bugün attığın küçük ama kararlı bir adımla başlar.", author: "Mehmet Ali Aşkar - Eğitim Koçu" },
  { text: "Zorluklar, başarının değerini artıran süslerdir. Pes etmeyen her zaman kazanır.", author: "Aşkar Yayınları" },
  { text: "Bir denemedeki yanlış, gerçek sınavdaki netinin en sadık öğretmenidir.", author: "KAP Koçluk Felsefesi" },
  { text: "Disiplin; ne istediğin ile şu anda ne istediğin arasındaki tercihtir.", author: "LGS'de Kendi Koçun Ol" },
  { text: "Geleceğin, bugün ne yaptığına bağlıdır; yarın ne yapacağına değil.", author: "Mehmet Ali Aşkar" },
  { text: "Her gün çözülen 20 yeni nesil matematik sorusu, Fen Lisesi kapısının anahtarıdır.", author: "LGS Koçluk Kılavuzu" }
];

export const LgsCountdownTimer: React.FC = () => {
  // Initialize state immediately with computed values (prevents 00:00 flash)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>(calculateRemainingTime);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  useEffect(() => {
    // Immediate initial sync
    setTimeLeft(calculateRemainingTime());

    // Live continuous 1-second interval
    const interval = setInterval(() => {
      setTimeLeft(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
  };

  const lgsBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'k8');
  }, []);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white shadow-2xs">
            <Timer className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#856526] font-bold">
              MEB MERKEZİ SINAV • 15 HAZİRAN 2026
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              LGS 2026 Geri Sayım Sayacı
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>CANLI SAYIM AKTİF</span>
          </span>
        </div>
      </div>

      {/* 2. ANA GERİ SAYIM KUTUSU (GÜN, SAAT, DAKİKA, SANİYE) */}
      <div className="mb-8 p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] text-white shadow-lg border border-[#1A1A1A] relative overflow-hidden">
        {/* Dekoratif Arka Plan Işığı */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A86A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A86A] text-[11px] font-mono uppercase tracking-widest font-semibold border border-white/10">
            <Calendar className="w-3.5 h-3.5" />
            <span>Hedef Tarih: 15 Haziran 2026 Pazartesi • Saat 09:30</span>
          </div>

          <h3 className="text-sm sm:text-base font-sans text-white/80 font-medium">
            LGS 2026 1. Oturum Sözel Bölüm Sınavına Kalan Süre:
          </h3>

          {/* Sayısal Sayaç Kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
            {/* GÜN */}
            <div className="bg-white/5 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-white/15 shadow-inner flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-6xl font-serif font-black text-[#C9A86A] tracking-tight tabular-nums">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/70 font-bold mt-2">
                GÜN
              </span>
            </div>

            {/* SAAT */}
            <div className="bg-white/5 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-white/15 shadow-inner flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/70 font-bold mt-2">
                SAAT
              </span>
            </div>

            {/* DAKİKA */}
            <div className="bg-white/5 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-white/15 shadow-inner flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/70 font-bold mt-2">
                DAKİKA
              </span>
            </div>

            {/* SANİYE */}
            <div className="bg-white/5 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-[#C9A86A]/40 shadow-inner flex flex-col items-center justify-center ring-1 ring-[#C9A86A]/30">
              <span className="text-4xl sm:text-6xl font-serif font-black text-[#C9A86A] tracking-tight tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C9A86A] font-bold mt-2 flex items-center gap-1.5">
                <span>SANİYE</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A86A] animate-pulse" />
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs text-white/60 font-sans">
            Zaman hızla akıyor. Her gün çözülen kaliteli sorular sizi hayalinizdeki Fen Lisesine bir adım daha yaklaştırır.
          </div>
        </div>
      </div>

      {/* 3. GÜNÜN MOTİVASYON SÖZÜ */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#C9A86A]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] font-bold">
              GÜNÜN LGS MOTİVASYON SÖZÜ:
            </span>
          </div>

          <button
            onClick={handleNextQuote}
            className="text-[11px] font-mono text-[#856526] hover:text-[#1A1A1A] flex items-center gap-1 bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#C9A86A]/30 cursor-pointer transition-colors font-bold"
            title="Yeni söz getir"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Farklı Söz Gör</span>
          </button>
        </div>

        <blockquote className="text-sm sm:text-base font-serif italic text-[#1A1A1A] leading-relaxed pl-3 border-l-2 border-[#C9A86A]">
          "{MOTIVATION_QUOTES[quoteIndex].text}"
        </blockquote>
        <div className="text-[11px] font-mono text-[#856526] font-semibold text-right">
          — {MOTIVATION_QUOTES[quoteIndex].author}
        </div>
      </div>

      {/* 4. MEB LGS 2026 SINAV OTURUMLARI PLANI */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Oturum Sözel */}
        <div className="p-5 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#856526]" />
              <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                1. OTURUM: SÖZEL BÖLÜM
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-[#FAF6EE] text-[#856526] px-2 py-0.5 rounded border border-[#C9A86A]/30">
              09:30 - 10:45
            </span>
          </div>

          <div className="text-xs text-[#1A1A1A]/75 font-sans space-y-1.5">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span>Sınav Süresi:</span>
              <strong className="font-mono">75 Dakika</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span>Toplam Soru:</span>
              <strong className="font-mono">50 Soru</strong>
            </div>
            <div className="flex justify-between py-1 text-[11px] text-[#1A1A1A]/60">
              <span>Dersler:</span>
              <span>Türkçe (20), İnkılap (10), Din (10), Yabancı Dil (10)</span>
            </div>
          </div>
        </div>

        {/* 2. Oturum Sayısal */}
        <div className="p-5 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0284c7]" />
              <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                2. OTURUM: SAYISAL BÖLÜM
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
              11:30 - 12:50
            </span>
          </div>

          <div className="text-xs text-[#1A1A1A]/75 font-sans space-y-1.5">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span>Sınav Süresi:</span>
              <strong className="font-mono">80 Dakika</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span>Toplam Soru:</span>
              <strong className="font-mono">40 Soru</strong>
            </div>
            <div className="flex justify-between py-1 text-[11px] text-[#1A1A1A]/60">
              <span>Dersler:</span>
              <span>Matematik (20), Fen Bilimleri (20)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AŞKAR KAP LGS KOÇLUK REHBERİ */}
      {lgsBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={lgsBook.image}
              alt={lgsBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>GERİ SAYIM SÜRECİNDE SİZE REHBERLİK EDECEK BAŞARI KİTABI:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {lgsBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                15 Haziran 2026 sınav gününe kadar kalan zamanı verimli planlamak için 12 adımda disiplin ve başarı sistemini uygulayın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(lgsBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={lgsBook.shopierUrl}
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
