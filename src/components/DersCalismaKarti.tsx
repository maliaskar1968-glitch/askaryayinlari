import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GuideLevel, STUDY_GUIDES, StudyGuide } from '../data/studyGuideRegistry';

type GuideSectionLevel = GuideLevel | 'tyt-ayt';

const levelThemes: Record<GuideLevel, { accent: string; border: string; badge: string }> = {
  ortaokul: { accent: 'text-emerald-700', border: 'hover:border-emerald-400', badge: 'bg-emerald-700' },
  lgs: { accent: 'text-cyan-800', border: 'hover:border-cyan-500', badge: 'bg-cyan-800' },
  lise: { accent: 'text-blue-700', border: 'hover:border-blue-400', badge: 'bg-blue-700' },
  tyt: { accent: 'text-orange-700', border: 'hover:border-orange-400', badge: 'bg-orange-700' },
  ayt: { accent: 'text-rose-700', border: 'hover:border-rose-400', badge: 'bg-rose-700' },
  mezun: { accent: 'text-slate-800', border: 'hover:border-slate-500', badge: 'bg-slate-800' }
};

const levelLabels: Record<GuideLevel, string> = {
  ortaokul: 'ORTAOKUL',
  lgs: 'LGS',
  lise: 'LİSE',
  tyt: 'TYT',
  ayt: 'AYT',
  mezun: 'MEZUN'
};

interface StudyGuideCardProps {
  guide: StudyGuide;
  onSelectGuide: (slug: string) => void;
}

export const StudyGuideCard: React.FC<StudyGuideCardProps> = ({ guide, onSelectGuide }) => {
  const theme = levelThemes[guide.seviye];
  const cardTitle = guide.ad.endsWith('Nasıl Çalışılır?') ? guide.ad : `${guide.ad} Nasıl Çalışılır?`;

  return (
    <button
      type="button"
      onClick={() => onSelectGuide(guide.slug)}
      className={`group min-w-0 overflow-hidden rounded-xl border border-[#1A1A1A]/10 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${theme.border}`}
      aria-label={`${cardTitle} rehberini aç`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <img src={guide.resim} alt={`${guide.ad} çalışma rehberi`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-mono font-bold text-white shadow ${theme.badge}`}>
          {levelLabels[guide.seviye]}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="min-h-10 text-sm sm:text-base font-serif font-bold leading-snug text-[#1A1A1A]">
          {cardTitle}
        </h3>
        <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${theme.accent}`}>
          Rehberi aç <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
};

interface DersCalismaKartiProps {
  level: GuideSectionLevel;
  title: string;
  onSelectGuide: (slug: string) => void;
}

export const DersCalismaKarti: React.FC<DersCalismaKartiProps> = ({ level, title, onSelectGuide }) => {
  const guides = STUDY_GUIDES.filter((guide) =>
    level === 'tyt-ayt' ? guide.seviye === 'tyt' || guide.seviye === 'ayt' : guide.seviye === level
  );

  return (
    <section aria-labelledby={`study-guides-${level}`} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-[#1A1A1A]/10 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#856526]">
            DERS DERS İLERLE
          </span>
          <h2 id={`study-guides-${level}`} className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A]">
            {title}
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/60">Uygulanabilir çalışma planı ve sınav taktikleri.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        {guides.map((guide) => (
          <StudyGuideCard key={guide.slug} guide={guide} onSelectGuide={onSelectGuide} />
        ))}
      </div>
    </section>
  );
};
