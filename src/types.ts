export type PageTab = 'magaza' | 'uygulamalar' | 'rehber' | 'hakkimda' | 'hakkimizda' | 'iletisim' | 'admin-kilavuz';
export type ToolTab = 'lgs' | 'tyt' | 'ayt' | 'yks' | 'kelime' | 'pomodoro' | 'kaynak' | 'cocuk' | 'iokbs' | 'takdir' | 'kap' | 'tercih' | 'lgs-sayac' | 'yks-sayac' | 'altin-is' | 'lise-ortalama';
export type FilterCategory = 'tumu' | '5' | '6' | '7' | '8-lgs' | 'lise' | 'yks';

export interface ShareItem {
  title: string;
  subtitle: string;
  image: string;
  shopierUrl?: string;
  url?: string;
  badge?: string;
  isSiteShare?: boolean;
}

export interface Book {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  image: string;
  shopierUrl: string;
  shopierId: string;
  isSpecialLink?: boolean;
  price?: string;
  originalPrice?: string;
  previewUrl?: string;
  description?: string;
  contentDetails?: string;
  altBaslik?: string;
  pageCount?: string | number;
  format?: string;
}

export interface ValueCard {
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface LgsSubjectScore {
  d: number;
  y: number;
}

export interface TytSubjectScore {
  d: number;
  y: number;
}

export interface AytSubjectScore {
  d: number;
  y: number;
}

