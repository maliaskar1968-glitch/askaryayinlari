import React from 'react';
import { X, Award, GraduationCap, Target, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface NotAvcisiObpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotAvcisiObpModal: React.FC<NotAvcisiObpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1E1B18] via-[#25221E] to-[#1A1A1A] border-2 border-[#C9A86A]/70 text-white shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık Rozeti */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/40 text-[#E5C98E] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-bold mb-3">
          <Award className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>BAŞARI STRATEJİSİ • OBP REHBERİ</span>
        </div>

        {/* Ana Başlık */}
        <h2 className="text-xl sm:text-2xl font-serif font-black text-white mb-2 leading-snug">
          Okul Yazılı Notlarının <span className="text-[#C9A86A]">LGS ve YKS'ye</span> Hayati Etkisi
        </h2>
        <p className="text-xs text-zinc-300 mb-6 font-sans leading-relaxed">
          Sınavlarda binlerce adayın önüne geçiren gizli güç: Okul sınavlarında aldığınız her 1 puan, geleceğinizi doğrudan şekillendirir.
        </p>

        <div className="space-y-4">
          {/* 1. LGS & Ortaokul (6, 7, 8. Sınıf) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-[#C9A86A]/30">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-amber-200">
                1. Ortaokul & LGS’de Okul Notunun Önemi (6, 7 ve 8. Sınıf)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-sans leading-relaxed pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Adrese Dayalı Lise Yerleştirmesi:</strong> Sınavsız alan Anadolu ve Fen liselerine girişte 6, 7 ve 8. sınıf yıl sonu başarı puanlarının ortalaması (OBP) kullanılır. 1 puanlık fark, sizi istediğiniz lisenin asil listesine yerleştirir.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>LGS Sınav Özgüveni:</strong> MEB ortak yazılılarından 90-100 alan öğrenci konu eksiklerini önceden kapattığı için LGS maratonunda sınav kaygısı yaşamaz, yeni nesil soruları rahat çözer.
                </span>
              </li>
            </ul>
          </div>

          {/* 2. YKS & Lise (9, 10, 11, 12. Sınıf) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-emerald-500/30">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-emerald-200">
                2. YKS’de Diploma Notu (OBP): Sıralamayı Değiştiren Asıl Güç
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-sans leading-relaxed pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Doğrudan YKS Puanına Eklenir:</strong> 9, 10, 11 ve 12. sınıf yazılı notlarının ortalaması OBP'ye dönüştürülür ve bunun %12'si (<strong>30 ila 60 puan</strong> arası) ham YKS puanınıza eklenir!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>50.000 Sıralama Farkı:</strong> 100 diploma notu olan aday 60 tam puan alırken, 70 ortalamalı aday 42 puan alır. Aradaki 18 puanlık fark, Sayısal ve Eşit Ağırlıkta sizi <strong>30.000 ile 70.000 adayın</strong> önüne taşır!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Telafisi Yoktur:</strong> YKS sınavına mezuna kalarak tekrar girebilirsiniz; ancak lise yazılı notlarınızı mezun olduktan sonra bir daha asla değiştiremezsiniz!
                </span>
              </li>
            </ul>
          </div>

          {/* 3. Not Avcısı Formülü */}
          <div className="p-4 rounded-2xl bg-[#C9A86A]/10 border border-[#C9A86A]/40 text-center">
            <h4 className="text-xs font-bold text-[#E5C98E] uppercase tracking-wider mb-1">
              🎯 ÇÖZÜM: NOT AVCISI İLE MEB YAZILILARINA HAZIRLANMAK
            </h4>
            <p className="text-[11px] text-zinc-300 leading-relaxed max-w-xl mx-auto">
              Gerçek sınav ortamında 40 dakikalık süreli provalar çözün, eksik kazanımlarınızı sınavdan önce tespit edin ve her dönem karnenize <strong>100 Tam Puanı</strong> yazdırın!
            </p>
          </div>
        </div>

        {/* Kapat Butonu */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg hover:scale-102"
          >
            <span>Anladım, 100 Tam Puan İçin Provalara Başla ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
