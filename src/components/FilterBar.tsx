import React from 'react';
import { FilterCategory } from '../types';
import { Sparkles, Layers } from 'lucide-react';

interface FilterBarProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  filteredCount?: number;
}

interface FilterItem {
  id: FilterCategory;
  label: string;
  badge?: string;
}

const FILTER_ITEMS: FilterItem[] = [
  { id: 'tumu', label: 'TÜMÜ' },
  { id: '5', label: '5.SINIF', badge: 'Ortaokul' },
  { id: '6', label: '6.SINIF', badge: 'Ortaokul' },
  { id: '7', label: '7.SINIF', badge: 'Ortaokul' },
  { id: '8-lgs', label: '8.SINIF LGS', badge: 'LGS 2026' },
  { id: 'lise', label: 'LİSE', badge: '9-12' },
  { id: 'yks', label: 'YKS', badge: 'TYT-AYT' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  filteredCount
}) => {
  return (
    <nav
      aria-label="Sınıf ve Kategori Filtreleri"
      className="w-full bg-[#FAF9F6] border-y border-[#1A1A1A]/10 py-3 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sol Etiket */}
        <div className="flex items-center gap-2 text-[#1A1A1A]">
          <div className="w-6 h-6 rounded-md bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/70">
            HIZLI FİLTRE:
          </span>
        </div>

        {/* Filtre Butonları: [TÜMÜ] [5.SINIF] [6.SINIF] [7.SINIF] [8.SINIF LGS] [LİSE] [YKS] */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {FILTER_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                id={`filter-btn-${item.id}`}
                onClick={() => onSelectFilter(item.id)}
                className={`group shrink-0 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-md ring-2 ring-[#C9A86A]/60 scale-[1.02]'
                    : 'bg-white text-[#1A1A1A]/80 hover:text-[#1A1A1A] border border-[#1A1A1A]/12 hover:border-[#C9A86A] hover:bg-[#FAF6EE] shadow-2xs'
                }`}
              >
                <span>[{item.label}]</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#C9A86A] text-[#1A1A1A]'
                        : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60 group-hover:bg-[#C9A86A]/20 group-hover:text-[#856526]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <a
            href="/uygulamalar/yks-geri-sayim"
            className="group shrink-0 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 bg-white text-[#1A1A1A]/80 hover:text-[#1A1A1A] border border-[#1A1A1A]/12 hover:border-[#7c3aed] hover:bg-violet-50 shadow-2xs"
          >
            <span>[YKS SAYAÇ]</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold bg-violet-100 text-violet-700">ÖSYM</span>
          </a>
        </div>
      </div>

      {/* Aktif Filtre Bilgilendirme Çubuğu */}
      {activeFilter !== 'tumu' && (
        <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/8 flex items-center justify-between text-xs text-[#856526] bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#C9A86A]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="font-medium">
              <strong className="font-bold text-[#1A1A1A]">
                {FILTER_ITEMS.find((f) => f.id === activeFilter)?.label}
              </strong>{' '}
              seçildi{filteredCount !== undefined ? ` (${filteredCount} kitap gösteriliyor)` : ''}
            </span>
          </div>
          <button
            onClick={() => onSelectFilter('tumu')}
            className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A] underline hover:text-[#856526] font-bold cursor-pointer ml-3"
          >
            Filtreyi Temizle [TÜMÜ]
          </button>
        </div>
      )}
    </nav>
  );
};
