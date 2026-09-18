import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { PriceProvider } from './context/PriceContext';
import { Navbar } from './components/Navbar';
import { MottoSection } from './components/MottoSection';
import { HeroBanner } from './components/HeroBanner';
import { BookGrid } from './components/BookGrid';
import { KidsBookGrid } from './components/KidsBookGrid';
import { CoreValues } from './components/CoreValues';
import { FaqSection } from './components/FaqSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ToolsPage } from './components/ToolsPage';
import { Footer } from './components/Footer';
import { Home, ArrowUp, Wrench, User, Mail, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('magaza');

  // Scroll to top smoothly when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <PriceProvider>
      <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#C9A86A]/30 selection:text-[#1A1A1A] flex flex-col antialiased w-full max-w-[100vw] overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'magaza' && (
            <div className="space-y-6 animate-fadeIn">
              <MottoSection />
              <BookGrid />
              <KidsBookGrid />
              <HeroBanner />
              <CoreValues />
              <FaqSection />
            </div>
          )}

          {activeTab === 'uygulamalar' && (
            <div className="animate-fadeIn">
              <ToolsPage />
            </div>
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
                  onClick={() => {
                    setActiveTab('magaza');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                      onClick={() => {
                        setActiveTab('uygulamalar');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Wrench className="w-3 h-3 text-[#C9A86A]" />
                      <span>Uygulamalar</span>
                    </button>
                  )}

                  {activeTab !== 'hakkimda' && activeTab !== 'hakkimizda' && (
                    <button
                      onClick={() => {
                        setActiveTab('hakkimizda');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <User className="w-3 h-3 text-[#C9A86A]" />
                      <span>Hakkımızda</span>
                    </button>
                  )}

                  {activeTab !== 'iletisim' && (
                    <button
                      onClick={() => {
                        setActiveTab('iletisim');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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
                    onClick={() => {
                      setActiveTab('uygulamalar');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Wrench className="w-3 h-3 text-[#C9A86A]" />
                    <span>Uygulamalar</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('hakkimizda');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <User className="w-3 h-3 text-[#C9A86A]" />
                    <span>Hakkımızda</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('iletisim');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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
