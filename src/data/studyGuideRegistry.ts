import middleSchoolData from './ders-calisma-rehberi.json';
import highSchoolData from './lise-dersleri.json';
import tytAytData from './tyt-ayt-rehberi.json';
import graduateData from './mezun-rehberi.json';
import lgsData from './lgs-rehberi.json';

export type GuideLevel = 'ortaokul' | 'lgs' | 'lise' | 'tyt' | 'ayt' | 'mezun';

export interface StudyGuide {
  id: string;
  ad: string;
  seviye: GuideLevel;
  slug: string;
  resim: string;
  kisa: string[];
  uzun: {
    basari: string;
    dikkat: string;
    hatalar: string;
    haftalik: string;
  };
  anahtarKelimeler: string[];
}

const middleSchoolGuides: StudyGuide[] = (middleSchoolData as Omit<StudyGuide, 'seviye' | 'slug' | 'anahtarKelimeler'>[]).map((guide) => ({
  ...guide,
  seviye: 'ortaokul',
  slug: `ortaokul-${guide.id}-nasil-calisilir`,
  anahtarKelimeler: [guide.id, 'ortaokul ders çalışma', 'nasıl çalışılır']
}));

export const STUDY_GUIDES: StudyGuide[] = [
  ...middleSchoolGuides,
  ...(lgsData as StudyGuide[]),
  ...(highSchoolData as StudyGuide[]),
  ...(tytAytData as StudyGuide[]),
  ...(graduateData as StudyGuide[])
];

export const SEO_GUIDES = STUDY_GUIDES;

export const getStudyGuideBySlug = (slug: string): StudyGuide | undefined =>
  STUDY_GUIDES.find((guide) => guide.slug === slug);
