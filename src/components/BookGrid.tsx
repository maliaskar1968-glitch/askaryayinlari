import React, { useState } from 'react';
import { BOOKS_DATA } from '../data/books';
import { Book, ShareItem, FilterCategory } from '../types';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, ExternalLink, Eye, BookOpen, Calculator, ArrowRight, CheckCircle2, Sparkles, Award, Target, Compass, Timer, GraduationCap } from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { DescriptionModal } from './DescriptionModal';
import { ShareModal } from './ShareModal';
import { ProductCardHeader } from './ProductCardHeader';
import { usePrice } from '../context/PriceContext';

interface BookGridProps {
  activeFilter?: FilterCategory;
  onSelectToolSlug?: (slug: string) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ activeFilter = 'tumu', onSelectToolSlug }) => {
  const [selectedPreviewBook, setSelectedPreviewBook] = useState<Book | null>(null);
  const [selectedDescBook, setSelectedDescBook] = useState<Book | null>(null);
  const [selectedShareItem, setSelectedShareItem] = useState<ShareItem | null>(null);
  const { getPrice } = usePrice();

  const showIokbsCard = activeFilter === '5' || activeFilter === '6' || activeFilter === '7' || activeFilter === 'tumu';
  const showKapCard = activeFilter === '5' || activeFilter === '6' || activeFilter === '7' || activeFilter === '8-lgs' || activeFilter === 'tumu';
  const showTakdirCard = activeFilter === '5' || activeFilter === '6' || activeFilter === '7' || activeFilter === '8-lgs' || activeFilter === 'tumu';
  const showLgsPuanCard = activeFilter === '8-lgs' || activeFilter === '7' || activeFilter === 'tumu';
  const showTercihCard = activeFilter === '8-lgs' || activeFilter === '7' || activeFilter === 'tumu';
  const showLgsSayacCard = activeFilter === '8-lgs' || activeFilter === 'tumu';
  const showAltinIsCard = activeFilter === 'tumu' || activeFilter === '5' || activeFilter === '6' || activeFilter === '7' || activeFilter === '8-lgs' || activeFilter === 'yks';
  const showLiseOrtalamaCard = activeFilter === 'lise' || activeFilter === 'tumu';
  const showYksCard = activeFilter === 'yks' || activeFilter === 'tumu';
  const showYksTercihCard = activeFilter === 'yks' || activeFilter === 'tumu';

  const handleOpenPreview = (book: Book) => {
    setSelectedPreviewBook(book);
  };

  const handleOpenDesc = (book: Book) => {
    setSelectedDescBook(book);
  };

  const filteredBooks = BOOKS_DATA.filter((book) => {
    if (activeFilter === 'tumu') return true;
    if (activeFilter === '5') {
      return book.id === 'k5' || book.badge.includes('5');
    }
    if (activeFilter === '6') {
      return book.id === 'k6' || book.badge.includes('6');
    }
    if (activeFilter === '7') {
      return book.id === 'k7' || book.badge.includes('7');
    }
    if (activeFilter === '8-lgs') {
      return book.id === 'k8' || book.badge.includes('8') || book.title.includes('LGS');
    }
    if (activeFilter === 'lise') {
      return (
        ['k9', 'k10', 'k11'].includes(book.id) ||
        (book.badge.includes('LİSE') && !book.badge.includes('YKS')) ||
        (book.title.includes('Lise') && !book.title.includes('YKS')) ||
        book.badge.includes('9.') ||
        book.badge.includes('10.') ||
        book.badge.includes('11.')
      );
    }
    if (activeFilter === 'yks') {
      return book.id === 'k_yks' || book.id === 'k11' || book.badge.includes('YKS') || book.title.includes('YKS');
    }
    return true;
  });

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
        {filteredBooks.map((book) => {
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

        {/* İOKBS Bursluluk Puan Hesaplama 2025 Özel Kartı (5. Sınıf Kategorisi & Ortaokul) */}
        {showIokbsCard && (
          <article
            id="card-iokbs-bursluluk-2025"
            className="bg-white border-2 border-[#059669]/40 hover:border-[#059669] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="5. SINIF • İOKBS 2025"
              title="İOKBS Bursluluk Puan Hesaplama 2025"
              onShare={() =>
                setSelectedShareItem({
                  title: 'İOKBS Bursluluk Puan Hesaplama 2025 - 5,6,7. Sınıf',
                  subtitle: '2025 İOKBS puanını saniyede hesapla, kaç net kaç puan eder öğren.',
                  image: '/resimler/k5.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/bursluluk-puan-hesaplama-2025',
                  badge: '5, 6, 7. SINIF • İOKBS 2025'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FAF6EE] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Calculator className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#059669]/15 text-[#059669] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>5, 6, 7. SINIFLAR İÇİN</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                MEB Katsayı & Standart Sapma
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#059669] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                ÜCRETSİZ ONLİNE
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#059669] transition-colors">
                İOKBS Bursluluk Puan Hesaplama 2025
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                5, 6 ve 7. sınıf MEB bursluluk sınavı net ve puan hesaplama robotu. 3 yanlış 1 doğru kuralı ile anında puanını öğren.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#059669] bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Saniyede Sonuç • Burs Baraj Tahmini</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-mono font-bold shrink-0">
                  MEB 2025
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  ONLİNE ARAÇ
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#059669] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-iokbs-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('bursluluk-puan-hesaplama-2025');
                  } else {
                    window.location.href = '/uygulamalar/bursluluk-puan-hesaplama-2025';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>PUANI HESAPLA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/bursluluk-puan-hesaplama-2025"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('bursluluk-puan-hesaplama-2025');
                  } else {
                    window.location.href = '/uygulamalar/bursluluk-puan-hesaplama-2025';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#059669] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/bursluluk-puan-hesaplama-2025</span>
              </a>
            </div>
          </article>
        )}

        {/* KAP Dijital Kazanım Analiz Paneli Özel Kartı (5, 6, 7 ve 8. SINIF LGS Kategorisi) */}
        {showKapCard && (
          <article
            id="card-kap-analiz-paneli"
            className="bg-white border-2 border-[#ea580c]/40 hover:border-[#ea580c] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="5-8. SINIF • DİJİTAL KAP"
              title="KAP Dijital Kazanım Analiz Paneli"
              onShare={() =>
                setSelectedShareItem({
                  title: 'KAP Kazanım Analiz Paneli - Eksik Konuları Bul',
                  subtitle: 'KAP deneme analizini dijital yap, eksik kazanımlarını gör.',
                  image: '/resimler/k8.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/kap-analiz-paneli',
                  badge: '5-8. SINIF • DİJİTAL KOÇLUK'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FFF7ED] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Target className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#ea580c]/15 text-[#ea580c] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>EN EKSİK 3 KAZANIM RAPORU</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                Deneme Ameliyatı & Sıfır Hata
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#ea580c] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                KAP SİSTEMİ
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#ea580c] transition-colors">
                KAP Dijital Kazanım Analiz Paneli
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                Deneme adı ve yanlış konularını gir, sistem localStorage'da biriktirip en çok eksik çıkan ilk 3 kritik kazanımını anında raporlasın.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#ea580c] bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                  <span>5, 6, 7 ve 8. Sınıf LGS</span>
                </span>
                <span className="text-[10px] text-orange-800 font-mono font-bold shrink-0">
                  AKILLI TAKİP
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#ea580c] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-kap-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('kap-analiz-paneli');
                  } else {
                    window.location.href = '/uygulamalar/kap-analiz-paneli';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Target className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>EKSİKLERİ ANALİZ ET</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/kap-analiz-paneli"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('kap-analiz-paneli');
                  } else {
                    window.location.href = '/uygulamalar/kap-analiz-paneli';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#ea580c] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/kap-analiz-paneli</span>
              </a>
            </div>
          </article>
        )}

        {/* Takdir Teşekkür Hesaplayıcı & Planlayıcı Özel Kartı (5, 6, 7, 8. SINIF Ortaokul) */}
        {showTakdirCard && (
          <article
            id="card-takdir-tesekkur"
            className="bg-white border-2 border-[#2563eb]/40 hover:border-[#2563eb] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category={
                activeFilter === '8-lgs'
                  ? '8. SINIF LGS • E-OKUL'
                  : '5-8. SINIF ORTAOKUL • E-OKUL'
              }
              title="Takdir Teşekkür Planlayıcı"
              onShare={() =>
                setSelectedShareItem({
                  title: 'Takdir Teşekkür Hesaplama - 5,6,7,8. Sınıf E-Okul Uyumlu',
                  subtitle: 'E-Okul uyumlu takdir teşekkür hesapla ve planla.',
                  image: activeFilter === '8-lgs' ? '/resimler/k8.webp' : '/resimler/k5.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/takdir-tesekkur-hesaplama',
                  badge: activeFilter === '8-lgs' ? '8. SINIF LGS • E-OKUL' : '5-8. SINIF • E-OKUL'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#EFF6FF] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Award className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#2563eb]/15 text-[#2563eb] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>TAKDİR (85+) & TEŞEKKÜR (70+)</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                Ders Notları & Haftalık Saat
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#2563eb] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                5-8. SINIF
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#2563eb] transition-colors">
                Takdir Teşekkür Planlayıcı
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                Ders notlarını gir, dönem ağırlıklı genel ortalamanı ve takdir/teşekkür belge durumunu MEB yönetmeliğine göre saniyede planla ve hesapla.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#2563eb] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                  <span>{activeFilter === '8-lgs' ? '8. Sınıf LGS MEB Müfredatı' : '5, 6, 7 ve 8. Sınıf Ortaokul'}</span>
                </span>
                <span className="text-[10px] text-blue-800 font-mono font-bold shrink-0">
                  MEB UYUMLU
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  ONLİNE ARAÇ
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#2563eb] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-takdir-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('takdir-tesekkur-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/takdir-tesekkur-hesaplama';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Award className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>BELGE HESAPLA & PLANLA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/takdir-tesekkur-hesaplama"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('takdir-tesekkur-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/takdir-tesekkur-hesaplama';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#2563eb] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/takdir-tesekkur-hesaplama</span>
              </a>
            </div>
          </article>
        )}

        {/* LGS Puan Hesaplama Robotu Özel Kartı (8. SINIF LGS) */}
        {showLgsPuanCard && (
          <article
            id="card-lgs-puan-hesaplama"
            className="bg-white border-2 border-[#C9A86A]/40 hover:border-[#C9A86A] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="8. SINIF LGS • MEB 2026"
              title="LGS Puan Hesaplama Robotu"
              onShare={() =>
                setSelectedShareItem({
                  title: 'LGS Puan Hesaplama 2026 | MEB Uyumlu - Aşkar Yayınları',
                  subtitle: '2026 MEB standart sapma ve ders katsayılarıyla net ve puanını anında hesapla.',
                  image: '/resimler/k8.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/lgs-puan-hesaplama',
                  badge: '8. SINIF LGS • MEB 2026'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FAF6EE] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Calculator className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>MEB KATSAYI & SAPMA UYUMLU</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                Türkçe, Mat, Fen 4.33 Katsayı
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#1A1A1A] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                MEB 2026
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#856526] transition-colors">
                LGS Puan Hesaplama Robotu
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                2026 MEB güncel standart sapma ve katsayılarına göre 90 soru üzerinden toplam net ve sınav puanınızı hesaplayın.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#C9A86A]/30 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#856526] shrink-0" />
                  <span>3 Yanlış 1 Doğruyu Götürür</span>
                </span>
                <span className="text-[10px] text-[#856526] font-mono font-bold shrink-0">
                  500 TAM PUAN
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  ONLİNE ARAÇ
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#856526] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-lgs-calc-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-puan-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/lgs-puan-hesaplama';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>PUANI HESAPLA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/lgs-puan-hesaplama"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-puan-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/lgs-puan-hesaplama';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/lgs-puan-hesaplama</span>
              </a>
            </div>
          </article>
        )}

        {/* LGS Tercih Robotu - Yüzdelik Dilim Özel Kartı (8. SINIF LGS) */}
        {showTercihCard && (
          <article
            id="card-lgs-tercih-robotu"
            className="bg-white border-2 border-[#0284c7]/40 hover:border-[#0284c7] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="8. SINIF LGS • TERCİH ROBOTU"
              title="LGS Tercih Robotu - Yüzdelik Dilim"
              onShare={() =>
                setSelectedShareItem({
                  title: 'LGS Tercih Robotu 2025 - Yüzdelik Dilime Göre Lise Bul',
                  subtitle: 'Puanını gir, girebileceğin Fen, Anadolu liselerini listele.',
                  image: '/resimler/k8.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu',
                  badge: '8. SINIF LGS • 2024 TABAN PUANLARI'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#F0F9FF] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Compass className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#0284c7]/15 text-[#0284c7] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>2024 MEB TABAN PUANLARI</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                Fen, Anadolu, İHL & Sosyal Bilimler
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#0284c7] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                ŞEHİR FİLTRELİ
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#0284c7] transition-colors">
                LGS Tercih Robotu - Yüzdelik Dilim
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                Puanını veya yüzdelik dilimini gir, 2024 resmi taban puanlarına göre yerleşebileceğin liseleri anında gör ve şehir bazında filtrele.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#0284c7] bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                  <span>Güvenli, İdeal ve Riskli Analizi</span>
                </span>
                <span className="text-[10px] text-sky-800 font-mono font-bold shrink-0">
                  MEB GÜNCEL
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#0284c7] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-lgs-tercih-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-tercih-robotu');
                  } else {
                    window.location.href = '/uygulamalar/lgs-tercih-robotu';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Compass className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>LİSELERİ LİSTELE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/lgs-tercih-robotu"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-tercih-robotu');
                  } else {
                    window.location.href = '/uygulamalar/lgs-tercih-robotu';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#0284c7] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/lgs-tercih-robotu</span>
              </a>
            </div>
          </article>
        )}

        {/* LGS 2026 Geri Sayım Sayacı Özel Kartı (8. SINIF LGS) */}
        {showLgsSayacCard && (
          <article
            id="card-lgs-geri-sayim"
            className="bg-white border-2 border-[#dc2626]/40 hover:border-[#dc2626] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="8. SINIF LGS • 15 HAZİRAN 2026"
              title="LGS 2026 Geri Sayım Sayacı"
              onShare={() =>
                setSelectedShareItem({
                  title: 'LGS 2026 Geri Sayım - Kaç Gün Kaldı?',
                  subtitle: "LGS 2026'ya kaç gün kaldı? Canlı geri sayım sayacı ve motivasyon sözleri.",
                  image: '/resimler/k8.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/lgs-geri-sayim',
                  badge: '8. SINIF LGS • 15 HAZİRAN 2026'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FEF2F2] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-[#C9A86A] flex items-center justify-center mb-3 shadow-md border-2 border-[#C9A86A]/40 group-hover:border-[#C9A86A] transition-colors">
                <Timer className="w-8 h-8 text-[#C9A86A]" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#dc2626]/15 text-[#dc2626] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>CANLI GERİ SAYIM & MOTİVASYON</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                15 Haziran 2026 • 09:30
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#dc2626] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                CANLI SAYAÇ
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#dc2626] transition-colors">
                LGS 2026 Geri Sayım Sayacı
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                15 Haziran 2026 MEB LGS sınavına kaç gün, saat ve saniye kaldığını canlı takip edin, günün motivasyon sözleriyle enerjinizi koruyun.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#dc2626] bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                  <span>Sözel (09:30) & Sayısal (11:30)</span>
                </span>
                <span className="text-[10px] text-red-800 font-mono font-bold shrink-0">
                  MEB TAKVİMİ
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  ONLİNE ARAÇ
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#dc2626] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-lgs-sayac-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-geri-sayim');
                  } else {
                    window.location.href = '/uygulamalar/lgs-geri-sayim';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Timer className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>SAYACI GÖRÜNTÜLE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/lgs-geri-sayim"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lgs-geri-sayim');
                  } else {
                    window.location.href = '/uygulamalar/lgs-geri-sayim';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#dc2626] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/lgs-geri-sayim</span>
              </a>
            </div>
          </article>
        )}

        {/* Günde 3 Altın İş Takip - Tüm Sınıflar Özel Kartı (TÜMÜ, 5, 6, 7, 8-lgs, lise, yks) */}
        {showAltinIsCard && (
          <article
            id="card-3-altin-is"
            className="bg-white border-2 border-[#2563eb]/40 hover:border-[#2563eb] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="TÜM SINIFLAR • DİSİPLİN"
              title="Günde 3 Altın İş Takip - Tüm Sınıflar"
              onShare={() =>
                setSelectedShareItem({
                  title: 'Günde 3 Altın İş Takip - 5,6,7,8, Lise ve YKS İçin Disiplin Uygulaması',
                  subtitle: "5. sınıftan YKS'ye kadar her sınıf için günde sadece 3 görevle ders disiplinini kur. AŞKAR 3 Altın İş sistemi.",
                  image: '/resimler/k5.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/3-altin-is-takip',
                  badge: 'TÜM SINIFLAR • DİSİPLİN UYGULAMASI'
                })
              }
            />

            {/* Visual Box / Hero Area - Defter Dokulu */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF3E0] via-[#FFFDF9] to-[#FAF6EE] border-2 border-[#D8C7A5] mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              {/* Defter spiral noktaları */}
              <div className="absolute top-2 left-3 right-3 flex justify-between items-center opacity-40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#856526]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#856526]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#856526]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#856526]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#856526]" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center mb-2 shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#2563eb]/15 text-[#2563eb] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>GÜNDE SADECE 3 ALTIN İŞ</span>
              </div>
              <span className="text-[11px] font-mono text-[#856526] font-semibold">
                5, 6, 7, 8, Lise & YKS Görevleri
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#2563eb] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                5-12 & YKS
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#2563eb] transition-colors">
                Günde 3 Altın İş Takip - Tüm Sınıflar
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                5. sınıftan YKS'ye kadar her sınıf için günde sadece 3 görevle ders disiplinini kur. Sınıfını seç, görevlerini tamamla ve haftalık istikrarını gör.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#2563eb] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                  <span>Sınıf Bazlı Görev & Grafik</span>
                </span>
                <span className="text-[10px] text-blue-800 font-mono font-bold shrink-0">
                  DİSİPLİN SİSTEMİ
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#2563eb] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-3altin-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('3-altin-is-takip');
                  } else {
                    window.location.href = '/uygulamalar/3-altin-is-takip';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>3 ALTIN İŞİ TAKİP ET</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/3-altin-is-takip"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('3-altin-is-takip');
                  } else {
                    window.location.href = '/uygulamalar/3-altin-is-takip';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#2563eb] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/3-altin-is-takip</span>
              </a>
            </div>
          </article>
        )}

        {/* Lise Ortalama, Takdir ve Devamsızlık Hesaplayıcı Özel Kartı (LİSE ve TÜMÜ) */}
        {showLiseOrtalamaCard && (
          <article
            id="card-lise-ortalama"
            className="bg-white border-2 border-[#7c3aed]/40 hover:border-[#7c3aed] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="LİSE 9-12 • E-OKUL"
              title="Lise Ortalama, Takdir ve Devamsızlık Hesaplayıcı"
              onShare={() =>
                setSelectedShareItem({
                  title: 'Lise Ortalama Hesaplama 9-10-11-12 - Takdir Teşekkür',
                  subtitle: 'Lise ortalama, takdir teşekkür ve devamsızlık hesapla.',
                  image: '/resimler/k9.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/lise-ortalama-hesaplama',
                  badge: '9-12. SINIF LİSE • MEB E-OKUL'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#F5F3FF] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#7c3aed] text-white flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#7c3aed]/15 text-[#7c3aed] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>3'Ü 1 ARADA SİSTEM</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                Ortalama • Belge • Devamsızlık
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#7c3aed] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                9-12. SINIF
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#7c3aed] transition-colors">
                Lise Ortalama, Takdir ve Devamsızlık Hesaplayıcı
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                9, 10, 11 ve 12. sınıf dönem ortalamanızı, takdir-teşekkür durumunuzu ve 10/30 gün devamsızlık sınırınızı anında hesaplayın.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#7c3aed] bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                  <span>Özürsüz 10 Gün & 5 Gün Belge Kuralı</span>
                </span>
                <span className="text-[10px] text-purple-800 font-mono font-bold shrink-0">
                  MEB 2025
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#7c3aed] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-lise-ortalama-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lise-ortalama-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/lise-ortalama-hesaplama';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>HESAPLAMAYI BAŞLAT</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/lise-ortalama-hesaplama"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('lise-ortalama-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/lise-ortalama-hesaplama';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#7c3aed] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/lise-ortalama-hesaplama</span>
              </a>
            </div>
          </article>
        )}

        {/* YKS Puan Hesaplama 2025 TYT AYT + OBP Özel Kartı (YKS ve TÜMÜ) */}
        {showYksCard && (
          <article
            id="card-yks-puan-hesaplama"
            className="bg-white border-2 border-[#ea580c]/40 hover:border-[#ea580c] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="YKS 2025 • TYT AYT OBP"
              title="YKS Puan Hesaplama 2025 TYT AYT + OBP"
              onShare={() =>
                setSelectedShareItem({
                  title: 'YKS Puan Hesaplama 2025 - TYT AYT OBP\'li',
                  subtitle: 'ÖSYM uyumlu YKS puan hesapla, tahmini sıralamanı gör.',
                  image: '/resimler/k_yks.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/yks-puan-hesaplama',
                  badge: 'YKS 2025 • TYT AYT OBP'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FFF7ED] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#ea580c]/15 text-[#ea580c] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>ÖSYM PUAN & SIRALAMA</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                SAY • EA • SÖZ • TYT + OBP
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#ea580c] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                ÖSYM 2025
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#ea580c] transition-colors">
                YKS Puan Hesaplama 2025 TYT AYT + OBP
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                TYT AYT netlerini ve diploma notunu gir, OBP katkılı Sayısal, Eşit Ağırlık, Sözel puanlarını ve tahmini başarı sıralamanı anında gör.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#ea580c] bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                  <span>SAY - EA - SÖZ + Tahmini Sıralama</span>
                </span>
                <span className="text-[10px] text-orange-800 font-mono font-bold shrink-0">
                  ÖSYM 2025
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#ea580c] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-yks-puan-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('yks-puan-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/yks-puan-hesaplama';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>YKS PUANINI HESAPLA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/yks-puan-hesaplama"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('yks-puan-hesaplama');
                  } else {
                    window.location.href = '/uygulamalar/yks-puan-hesaplama';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#ea580c] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/yks-puan-hesaplama</span>
              </a>
            </div>
          </article>
        )}

        {/* YKS Tercih Sihirbazı 2025 + PDF İndir Özel Kartı (YKS ve TÜMÜ) */}
        {showYksTercihCard && (
          <article
            id="card-yks-tercih-robotu"
            className="bg-white border-2 border-[#ea580c]/40 hover:border-[#ea580c] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <ProductCardHeader
              category="YKS 2025 • TERCİH SİHİRBAZI"
              title="YKS Tercih Sihirbazı 2025 + PDF İndir"
              onShare={() =>
                setSelectedShareItem({
                  title: 'YKS Tercih Robotu 2025 - PDF İndir - Taban Puanlara Göre Bölüm Bul',
                  subtitle: 'YKS puanına göre üniversite listeni oluştur, PDF olarak indir ve paylaş.',
                  image: '/resimler/k_yks.webp',
                  url: 'https://www.askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu',
                  badge: 'YKS 2025 • YÖK ATLAS UYUMLU'
                })
              }
            />

            {/* Visual Box / Hero Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#FFF7ED] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                <Compass className="w-8 h-8 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-1 bg-[#ea580c]/15 text-[#ea580c] text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                <span>YÖK ATLAS 2024 RESMİ VERİ</span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/70 font-semibold">
                SAY • EA • SÖZ • DİL + PDF İndir
              </span>

              {/* Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-[#ea580c] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs font-bold shadow-xs">
                PDF ÇIKTILI
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#ea580c] transition-colors">
                YKS Tercih Sihirbazı 2025 + PDF İndir
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                YKS puanını, puan türünü ve şehrini seç; 2024 YÖK taban puanlarına göre uygun bölümleri filtrele ve tercih listenin PDF çıktısını anında al.
              </p>
            </div>

            {/* Features Info */}
            <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#ea580c] bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 shadow-2xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                  <span>Şehir & Devlet/Vakıf Filtresi + QR PDF</span>
                </span>
                <span className="text-[10px] text-orange-800 font-mono font-bold shrink-0">
                  ÖSYM 2025
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                  DİJİTAL SİSTEM
                </span>
                <div className="flex items-baseline gap-1.5 text-right">
                  <span className="text-xl font-serif font-black text-[#ea580c] tracking-tight">
                    ÜCRETSİZ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2 mt-auto">
              <button
                type="button"
                id="btn-open-yks-tercih-tool"
                onClick={() => {
                  if (onSelectToolSlug) {
                    onSelectToolSlug('yks-tercih-robotu');
                  } else {
                    window.location.href = '/uygulamalar/yks-tercih-robotu';
                  }
                }}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
              >
                <Compass className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>TERCİH SİHİRBAZINI AÇ</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
              </button>

              <a
                href="/uygulamalar/yks-tercih-robotu"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectToolSlug) {
                    onSelectToolSlug('yks-tercih-robotu');
                  } else {
                    window.location.href = '/uygulamalar/yks-tercih-robotu';
                  }
                }}
                className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#ea580c] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>/uygulamalar/yks-tercih-robotu</span>
              </a>
            </div>
          </article>
        )}
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
