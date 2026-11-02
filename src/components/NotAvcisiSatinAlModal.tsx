import React from 'react';
import { X, Sparkles, AlertCircle, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NotAvcisiSinifKart, OgrenciProfil } from '../types/notAvcisiTypes';

interface NotAvcisiSatinAlModalProps {
  isOpen: boolean;
  onClose: () => void;
  kart?: NotAvcisiSinifKart | null;
  ogrenci?: OgrenciProfil | null;
}

export const NotAvcisiSatinAlModal: React.FC<NotAvcisiSatinAlModalProps> = ({
  isOpen,
  onClose,
  kart,
  ogrenci
}) => {
  if (!isOpen || !kart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100 space-y-5">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Üst Başlık & Koç Baykuş */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-slate-950 mb-3 shadow-lg shadow-amber-500/20">
            <img
              src="/resimler/branding/not-avcisi-baykus.jpg"
              alt="Koç Baykuş"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NOT AVCISI KULÜBÜ GÜVENLİ ÖDEME</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {kart.baslik} Yıllık Kulüp Lisansı
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {kart.altBaslik} • 1. ve 2. Dönem Tüm MEB Açık Uçlu Sınav Provaları
          </p>
        </div>

        {/* Fiyat Bilgisi */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">YILLIK LİSANS ÜCRETİ</span>
            <span className="text-2xl font-black text-amber-400">790 TL</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-400 font-bold block">Bayi Kodu ile %10 İndirimli:</span>
            <span className="text-lg font-black text-white">711 TL</span>
            <span className="text-[10px] text-slate-400 block">(Shopier kupon alanında uygulanır)</span>
          </div>
        </div>

        {/* DİKKAT: KAYIT YAPTIRDIĞINIZ E-POSTA ADRESİ İLE SATIN ALINIZ */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 text-left text-xs text-slate-200 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>DİKKAT: KAYIT YAPTIRDIĞINIZ E-POSTA ADRESİ İLE SATIN ALINIZ</span>
          </div>
          <p className="text-xs text-slate-300 pl-7 leading-relaxed">
            Ödemeniz tamamlandığında Not Avcısı lisansınızın ve MEB sınav provalarınızın hesabınızla anında ve otomatik eşleşebilmesi için, lütfen Shopier ödeme formundaki e-posta alanına <strong>sisteme kayıt yaptırdığınız e-posta adresini</strong> giriniz.
          </p>
          
          {ogrenci?.eposta ? (
            <div className="ml-7 p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span>✓ Sisteme Kayıtlı E-Postanız: <strong>{ogrenci.eposta}</strong></span>
              <span className="text-[10px] text-emerald-400 uppercase font-sans font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eşleşmeye Hazır
              </span>
            </div>
          ) : (
            <div className="ml-7 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
              💡 Henüz kulübe kayıt olmadıysanız, Shopier formuna yazacağınız bu e-posta adresi ile Not Avcısı'na ücretsiz kaydolabilirsiniz.
            </div>
          )}
        </div>

        {/* İPTAL VE İADE KOŞULLARI (SHOPIER GÜVENCESİ) */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-left leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>İptal ve İade Koşulları (Shopier Güvencesi)</span>
          </div>
          <p>
            Not Avcısı dijital lisans ödemeleri Shopier altyapısıyla güvenle gerçekleştirilmektedir. Satın alımlarda <strong>Shopier Tüketici İptal ve İade Koşulları</strong> ile Mesafeli Satış Sözleşmesi hükümleri geçerlidir. Dijital içerik ve anında ifa edilen hizmetlerde yasal mevzuata uygun olarak işlem tesis edilir.
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Vazgeç
          </button>
          
          <a
            href={kart.shopierUrl || 'https://www.shopier.com/mehmetaliaskar/52508073'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <span>Kayıt Yaptırdığınız E-Posta ile Satın Al (Shopier)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </div>
  );
};
