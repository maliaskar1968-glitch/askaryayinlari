import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { X, BookOpen, Download, ExternalLink, Maximize2, Minimize2, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImgWithFallback } from './ImgWithFallback';
import { usePrice } from '../context/PriceContext';

interface PreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

function getGoogleDriveEmbedUrl(url?: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ book, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { getPrice } = usePrice();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [book?.id, isOpen]);

  if (!book) return null;

  const embedUrl = getGoogleDriveEmbedUrl(book.previewUrl);
  const bookPrice = getPrice(book.id, book.price, book.originalPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={`relative bg-white shadow-2xl border border-[#1A1A1A]/10 overflow-hidden z-10 flex flex-col font-sans transition-all duration-300 ${
              isFullscreen
                ? 'w-full h-full rounded-none'
                : 'w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#1A1A1A]/10 bg-[#F8F7F4] shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#1A1A1A]/10 bg-white shadow-2xs hidden sm:block">
                  <ImgWithFallback
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase shrink-0"
                      style={{ backgroundColor: `${book.badgeColor}15`, color: book.badgeColor }}
                    >
                      {book.badge}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold uppercase tracking-wider hidden md:inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Uygulama İçi Önizleme
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] truncate mt-0.5">
                    {book.title}
                  </h3>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg hover:bg-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  title={isFullscreen ? 'Küçült' : 'Tam Ekran'}
                  aria-label={isFullscreen ? 'Küçült' : 'Tam Ekran'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-[#1A1A1A]/70 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Önizlemeyi Kapat"
                  aria-label="Önizlemeyi Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Content Area */}
            <div className="relative flex-1 w-full bg-[#E5E3DF] overflow-hidden">
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8F7F4] z-20 gap-3">
                  <Loader2 className="w-8 h-8 text-[#C9A86A] animate-spin" />
                  <div className="text-center px-4">
                    <p className="text-xs font-mono font-medium text-[#1A1A1A]/80 uppercase tracking-wider">
                      Önizleme Sayfaları Yükleniyor...
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/50 font-sans mt-0.5">
                      {book.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Embedded Google Drive PDF Iframe */}
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0 bg-white"
                  allow="autoplay"
                  title={`${book.title} Kitap Önizleme`}
                  onLoad={() => setIsLoading(false)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
                  <div className="w-12 h-12 rounded-full bg-[#C9A86A]/15 text-[#C9A86A] flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#1A1A1A] mb-1">
                    Önizleme Bağlantısı
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/60 max-w-sm">
                    Bu kitabın önizlemesi hazırlanmaktadır.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Quick Purchase Bar */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-[#1A1A1A]/10 bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-sans font-medium text-[11px] sm:text-xs">
                    Shopier güvencesi ile anında teslim • PDF
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  {bookPrice.originalPrice && (
                    <span className="text-xs text-[#1A1A1A]/40 line-through font-sans">
                      {bookPrice.originalPrice}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-serif font-black text-[#1A1A1A]">
                    {bookPrice.price}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full border border-[#1A1A1A]/20 hover:bg-white text-xs font-mono uppercase tracking-wider font-semibold text-[#1A1A1A]/80 transition-colors cursor-pointer text-center"
                >
                  Kapat
                </button>
                <a
                  href={book.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>SHOPIER İLE İNDİR</span>
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
