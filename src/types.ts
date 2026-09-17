export type PageTab = 'magaza' | 'uygulamalar' | 'hakkimda' | 'hakkimizda' | 'iletisim';
export type ToolTab = 'lgs' | 'tyt' | 'ayt' | 'kelime' | 'pomodoro' | 'kaynak' | 'cocuk';

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

