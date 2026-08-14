import React from 'react';
import { KIDS_APP_URL } from '../../data/books';
import { ImgWithFallback } from '../ImgWithFallback';
import { ExternalLink, Gamepad2, ShieldCheck } from 'lucide-react';

export const KidsAppCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        <div className="w-full sm:w-56 aspect-square rounded-xl overflow-hidden shrink-0 border border-[#1A1A1A]/10 relative group bg-[#F8F7F4]">
          <ImgWithFallback
            src="/cocuk.png"
            alt="Sevimli Deniz Altı Kaşifleri"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-[9px] font-mono tracking-[0.2em] border border-[#1A1A1A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>GÜVENLİ • REKLAMSIZ • ÜCRETSİZ ARMAĞAN</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Sevimli Deniz Altı Kaşifleri
          </h3>

          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans">
            Yıldız Kaşif Olmaya Hazır mısın? Çocuklar için Yaratıcılık ve Beceri Gelişimi - Sesli Dijital Çocuk Uygulaması. TR | EN dil seçeneği ile eğlenceli boyama ve hikaye dünyası.
          </p>

          <div className="pt-2">
            <a
              href={KIDS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white px-6 py-3.5 rounded-full text-xs font-mono tracking-widest transition-all active:scale-95 border border-[#1A1A1A]"
            >
              <Gamepad2 className="w-4 h-4 text-[#C9A86A]" />
              <span>UYGULAMAYI AÇ - TIKLA OYNA</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/50" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
