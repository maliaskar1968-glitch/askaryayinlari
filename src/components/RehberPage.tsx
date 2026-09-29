import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import { BOOKS_DATA } from '../data/books';
import { getStudyGuideBySlug, GuideLevel, SEO_GUIDES, STUDY_GUIDES, StudyGuide } from '../data/studyGuideRegistry';
import { StudyGuideCard } from './DersCalismaKarti';
import { PreviewModal } from './PreviewModal';
import { ImgWithFallback } from './ImgWithFallback';
import { usePrice } from '../context/PriceContext';
import { Book } from '../types';
import { updatePageSeo } from '../utils/seo';

interface RehberPageProps {
  slug: string | null;
  onSelectGuide: (slug: string | null) => void;
  onNavigateHome: () => void;
}

type GuideFilter = 'hepsi' | 'ortaokul' | 'lgs' | 'lise' | 'tyt' | 'ayt' | 'mezun';

const filters: { id: GuideFilter; label: string }[] = [
  { id: 'hepsi', label: 'Tümü' },
  { id: 'ortaokul', label: 'Ortaokul' },
  { id: 'lgs', label: 'LGS' },
  { id: 'lise', label: 'Lise' },
  { id: 'tyt', label: 'TYT' },
  { id: 'ayt', label: 'AYT' },
  { id: 'mezun', label: 'Mezun' }
];

const levelNames: Record<GuideLevel, string> = {
  ortaokul: 'Ortaokul',
  lgs: 'LGS',
  lise: 'Lise',
  tyt: 'TYT',
  ayt: 'AYT',
  mezun: 'Mezun'
};

const metaDescriptionFor = (guide: StudyGuide): string => {
  const description = `${guide.ad} nasıl çalışılır? TYT, AYT ve 2026 taktikleriyle konu tekrarını düzenle, soru çözümünü geliştir ve haftalık çalışma programını oluştur.`;
  return description.length > 155 ? `${description.slice(0, 152).trimEnd()}...` : description;
};

const guideSchema = (guide: StudyGuide, description: string) => {
  const pageUrl = `https://www.askaryayinlari.com.tr/rehber/${guide.slug}`;
  const questions = [
    { name: `${guide.ad} nasıl çalışılır?`, text: guide.uzun.basari },
    { name: `${guide.ad} çalışırken nelere dikkat edilmeli?`, text: guide.uzun.dikkat },
    { name: `${guide.ad} için haftalık program nasıl olmalı?`, text: guide.uzun.haftalik }
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: `${guide.ad} Nasıl Çalışılır?`,
        description,
        image: `https://www.askaryayinlari.com.tr${guide.resim}`,
        step: [
          ...guide.kisa.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
          { '@type': 'HowToStep', position: 4, name: 'Haftalık program', text: guide.uzun.haftalik }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: questions.map((item) => ({
          '@type': 'Question',
          name: item.name,
          acceptedAnswer: { '@type': 'Answer', text: item.text }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://www.askaryayinlari.com.tr/' },
          { '@type': 'ListItem', position: 2, name: 'Rehber', item: 'https://www.askaryayinlari.com.tr/rehber' },
          { '@type': 'ListItem', position: 3, name: guide.ad, item: pageUrl }
        ]
      }
    ]
  };
};

export const RehberPage: React.FC<RehberPageProps> = ({ slug, onSelectGuide, onNavigateHome }) => {
  const [activeFilter, setActiveFilter] = useState<GuideFilter>('hepsi');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const { getPrice } = usePrice();
  const guide = slug ? getStudyGuideBySlug(slug) : undefined;

  useEffect(() => {
    if (guide) {
      const title = `${guide.ad} Nasıl Çalışılır? 2026 TYT AYT Başarı Taktikleri | Aşkar Yayınları`;
      const description = metaDescriptionFor(guide);
      updatePageSeo({
        title,
        description,
        url: `https://www.askaryayinlari.com.tr/rehber/${guide.slug}`,
        image: `https://www.askaryayinlari.com.tr${guide.resim}`,
        type: 'article',
        schema: guideSchema(guide, description)
      });
    } else {
      updatePageSeo({
        title: 'Ders Çalışma Rehberleri | Ortaokul, LGS, Lise, TYT, AYT ve Mezun 2026',
        description: 'Ortaokul, LGS, lise dersleri, TYT, AYT ve mezun YKS hazırlığı için 2026 çalışma rehberleri, sınav taktikleri ve haftalık planlar.',
        url: 'https://www.askaryayinlari.com.tr/rehber',
        type: 'website'
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [guide]);

  if (slug && !guide) {
    return (
      <section className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-serif font-black text-[#1A1A1A]">Rehber bulunamadı</h1>
        <button type="button" onClick={() => onSelectGuide(null)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#856526]">
          <ArrowLeft className="h-4 w-4" /> Tüm rehberlere dön
        </button>
      </section>
    );
  }

  if (!guide) {
    const visibleGuides = activeFilter === 'hepsi'
      ? SEO_GUIDES
      : SEO_GUIDES.filter((item) => item.seviye === activeFilter);

    return (
      <main className="space-y-8 py-4">
        <nav aria-label="Sayfa konumu" className="flex items-center gap-2 text-xs text-[#1A1A1A]/55">
          <a href="/" onClick={(event) => { event.preventDefault(); onNavigateHome(); }} className="hover:text-[#856526]">Ana Sayfa</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#1A1A1A]">Rehber</span>
        </nav>

        <header className="border-b border-[#1A1A1A]/10 pb-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#856526]">AŞKAR YAYINLARI • ÇALIŞMA REHBERLERİ</span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">Ders Çalışma Rehberleri</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#1A1A1A]/70">Ortaokul, LGS, lise, TYT, AYT ve mezun hazırlığı için 2026 çalışma taktikleri ve haftalık plan önerileri.</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Rehber seviyesi">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`shrink-0 rounded-lg border px-3.5 py-2 text-xs font-bold transition-colors ${activeFilter === filter.id ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#1A1A1A]/15 bg-white text-[#1A1A1A]/70 hover:border-[#C9A86A]'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleGuides.map((item) => <StudyGuideCard key={item.id} guide={item} onSelectGuide={(nextSlug) => onSelectGuide(nextSlug)} />)}
        </div>
        <p className="text-xs text-[#1A1A1A]/50">{visibleGuides.length} çalışma rehberi</p>
      </main>
    );
  }

  const relatedBookId = guide.seviye === 'ortaokul'
    ? 'k5'
    : guide.seviye === 'lgs'
      ? 'k8'
      : guide.seviye === 'lise'
        ? 'k9'
        : 'k_yks';
  const relatedBook = BOOKS_DATA.find((book) => book.id === relatedBookId);
  const relatedBookPrice = relatedBook ? getPrice(relatedBook.id, relatedBook.price, relatedBook.originalPrice) : null;
  const title = `${guide.ad} Nasıl Çalışılır?`;
  const sections = [
    { id: 'basari', title: 'Başarı Yolu', body: guide.uzun.basari },
    { id: 'dikkat', title: 'Dikkat Edilmesi Gerekenler', body: guide.uzun.dikkat },
    { id: 'hatalar', title: 'Sık Yapılan Hatalar', body: guide.uzun.hatalar },
    { id: 'haftalik', title: 'Haftalık Program', body: guide.uzun.haftalik }
  ];

  return (
    <article className="mx-auto max-w-5xl space-y-8 py-4">
      <nav aria-label="Sayfa konumu" className="flex flex-wrap items-center gap-2 text-xs text-[#1A1A1A]/55">
        <a href="/" onClick={(event) => { event.preventDefault(); onNavigateHome(); }} className="hover:text-[#856526]">Ana Sayfa</a>
        <ChevronRight className="h-3.5 w-3.5" />
        <a href="/rehber" onClick={(event) => { event.preventDefault(); onSelectGuide(null); }} className="hover:text-[#856526]">Rehber</a>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-[#1A1A1A]">{guide.ad}</span>
      </nav>

      <header className="grid gap-6 border-b border-[#1A1A1A]/10 pb-7 md:grid-cols-[minmax(240px,360px)_1fr] md:items-center">
        <div className="aspect-square w-full overflow-hidden rounded-xl shadow-sm">
          <img src={guide.resim} alt={`${guide.ad} çalışma rehberi`} className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#856526]">{levelNames[guide.seviye]} • 2026 REHBERİ</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-black leading-tight text-[#1A1A1A]">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/70">{metaDescriptionFor(guide)}</p>
          <ul className="mt-5 space-y-2">
            {guide.kisa.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm leading-6 text-[#1A1A1A]/80">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" /> {tip}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {guide.anahtarKelimeler.slice(0, 5).map((keyword) => <span key={keyword} className="rounded-md bg-[#F0EEE8] px-2 py-1 text-[10px] font-semibold text-[#1A1A1A]/60">{keyword}</span>)}
          </div>
        </div>
      </header>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`guide-${section.id}`} className="scroll-mt-6 border-b border-[#1A1A1A]/8 pb-6">
              <h2 id={`guide-${section.id}`} className="text-xl font-serif font-black text-[#1A1A1A]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/75">{section.body}</p>
            </section>
          ))}
        </div>

        {relatedBook && relatedBookPrice && (
          <aside className="h-fit overflow-hidden rounded-xl border border-[#1A1A1A]/10 bg-white p-3 shadow-sm lg:sticky lg:top-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#856526]">ÖNERİLEN KOÇLUK KİTABI</span>
              <span className="shrink-0 rounded-full bg-[#F6F0E3] px-2 py-1 text-[9px] font-mono font-bold text-[#856526]">{levelNames[guide.seviye]}</span>
            </div>
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#1A1A1A]/10 bg-[#FAF9F6] p-2">
              <ImgWithFallback src={relatedBook.image} alt={relatedBook.title} className="h-full w-full object-contain" />
            </div>
            <div className="px-1 pb-1 pt-3">
              <h2 className="font-serif text-base font-bold leading-snug text-[#1A1A1A]">{relatedBook.title}</h2>
              <p className="mt-1 text-xs italic leading-5 text-[#1A1A1A]/60">{relatedBook.subtitle}</p>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#C9A86A]/35 bg-[#FAF6EE] px-2.5 py-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#856526]">KOÇLUK KİTABI</span>
                <span className="flex items-baseline gap-1.5 text-right">
                  {relatedBookPrice.originalPrice && <span className="text-[10px] text-[#1A1A1A]/40 line-through">{relatedBookPrice.originalPrice}</span>}
                  <span className="text-sm font-serif font-black text-[#1A1A1A]">{relatedBookPrice.price}</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewBook(relatedBook)}
                  className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#1A1A1A]/20 px-2 py-2.5 text-[10px] font-mono font-bold text-[#1A1A1A] transition-colors hover:bg-[#F8F7F4]"
                >
                  <Eye className="h-3.5 w-3.5 text-[#856526]" /> ÖNİZLE
                </button>
                <a
                  href={relatedBook.shopierUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A1A] px-2 py-2.5 text-[10px] font-mono font-bold text-white transition-colors hover:bg-black"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#C9A86A]" /> AL <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </aside>
        )}
      </div>
      <PreviewModal book={previewBook} isOpen={!!previewBook} onClose={() => setPreviewBook(null)} />
    </article>
  );
};
