import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Users,
  Store,
  CheckCircle2,
  XCircle,
  X,
  Plus,
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
  Ban,
  Calendar,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import type { BayiModel, BayiBasvuruModel, DistrictAnalyticsItem, BayiSiparisItem, BayiOdemeKaydi } from '../../types/bayi';
import { generateAskarBayiFlyerPdf } from '../../utils/generateAskarBayiFlyerPdf';
import { getSinavKilitListesi, setSinavKilit, setTopluKilit, VARSAYILAN_YAZILI_DONEMLERI } from '../../utils/notAvcisiExamControl';
import { generateNotAvcisiKarnePdf } from '../../utils/generateNotAvcisiKarnePdf';
import { SinavSonuc, OgrenciProfil } from '../../types/notAvcisiTypes';
import { TURKEY_CITIES, TURKEY_DISTRICTS } from '../../data/turkeyLocations';

interface AskarAdminMasterViewProps {
  onBackToApp?: () => void;
}


const DEFAULT_BAYI_ODEMELERI: BayiOdemeKaydi[] = [
  {
    id: 'odm_1',
    bayiId: 'bayi_kadikoy_01',
    bayiKodu: 'ASKAR-KADIKOY',
    firmaAdi: 'Kadıköy Başarı Kırtasiye',
    yetkiliAdi: 'Mehmet Ali Karaca',
    telefon: '0532 555 12 34',
    iban: 'TR33 0006 1005 1987 6543 2100 01',
    tutar: 1500,
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
    tutar: 1000,
    dekontNo: 'FAST-20261102-8921',
    odemeTarihi: '2026-11-02',
    odemeTuru: 'FAST',
    aciklama: 'Ekim 4. Hafta ara hak ediş ödemesi',
    createdAt: '2026-11-02T11:15:00Z',
  },
  {
    id: 'odm_3',
    bayiId: 'bayi_cankaya_02',
    bayiKodu: 'ASKAR-CANKAYA',
    firmaAdi: 'Çankaya Akademi Kitabevi',
    yetkiliAdi: 'Ayşe Yıldırım',
    telefon: '0544 333 44 55',
    iban: 'TR45 0006 2008 3421 9876 5400 02',
    tutar: 1000,
    dekontNo: 'EFT-20261030-7714',
    odemeTarihi: '2026-10-30',
    odemeTuru: 'Havale / EFT',
    aciklama: 'Dönem başı hak ediş avansı',
    createdAt: '2026-10-30T16:00:00Z',
  },
];

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

  const [activeTab, setActiveTab] = useState<'basvurular' | 'bayiler' | 'ilceler' | 'sinav_kilitleri' | 'ogrenci_karneleri' | 'eposta_yonetimi' | 'bayi_odemeleri'>('basvurular');
  const [sinavKilitleri, setSinavKilitleri] = useState<{ [key: string]: boolean }>({});
  const [ogrenciler, setOgrenciler] = useState<OgrenciProfil[]>([]);
  const [tamamlananSinavlar, setTamamlananSinavlar] = useState<any[]>([]);
  const [karaListe, setKaraListe] = useState<string[]>([]);
  const [yeniKaraListeEmail, setYeniKaraListeEmail] = useState('');
  const [applications, setApplications] = useState<BayiBasvuruModel[]>([]);
  const [bayiOdemeleri, setBayiOdemeleri] = useState<BayiOdemeKaydi[]>([]);
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bayiKodu: 'ASKAR-KADIKOY',
    tutar: '',
    dekontNo: '',
    odemeTarihi: new Date().toISOString().split('T')[0],
    odemeTuru: 'Havale / EFT' as 'Havale / EFT' | 'FAST' | 'Kredi Kartı Mutabakatı' | 'Nakit',
    aciklama: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<'TUMU' | 'BAYI_VAR' | 'BOS_BOLGE'>('TUMU');
  const [bayiPaymentSearch, setBayiPaymentSearch] = useState('');
  const [bayiPaymentFilter, setBayiPaymentFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const [selectedBayiForDetail, setSelectedBayiForDetail] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);
  const [globalDiscountCode, setGlobalDiscountCode] = useState(() => {
    try {
      return localStorage.getItem('askar_genel_indirim_kodu') || '';
    } catch {
      return '';
    }
  });
  const [discountSavedToast, setDiscountSavedToast] = useState(false);

  const handleSaveGlobalDiscountCode = () => {
    localStorage.setItem('askar_genel_indirim_kodu', globalDiscountCode.trim().toUpperCase());
    setDiscountSavedToast(true);
    setTimeout(() => setDiscountSavedToast(false), 2500);
  };

  // Bayilik Şartları Düzenleme ve Gönderme Modalı State
  const [editingTermsApp, setEditingTermsApp] = useState<BayiBasvuruModel | null>(null);
  const [termsData, setTermsData] = useState({
    bayiKodu: '',
    komisyonOrani: '%20 Net Komisyon',
    odemeTakvimi: 'Havale/EFT 1 hafta sonraki Salı, Kredi Kartı 30 gün cayma sonrası Salı günleri',
    kota: 'Haftalık asgari 1 lisans satışı ile ilçe bölge koruması',
    ozelNot: 'Karekodlu A4 tezgâh afişiniz hazırlanmıştır. Afişi işletmenizde görünür bir noktaya asarak velilere tanıtabilirsiniz.',
    mesajMetni: '',
    copied: false,
  });


  // Bayi Ödeme & Dekont İşlemleri
  const handleOpenNewPayment = (preselectedCode?: string) => {
    const code = preselectedCode || (applications[0]?.bayiKodu || 'ASKAR-KADIKOY');
    const autoDekont = `DKNT-${Date.now().toString().slice(-6)}`;
    setPaymentForm({
      bayiKodu: code,
      tutar: '',
      dekontNo: autoDekont,
      odemeTarihi: new Date().toISOString().split('T')[0],
      odemeTuru: 'Havale / EFT',
      aciklama: 'Not Avcısı hak ediş ödemesi',
    });
    setIsNewPaymentModalOpen(true);
  };

  const handleSavePayment = (sendWhatsApp: boolean = false) => {
    const amount = parseFloat(paymentForm.tutar);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir ödeme tutarı giriniz.');
      return;
    }
    if (!paymentForm.dekontNo.trim()) {
      alert('Lütfen banka dekont numarasını giriniz.');
      return;
    }

    // Find bayi details
    const targetApp = applications.find((a) => a.bayiKodu === paymentForm.bayiKodu) || applications[0];
    const newRecord: BayiOdemeKaydi = {
      id: `odm_${Date.now()}`,
      bayiId: targetApp?.id || 'bayi_custom',
      bayiKodu: paymentForm.bayiKodu,
      firmaAdi: targetApp?.firmaAdi || 'Yetkili Temsilci',
      yetkiliAdi: targetApp?.adSoyad || 'Yetkili',
      telefon: targetApp?.telefon || '',
      iban: targetApp?.iban || 'Belirtilmedi',
      tutar: amount,
      dekontNo: paymentForm.dekontNo.trim(),
      odemeTarihi: paymentForm.odemeTarihi,
      odemeTuru: paymentForm.odemeTuru,
      aciklama: paymentForm.aciklama.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...bayiOdemeleri];
    setBayiOdemeleri(updated);
    localStorage.setItem('askar_bayi_odemeleri', JSON.stringify(updated));
    setIsNewPaymentModalOpen(false);

    if (sendWhatsApp && targetApp?.telefon) {
      const cleanPhone = targetApp.telefon.replace(/[^0-9]/g, '').replace(/^0/, '90');
      const msg = `Sayın ${targetApp.adSoyad} (${targetApp.firmaAdi}), ${paymentForm.odemeTarihi} tarihinde ${amount.toLocaleString('tr-TR')} ₺ tutarındaki hak ediş ödemeniz banka hesabınıza aktarılmıştır.\n\n📄 Dekont No: ${paymentForm.dekontNo}\n💳 IBAN: ${targetApp.iban || 'Kayıtlı hesabınız'}\n📌 Açıklama: ${paymentForm.aciklama || 'Hak ediş ödemesi'}\n\nBol kazançlı ve hayırlı olmasını dileriz.\nAşkar Yayınları Muhasebe Masası`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      alert('Ödeme ve dekont kaydı başarıyla sisteme işlendi.');
    }
  };

  const handleDeletePayment = (id: string) => {
    if (!confirm('Bu dekont kaydını silmek istediğinize emin misiniz?')) return;
    const updated = bayiOdemeleri.filter((o) => o.id !== id);
    setBayiOdemeleri(updated);
    localStorage.setItem('askar_bayi_odemeleri', JSON.stringify(updated));
  };

  const handleSendPaymentWhatsAppDirect = (rec: BayiOdemeKaydi) => {
    const cleanPhone = rec.telefon.replace(/[^0-9]/g, '').replace(/^0/, '90');
    const msg = `Sayın ${rec.yetkiliAdi} (${rec.firmaAdi}), ${rec.odemeTarihi} tarihinde ${rec.tutar.toLocaleString('tr-TR')} ₺ tutarındaki hak ediş ödemeniz banka hesabınıza aktarılmıştır.\n\n📄 Dekont No: ${rec.dekontNo}\n💳 IBAN: ${rec.iban}\n📌 Açıklama: ${rec.aciklama || 'Hak ediş ödemesi'}\n\nBol kazançlı ve hayırlı olmasını dileriz.\nAşkar Yayınları Muhasebe Masası`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleOpenTermsModal = (app: BayiBasvuruModel) => {
    const cleanIlce = app.ilce.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const code = app.bayiKodu || `ASKAR-${cleanIlce}`;
    const defaultKomisyon = '%20 Net Komisyon';
    const defaultOdeme = 'Havale/EFT 1 hafta sonraki Salı, Kredi Kartı 30 gün cayma sonrası Salı günleri';
    const defaultKota = 'Haftalık asgari 1 paket / Aylık 4 lisans satışı ile bölge koruması';
    const defaultNot = 'Karekodlu A4 tezgâh afişiniz hazırlanmıştır. Afişi işletmenizde görünür bir noktaya asarak velilere tanıtabilirsiniz.';

    const initialMsg = `Sayın ${app.adSoyad} (${app.firmaAdi}),\n\n` +
      `Aşkar Yayınları & Not Avcısı ${app.sehir} / ${app.ilce} bölge yetkili satış ve danışma noktası başvurunuz incelenmiştir.\n\n` +
      `📋 İŞ ORTAKLIĞI DETAYLARI VE ŞARTLARIMIZ:\n` +
      `• Bayi Kodunuz: ${code}\n` +
      `• Komisyon Oranı: ${defaultKomisyon}\n` +
      `• Hak Ediş Takvimi: ${defaultOdeme}\n` +
      `• Bölge Sorumluluğu & Kota: ${defaultKota}\n` +
      `• Bilgilendirme Notu: ${defaultNot}\n\n` +
      `Hayırlı ve bol kazançlı bir iş birliği dileriz.\nAşkar Yayınları & Not Avcısı Genel Merkez\nwww.askaryayinlari.com.tr`;

    setEditingTermsApp(app);
    setTermsData({
      bayiKodu: code,
      komisyonOrani: defaultKomisyon,
      odemeTakvimi: defaultOdeme,
      kota: defaultKota,
      ozelNot: defaultNot,
      mesajMetni: initialMsg,
      copied: false,
    });
  };

  const handleUpdateTermsField = (field: string, val: string) => {
    setTermsData((prev) => {
      const next = { ...prev, [field]: val };
      if (!editingTermsApp) return next;
      const app = editingTermsApp;
      next.mesajMetni = `Sayın ${app.adSoyad} (${app.firmaAdi}),\n\n` +
        `Aşkar Yayınları & Not Avcısı ${app.sehir} / ${app.ilce} bölge yetkili satış ve danışma noktası başvurunuz incelenmiştir.\n\n` +
        `📋 İŞ ORTAKLIĞI DETAYLARI VE ŞARTLARIMIZ:\n` +
        `• Bayi Kodunuz: ${next.bayiKodu}\n` +
        `• Komisyon Oranı: ${next.komisyonOrani}\n` +
        `• Hak Ediş Takvimi: ${next.odemeTakvimi}\n` +
        `• Bölge Sorumluluğu & Kota: ${next.kota}\n` +
        `• Bilgilendirme Notu: ${next.ozelNot}\n\n` +
        `Hayırlı ve bol kazançlı bir iş birliği dileriz.\nAşkar Yayınları & Not Avcısı Genel Merkez\nwww.askaryayinlari.com.tr`;
      return next;
    });
  };

  const handleSaveTermsToApp = () => {
    if (!editingTermsApp) return;
    const updated = applications.map((a) => {
      if (a.id === editingTermsApp.id) {
        return {
          ...a,
          bayiKodu: termsData.bayiKodu,
          notlar: `${a.notlar ? a.notlar + ' | ' : ''}Şartlar: ${termsData.komisyonOrani}, ${termsData.odemeTakvimi}`,
        };
      }
      return a;
    });
    setApplications(updated);
    localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(updated));
    alert('Şartlar ve bayi kodu başarıyla kaydedildi.');
  };

  const handleSendTermsWhatsApp = () => {
    if (!editingTermsApp) return;
    const cleanPhone = editingTermsApp.telefon.replace(/[^0-9]/g, '').replace(/^0/, '90');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(termsData.mesajMetni)}`, '_blank');
  };

  const handleSendTermsEmail = () => {
    if (!editingTermsApp) return;
    window.open(`mailto:${editingTermsApp.email}?subject=${encodeURIComponent('Aşkar Yayınları & Not Avcısı Bayilik Şartları')}&body=${encodeURIComponent(termsData.mesajMetni)}`);
  };

  const handleCopyTermsMessage = () => {
    navigator.clipboard.writeText(termsData.mesajMetni);
    setTermsData((prev) => ({ ...prev, copied: true }));
    setTimeout(() => {
      setTermsData((prev) => ({ ...prev, copied: false }));
    }, 2000);
  };

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

      const storedOdemeler = localStorage.getItem('askar_bayi_odemeleri');
      if (storedOdemeler) {
        setBayiOdemeleri(JSON.parse(storedOdemeler));
      } else {
        setBayiOdemeleri(DEFAULT_BAYI_ODEMELERI);
        localStorage.setItem('askar_bayi_odemeleri', JSON.stringify(DEFAULT_BAYI_ODEMELERI));
      }
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
      await generateAskarBayiFlyerPdf(app, code, globalDiscountCode);
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

          <button
            type="button"
            onClick={() => setActiveTab('bayi_odemeleri')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bayi_odemeleri'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>💰 Bayi Ödemeleri (Dekont Takip)</span>
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

            
          {/* TÜM BAYİLER İÇİN GENEL İNDİRİM KODU YÖNETİMİ */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>🎟️ Tüm Bayiler İçin Ortak İndirim Kodu Tanımlama</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  2 Sayfalık Afiş İçin
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Tüm temsilcilerin afişlerinde ortak geçerli olacak bir indirim kodu belirleyin (örn: <code className="text-amber-300 font-bold">HOSGELDIN10</code>). 
                Kodu boş bırakırsanız afişteki indirim kodu alanı şimdilik boş basılır.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <input
                type="text"
                placeholder="Örn: HOSGELDIN10"
                value={globalDiscountCode}
                onChange={(e) => setGlobalDiscountCode(e.target.value.toUpperCase())}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-xs tracking-wider focus:border-amber-400 focus:outline-none w-44 uppercase"
              />
              <button
                type="button"
                onClick={handleSaveGlobalDiscountCode}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
              >
                {discountSavedToast ? '✓ Kaydedildi' : 'Kodu Kaydet'}
              </button>
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
                          onClick={() => handleOpenTermsModal(app)}
                          className="px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                          title="Bayilik şartlarını ve mesajı düzenle, WhatsApp / E-Posta ile gönder"
                        >
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span>Şartları Düzenle & Gönder</span>
                        </button>

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
        
        {/* 7. SEKME: BAYİ & TEMSİLCİ ÖDEMELERİ VE DEKONT TAKİBİ */}
        {activeTab === 'bayi_odemeleri' && (() => {
          const safeOdemeler = Array.isArray(bayiOdemeleri) ? bayiOdemeleri : [];
          const safeApps = Array.isArray(applications) ? applications : [];

          // Bayi bazında hak ediş ve bakiye tablosu hesaplama
          const representativeSummary = [
            {
              bayiKodu: 'ASKAR-KADIKOY',
              firmaAdi: 'Kadıköy Başarı Kırtasiye',
              yetkiliAdi: 'Mehmet Ali Karaca',
              sehir: 'İstanbul',
              ilce: 'Kadıköy',
              iban: 'TR33 0006 1005 1987 6543 2100 01',
              telefon: '0532 555 12 34',
              kayitAdedi: 38,
              satisAdedi: 28,
              toplamCiro: 28 * 711,
              toplamHakEdis: Math.round(28 * 711 * 0.20),
            },
            {
              bayiKodu: 'ASKAR-CANKAYA',
              firmaAdi: 'Çankaya Akademi Kitabevi',
              yetkiliAdi: 'Ayşe Yıldırım',
              sehir: 'Ankara',
              ilce: 'Çankaya',
              iban: 'TR45 0006 2008 3421 9876 5400 02',
              telefon: '0544 333 44 55',
              kayitAdedi: 24,
              satisAdedi: 14,
              toplamCiro: 14 * 711,
              toplamHakEdis: Math.round(14 * 711 * 0.20),
            },
            ...safeApps
              .filter((a) => a && a.bayiKodu && a.bayiKodu !== 'ASKAR-KADIKOY' && a.bayiKodu !== 'ASKAR-CANKAYA')
              .map((a) => ({
                bayiKodu: a.bayiKodu || 'ASKAR-BAYI',
                firmaAdi: a.firmaAdi || 'Yetkili Temsilci',
                yetkiliAdi: a.adSoyad || 'Yetkili',
                sehir: a.sehir || '—',
                ilce: a.ilce || '—',
                iban: a.iban || 'Henüz bildirilmedi',
                telefon: a.telefon || '—',
                kayitAdedi: 15,
                satisAdedi: 8,
                toplamCiro: 8 * 711,
                toplamHakEdis: Math.round(8 * 711 * 0.20),
              }))
          ];

          // Compute paid and remaining for each
          const listWithBalances = representativeSummary.map((item) => {
            const paid = safeOdemeler
              .filter((o) => o && o.bayiKodu === item.bayiKodu)
              .reduce((acc, curr) => acc + (Number(curr?.tutar) || 0), 0);
            const remaining = Math.max(0, (Number(item.toplamHakEdis) || 0) - paid);
            const lastPayment = safeOdemeler.find((o) => o && o.bayiKodu === item.bayiKodu);
            return {
              ...item,
              odenenTutar: paid,
              kalanBakiye: remaining,
              sonDekontNo: lastPayment?.dekontNo || '—',
              sonDekontTarih: lastPayment?.odemeTarihi || '—',
            };
          });

          const grandTotalHakEdis = listWithBalances.reduce((a, c) => a + (Number(c.toplamHakEdis) || 0), 0);
          const grandTotalOdenen = safeOdemeler.reduce((a, c) => a + (Number(c?.tutar) || 0), 0);
          const grandTotalKalan = Math.max(0, grandTotalHakEdis - grandTotalOdenen);

          // Sipariş ve hak ediş vadeleri dökümü
          const getBayiOrders = (bayiKodu: string) => {
            if (bayiKodu === 'ASKAR-KADIKOY') {
              return [
                { id: '1', siparisNo: 'ASK-26101', veliAdi: 'Ayşe Yılmaz (Veli)', sinif: '5. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-18', vadeTarihi: '2026-10-21 (Salı)', durum: 'ODENDI', dekontNo: 'EFT-20261028-4412', odemeTuru: 'Havale / EFT' },
                { id: '2', siparisNo: 'ASK-26102', veliAdi: 'Ahmet Demir (Veli)', sinif: '8. Sınıf LGS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-21', vadeTarihi: '2026-10-28 (Salı)', durum: 'ODENDI', dekontNo: 'EFT-20261028-4412', odemeTuru: 'Havale / EFT' },
                { id: '3', siparisNo: 'ASK-26103', veliAdi: 'Zeynep Kaya (Veli)', sinif: '6. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-24', vadeTarihi: '2026-10-28 (Salı)', durum: 'ODENDI', dekontNo: 'EFT-20261028-4412', odemeTuru: 'Havale / EFT' },
                { id: '4', siparisNo: 'ASK-26104', veliAdi: 'Mehmet Eren (Veli)', sinif: '7. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-26', vadeTarihi: '2026-10-28 (Salı)', durum: 'ODENDI', dekontNo: 'FAST-20261102-8921', odemeTuru: 'FAST' },
                { id: '5', siparisNo: 'ASK-26105', veliAdi: 'Fatma Şahin (Veli)', sinif: '9. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-29', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Vadesi Geldi / Gelecek Salı Ödenecek' },
                { id: '6', siparisNo: 'ASK-26106', veliAdi: 'Emre Çelik (Veli)', sinif: '11. Sınıf YKS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-31', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Vadesi Geldi / Gelecek Salı Ödenecek' },
                { id: '7', siparisNo: 'ASK-26107', veliAdi: 'Canan Polat (Veli)', sinif: '4. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-11-01', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Vadesi Geldi / Gelecek Salı Ödenecek' },
                { id: '8', siparisNo: 'ASK-26108', veliAdi: 'Hüseyin Aksoy (Veli)', sinif: '8. Sınıf LGS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-11-02', vadeTarihi: '2026-11-10 (Salı)', durum: 'PROVIZYON', vadeNotu: 'Kredi Kartı 30 Gün Cayma Süresi' },
              ];
            }
            if (bayiKodu === 'ASKAR-CANKAYA') {
              return [
                { id: '1', siparisNo: 'ASK-26201', veliAdi: 'Selin Doğan (Veli)', sinif: '8. Sınıf LGS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-22', vadeTarihi: '2026-10-28 (Salı)', durum: 'ODENDI', dekontNo: 'EFT-20261030-7714', odemeTuru: 'Havale / EFT' },
                { id: '2', siparisNo: 'ASK-26202', veliAdi: 'Burak Keskin (Veli)', sinif: '7. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-25', vadeTarihi: '2026-10-28 (Salı)', durum: 'ODENDI', dekontNo: 'EFT-20261030-7714', odemeTuru: 'Havale / EFT' },
                { id: '3', siparisNo: 'ASK-26203', veliAdi: 'Merve Arslan (Veli)', sinif: '5. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-28', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Gelecek Salı Ödenecek' },
                { id: '4', siparisNo: 'ASK-26204', veliAdi: 'Kemal Öztürk (Veli)', sinif: '12. Sınıf YKS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-30', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Gelecek Salı Ödenecek' },
              ];
            }
            return [
              { id: '1', siparisNo: `ASK-${bayiKodu.slice(-4)}-01`, veliAdi: 'Derya Korkmaz (Veli)', sinif: '8. Sınıf LGS', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-27', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Gelecek Salı Ödenecek' },
              { id: '2', siparisNo: `ASK-${bayiKodu.slice(-4)}-02`, veliAdi: 'Tolga Yıldız (Veli)', sinif: '6. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-10-29', vadeTarihi: '2026-11-04 (Salı)', durum: 'BEKLIYOR', vadeNotu: 'Gelecek Salı Ödenecek' },
              { id: '3', siparisNo: `ASK-${bayiKodu.slice(-4)}-03`, veliAdi: 'Gülşah Aydın (Veli)', sinif: '5. Sınıf', paket: 'Not Avcısı Yıllık Paketi', tutar: 711, hakEdis: 142.2, satisTarihi: '2026-11-01', vadeTarihi: '2026-11-10 (Salı)', durum: 'PROVIZYON', vadeNotu: 'Kredi Kartı Provizyonu' },
            ];
          };

          // EĞER BİR BAYİNİN ÖZEL SAYFASI SEÇİLİYSE: HER BAYİYE BİR SAYFA (DETAYLI FİNANS & VADE EKSTRESİ)
          if (selectedBayiForDetail) {
            const currentSelected = listWithBalances.find((b) => b.bayiKodu === selectedBayiForDetail) || listWithBalances[0];
            const bayiOrders = getBayiOrders(currentSelected.bayiKodu);
            const bayiPayments = safeOdemeler.filter((o) => o && o.bayiKodu === currentSelected.bayiKodu);

            return (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* ÖZEL SAYFA ÜST BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedBayiForDetail(null)}
                      className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>← Bayi Listesine Dön</span>
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white">{currentSelected.firmaAdi}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                          {currentSelected.bayiKodu}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>Yetkili: <strong>{currentSelected.yetkiliAdi}</strong></span>
                        <span>•</span>
                        <span>Telefon: <strong>{currentSelected.telefon}</strong></span>
                        <span>•</span>
                        <span>Bölge: <strong>{currentSelected.sehir} / {currentSelected.ilce}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const cleanPhone = currentSelected.telefon.replace(/[^0-9]/g, '').replace(/^0/, '90');
                        const msg = `Sayın ${currentSelected.yetkiliAdi} (${currentSelected.firmaAdi}), Aşkar Yayınları & Not Avcısı güncel satış ve hak ediş ekstreniz:\n\n` +
                          `📦 Toplam Satış: ${currentSelected.satisAdedi} Paket\n` +
                          `💰 Toplam Hak Ediş: ${(Number(currentSelected.toplamHakEdis) || 0).toLocaleString('tr-TR')} ₺\n` +
                          `✅ Ödenen Tutar: ${(Number(currentSelected.odenenTutar) || 0).toLocaleString('tr-TR')} ₺\n` +
                          `⏳ Kalan Bakiye: ${(Number(currentSelected.kalanBakiye) || 0).toLocaleString('tr-TR')} ₺\n\n` +
                          `Detaylar için bayi panelinize giriş yapabilirsiniz: https://www.askaryayinlari.com.tr/bayi-giris\n` +
                          `Aşkar Yayınları Muhasebe Masası`;
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Finans Raporu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenNewPayment(currentSelected.bayiKodu)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Ödeme Yap & Dekont Kaydet</span>
                    </button>
                  </div>
                </div>

                {/* 4 ÖZEL BAYİ KPI KARTI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Kendi Vasıtasıyla Kayıt / Satış</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      {currentSelected.satisAdedi} Satış
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {currentSelected.kayitAdedi} Kayıt • %{Math.round((currentSelected.satisAdedi / currentSelected.kayitAdedi) * 100)} Dönüşüm Oranı
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Toplam Üretilen Ciro</span>
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      {(Number(currentSelected.toplamCiro) || 0).toLocaleString('tr-TR')} ₺
                    </div>
                    <p className="text-[11px] text-slate-500">{currentSelected.satisAdedi} Paket x 711 ₺ Satış Tutarı</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Net Hak Ediş (%20 Komisyon)</span>
                      <DollarSign className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      {(Number(currentSelected.toplamHakEdis) || 0).toLocaleString('tr-TR')} ₺
                    </div>
                    <p className="text-[11px] text-slate-500">Temsilcinin hak ettiği toplam net kazanç</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Ödenen ve Kalan Bakiye</span>
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl font-black text-emerald-400">
                        {(Number(currentSelected.odenenTutar) || 0).toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-xs text-slate-500">/</span>
                      <span className="text-lg font-black text-amber-400">
                        {(Number(currentSelected.kalanBakiye) || 0).toLocaleString('tr-TR')} ₺ Kalan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {(Number(currentSelected.kalanBakiye) || 0) > 0 ? 'Ödenmesi gereken vadesi gelen tutar' : 'Tamamı ödendi'}
                    </p>
                  </div>
                </div>

                {/* BÖLÜM 1: SATILAN SAYILARA GÖRE VE HAK EDİŞ TARİHLERİNDE YAPILACAK & YAPILAN ÖDEMELER */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <span>Satılan Paketlere Göre Hak Ediş & Ödeme Vade Takvimi (Şeffaf Döküm)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Temsilcinin kendi vasıtasıyla yaptığı satışlar, hangi tarihte hesabına aktarılacağı ve ödeme durumu:
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300">
                      Her Hafta Salı Günleri Ödeme
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="py-3 px-3">Sipariş No</th>
                          <th className="py-3 px-3">Öğrenci / Veli</th>
                          <th className="py-3 px-3">Paket</th>
                          <th className="py-3 px-3 text-right">Satış Tutarı</th>
                          <th className="py-3 px-3 text-right text-amber-400">Hak Ediş (%20)</th>
                          <th className="py-3 px-3">Satış Tarihi</th>
                          <th className="py-3 px-3">Ödeme Vadesi (Tarih)</th>
                          <th className="py-3 px-3 text-right">Ödeme Durumu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {bayiOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-850/50 transition">
                            <td className="py-3.5 px-3 font-mono text-slate-300 font-bold">
                              {ord.siparisNo}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="font-bold text-white block">{ord.veliAdi}</span>
                              <span className="text-[11px] text-slate-400">{ord.sinif}</span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-300">
                              {ord.paket}
                            </td>
                            <td className="py-3.5 px-3 text-right font-bold text-slate-200 font-mono">
                              {ord.tutar} ₺
                            </td>
                            <td className="py-3.5 px-3 text-right font-black text-amber-400 font-mono">
                              {ord.hakEdis} ₺
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 font-mono">
                              {ord.satisTarihi}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-slate-300">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 font-bold">
                                📅 {ord.vadeTarihi}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              {ord.durum === 'ODENDI' ? (
                                <div className="inline-flex flex-col items-end">
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Ödendi</span>
                                  </span>
                                  {ord.dekontNo && (
                                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                                      📄 {ord.dekontNo}
                                    </span>
                                  )}
                                </div>
                              ) : ord.durum === 'BEKLIYOR' ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Ödeme Bekliyor ({ord.hakEdis} ₺)</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
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

                {/* BÖLÜM 2: BU BAYİYE YAPILAN BANKA TRANSFERLERİ VE DEKONT GEÇMİŞİ */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <span>Banka Ödeme Dekontları ({currentSelected.firmaAdi})</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Temsilcinin banka hesabına gönderilen resmi FAST / EFT transfer kayıtları:
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {bayiPayments.length} Kayıtlı Dekont
                    </span>
                  </div>

                  {bayiPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-bold">
                            <th className="py-3 px-3">Ödeme Tarihi</th>
                            <th className="py-3 px-3">Dekont No</th>
                            <th className="py-3 px-3">Banka IBAN</th>
                            <th className="py-3 px-3">Ödeme Türü</th>
                            <th className="py-3 px-3 text-right">Ödenen Tutar</th>
                            <th className="py-3 px-3">Açıklama / Not</th>
                            <th className="py-3 px-3 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          {bayiPayments.map((odm) => (
                            <tr key={odm.id} className="hover:bg-slate-850/50 transition">
                              <td className="py-3 px-3 font-mono text-slate-300">{odm.odemeTarihi}</td>
                              <td className="py-3 px-3">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-amber-300 font-bold text-xs inline-block">
                                  📄 {odm.dekontNo}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-300 text-[11px]">{odm.iban}</td>
                              <td className="py-3 px-3 text-slate-300">{odm.odemeTuru}</td>
                              <td className="py-3 px-3 text-right font-black text-emerald-400 font-mono text-sm">
                                {(Number(odm?.tutar) || 0).toLocaleString('tr-TR')} ₺
                              </td>
                              <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={odm.aciklama}>
                                {odm.aciklama || '—'}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSendPaymentWhatsAppDirect(odm)}
                                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                                    title="WhatsApp ile Temsilciye Dekont Gönder"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePayment(odm.id)}
                                    className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                                    title="Dekontu Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">
                      Bu temsilciye henüz kaydedilmiş banka ödemesi bulunmuyor. Yukarıdaki <strong>"+ Ödeme Yap & Dekont Kaydet"</strong> butonundan ilk ödemeyi işleyebilirsiniz.
                    </div>
                  )}
                </div>

                {/* BÖLÜM 3: RESMİ İŞLETME VE HESAP BİLGİLERİ KARTI */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span>Resmi Temsilcilik ve Banka Hesap Bilgileri</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block font-bold">Banka IBAN</span>
                      <code className="text-amber-300 font-mono font-bold block mt-1 break-all">{currentSelected.iban}</code>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block font-bold">Yetkili & İletişim</span>
                      <span className="text-white font-bold block mt-1">{currentSelected.yetkiliAdi} • {currentSelected.telefon}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block font-bold">Sorumlu Bölge</span>
                      <span className="text-white font-bold block mt-1">{currentSelected.sehir} / {currentSelected.ilce}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block font-bold">Komisyon Oranı</span>
                      <span className="text-emerald-400 font-bold font-mono block mt-1">%20 Net Kazanç</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ARAMA VE FİLTRELEME
          const filteredList = listWithBalances.filter((item) => {
            const q = bayiPaymentSearch.trim().toLowerCase();
            const matchSearch =
              !q ||
              item.firmaAdi.toLowerCase().includes(q) ||
              item.yetkiliAdi.toLowerCase().includes(q) ||
              item.bayiKodu.toLowerCase().includes(q) ||
              item.sehir.toLowerCase().includes(q) ||
              item.ilce.toLowerCase().includes(q);
            if (!matchSearch) return false;
            if (bayiPaymentFilter === 'UNPAID') return (Number(item.kalanBakiye) || 0) > 0;
            if (bayiPaymentFilter === 'PAID') return (Number(item.kalanBakiye) || 0) <= 0;
            return true;
          });

          return (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* ÜST BİLGİ VE AKSİYON */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                    <span>Bayi & Temsilci Hak Ediş, Kalan Bakiye ve Dekont Takip Masası</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Temsilcilerin hak ettiği net komisyonları, bankadan ödenen tutarları, kalan bakiyeleri ve 
                    resmi <strong>dekont numaralarını</strong> tek ekrandan yönetin. Her bayiye tıklayarak özel detay sayfasına gidebilirsiniz.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenNewPayment()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yeni Ödeme Yap & Dekont Kaydet</span>
                </button>
              </div>

              {/* 4 KPI KARTI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Toplam Bayi Hak Edişi</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {(Number(grandTotalHakEdis) || 0).toLocaleString('tr-TR')} ₺
                  </div>
                  <p className="text-[11px] text-slate-500">Not Avcısı ve kitap satış komisyonları</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Toplam Ödenen Tutar</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {(Number(grandTotalOdenen) || 0).toLocaleString('tr-TR')} ₺
                  </div>
                  <p className="text-[11px] text-slate-500">Bankadan transferi tamamlanan toplam</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Kalan / Ödenecek Bakiye</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {(Number(grandTotalKalan) || 0).toLocaleString('tr-TR')} ₺
                  </div>
                  <p className="text-[11px] text-slate-500">Temsilcilere ödenecek bekleyen tutar</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Kayıtlı Banka Dekontları</span>
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {safeOdemeler.length} Adet
                  </div>
                  <p className="text-[11px] text-slate-500">Sistemde onaylı ödeme dekontu</p>
                </div>
              </div>

              {/* BÖLÜM 1: TEMSİLCİ BAZINDA BAKİYE TABLOSU + ARAMA & FİLTRELEME BUTONLARI */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Store className="w-5 h-5 text-amber-400" />
                      <span>Temsilci Bazında Hak Ediş, Ödenen ve Kalan Bakiye Durumu</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Herhangi bir bayiye tıklayarak o bayiye özel satış, hak ediş ve ödeme vade sayfasına gidebilirsiniz.
                    </p>
                  </div>

                  {/* ARAMA VE FİLTRE BUTONLARI */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* Arama Inputu */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={bayiPaymentSearch}
                        onChange={(e) => setBayiPaymentSearch(e.target.value)}
                        placeholder="Bayi adı, kod, il/ilçe ara..."
                        className="pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-60"
                      />
                      {bayiPaymentSearch && (
                        <button
                          type="button"
                          onClick={() => setBayiPaymentSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filtreleme Butonları */}
                    <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setBayiPaymentFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          bayiPaymentFilter === 'ALL'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Tümü ({listWithBalances.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBayiPaymentFilter('UNPAID')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          bayiPaymentFilter === 'UNPAID'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Ödeme Bekleyen ({listWithBalances.filter((i) => i.kalanBakiye > 0).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBayiPaymentFilter('PAID')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          bayiPaymentFilter === 'PAID'
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Ödenenler ({listWithBalances.filter((i) => i.kalanBakiye <= 0).length})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-3">Temsilci / İşletme Adı</th>
                        <th className="py-3 px-3">Bölge & Kod</th>
                        <th className="py-3 px-3">Banka IBAN</th>
                        <th className="py-3 px-3 text-right">Kayıt / Satış</th>
                        <th className="py-3 px-3 text-right">Hak Ediş (₺)</th>
                        <th className="py-3 px-3 text-right text-emerald-400">Ödenen (₺)</th>
                        <th className="py-3 px-3 text-right text-amber-400">Kalan Bakiye (₺)</th>
                        <th className="py-3 px-3">Son Dekont No</th>
                        <th className="py-3 px-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredList.map((item) => (
                        <tr key={item.bayiKodu} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-3">
                            <button
                              type="button"
                              onClick={() => setSelectedBayiForDetail(item.bayiKodu)}
                              className="text-left group cursor-pointer"
                            >
                              <span className="font-bold text-white group-hover:text-amber-400 transition block">
                                {item.firmaAdi} ↗
                              </span>
                              <span className="text-[11px] text-slate-400">{item.yetkiliAdi} • {item.telefon}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-slate-300 block">{item.sehir} / {item.ilce}</span>
                            <code className="text-[10px] font-mono text-amber-400 font-bold">{item.bayiKodu}</code>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px] max-w-[180px] truncate" title={item.iban}>
                            {item.iban}
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-slate-300">
                            <span className="text-white">{item.satisAdedi} Satış</span>
                            <span className="text-[10px] text-slate-500 block">({item.kayitAdedi} Kayıt)</span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-white font-mono">
                            {(Number(item.toplamHakEdis) || 0).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-emerald-400 font-mono">
                            {(Number(item.odenenTutar) || 0).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            {(Number(item.kalanBakiye) || 0) > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                                {(Number(item.kalanBakiye) || 0).toLocaleString('tr-TR')} ₺
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                                Tamamı Ödendi
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-mono text-slate-300 text-[11px] font-bold block">{item.sonDekontNo}</span>
                            <span className="text-[10px] text-slate-500">{item.sonDekontTarih}</span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedBayiForDetail(item.bayiKodu)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                                title="Bu bayiye ait özel sayfayı, satışları ve vade takvimini aç"
                              >
                                <span>Özel Sayfa ↗</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenNewPayment(item.bayiKodu)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                                title="Bu temsilciye ödeme yap ve dekont kaydet"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ödeme Yap</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BÖLÜM 2: DEKONT GEÇMİŞİ LİSTESİ */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span>Ödeme Dekontları ve Banka Transfer Kayıtları</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {safeOdemeler.length} Dekont Kayıtlı
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-3">Ödeme Tarihi</th>
                        <th className="py-3 px-3">Temsilci / İşletme</th>
                        <th className="py-3 px-3">Dekont No</th>
                        <th className="py-3 px-3">Ödeme Türü</th>
                        <th className="py-3 px-3 text-right">Ödenen Tutar</th>
                        <th className="py-3 px-3">Açıklama / Not</th>
                        <th className="py-3 px-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {safeOdemeler.map((odm) => (
                        <tr key={odm.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {odm.odemeTarihi}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{odm.firmaAdi}</span>
                            <span className="text-[11px] text-slate-400">{odm.yetkiliAdi} • {odm.bayiKodu}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-amber-300 font-bold text-xs inline-block">
                              📄 {odm.dekontNo}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-300">{odm.odemeTuru}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-emerald-400 font-mono text-sm">
                            {(Number(odm?.tutar) || 0).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={odm.aciklama}>
                            {odm.aciklama || '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSendPaymentWhatsAppDirect(odm)}
                                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                                title="WhatsApp ile Temsilciye Dekont Gönder"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePayment(odm.id)}
                                className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                                title="Dekontu Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

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

      {/* YENİ ÖDEME VE DEKONT KAYIT MODALI */}
      {isNewPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Bayi Ödemesi Yap & Dekont Kaydet</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Temsilciye yapılan banka transferini ve dekont numarasını sisteme işleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPaymentModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Ödeme Yapılacak Temsilci / Bayi *</label>
                <select
                  value={paymentForm.bayiKodu}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bayiKodu: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="ASKAR-KADIKOY">Kadıköy Başarı Kırtasiye (ASKAR-KADIKOY)</option>
                  <option value="ASKAR-CANKAYA">Çankaya Akademi Kitabevi (ASKAR-CANKAYA)</option>
                  {applications.filter((a) => a.bayiKodu && a.bayiKodu !== 'ASKAR-KADIKOY' && a.bayiKodu !== 'ASKAR-CANKAYA').map((a) => (
                    <option key={a.id} value={a.bayiKodu}>
                      {a.firmaAdi} ({a.bayiKodu}) - {a.sehir} / {a.ilce}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Ödenen Tutar (₺) *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Örn: 1500"
                    value={paymentForm.tutar}
                    onChange={(e) => setPaymentForm({ ...paymentForm, tutar: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Dekont Numarası *</label>
                  <input
                    type="text"
                    placeholder="Örn: EFT-20261103-8841"
                    value={paymentForm.dekontNo}
                    onChange={(e) => setPaymentForm({ ...paymentForm, dekontNo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Ödeme Tarihi *</label>
                  <input
                    type="date"
                    value={paymentForm.odemeTarihi}
                    onChange={(e) => setPaymentForm({ ...paymentForm, odemeTarihi: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Ödeme Yöntemi</label>
                  <select
                    value={paymentForm.odemeTuru}
                    onChange={(e) => setPaymentForm({ ...paymentForm, odemeTuru: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Havale / EFT">Havale / EFT</option>
                    <option value="FAST">FAST (Anlık Transfer)</option>
                    <option value="Kredi Kartı Mutabakatı">Kredi Kartı Mutabakatı</option>
                    <option value="Nakit">Nakit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Açıklama / Dekont Notu</label>
                <input
                  type="text"
                  placeholder="Örn: Ekim ayı 4. hafta hak ediş ödemesi"
                  value={paymentForm.aciklama}
                  onChange={(e) => setPaymentForm({ ...paymentForm, aciklama: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewPaymentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 font-bold text-xs transition cursor-pointer"
              >
                Vazgeç
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSavePayment(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  💾 Dekontu Kaydet
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePayment(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kaydet & WhatsApp Bildir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ŞARTLARI DÜZENLE VE GÖNDER MODALI */}
      {editingTermsApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Bayilik Şartlarını Düzenle ve Gönder</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>{editingTermsApp.firmaAdi}</strong> ({editingTermsApp.adSoyad}) • {editingTermsApp.sehir} / {editingTermsApp.ilce}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTermsApp(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Bayi Kodu</label>
                <input
                  type="text"
                  value={termsData.bayiKodu}
                  onChange={(e) => handleUpdateTermsField('bayiKodu', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Komisyon / Kazanç Oranı</label>
                <input
                  type="text"
                  value={termsData.komisyonOrani}
                  onChange={(e) => handleUpdateTermsField('komisyonOrani', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Hak Ediş Ödeme Takvimi</label>
                <input
                  type="text"
                  value={termsData.odemeTakvimi}
                  onChange={(e) => handleUpdateTermsField('odemeTakvimi', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Bölge Koruması & Satış Kotası</label>
                <input
                  type="text"
                  value={termsData.kota}
                  onChange={(e) => handleUpdateTermsField('kota', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Özel Bilgilendirme Notu</label>
                <input
                  type="text"
                  value={termsData.ozelNot}
                  onChange={(e) => handleUpdateTermsField('ozelNot', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Mesaj Önizlemesi & Serbest Düzenleme */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-amber-300">
                  Gönderilecek Mesaj Metni (İstediğiniz Gibi Düzenleyebilirsiniz):
                </label>
                <button
                  type="button"
                  onClick={handleCopyTermsMessage}
                  className="text-slate-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{termsData.copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>
              </div>
              <textarea
                rows={9}
                value={termsData.mesajMetni}
                onChange={(e) => setTermsData({ ...termsData, mesajMetni: e.target.value })}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-sans leading-relaxed focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveTermsToApp}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                💾 Şartları Başvuruya Kaydet
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendTermsEmail}
                  className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>E-Posta Gönder</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTermsWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 WhatsApp ile Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};
