import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Phone, MapPin, School, Check, AlertCircle, X } from 'lucide-react';
import { OgrenciProfil } from '../types/notAvcisiTypes';

interface NotAvcisiRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profil: OgrenciProfil) => void;
  initialBayiRef?: string;
}

export const NotAvcisiRegisterModal: React.FC<NotAvcisiRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialBayiRef = ''
}) => {
  const [adSoyad, setAdSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [telefon, setTelefon] = useState('');
  const [sinif, setSinif] = useState<number>(5);
  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const [okul, setOkul] = useState('');
  const [bayiRefKodu, setBayiRefKodu] = useState(initialBayiRef);

  // 18 Yaş Altı Veli Onay Alanları
  const [veliAdSoyad, setVeliAdSoyad] = useState('');
  const [veliTelefon, setVeliTelefon] = useState('');
  const [epostaYok, setEpostaYok] = useState(false);
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [veliOnay, setVeliOnay] = useState(false);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adSoyad.trim() || (!epostaYok && !eposta.trim()) || !il.trim() || !ilce.trim() || !okul.trim()) {
      setError('Lütfen tüm zorunlu alanları (Ad Soyad, İl, İlçe, Okul) doldurunuz.');
      return;
    }

    if (!kvkkOnay) {
      setError('KVKK Aydınlatma Metnini onaylamanız gerekmektedir.');
      return;
    }

    // 18 Yaş Altı Kontrolü (3-12. sınıf öğrencileri reşit sayılmaz, veli onayı zorunludur)
    if (!veliAdSoyad.trim() || !veliTelefon.trim() || !veliOnay) {
      setError('18 yaşından küçük öğrenciler için Veli Bilgileri ve Veli İzin Onayı zorunludur.');
      return;
    }

    const yeniProfil: OgrenciProfil = {
      id: 'ogr_' + Date.now(),
      adSoyad: adSoyad.trim(),
      eposta: epostaYok ? '' : eposta.trim(),
      telefon: telefon.trim(),
      sinif,
      il: il.trim(),
      ilce: ilce.trim(),
      okul: okul.trim(),
      is18Alti: true,
      veliBilgisi: {
        adSoyad: veliAdSoyad.trim(),
        telefon: veliTelefon.trim(),
        onayVerildi: true,
        onayTarihi: new Date().toISOString()
      },
      bayiRefKodu: bayiRefKodu.trim().toUpperCase() || undefined,
      kayitTarihi: new Date().toISOString(),
      abonelikDurumu: 'ucretsiz'
    };

    try {
      const stored = localStorage.getItem('askar_ogrenci_profilleri');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(yeniProfil);
      localStorage.setItem('askar_ogrenci_profilleri', JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }

    onSuccess(yeniProfil);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Not Avcısı Kulübü Kaydı</h3>
          <p className="text-sm text-slate-400 mt-1">
            KVKK Uyumlu ve Veli Bilgilendirmeli Güvenli Öğrenci Kayıt Formu
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Öğrenci Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Öğrenci Adı Soyadı *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Öğrencinin adı"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Veli / İletişim E-Posta {epostaYok ? '' : '*'}
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-400 hover:text-amber-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={epostaYok}
                    onChange={(e) => {
                      setEpostaYok(e.target.checked);
                      if (e.target.checked) setEposta('');
                    }}
                    className="w-3.5 h-3.5 rounded accent-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span>E-postam yok</span>
                </label>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled={epostaYok}
                  required={!epostaYok}
                  placeholder={epostaYok ? 'E-posta belirtilmedi (Sorgu telefonla yapılır)' : 'eposta@adresiniz.com'}
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition ${
                    epostaYok ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {epostaYok
                  ? '💡 E-postanız olmadan da sınav sonuç ve karnenize dilediğiniz an veli telefon numaranızla "Veli Karne Sorgula" ekranından ulaşabilirsiniz.'
                  : '💡 Sınav bitiminde öğrencinizin detaylı MEB analiz karnesi ve tavsiyeleri bu e-posta adresine otomatik iletilecektir.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sınıf Düzeyi *</label>
              <select
                value={sinif}
                onChange={(e) => setSinif(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                  <option key={s} value={s}>{s}. Sınıf</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Bayi / Referans Kodu (Varsa)</label>
              <input
                type="text"
                placeholder="Örn: BAYI-101"
                value={bayiRefKodu}
                onChange={(e) => setBayiRefKodu(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm uppercase focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Saha Verisi: İl, İlçe, Okul */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Okul ve Bölge Bilgileri</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">İl *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: İstanbul, Ankara..."
                  value={il}
                  onChange={(e) => setIl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">İlçe *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy, Çankaya..."
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Okul Adı *</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Atatürk Ortaokulu"
                  value={okul}
                  onChange={(e) => setOkul(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 18 Yaş Altı Veli Muvafakatı Bölümü */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>18 Yaş Altı Veli / Vasi Bilgilendirmesi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Veli Adı Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="Anne / Baba Adı Soyadı"
                  value={veliAdSoyad}
                  onChange={(e) => setVeliAdSoyad(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Veli Telefon Numarası *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={veliTelefon}
                    onChange={(e) => setVeliTelefon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  🔒 Sınav karnelerine dilediğiniz an ücretsiz ulaşmanız ve karne sorgulama için gereklidir (SMS kodu gerekmez, ücretsizdir).
                </p>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={veliOnay}
                onChange={(e) => setVeliOnay(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs text-slate-300 leading-tight">
                18 yaşından küçük olan öğrencimin Not Avcısı platformunu kullanmasına, sınav simülasyonlarına katılmasına ve eğitim amaçlı analiz raporlarının üretilmesine velisi/vasisi olarak muvafakat veriyorum. *
              </span>
            </label>
          </div>

          {/* KVKK Onay Kutusu */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={kvkkOnay}
                onChange={(e) => setKvkkOnay(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs text-slate-400 leading-tight">
                <a href="/kvkk" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                  KVKK Aydınlatma Metni
                </a>
                'ni okudum, kişisel verilerimin belirtilen amaçlar doğrultusunda işlenmesini kabul ediyorum. *
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base text-center transition shadow-lg shadow-amber-500/20"
          >
            Kaydı Tamamla ve Sınavlara Başla
          </button>
        </form>
      </div>
    </div>
  );
};
