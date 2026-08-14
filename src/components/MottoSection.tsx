import React from 'react';
import { ImgWithFallback } from './ImgWithFallback';

interface MottoSectionProps {
  showAuthorPhoto?: boolean;
}

export const MottoSection: React.FC<MottoSectionProps> = ({ showAuthorPhoto = false }) => {
  return (
    <div className="text-center py-12 px-6 my-6 bg-[#F8F7F4] rounded-2xl border border-[#1A1A1A]/10 relative overflow-hidden">
      {/* Top Tag */}
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#1A1A1A]/40 mb-4">
        Aşkar Yayınları
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {showAuthorPhoto && (
          <div className="flex justify-center mb-6">
            <ImgWithFallback
              src="/resimler/logo.jpg"
              alt="Mehmet Ali Askar - Aşkar Yayınları"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#C9A86A]/40 object-cover shadow-md bg-black"
            />
          </div>
        )}

        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black text-[#1A1A1A] leading-[0.9] tracking-tight">
          Bilgiyle Hayalle <br />
          <span className="italic font-normal text-[#C9A86A] pl-4 sm:pl-8 inline-block">
            Geleceğe Dörtnala
          </span>
        </h2>

        <div className="w-12 h-[2px] bg-[#1A1A1A]/20 mx-auto my-6" />

        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#1A1A1A]/85 font-medium leading-relaxed font-sans">
          "Çocuğunun sınavda bir adım öne geçmesi için aradığın her şey, anında cebinde."
        </p>

        <p className="text-[11px] sm:text-xs text-[#1A1A1A]/55 font-sans flex items-center justify-center gap-1.5 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Shopier güvencesiyle anında teslim — 7/24 indir</span>
        </p>
      </div>
    </div>
  );
};
