import React from 'react';
import { KIDS_APP_URL } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { Sparkles, ExternalLink, Gamepad2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-center my-6 overflow-hidden relative">
      <div className="w-full md:w-64 aspect-square rounded-xl overflow-hidden shrink-0 border border-[#1A1A1A]/10 relative group bg-[#F8F7F4]">
        <ImgWithFallback
          src="/resimler/cocuk.png"
          alt="Sevimli Deniz Altı Kaşifleri"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest text-white/90 bg-[#1A1A1A]/70 px-2 py-0.5 rounded backdrop-blur-xs">
          REF. 092-KIDS
        </div>
      </div>

      <div className="flex-1 space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#1A1A1A]/10">
          <Sparkles className="w-3 h-3 text-[#C9A86A]" />
          <span>ÇOCUKLAR İÇİN GÜVENLİ • TIKLA OYNA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1A1A1A] leading-[1.05] tracking-tight">
          Sevimli Deniz Altı <br className="hidden sm:inline" />
          <span className="italic text-[#C9A86A] font-normal">Kaşifleri</span>
        </h1>

        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm leading-relaxed max-w-xl">
          Yıldız Kaşif Olmaya Hazır mısın? Çocuklar için Yaratıcılık ve Beceri Gelişimi - Sesli Dijital Çocuk Uygulaması. Güvenli, reklamsız, eğitici çocuk boyama ve hikaye dünyası.
        </p>

        <div className="pt-2 flex items-center gap-4 flex-wrap">
          <a
            href={KIDS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Gamepad2 className="w-4 h-4 text-[#C9A86A]" />
            <span>ÇOCUKLARA ARMAĞANIMIZDIR - TIKLA OYNA</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
