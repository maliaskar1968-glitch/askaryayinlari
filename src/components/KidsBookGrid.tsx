import React from 'react';
import { KIDS_BOOKS_DATA } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, Sparkles, ExternalLink, Heart } from 'lucide-react';

export const KidsBookGrid: React.FC = () => {
  return (
    <div className="my-12 pt-8 border-t border-[#1A1A1A]/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
            <Sparkles className="w-3 h-3 text-[#C9A86A]" />
            <span>ÖZEL KOLEKSİYON • ÇOCUK DÜNYASI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
            Çocuk Kitaplığı
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
          Çocukların hayal dünyasını zenginleştiren, değerler eğitimi ve eğlenceli boyama içeren dijital PDF kitaplar
        </p>
      </div>

      {/* Grid of Children's Books */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Active Book: Sevimli Deniz Altı Kaşifleri */}
        <div className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden">
          {/* Top Catalog Ref & Age Badge */}
          <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#1A1A1A]/50 mb-3">
            <span className="flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-[#C9A86A] fill-[#C9A86A]" />
              KIDS.01
            </span>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/10">
              4-8 YAŞ • MASAL & BOYAMA
            </span>
          </div>

          {/* Book Cover Image - 1:1 Aspect Ratio */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <ImgWithFallback
              src="/images/cocuk.jpg"
              alt="Sevimli Deniz Altı Kaşifleri - Mehmet Ali Askar"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
              PDF
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 flex-1">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
              Sevimli Deniz Altı Kaşifleri
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
              Büyülü Hikayeler ve Yaratıcı Boyama Kitabı
            </p>
          </div>

          {/* Shopier Action Button */}
          <a
            href="https://www.shopier.com/mehmetaliaskar/49854224"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>SHOPIER İLE İNDİR</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        </div>

        {/* Coming Soon Area for Upcoming Kids Books */}
        <div className="lg:col-span-3 rounded-2xl border-2 border-dashed border-[#1A1A1A]/15 bg-[#F8F7F4]/60 p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#C9A86A]/15 text-[#856526] flex items-center justify-center mb-5 border border-[#C9A86A]/30">
            <Sparkles className="w-8 h-8 text-[#C9A86A]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-white text-[#856526] border border-[#C9A86A]/30 mb-3 shadow-xs">
            YAKINDA YENİ ESERLER
          </span>

          <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight max-w-md leading-snug mb-3">
            Yeni Kitaplarımız Sizlerle Buluşmak için Heyecanla Bekliyor
          </h3>

          <p className="text-xs sm:text-sm text-[#1A1A1A]/60 font-sans max-w-lg leading-relaxed mb-6">
            Çocuk dünyası serimizin yeni eğitici masalları, değerler eğitimi hikayeleri ve yaratıcı boyama serileri çok yakında dijital kütüphanemizde yerini alacaktır.
          </p>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest">
            <Heart className="w-3 h-3 text-[#C9A86A] fill-[#C9A86A]" />
            <span>Aşkar Yayınları Çocuk Kitaplığı</span>
          </div>
        </div>
      </div>
    </div>
  );
};
