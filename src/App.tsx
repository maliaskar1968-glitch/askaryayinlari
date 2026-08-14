import React, { useState } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MottoSection } from './components/MottoSection';
import { BookGrid } from './components/BookGrid';
import { KidsBookGrid } from './components/KidsBookGrid';
import { CoreValues } from './components/CoreValues';
import { ToolsPage } from './components/ToolsPage';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('magaza');

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-sans flex flex-col selection:bg-[#C9A86A]/30 selection:text-[#1A1A1A]">
      {/* Header Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'magaza' && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <HeroBanner />
            <MottoSection />
            <BookGrid />
            <KidsBookGrid />
            <CoreValues />
          </div>
        )}

        {activeTab === 'uygulamalar' && (
          <div className="animate-in fade-in duration-200">
            <ToolsPage />
          </div>
        )}

        {activeTab === 'hakkimda' && (
          <div className="animate-in fade-in duration-200">
            <AboutSection />
            <CoreValues />
          </div>
        )}

        {activeTab === 'iletisim' && (
          <div className="animate-in fade-in duration-200">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
