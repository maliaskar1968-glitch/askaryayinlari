import React, { lazy, Suspense, useEffect, useState } from 'react';
import { TOOLS_DATA, ToolDefinition, getToolBySlug } from '../data/toolsData';
import { updatePageSeo } from '../utils/seo';
import { DersCalismaKarti } from './DersCalismaKarti';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Search
} from 'lucide-react';

const ToolDetailPage = lazy(() => import('./ToolDetailPage').then(({ ToolDetailPage }) => ({ default: ToolDetailPage })));

interface ToolsPageProps {
  currentSlug?: string | null;
  onSelectSlug: (slug: string | null) => void;
  onSelectGuide: (slug: string | null) => void;
  onNavigateHome: () => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({
  currentSlug,
  onSelectSlug,
  onSelectGuide,
  onNavigateHome
}) => {
  const [filterCategory, setFilterCategory] = useState<'HEPSİ' | 'BURSLULUK' | 'LGS' | 'YKS' | 'ARAÇLAR' | 'ÇOCUK'>('HEPSİ');
  const [searchQuery, setSearchQuery] = useState('');
  const [isYksDateAnnounced, setIsYksDateAnnounced] = useState(false);

  // If a specific tool slug is active, render its dedicated SEO page
  const activeTool: ToolDefinition | undefined = currentSlug ? getToolBySlug(currentSlug) : undefined;

  // Sync SEO metadata for the main tools catalog page when no slug is selected
  useEffect(() => {
    if (!activeTool) {
      updatePageSeo({
        title: 'Uygulamalar ve Eğitim Araçları | LGS & YKS Hesaplama - Aşkar Yayınları',
        description: '2026 LGS ve YKS TYT-AYT net ve puan hesaplama robotları, Pomodoro ders çalışma sayacı, kelime analiz aracı, APA 7 kaynakça ve çocuk uygulaması.',
        url: 'https://www.askaryayinlari.com.tr/uygulamalar',
        image: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
        type: 'website'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTool]);

  useEffect(() => {
    fetch('/api/exam-calendar')
      .then((response) => response.json())
      .then((data: { yks?: string | null }) => setIsYksDateAnnounced(Boolean(data.yks)))
      .catch(() => setIsYksDateAnnounced(false));
  }, []);

  if (activeTool) {
    return (
      <Suspense fallback={<div className="py-12 text-center text-sm text-[#1A1A1A]/60">Araç yükleniyor...</div>}>
        <ToolDetailPage
          tool={activeTool}
          onNavigateHome={onNavigateHome}
          onNavigateTools={() => onSelectSlug(null)}
          onSelectToolSlug={(slug) => onSelectSlug(slug)}
        />
      </Suspense>
    );
  }

  // Filter tools by category and search
  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCat = filterCategory === 'HEPSİ' || tool.category === filterCategory;
    const isVisibleInCurrentCategory = tool.id !== 'yks-sayac' || filterCategory === 'YKS' || filterCategory === 'HEPSİ';
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && isVisibleInCurrentCategory;
  }).sort((first, second) => {
    if (first.id === 'yks-sayac') return -1;
    if (second.id === 'yks-sayac') return 1;
    return 0;
  });

  return (
    <div className="my-8 space-y-8 animate-fadeIn text-[#1A1A1A]">
      {/* 1. Page Header (SEO H1) */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
              <span>DİJİTAL SİSTEMLER • AŞKAR YAYINLARI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Uygulamalar & Eğitim Araçları
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans max-w-md">
            LGS ve YKS net-puan hesaplama motorları, Pomodoro odaklanma zamanlayıcısı, metin analiz araçları ve interaktif çocuk uygulamaları. Tüm araçlarımız tamamen ücretsizdir.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 py-1 sm:flex-1">
            {(['HEPSİ', 'BURSLULUK', 'LGS', 'YKS', 'ARAÇLAR', 'ÇOCUK'] as const).map((cat) => {
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-2xs ring-1 ring-[#C9A86A]/60'
                      : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-[#FAF6EE] border border-[#1A1A1A]/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full min-w-0 sm:w-56 sm:shrink-0">
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Uygulama ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-hidden focus:border-[#C9A86A]"
            />
          </div>
        </div>
      </div>

      {/* 2. Grid of Application Cards (Beyaz Kartlar, #FAF9F6 Zemin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredTools.map((tool) => (
          <article
            key={tool.id}
            id={`tool-card-${tool.slug}`}
            className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Üst Kısım: Rozet & Kategori & İkon */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-2xs"
                  style={{ backgroundColor: tool.badgeColor }}
                >
                  {tool.badge}
                </span>

              </div>

              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#1A1A1A]/10 mb-4">
                <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* Başlık ve Açıklama */}
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A] leading-snug group-hover:text-[#856526] transition-colors mb-2">
                {tool.name}
              </h2>

              <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed line-clamp-3 mb-4">
                {tool.tagline}
              </p>

              {/* Öne Çıkan Özellikler */}
              <div className="space-y-1.5 pt-3 border-t border-[#1A1A1A]/8 mb-5">
                {tool.highlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#1A1A1A]/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt Kısım: URL Etiketi ve Aç Butonu */}
            <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-col gap-2 mt-auto">
              <span className="text-[10px] font-mono text-[#1A1A1A]/40 truncate">
                /uygulamalar/{tool.slug}
              </span>

              <button
                onClick={() => onSelectSlug(tool.slug)}
                disabled={tool.id === 'yks-sayac' && !isYksDateAnnounced}
                className={`w-full px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm border ${tool.id === 'yks-sayac' && !isYksDateAnnounced ? 'bg-stone-200 text-stone-500 border-stone-200 cursor-not-allowed' : 'bg-[#1A1A1A] hover:bg-black text-white hover:scale-[1.02] active:scale-95 group-hover:shadow-md cursor-pointer border-[#1A1A1A]'}`}
              >
                <span>{tool.id === 'yks-sayac' && !isYksDateAnnounced ? 'TARİH BEKLENİYOR' : 'UYGULAMAYI AÇ'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${tool.id === 'yks-sayac' && !isYksDateAnnounced ? 'text-stone-400' : 'text-[#C9A86A] group-hover:translate-x-1 transition-transform'}`} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-10 text-center space-y-3">
          <p className="text-sm text-[#1A1A1A]/60">
            Aramanızla eşleşen uygulama bulunamadı.
          </p>
          <button
            onClick={() => {
              setFilterCategory('HEPSİ');
              setSearchQuery('');
            }}
            className="text-xs font-mono font-bold text-[#856526] underline cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      <DersCalismaKarti level="ortaokul" title="Ortaokul Ders Çalışma Kartları" onSelectGuide={onSelectGuide} />
      <DersCalismaKarti level="lise" title="Lise Dersleri Nasıl Çalışılır?" onSelectGuide={onSelectGuide} />
      <DersCalismaKarti level="tyt-ayt" title="TYT-AYT Taktikleri" onSelectGuide={onSelectGuide} />
      <DersCalismaKarti level="mezun" title="Mezunlar İçin" onSelectGuide={onSelectGuide} />
      <div className="flex justify-end">
        <button type="button" onClick={() => onSelectGuide(null)} className="inline-flex items-center gap-2 text-xs font-bold text-[#856526] hover:text-[#1A1A1A]">
          Tüm çalışma rehberleri <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
