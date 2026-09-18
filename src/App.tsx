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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('magaza');

  // Scroll to top smoothly when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <PriceProvider>
      <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#C9A86A]/30 selection:text-[#1A1A1A] flex flex-col antialiased">
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
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </PriceProvider>
  );
};

export default App;
