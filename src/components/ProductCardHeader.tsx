import React from 'react';
import { Share2 } from 'lucide-react';

export interface ProductCardHeaderProps {
  category: string;
  onShare: () => void;
  title?: string;
  className?: string;
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  category,
  onShare,
  title,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 mb-3 w-full ${className}`}
    >
      {/* Solda: Kategori Pill (Gri arka plan, küçük uppercase, rounded-full) */}
      <span className="bg-[#F1F0EC] border border-[#E2E0D8] text-[#4A4A4A] text-[7.5px] sm:text-[8px] md:text-[8.5px] font-sans font-semibold px-2 py-0.5 rounded-full uppercase tracking-tight shrink min-w-0 truncate shadow-2xs">
        {category}
      </span>

      {/* Sağda: Paylaş Butonu (İkon + "Paylaş" yazısı, outline gri buton, rounded-full, sağa yaslı) */}
      <button
        type="button"
        onClick={onShare}
        title={title ? `${title} Paylaş` : 'Paylaş'}
        aria-label={title ? `${title} Paylaş` : 'Paylaş'}
        className="border border-[#CCCCCC] hover:border-[#999999] bg-white hover:bg-[#F8F7F4] text-[#4A4A4A] hover:text-[#1A1A1A] px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-sans font-medium inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95 ml-auto"
      >
        <Share2 className="w-3 h-3 text-[#666666] shrink-0" />
        <span className="whitespace-nowrap">Paylaş</span>
      </button>
    </div>
  );
};

export default ProductCardHeader;
