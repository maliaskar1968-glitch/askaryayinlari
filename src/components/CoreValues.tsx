import React from 'react';
import { Tablet, PenTool, Leaf } from 'lucide-react';

export const CoreValues: React.FC = () => {
  const values = [
    {
      num: '01',
      icon: <Tablet className="w-5 h-5 text-[#C9A86A]" />,
      title: 'Dijital Erişilebilirlik',
      description:
        'Okumayı zamandan ve mekandan bağımsız kılıyor, geniş kitlelere uygun fiyatlı ve anında ulaşılabilir dijital formatlar sunuyoruz.',
    },
    {
      num: '02',
      icon: <PenTool className="w-5 h-5 text-[#C9A86A]" />,
      title: 'ÖZGÜN YAZARLIK',
      description:
        'Her bir satır kendi kalemimden dökülen, samimiyet ve kültürel bağları merkeze alan, okuyucuyla doğrudan konuşan eserler üretiyoruz.',
    },
    {
      num: '03',
      icon: <Leaf className="w-5 h-5 text-[#C9A86A]" />,
      title: 'Sürdürülebilir Okuma',
      description:
        'Fiziksel baskı süreçlerinin ötesine geçerek, modern trendlere uygun, pratik ve çevreye duyarlı bir okuma alışkanlığını teşvik ediyoruz.',
    },
  ];

  return (
    <div className="bg-[#1A1A1A] text-[#F8F7F4] p-8 sm:p-12 rounded-2xl my-10 border border-[#1A1A1A] shadow-md relative overflow-hidden">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#C9A86A]">
          Prensiplerimiz
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
          Temel Değerlerimiz
        </h2>
        <p className="text-xs text-[#F8F7F4]/60 font-sans tracking-wide">
          Aşkar Yayınları ilkeleri ve yayıncılık vizyonu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-xl p-6 bg-white/[0.03] transition-all hover:border-[#C9A86A]/50 relative"
          >
            <div className="text-[10px] font-mono tracking-widest text-[#C9A86A]/60 mb-4">
              PRINCIPLE // {v.num}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">{v.icon}</div>
              <h3 className="font-serif font-bold text-base text-white">{v.title}</h3>
            </div>
            <p className="text-xs text-[#F8F7F4]/70 leading-relaxed font-sans mt-2">
              {v.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
