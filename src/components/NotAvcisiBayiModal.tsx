import React, { useState } from 'react';
import { Building2, User, Mail, Phone, MapPin, CreditCard, CheckCircle, AlertCircle, Sparkles, ArrowRight, X } from 'lucide-react';
import { BayiProfil } from '../types/notAvcisiTypes';

interface NotAvcisiBayiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bayi: BayiProfil) => void;
}

export const NotAvcisiBayiModal: React.FC<NotAvcisiBayiModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [firmaAdi, setFirmaAdi] = useState('');
  const [yetkiliAdSoyad, setYetkiliAdSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [telefon, setTelefon] = useState('');
  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const [iban, setIban] = useState('TR');
  const [vergiNoTC, setVergiNoTC] = useState('');
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firmaAdi.trim() || !yetkiliAdSoyad.trim() || !eposta.trim() || !il.trim() || !ilce.trim() || !iban.trim()) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (!sozlesmeOnay) {
      setError('Bayilik ve İlçe Sorumluluk Koşullarını onaylamanız gerekmektedir.');
      return;
    }

    // Özel Bayi Kodu üret: Örn: KADIKOY-KIRTASIYE-123
    const ilceSlug = ilce.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    const bayiKodu = `${ilceSlug}-BAYI-${rand}`;

    const yeniBayi: BayiProfil = {
      id: 'bayi_' + Date.now(),
      bayiKodu,
      firmaAdi: firmaAdi.trim(),
      yetkiliAdSoyad: yetkiliAdSoyad.trim(),
      eposta: eposta.trim(),
      telefon: telefon.trim(),
      il: il.trim(),
      ilce: ilce.trim(),
      iban: iban.trim(),
      vergiNoTC: vergiNoTC.trim(),
      komisyonOrani: 0.20, // Net %20
      indirimOrani: 0.10, // %10 İndirim
      onaylandi: true,
      kayitTarihi: new Date().toISOString(),
      toplamSatisSayisi: 0,
      toplamCiro: 0,
      birikenHakEdis: 0,
      odenenTutar: 0
    };

    onSuccess(yeniBayi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Not Avcısı Bayilik Başvurusu</h3>
          <p className="text-sm text-slate-400 mt-1">
            Yetkili Satış ve Danışma Noktası Olun, Çevrenizdeki Öğrenci ve Velilere Ulaşın!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Kırtasiye / Firma Adı *</label>
              <input
                type="text"
                required
                placeholder="Örn: Başarı Kırtasiye"
                value={firmaAdi}
                onChange={(e) => setFirmaAdi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Yetkili Adı Soyadı *</label>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız"
                value={yetkiliAdSoyad}
                onChange={(e) => setYetkiliAdSoyad(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">E-Posta Adresi (Afiş PDF Buraya Gelecek) *</label>
              <input
                type="email"
                required
                placeholder="kirtasiye@adres.com"
                value={eposta}
                onChange={(e) => setEposta(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telefon / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Sorumlu İlçe Seçimi (Çok Kritik) */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Birincil Sorumluluk Alanınız</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">İl *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: İstanbul"
                  value={il}
                  onChange={(e) => setIl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Sorumlu Olduğunuz İlçe *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy"
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ödeme IBAN & Vergi No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Komisyon Ödemesi İçin IBAN *</label>
              <input
                type="text"
                required
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                value={iban}
                onChange={(e) => setIban(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Vergi No veya TC Kimlik No</label>
              <input
                type="text"
                placeholder="Fatura / Gider Pusulası İçin"
                value={vergiNoTC}
                onChange={(e) => setVergiNoTC(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Koşullar & Onay */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sozlesmeOnay}
                onChange={(e) => setSozlesmeOnay(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs text-slate-400 leading-tight">
                Bayilik ön başvuru koşullarını ve başvurumun incelendikten sonra tarafıma iş ortaklığı şartlarının iletileceğini kabul ediyorum. *
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base text-center transition shadow-lg shadow-amber-500/20"
          >
            Bayilik Başvurusunu Tamamla & Karekod Afişimi Al
          </button>
        </form>
      </div>
    </div>
  );
};
