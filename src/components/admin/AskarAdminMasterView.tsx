import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Users,
  Store,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Copy,
  Trash2,
  Building2,
  FileText,
  Ban
} from 'lucide-react';
import type { BayiModel, BayiBasvuruModel, DistrictAnalyticsItem, BayiSiparisItem } from '../../types/bayi';
import { generateAskarBayiFlyerPdf } from '../../utils/generateAskarBayiFlyerPdf';
import { getSinavKilitListesi, setSinavKilit, setTopluKilit, VARSAYILAN_YAZILI_DONEMLERI } from '../../utils/notAvcisiExamControl';
import { generateNotAvcisiKarnePdf } from '../../utils/generateNotAvcisiKarnePdf';
import { SinavSonuc, OgrenciProfil } from '../../types/notAvcisiTypes';
import { TURKEY_CITIES, TURKEY_DISTRICTS } from '../../data/turkeyLocations';

interface AskarAdminMasterViewProps {
  onBackToApp?: () => void;
}

const DEFAULT_APPLICATIONS: BayiBasvuruModel[] = [
  {
    id: 'basvuru_demo_1',
    adSoyad: 'Mehmet Ali Karaca',
    firmaAdi: 'Kadıköy Başarı Kırtasiye',
    email: 'kadikoy@basarikirtasiye.com',
    telefon: '0532 555 12 34',
    sehir: 'İstanbul',
    ilce: 'Kadıköy',
    meslek: 'Kırtasiye / Kitabevi',
    iban: 'TR33 0006 1005 1987 6543 2100 01',
    vergiNo: '1234567890',
    notlar: 'Moda ve Bahariye caddesinde 2 şubemiz var, 12 ortaokulun tam merkezindeyiz.',
    satisKotasiOnaylandi: true,
    durum: 'Onaylandi',
    bayiKodu: 'ASKAR-KADIKOY',
    createdAt: '2026-10-25T14:30:00Z',
    onaylandiAt: '2026-10-26T09:15:00Z',
  },
  {
    id: 'basvuru_demo_2',
    adSoyad: 'Ayşe Yıldırım',
    firmaAdi: 'Çankaya Akademi Kitabevi',
    email: 'cankaya@akademikitap.com',
    telefon: '0544 333 44 55',
    sehir: 'Ankara',
    ilce: 'Çankaya',
    meslek: 'Eğitim Kitabevi',
    iban: 'TR44 0006 2000 1234 5678 9000 02',
    vergiNo: '9876543210',
    notlar: 'Kızılay ve Tunalı bölgesinde yoğun öğrenci sirkülasyonumuz var.',
    satisKotasiOnaylandi: true,
    durum: 'Beklemede',
    createdAt: '2026-11-01T11:20:00Z',
  },
  {
    id: 'basvuru_demo_3',
    adSoyad: 'Burak Şentürk',
    firmaAdi: 'Bornova Gençlik Kırtasiye',
    email: 'bornova@genclik.com',
    telefon: '0555 222 11 00',
    sehir: 'İzmir',
    ilce: 'Bornova',
    meslek: 'Kırtasiye',
    iban: 'TR55 0001 0000 9999 8888 7700 03',
    notlar: 'Ege Üniversitesi kampüsü ve 6 lisenin güzergahındayız.',
    satisKotasiOnaylandi: true,
    durum: 'Beklemede',
    createdAt: '2026-11-02T08:45:00Z',
  }
];

const INITIAL_DISTRICT_ANALYTICS: DistrictAnalyticsItem[] = [
  {
    sehir: 'İstanbul',
    ilce: 'Kadıköy',
    atananBayiAdi: 'Kadıköy Başarı Kırtasiye',
    atananBayiId: 'bayi_kadikoy_01',
    ogrenciSayisi: 340,
    cozulenSinavSayisi: 890,
    toplamSatis: 42,
    toplamCiro: 29862,
    durum: 'BAYI_VAR',
  },
  {
    sehir: 'Ankara',
    ilce: 'Çankaya',
    atananBayiAdi: 'İncelemede (Çankaya Akademi)',
    ogrenciSayisi: 410,
    cozulenSinavSayisi: 1120,
    toplamSatis: 18,
    toplamCiro: 12798,
    durum: 'YUKSEK_POTANSIYEL',
  },
  {
    sehir: 'İzmir',
    ilce: 'Bornova',
    atananBayiAdi: 'İncelemede (Bornova Gençlik)',
    ogrenciSayisi: 280,
    cozulenSinavSayisi: 650,
    toplamSatis: 12,
    toplamCiro: 8532,
    durum: 'YUKSEK_POTANSIYEL',
  },
  {
    sehir: 'İstanbul',
    ilce: 'Üsküdar',
    ogrenciSayisi: 295,
    cozulenSinavSayisi: 740,
    toplamSatis: 6,
    toplamCiro: 4266,
    durum: 'BOS_BOLGE',
  },
  {
    sehir: 'İstanbul',
    ilce: 'Beşiktaş',
    ogrenciSayisi: 310,
    cozulenSinavSayisi: 820,
    toplamSatis: 9,
    toplamCiro: 6399,
    durum: 'BOS_BOLGE',
  },
  {
    sehir: 'Bursa',
    ilce: 'Nilüfer',
    ogrenciSayisi: 360,
    cozulenSinavSayisi: 910,
    toplamSatis: 15,
    toplamCiro: 10665,
    durum: 'BOS_BOLGE',
  },
  {
    sehir: 'Antalya',
    ilce: 'Muratpaşa',
    ogrenciSayisi: 220,
    cozulenSinavSayisi: 530,
    toplamSatis: 8,
    toplamCiro: 5688,
    durum: 'BOS_BOLGE',
  },
];

export const AskarAdminMasterView: React.FC<AskarAdminMasterViewProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'basvurular' | 'bayiler' | 'ilceler' | 'sinav_kilitleri' | 'ogrenci_karneleri' | 'eposta_yonetimi'>('basvurular');
  const [sinavKilitleri, setSinavKilitleri] = useState<{ [key: string]: boolean }>({});
  const [ogrenciler, setOgrenciler] = useState<OgrenciProfil[]>([]);
  const [tamamlananSinavlar, setTamamlananSinavlar] = useState<any[]>([]);
  const [karaListe, setKaraListe] = useState<string[]>([]);
  const [yeniKaraListeEmail, setYeniKaraListeEmail] = useState('');
  const [applications, setApplications] = useState<BayiBasvuruModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<'TUMU' | 'BAYI_VAR' | 'BOS_BOLGE'>('TUMU');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  // Load Not Avcısı data for Admin
  useEffect(() => {
    try {
      setSinavKilitleri(getSinavKilitListesi());
      
      const storedProfiller = localStorage.getItem('askar_ogrenci_profilleri');
      if (storedProfiller) setOgrenciler(JSON.parse(storedProfiller));

      const storedSonuclar = localStorage.getItem('askar_ogrenci_sonuclari');
      if (storedSonuclar) setTamamlananSinavlar(JSON.parse(storedSonuclar));

      const storedKaraListe = localStorage.getItem('askar_eposta_engellenenler');
      if (storedKaraListe) setKaraListe(JSON.parse(storedKaraListe));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleKilit = (sinif: number, donemKod: string) => {
    const key = `${sinif}_${donemKod}`;
    const yeniDurum = !sinavKilitleri[key];
    setSinavKilit(sinif, donemKod, yeniDurum);
    setSinavKilitleri(getSinavKilitListesi());
  };

  const handleSetToplu = (donemKod: string, kilitli: boolean) => {
    setTopluKilit(donemKod, kilitli);
    setSinavKilitleri(getSinavKilitListesi());
  };

  const handleAddKaraListe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniKaraListeEmail.trim() || !yeniKaraListeEmail.includes('@')) return;
    const clean = yeniKaraListeEmail.trim().toLowerCase();
    if (!karaListe.includes(clean)) {
      const updated = [...karaListe, clean];
      setKaraListe(updated);
      localStorage.setItem('askar_eposta_engellenenler', JSON.stringify(updated));
    }
    setYeniKaraListeEmail('');
  };

  const handleRemoveKaraListe = (email: string) => {
    const updated = karaListe.filter(e => e !== email);
    setKaraListe(updated);
    localStorage.setItem('askar_eposta_engellenenler', JSON.stringify(updated));
  };

  // Load applications from localStorage or seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem('askar_bayi_basvurulari');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApplications(parsed);
          return;
        }
      }
      // Seed default demo applications
      setApplications(DEFAULT_APPLICATIONS);
      localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(DEFAULT_APPLICATIONS));
    } catch (e) {
      console.error(e);
      setApplications(DEFAULT_APPLICATIONS);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (adminPass === 'askar2026!' || adminPass === 'admin123' || adminPass === 'askar') {
      setIsAuthenticated(true);
    } else {
      setAuthError('Hatalı Master Yönetici Şifresi! Lütfen tekrar deneyiniz.');
    }
  };

  const handleFastLogin = () => {
    setIsAuthenticated(true);
  };

  // Approve Application
  const handleApproveApplication = (appId: string) => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        const cleanIlce = app.ilce.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const generatedCode = `ASKAR-${cleanIlce}`;
        return {
          ...app,
          durum: 'Onaylandi' as const,
          bayiKodu: generatedCode,
          onaylandiAt: new Date().toISOString(),
        };
      }
      return app;
    });

    setApplications(updated);
    localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(updated));

    // Also sync to active bayiler list
    const approvedApp = updated.find((a) => a.id === appId);
    if (approvedApp) {
      const newBayiModel: BayiModel = {
        bayiId: `bayi_${Date.now()}`,
        adSoyad: approvedApp.adSoyad,
        firmaAdi: approvedApp.firmaAdi,
        email: approvedApp.email,
        telefon: approvedApp.telefon,
        kod: approvedApp.bayiKodu || 'ASKAR-BAYI',
        link: `https://www.askaryayinlari.com.tr/not-avcisi?ref=${approvedApp.bayiKodu}`,
        sehir: approvedApp.sehir,
        ilce: approvedApp.ilce,
        iban: approvedApp.iban,
        vergiNo: approvedApp.vergiNo,
        komisyonOranlari: { bireysel: 20, kurumsal: 15, ogretmen: 25 },
        durum: 'Aktif',
        createdAt: approvedApp.createdAt,
      };

      try {
        const existing = localStorage.getItem('askar_aktif_bayiler');
        const list: BayiModel[] = existing ? JSON.parse(existing) : [];
        const filtered = list.filter((b) => b.kod !== newBayiModel.kod);
        filtered.unshift(newBayiModel);
        localStorage.setItem('askar_aktif_bayiler', JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Reject Application
  const handleRejectApplication = (appId: string) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, durum: 'Reddedildi' as const } : app
    );
    setApplications(updated);
    localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(updated));
  };

  // Delete Application
  const handleDeleteApplication = (appId: string) => {
    if (!window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;
    const updated = applications.filter((app) => app.id !== appId);
    setApplications(updated);
    localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(updated));
  };

  // Generate & Download PDF Flyer
  const handleGeneratePdf = async (app: BayiBasvuruModel) => {
    setIsGeneratingPdf(app.id);
    try {
      const cleanIlce = app.ilce.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const code = app.bayiKodu || `ASKAR-${cleanIlce}`;
      await generateAskarBayiFlyerPdf(app, code);
    } catch (err) {
      console.error('PDF üretimi sırasında hata:', err);
      alert('PDF üretilirken bir hata oluştu.');
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  // WhatsApp Send helper
  const handleSendViaWhatsApp = (app: BayiBasvuruModel) => {
    const cleanIlce = app.ilce.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const code = app.bayiKodu || `ASKAR-${cleanIlce}`;
    const text = `Merhaba Sayın ${app.adSoyad} (${app.firmaAdi}), Aşkar Yayınları & Not Avcısı ${app.sehir} - ${app.ilce} bölge temsilciliği başvurunuz Admin Master tarafından ONAYLANMIŞTIR! Size özel tanımlanan Bayi Kodunuz: ${code}. Resmi karekodlu tezgah afişi PDF'iniz ve sözleşmeniz hazırlanmıştır. Hayırlı ve bol kazançlı olmasını dileriz.`;
    const cleanPhone = app.telefon.replace(/[^0-9]/g, '').replace(/^0/, '90');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.firmaAdi.toLowerCase().includes(q) ||
      app.adSoyad.toLowerCase().includes(q) ||
      app.ilce.toLowerCase().includes(q) ||
      app.sehir.toLowerCase().includes(q)
    );
  });

  // Approved Bayiler
  const approvedBayiler = applications.filter((a) => a.durum === 'Onaylandi');

  // IF NOT AUTHENTICATED
  if (!isAuthenticated) {
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

        <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/30 p-8 shadow-2xl relative">
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-7 h-7 text-slate-950" />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Master Konsolu</h2>
            <p className="text-xs text-slate-400">
              Aşkar Yayınları Bayi Onay, İlçe Analitiği & Afiş Üretim Merkezi
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Yönetici Master Şifresi
              </label>
              <input
                type="password"
                required
                placeholder="Master Parola"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Admin Master'a Giriş Yap
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleFastLogin}
              className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Yönetici Olarak Hızlı Aç (Test & Onay)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
      {/* Üst Yönetici Başlığı */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-lg">
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
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white">ADMIN MASTER</h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    Genel Merkez
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Aşkar Yayınları Bayilik & Sorumluluk Alanı Koordinasyon Masası
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-bold transition"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigasyon Sekmeleri */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('basvurular')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'basvurular'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Gelen Başvurular ({applications.filter((a) => a.durum === 'Beklemede').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bayiler')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bayiler'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Aktif Bayiler & Afişler ({approvedBayiler.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ilceler')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ilceler'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>İlçe Analitiği</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sinav_kilitleri')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sinav_kilitleri'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🎯 Sınav Kilitleri & MEB Takvimi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ogrenci_karneleri')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ogrenci_karneleri'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>🎓 Öğrenci Karneleri ({ogrenciler.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eposta_yonetimi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'eposta_yonetimi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>📧 E-Posta Takip & Kara Liste</span>
          </button>
        </div>

        {/* 1. SEKME: GELEN BAŞVURULAR (İNCELEME & ONAY) */}
        {activeTab === 'basvurular' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Kırtasiye ve İlçe Bayilik Başvuruları</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Başvuruları inceleyin, ilçenin uygunluğuna göre onaylayıp <strong>karekodlu tezgah afişini</strong> tek tıkla üretin.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Kırtasiye, ilçe veya ad ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 text-sm">
                  Aramanıza uygun başvuru bulunamadı.
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-black text-white">{app.firmaAdi}</h3>
                          {app.durum === 'Onaylandi' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                              ✓ Onaylandı ({app.bayiKodu})
                            </span>
                          ) : app.durum === 'Reddedildi' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
                              Reddedildi
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold animate-pulse">
                              ⏳ İnceleme Bekliyor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-slate-200">
                            Talep Edilen Bölge: {app.sehir} / {app.ilce}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span>Başvuran Yetkili: {app.adSoyad}</span>
                          <span className="text-slate-600">•</span>
                          <span>{new Date(app.createdAt).toLocaleDateString('tr-TR')}</span>
                        </p>
                      </div>

                      {/* Aksiyon Butonları */}
                      <div className="flex flex-wrap items-center gap-2">
                        {app.durum !== 'Onaylandi' && (
                          <button
                            type="button"
                            onClick={() => handleApproveApplication(app.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Onayla ve Bayi Yap</span>
                          </button>
                        )}

                        {/* Karekodlu Afiş Üretme Butonu */}
                        <button
                          type="button"
                          onClick={() => handleGeneratePdf(app)}
                          disabled={isGeneratingPdf === app.id}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {isGeneratingPdf === app.id ? 'Üretiliyor...' : 'Karekodlu Afiş PDF Üret'}
                          </span>
                        </button>

                        {/* WhatsApp İle Gönder */}
                        <button
                          type="button"
                          onClick={() => handleSendViaWhatsApp(app)}
                          className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          title="WhatsApp üzerinden onay ve afiş mesajı gönder"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">WhatsApp Bildir</span>
                        </button>

                        {app.durum === 'Beklemede' && (
                          <button
                            type="button"
                            onClick={() => handleRejectApplication(app.id)}
                            className="px-3 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold text-xs transition cursor-pointer"
                          >
                            Reddet
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteApplication(app.id)}
                          className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Detay Bilgileri Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-500 block">Telefon / WhatsApp</span>
                        <span className="font-bold text-white block mt-0.5">{app.telefon}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-500 block">E-posta</span>
                        <span className="font-bold text-white block mt-0.5">{app.email}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-500 block">Banka IBAN</span>
                        <span className="font-mono text-slate-300 block mt-0.5 truncate">
                          {app.iban || 'Henüz belirtilmedi'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-500 block">Vergi / TC No</span>
                        <span className="font-mono text-slate-300 block mt-0.5">
                          {app.vergiNo || 'Gider pusulası / Yok'}
                        </span>
                      </div>
                    </div>

                    {app.notlar && (
                      <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-amber-400">İşletme Notu: </strong>
                        {app.notlar}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 2. SEKME: AKTİF BAYİLER & AFİŞ İNDİR */}
        {activeTab === 'bayiler' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span>Onaylanmış Yetkili Bayiler ve Karekod Afişleri</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                İlçelerinde Aşkar Yayınları ve Not Avcısı'nı temsil eden onaylı kırtasiye ve işletmeler.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedBayiler.map((bayi) => (
                <div
                  key={bayi.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-white text-base">{bayi.firmaAdi}</h3>
                      <p className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{bayi.sehir} - {bayi.ilce} Temsilcisi</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Aktif
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Yetkili:</span>
                      <strong className="text-white">{bayi.adSoyad}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Bayi Kodu:</span>
                      <code className="text-amber-300 font-bold">{bayi.bayiKodu}</code>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Telefon:</span>
                      <strong className="text-white">{bayi.telefon}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGeneratePdf(bayi)}
                    disabled={isGeneratingPdf === bayi.id}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf === bayi.id ? 'Üretiliyor...' : 'Karekodlu Afiş PDF İndir'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SEKME: İLÇE SORUMLULUK ALANI KARŞILAŞTIRMA & ANALİTİĞİ */}
        {activeTab === 'ilceler' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>İlçe Sorumluluk Masası ve Bölge Karşılaştırması</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Öğrenci sınav çözme yoğunluğu olan ve henüz bayisi olmayan ilçeleri tespit edip bayilik ataması yapabilirsiniz.
                </p>
              </div>

              {/* Filtre */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDistrictFilter('TUMU')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    districtFilter === 'TUMU' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Tüm İlçeler
                </button>
                <button
                  type="button"
                  onClick={() => setDistrictFilter('BOS_BOLGE')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    districtFilter === 'BOS_BOLGE' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Boş Bölgeler (Temsilci Yok)
                </button>
                <button
                  type="button"
                  onClick={() => setDistrictFilter('BAYI_VAR')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    districtFilter === 'BAYI_VAR' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Bayisi Olanlar
                </button>
              </div>
            </div>

            {/* Karşılaştırma Tablosu */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-3">İl / İlçe</th>
                      <th className="py-3 px-3">Yetkili Bayi Durumu</th>
                      <th className="py-3 px-3">Sınav Çözen Öğrenci</th>
                      <th className="py-3 px-3">Çözülen Deneme</th>
                      <th className="py-3 px-3">Satılan Paket</th>
                      <th className="py-3 px-3">Toplam Ciro</th>
                      <th className="py-3 px-3">Stratejik Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {INITIAL_DISTRICT_ANALYTICS.filter((item) => {
                      if (districtFilter === 'BOS_BOLGE') return item.durum === 'BOS_BOLGE';
                      if (districtFilter === 'BAYI_VAR') return item.durum === 'BAYI_VAR';
                      return true;
                    }).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50">
                        <td className="py-3 px-3 font-bold text-white">
                          {item.sehir} / {item.ilce}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {item.atananBayiAdi || (
                            <span className="text-amber-400/80 italic">Atama Yok (Kırtasiye Aranıyor)</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200">{item.ogrenciSayisi} Öğrenci</td>
                        <td className="py-3 px-3 text-slate-300">{item.cozulenSinavSayisi} Adet</td>
                        <td className="py-3 px-3 font-bold text-white">{item.toplamSatis} Adet</td>
                        <td className="py-3 px-3 font-black text-amber-400">{item.toplamCiro} TL</td>
                        <td className="py-3 px-3">
                          {item.durum === 'BAYI_VAR' ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              ✓ Temsilcisi Var
                            </span>
                          ) : item.durum === 'YUKSEK_POTANSIYEL' ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              ⭐ Yüksek Talep / Beklemede
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                              🎯 Boş Bölge (Bayilik Açık)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. SEKME: SINAV KİLİTLERİ VE MEB TAKVİMİ YÖNETİMİ */}
        {activeTab === 'sinav_kilitleri' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <span>Not Avcısı MEB Yazılı Sınav Kilit Masası</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Tüm yazılılar MEB yazılı tarihlerini açıkladığı haftadan 1 hafta önce açılabilir. Tarihi gelmeyen sınavlar kilitlidir. 
                  Bu ekrandan dilediğiniz sınıfın sınavını anında <strong>AÇABİLİR</strong> veya <strong>KİLİTLEYEBİLİRSİNİZ</strong>.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSetToplu('1_1', false)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                >
                  ✓ Tüm 1. Yazılıları Aç
                </button>
                <button
                  type="button"
                  onClick={() => {
                    VARSAYILAN_YAZILI_DONEMLERI.forEach(d => handleSetToplu(d.kod, true));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                >
                  🔒 Tüm Sınavları Kilitle
                </button>
              </div>
            </div>

            {/* Sınıf Bazlı Kilit Tablosu */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Sınıf Düzeyi</th>
                      <th className="py-3.5 px-4 font-bold">1. Dönem 1. Yazılı (Ekim/Kasım)</th>
                      <th className="py-3.5 px-4 font-bold">1. Dönem 2. Yazılı (Aralık/Ocak)</th>
                      <th className="py-3.5 px-4 font-bold">2. Dönem 1. Yazılı (Mart/Nisan)</th>
                      <th className="py-3.5 px-4 font-bold">2. Dönem 2. Yazılı (Mayıs/Haziran)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                      <tr key={s} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                            {s}
                          </span>
                          <span>{s}. Sınıf Yazılıları</span>
                        </td>

                        {VARSAYILAN_YAZILI_DONEMLERI.map((donem) => {
                          const kilitli = sinavKilitleri[`${s}_${donem.kod}`];
                          return (
                            <td key={donem.kod} className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleKilit(s, donem.kod)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                                  !kilitli
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                                    : 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                                }`}
                              >
                                {!kilitli ? (
                                  <>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>AÇIK (Aktif)</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                                    <span>KİLİTLİ</span>
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. SEKME: ÖĞRENCİ SINAV KARNELERİ (YALNIZCA ÇÖZÜLEN SINAVLAR) */}
        {activeTab === 'ogrenci_karneleri' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-400" />
                <span>Kayıtlı Öğrenciler ve Çözülen Sınav Karneleri</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kural Gereği: Öğrencinin yalnızca tamamlayıp çözdüğü sınav provaları listelenir. Çözmediği sınavlar burada yer almaz.
              </p>
            </div>

            {ogrenciler.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-sm text-slate-400">Henüz kayıtlı öğrenci bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ogrenciler.map((ogr) => {
                  // Yalnızca bu öğrencinin tamamladığı sınavlar
                  const ogrSonuclari = tamamlananSinavlar.filter(
                    s => s.ogrenciId === ogr.id || (ogr.telefon && s.veliBilgisi?.telefon === ogr.telefon)
                  );

                  return (
                    <div key={ogr.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      {/* Öğrenci Başlık Bilgisi */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-base">
                            {ogr.sinif}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{ogr.adSoyad}</h3>
                            <span className="text-xs text-slate-400">{ogr.sinif}. Sınıf • {ogr.okul || 'Okul Belirtilmedi'} ({ogr.il} / {ogr.ilce})</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right text-xs">
                          <span className="text-amber-400 font-bold block">Veli: {ogr.veliBilgisi?.adSoyad || 'Kendi Adına'}</span>
                          <span className="text-slate-400 text-[11px]">Tel: {ogr.veliBilgisi?.telefon || ogr.telefon}</span>
                        </div>
                      </div>

                      {/* ÇÖZÜLEN SINAVLAR (Çözmediği Sınav Görünmez) */}
                      <div>
                        {ogrSonuclari.length > 0 ? (
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                              ✓ Tamamlanan ve Çözülen Sınav Provaları ({ogrSonuclari.length})
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ogrSonuclari.map((sinavItem) => (
                                <div key={sinavItem.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                  <div>
                                    <h4 className="text-xs font-bold text-white">{sinavItem.sinavAdi || `${sinavItem.dersAdi} 1. Yazılı Provası`}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                      <span>Tarih: {sinavItem.tarih}</span>
                                      <span>•</span>
                                      <span>Süre: {sinavItem.sureDakika} Dk</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <span className="text-[9px] uppercase font-bold text-slate-400 block">NOT</span>
                                      <span className="text-base font-black text-amber-400">{sinavItem.puan}/100</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const fmt: SinavSonuc = {
                                          sinavId: sinavItem.id,
                                          sinif: sinavItem.sinif,
                                          dersAdi: sinavItem.dersAdi,
                                          toplamSoru: 10,
                                          dogruSayisi: Math.round(sinavItem.puan / 10),
                                          yanlisSayisi: 10 - Math.round(sinavItem.puan / 10),
                                          bosSayisi: 0,
                                          alinanPuan: sinavItem.puan,
                                          harcananSureSaniye: (sinavItem.sureDakika || 40) * 60,
                                          eksikKazanimlar: sinavItem.eksikKazanimlar || [],
                                          tamamlanmaTarihi: sinavItem.tamamlanmaZamani || new Date().toISOString()
                                        };
                                        generateNotAvcisiKarnePdf(fmt, ogr);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition cursor-pointer"
                                    >
                                      PDF İndir
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 italic">
                            ⚠️ Bu öğrenci henüz bir sınav provası çözmedi. (Yalnızca çözülen sınavlar listelenir).
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. SEKME: E-POSTA TAKİP VE KARA LİSTE (OPT-OUT) */}
        {activeTab === 'eposta_yonetimi' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Mail className="w-6 h-6 text-amber-400" />
                <span>E-Posta Takip Otomasyonu & İletişim İzin Yönetimi</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Sınavı bitiren öğrenci ve velilere 1-2 gün sonra gönderilen memnuniyet ve üyelik e-postalarını buradan yönetebilir, 
                e-posta almak istemeyenlerin adreslerini kara listeye alarak izinsiz gönderimleri engelleyebilirsiniz.
              </p>
            </div>

            {/* 1-2 Gün Sonra Gönderilen E-Posta Şablonu Önizlemesi */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  📧 1-2 Gün Sonra Gönderilecek E-Posta Şablonu
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  ✓ Hazır Şablon
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-sans text-slate-300">
                <p><strong>Konu:</strong> 🦉 Koç Baykuş Soruyor: Not Avcısı Yazılı Provanızı Nasıl Buldunuz?</p>
                <hr className="border-slate-800" />
                <p>Sayın Velimiz ve Sevgili Öğrencimiz,</p>
                <p>
                  Geçtiğimiz gün Not Avcısı platformunda tamamladığınız yazılı provası ve MEB kazanım karneniz umarız gerçek okul yazılılarınıza hazırlanırken size büyük bir özgüven kazandırmıştır!
                </p>
                <p>
                  <strong>Okuldaki gerçek yazılıda 100 tam puanı yakalamak ister misiniz?</strong>
                </p>
                <p>
                  Not Avcısı Kulübü'ne katılarak 1. ve 2. dönem tüm açık uçlu yazılı provalarına, çözümlü video ipuçlarına ve Aşkar Yayınları koçluk kitaplarına dilediğiniz an sınırsız erişebilirsiniz.
                </p>
                <p className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                  🎁 Size Özel İndirim Fırsatı: Yıllık Lisans 790 TL yerine Bayi İndirim Kodu ile yalnızca 711 TL!
                </p>
                <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                  Bu bilgilendirme e-postasını bir daha almak istemiyorsanız buraya tıklayarak ayrılabilirsiniz (Abonelikten Çık).
                </p>
              </div>
            </div>

            {/* Kara Liste (İzinsiz E-Posta Geri Dönüşleri) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span>İzinsiz E-Posta Engelleme Listesi (Opt-Out Kara Liste)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bu listedeki e-posta adreslerine KVKK ve Ticari İleti mevzuatı gereği otomatik tanıtım/hatırlatma e-postası ASLA gönderilmez.
                </p>
              </div>

              <form onSubmit={handleAddKaraListe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Engellenecek E-Posta Adresi (örn: veli@ornek.com)"
                  value={yeniKaraListeEmail}
                  onChange={(e) => setYeniKaraListeEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Kara Listeye Ekle
                </button>
              </form>

              {karaListe.length > 0 ? (
                <div className="space-y-2">
                  {karaListe.map((email) => (
                    <div key={email} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-mono">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKaraListe(email)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold transition cursor-pointer"
                      >
                        Engeli Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Kara listede henüz kayıtlı e-posta bulunmuyor.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
