import React, { useState } from 'react';
import { Target, Award, CheckCircle, AlertTriangle, RefreshCw, BookOpen, Star, Sparkles, ArrowRight, Share2 } from 'lucide-react';
import { SinavSonuc } from '../types/notAvcisiTypes';

interface NotAvcisiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sonuc: SinavSonuc;
  ogrenciAdi?: string;
  onRetakeExam?: () => void;
}

export const NotAvcisiReportModal: React.FC<NotAvcisiReportModalProps> = ({
  isOpen,
  onClose,
  sonuc,
  ogrenciAdi = 'Öğrenci',
  onRetakeExam
}) => {
  if (!isOpen) return null;

  // Başarı derecesi
  const getBadgeInfo = (puan: number) => {
    if (puan >= 85) return { text: 'YAZILI ŞAMPİYONU ⭐', color: 'from-amber-400 to-amber-600', textColor: 'text-amber-300' };
    if (puan >= 70) return { text: 'BAŞARILI AVCI 🎯', color: 'from-emerald-400 to-emerald-600', textColor: 'text-emerald-300' };
    if (puan >= 50) return { text: 'GELİŞTİRİLEBİLİR 📈', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-300' };
    return { text: 'ACİL TEKRAR GEREKİYOR ⚠️', color: 'from-rose-400 to-rose-600', textColor: 'text-rose-300' };
  };

  const badge = getBadgeInfo(sonuc.alinanPuan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        
        {/* Üst Başlık & Koç Baykuş Karşılama */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-950">
            <img
              src="/resimler/branding/not-avcisi-baykus.jpg"
              alt="Koç Baykuş"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 ${badge.textColor} mb-1`}>
              {badge.text}
            </div>
            <h3 className="text-2xl font-black text-white">
              Tebrikler, {ogrenciAdi}! Sınav Karnen Hazır 🦉
            </h3>
            <p className="text-xs text-slate-400">
              {sonuc.sinif}. Sınıf {sonuc.dersAdi} • Not Avcısı Yazılı Ön Hazırlık Raporu
            </p>
          </div>
        </div>

        {/* Büyük Skor Göstergesi */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 text-amber-500/10 text-8xl font-black">100</div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-widest block mb-1">
            BU DENEME PROVADAN ALDIĞIN NOT
          </span>
          <div className="text-6xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            {sonuc.alinanPuan} <span className="text-2xl text-slate-500 font-bold">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tamamlanma Süresi: {Math.floor(sonuc.harcananSureSaniye / 60)} Dakika {sonuc.harcananSureSaniye % 60} Saniye
          </p>
        </div>

        {/* Eksik Kazanımlar ve Nokta Atışı Koçluk Reçetesi */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Kazanım Röntgeni & Koçun Gelişim Tavsiyeleri</span>
          </h4>

          {sonuc.eksikKazanimlar.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Muhteşem! Tüm soruları ve kazanımları tam puanla tamamladın. Gerçek yazılıda 100 seni bekliyor!</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {sonuc.eksikKazanimlar.map((ek, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="text-amber-300">{ek.konu} ({ek.kazanimKodu})</span>
                    <span className="text-rose-400">-{ek.kaybedilenPuan} Puan</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-amber-400">🦉 Koçunun Notu: </strong> {ek.tavsiye}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İlgili Aşkar Yayınları Koçluk Kitabı Tavsiyesi */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-950 border border-amber-500/30 overflow-hidden shrink-0">
              <img src="/resimler/k5.jpg" alt="Kitap" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Aşkar Yayınları {sonuc.sinif}. Sınıf Koçu</span>
              <span className="text-[11px] text-slate-400">Bu eksik kazanımları kapatmak için ilgili rehber kitaba göz at!</span>
            </div>
          </div>
          <a
            href="https://www.askaryayinlari.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 transition"
          >
            İncele →
          </a>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
          >
            Panele Dön
          </button>

          {onRetakeExam && (
            <button
              onClick={onRetakeExam}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tekrar Çöz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
