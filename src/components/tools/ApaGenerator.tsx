import React, { useState, useMemo } from 'react';
import { BookOpenText, Copy, Check } from 'lucide-react';

export const ApaGenerator: React.FC = () => {
  const [author, setAuthor] = useState<string>('Askar, M. A.');
  const [year, setYear] = useState<string>('2025');
  const [title, setTitle] = useState<string>("LGS'de Kendi Koçun Ol");
  const [publisher, setPublisher] = useState<string>('Antalya: Aşkar Yayınları');
  const [copied, setCopied] = useState<boolean>(false);

  const formattedApa = useMemo(() => {
    const a = author.trim();
    const y = year.trim() ? `(${year.trim()})` : '';
    const t = title.trim() ? `${title.trim()}` : '';
    const p = publisher.trim() ? `${publisher.trim()}` : '';

    const parts = [a, y, t, p].filter(Boolean);
    return parts.join('. ') + (parts.length > 0 ? '.' : '');
  }, [author, year, title, publisher]);

  const handleCopy = () => {
    if (!formattedApa) return;
    navigator.clipboard.writeText(formattedApa).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1A1A1A]/10">
        <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
          <BookOpenText className="w-5 h-5 text-[#C9A86A]" />
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
            AKADEMİK STANDARTLAR
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
            Kaynakça Oluşturucu (APA 7)
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1.5">
            Yazar Soyadı, Adının İlk Harfi
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Örn: Askar, M. A."
            className="w-full p-3 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] text-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1.5">
            Yayın Yılı
          </label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Örn: 2025"
            className="w-full p-3 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] text-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1.5">
            Eser / Kitap Başlığı
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: LGS'de Kendi Koçun Ol"
            className="w-full p-3 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] text-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1.5">
            Basım Yeri & Yayınevi
          </label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="Örn: Antalya: Aşkar Yayınları"
            className="w-full p-3 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] text-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none"
          />
        </div>
      </div>

      {/* Formatted Output Box */}
      <div className="p-5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl relative">
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C9A86A] block mb-2 font-bold">
          APA 7 BİÇİMİNDE KAYNAKÇA
        </span>

        <p className="text-sm font-serif italic text-[#1A1A1A] pr-28 py-1 select-all leading-relaxed">
          {formattedApa || 'Lütfen yukarıdaki alanları doldurun.'}
        </p>

        <button
          onClick={handleCopy}
          className={`absolute right-4 top-4 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest flex items-center gap-1.5 transition-all ${
            copied
              ? 'bg-emerald-700 text-white'
              : 'bg-[#1A1A1A] hover:bg-black text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>KOPYALANDI</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>KOPYALA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
