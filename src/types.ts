export type PageTab = 'magaza' | 'uygulamalar' | 'hakkimda' | 'iletisim';
export type ToolTab = 'lgs' | 'tyt' | 'ayt' | 'kelime' | 'pomodoro' | 'kaynak' | 'cocuk';

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
