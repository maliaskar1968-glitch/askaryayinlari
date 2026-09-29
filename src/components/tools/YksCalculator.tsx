import React, { useState, useMemo } from 'react';
import { Calculator, Award, GraduationCap, TrendingUp, RotateCcw, Sparkles, BookOpen, ExternalLink, Eye, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';
<<<<<<< HEAD
import { getOsymKilavuz } from '../../utils/osymKilavuz';
=======
>>>>>>> a2502d1935ee43419e3b8e6f3866f6340b3b7c25

type TargetField = 'say' | 'ea' | 'soz' | 'tyt';

interface ScoreItem {
  d: number;
  y: number;
}

export const YksCalculator: React.FC = () => {
<<<<<<< HEAD
  const osymData = useMemo(() => getOsymKilavuz(), []);
=======
>>>>>>> a2502d1935ee43419e3b8e6f3866f6340b3b7c25
  const [activeField, setActiveField] = useState<TargetField>('say');

  // TYT Testleri (120 Soru)
  const [tytScores, setTytScores] = useState<Record<string, ScoreItem>>({
    turkce: { d: 30, y: 8 }, // 40
    sosyal: { d: 14, y: 4 }, // 20
    matematik: { d: 26, y: 6 }, // 40
    fen: { d: 13, y: 5 }, // 20
  });

  // AYT Testleri
  const [aytScores, setAytScores] = useState<Record<string, ScoreItem>>({
    matematik: { d: 28, y: 5 }, // 40
    fizik: { d: 9, y: 4 }, // 14
    kimya: { d: 9, y: 3 }, // 13
    biyoloji: { d: 10, y: 3 }, // 13
    edebiyat: { d: 18, y: 4 }, // 24
    tarih1: { d: 7, y: 2 }, // 10
    cografya1: { d: 5, y: 1 }, // 6
    tarih2: { d: 8, y: 3 }, // 11
    cografya2: { d: 8, y: 3 }, // 11
    felsefe: { d: 9, y: 3 }, // 12
    din: { d: 5, y: 1 }, // 6
  });

  // Diploma Notu & Kırık OBP
  const [diplomaGrade, setDiplomaGrade] = useState<number>(85);
  const [isBrokenObp, setIsBrokenObp] = useState<boolean>(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // Helper to update TYT score
  const updateTyt = (key: string, field: 'd' | 'y', val: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, val || 0));
    setTytScores((prev) => {
      const cur = prev[key] || { d: 0, y: 0 };
      const updated = { ...cur, [field]: clamped };
      if (updated.d + updated.y > max) {
        if (field === 'd') updated.y = max - updated.d;
        else updated.d = max - updated.y;
      }
      return { ...prev, [key]: updated };
    });
  };

  // Helper to update AYT score
  const updateAyt = (key: string, field: 'd' | 'y', val: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, val || 0));
    setAytScores((prev) => {
      const cur = prev[key] || { d: 0, y: 0 };
      const updated = { ...cur, [field]: clamped };
      if (updated.d + updated.y > max) {
        if (field === 'd') updated.y = max - updated.d;
        else updated.d = max - updated.y;
      }
      return { ...prev, [key]: updated };
    });
  };

  // Calc Net
  const calcNet = (item?: ScoreItem) => {
    if (!item) return 0;
    return Math.max(0, Number((item.d - item.y / 4).toFixed(2)));
  };

  // Net totals
  const tytNets = useMemo(() => {
    const tr = calcNet(tytScores.turkce);
    const sos = calcNet(tytScores.sosyal);
    const mat = calcNet(tytScores.matematik);
    const fen = calcNet(tytScores.fen);
    const total = Number((tr + sos + mat + fen).toFixed(2));
    return { tr, sos, mat, fen, total };
  }, [tytScores]);

  const aytNets = useMemo(() => {
    const mat = calcNet(aytScores.matematik);
    const fiz = calcNet(aytScores.fizik);
    const kim = calcNet(aytScores.kimya);
    const bio = calcNet(aytScores.biyoloji);
    const sayFen = Number((fiz + kim + bio).toFixed(2));
    const sayTotal = Number((mat + sayFen).toFixed(2));

    const edb = calcNet(aytScores.edebiyat);
    const tar1 = calcNet(aytScores.tarih1);
    const cog1 = calcNet(aytScores.cografya1);
    const edbSos1 = Number((edb + tar1 + cog1).toFixed(2));
    const eaTotal = Number((mat + edbSos1).toFixed(2));

    const tar2 = calcNet(aytScores.tarih2);
    const cog2 = calcNet(aytScores.cografya2);
    const fel = calcNet(aytScores.felsefe);
    const din = calcNet(aytScores.din);
    const sos2 = Number((tar2 + cog2 + fel + din).toFixed(2));
    const sozTotal = Number((edbSos1 + sos2).toFixed(2));

    return {
      mat,
      fiz,
      kim,
      bio,
      sayFen,
      sayTotal,
      edb,
      tar1,
      cog1,
      edbSos1,
      eaTotal,
      tar2,
      cog2,
      fel,
      din,
      sos2,
      sozTotal,
    };
  }, [aytScores]);

  // OBP Calculations
  const obpDetails = useMemo(() => {
    const validDiploma = Math.max(50, Math.min(100, diplomaGrade || 50));
    const obp = validDiploma * 5; // 250 - 500
    const factor = isBrokenObp ? 0.06 : 0.12;
    const contribution = Number((obp * factor).toFixed(2)); // max 60 (or 30 if broken)
    return { validDiploma, obp, contribution };
  }, [diplomaGrade, isBrokenObp]);

  // ÖSYM Puan Hesaplama Motoru (Standardize Edilmiş 2024-2025 Katsayıları)
  const results = useMemo(() => {
    // 1. TYT Ham Puanı: Taban 100 + (Türkçe*1.32 + Sosyal*1.36 + Mat*1.32 + Fen*1.36)
    const tytRaw = Math.min(
      500,
      100 +
        tytNets.tr * 1.32 +
        tytNets.sos * 1.36 +
        tytNets.mat * 1.32 +
        tytNets.fen * 1.36
    );
    const tytPlaced = Math.min(560, tytRaw + obpDetails.contribution);

    // 2. SAY Ham Puanı: 100 Taban + (TYT katkısı %40) + (AYT Mat*3.0 + Fiz*2.85 + Kim*3.07 + Bio*3.07)
    const tytContributionToAyt = (tytRaw - 100) * 0.4;
    const sayRaw = Math.min(
      500,
      100 +
        tytContributionToAyt +
        aytNets.mat * 3.0 +
        aytNets.fiz * 2.85 +
        aytNets.kim * 3.07 +
        aytNets.bio * 3.07
    );
    const sayPlaced = Math.min(560, sayRaw + obpDetails.contribution);

    // 3. EA Ham Puanı: 100 + (TYT katkısı %40) + (AYT Mat*3.0 + Edb*3.0 + Tar1*2.8 + Cog1*3.33)
    const eaRaw = Math.min(
      500,
      100 +
        tytContributionToAyt +
        aytNets.mat * 3.0 +
        aytNets.edb * 3.0 +
        aytNets.tar1 * 2.8 +
        aytNets.cog1 * 3.33
    );
    const eaPlaced = Math.min(560, eaRaw + obpDetails.contribution);

    // 4. SÖZ Ham Puanı: 100 + (TYT katkısı %40) + (Edb*3.0 + Tar1*2.8 + Cog1*3.33 + Tar2*2.91 + Cog2*2.91 + Fel*3.0 + Din*3.0)
    const sozRaw = Math.min(
      500,
      100 +
        tytContributionToAyt +
        aytNets.edb * 3.0 +
        aytNets.tar1 * 2.8 +
        aytNets.cog1 * 3.33 +
        aytNets.tar2 * 2.91 +
        aytNets.cog2 * 2.91 +
        aytNets.fel * 3.0 +
        aytNets.din * 3.0
    );
    const sozPlaced = Math.min(560, sozRaw + obpDetails.contribution);

    // Sıralama Tahmin Fonksiyonu (2024 ÖSYM yığılma projeksiyonu)
    const estimateRank = (score: number, type: TargetField): string => {
      if (type === 'say') {
        if (score >= 530) return 'İlk 1.500';
        if (score >= 500) return '1.500 - 5.000';
        if (score >= 460) return '5.000 - 18.000';
        if (score >= 420) return '18.000 - 45.000';
        if (score >= 380) return '45.000 - 85.000';
        if (score >= 340) return '85.000 - 150.000';
        if (score >= 300) return '150.000 - 240.000';
        if (score >= 260) return '240.000 - 380.000';
        return '380.000+';
      }
      if (type === 'ea') {
        if (score >= 510) return 'İlk 800';
        if (score >= 470) return '800 - 4.500';
        if (score >= 430) return '4.500 - 16.000';
        if (score >= 390) return '16.000 - 42.000';
        if (score >= 350) return '42.000 - 90.000';
        if (score >= 310) return '90.000 - 180.000';
        if (score >= 270) return '180.000 - 310.000';
        return '310.000+';
      }
      if (type === 'soz') {
        if (score >= 500) return 'İlk 500';
        if (score >= 460) return '500 - 3.000';
        if (score >= 420) return '3.000 - 12.000';
        if (score >= 380) return '12.000 - 35.000';
        if (score >= 340) return '35.000 - 75.000';
        if (score >= 300) return '75.000 - 150.000';
        return '150.000+';
      }
      // TYT
      if (score >= 500) return 'İlk 2.000';
      if (score >= 450) return '2.000 - 15.000';
      if (score >= 400) return '15.000 - 55.000';
      if (score >= 350) return '55.000 - 140.000';
      if (score >= 300) return '140.000 - 280.000';
      if (score >= 250) return '280.000 - 550.000';
      return '550.000+';
    };

    return {
      tytRaw: Number(tytRaw.toFixed(2)),
      tytPlaced: Number(tytPlaced.toFixed(2)),
      tytRank: estimateRank(tytPlaced, 'tyt'),

      sayRaw: Number(sayRaw.toFixed(2)),
      sayPlaced: Number(sayPlaced.toFixed(2)),
      sayRank: estimateRank(sayPlaced, 'say'),

      eaRaw: Number(eaRaw.toFixed(2)),
      eaPlaced: Number(eaPlaced.toFixed(2)),
      eaRank: estimateRank(eaPlaced, 'ea'),

      sozRaw: Number(sozRaw.toFixed(2)),
      sozPlaced: Number(sozPlaced.toFixed(2)),
      sozRank: estimateRank(sozPlaced, 'soz'),
    };
  }, [tytNets, aytNets, obpDetails]);

  const handleReset = () => {
    setTytScores({
      turkce: { d: 30, y: 8 },
      sosyal: { d: 14, y: 4 },
      matematik: { d: 26, y: 6 },
      fen: { d: 13, y: 5 },
    });
    setAytScores({
      matematik: { d: 28, y: 5 },
      fizik: { d: 9, y: 4 },
      kimya: { d: 9, y: 3 },
      biyoloji: { d: 10, y: 3 },
      edebiyat: { d: 18, y: 4 },
      tarih1: { d: 7, y: 2 },
      cografya1: { d: 5, y: 1 },
      tarih2: { d: 8, y: 3 },
      cografya2: { d: 8, y: 3 },
      felsefe: { d: 9, y: 3 },
      din: { d: 5, y: 1 },
    });
    setDiplomaGrade(85);
    setIsBrokenObp(false);
  };

  const yksBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'k_yks') || BOOKS_DATA.find((b) => b.id === 'k11');
  }, []);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Üst Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ea580c] rounded-xl text-white shadow-2xs">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ea580c] font-bold">
<<<<<<< HEAD
              ÖSYM {osymData.yil} YKS UYUMLU • TYT + AYT + OBP
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              YKS Puan Hesaplama {osymData.yil} TYT AYT + OBP
=======
              ÖSYM 2025 YKS UYUMLU • TYT + AYT + OBP
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              YKS Puan Hesaplama 2025 TYT AYT + OBP
>>>>>>> a2502d1935ee43419e3b8e6f3866f6340b3b7c25
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold self-start sm:self-auto"
          title="Varsayılan netleri yükle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Örnek Netler</span>
        </button>
      </div>

      {/* 2. Alan Seçim Barı (SAY, EA, SÖZ, TYT) */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
            HEDEF ALANINIZ:
          </span>
          <span className="text-[10px] font-mono text-[#ea580c] font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            {activeField === 'say' ? 'Sayısal (Matematik + Fen)' : activeField === 'ea' ? 'Eşit Ağırlık (Matematik + Edb-Sos)' : activeField === 'soz' ? 'Sözel (Edb-Sos-1 + Sos-2)' : 'Yalnızca TYT'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveField('say')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeField === 'say'
                ? 'bg-[#ea580c] text-white shadow-xs'
                : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
            }`}
          >
            SAYISAL (SAY)
          </button>

          <button
            type="button"
            onClick={() => setActiveField('ea')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeField === 'ea'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
            }`}
          >
            EŞİT AĞIRLIK (EA)
          </button>

          <button
            type="button"
            onClick={() => setActiveField('soz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeField === 'soz'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
            }`}
          >
            SÖZEL (SÖZ)
          </button>

          <button
            type="button"
            onClick={() => setActiveField('tyt')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeField === 'tyt'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
            }`}
          >
            TYT
          </button>
        </div>
      </div>

      {/* 3. DİPLOMA NOTU & OBP KUTUSU */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
            DİPLOMA NOTU (50 - 100):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max="100"
              step="0.5"
              value={diplomaGrade}
              onChange={(e) => setDiplomaGrade(parseFloat(e.target.value) || 50)}
              className="w-24 bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-1.5 text-base font-serif font-black text-[#1A1A1A] focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden text-center"
            />
            <span className="text-xs font-mono text-[#1A1A1A]/60">OBP: <strong>{obpDetails.obp.toFixed(0)}</strong></span>
          </div>
        </div>

        <div className="sm:border-x sm:border-[#1A1A1A]/10 sm:px-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#1A1A1A]/80">
            <input
              type="checkbox"
              checked={isBrokenObp}
              onChange={(e) => setIsBrokenObp(e.target.checked)}
              className="w-4 h-4 rounded text-[#ea580c] focus:ring-[#ea580c]"
            />
            <span>Geçen sene üniversiteye yerleştim <strong>(Kırık OBP)</strong></span>
          </label>
          <span className="text-[10px] font-mono text-[#1A1A1A]/50 block mt-0.5">
            {isBrokenObp ? 'OBP katsayısı 0.06 olarak yarıya iner.' : 'Standart katsayı: 0.12'}
          </span>
        </div>

        <div className="text-right sm:text-right">
          <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 font-bold block">
            YERLEŞTİRMEYE EKLENECEK OBP PUANI:
          </span>
          <span className="text-xl sm:text-2xl font-serif font-black text-[#ea580c]">
            +{obpDetails.contribution.toFixed(2)} Puan
          </span>
        </div>
      </div>

      {/* 4. NET GİRİŞ ALANLARI: TYT & AYT TABLOLARI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* TYT (120 Soru) */}
        <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              <span>1. OTURUM: TYT (120 Soru)</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#C9A86A]">
              Toplam: {tytNets.total} Net
            </span>
          </div>

          <div className="p-4 space-y-3">
            {[
              { id: 'turkce', name: 'Türkçe', max: 40, item: tytScores.turkce, net: tytNets.tr },
              { id: 'sosyal', name: 'Sosyal Bilimler', max: 20, item: tytScores.sosyal, net: tytNets.sos },
              { id: 'matematik', name: 'Temel Matematik', max: 40, item: tytScores.matematik, net: tytNets.mat },
              { id: 'fen', name: 'Fen Bilimleri', max: 20, item: tytScores.fen, net: tytNets.fen },
            ].map((sub) => (
              <div key={sub.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                <div className="w-36 font-serif font-bold text-[#1A1A1A]">
                  {sub.name} <span className="text-[10px] text-[#1A1A1A]/40 font-mono">({sub.max})</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60">D:</span>
                    <input
                      type="number"
                      min="0"
                      max={sub.max}
                      value={sub.item.d}
                      onChange={(e) => updateTyt(sub.id, 'd', parseInt(e.target.value) || 0, sub.max)}
                      className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60">Y:</span>
                    <input
                      type="number"
                      min="0"
                      max={sub.max}
                      value={sub.item.y}
                      onChange={(e) => updateTyt(sub.id, 'y', parseInt(e.target.value) || 0, sub.max)}
                      className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                    />
                  </div>

                  <div className="w-14 text-right font-mono font-bold text-[#ea580c]">
                    {sub.net} N
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AYT (Alan Yeterlilik - Seçilen Alana Uygun) */}
        <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span>2. OTURUM: AYT ({activeField === 'say' ? 'Sayısal' : activeField === 'ea' ? 'Eşit Ağırlık' : activeField === 'soz' ? 'Sözel' : 'Alan Testleri'})</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#C9A86A]">
              AYT: {activeField === 'say' ? aytNets.sayTotal : activeField === 'ea' ? aytNets.eaTotal : activeField === 'soz' ? aytNets.sozTotal : aytNets.sayTotal} Net
            </span>
          </div>

          <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
            {/* Sayısal veya EA ise Matematik */}
            {(activeField === 'say' || activeField === 'ea') && (
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                <div className="w-36 font-serif font-bold text-[#1A1A1A]">
                  AYT Matematik <span className="text-[10px] text-[#1A1A1A]/40 font-mono">(40)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60">D:</span>
                    <input
                      type="number"
                      min="0"
                      max={40}
                      value={aytScores.matematik.d}
                      onChange={(e) => updateAyt('matematik', 'd', parseInt(e.target.value) || 0, 40)}
                      className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60">Y:</span>
                    <input
                      type="number"
                      min="0"
                      max={40}
                      value={aytScores.matematik.y}
                      onChange={(e) => updateAyt('matematik', 'y', parseInt(e.target.value) || 0, 40)}
                      className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                    />
                  </div>
                  <div className="w-14 text-right font-mono font-bold text-[#2563eb]">
                    {aytNets.mat} N
                  </div>
                </div>
              </div>
            )}

            {/* Sayısal Fen Testleri */}
            {activeField === 'say' && (
              <>
                {[
                  { id: 'fizik', name: 'Fizik', max: 14, item: aytScores.fizik, net: aytNets.fiz },
                  { id: 'kimya', name: 'Kimya', max: 13, item: aytScores.kimya, net: aytNets.kim },
                  { id: 'biyoloji', name: 'Biyoloji', max: 13, item: aytScores.biyoloji, net: aytNets.bio },
                ].map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                    <div className="w-36 font-serif font-bold text-[#1A1A1A]">
                      {sub.name} <span className="text-[10px] text-[#1A1A1A]/40 font-mono">({sub.max})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">D:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.d}
                          onChange={(e) => updateAyt(sub.id, 'd', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">Y:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.y}
                          onChange={(e) => updateAyt(sub.id, 'y', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="w-14 text-right font-mono font-bold text-[#2563eb]">
                        {sub.net} N
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* EA veya SÖZ Edebiyat - Sosyal-1 */}
            {(activeField === 'ea' || activeField === 'soz') && (
              <>
                {[
                  { id: 'edebiyat', name: 'Türk Dili ve Edb.', max: 24, item: aytScores.edebiyat, net: aytNets.edb },
                  { id: 'tarih1', name: 'Tarih-1', max: 10, item: aytScores.tarih1, net: aytNets.tar1 },
                  { id: 'cografya1', name: 'Coğrafya-1', max: 6, item: aytScores.cografya1, net: aytNets.cog1 },
                ].map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                    <div className="w-36 font-serif font-bold text-[#1A1A1A]">
                      {sub.name} <span className="text-[10px] text-[#1A1A1A]/40 font-mono">({sub.max})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">D:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.d}
                          onChange={(e) => updateAyt(sub.id, 'd', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">Y:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.y}
                          onChange={(e) => updateAyt(sub.id, 'y', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="w-14 text-right font-mono font-bold text-[#059669]">
                        {sub.net} N
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Sözel Sosyal-2 */}
            {activeField === 'soz' && (
              <>
                {[
                  { id: 'tarih2', name: 'Tarih-2', max: 11, item: aytScores.tarih2, net: aytNets.tar2 },
                  { id: 'cografya2', name: 'Coğrafya-2', max: 11, item: aytScores.cografya2, net: aytNets.cog2 },
                  { id: 'felsefe', name: 'Felsefe Grubu', max: 12, item: aytScores.felsefe, net: aytNets.fel },
                  { id: 'din', name: 'Din Kültürü', max: 6, item: aytScores.din, net: aytNets.din },
                ].map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                    <div className="w-36 font-serif font-bold text-[#1A1A1A]">
                      {sub.name} <span className="text-[10px] text-[#1A1A1A]/40 font-mono">({sub.max})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">D:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.d}
                          onChange={(e) => updateAyt(sub.id, 'd', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">Y:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.max}
                          value={sub.item.y}
                          onChange={(e) => updateAyt(sub.id, 'y', parseInt(e.target.value) || 0, sub.max)}
                          className="w-12 text-center py-1 border border-stone-200 rounded-lg text-xs font-mono font-bold bg-[#FAF9F6]"
                        />
                      </div>
                      <div className="w-14 text-right font-mono font-bold text-[#059669]">
                        {sub.net} N
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeField === 'tyt' && (
              <div className="p-6 text-center text-xs text-[#1A1A1A]/60 font-sans">
                Yalnızca TYT puan türü seçildi. İki yıllık önlisans ve polislik/astsubaylık programları için sol paneldeki TYT netleri yeterlidir.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. SONUÇ PANELİ: OBP'li YKS PUANLARI VE SIRALAMALAR */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#1E293B] text-white shadow-md border border-[#1A1A1A] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A86A] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖSYM 2025 HESAPLANAN YKS PUANLARI</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white mt-0.5">
              OBP Eklenmiş Yerleştirme Puanları & Sıralama
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#C9A86A] bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 self-start sm:self-auto">
            OBP Katkısı: +{obpDetails.contribution.toFixed(2)} Puan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* SAYISAL PUAN */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeField === 'say' ? 'bg-[#ea580c]/20 border-[#ea580c] ring-1 ring-[#ea580c]' : 'bg-white/5 border-white/10'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold block mb-1">
              SAYISAL (Y-SAY)
            </span>
            <div className="text-2xl font-serif font-black text-white">
              {results.sayPlaced}
            </div>
            <span className="text-[11px] font-mono text-white/60 block mt-0.5">
              Ham: {results.sayRaw}
            </span>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/70">Tahmini Sıra:</span>
              <strong className="font-mono text-orange-300 font-bold">{results.sayRank}</strong>
            </div>
          </div>

          {/* EŞİT AĞIRLIK PUAN */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeField === 'ea' ? 'bg-[#2563eb]/20 border-[#2563eb] ring-1 ring-[#2563eb]' : 'bg-white/5 border-white/10'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
              EŞİT AĞIRLIK (Y-EA)
            </span>
            <div className="text-2xl font-serif font-black text-white">
              {results.eaPlaced}
            </div>
            <span className="text-[11px] font-mono text-white/60 block mt-0.5">
              Ham: {results.eaRaw}
            </span>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/70">Tahmini Sıra:</span>
              <strong className="font-mono text-blue-300 font-bold">{results.eaRank}</strong>
            </div>
          </div>

          {/* SÖZEL PUAN */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeField === 'soz' ? 'bg-[#059669]/20 border-[#059669] ring-1 ring-[#059669]' : 'bg-white/5 border-white/10'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              SÖZEL (Y-SÖZ)
            </span>
            <div className="text-2xl font-serif font-black text-white">
              {results.sozPlaced}
            </div>
            <span className="text-[11px] font-mono text-white/60 block mt-0.5">
              Ham: {results.sozRaw}
            </span>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/70">Tahmini Sıra:</span>
              <strong className="font-mono text-emerald-300 font-bold">{results.sozRank}</strong>
            </div>
          </div>

          {/* TYT PUAN */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeField === 'tyt' ? 'bg-[#C9A86A]/20 border-[#C9A86A] ring-1 ring-[#C9A86A]' : 'bg-white/5 border-white/10'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block mb-1">
              TYT (Y-TYT)
            </span>
            <div className="text-2xl font-serif font-black text-white">
              {results.tytPlaced}
            </div>
            <span className="text-[11px] font-mono text-white/60 block mt-0.5">
              Ham: {results.tytRaw}
            </span>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/70">Tahmini Sıra:</span>
              <strong className="font-mono text-amber-200 font-bold">{results.tytRank}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 6. AŞKAR YKS KOÇLUK KAYNAĞI ÖNERİSİ */}
      {yksBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#ea580c]/20 text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={yksBook.image}
              alt={yksBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>YKS DERECE & KOÇLUK REHBERİ:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {yksBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                TYT ve AYT netlerinizi artırmak, deneme analizlerini kusursuz yapmak ve hayalinizdeki bölüme yerleşmek için Aşkar YKS koçluk sistemini edinin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(yksBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={yksBook.shopierUrl}
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
