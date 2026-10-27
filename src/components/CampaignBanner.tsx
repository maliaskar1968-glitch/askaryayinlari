import React, { useState, useEffect } from 'react';
import { usePrice } from '../context/PriceContext';
import { getTimeRemaining } from '../utils/campaign';
import { WavingTurkishFlag } from './WavingTurkishFlag';
import { Sparkles, Clock, X, ArrowRight, Tag } from 'lucide-react';

export const CampaignBanner: React.FC = () => {
  const { activeCampaign } = usePrice();
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!activeCampaign) return;

    // Check if user dismissed this specific campaign in this session
    const dismissedKey = `askar_dismissed_campaign_${activeCampaign.id}`;
    if (sessionStorage.getItem(dismissedKey) === 'true') {
      setIsDismissed(true);
    } else {
      setIsDismissed(false);
    }

    const updateTimer = () => {
      const remaining = getTimeRemaining(activeCampaign.endDate);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCampaign]);

  if (!activeCampaign || isDismissed || timeLeft.isExpired) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(`askar_dismissed_campaign_${activeCampaign.id}`, 'true');
    } catch {}
  };

  const is29Ekim = activeCampaign.is29Ekim;

  return (
    <aside
      aria-label="Kampanya Duyurusu"
      className={`relative w-full text-white transition-all duration-300 shadow-md ${
        is29Ekim
          ? 'bg-gradient-to-r from-red-700 via-red-600 to-rose-700 border-b border-red-500/40'
          : 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 border-b border-amber-500/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Sol Taraf: Kampanya Başlığı & Açıklaması */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            {is29Ekim ? (
              <div className="flex items-center gap-1.5">
                <WavingTurkishFlag size="sm" />
              </div>
            ) : (
              <span className="p-1 rounded-full bg-white/20 text-white">
                <Tag className="w-4 h-4" />
              </span>
            )}
            <span className="bg-white text-[#1A1A1A] text-[10px] sm:text-[11px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
              {activeCampaign.badgeText}
            </span>
          </div>

          <div className="min-w-0 text-left">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight font-serif">
              {activeCampaign.bannerTitle}
            </h2>
            <p className="text-[10.5px] sm:text-xs text-white/90 font-sans mt-0.5 leading-snug">
              {activeCampaign.bannerSubtitle}
            </p>
          </div>
        </div>

        {/* Sağ Taraf: Canlı Geri Sayım & Aksiyon */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Geri Sayım Sayaç Kutuları */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-white/95 font-mono text-[10px] sm:text-xs font-bold">
            <Clock className="w-3.5 h-3.5 opacity-80 mr-0.5 hidden xs:inline" />
            <div className="bg-black/25 px-1.5 py-0.5 rounded text-center min-w-[24px]">
              {String(timeLeft.days).padStart(2, '0')}
              <span className="text-[8px] block opacity-75 font-sans font-normal">GÜN</span>
            </div>
            <span>:</span>
            <div className="bg-black/25 px-1.5 py-0.5 rounded text-center min-w-[24px]">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="text-[8px] block opacity-75 font-sans font-normal">SAAT</span>
            </div>
            <span>:</span>
            <div className="bg-black/25 px-1.5 py-0.5 rounded text-center min-w-[24px]">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="text-[8px] block opacity-75 font-sans font-normal">DK</span>
            </div>
            <span>:</span>
            <div className="bg-black/25 px-1.5 py-0.5 rounded text-center min-w-[24px]">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="text-[8px] block opacity-75 font-sans font-normal">SN</span>
            </div>
          </div>

          {/* İncele Butonu */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('book-grid-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }
            }}
            className="bg-white hover:bg-neutral-100 text-[#1A1A1A] text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition-all transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0"
          >
            <span>KİTAPLARI İNCELE</span>
            <ArrowRight className="w-3 h-3 text-red-600" />
          </button>

          {/* Kapat Butonu */}
          <button
            type="button"
            onClick={handleDismiss}
            title="Duyuruyu gizle"
            aria-label="Duyuruyu gizle"
            className="text-white/70 hover:text-white p-1 transition-colors rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
