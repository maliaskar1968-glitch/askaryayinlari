import React from 'react';

interface WavingTurkishFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showPole?: boolean;
}

export const WavingTurkishFlag: React.FC<WavingTurkishFlagProps> = ({
  className = '',
  size = 'md',
  showPole = true,
}) => {
  // Sizing configurations
  const dimensions = {
    sm: { width: 32, height: 21, poleH: 26 },
    md: { width: 44, height: 29, poleH: 35 },
    lg: { width: 60, height: 40, poleH: 48 },
  }[size];

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      title="Şanlı Türk Bayrağı"
      aria-label="Dalgalanan Türk Bayrağı"
    >
      <style>{`
        @keyframes flagFlutter {
          0% {
            transform: perspective(400px) rotateY(0deg) skewY(0deg) scaleY(1);
          }
          25% {
            transform: perspective(400px) rotateY(14deg) skewY(3.5deg) scaleY(0.97);
          }
          50% {
            transform: perspective(400px) rotateY(-4deg) skewY(-2.5deg) scaleY(1.02);
          }
          75% {
            transform: perspective(400px) rotateY(16deg) skewY(4deg) scaleY(0.96);
          }
          100% {
            transform: perspective(400px) rotateY(0deg) skewY(0deg) scaleY(1);
          }
        }

        @keyframes waveRipples {
          0% {
            background-position: -120px 0;
          }
          100% {
            background-position: 120px 0;
          }
        }
      `}</style>

      {/* Flag Pole (Bayrak Direği) */}
      {showPole && (
        <div
          className="relative rounded-full z-10 shrink-0 mr-[1.5px]"
          style={{
            width: size === 'sm' ? '2.5px' : '3px',
            height: dimensions.poleH,
            background: 'linear-gradient(to bottom, #FDE047 0%, #D4AF37 30%, #9CA3AF 70%, #4B5563 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          {/* Golden Finial (Direk Tepeliği) */}
          <div
            className="absolute -top-1 -left-[2.5px] rounded-full shadow-xs"
            style={{
              width: size === 'sm' ? '6.5px' : '8px',
              height: size === 'sm' ? '6.5px' : '8px',
              background: 'radial-gradient(circle at 35% 35%, #FEF08A, #CA8A04, #854D0E)',
            }}
          />
        </div>
      )}

      {/* Flag Cloth with Wave Animation */}
      <div
        className="relative overflow-hidden rounded-[2px] shadow-md origin-left transition-transform"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          animation: 'flagFlutter 2.8s ease-in-out infinite',
          transformOrigin: 'left center',
        }}
      >
        {/* Official Turkish Flag SVG */}
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flag Red Field */}
          <rect width="1200" height="800" fill="#E30A17" />

          {/* Crescent Moon (Hilal) */}
          <circle cx="425" cy="400" r="200" fill="#FFFFFF" />
          <circle cx="475" cy="400" r="160" fill="#E30A17" />

          {/* 5-Pointed Star (Yıldız) */}
          <polygon
            points="583.33,400 700.82,438.19 655.93,316.81 655.93,483.19 700.82,361.81"
            fill="#FFFFFF"
          />
        </svg>

        {/* Realistic Wave Shadows and Highlights Overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 20%, rgba(0,0,0,0.4) 48%, rgba(255,255,255,0.3) 72%, rgba(0,0,0,0.35) 95%)',
            backgroundSize: '200% 100%',
            animation: 'waveRipples 2.8s ease-in-out infinite',
          }}
        />

        {/* Subtle cloth texture border */}
        <div className="absolute inset-0 border border-black/10 rounded-[2px] pointer-events-none" />
      </div>
    </div>
  );
};
