import React, { useState, useMemo } from 'react';
import { BOOKS_DATA } from '../data/books';
import { TOOLS_DATA, ToolDefinition } from '../data/toolsData';
import { STUDY_GUIDES, StudyGuide } from '../data/studyGuideRegistry';
import { Book, ShareItem, FilterCategory } from '../types';
import { ImgWithFallback } from './ImgWithFallback';
import {
  Download,
  ExternalLink,
  Eye,
  BookOpen,
  Calculator,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Compass,
  Timer,
  GraduationCap
} from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { DescriptionModal } from './DescriptionModal';
import { ShareModal } from './ShareModal';
import { ProductCardHeader } from './ProductCardHeader';
import { StudyGuideCard } from './DersCalismaKarti';
import { usePrice } from '../context/PriceContext';

interface BookGridProps {
  activeFilter?: FilterCategory;
  onSelectToolSlug?: (slug: string) => void;
  onSelectGuide?: (slug: string) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({
  activeFilter = 'tumu',
  onSelectToolSlug,
  onSelectGuide
}) => {
  const [selectedPreviewBook, setSelectedPreviewBook] = useState<Book | null>(null);
  const [selectedDescBook, setSelectedDescBook] = useState<Book | null>(null);
  const [selectedShareItem, setSelectedShareItem] = useState<ShareItem | null>(null);
  const { getPrice } = usePrice();

  const handleOpenPreview = (book: Book) => {
    setSelectedPreviewBook(book);
  };

  const handleOpenDesc = (book: Book) => {
    setSelectedDescBook(book);
  };

  // 1. Kitap Filtreleme
  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter((book) => {
      if (activeFilter === 'tumu') return true;
      if (
        activeFilter === '5-6-7-ortaokul' ||
        activeFilter === '5' ||
        activeFilter === '6' ||
        activeFilter === '7'
      ) {
        return (
          ['k5', 'k6', 'k7'].includes(book.id) ||
          book.badge.includes('5') ||
          book.badge.includes('6') ||
          book.badge.includes('7') ||
          book.title.includes('5.') ||
          book.title.includes('6.') ||
          book.title.includes('7.')
        );
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
      if (activeFilter === 'romanlar') {
        return ['k_simsek', 'k_atom'].includes(book.id) || book.badge.includes('Roman') || book.badge.includes('TARİHİ KURGU');
      }
      return true;
    });
  }, [activeFilter]);

  // 2. Kategoriye Özel Uygulamalar
  const categoryToolSlugs = useMemo(() => {
    if (
      activeFilter === '5-6-7-ortaokul' ||
      activeFilter === '5' ||
      activeFilter === '6' ||
      activeFilter === '7'
    ) {
      return [
        'bursluluk-puan-hesaplama-2025',
        'takdir-tesekkur-hesaplama',
        'kap-analiz-paneli',
        'gunde-3-altin-is-takip',
        'pomodoro-sayaci'
      ];
    }
    if (activeFilter === '8-lgs') {
      return [
        'lgs-puan-hesaplama',
        'lgs-tercih-robotu',
        'lgs-geri-sayim',
        'kap-analiz-paneli',
        'takdir-tesekkur-hesaplama',
        'gunde-3-altin-is-takip',
        'pomodoro-sayaci'
      ];
    }
    if (activeFilter === 'lise') {
      return [
        'lise-ortalama-hesaplama',
        'gunde-3-altin-is-takip',
        'pomodoro-sayaci',
        'kelime-karakter-sayaci',
        'apa-kaynakca-olusturucu'
      ];
    }
    if (activeFilter === 'yks') {
      return [
        'yks-puan-hesaplama',
        'yks-tercih-robotu',
        'yks-geri-sayim',
        'tyt-puan-hesaplama',
        'ayt-puan-hesaplama',
        'gunde-3-altin-is-takip',
        'pomodoro-sayaci',
        'kelime-karakter-sayaci',
        'apa-kaynakca-olusturucu'
      ];
    }
    if (activeFilter === 'romanlar') {
      return [
        'kelime-karakter-sayaci',
        'pomodoro-sayaci',
        'apa-kaynakca-olusturucu',
        'gunde-3-altin-is-takip'
      ];
    }
    // 'tumu'
    return [
      'yks-puan-hesaplama',
      'lgs-puan-hesaplama',
      'bursluluk-puan-hesaplama-2025',
      'lise-ortalama-hesaplama',
      'takdir-tesekkur-hesaplama',
      'gunde-3-altin-is-takip',
      'pomodoro-sayaci',
      'yks-tercih-robotu',
      'lgs-tercih-robotu'
    ];
  }, [activeFilter]);

  const categoryTools = useMemo(() => {
    return categoryToolSlugs
      .map((slug) => TOOLS_DATA.find((t) => t.slug === slug))
      .filter((t): t is ToolDefinition => Boolean(t));
  }, [categoryToolSlugs]);

  // 3. Kategoriye Özel Ders Rehberleri
  const categoryGuides = useMemo(() => {
    if (
      activeFilter === '5-6-7-ortaokul' ||
      activeFilter === '5' ||
      activeFilter === '6' ||
      activeFilter === '7'
    ) {
      return STUDY_GUIDES.filter((g) => g.seviye === 'ortaokul');
    }
    if (activeFilter === '8-lgs') {
      return STUDY_GUIDES.filter((g) => g.seviye === 'lgs');
    }
    if (activeFilter === 'lise') {
      return STUDY_GUIDES.filter((g) => g.seviye === 'lise');
    }
    if (activeFilter === 'yks') {
      return STUDY_GUIDES.filter((g) => g.seviye === 'tyt' || g.seviye === 'ayt' || g.seviye === 'mezun');
    }
    if (activeFilter === 'romanlar') {
      return STUDY_GUIDES.filter((g) => g.id.includes('turkce') || g.id.includes('edebiyat') || g.id.includes('genel'));
    }
    // 'tumu'
    return STUDY_GUIDES.slice(0, 6);
  }, [activeFilter]);

  // Başlıklar
  const titles = useMemo(() => {
    switch (activeFilter) {
      case '5-6-7-ortaokul':
      case '5':
      case '6':
      case '7':
        return {
          booksBadge: 'ORTAOKUL • 5-6-7. SINIF',
          books: '5, 6 ve 7. Sınıf Ortaokul Koçluk Kitaplarımız',
          booksDesc: 'Ortaokula güçlü başlangıç, çalışma disiplini ve erken LGS hazırlık kaynakları.',
          toolsBadge: '5-6-7. SINIF • ÜCRETSİZ ARAÇLAR',
          tools: '5, 6 ve 7. Sınıf Eğitim Uygulamaları & Hesaplama Motorları',
          guidesBadge: 'DERS DERS İLERLE • ORTAOKUL',
          guides: 'Ortaokul Ders Çalışma Rehberleri (5, 6, 7. Sınıf)'
        };
      case '8-lgs':
        return {
          booksBadge: 'LGS 2026 • 8. SINIF',
          books: '8. Sınıf LGS Koçluk Kitaplarımız',
          booksDesc: 'Yeni nesil LGS soru taktikleri, deneme analizi ve derece hedefleyen koçluk sistemi.',
          toolsBadge: 'LGS 2026 • ONLİNE ROBOTLAR',
          tools: 'LGS 2026 Puan Hesaplama, Tercih & Canlı Geri Sayım',
          guidesBadge: 'DERS DERS İLERLE • LGS 2026',
          guides: '8. Sınıf LGS Ders Çalışma Rehberleri'
        };
      case 'lise':
        return {
          booksBadge: 'LİSE • 9-10-11-12. SINIF',
          books: '9, 10, 11 ve 12. Sınıf Lise Koçluk Kitaplarımız',
          booksDesc: 'Lisede ders başarısı, ağırlıklı ortalama ve üniversite hazırlık temeli.',
          toolsBadge: 'LİSE • DİJİTAL SİSTEMLER',
          tools: 'Lise Ortalama, Devamsızlık, Not & Verimlilik Araçları',
          guidesBadge: 'DERS DERS İLERLE • LİSE',
          guides: '9, 10, 11 ve 12. Sınıf Lise Ders Çalışma Rehberleri'
        };
      case 'yks':
        return {
          booksBadge: 'YKS 2026 • TYT-AYT-MEZUN',
          books: 'YKS (TYT-AYT) Derece & Koçluk Kitaplarımız',
          booksDesc: 'ÖSYM standartlarında net artırma, zaman yönetimi ve derece stratejileri.',
          toolsBadge: 'YKS • ONLİNE SİHİRBAZLAR',
          tools: 'YKS TYT-AYT Puan Hesaplama, Tercih Robotu & Canlı Sayaç',
          guidesBadge: 'DERS DERS İLERLE • YKS & MEZUN',
          guides: 'YKS (TYT-AYT) & Mezun Ders Çalışma Rehberleri'
        };
      case 'romanlar':
        return {
          booksBadge: 'TARİHİ KURGU • BİLİM VE İLHAM SERİSİ',
          books: 'Tarihe İz Bırakan İlham Verici Romanlarımız',
          booksDesc: 'Çocuklara, gençlere ve velilere ilham veren, insanlığa örnek dehaların hayatları. Satın alımdan sonra anında PDF olarak cebinizde.',
          toolsBadge: 'YAZARLIK VE VERİMLİLİK SİSTEMLERİ',
          tools: 'Okuma, Yazarlık & Metin Analiz Araçları',
          guidesBadge: 'EDEBİYAT & OKUMA KÜLTÜRÜ',
          guides: 'Edebiyat, Paragraf & Okuma Taktikleri'
        };
      default:
        return {
          booksBadge: 'DİJİTAL KÜTÜPHANE • AŞKAR YAYINLARI',
          books: 'Dijital Kitaplarımız',
          booksDesc: 'Öğrenci koçluğu, sınav hazırlık ve edebiyat eserleri. Satın alımdan sonra anında PDF olarak cebinizde.',
          toolsBadge: 'DİJİTAL SİSTEMLER • AŞKAR YAYINLARI',
          tools: 'Öne Çıkan Ücretsiz Eğitim Uygulamaları & Hesaplama Motorları',
          guidesBadge: 'DERS DERS İLERLE • REHBERLER',
          guides: 'Öne Çıkan Ders Çalışma Rehberleri & Sınav Taktikleri'
        };
    }
  }, [activeFilter]);

  const handleGuideClick = (slug: string) => {
    if (onSelectGuide) {
      onSelectGuide(slug);
    } else {
      window.location.href = `/rehber/${slug}`;
    }
  };

  const handleToolClick = (slug: string) => {
    if (onSelectToolSlug) {
      onSelectToolSlug(slug);
    } else {
      window.location.href = `/uygulamalar/${slug}`;
    }
  };

  return (
    <div id="kitaplarimiz" className="py-8 scroll-mt-20 space-y-12">
      <div id="book-grid-section" />

      {/* 1. KİTAPLAR BÖLÜMÜ */}
      <section aria-labelledby="section-books-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
              <span>{titles.booksBadge}</span>
            </div>
            <h2 id="section-books-heading" className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              {titles.books}
            </h2>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
            {titles.booksDesc}
          </p>
        </div>

        {/* Romanlar İçin Özel İlham ve Vizyon Makalesi */}
        {activeFilter === 'romanlar' && (
          <div className="bg-gradient-to-br from-[#1A1A1A] via-[#24221F] to-[#1A1A1A] border-2 border-[#C9A86A]/60 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl mb-10 relative overflow-hidden">
            {/* Arka Plan Dekoratif İkon */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
              <BookOpen className="w-80 h-80 text-[#C9A86A]" />
            </div>

            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/40 text-[#E5C98E] text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
                <Sparkles className="w-4 h-4 text-[#C9A86A]" />
                <span>TARİHE İZ BIRAKANLAR • İLHAM VEREN ROMAN SERİSİ</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white leading-tight">
                Geleceğe İlham, İnsanlığa Örnek: Tarihe İz Bırakan Hayatlar
              </h2>

              <div className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed space-y-3 pt-2">
                <p>
                  Aşkar Yayınları Tarihi Kurgu ve Bilim Romanları serisi; yalnızca geçmişin anılarını anlatmak için değil, <strong className="text-white font-semibold">çocuklarımızın ve gençlerimizin hayal güçlerine kanat takmak, insanlığa örnek olmuş büyük zihinleri tanıtmak ve tarihe iz bırakma cesaretini aşılamak</strong> hedefiyle kaleme alınmıştır.
                </p>
                <p>
                  Sınav başarısı bir hedeftir; fakat asıl gaye, o sınavı kazandıktan sonra insanlığa nasıl bir değer katacağınızdır. Dünyayı alternatif akımla aydınlatan <strong className="text-[#C9A86A]">Nikola Tesla</strong>'nın tavizsiz dehası ile bir patates tarlasından çıkıp atomun çekirdeğini keşfeden <strong className="text-[#C9A86A]">Ernest Rutherford</strong>'un azmi, her gencin kalbinde bir kıvılcım çakmak için yazılmıştır.
                </p>
                <p className="bg-white/5 border-l-4 border-[#C9A86A] pl-4 py-3 rounded-r-xl italic text-zinc-200">
                  "Bu romanlar; her velinin çocuğunun ufkunu açmak, her öğrencinin ise içindeki potansiyeli ve merak duygusunu uyandırmak için mutlaka kütüphanesinde bulundurması gereken başucu eserleridir. Aşkar Yayınları olarak bilime, felsefeye ve insanlık tarihine damga vuran yeni dehaların hayatlarını gençlerle buluşturmaya, <strong className="text-white font-bold underline decoration-[#C9A86A] underline-offset-4">bu ilham veren roman serisini yeni kitaplarla yazmaya ve büyütmeye kararlılıkla devam edeceğiz.</strong>"
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-[#C9A86A] font-bold border-t border-white/10">
                <span>✦ YAZAR: MEHMET ALİ AŞKAR</span>
                <span>✦ BİLİMSEL GERÇEKLERE SADIK ANLATI</span>
                <span>✦ YENİ ROMANLAR YAZILMAYA DEVAM EDİYOR</span>
              </div>
            </div>
          </div>
        )}

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {filteredBooks.map((book) => {
              const bookPrice = getPrice(book.id, book.price, book.originalPrice);

              return (
                <article
                  key={book.id}
                  id={`book-card-${book.id}`}
                  className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
                >
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

                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex items-center justify-center">
                    <ImgWithFallback
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />

                    {/* Kampanya İndirim Rozeti */}
                    {bookPrice.badge && (
                      <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wide flex items-center gap-1 z-10 animate-pulse">
                        <span>{bookPrice.badge}</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                      PDF E-KİTAP
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#856526] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed">
                      {book.subtitle}
                    </p>
                  </div>

                  {/* Fiyat ve Format Bilgileri */}
                  <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3">
                    {/* Format ve Sayfa Sayısı */}
                    <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#C9A86A]/40 mb-2.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0"></span>
                      <span className="whitespace-nowrap">{book.altBaslik || `${book.format || 'A4 Boyut'}, ${book.pageCount} Sayfa`}</span>
                    </div>

                    {/* Dijital PDF, Kampanya ve Fiyat Satırı */}
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                            DİJİTAL PDF
                          </span>
                          {bookPrice.badge && (
                            <span className="text-[9px] font-mono font-bold text-red-700 bg-red-100/80 px-1 py-0.5 rounded">
                              {bookPrice.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                          Anında İndirme
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 text-right">
                        {bookPrice.originalPrice && (
                          <span className="text-xs text-[#1A1A1A]/40 line-through font-mono">
                            {bookPrice.originalPrice}
                          </span>
                        )}
                        <span className={`text-xl font-serif font-black tracking-tight ${bookPrice.badge ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                          {bookPrice.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <button
                      type="button"
                      id={`btn-desc-${book.id}`}
                      onClick={() => handleOpenDesc(book)}
                      className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/15 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C9A86A]" />
                      <span>KİTAP DETAYI & İÇİNDEKİLER</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-preview-${book.id}`}
                      onClick={() => handleOpenPreview(book)}
                      className="w-full bg-white hover:bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                      <span>UYGULAMA İÇİ ÖNİZLEME</span>
                    </button>

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
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#1A1A1A]/10 text-sm text-[#1A1A1A]/60">
            Bu kategoride henüz listelenen kitap bulunmamaktadır.
          </div>
        )}
      </section>

      {/* 2. UYGULAMALAR VE HESAPLAMA MOTORLARI BÖLÜMÜ */}
      {categoryTools.length > 0 && (
        <section aria-labelledby="section-tools-heading" className="pt-8 border-t border-[#1A1A1A]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
                <span>{titles.toolsBadge}</span>
              </div>
              <h2 id="section-tools-heading" className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
                {titles.tools}
              </h2>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
              MEB ve ÖSYM güncel standartlarında ücretsiz hesaplama motorları, takip ve çalışma sistemleri.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {categoryTools.map((tool) => (
              <article
                key={tool.id}
                id={`card-${tool.slug}`}
                className="bg-white border-2 hover:border-[#C9A86A] rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
                style={{ borderColor: `${tool.badgeColor}40` }}
              >
                <ProductCardHeader
                  category={tool.badge}
                  title={tool.name}
                  onShare={() =>
                    setSelectedShareItem({
                      title: tool.metaTitle || tool.name,
                      subtitle: tool.metaDescription || tool.tagline,
                      image: tool.image,
                      url: `https://www.askaryayinlari.com.tr/uygulamalar/${tool.slug}`,
                      badge: tool.badge
                    })
                  }
                />

                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="mb-4 flex-1">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.75rem] group-hover:text-[#856526] transition-colors">
                    {tool.shortName || tool.name}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 font-sans italic mt-1 leading-relaxed line-clamp-2">
                    {tool.tagline}
                  </p>
                </div>

                <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3 space-y-1.5">
                  <div
                    className="flex items-center justify-between text-[11px] font-sans font-bold bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#C9A86A]/30 shadow-2xs"
                    style={{ color: tool.badgeColor }}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: tool.badgeColor }} />
                      <span className="truncate">{tool.highlights?.[0] || 'MEB & ÖSYM Uyumlu'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold shrink-0 ml-1" style={{ color: tool.badgeColor }}>
                      CANLI SİSTEM
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-semibold">
                      ONLİNE ARAÇ
                    </span>
                    <div className="flex items-baseline gap-1.5 text-right">
                      <span className="text-xl font-serif font-black tracking-tight" style={{ color: tool.badgeColor }}>
                        ÜCRETSİZ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  <button
                    type="button"
                    id={`btn-open-${tool.id}`}
                    onClick={() => handleToolClick(tool.slug)}
                    className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>UYGULAMAYI AÇ</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
                  </button>

                  <a
                    href={`/uygulamalar/${tool.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToolClick(tool.slug);
                    }}
                    className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C9A86A] text-center py-2 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>/uygulamalar/{tool.slug}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. DERS ÇALIŞMA REHBERLERİ BÖLÜMÜ */}
      {categoryGuides.length > 0 && (
        <section aria-labelledby="section-guides-heading" className="pt-8 border-t border-[#1A1A1A]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
                <span>{titles.guidesBadge}</span>
              </div>
              <h2 id="section-guides-heading" className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
                {titles.guides}
              </h2>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
              Eğitim koçu Mehmet Ali Aşkar'dan branş bazlı haftalık çalışma taktikleri ve sınav analizleri.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {categoryGuides.map((guide) => (
              <StudyGuideCard
                key={guide.slug}
                guide={guide}
                onSelectGuide={handleGuideClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <PreviewModal
        book={selectedPreviewBook}
        isOpen={Boolean(selectedPreviewBook)}
        onClose={() => setSelectedPreviewBook(null)}
      />

      <DescriptionModal
        book={selectedDescBook}
        isOpen={Boolean(selectedDescBook)}
        onClose={() => setSelectedDescBook(null)}
        onOpenPreview={handleOpenPreview}
      />

      <ShareModal
        item={selectedShareItem}
        isOpen={Boolean(selectedShareItem)}
        onClose={() => setSelectedShareItem(null)}
      />
    </div>
  );
};
