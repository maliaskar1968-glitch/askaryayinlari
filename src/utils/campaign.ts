export interface Campaign {
  id: string;
  name: string;
  shortTitle: string;
  code?: string;
  discountPercent: number; // e.g. 50 or 30
  startDate: string; // ISO 8601 string
  endDate: string; // ISO 8601 string
  badgeText: string;
  bannerTitle: string;
  bannerSubtitle: string;
  ctaText: string;
  is29Ekim?: boolean;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cumhuriyet_bayrami',
    name: '29 EKİM CUMHURİYET BAYRAMI',
    shortTitle: '29 Ekim Cumhuriyet Bayramı Kampanyası',
    discountPercent: 50,
    // 27.10.2026 12:30'dan 01.11.2026 23:59:59'a kadar
    startDate: '2026-10-27T00:00:00+03:00',
    endDate: '2026-11-01T23:59:59+03:00',
    badgeText: '%50 İNDİRİM',
    bannerTitle: '29 EKİM CUMHURİYET BAYRAMI ÖZEL KAMPANYASI',
    bannerSubtitle: 'Cumhuriyetimizin onuruna tüm dijital kitaplarda çizili liste fiyatı üzerinden net %50 İNDİRİM!',
    ctaText: 'Kargo Yok • Anında PDF Teslimat',
    is29Ekim: true
  },
  {
    id: 'hosgeldin',
    name: 'HOŞGELDİN',
    shortTitle: 'Hoş Geldin İndirim Kampanyası',
    code: 'HOŞGELDİN',
    discountPercent: 30,
    // 02.11.2026 00:00'dan 31.12.2026 00:00'a kadar
    startDate: '2026-11-02T00:00:00+03:00',
    endDate: '2026-12-31T00:00:00+03:00',
    badgeText: '%30 İNDİRİM (KOD: HOŞGELDİN)',
    bannerTitle: '🎉 HOŞ GELDİN KAMPANYASI • %30 İNDİRİM',
    bannerSubtitle: 'Çizili fiyatlar üzerinden %30 indirim! İndirim Kodu: HOŞGELDİN',
    ctaText: "31 Aralık 00:00'a kadar geçerli",
    is29Ekim: false
  }
];

/**
 * Mevcut tarih veya verilen tarihe göre geçerli aktif kampanyayı döner.
 */
export function getActiveCampaign(targetDate: Date = new Date()): Campaign | null {
  const targetTime = targetDate.getTime();
  for (const camp of CAMPAIGNS) {
    const start = new Date(camp.startDate).getTime();
    const end = new Date(camp.endDate).getTime();
    if (targetTime >= start && targetTime <= end) {
      return camp;
    }
  }
  return null;
}

/**
 * Fiyat dizesinden (örn: "250 ₺") sayısal değeri ayıklar.
 */
export function parsePriceNumber(priceStr?: string): number {
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Verilen orijinal fiyat ve indirim yüzdesine göre yeni fiyatı döner.
 */
export function calculateDiscount(originalPriceStr: string, discountPercent: number): string {
  const original = parsePriceNumber(originalPriceStr);
  if (!original) return originalPriceStr;
  const discounted = Math.round(original * (1 - discountPercent / 100));
  return `${discounted} ₺`;
}

/**
 * Verilen orijinal fiyat ve aktif kampanyaya göre fiyatı döner.
 */
export function getCampaignDiscountedPrice(
  originalPriceStr?: string,
  campaign: Campaign | null = getActiveCampaign()
): string | null {
  if (!originalPriceStr) return null;
  if (!campaign) return null;
  return calculateDiscount(originalPriceStr, campaign.discountPercent);
}

/**
 * Bitiş tarihine kalan süreyi hesaplar.
 */
export function getTimeRemaining(endDateStr: string) {
  const total = new Date(endDateStr).getTime() - Date.now();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds, isExpired: false };
}
