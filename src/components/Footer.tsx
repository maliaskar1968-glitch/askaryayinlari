import React, { useState, useEffect } from 'react';
import { MAIN_SHOPIER_URL } from '../data/books';
import { ShoppingBag, ShieldCheck, Users, Tag, Image as ImageIcon } from 'lucide-react';
import { ImageUploaderModal } from './ImageUploaderModal';
import { PriceEditorModal } from './PriceEditorModal';
import { usePrice } from '../context/PriceContext';

export const Footer: React.FC = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const { isPriceModalOpen, setPriceModalOpen } = usePrice();
  const [totalVisitors, setTotalVisitors] = useState<number>(5420);

  useEffect(() => {
    const BASE_COUNT = 5420;

    // 1. Retrieve or initialize local visitor cache (zero network calls)
    try {
      const storedTotal = localStorage.getItem('askar_total_visitors_cache');
      let currentTotal = BASE_COUNT;
      if (storedTotal) {
        const parsed = parseInt(storedTotal, 10);
        if (!isNaN(parsed) && parsed >= BASE_COUNT) {
          currentTotal = parsed;
        }
      }

      const hasVisited = sessionStorage.getItem('askar_session_visit_counted');
      if (!hasVisited) {
        sessionStorage.setItem('askar_session_visit_counted', 'true');
        currentTotal += 1;
        localStorage.setItem('askar_total_visitors_cache', currentTotal.toString());
      }

      setTotalVisitors(currentTotal);
    } catch {
      // Fallback
    }

    // Keyboard shortcut for image uploader
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setUploaderOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <footer className="text-center py-10 px-4 bg-[#FFFBF5] border-t border-neutral-200 mt-12 space-y-4">
        <div>
          <a
            href={MAIN_SHOPIER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C9A86A] hover:bg-amber-600 text-neutral-950 font-bold px-6 py-3 rounded-full text-xs tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>MAĞAZAMIZI ZİYARET ET</span>
          </a>
        </div>

        <div className="flex justify-center my-2">
          <div className="w-11 h-11 bg-neutral-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
            S
          </div>
        </div>

        <div className="text-xs font-bold text-neutral-700 tracking-wide">
          www.askaryayinlari.com.tr
        </div>

        <div className="text-[11px] text-neutral-500 max-w-md mx-auto leading-relaxed">
          © Aşkar Yayınları. Tüm hakları saklıdır. <br />
          <span className="inline-flex items-center gap-1 font-semibold text-neutral-700 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Shopier Güvenli Ödeme System • shopier.com/mehmetaliaskar
          </span>
        </div>

        {/* Visitor Counter - Clean & Zero Network Overhead */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 border border-[#C9A86A]/40 rounded-full shadow-2xs text-[11px] font-medium text-neutral-700">
            <Users className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="text-neutral-500">Toplam Ziyaretçi:</span>
            <span className="font-bold font-mono text-neutral-900">
              {totalVisitors.toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Discreet Admin Management Links */}
          <div className="flex items-center gap-3 text-[10px] text-neutral-400 pt-1 font-sans">
            <button
              type="button"
              onClick={() => setPriceModalOpen(true)}
              className="hover:text-[#856526] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              title="Kitap Fiyatlarını Düzenle (Kısayol: Ctrl+Shift+P)"
            >
              <Tag className="w-3 h-3 text-[#C9A86A]" />
              <span>Fiyatları Düzenle</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setUploaderOpen(true)}
              className="hover:text-neutral-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              title="Kapak Görsellerini Yönet (Kısayol: Ctrl+Shift+U)"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Kapak Yükleyici</span>
            </button>
          </div>
        </div>
      </footer>

      <ImageUploaderModal
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
      />

      <PriceEditorModal
        isOpen={isPriceModalOpen}
        onClose={() => setPriceModalOpen(false)}
      />
    </>
  );
};
