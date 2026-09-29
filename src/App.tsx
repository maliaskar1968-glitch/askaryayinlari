import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { PageTab, FilterCategory } from './types';
import { PriceProvider } from './context/PriceContext';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { MottoSection } from './components/MottoSection';
import { HeroBanner } from './components/HeroBanner';
import { BookGrid } from './components/BookGrid';
import { KidsBookGrid } from './components/KidsBookGrid';
import { CoreValues } from './components/CoreValues';
import { FaqSection } from './components/FaqSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminKilavuzGuncelle } from './components/AdminKilavuzGuncelle';
import { checkOsymUpdate } from './utils/osymKilavuz';
import { updatePageSeo } from './utils/seo';
import { Home, ArrowUp, Wrench, User, Mail, GraduationCap } from 'lucide-react';

const ToolsPage = lazy(() => import('./components/ToolsPage').then(({ ToolsPage }) => ({ default: ToolsPage })));
const RehberPage = lazy(() => import('./components/RehberPage').then(({ RehberPage }) => ({ default: RehberPage })));

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('magaza');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('tumu');
  const [toolSlug, setToolSlug] = useState<string | null>(null);
  const [guideSlug, setGuideSlug] = useState<string | null>(null);

  // URL Path parser helper
  const parsePathname = useCallback(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/\/+$/, '') || '/';

    if (path === '/admin/kilavuz-guncelle' || path.startsWith('/admin/kilavuz-guncelle')) {
      setActiveTab('admin-kilavuz');
      setToolSlug(null);
      setGuideSlug(null);
    } else if (path === '/rehber' || path.startsWith('/rehber/')) {
      setActiveTab('rehber');
      setToolSlug(null);
      setGuideSlug(path === '/rehber' ? null : decodeURIComponent(path.slice('/rehber/'.length)));
    } else if (path.startsWith('/uygulamalar/')) {
      const slug = path.replace('/uygulamalar/', '');
      setActiveTab('uygulamalar');
      setToolSlug(slug);
      setGuideSlug(null);
    } else if (path === '/uygulamalar') {
      setActiveTab('uygulamalar');
      setToolSlug(null);
      setGuideSlug(null);
    } else if (path === '/hakkimizda' || path === '/hakkimda') {
      setActiveTab('hakkimizda');
      setToolSlug(null);
      setGuideSlug(null);
    } else if (path === '/iletisim') {
      setActiveTab('iletisim');
      setToolSlug(null);
      setGuideSlug(null);
    } else {
      setActiveTab('magaza');
      setToolSlug(null);
      setGuideSlug(null);
    }
  }, []);

  // Initialize and listen to popstate (Browser Back/Forward navigation) & check ÖSYM update
  useEffect(() => {
    parsePathname();
    checkOsymUpdate();

    const handlePopState = () => {
      parsePathname();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parsePathname]);

  // Navigate between tabs with clean URLs
  const handleTabChange = (newTab: PageTab) => {
    setActiveTab(newTab);
    setToolSlug(null);
    setGuideSlug(null);

    let targetPath = '/';
    if (newTab === 'uygulamalar') targetPath = '/uygulamalar';
    else if (newTab === 'rehber') targetPath = '/rehber';
    else if (newTab === 'hakkimizda' || newTab === 'hakkimda') targetPath = '/hakkimizda';
    else if (newTab === 'iletisim') targetPath = '/iletisim';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to a specific tool or back to tools catalog
  const handleSelectToolSlug = (slug: string | null) => {
    setToolSlug(slug);
    setActiveTab('uygulamalar');

    const targetPath = slug ? `/uygulamalar/${slug}` : '/uygulamalar';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGuideSlug = (slug: string | null) => {
    setGuideSlug(slug);
    setToolSlug(null);
    setActiveTab('rehber');
    const targetPath = slug ? `/rehber/${slug}` : '/rehber';
    if (window.location.pathname !== targetPath) window.history.pushState({}, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync default home / store page SEO
  useEffect(() => {
    if (activeTab === 'magaza') {
      updatePageSeo({
        title: 'Doğru Sistemle Çalış Sınavı Kazan - Aşkar Yayınları LGS YKS Koçluk Sistemi',
        description: 'Aşkar Yayınları resmi dijital PDF kütüphanesi. 5-8. sınıf LGS ve 9-12. sınıf YKS koçluk kitapları, çocuk masalları ve ücretsiz eğitim araçları.',
        url: 'https://www.askaryayinlari.com.tr/',
        image: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
        type: 'website'
      });
    } else if (activeTab === 'hakkimizda' || activeTab === 'hakkimda') {
      updatePageSeo({
        title: 'Hakkımızda | Aşkar Yayınları ve Mehmet Ali Aşkar',
        description: 'Aşkar Yayınları ve eğitim koçu yazar Mehmet Ali Aşkar hakkında bilgi edinin. Vizyonumuz, misyonumuz ve öğrenci koçluğu sistemimiz.',
        url: 'https://www.askaryayinlari.com.tr/hakkimizda',
        image: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
        type: 'website'
      });
    } else if (activeTab === 'iletisim') {
      updatePageSeo({
        title: 'İletişim & WhatsApp Destek | Aşkar Yayınları',
        description: 'Aşkar Yayınları ile iletişime geçin. WhatsApp canlı destek, e-posta ve kurumsal iletişim bilgileri.',
        url: 'https://www.askaryayinlari.com.tr/iletisim',
        image: 'https://www.askaryayinlari.com.tr/resimler/logo.jpg',
        type: 'website'
      });
    }
  }, [activeTab]);

  return (
    <PriceProvider>
      <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#C9A86A]/30 selection:text-[#1A1A1A] flex flex-col antialiased w-full max-w-[100vw] overflow-x-clip">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Sayfanın En Üstündeki Filtre Barı: [TÜMÜ] [5.SINIF] [6.SINIF] [7.SINIF] [8.SINIF LGS] [LİSE] [YKS] */}
          <FilterBar
            activeFilter={activeFilter}
            onSelectFilter={(newFilter) => {
              setActiveFilter(newFilter);
              if (activeTab !== 'magaza') {
                handleTabChange('magaza');
              }
            }}
          />

          {activeTab === 'magaza' && (
            <div className="space-y-6 animate-fadeIn">
              <MottoSection />
              <BookGrid activeFilter={activeFilter} onSelectToolSlug={handleSelectToolSlug} />
              <KidsBookGrid activeFilter={activeFilter} />
              <HeroBanner />
              <CoreValues />
              <FaqSection />
            </div>
          )}

          {activeTab === 'uygulamalar' && (
            <Suspense fallback={<div className="py-12 text-center text-sm text-[#1A1A1A]/60">Uygulamalar yükleniyor...</div>}>
              <div className="animate-fadeIn">
                <ToolsPage
                  currentSlug={toolSlug}
                  onSelectSlug={handleSelectToolSlug}
                  onSelectGuide={handleSelectGuideSlug}
                  onNavigateHome={() => handleTabChange('magaza')}
                />
              </div>
            </Suspense>
          )}

          {activeTab === 'rehber' && (
            <Suspense fallback={<div className="py-12 text-center text-sm text-[#1A1A1A]/60">Rehber yükleniyor...</div>}>
              <RehberPage
                slug={guideSlug}
                onSelectGuide={handleSelectGuideSlug}
                onNavigateHome={() => handleTabChange('magaza')}
              />
            </Suspense>
          )}

          {(activeTab === 'hakkimda' || activeTab === 'hakkimizda') && (
            <div className="animate-fadeIn">
              <AboutSection />
            </div>
          )}

          {activeTab === 'iletisim' && (
            <div className="animate-fadeIn">
              <ContactSection />
            </div>
          )}

          {activeTab === 'admin-kilavuz' && (
            <div className="animate-fadeIn">
              <AdminKilavuzGuncelle onNavigateHome={() => handleTabChange('magaza')} />
            </div>
          )}

          {/* Her Sayfanın Sonunda: Ana Sayfaya Dön ve Hızlı Sayfa Geçiş Alanı */}
          <section
            aria-label="Sayfalar Arası Geçiş"
            className="mt-12 pt-8 pb-2 border-t border-[#1A1A1A]/10 flex flex-col items-center justify-center gap-4 text-center"
          >
            {activeTab !== 'magaza' ? (
              <>
                {/* Ana Sayfaya Dön Butonu */}
                <button
                  id="page-end-home-btn"
                  onClick={() => handleTabChange('magaza')}
                  className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-md hover:shadow-lg cursor-pointer border border-[#1A1A1A]"
                >
                  <Home className="w-4 h-4 text-[#C9A86A]" />
                  <span>ANA SAYFAYA DÖN</span>
                </button>

                {/* Sayfalar Arası Hızlı Geçiş Menüsü */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 font-semibold mr-1">
                    Diğer Sayfalar:
                  </span>

                  {activeTab !== 'uygulamalar' && (
                    <button
                      onClick={() => handleTabChange('uygulamalar')}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Wrench className="w-3 h-3 text-[#C9A86A]" />
                      <span>Uygulamalar</span>
                    </button>
                  )}

                  <a
                    href="/uygulamalar/yks-geri-sayim"
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-violet-200 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <GraduationCap className="w-3 h-3 text-violet-600" />
                    <span>YKS Sayaç</span>
                  </a>

                  {activeTab !== 'hakkimda' && activeTab !== 'hakkimizda' && (
                    <button
                      onClick={() => handleTabChange('hakkimizda')}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <User className="w-3 h-3 text-[#C9A86A]" />
                      <span>Hakkımızda</span>
                    </button>
                  )}

                  {activeTab !== 'iletisim' && (
                    <button
                      onClick={() => handleTabChange('iletisim')}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Mail className="w-3 h-3 text-[#C9A86A]" />
                      <span>İletişim</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {/* Ana Sayfa İçin Sayfa Başına Dön & Diğer Sayfalara Hızlı Geçiş */}
                <button
                  id="page-end-top-btn"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-2xs cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>SAYFA BAŞINA DÖN</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 font-semibold mr-1">
                    Hızlı Sayfa Geçişi:
                  </span>

                  <button
                    onClick={() => handleTabChange('uygulamalar')}
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Wrench className="w-3 h-3 text-[#C9A86A]" />
                    <span>Uygulamalar</span>
                  </button>

                  <a
                    href="/uygulamalar/yks-geri-sayim"
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-violet-200 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <GraduationCap className="w-3 h-3 text-violet-600" />
                    <span>YKS Sayaç</span>
                  </a>

                  <button
                    onClick={() => handleTabChange('hakkimizda')}
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <User className="w-3 h-3 text-[#C9A86A]" />
                    <span>Hakkımızda</span>
                  </button>

                  <button
                    onClick={() => handleTabChange('iletisim')}
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Mail className="w-3 h-3 text-[#C9A86A]" />
                    <span>İletişim</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </PriceProvider>
  );
};

export default App;
