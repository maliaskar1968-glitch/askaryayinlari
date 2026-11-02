import React from 'react';
import { Target, Award, CheckCircle, AlertTriangle, RefreshCw, BookOpen, Star, Sparkles, ArrowRight, Share2, FileDown } from 'lucide-react';
import { SinavSonuc, OgrenciProfil } from '../types/notAvcisiTypes';
import { generateNotAvcisiKarnePdf } from '../utils/generateNotAvcisiKarnePdf';

interface NotAvcisiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sonuc: SinavSonuc;
  ogrenciAdi?: string;
  profil?: OgrenciProfil | null;
  onRetakeExam?: () => void;
}

export const NotAvcisiReportModal: React.FC<NotAvcisiReportModalProps> = ({
  isOpen,
  onClose,
  sonuc,
  ogrenciAdi = 'Öğrenci',
  profil,
  onRetakeExam
}) => {
  if (!isOpen) return null;

  // Başarı derecesi
  const getBadgeInfo = (puan: number) => {
    if (puan >= 85) return { text: 'YAZILI ŞAMPİYONU ⭐', color: 'from-amber-400 to-amber-600', textColor: 'text-amber-300' };
    if (puan >= 70) return { text: 'BAŞARILI AVCI 🎯', color: 'from-emerald-400 to-emerald-600', textColor: 'text-emerald-300' };
    if (puan >= 50) return { text: 'GELİŞTİRİLEBİLİR 📈', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-300' };
    return { text: 'ACİL TEKRAR GEREKİYOR ⚠️', color: 'from-rose-400 to-rose-600', textColor: 'text-rose-300' };
  };

  const badge = getBadgeInfo(sonuc.alinanPuan);

  const handleDownloadPdf = () => {
    generateNotAvcisiKarnePdf(sonuc, profil);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        
        {/* Üst Başlık & Koç Baykuş Karşılama */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-950">
            <img
              src="/resimler/branding/not-avcisi-baykus.jpg"
              alt="Koç Baykuş"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 ${badge.textColor} mb-1`}>
              {badge.text}
            </div>
            <h3 className="text-2xl font-black text-white">
              Tebrikler, {ogrenciAdi}! Sınav Karnen Hazır 🦉
            </h3>
            <p className="text-xs text-slate-400">
              {sonuc.sinif}. Sınıf {sonuc.dersAdi} • Not Avcısı Yazılı Ön Hazırlık Raporu
            </p>
          </div>
        </div>

        {/* Büyük Skor Göstergesi */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 text-amber-500/10 text-8xl font-black">100</div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-widest block mb-1">
            BU DENEME PROVADAN ALDIĞIN NOT
          </span>
          <div className="text-6xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            {sonuc.alinanPuan} <span className="text-2xl text-slate-500 font-bold">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tamamlanma Süresi: {Math.floor(sonuc.harcananSureSaniye / 60)} Dakika {sonuc.harcananSureSaniye % 60} Saniye
          </p>
        </div>

        {/* Eksik Kazanımlar ve Nokta Atışı Koçluk Reçetesi */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Kazanım Röntgeni & Koçun Gelişim Tavsiyeleri</span>
          </h4>

          {sonuc.eksikKazanimlar.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Muhteşem! Tüm soruları ve kazanımları tam puanla tamamladın. Gerçek yazılıda 100 seni bekliyor!</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {sonuc.eksikKazanimlar.map((ek, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="text-amber-300">{ek.konu} ({ek.kazanimKodu})</span>
                    <span className="text-rose-400">-{ek.kaybedilenPuan} Puan</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-amber-400">🦉 Koçunun Notu: </strong> {ek.tavsiye}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Satın Alma Fırsatı (Shopier & Yıllık Not Avcısı Lisansı) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border-2 border-amber-500/50 shadow-xl mb-6 text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sınavı Beğendiniz mi? 100 Tam Puanı Garantileyin!</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            Tüm Dönem Yazılıları ve Tüm Derslerin MEB Simülasyonlarına Sınırsız Erişin!
          </h4>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            1. ve 2. dönem tüm açık uçlu MEB provaları, nokta atışı eksik kazanım analiz karneleri ve Aşkar Koçluk rehberliği tek bir lisansla cebinizde.
          </p>

          {/* E-Posta İle Satın Alma Uyarısı */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-left text-xs text-slate-300 space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>DİKKAT: KAYIT YAPTIRDIĞINIZ E-POSTA ADRESİ İLE SATIN ALINIZ</span>
            </div>
            <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
              Ödemeniz tamamlandığında Not Avcısı lisansınızın ve MEB sınav provalarınızın hesabınızla anında ve otomatik eşleşebilmesi için, lütfen Shopier ödeme formuna <strong>sisteme kayıt yaptırdığınız e-posta adresini</strong> giriniz.
              {profil?.eposta && (
                <span className="block text-amber-300 font-mono font-bold mt-1">
                  ✓ Sisteme Kayıtlı E-Postanız: {profil.eposta}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <div className="text-center sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">YILLIK KULÜP LİSANSI</span>
              <span className="text-2xl font-black text-amber-400">790 TL</span>
              <span className="text-xs text-emerald-400 font-bold block">(Bayi Kodu ile 711 TL)</span>
            </div>
            <a
              href="https://www.shopier.com/mehmetaliaskar/52508073"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              <span>Kayıt Yaptırdığınız E-Posta ile Satın Al</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* İptal ve İade Koşulları (Shopier) */}
          <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 text-center leading-relaxed">
            <p>
              🔒 <strong>İptal ve İade Koşulları:</strong> Not Avcısı lisans ödemeleri Shopier altyapısıyla gerçekleştirilmektedir. Satın alımlarda <strong>Shopier Tüketici İptal ve İade Koşulları</strong> ile Mesafeli Satış Sözleşmesi hükümleri geçerlidir. Dijital içerik ve anında ifa edilen hizmetlerde ilgili mevzuat hükümleri uygulanır.
            </p>
          </div>
        </div>

        {/* İlgili Aşkar Yayınları Koçluk Kitabı Tavsiyesi */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-950 border border-amber-500/30 overflow-hidden shrink-0">
              <img src="/resimler/k5.jpg" alt="Kitap" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Aşkar Yayınları {sonuc.sinif}. Sınıf Koçu</span>
              <span className="text-[11px] text-slate-400">Bu eksik kazanımları kapatmak için ilgili rehber kitaba göz at!</span>
            </div>
          </div>
          <a
            href="https://www.askaryayinlari.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 transition"
          >
            İncele →
          </a>
        </div>

        {/* PDF Karne İndir Butonu & Veli Bilgilendirme */}
        <div className="mb-6 space-y-2.5">
          <button
            onClick={handleDownloadPdf}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            <FileDown className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span>Karnemi Renkli PDF Olarak İndir (A4 Baskıya Hazır)</span>
          </button>
          
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 text-center flex items-center justify-center gap-2">
            <span className="text-amber-400 font-bold">📢 Veli Bilgilendirmesi:</span>
            <span>
              {profil?.eposta
                ? `Bu karne aynı zamanda kayıtlı e-posta adresinize (${profil.eposta}) iletilmiştir.`
                : 'Bu karneye dilediğiniz zaman veli telefon numaranızla "Veli Karne Sorgula" ekranından da ücretsiz ulaşabilirsiniz.'}
            </span>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition cursor-pointer"
          >
            Panele Dön
          </button>

          {onRetakeExam && (
            <button
              onClick={onRetakeExam}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Tekrar Çöz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
