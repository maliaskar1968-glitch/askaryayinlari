import React, { useState, useMemo } from 'react';
import { Compass, Search, Filter, Sparkles, Building2, MapPin, CheckCircle2, AlertTriangle, ArrowUpDown, ExternalLink, Eye, RotateCcw, BookOpen, School } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

interface HighSchool {
  id: string;
  name: string;
  city: string;
  district: string;
  type: 'Fen Lisesi' | 'Anadolu Lisesi' | 'Sosyal Bilimler' | 'Proje İHL' | 'Mesleki Teknik';
  lang: string;
  baseScore2024: number;
  percentile2024: number; // e.g. 0.04%
  quota: number;
  pansiyon: 'Kız/Erkek' | 'Yok' | 'Kız' | 'Erkek';
}

const HIGH_SCHOOLS_DATABASE: HighSchool[] = [
  // İstanbul
  { id: 'ist-1', name: 'Galatasaray Lisesi', city: 'İstanbul', district: 'Beyoğlu', type: 'Anadolu Lisesi', lang: 'Fransızca', baseScore2024: 500.00, percentile2024: 0.04, quota: 100, pansiyon: 'Kız/Erkek' },
  { id: 'ist-2', name: 'İstanbul Erkek Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 497.45, percentile2024: 0.06, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-3', name: 'Kabataş Erkek Lisesi (İngilizce)', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 495.80, percentile2024: 0.09, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ist-4', name: 'Kabataş Erkek Lisesi (Almanca)', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 494.90, percentile2024: 0.12, quota: 60, pansiyon: 'Kız/Erkek' },
  { id: 'ist-5', name: 'İstanbul Atatürk Fen Lisesi', city: 'İstanbul', district: 'Kadıköy', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 492.50, percentile2024: 0.22, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-6', name: 'Cağaloğlu Anadolu Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 489.15, percentile2024: 0.45, quota: 180, pansiyon: 'Kız' },
  { id: 'ist-7', name: 'Hüseyin Avni Sözen Anadolu Lisesi', city: 'İstanbul', district: 'Üsküdar', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 483.40, percentile2024: 0.95, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-8', name: 'Kadıköy Anadolu Lisesi', city: 'İstanbul', district: 'Kadıköy', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 482.10, percentile2024: 1.10, quota: 210, pansiyon: 'Kız/Erkek' },
  { id: 'ist-9', name: 'Kartal Anadolu İmam Hatip Lisesi', city: 'İstanbul', district: 'Kartal', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 479.50, percentile2024: 1.45, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-10', name: 'Beşiktaş Sakıp Sabancı Anadolu Lisesi', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 477.80, percentile2024: 1.65, quota: 150, pansiyon: 'Yok' },
  { id: 'ist-11', name: 'Bakırköy Anadolu Lisesi', city: 'İstanbul', district: 'Bakırköy', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 467.30, percentile2024: 2.85, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-12', name: 'Prof. Dr. Mümtaz Turhan Sosyal Bilimler', city: 'İstanbul', district: 'Bahçelievler', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 454.20, percentile2024: 4.80, quota: 150, pansiyon: 'Kız/Erkek' },

  // Ankara
  { id: 'ank-1', name: 'Ankara Fen Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 494.60, percentile2024: 0.14, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ank-2', name: 'Prof. Dr. Aziz Sancar Fen Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 488.20, percentile2024: 0.52, quota: 90, pansiyon: 'Kız/Erkek' },
  { id: 'ank-3', name: 'Ankara Atatürk Anadolu Lisesi', city: 'Ankara', district: 'Sıhhiye', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 478.40, percentile2024: 1.55, quota: 300, pansiyon: 'Yok' },
  { id: 'ank-4', name: 'Gazi Anadolu Lisesi', city: 'Ankara', district: 'Yenimahalle', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 472.90, percentile2024: 2.25, quota: 240, pansiyon: 'Yok' },
  { id: 'ank-5', name: 'Mehmet Emin Resulzade Anadolu Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 466.50, percentile2024: 3.10, quota: 180, pansiyon: 'Yok' },
  { id: 'ank-6', name: 'Ankara Sosyal Bilimler Lisesi', city: 'Ankara', district: 'Yenimahalle', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 452.10, percentile2024: 5.15, quota: 120, pansiyon: 'Kız/Erkek' },

  // İzmir
  { id: 'izm-1', name: 'İzmir Fen Lisesi', city: 'İzmir', district: 'Bornova', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 493.70, percentile2024: 0.18, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'izm-2', name: 'Bornova Anadolu Lisesi (İngilizce)', city: 'İzmir', district: 'Bornova', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 480.20, percentile2024: 1.35, quota: 210, pansiyon: 'Kız/Erkek' },
  { id: 'izm-3', name: 'İzmir Atatürk Lisesi (İngilizce)', city: 'İzmir', district: 'Konak', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 478.60, percentile2024: 1.50, quota: 240, pansiyon: 'Kız/Erkek' },
  { id: 'izm-4', name: 'Karşıyaka Cihat Kora Anadolu Lisesi', city: 'İzmir', district: 'Karşıyaka', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 469.80, percentile2024: 2.65, quota: 180, pansiyon: 'Yok' },

  // Bursa
  { id: 'bur-1', name: 'Tofaş Fen Lisesi', city: 'Bursa', district: 'Nilüfer', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 489.80, percentile2024: 0.42, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'bur-2', name: 'Nilüfer Borsa İstanbul Fen Lisesi', city: 'Bursa', district: 'Nilüfer', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 478.30, percentile2024: 1.58, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'bur-3', name: 'Bursa Anadolu Lisesi', city: 'Bursa', district: 'Osmangazi', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 471.40, percentile2024: 2.45, quota: 210, pansiyon: 'Yok' },

  // Antalya
  { id: 'ant-1', name: 'Yusuf Ziya Öner Fen Lisesi', city: 'Antalya', district: 'Döşemealtı', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 486.20, percentile2024: 0.72, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ant-2', name: 'Antalya Anadolu Lisesi', city: 'Antalya', district: 'Muratpaşa', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 472.50, percentile2024: 2.30, quota: 210, pansiyon: 'Yok' },
  { id: 'ant-3', name: 'Adem Tolunay Anadolu Lisesi', city: 'Antalya', district: 'Muratpaşa', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 466.80, percentile2024: 3.10, quota: 180, pansiyon: 'Yok' },

  // Adana
  { id: 'ada-1', name: 'Adana Fen Lisesi', city: 'Adana', district: 'Seyhan', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 485.40, percentile2024: 0.85, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ada-2', name: 'Seyhan Rotary Anadolu Lisesi', city: 'Adana', district: 'Seyhan', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 468.90, percentile2024: 2.75, quota: 180, pansiyon: 'Yok' },

  // Hatay (Aşkar Yayınları Özel Vurgusu)
  { id: 'hat-1', name: 'Hatay Fen Lisesi', city: 'Hatay', district: 'Antakya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 478.90, percentile2024: 1.50, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'hat-2', name: 'İskenderun Tosçelik Fen Lisesi', city: 'Hatay', district: 'İskenderun', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 475.40, percentile2024: 1.95, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'hat-3', name: 'Selim Nevzat Şahin Anadolu Lisesi', city: 'Hatay', district: 'Defne', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 462.80, percentile2024: 3.65, quota: 180, pansiyon: 'Yok' },
  { id: 'hat-4', name: 'Karlısu Sosyal Bilimler Lisesi', city: 'Hatay', district: 'Antakya', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 435.60, percentile2024: 8.20, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'hat-5', name: 'Antakya Hz. Ayşe Kız Anadolu İHL', city: 'Hatay', district: 'Antakya', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 442.10, percentile2024: 7.10, quota: 90, pansiyon: 'Kız' },

  // Gaziantep
  { id: 'gaz-1', name: 'Vehbi Dinçerler Fen Lisesi', city: 'Gaziantep', district: 'Şehitkamil', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 483.50, percentile2024: 1.05, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'gaz-2', name: 'Gaziantep Anadolu Lisesi', city: 'Gaziantep', district: 'Şahinbey', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 465.70, percentile2024: 3.25, quota: 210, pansiyon: 'Yok' },

  // Konya
  { id: 'kon-1', name: 'Konya Meram Fen Lisesi', city: 'Konya', district: 'Meram', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 488.10, percentile2024: 0.55, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'kon-2', name: 'Selçuklu Fen Lisesi', city: 'Konya', district: 'Selçuklu', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 475.20, percentile2024: 1.98, quota: 150, pansiyon: 'Kız/Erkek' },

  // Kocaeli
  { id: 'koc-1', name: 'Kocaeli Fen Lisesi', city: 'Kocaeli', district: 'İzmit', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 487.40, percentile2024: 0.62, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'koc-2', name: 'Muammer Dereli Fen Lisesi', city: 'Kocaeli', district: 'İzmit', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 477.10, percentile2024: 1.72, quota: 150, pansiyon: 'Yok' },
];

const CITIES = ['TÜMÜ', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Hatay', 'Gaziantep', 'Konya', 'Kocaeli'];
const SCHOOL_TYPES = ['TÜMÜ', 'Fen Lisesi', 'Anadolu Lisesi', 'Sosyal Bilimler', 'Proje İHL'];

interface LgsTercihRobotuProps {
  onSelectBook?: (bookId: string) => void;
}

export const LgsTercihRobotu: React.FC<LgsTercihRobotuProps> = () => {
  const [userScore, setUserScore] = useState<number>(475.00);
  const [userPercentile, setUserPercentile] = useState<number>(2.00);
  const [selectedCity, setSelectedCity] = useState<string>('TÜMÜ');
  const [selectedType, setSelectedType] = useState<string>('TÜMÜ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'percentile' | 'score' | 'name'>('percentile');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // Approximate conversion between score and percentile based on 2024 MEB distribution
  const handleScoreChange = (score: number) => {
    const s = Math.max(100, Math.min(500, score || 0));
    setUserScore(s);
    // Rough estimate formula for percentile
    let estPercentile = 50;
    if (s >= 495) estPercentile = 0.10;
    else if (s >= 490) estPercentile = 0.35;
    else if (s >= 485) estPercentile = 0.75;
    else if (s >= 480) estPercentile = 1.30;
    else if (s >= 475) estPercentile = 2.00;
    else if (s >= 470) estPercentile = 2.70;
    else if (s >= 460) estPercentile = 3.90;
    else if (s >= 450) estPercentile = 5.50;
    else if (s >= 440) estPercentile = 7.30;
    else if (s >= 420) estPercentile = 11.50;
    else if (s >= 400) estPercentile = 16.00;
    else estPercentile = Math.min(100, Math.max(0.01, ((500 - s) / 5) * 1.2));
    setUserPercentile(Number(estPercentile.toFixed(2)));
  };

  const handlePercentileChange = (p: number) => {
    const val = Math.max(0.01, Math.min(100, p || 0.01));
    setUserPercentile(val);
    let estScore = 300;
    if (val <= 0.10) estScore = 496.0;
    else if (val <= 0.50) estScore = 489.0;
    else if (val <= 1.00) estScore = 483.5;
    else if (val <= 2.00) estScore = 475.0;
    else if (val <= 3.00) estScore = 468.0;
    else if (val <= 5.00) estScore = 455.0;
    else if (val <= 8.00) estScore = 438.0;
    else if (val <= 12.00) estScore = 420.0;
    else estScore = Math.max(100, 500 - (val / 1.2) * 5);
    setUserScore(Number(estScore.toFixed(2)));
  };

  const handleReset = () => {
    setUserScore(475.00);
    setUserPercentile(2.00);
    setSelectedCity('TÜMÜ');
    setSelectedType('TÜMÜ');
    setSearchQuery('');
    setOnlyEligible(false);
  };

  // Filtered and evaluated schools
  const processedSchools = useMemo(() => {
    return HIGH_SCHOOLS_DATABASE.map((school) => {
      const scoreDiff = Number((userScore - school.baseScore2024).toFixed(2));
      const percentileDiff = Number((school.percentile2024 - userPercentile).toFixed(2));

      // Likelihood evaluation
      let chance: 'GÜVENLİ' | 'İDEAL' | 'RİSKLİ' | 'ÇOK ZOR' = 'ÇOK ZOR';
      let chanceColor = 'bg-red-500/20 text-red-300 border-red-500/40';
      let chanceText = 'Puan Üstü / Çok Zor';

      if (userScore >= school.baseScore2024 + 4 || userPercentile <= school.percentile2024 * 0.85) {
        chance = 'GÜVENLİ';
        chanceColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        chanceText = 'Güvenli / Yüksek İhtimal';
      } else if (userScore >= school.baseScore2024 - 4 || Math.abs(userPercentile - school.percentile2024) <= 0.4) {
        chance = 'İDEAL';
        chanceColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        chanceText = 'İdeal Tercih Aralığı';
      } else if (userScore >= school.baseScore2024 - 12) {
        chance = 'RİSKLİ';
        chanceColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        chanceText = 'Riskli / Üst Tercih';
      } else {
        chance = 'ÇOK ZOR';
        chanceColor = 'bg-stone-500/20 text-stone-300 border-stone-500/40';
        chanceText = 'Uzak İhtimal';
      }

      const isEligible = chance === 'GÜVENLİ' || chance === 'İDEAL';

      return {
        ...school,
        scoreDiff,
        percentileDiff,
        chance,
        chanceColor,
        chanceText,
        isEligible
      };
    })
    .filter((school) => {
      if (selectedCity !== 'TÜMÜ' && school.city !== selectedCity) return false;
      if (selectedType !== 'TÜMÜ' && school.type !== selectedType) return false;
      if (onlyEligible && !school.isEligible) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = school.name.toLowerCase().includes(query);
        const matchDistrict = school.district.toLowerCase().includes(query);
        const matchCity = school.city.toLowerCase().includes(query);
        if (!matchName && !matchDistrict && !matchCity) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'percentile') return a.percentile2024 - b.percentile2024;
      if (sortBy === 'score') return b.baseScore2024 - a.baseScore2024;
      return a.name.localeCompare(b.name);
    });
  }, [userScore, userPercentile, selectedCity, selectedType, searchQuery, onlyEligible, sortBy]);

  const lgsCoachBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'k8');
  }, []);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white shadow-2xs">
            <Compass className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#856526] font-bold">
              2024 MEB TABAN PUANLARI • LGS TERCİH SİMÜLATÖRÜ
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              LGS Tercih Robotu - Yüzdelik Dilim
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold self-start sm:self-auto"
          title="Filtreleri sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* 2. Puan ve Yüzdelik Dilim Girişi (İki Yönlü Eşzamanlı) */}
      <div className="mb-6 p-5 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            1. ADIM: LGS PUANINIZI VEYA YÜZDELİK DİLİMİNİZİ GİRİN:
          </span>
          <span className="text-[10px] font-mono text-[#856526] font-semibold bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
            MEB Resmi 2024 Verileri
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LGS Puanı */}
          <div className="bg-white p-4 rounded-xl border border-[#1A1A1A]/15 shadow-2xs space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block">
              LGS Puanınız (100 - 500):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="100"
                max="500"
                step="0.01"
                value={userScore}
                onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
                className="w-full text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#C9A86A] focus:outline-hidden"
              />
              <span className="text-xs font-mono font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-2 rounded-xl border border-[#C9A86A]/30 shrink-0">
                Puan
              </span>
            </div>
            <p className="text-[10px] text-[#1A1A1A]/50">
              LGS sınavında aldığınız net puanı girin.
            </p>
          </div>

          {/* Yüzdelik Dilim */}
          <div className="bg-white p-4 rounded-xl border border-[#1A1A1A]/15 shadow-2xs space-y-1">
            <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 block">
              Genel Yüzdelik Diliminiz (%):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={userPercentile}
                onChange={(e) => handlePercentileChange(parseFloat(e.target.value) || 0.01)}
                className="w-full text-xl sm:text-2xl font-serif font-black text-[#856526] bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#C9A86A] focus:outline-hidden"
              />
              <span className="text-xs font-mono font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-2 rounded-xl border border-[#C9A86A]/30 shrink-0">
                % Dilim
              </span>
            </div>
            <p className="text-[10px] text-[#1A1A1A]/50">
              Tercihlerde en belirleyici kriter genel yüzdelik dilimdir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Şehir ve Okul Türü Filtreleri */}
      <div className="mb-6 p-4 rounded-xl bg-white border border-[#1A1A1A]/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70">
          <Filter className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>2. ADIM: ŞEHİR, OKUL TÜRÜ VE ARAMA FİLTRESİ:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Şehir Seçici */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
              Şehir Seçin:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city === 'TÜMÜ' ? 'Tüm Türkiye (Popüler Liseler)' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Okul Türü */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
              Okul Türü:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
            >
              {SCHOOL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'TÜMÜ' ? 'Tüm Okul Türleri' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Okul Adı / İlçe Arama */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 block mb-1 font-bold">
              Okul veya İlçe Ara:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: Kabataş, Çankaya, Hatay Fen..."
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl pl-8 pr-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:ring-1 focus:ring-[#C9A86A] focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-[#1A1A1A]/40 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Hızlı Filtre Butonları */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1A1A1A]/8 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#1A1A1A]">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A] rounded"
            />
            <span>Sadece yerleşebileceğim (Güvenli & İdeal) liseleri göster</span>
          </label>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1A1A1A]/60">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sırala:</span>
            <button
              onClick={() => setSortBy('percentile')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'percentile' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-100'
              }`}
            >
              Yüzdelik Dilim
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'score' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-100'
              }`}
            >
              Taban Puan
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sonuç Analiz Özeti */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#1A1A1A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A86A] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>TERCİH ANALİZİ ÖZETİ</span>
          </div>
          <div className="text-sm font-serif font-bold text-white mt-1">
            {processedSchools.length} Lise Listelendi • Puan: <span className="text-[#C9A86A]">{userScore.toFixed(2)}</span> (%{userPercentile.toFixed(2)} Dilim)
          </div>
          <p className="text-[11px] text-white/70 font-sans mt-0.5">
            2024 MEB taban puanları ve yüzdelik dilimlerine göre simüle edilmiştir.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Güvenli: {processedSchools.filter(s => s.chance === 'GÜVENLİ').length}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
            İdeal: {processedSchools.filter(s => s.chance === 'İDEAL').length}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Riskli: {processedSchools.filter(s => s.chance === 'RİSKLİ').length}
          </span>
        </div>
      </div>

      {/* 5. Liseler Tablosu / Listesi */}
      <div className="space-y-3 mb-8">
        <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-2xs bg-[#FAF9F6]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider">
                  <th className="p-3 sm:px-4">Lise Adı ve Bilgileri</th>
                  <th className="p-3 sm:px-4 text-center w-28">2024 Yüzdelik</th>
                  <th className="p-3 sm:px-4 text-center w-28">2024 Taban Puan</th>
                  <th className="p-3 sm:px-4 text-center w-36">Girme Durumu</th>
                  <th className="p-3 sm:px-4 text-center w-24 hidden md:table-cell">Kontenjan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
                {processedSchools.length > 0 ? (
                  processedSchools.map((school) => (
                    <tr
                      key={school.id}
                      className="hover:bg-[#FAF6EE]/50 transition-colors"
                    >
                      {/* Lise Bilgisi */}
                      <td className="p-3 sm:px-4">
                        <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                          <span>{school.name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#1A1A1A]/60 font-sans">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#1A1A1A]/40" />
                            <span>{school.city} / {school.district}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#1A1A1A]/10">
                            {school.type}
                          </span>
                          <span>•</span>
                          <span className="text-[10px] text-[#1A1A1A]/50">
                            {school.lang} • Pansiyon: {school.pansiyon}
                          </span>
                        </div>
                      </td>

                      {/* Yüzdelik Dilim */}
                      <td className="p-3 sm:px-4 text-center font-mono font-bold text-[#856526]">
                        %{school.percentile2024.toFixed(2)}
                      </td>

                      {/* Taban Puan */}
                      <td className="p-3 sm:px-4 text-center font-mono font-semibold text-[#1A1A1A]">
                        {school.baseScore2024.toFixed(2)}
                      </td>

                      {/* Girme Durumu / İhtimal */}
                      <td className="p-3 sm:px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${school.chanceColor}`}
                          >
                            {school.chanceText}
                          </span>
                          <span className="text-[9px] font-mono text-[#1A1A1A]/50">
                            {school.scoreDiff >= 0 ? `+${school.scoreDiff} Puan` : `${school.scoreDiff} Puan`}
                          </span>
                        </div>
                      </td>

                      {/* Kontenjan */}
                      <td className="p-3 sm:px-4 text-center font-mono text-xs text-[#1A1A1A]/70 hidden md:table-cell">
                        {school.quota} Öğrenci
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#1A1A1A]/50">
                      Seçilen kriterlere ve puana uygun lise bulunamadı. Lütfen filtrelerinizi genişletiniz.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. AŞKAR KAP LGS Koçluk Kaynağı */}
      {lgsCoachBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={lgsCoachBook.image}
              alt={lgsCoachBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>HAYALİNDEKİ LİSEYE ULAŞTIRAN LGS KOÇLUK SİSTEMİ:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {lgsCoachBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                12 adımda disiplin, deneme analizi ve sınav taktiği ile hedeflediğin Fen ve Anadolu Lisesini kazan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(lgsCoachBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={lgsCoachBook.shopierUrl}
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
