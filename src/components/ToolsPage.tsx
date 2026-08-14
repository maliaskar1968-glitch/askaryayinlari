import React, { useState } from 'react';
import { ToolTab } from '../types';
import { LgsCalculator } from './tools/LgsCalculator';
import { TytCalculator } from './tools/TytCalculator';
import { AytCalculator } from './tools/AytCalculator';
import { WordCounter } from './tools/WordCounter';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { ApaGenerator } from './tools/ApaGenerator';
import { KidsAppCard } from './tools/KidsAppCard';
import { Calculator, GraduationCap, BookMarked, Type, Timer, BookOpenText, Gamepad2 } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolTab>('lgs');

  const subNavItems: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
    { id: 'lgs', label: 'LGS Puan', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'tyt', label: 'YKS - TYT', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'ayt', label: 'YKS - AYT', icon: <BookMarked className="w-3.5 h-3.5" /> },
    { id: 'kelime', label: 'Kelime Sayacı', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'pomodoro', label: 'Pomodoro Sayacı', icon: <Timer className="w-3.5 h-3.5" /> },
    { id: 'kaynak', label: 'Kaynakça APA', icon: <BookOpenText className="w-3.5 h-3.5" /> },
    { id: 'cocuk', label: 'Çocuk Uygulaması', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="my-8 space-y-8">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50 mb-1">
          Dijital Sistemler / Araçlar
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
          Uygulamalar & Eğitim Araçları
        </h2>
        <p className="text-xs text-[#1A1A1A]/60 font-sans mt-1">
          LGS/YKS net-puan hesaplama, pomodoro çalışma sayacı, kelime analizi, APA 7 kaynakça ve çocuk dijital uygulaması
        </p>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="flex gap-2 flex-wrap pb-4 border-b border-[#1A1A1A]/10">
        {subNavItems.map((item) => {
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`px-4 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white text-[#1A1A1A]/70 border border-[#1A1A1A]/15 hover:bg-[#1A1A1A]/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content Panels */}
      <div className="pt-2">
        {activeTool === 'lgs' && <LgsCalculator />}
        {activeTool === 'tyt' && <TytCalculator />}
        {activeTool === 'ayt' && <AytCalculator />}
        {activeTool === 'kelime' && <WordCounter />}
        {activeTool === 'pomodoro' && <PomodoroTimer />}
        {activeTool === 'kaynak' && <ApaGenerator />}
        {activeTool === 'cocuk' && <KidsAppCard />}
      </div>
    </div>
  );
};
