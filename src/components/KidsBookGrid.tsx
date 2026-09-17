import React, { useState } from 'react';
import { KIDS_BOOKS_DATA } from '../data/books';
import { Book, ShareItem } from '../types';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, Sparkles, ExternalLink, Share2, Eye, ShieldCheck, BookOpen } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { PreviewModal } from './PreviewModal';
import { DescriptionModal } from './DescriptionModal';
import { usePrice } from '../context/PriceContext';

export const KidsBookGrid: React.FC = () => {
  const [selectedShareItem, setSelectedShareItem] = useState<ShareItem | null>(null);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [descBook, setDescBook] = useState<Book | null>(null);
  const { getPrice } = usePrice();

  const handleOpenPreview = (book: Book) => {
    setPreviewBook(book);
  };

  return (
    <div id="cocuk-kitapligi" className="my-12 pt-8 border-t border-[#1A1A1A]/10">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {KIDS_BOOKS_DATA.map((book) => {
          const bookPrice = getPrice(book.id, book.price, book.originalPrice);

          return (
            <article
              key={book.id}
              id={`kids-book-${book.id}`}
              itemScope
              itemType="https://schema.org/Book"
              className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
            >
              <meta itemProp="bookFormat" content="https://schema.org/EBook" />
              <meta itemProp="inLanguage" content="tr" />
              <div itemProp="author" itemScope itemType="https://schema.org/Person" className="hidden">
                <meta itemProp="name" content="Mehmet Ali Askar" />
              </div>
              <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
                <meta itemProp="name" content="Aşkar Yayınları" />
              </div>

              {/* Top Row: Age Badge on the Left, Share Button on the Right */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: `${book.badgeColor}15`,
                    color: book.badgeColor,
                    border: `1px solid ${book.badgeColor}30`
                  }}
                >
                  {book.badge}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedShareItem({
                      title: book.title,
                      subtitle: book.subtitle,
                      image: book.image,
                      shopierUrl: book.shopierUrl,
                      badge: book.badge
                    })
                  }
                  title={`${book.title} Paylaş`}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A1A1A]/5 hover:bg-[#C9A86A]/20 text-[#1A1A1A]/70 hover:text-[#856526] transition-colors cursor-pointer text-[9px] font-sans font-medium"
                >
                  <Share2 className="w-3 h-3 text-[#C9A86A]" />
                  <span className="hidden sm:inline">Paylaş</span>
                </button>
              </div>

              {/* Book Cover Image Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
                <ImgWithFallback
                  src={book.image}
                  alt={`${book.title} - Mehmet Ali Aşkar - Aşkar Yayınları`}
                  className="w-full h-full object-cover"
                  itemProp="image"
                />

                {/* Prominent Green Digital Delivery Badge - Top Right */}
                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-emerald-400 z-10">
                  <ShieldCheck className="w-2.5 h-2.5 text-white shrink-0" />
                  <span>Dijital Ürün - Anında Teslim</span>
                </div>

                <div className="absolute bottom-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                  PDF E-KİTAP
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-4 flex-1">
                <h3 itemProp="name" className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
                  {book.title}
                </h3>
                <p itemProp="description" className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed line-clamp-2">
                  {book.subtitle}
                </p>
              </div>

              {/* Price & Format */}
              <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 flex items-baseline justify-between mt-auto mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50">
                    DİJİTAL PDF
                  </span>
                  <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                    Anında İndirme
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 text-right">
                  {bookPrice.originalPrice && (
                    <span className="text-xs text-[#1A1A1A]/40 line-through font-sans">
                      {bookPrice.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-serif font-black text-[#1A1A1A] tracking-tight">
                    {bookPrice.price}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-[#F8F7F4] border border-[#1A1A1A]/8 rounded-xl p-2.5 mb-3 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-[#1A1A1A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Shopier güvencesi ile anında teslim</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto">
                {/* 1. Description Button Above Preview */}
                <button
                  type="button"
                  id={`btn-kids-desc-${book.id}`}
                  onClick={() => setDescBook(book)}
                  className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2 px-3 rounded-full text-[10px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#856526]" />
                  <span>Kitap Açıklaması & İçerik</span>
                </button>

                {/* 2. In-App Preview */}
                <button
                  type="button"
                  id={`btn-kids-prev-${book.id}`}
                  onClick={() => handleOpenPreview(book)}
                  className="w-full bg-white hover:bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>ÖNİZLEME</span>
                </button>

                {/* 3. Shopier Download */}
                <a
                  href={book.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`btn-kids-shopier-${book.id}`}
                  title={`${book.title} PDF Çocuk Kitabı Satın Al ve İndir`}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>SHOPIER İLE İNDİR</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Description Modal */}
      <DescriptionModal
        book={descBook}
        isOpen={!!descBook}
        onClose={() => setDescBook(null)}
        onOpenPreview={handleOpenPreview}
      />

      {/* Share Modal */}
      <ShareModal
        item={selectedShareItem}
        isOpen={!!selectedShareItem}
        onClose={() => setSelectedShareItem(null)}
      />

      {/* Book Preview Modal */}
      <PreviewModal
        book={previewBook}
        isOpen={!!previewBook}
        onClose={() => setPreviewBook(null)}
      />
    </div>
  );
};
