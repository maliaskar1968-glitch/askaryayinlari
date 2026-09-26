import React, { useEffect, useState } from 'react';
import { ToolDefinition, TOOLS_DATA } from '../data/toolsData';
import { BOOKS_DATA, KIDS_BOOKS_DATA } from '../data/books';
import { Book } from '../types';
import { updatePageSeo } from '../utils/seo';
import { LgsCalculator } from './tools/LgsCalculator';
import { TytCalculator } from './tools/TytCalculator';
import { AytCalculator } from './tools/AytCalculator';
import { WordCounter } from './tools/WordCounter';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { ApaGenerator } from './tools/ApaGenerator';
import { KidsAppCard } from './tools/KidsAppCard';
import { IokbsCalculator } from './tools/IokbsCalculator';
import { TakdirCalculator } from './tools/TakdirCalculator';
import { KapAnalysisPanel } from './tools/KapAnalysisPanel';
import { LgsTercihRobotu } from './tools/LgsTercihRobotu';
import { LgsCountdownTimer } from './tools/LgsCountdownTimer';
import { PreviewModal } from './PreviewModal';
import { DescriptionModal } from './DescriptionModal';
import { ShareModal, ShareItem } from './ShareModal';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Eye,
  Calculator,
  GraduationCap,
  BookMarked,
  Timer,
  Type,
  BookOpenText,
  Gamepad2,
  Award,
  Target,
  Compass
} from 'lucide-react';

interface ToolDetailPageProps {
  tool: ToolDefinition;
  onNavigateHome: () => void;
  onNavigateTools: () => void;
  onSelectToolSlug: (slug: string) => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  tool,
  onNavigateHome,
  onNavigateTools,
  onSelectToolSlug,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [descBook, setDescBook] = useState<Book | null>(null);
  const [shareItem, setShareItem] = useState<ShareItem | null>(null);
  const [dynamicBookId, setDynamicBookId] = useState<string | null>(null);

  // Sync SEO metadata whenever this tool page loads or changes
  useEffect(() => {
    setDynamicBookId(null);
    const fullUrl = `https://www.askaryayinlari.com.tr/uygulamalar/${tool.slug}`;

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: tool.name,
          headline: tool.h1,
          description: tool.metaDescription,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          url: fullUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'TRY',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Aşkar Yayınları',
            url: 'https://www.askaryayinlari.com.tr/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
            },
          },
        },
        ...(tool.faq && tool.faq.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: tool.faq.map((item) => ({
                  '@type': 'Question',
                  name: item.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.a,
                  },
                })),
              },
            ]
          : []),
      ],
    };

    updatePageSeo({
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: fullUrl,
      image: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
      type: 'website',
      schema: schemaData,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool]);

  // Find related book if available (dynamically synced to selected grade or tool default)
  const activeBookId = dynamicBookId || tool.relatedBookId;
  const relatedBook: Book | undefined =
    activeBookId
      ? BOOKS_DATA.find((b) => b.id === activeBookId) ||
        KIDS_BOOKS_DATA.find((b) => b.id === activeBookId)
      : undefined;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const renderIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Calculator':
        return <Calculator className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'BookMarked':
        return <BookMarked className={className} />;
      case 'Timer':
        return <Timer className={className} />;
      case 'Type':
        return <Type className={className} />;
      case 'BookOpenText':
        return <BookOpenText className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      default:
        return <Calculator className={className} />;
    }
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      case 'lgs-sayac':
        return <LgsCountdownTimer />;
      case 'tercih':
        return <LgsTercihRobotu />;
      case 'kap':
        return <KapAnalysisPanel onGradeChange={(_grade, bookId) => setDynamicBookId(bookId)} />;
      case 'takdir':
        return <TakdirCalculator onGradeChange={(_grade, bookId) => setDynamicBookId(bookId)} />;
      case 'iokbs':
        return <IokbsCalculator onGradeChange={(_grade, bookId) => setDynamicBookId(bookId)} />;
      case 'lgs':
        return <LgsCalculator />;
      case 'tyt':
        return <TytCalculator />;
      case 'ayt':
        return <AytCalculator />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'kelime':
        return <WordCounter />;
      case 'kaynak':
        return <ApaGenerator />;
      case 'cocuk':
        return <KidsAppCard />;
      default:
        return <LgsCalculator />;
    }
  };

  return (
    <article className="space-y-8 animate-fadeIn text-[#1A1A1A]">
      {/* 1. Breadcrumbs Nav & Geri Butonu */}
      <nav
        aria-label="Sayfa Konumu"
        className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#1A1A1A]/10 pb-4"
      >
        <div className="flex items-center gap-1.5 text-[#1A1A1A]/60 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#1A1A1A] hover:underline font-medium cursor-pointer transition-colors"
          >
            Ana Sayfa
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]/30 shrink-0" />
          <button
            onClick={onNavigateTools}
            className="hover:text-[#1A1A1A] hover:underline font-medium cursor-pointer transition-colors"
          >
            Uygulamalar
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]/30 shrink-0" />
          <span className="font-bold text-[#1A1A1A] truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="bg-white hover:bg-[#FAF6EE] text-[#1A1A1A] border border-[#1A1A1A]/15 hover:border-[#C9A86A] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Uygulama Bağlantısını Kopyala"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Linki Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              setShareItem({
                title: tool.name,
                subtitle: tool.tagline,
                image: '/resimler/logo.jpg',
                url: window.location.href,
                badge: tool.badge,
              })
            }
            className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/15 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Paylaş</span>
          </button>

          <button
            onClick={onNavigateTools}
            className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tüm Uygulamalar</span>
          </button>
        </div>
      </nav>

      {/* 2. SEO H1 Başlık & Hero Header */}
      <header className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-2xs"
                style={{ backgroundColor: tool.badgeColor }}
              >
                {tool.badge}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/50 bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#1A1A1A]/10 font-semibold">
                ÜCRETSİZ ONLİNE ARAÇ
              </span>
            </div>

            {/* ZORUNLU SEO H1 BAŞLIĞI */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight leading-tight">
              {tool.h1}
            </h1>

            <p className="text-sm sm:text-base text-[#1A1A1A]/80 font-sans leading-relaxed">
              {tool.tagline}
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center shadow-md border-2 border-[#C9A86A]">
              {renderIcon(tool.iconName, 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        </div>

        {/* Önemli Özellikler Rozetleri */}
        <div className="mt-6 pt-6 border-t border-[#1A1A1A]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tool.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs bg-[#FAF9F6] p-2.5 rounded-xl border border-[#1A1A1A]/5 text-[#1A1A1A]/80 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </header>

      {/* 3. Ana Uygulama Arayüzü (Beyaz Kart & #FAF9F6 Zemin) */}
      <section
        id="tool-interactive-container"
        aria-label={tool.name}
        className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-4 sm:p-7 shadow-sm"
      >
        {renderToolComponent()}
      </section>

      {/* 4. Rehber & Nasıl Kullanılır (SEO & Bilgi Bölümü) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Sol 2 Kolon: Detaylı Açıklama & Adımlar & SSS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A86A]" />
              <span>
                {tool.id === 'lgs-sayac'
                  ? 'LGS 2026 Sınav Tarihi & Zaman Yönetimi Rehberi'
                  : tool.id === 'tercih'
                  ? 'LGS Tercih Nasıl Yapılır? (Yüzdelik Dilim & Taban Puan Rehberi)'
                  : tool.id === 'kap'
                  ? 'KAP Nedir? (Kazanım ve Akıllı Planlama Sistemi)'
                  : tool.id === 'iokbs'
                  ? 'İOKBS Nasıl Hesaplanır? (2025 MEB Bursluluk Rehberi)'
                  : tool.id === 'takdir'
                  ? 'Takdir Kaç Puanla Alınır? (MEB E-Okul Yönetmeliği)'
                  : `${tool.shortName} Nedir ve Nasıl Çalışır?`}
              </span>
            </h2>
            <div className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans space-y-3">
              {tool.detailedDescription.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">
                Adım Adım Kullanım Rehberi:
              </h3>
              <ol className="space-y-2 text-xs sm:text-sm text-[#1A1A1A]/80 font-sans list-none">
                {tool.howToUse.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[11px] font-mono flex items-center justify-center shrink-0 font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sıkça Sorulan Sorular */}
          {tool.faq.length > 0 && (
            <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C9A86A]" />
                <span>Sıkça Sorulan Sorular</span>
              </h3>
              <div className="space-y-3">
                {tool.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#1A1A1A]/8 space-y-1.5"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                      {item.q}
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Kolon: İlgili Aşkar Yayınları Kitabı */}
        <div className="space-y-6">
          {relatedBook ? (
            <div className="bg-white border-2 border-[#C9A86A]/40 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full font-bold">
                  ÖNERİLEN KOÇLUK KİTABI • {relatedBook.badge}
                </span>
              </div>

              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#1A1A1A]/10 flex items-center justify-center p-2">
                <img
                  src={relatedBook.image}
                  alt={relatedBook.title}
                  className="max-h-full object-contain"
                />
              </div>

              <div>
                <h4 className="text-base font-serif font-bold text-[#1A1A1A] leading-snug">
                  {relatedBook.title}
                </h4>
                <p className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1 line-clamp-2">
                  {relatedBook.subtitle}
                </p>
                <div className="mt-2 text-xs font-mono font-bold text-[#856526] bg-[#FAF6EE] p-2 rounded-lg border border-[#C9A86A]/30">
                  {relatedBook.altBaslik || `${relatedBook.format || 'A5 Boyut'}`} • {relatedBook.price}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setPreviewBook(relatedBook)}
                  className="bg-[#FAF9F6] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 py-2.5 px-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>ÖNİZLE</span>
                </button>

                <a
                  href={relatedBook.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                >
                  <span>SATIN AL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9A86A]" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="bg-[#FAF9F6] text-[#1A1A1A]/70 text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full font-bold">
                AŞKAR YAYINLARI
              </span>
              <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">
                Tüm Dijital PDF Kitaplarımız
              </h4>
              <p className="text-xs text-[#1A1A1A]/60 font-sans leading-relaxed">
                Ortaokul, lise ve YKS sürecinde netlerinizi artıracak koçluk ve planlama kitaplarımızı hemen inceleyin.
              </p>
              <button
                onClick={onNavigateHome}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>KİTAPLARI İNCELE</span>
              </button>
            </div>
          )}

          {/* Diğer Uygulamalara Hızlı Geçiş */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">
              DİĞER EĞİTİM ARAÇLARI:
            </h4>
            <div className="space-y-1.5">
              {TOOLS_DATA.filter((t) => t.id !== tool.id).map((otherTool) => (
                <button
                  key={otherTool.id}
                  onClick={() => onSelectToolSlug(otherTool.slug)}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF6EE] text-xs font-medium text-[#1A1A1A] flex items-center justify-between group transition-colors cursor-pointer border border-transparent hover:border-[#C9A86A]/40"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#C9A86A] shrink-0">
                      {renderIcon(otherTool.iconName, 'w-3.5 h-3.5')}
                    </span>
                    <span className="truncate">{otherTool.shortName}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modals for Related Book Previews & Shares */}
      {previewBook && (
        <PreviewModal
          book={previewBook}
          isOpen={true}
          onClose={() => setPreviewBook(null)}
        />
      )}
      {descBook && (
        <DescriptionModal
          book={descBook}
          isOpen={true}
          onClose={() => setDescBook(null)}
        />
      )}
      {shareItem && (
        <ShareModal
          item={shareItem}
          isOpen={true}
          onClose={() => setShareItem(null)}
        />
      )}
    </article>
  );
};
