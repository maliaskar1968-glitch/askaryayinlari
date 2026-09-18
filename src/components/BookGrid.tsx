import React, { useState } from 'react';
import { BOOKS_DATA } from '../data/books';
import { Book, ShareItem } from '../types';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, ExternalLink, Eye, BookOpen } from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { DescriptionModal } from './DescriptionModal';
import { ShareModal } from './ShareModal';
import { ProductCardHeader } from './ProductCardHeader';
import { usePrice } from '../context/PriceContext';

export const BookGrid: React.FC = () => {
  const [selectedPreviewBook, setSelectedPreviewBook] = useState<Book | null>(null);
  const [selectedDescBook, setSelectedDescBook] = useState<Book | null>(null);
  const [selectedShareItem, setSelectedShareItem] = useState<ShareItem | null>(null);
  const { getPrice } = usePrice();

  const handleOpenPreview = (book: Book) => {
    setSelectedPreviewBook(book);
  };

  const handleOpenDesc = (book: Book) => {
    setSelectedDescBook(book);
  };

  return (
    <section id="kitaplarimiz" className="py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
            <span>DİJİTAL KÜTÜPHANE • AŞKAR YAYINLARI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            Dijital Kitaplarımız
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
          Öğrenci koçluğu, sınav hazırlık ve edebiyat eserleri. Satın alımdan sonra anında PDF olarak cebinizde.
        </p>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
        {BOOKS_DATA.map((book) => {
          const bookPrice = getPrice(book.id, book.price, book.originalPrice);

          return (
            <article
              key={book.id}
              id={`book-card-${book.id}`}
              className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
            >
              {/* Uniform Product Card Header */}
              <ProductCardHeader
                category={book.badge}
                title={book.title}
                onShare={() =>
                  setSelectedShareItem({
                    title: book.title,
                    subtitle: book.subtitle,
                    image: book.image,
                    shopierUrl: book.shopierUrl,
                    badge: book.badge
                  })
                }
              />

              {/* Cover Image Container */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex items-center justify-center">
                <ImgWithFallback
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-contain"
                />

                {/* PDF Format Tag */}
                <div className="absolute bottom-2.5 right-2.5 bg-[#1A1A1A]/80 text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                  PDF E-KİTAP
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-4 flex-1">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem]">
                  {book.title}
                </h3>
                <p className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1 leading-relaxed line-clamp-2">
                  {book.subtitle}
                </p>
              </div>

              {/* Price & Format Information (Alt Kısım) */}
              <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3">
                {/* Alt Kısım: Format ve Sayfa Sayısı */}
                <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#C9A86A]/40 mb-2.5 shadow-2xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0"></span>
                    <span className="truncate">{book.altBaslik || `${book.format || 'A5 Boyut'}, ${book.pageCount} Sayfa`}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-sans font-semibold shrink-0">
                    Kargo Yok
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                    DİJİTAL PDF
                  </span>
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
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-2 mt-auto">
                {/* 1. BUTTON ABOVE PREVIEW: Description Button ("Kitap Açıklaması") */}
                <button
                  type="button"
                  id={`btn-desc-${book.id}`}
                  onClick={() => handleOpenDesc(book)}
                  className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[11px] font-sans font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#856526]" />
                  <span>Kitap Açıklaması & İçerik</span>
                </button>

                {/* 2. BUTTON: In-App Preview Button ("Önizleme") */}
                <button
                  type="button"
                  id={`btn-preview-${book.id}`}
                  onClick={() => handleOpenPreview(book)}
                  className="w-full bg-white hover:bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>UYGULAMA İÇİ ÖNİZLEME</span>
                </button>

                {/* 3. BUTTON: Direct Shopier Purchase */}
                <a
                  href={book.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`btn-shopier-${book.id}`}
                  title={`${book.title} Satın Al ve İndir`}
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

      {/* In-App Preview Modal (Opens Google Drive PDF internally) */}
      <PreviewModal
        book={selectedPreviewBook}
        isOpen={!!selectedPreviewBook}
        onClose={() => setSelectedPreviewBook(null)}
      />

      {/* Description Modal (Shows clean, readable description & contents) */}
      <DescriptionModal
        book={selectedDescBook}
        isOpen={!!selectedDescBook}
        onClose={() => setSelectedDescBook(null)}
        onOpenPreview={handleOpenPreview}
      />

      {/* Share Modal */}
      <ShareModal
        item={selectedShareItem}
        isOpen={!!selectedShareItem}
        onClose={() => setSelectedShareItem(null)}
      />
    </section>
  );
};

export default BookGrid;
