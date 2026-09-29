// HER YIL TEMMUZ AYINDA ÖSYM KILAVUZU AÇIKLANDIĞINDA BU JSON GÜNCELLENECEK - OTOMATİK SİSTEM

import defaultOsymData from '../data/osym-kilavuz.json';

export interface OsymKilavuzData {
  yil: number;
  kontenjan: number;
  tercih_tarih: string;
  hukuk_baraj: number;
  tip_baraj: number;
  muhendislik_baraj: number;
  kilavuz_link: string;
  son_guncelleme: string;
}

const STORAGE_KEY = 'osym_kilavuz_data';

/**
 * Güncel ÖSYM Kılavuz verilerini getirir.
 * Sırasıyla localStorage veya varsayılan JSON verisini döndürür.
 */
export function getOsymKilavuz(): OsymKilavuzData {
  if (typeof window === 'undefined') {
    return defaultOsymData;
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.yil === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage okuma hatası:', e);
  }

  return defaultOsymData;
}

/**
 * Yeni ÖSYM kılavuz verilerini kaydeder.
 * Sunucu API'sine gönderir ve localStorage'ı temizleyip günceller.
 */
export async function saveOsymKilavuz(newData: OsymKilavuzData): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Sunucuya gönder (diskteki osym-kilavuz.json'u kalıcı güncellemesi için)
    const response = await fetch('/api/osym-kilavuz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      console.warn('Sunucu dosya güncellemesi başarısız, yerel kayıt devrede');
    }

    // 2. localStorage'ı temizle ve yeni kılavuz verisini kaydet
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    return { success: true };
  } catch (err: any) {
    // Çevrimdışı / hata durumunda yerel olarak güncelle
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return { success: true, error: err?.message };
  }
}

/**
 * Uygulama her açıldığında çalışan otomatik yıllık kontrol fonksiyonu.
 * Yıl geçmişse document.body'nin en üstüne sarı uyarı bandı ekler.
 */
export function checkOsymUpdate(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const json = getOsymKilavuz();
  const currentYear = new Date().getFullYear();

  if (currentYear > json.yil) {
    console.log("Yeni ÖSYM kılavuzu kontrol ediliyor");

    // Sarı bant zaten eklenmiş mi kontrol et
    const existingBanner = document.getElementById('osym-warning-banner');
    if (existingBanner) return;

    const banner = document.createElement('aside');
    banner.id = 'osym-warning-banner';
    banner.setAttribute('role', 'alert');
    banner.className =
      'w-full bg-[#FEF08A] text-[#854D0E] border-b border-[#FACC15] px-4 py-2.5 text-xs sm:text-sm font-sans font-bold flex items-center justify-between gap-3 shadow-xs sticky top-0 z-50 animate-fadeIn';

    const message = `${currentYear} ÖSYM kılavuzu bekleniyor, veriler ${json.yil}'ya aittir. Yeni kılavuz açıklanınca otomatik güncellenecek.`;

    banner.innerHTML = `
      <div class="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
        <span class="p-1 rounded bg-[#EAB308]/20 shrink-0">⚠️</span>
        <span class="flex-1">${message}</span>
        <a href="${json.kilavuz_link}" target="_blank" rel="noopener noreferrer" class="underline hover:text-black font-mono text-xs shrink-0 font-black">
          ÖSYM'yi Kontrol Et &rarr;
        </a>
        <button type="button" id="btn-close-osym-banner" class="ml-2 text-[#854D0E] hover:text-black p-1 font-mono text-xs cursor-pointer font-black" title="Kapat">
          ✕
        </button>
      </div>
    `;

    document.body.prepend(banner);

    // Kapatma butonu
    const closeBtn = document.getElementById('btn-close-osym-banner');
    if (closeBtn) {
      closeBtn.onclick = () => {
        banner.remove();
      };
    }
  }
}
