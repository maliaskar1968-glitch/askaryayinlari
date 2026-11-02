import React, { useState } from 'react';
import {
  Lock,
  Store,
  LogIn,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Download,
  Copy,
  TrendingUp,
  DollarSign,
  Users,
  LogOut,
  MapPin,
  ExternalLink
} from 'lucide-react';
import type { BayiModel, BayiSiparisItem } from '../../types/bayi';
import { generateAskarBayiFlyerPdf } from '../../utils/generateAskarBayiFlyerPdf';

interface AskarBayiLoginViewProps {
  onBackToApp?: () => void;
  onNavigateToBasvuru?: () => void;
}

const DEMO_BAYI: BayiModel = {
  bayiId: 'bayi_kadikoy_01',
  adSoyad: 'Mehmet Ali Karaca',
  firmaAdi: 'Kadıköy Başarı Kırtasiye',
  email: 'kadikoy@basarikirtasiye.com',
  telefon: '0532 555 12 34',
  kod: 'ASKAR-KADIKOY',
  link: 'https://www.askaryayinlari.com.tr/not-avcisi?ref=ASKAR-KADIKOY',
  sehir: 'İstanbul',
  ilce: 'Kadıköy',
  iban: 'TR33 0006 1005 1987 6543 2100 01',
  komisyonOranlari: {
    bireysel: 20,
    kurumsal: 15,
    ogretmen: 25,
  },
  durum: 'Aktif',
  createdAt: '2026-10-15T10:00:00Z',
  toplamTiklanma: 142,
  toplamKayit: 38,
  toplamSatis: 14,
  toplamCiro: 9954,
  toplamHakEdis: 1990.8,
  odenenTutar: 1200,
  kalanBakiye: 790.8,
};

const DEMO_SIPARISLER: BayiSiparisItem[] = [
  {
    id: 'sip_101',
    siparisNo: 'ASK-26101',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Ayşe Yılmaz (Veli)',
    kullaniciEmail: 'ayse.yilmaz@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (5. Sınıf)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Odendi',
    odemeTarihi: '2026-10-18',
    tarih: '2026-10-18',
    odenebilirMi: true,
  },
  {
    id: 'sip_102',
    siparisNo: 'ASK-26102',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Ahmet Demir (Veli)',
    kullaniciEmail: 'ahmet.demir@hotmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (8. Sınıf LGS)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Odendi',
    odemeTarihi: '2026-10-21',
    tarih: '2026-10-21',
    odenebilirMi: true,
  },
  {
    id: 'sip_103',
    siparisNo: 'ASK-26103',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Zeynep Kaya (Veli)',
    kullaniciEmail: 'zeynep.kaya@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (6. Sınıf)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Beklemede',
    odemeTarihi: '2026-10-29',
    tarih: '2026-10-29',
    odenebilirMi: false,
  },
];

export const AskarBayiLoginView: React.FC<AskarBayiLoginViewProps> = ({
  onBackToApp,
  onNavigateToBasvuru,
}) => {
  const [bayiCodeOrEmail, setBayiCodeOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentBayi, setCurrentBayi] = useState<BayiModel | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const input = bayiCodeOrEmail.trim().toLowerCase();
    
    // Check localStorage for approved bayiler first
    try {
      const stored = localStorage.getItem('askar_aktif_bayiler');
      if (stored) {
        const bayiler: BayiModel[] = JSON.parse(stored);
        const found = bayiler.find(
          (b) => b.kod.toLowerCase() === input || b.email.toLowerCase() === input
        );
        if (found) {
          setCurrentBayi(found);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Demo fallback login
    if (
      input === 'askar-kadikoy' ||
      input === 'kadikoy@basarikirtasiye.com' ||
      input === 'demo'
    ) {
      setCurrentBayi(DEMO_BAYI);
    } else {
      setErrorMsg('Girdiğiniz bayi kodu veya e-posta ile kayıtlı aktif bayi bulunamadı. Lütfen başvurunuzun onay durumunu kontrol ediniz.');
    }
  };

  const handleDemoFastLogin = () => {
    setCurrentBayi(DEMO_BAYI);
  };

  const handleDownloadFlyer = async () => {
    if (!currentBayi) return;
    setIsGeneratingPdf(true);
    try {
      await generateAskarBayiFlyerPdf(currentBayi);
    } catch (err) {
      console.error('PDF üretimi hatası:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyLink = () => {
    if (!currentBayi) return;
    navigator.clipboard.writeText(currentBayi.link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // IF LOGGED IN: SHOW BAYI PORTAL
  if (currentBayi) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
        {/* Portal Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 shadow-lg">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {onBackToApp && (
                <button
                  type="button"
                  onClick={onBackToApp}
                  className="p-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Kitaplığa Dön</span>
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white">
                    {currentBayi.firmaAdi}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Aktif İlçe Bayisi
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sorumluluk Alanı: <strong>{currentBayi.sehir} / {currentBayi.ilce}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Yetkili: {currentBayi.adSoyad}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadFlyer}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'PDF Üretiliyor...' : 'Karekodlu Afişimi İndir'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentBayi(null)}
                className="p-2 rounded-xl border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Portal Main Body */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Quick Info & Referral Link Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Tezgah & Satış Referans Bağlantınız
              </span>
              <p className="text-sm text-slate-300">
                Veliler bu bağlantıyı veya afişinizdeki karekodu okuttuğunda otomatik olarak %10 indirim alır ve %20 komisyon hesabınıza işlenir.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <code className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-mono">
                  {currentBayi.link}
                </code>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Kopyalandı!' : 'Kopyala'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
              <span className="text-xs text-amber-300 font-bold block">Bayi / Promosyon Kodu</span>
              <span className="text-2xl font-black text-white font-mono tracking-wider block mt-1">
                {currentBayi.kod}
              </span>
              <span className="text-[10px] text-amber-400/80 block mt-0.5">Velilere %10 İndirim Sağlar</span>
            </div>
          </div>

          {/* 4 İstatistik Kartı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Toplam Karekod Tıklanma</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentBayi.toplamTiklanma || 142}</p>
              <span className="text-[11px] text-slate-500">İlçe genelinden girişler</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Kayıtlı Öğrenci / Deneme</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentBayi.toplamKayit || 38}</p>
              <span className="text-[11px] text-slate-500">Ücretsiz sınav çözenler</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Toplam Satılan Paket</span>
                <Store className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentBayi.toplamSatis || 14} Adet</p>
              <span className="text-[11px] text-slate-500">Toplam Ciro: {currentBayi.toplamCiro || 9954} TL</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Net Hak Ediş (%20)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">
                {currentBayi.toplamHakEdis || 1990.8} TL
              </p>
              <span className="text-[11px] text-emerald-400">
                Kalan Ödenecek Bakiye: {currentBayi.kalanBakiye || 790.8} TL
              </span>
            </div>
          </div>

          {/* Sipariş Geçmişi & Provizyon Takibi */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>Karekodunuz Üzerinden Yapılan Satışlar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kredi kartı ile yapılan ödemeler 30 günlük yasal cayma süresi sonunda Salı günleri kesinleşerek ödenir.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Sipariş No</th>
                    <th className="py-3 px-3">Müşteri</th>
                    <th className="py-3 px-3">Paket</th>
                    <th className="py-3 px-3">Tutar</th>
                    <th className="py-3 px-3">Hak Ediş (%20)</th>
                    <th className="py-3 px-3">Tarih</th>
                    <th className="py-3 px-3">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {DEMO_SIPARISLER.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-850/50">
                      <td className="py-3 px-3 font-mono text-slate-300">{s.siparisNo}</td>
                      <td className="py-3 px-3 font-bold text-white">{s.musteriAdi}</td>
                      <td className="py-3 px-3 text-slate-300">{s.paketAdi}</td>
                      <td className="py-3 px-3 font-bold text-slate-200">{s.tutar} TL</td>
                      <td className="py-3 px-3 font-black text-amber-400">{s.komisyonTutari} TL</td>
                      <td className="py-3 px-3 text-slate-400">{s.tarih}</td>
                      <td className="py-3 px-3">
                        {s.komisyonDurumu === 'Odendi' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Ödendi (Banka)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                            Provizyonda (30 Gün)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // LOGIN SCREEN
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      {onBackToApp && (
        <button
          type="button"
          onClick={onBackToApp}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </button>
      )}

      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative">
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Store className="w-7 h-7 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white">Bayi & Kırtasiye Portalı</h2>
          <p className="text-xs text-slate-400">
            Aşkar Yayınları İlçe Temsilciliği Konsolu
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Bayi Kodu veya E-posta
            </label>
            <input
              type="text"
              required
              placeholder="Örn: ASKAR-KADIKOY veya e-posta"
              value={bayiCodeOrEmail}
              onChange={(e) => setBayiCodeOrEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Şifre
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            Bayi Girişi Yap
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-[11px] text-slate-400 font-medium">
            Demo incelemesi için hızlı giriş yapabilirsiniz:
          </p>
          <button
            type="button"
            onClick={handleDemoFastLogin}
            className="w-full py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Örnek Bayi Olarak Giriş Yap (Kadıköy Bayisi)</span>
          </button>
        </div>

        {onNavigateToBasvuru && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onNavigateToBasvuru}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold transition"
            >
              Henüz bayimiz değil misiniz? İlçe Temsilciliği Başvurusu Yapın →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
