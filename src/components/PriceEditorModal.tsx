import React, { useState } from 'react';
import { X, Tag, Check, ExternalLink, Save, RefreshCw } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import { BOOKS_DATA, KIDS_BOOKS_DATA } from '../data/books';

interface PriceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceEditorModal: React.FC<PriceEditorModalProps> = ({ isOpen, onClose }) => {
  const { prices, updatePrice, isLoading } = usePrice();
  const allBooks = [...BOOKS_DATA, ...KIDS_BOOKS_DATA];

  const [editMap, setEditMap] = useState<Record<string, { price: string; originalPrice: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, field: 'price' | 'originalPrice', value: string) => {
    const current = editMap[id] || {
      price: prices[id]?.price || '150 ₺',
      originalPrice: prices[id]?.originalPrice || '250 ₺'
    };
    setEditMap({
      ...editMap,
      [id]: {
        ...current,
        [field]: value
      }
    });
  };

  const handleSaveItem = async (id: string) => {
    const item = editMap[id];
    if (!item) return;
    const ok = await updatePrice(id, item.price, item.originalPrice);
    if (ok) {
      setSaveSuccess(id);
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A86A]/20 flex items-center justify-center text-[#856526]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Kitap Fiyat Yönetim Paneli
              </h3>
              <p className="text-xs text-neutral-500">
                Shopier bağlantılı kitapların güncel satış ve indirimli fiyatlarını düzenleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Box */}
        <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
          <span>
            💡 Fiyatı güncelleyip <strong>Kaydet</strong> butonuna bastığınızda değişiklik anında sitede ve Shopier kartlarında görünür.
          </span>
          <span className="text-[10px] font-mono text-amber-700 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
            Kısayol: Ctrl+Shift+P
          </span>
        </div>

        {/* List of Books */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100 space-y-4">
          {allBooks.map((book) => {
            const currentPrice = editMap[book.id]?.price !== undefined ? editMap[book.id].price : (prices[book.id]?.price || book.price || '150 ₺');
            const currentOriginalPrice = editMap[book.id]?.originalPrice !== undefined ? editMap[book.id].originalPrice : (prices[book.id]?.originalPrice || book.originalPrice || '250 ₺');
            const isSaved = saveSuccess === book.id;

            return (
              <div key={book.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        {book.badge}
                      </span>
                      <a
                        href={book.shopierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-neutral-400 hover:text-[#C9A86A] flex items-center gap-0.5"
                        title="Shopier Sayfasını Aç"
                      >
                        Shopier Linki <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="font-serif font-bold text-sm text-neutral-900 truncate">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      {book.subtitle}
                    </div>
                  </div>
                </div>

                {/* Price Inputs */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">İndirimli Fiyat</label>
                    <input
                      type="text"
                      value={currentPrice}
                      onChange={(e) => handlePriceChange(book.id, 'price', e.target.value)}
                      className="w-24 px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A]"
                      placeholder="175 ₺"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Liste Fiyatı</label>
                    <input
                      type="text"
                      value={currentOriginalPrice}
                      onChange={(e) => handlePriceChange(book.id, 'originalPrice', e.target.value)}
                      className="w-24 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-400 line-through focus:outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A]"
                      placeholder="300 ₺"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSaveItem(book.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                        isSaved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1A1A1A] hover:bg-black text-white'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Kaydedildi</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#C9A86A]" />
                          <span>Kaydet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs text-neutral-500">
          <span>Toplam {allBooks.length} kitap listeleniyor</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-full font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
