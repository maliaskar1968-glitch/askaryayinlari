import React, { useState, useEffect } from 'react';
import { getStoredImage, getCachedImageSync, subscribeImageChanges } from '../utils/imageStore';
import { BookOpen, Sparkles, Compass, Atom, Zap, GraduationCap, Trophy } from 'lucide-react';

interface ImgWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  badge?: string;
  badgeColor?: string;
  aspectRatio?: string;
}

export const ImgWithFallback: React.FC<ImgWithFallbackProps> = ({
  src,
  alt,
  className = '',
  badge,
  badgeColor,
  aspectRatio,
  ...props
}) => {
  const [displaySrc, setDisplaySrc] = useState<string>(() => {
    const cached = getCachedImageSync(src);
    return cached || src;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkStoredImage() {
      const stored = await getStoredImage(src);
      if (isMounted) {
        if (stored) {
          setDisplaySrc(stored);
          setHasError(false);
        } else {
          setDisplaySrc(src);
        }
      }
    }

    checkStoredImage();

    const unsubscribe = subscribeImageChanges(() => {
      checkStoredImage();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  // If image loaded successfully or is dataUrl from IndexedDB
  if (!hasError && displaySrc) {
    return (
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        loading="lazy"
        onError={handleError}
        {...props}
      />
    );
  }

  // Fallback views based on image name
  const cleanName = src.toLowerCase().split('/').pop() || '';

  // 1. Logo Fallback
  if (cleanName.includes('logo')) {
    return (
      <div className={`bg-[#0D0D0D] border border-[#C9A86A]/50 flex flex-col items-center justify-center text-center p-1 relative overflow-hidden select-none ${className}`}>
        <div className="absolute inset-0 bg-radial from-[#C9A86A]/20 to-transparent opacity-40 pointer-events-none" />
        <span className="text-base font-serif font-black text-[#C9A86A] tracking-wider leading-none">
          A
        </span>
        <span className="text-[6px] font-mono tracking-widest text-[#E6C687] uppercase scale-90">
          AŞKAR
        </span>
      </div>
    );
  }

  // 2. Kids Book Fallback: Sevimli Deniz Altı Kaşifleri
  if (cleanName.includes('cocuk')) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0C4A6E] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />
        
        {/* Top Tag */}
        <div className="flex items-center justify-between z-10">
          <div className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[8px] font-mono tracking-widest uppercase font-bold text-cyan-100 border border-white/20">
            AŞKAR ÇOCUK
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </div>

        {/* Center Title */}
        <div className="text-center my-auto py-2 z-10">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-2 border border-white/30 text-amber-300">
            <Compass className="w-5 h-5 text-cyan-200" />
          </div>
          <h4 className="text-base sm:text-lg font-serif font-black tracking-tight leading-tight text-white drop-shadow-sm">
            SEVİMLİ DENİZ ALTI KAŞİFLERİ
          </h4>
          <p className="text-[10px] text-cyan-200 mt-1 font-medium">
            Lili & Tosis ile Büyülü Hikayeler ve Boyama
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[8px] font-mono text-cyan-100/80 z-10">
          <span>4-8 YAŞ</span>
          <span className="text-amber-300 font-bold">MEHMET ALİ ASKAR</span>
        </div>
      </div>
    );
  }

  // 3. 5. Sınıf Fallback
  if (cleanName.includes('k5')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#1C1917] via-[#292524] to-[#0C0A09] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-[#C9A86A]/30 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-[#C9A86A] text-[#1A1A1A] text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
            5. SINIF
          </span>
          <BookOpen className="w-3.5 h-3.5 text-[#C9A86A]" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[10px] font-mono tracking-widest text-[#C9A86A] uppercase mb-1">
            ORTAOKUL KOÇUM
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            5. Sınıf Koçluk & Motivasyon
          </h4>
          <div className="w-8 h-0.5 bg-[#C9A86A] mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-neutral-400">
            Haftalık Ders Planı & Uyum Rehberi
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-[#C9A86A]/80 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 4. 6. Sınıf Fallback
  if (cleanName.includes('k6')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#1E1B4B] via-[#172554] to-[#0F172A] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-blue-400/30 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-blue-500 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
            6. SINIF
          </span>
          <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[10px] font-mono tracking-widest text-blue-300 uppercase mb-1">
            ORTAOKUL KOÇUM
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            6. Sınıf Disiplin ve Başarı
          </h4>
          <div className="w-8 h-0.5 bg-blue-400 mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-blue-200/70">
            Erteleme Alışkanlığını Yenme Rehberi
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-blue-300/80 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 5. 7. Sınıf Fallback
  if (cleanName.includes('k7')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#064E3B] via-[#065F46] to-[#022C22] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-emerald-400/30 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-emerald-500 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
            7. SINIF
          </span>
          <Trophy className="w-3.5 h-3.5 text-emerald-300" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase mb-1">
            LGS HAZIRLIK
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            7. Sınıf LGS Koçluk Kitabı
          </h4>
          <div className="w-8 h-0.5 bg-emerald-400 mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-emerald-200/70">
            1 Yıl Önceden Derece Stratejisi
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-emerald-300/80 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 6. 8. Sınıf LGS Fallback (Ana Kitap)
  if (cleanName.includes('k8')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#000000] via-[#1A1A1A] to-[#0D0D0D] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border-2 border-[#C9A86A] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-radial from-[#C9A86A]/20 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-center z-10">
          <span className="bg-[#C9A86A] text-black text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase shadow-xs">
            8. SINIF LGS
          </span>
          <span className="text-[8px] font-mono text-[#C9A86A] tracking-wider font-bold">
            ÖZ-KOÇLUK
          </span>
        </div>
        <div className="text-center my-auto z-10">
          <div className="text-[9px] font-mono tracking-[0.2em] text-[#C9A86A] uppercase mb-1">
            KENDİ KOÇUN OL
          </div>
          <h4 className="text-lg font-serif font-black text-white leading-tight">
            LGS 8. Sınıf Koçluk Kitabı
          </h4>
          <div className="w-10 h-0.5 bg-[#C9A86A] mx-auto my-2" />
          <p className="text-[9px] text-neutral-300">
            12 Adımlı Başarı & Net Artırma Rehberi
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-[#C9A86A] tracking-widest uppercase z-10">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 7. YKS Fallback
  if (cleanName.includes('yks')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#450A0A] via-[#7F1D1D] to-[#1C1917] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-red-400/40 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-red-600 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
            YKS • TYT • AYT
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[9px] font-mono tracking-[0.2em] text-amber-300 uppercase mb-1">
            ÜNİVERSİTEYE HAZIRLIK
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            YKS'de Kendi Koçun Ol
          </h4>
          <div className="w-8 h-0.5 bg-amber-400 mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-red-200/80">
            İrade, Disiplin & Zaman Yönetimi
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-amber-300 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 8. Şimşeğin Efendisi Tesla Fallback
  if (cleanName.includes('simsek')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#020617] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-indigo-400/40 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-indigo-600 text-white text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase">
            BİLİM ROMANI
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[8px] font-mono tracking-[0.2em] text-cyan-300 uppercase mb-1">
            NİKOLA TESLA
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            Şimşeğin Efendisi
          </h4>
          <div className="w-8 h-0.5 bg-cyan-400 mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-indigo-200/70">
            Tarihi Kurgu ve Bilim Macerası
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-cyan-300/80 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // 9. Atomun Kalbi Rutherford Fallback
  if (cleanName.includes('atom')) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-[#14532D] via-[#166534] to-[#052E16] text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-emerald-400/40 ${className}`}>
        <div className="flex justify-between items-center">
          <span className="bg-emerald-600 text-white text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase">
            BİLİMSEL ROMAN
          </span>
          <Atom className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <div className="text-center my-auto">
          <div className="text-[8px] font-mono tracking-[0.2em] text-emerald-300 uppercase mb-1">
            ERNEST RUTHERFORD
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-tight">
            Atomun Kalbi
          </h4>
          <div className="w-8 h-0.5 bg-emerald-400 mx-auto my-2 opacity-60" />
          <p className="text-[9px] text-emerald-200/70">
            Çekirdeğin Keşfi ve Bilim Yolculuğu
          </p>
        </div>
        <div className="text-center text-[8px] font-mono text-emerald-300/80 tracking-widest uppercase">
          MEHMET ALİ ASKAR
        </div>
      </div>
    );
  }

  // Generic Default Fallback
  return (
    <div className={`w-full h-full bg-[#1A1A1A] text-white p-4 flex flex-col items-center justify-center text-center relative overflow-hidden select-none ${className}`}>
      <BookOpen className="w-8 h-8 text-[#C9A86A] mb-2" />
      <div className="text-sm font-serif font-bold text-white leading-snug">{alt}</div>
      <div className="text-[8px] font-mono text-[#C9A86A] mt-2 uppercase tracking-widest">
        Aşkar Yayınları PDF
      </div>
    </div>
  );
};

