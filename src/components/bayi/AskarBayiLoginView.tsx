import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Calendar,
  Clock,
  FileText,
  Building2,
  ChevronRight
} from 'lucide-react';
import type { BayiModel, BayiSiparisItem, BayiOdemeKaydi } from '../../types/bayi';
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

const DEMO_SIPARISLER = [
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
    vadeTarihi: '2026-10-21 (Salı)',
    dekontNo: 'EFT-20261028-4412',
    odemeTuru: 'Havale / EFT',
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
    vadeTarihi: '2026-10-28 (Salı)',
    dekontNo: 'EFT-20261028-4412',
    odemeTuru: 'Havale / EFT',
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
    komisyonDurumu: 'Odendi',
    odemeTarihi: '2026-10-24',
    vadeTarihi: '2026-10-28 (Salı)',
    dekontNo: 'EFT-20261028-4412',
    odemeTuru: 'Havale / EFT',
    tarih: '2026-10-24',
    odenebilirMi: true,
  },
  {
    id: 'sip_104',
    siparisNo: 'ASK-26104',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Mehmet Eren (Veli)',
    kullaniciEmail: 'mehmet.eren@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (7. Sınıf)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Odendi',
    odemeTarihi: '2026-10-26',
    vadeTarihi: '2026-10-28 (Salı)',
    dekontNo: 'FAST-20261102-8921',
    odemeTuru: 'FAST',
    tarih: '2026-10-26',
    odenebilirMi: true,
  },
  {
    id: 'sip_105',
    siparisNo: 'ASK-26105',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Fatma Şahin (Veli)',
    kullaniciEmail: 'fatma.sahin@outlook.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (9. Sınıf)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Beklemede',
    odemeTarihi: '2026-10-29',
    vadeTarihi: '2026-11-04 (Salı)',
    tarih: '2026-10-29',
    odenebilirMi: false,
  },
  {
    id: 'sip_106',
    siparisNo: 'ASK-26106',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Emre Çelik (Veli)',
    kullaniciEmail: 'emre.celik@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (11. Sınıf YKS)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Beklemede',
    odemeTarihi: '2026-10-31',
    vadeTarihi: '2026-11-04 (Salı)',
    tarih: '2026-10-31',
    odenebilirMi: false,
  },
  {
    id: 'sip_107',
    siparisNo: 'ASK-26107',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Canan Polat (Veli)',
    kullaniciEmail: 'canan.polat@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (4. Sınıf)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Beklemede',
    odemeTarihi: '2026-11-01',
    vadeTarihi: '2026-11-04 (Salı)',
    tarih: '2026-11-01',
    odenebilirMi: false,
  },
  {
    id: 'sip_108',
    siparisNo: 'ASK-26108',
    bayiId: 'bayi_kadikoy_01',
    refKodu: 'ASKAR-KADIKOY',
    musteriAdi: 'Hüseyin Aksoy (Veli)',
    kullaniciEmail: 'huseyin.aksoy@gmail.com',
    paket: 'not_avcisi_yillik',
    paketAdi: 'Not Avcısı Tüm Dönem Yazılı Paketi (8. Sınıf LGS)',
    tutar: 711,
    komisyonOrani: 20,
    komisyonTutari: 142.2,
    komisyonDurumu: 'Beklemede',
    odemeTarihi: '2026-11-02',
    vadeTarihi: '2026-11-10 (Salı)',
    tarih: '2026-11-02',
    odenebilirMi: false,
  },
];

const DEMO_KAYITLAR = [
  { id: 'kayit_1', tarih: '2026-11-02', ogrenciAdi: 'Ece Karaca', sinif: '5. Sınıf', durum: 'Ucretsiz_Prova', aciklama: 'Matematik 1. Yazılı Provasını Çözdü (90 Puan)' },
  { id: 'kayit_2', tarih: '2026-11-01', ogrenciAdi: 'Burak Demir', sinif: '8. Sınıf LGS', durum: 'Satin_Aldi', aciklama: 'Yıllık Not Avcısı Paketi Satın Aldı (Sipariş: ASK-26108)' },
  { id: 'kayit_3', tarih: '2026-10-31', ogrenciAdi: 'Defne Yılmaz', sinif: '6. Sınıf', durum: 'Ucretsiz_Prova', aciklama: 'Fen Bilimleri 1. Yazılı Provasını Çözdü (100 Puan)' },
  { id: 'kayit_4', tarih: '2026-10-30', ogrenciAdi: 'Mert Akın', sinif: '7. Sınıf', durum: 'Satin_Aldi', aciklama: 'Yıllık Not Avcısı Paketi Satın Aldı (Sipariş: ASK-26106)' },
  { id: 'kayit_5', tarih: '2026-10-29', ogrenciAdi: 'Ceren Güler', sinif: '9. Sınıf', durum: 'Satin_Aldi', aciklama: 'Yıllık Not Avcısı Paketi Satın Aldı (Sipariş: ASK-26105)' },
  { id: 'kayit_6', tarih: '2026-10-28', ogrenciAdi: 'Kerem Tunç', sinif: '4. Sınıf', durum: 'Ucretsiz_Prova', aciklama: 'Türkçe 1. Yazılı Provasını Çözdü (80 Puan)' },
  { id: 'kayit_7', tarih: '2026-10-27', ogrenciAdi: 'Sude Aydın', sinif: '11. Sınıf YKS', durum: 'Ucretsiz_Prova', aciklama: 'Matematik 1. Yazılı Provasını Çözdü (85 Puan)' },
  { id: 'kayit_8', tarih: '2026-10-26', ogrenciAdi: 'Alp Eren', sinif: '7. Sınıf', durum: 'Satin_Aldi', aciklama: 'Yıllık Not Avcısı Paketi Satın Aldı (Sipariş: ASK-26104)' },
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
  const [activePortalTab, setActivePortalTab] = useState<'satislar' | 'kayitlar' | 'dekontlar'>('satislar');
  const [bayiPayments, setBayiPayments] = useState<BayiOdemeKaydi[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('askar_bayi_odemeleri');
      if (stored) {
        setBayiPayments(JSON.parse(stored));
      } else {
        setBayiPayments([
          {
            id: 'odm_1',
            bayiId: 'bayi_kadikoy_01',
            bayiKodu: 'ASKAR-KADIKOY',
            firmaAdi: 'Kadıköy Başarı Kırtasiye',
            yetkiliAdi: 'Mehmet Ali Karaca',
            telefon: '0532 555 12 34',
            iban: 'TR33 0006 1005 1987 6543 2100 01',
            tutar: 1000,
            dekontNo: 'EFT-20261028-4412',
            odemeTarihi: '2026-10-28',
            odemeTuru: 'Havale / EFT',
            aciklama: 'Ekim 3. Hafta Not Avcısı hak ediş ödemesi',
            createdAt: '2026-10-28T14:30:00Z',
          },
          {
            id: 'odm_2',
            bayiId: 'bayi_kadikoy_01',
            bayiKodu: 'ASKAR-KADIKOY',
            firmaAdi: 'Kadıköy Başarı Kırtasiye',
            yetkiliAdi: 'Mehmet Ali Karaca',
            telefon: '0532 555 12 34',
            iban: 'TR33 0006 1005 1987 6543 2100 01',
            tutar: 200,
            dekontNo: 'FAST-20261102-8921',
            odemeTarihi: '2026-11-02',
            odemeTuru: 'FAST',
            aciklama: 'Ekim 4. Hafta ara hak ediş ödemesi',
            createdAt: '2026-11-02T11:15:00Z',
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    const safeBayiPayments = Array.isArray(bayiPayments) ? bayiPayments : [];
    const matchingReceipts = safeBayiPayments.filter(
      (p) => p && (p.bayiKodu === currentBayi.kod || p.bayiId === currentBayi.bayiId)
    );
    const paidTotal = matchingReceipts.reduce((acc, curr) => acc + (Number(curr?.tutar) || 0), 0) || currentBayi.odenenTutar || 1200;
    const totalEarnings = currentBayi.toplamHakEdis || 1990.8;
    const remainingBalance = Math.max(0, Math.round((totalEarnings - paidTotal) * 10) / 10);

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

          {/* 4 ŞEFFAF VE BELİRGİN İSTATİSTİK KARTI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Kendi Vasıtanızla Kaydolanlar</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentBayi.toplamKayit || 38} Öğrenci</p>
              <span className="text-[11px] text-slate-400">Ücretsiz deneme çözen öğrenci / veli</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Paket Satın Alan Veliler</span>
                <Store className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentBayi.toplamSatis || 14} Adet Satış</p>
              <span className="text-[11px] text-slate-400">Toplam Üretilen Ciro: {(currentBayi.toplamCiro || 9954).toLocaleString('tr-TR')} ₺</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Toplam Net Hak Ediş (%20)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {totalEarnings.toLocaleString('tr-TR')} ₺
              </p>
              <span className="text-[11px] text-slate-400">Satışlardan hak kazandığınız net komisyon</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Ödenen ve Kalan Bakiye</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-xl font-black text-emerald-400">
                  {paidTotal.toLocaleString('tr-TR')} ₺
                </span>
                <span className="text-xs text-slate-500">/</span>
                <span className="text-lg font-black text-amber-400">
                  {remainingBalance.toLocaleString('tr-TR')} ₺ Kalan
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {remainingBalance > 0 ? 'Salı günü banka hesabınıza yatırılacak' : 'Tamamı hesabınıza aktarıldı'}
              </span>
            </div>
          </div>

          {/* ŞEFFAF VE BELİRGİN SEKMELER (SATIŞLAR, KAYITLAR, BANKA DEKONTLARI) */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
            {/* Sekme Başlıkları */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePortalTab('satislar')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                    activePortalTab === 'satislar'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Satışlar & Hak Ediş Vade Takvimi ({DEMO_SIPARISLER.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePortalTab('kayitlar')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                    activePortalTab === 'kayitlar'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Kendi Vasıtanızla Kaydolanlar ({DEMO_KAYITLAR.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePortalTab('dekontlar')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                    activePortalTab === 'dekontlar'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Banka Ödeme Dekontlarım ({matchingReceipts.length})</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ödeme Günü: Her Hafta Salı</span>
              </div>
            </div>

            {/* SEKME 1: SATIŞLAR VE HAK EDİŞ VADE TAKVİMİ */}
            {activePortalTab === 'satislar' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Ödeme Takvimi İlkesi:</strong> Havale/EFT satışları haftalık olarak Salı günleri, kredi kartı satışları ise yasal 30 günlük cayma süresi bitimini takip eden Salı günü hesabınıza FAST/EFT ile ödenir.
                    </span>
                  </div>
                  <span className="text-amber-400 font-bold shrink-0 font-mono">Net %20 Komisyon</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-3">Sipariş No</th>
                        <th className="py-3 px-3">Müşteri / Veli</th>
                        <th className="py-3 px-3">Satın Alınan Paket</th>
                        <th className="py-3 px-3 text-right">Paket Tutarı</th>
                        <th className="py-3 px-3 text-right text-amber-400">Hak Edişiniz (%20)</th>
                        <th className="py-3 px-3">Satış Tarihi</th>
                        <th className="py-3 px-3">Hesaba Yatacağı Tarih (Vade)</th>
                        <th className="py-3 px-3 text-right">Ödeme Durumu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {DEMO_SIPARISLER.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-3 font-mono text-slate-300 font-bold">{s.siparisNo}</td>
                          <td className="py-3.5 px-3 font-bold text-white">{s.musteriAdi}</td>
                          <td className="py-3.5 px-3 text-slate-300">{s.paketAdi}</td>
                          <td className="py-3.5 px-3 text-right font-bold text-slate-200 font-mono">{s.tutar} ₺</td>
                          <td className="py-3.5 px-3 text-right font-black text-amber-400 font-mono text-sm">{s.komisyonTutari} ₺</td>
                          <td className="py-3.5 px-3 text-slate-400 font-mono">{s.tarih}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-300">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 font-bold">
                              📅 {s.vadeTarihi || 'Salı Günü'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {s.komisyonDurumu === 'Odendi' ? (
                              <div className="inline-flex flex-col items-end">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Hesabınıza Yattı</span>
                                </span>
                                {s.dekontNo && (
                                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                                    📄 {s.dekontNo}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Salı Günü Ödenecek ({s.komisyonTutari} ₺)</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SEKME 2: KAYIT OLAN ÖĞRENCİLER */}
            {activePortalTab === 'kayitlar' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  Aşağıdaki öğrenciler afişinizdeki karekod veya referans bağlantınız üzerinden Not Avcısı'na üye olmuş ve ücretsiz MEB yazılı provalarını çözmüştür. Paket satın aldıklarında otomatik olarak %20 komisyon kazanırsınız.
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-3">Kayıt Tarihi</th>
                        <th className="py-3 px-3">Öğrenci Adı</th>
                        <th className="py-3 px-3">Sınıfı</th>
                        <th className="py-3 px-3">Aktivite / Deneme Durumu</th>
                        <th className="py-3 px-3 text-right">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {DEMO_KAYITLAR.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-3 font-mono text-slate-300">{k.tarih}</td>
                          <td className="py-3.5 px-3 font-bold text-white">{k.ogrenciAdi}</td>
                          <td className="py-3.5 px-3 text-slate-300">{k.sinif}</td>
                          <td className="py-3.5 px-3 text-slate-400">{k.aciklama}</td>
                          <td className="py-3.5 px-3 text-right">
                            {k.durum === 'Satin_Aldi' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Yıllık Paketi Aldı</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                                🎁 Ücretsiz Prova Çözdü
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SEKME 3: BANKA ÖDEME DEKONTLARIM */}
            {activePortalTab === 'dekontlar' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-white font-bold block">Resmi Kayıtlı Banka IBAN Hesabınız:</span>
                    <code className="text-amber-300 font-mono text-xs">{currentBayi.iban}</code>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                    ✓ Güvenli FAST / EFT Mutabakatı
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-3">Transfer Tarihi</th>
                        <th className="py-3 px-3">Banka Dekont No</th>
                        <th className="py-3 px-3">Ödeme Türü</th>
                        <th className="py-3 px-3 text-right">Ödenen Tutar</th>
                        <th className="py-3 px-3">Açıklama</th>
                        <th className="py-3 px-3 text-right">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {matchingReceipts.map((rcp) => (
                        <tr key={rcp.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-3 font-mono text-slate-300">{rcp.odemeTarihi}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-amber-300 font-bold text-xs inline-block">
                              📄 {rcp.dekontNo}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300">{rcp.odemeTuru}</td>
                          <td className="py-3.5 px-3 text-right font-black text-emerald-400 font-mono text-sm">
                            {(Number(rcp.tutar) || 0).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-3 text-slate-400">{rcp.aciklama || 'Hak ediş ödemesi'}</td>
                          <td className="py-3.5 px-3 text-right">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Hesabınıza Aktarıldı</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
