import React from 'react';
import { BOOKS_DATA } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, ExternalLink } from 'lucide-react';

export const BookGrid: React.FC = () => {
  return (
    <div className="my-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-2">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50 mb-1">
            Koleksiyon / Ortaokul • YKS • Roman
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            Koçluk Kitapları ve Romanlar
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/60 font-sans max-w-xs">
          Shopier güvencesi ile anında teslim dijital PDF kaynaklar
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {BOOKS_DATA.map((book, index) => (
          <div
            key={book.id}
            className={`bg-white border rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:border-[#1A1A1A]/30 hover:shadow-lg ${
              book.isSpecialLink ? 'border-[#1A1A1A] shadow-sm' : 'border-[#1A1A1A]/10'
            }`}
          >
            {/* Top Catalog Ref */}
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#1A1A1A]/40 mb-3">
              <span>REF. 0{index + 1}</span>
              <span className="uppercase text-[#1A1A1A]/60 font-bold">{book.badge}</span>
            </div>

            {/* Book Cover Image - 1:1 Square Artwork */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.02] transition-transform duration-300">
              <ImgWithFallback
                src={book.image}
                alt={`${book.title} PDF Koçluk Kitabı - Mehmet Ali Askar - Aşkar Yayınları`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6 flex-1">
              <h3 className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem]">
                {book.title}
              </h3>
              <p className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
                {book.subtitle}
              </p>
            </div>

            {/* Shopier Action Button */}
            <a
              href={book.shopierUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${book.title} PDF Satın Al ve İndir`}
              className="mt-auto w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>SHOPIER İLE İNDİR</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
