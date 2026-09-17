import React from 'react';
import { Book } from '../types';
import { X, BookOpen, Download, ExternalLink, Eye, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImgWithFallback } from './ImgWithFallback';
import { usePrice } from '../context/PriceContext';

interface DescriptionModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview?: (book: Book) => void;
}

export const DescriptionModal: React.FC<DescriptionModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenPreview
}) => {
  const { getPrice } = usePrice();

  if (!book) return null;

  const bookPrice = getPrice(book.id, book.price, book.originalPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="book-description-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#1A1A1A]/15 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]/10 bg-[#F8F7F4]">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#1A1A1A]/10 bg-white shadow-xs">
                  <ImgWithFallback
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
                      style={{ backgroundColor: `${book.badgeColor}15`, color: book.badgeColor }}
                    >
                      {book.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3 h-3" />
                      Dijital Ürün - Anında Teslim
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-base sm:text-lg text-[#1A1A1A] truncate mt-1">
                    {book.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body with Clean Readable Typography */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#1A1A1A] font-sans">
              {/* Subtitle Banner */}
              <div className="bg-[#F8F7F4] border-l-4 border-[#C9A86A] p-3.5 rounded-r-xl">
                <p className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] italic">
                  "{book.subtitle}"
                </p>
              </div>

              {/* Main Description */}
              {book.description ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#856526] font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#C9A86A]" />
                    Kitap Tanıtımı & Açıklama
                  </h4>
                  <div className="bg-[#FAF9F6] border border-[#1A1A1A]/8 rounded-xl p-4 sm:p-5 text-sm sm:text-[15px] leading-relaxed text-[#2D2D2D] whitespace-pre-line font-normal">
                    {book.description}
                  </div>
                </div>
              ) : null}

              {/* Content Details / Sections */}
              {book.contentDetails ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Kitap İçeriği & Bölümler
                  </h4>
                  <div className="bg-emerald-50/40 border border-emerald-600/15 rounded-xl p-4 sm:p-5 text-sm sm:text-[14px] leading-relaxed text-[#1F2937] whitespace-pre-line font-medium">
                    {book.contentDetails}
                  </div>
                </div>
              ) : null}

              {/* Digital Delivery Advantage Box */}
              <div className="bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dijital PDF Formatında Anında Teslimat
                  </div>
                  <p className="text-[#1A1A1A]/70 text-[11px] sm:text-xs">
                    Kargo bekleme derdi yok! Satın alım sonrasında PDF dosyanız hemen cihazınıza indirilir.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {bookPrice.originalPrice && (
                    <span className="text-xs text-[#1A1A1A]/40 line-through mr-2">
                      {bookPrice.originalPrice}
                    </span>
                  )}
                  <span className="text-lg font-serif font-black text-[#1A1A1A]">
                    {bookPrice.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3.5 border-t border-[#1A1A1A]/10 bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#1A1A1A]/20 hover:bg-white text-xs font-mono uppercase tracking-wider font-semibold text-[#1A1A1A]/80 transition-colors cursor-pointer text-center"
              >
                Kapat
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {book.previewUrl && onOpenPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPreview(book);
                    }}
                    className="flex-1 sm:flex-initial bg-white hover:bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] py-2.5 px-4 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-[#C9A86A]" />
                    <span>Önizlemeyi Aç</span>
                  </button>
                )}

                <a
                  href={book.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#C9A86A]" />
                  <span>Shopier ile İndir</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
