import React from 'react';
import { KIDS_APP_URL } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { Sparkles, ExternalLink, Gamepad2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-center my-6 overflow-hidden relative">
      <div className="w-full md:w-64 aspect-square rounded-xl overflow-hidden shrink-0 border border-[#1A1A1A]/10 relative group bg-[#F8F7F4] flex items-center justify-center">
        <ImgWithFallback
          src="/resimler/cocuk.png"
          alt="Sevimli Deniz Altı Kaşifleri"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest text-white/90 bg-[#1A1A1A]/70 px-2 py-0.5 rounded backdrop-blur-xs">
          REF. 092-KIDS
        </div>
      </div>

      <div className="flex-1 space-y-4 text-left">
        {/* Action Button (Moved to Top) */}
        <div>
          <a
            href={KIDS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-black text-white px-5 sm:px-6 py-3 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Gamepad2 className="w-4 h-4 text-[#C9A86A]" />
            <span>ÇOCUKLARA ARMAĞANIMIZDIR - TIKLA OYNA</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </a>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1A1A1A] leading-[1.05] tracking-tight">
          Sevimli Deniz Altı <br className="hidden sm:inline" />
          <span className="italic text-[#C9A86A] font-normal">Kaşifleri</span>
        </h1>

        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm leading-relaxed max-w-xl">
          Yıldız Kaşif Olmaya Hazır mısın? Çocuklar için Yaratıcılık ve Beceri Gelişimi - Sesli Dijital Çocuk Uygulaması. Güvenli, reklamsız, eğitici çocuk boyama ve masal dünyası.
        </p>

        {/* Feature & Safety Badge (Moved to Bottom with Updated Text) */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] border border-[#1A1A1A]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>ÇOCUKLAR İÇİN GÜVENLİ UYGULAMA • BOYAMA • MASAL</span>
          </div>
        </div>
      </div>

      {/* Right Side: Star with 'ÜCRETSİZ' Badge */}
      <div className="shrink-0 flex items-center justify-center my-2 md:my-0">
        <a
          href={KIDS_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Sevimli Deniz Altı Kaşifleri - Ücretsiz Çevrim İçi Uygulamayı Başlat"
          className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <div className="relative -rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <svg
              viewBox="0 0 140 140"
              className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 drop-shadow-xl"
            >
              <defs>
                <linearGradient id="starGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="starStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF9C3" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#D97706" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* 5-Pointed Golden Star */}
              <polygon
                points="70,8 88.2,44.9 128.9,50.8 99.5,79.6 106.4,120.2 70,101 33.6,120.2 40.5,79.6 11.1,50.8 51.8,44.9"
                fill="url(#starGoldGrad)"
                stroke="url(#starStrokeGrad)"
                strokeWidth="3"
                strokeLinejoin="round"
                filter="url(#starGlow)"
              />

              {/* Inner Decorative Dashed Ring */}
              <circle
                cx="70"
                cy="72"
                r="30"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                opacity="0.75"
              />

              {/* Centered 'ÜCRETSİZ' Text */}
              <text
                x="70"
                y="70"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#1A1A1A"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '12.5px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                }}
              >
                ÜCRETSİZ
              </text>
              <text
                x="70"
                y="84"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#78350F"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '7px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                }}
              >
                TIKLA OYNA
              </text>
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};
