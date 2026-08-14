import React from 'react';
import { MAIN_SHOPIER_URL } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { MottoSection } from './MottoSection';
import { ShoppingBag, Award, BookOpen, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-8 my-8">
      {/* Top Motto Section */}
      <MottoSection showAuthorPhoto={true} />

      {/* Main About Details Grid */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-8 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#1A1A1A]/10 mb-4">
            <Award className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>YAYINCILIK VİZYONUMUZ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1A1A1A] leading-tight tracking-tight mb-4">
            Pratik, Erişilebilir, <br />
            <span className="italic font-normal text-[#C9A86A]">Özgün Eserler.</span>
          </h2>

          <div className="w-12 h-[2px] bg-[#1A1A1A]/20 mb-6" />

          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans mb-4">
            Aşkar Yayınları, okuma eylemini çağımızın dinamiklerine uygun hale getirmek amacıyla doğdu. Fonksiyonel ve faydacı bir yaklaşımla, her yaş grubuna hitap eden rehberlik, koçluk ve edebi roman içerikleri üretiyoruz.
          </p>

          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans mb-6">
            Kitaplarımızın tamamını dijital PDF formatında sunuyoruz. Bu sayede fiziksel sınırları kaldırıyor, bilginin ve hayal gücünün kitlelere en saf, en erişilebilir haliyle ulaşmasını sağlıyoruz.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-[#1A1A1A]/10">
            <div>
              <div className="font-serif font-bold text-[#1A1A1A] text-base">Mehmet Ali Askar</div>
              <div className="text-xs text-[#1A1A1A]/60 font-sans flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Kurucu, Eğitimci, Yazar</span>
              </div>
            </div>

            <a
              href={MAIN_SHOPIER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:ml-auto inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>SHOPIER MAĞAZASI</span>
            </a>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-2xl p-8 text-center space-y-5 relative">
          <div className="text-[9px] font-mono tracking-widest text-[#1A1A1A]/40 uppercase">
            REF. MEHMET-ALI-ASKAR
          </div>

          <div className="flex justify-center">
            <ImgWithFallback
              src="/logo.jpg"
              alt="Mehmet Ali Askar"
              className="w-32 h-32 rounded-full border border-[#C9A86A]/40 object-cover shadow-md bg-black"
            />
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Mehmet Ali Askar</h3>
            <p className="text-xs text-[#C9A86A] font-mono uppercase tracking-[0.2em] mt-1">
              Eğitimci, Yönetici & Yazar
            </p>
          </div>

          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed max-w-sm mx-auto font-sans">
            Okul öncesinden LGS ve YKS hazırlığına koçluk sistemleri, tarihi kurgu romanlar ve çocuklar için dijital uygulamalar.
          </p>

          <div className="pt-4 border-t border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A]/60 font-sans flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C9A86A]" />
            <span>Tüm PDF Yayınlarımız Shopier Güvencesiyle Anında İndirilebilir</span>
          </div>
        </div>
      </div>
    </div>
  );
};
