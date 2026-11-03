import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Layers,
  Clock,
  MessageCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { TURKEY_CITIES, TURKEY_DISTRICTS } from '../../data/turkeyLocations';
import type { BayiBasvuruModel } from '../../types/bayi';

interface AskarBayiBasvuruViewProps {
  onBackToApp?: () => void;
  onNavigateToBayiLogin?: () => void;
}

export const AskarBayiBasvuruView: React.FC<AskarBayiBasvuruViewProps> = ({
  onBackToApp,
  onNavigateToBayiLogin
}) => {
  const [formData, setFormData] = useState({
    adSoyad: '',
    firmaAdi: '',
    telefon: '',
    email: '',
    sehir: 'İstanbul',
    ilce: 'Kadıköy',
    meslek: 'Kırtasiye / Kitabevi',
    iban: '',
    vergiNo: '',
    notlar: '',
    kurallarOnaylandi: false,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableDistricts = TURKEY_DISTRICTS[formData.sehir] || [];

  const handleCityChange = (newCity: string) => {
    const districts = TURKEY_DISTRICTS[newCity] || [];
    setFormData((prev) => ({
      ...prev,
      sehir: newCity,
      ilce: districts[0] || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.adSoyad.trim()) {
      setErrorMsg('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!formData.firmaAdi.trim()) {
      setErrorMsg('Lütfen kırtasiye veya işletme adınızı belirtiniz.');
      return;
    }
    if (!formData.telefon.trim() || formData.telefon.trim().length < 10) {
      setErrorMsg('Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!formData.kurallarOnaylandi) {
      setErrorMsg('Lütfen temsilcilik şartlarını ve sorumluluk alanı kurallarını onaylayınız.');
      return;
    }

    const newBasvuru: BayiBasvuruModel = {
      id: `basvuru_${Date.now()}`,
      adSoyad: formData.adSoyad.trim(),
      firmaAdi: formData.firmaAdi.trim(),
      telefon: formData.telefon.trim(),
      email: formData.email.trim(),
      sehir: formData.sehir,
      ilce: formData.ilce,
      meslek: formData.meslek,
      iban: formData.iban.trim() || undefined,
      vergiNo: formData.vergiNo.trim() || undefined,
      notlar: formData.notlar.trim() || undefined,
      satisKotasiOnaylandi: true,
      durum: 'Beklemede',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('askar_bayi_basvurulari');
      const list: BayiBasvuruModel[] = existing ? JSON.parse(existing) : [];
      list.unshift(newBasvuru);
      localStorage.setItem('askar_bayi_basvurulari', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('askar_bayi_basvuru_added', { detail: newBasvuru }));
    } catch (err) {
      console.error('Başvuru kaydedilemedi:', err);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Üst Navigasyon Barı */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 shadow-lg">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="p-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Ana Sayfaya Dön"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kitaplığa Dön</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black">
                <Store className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight block">
                  Aşkar Yayınları
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                  İlçe Temsilciliği & Kırtasiye Programı
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/905057162939?text=Merhaba%20A%C5%9Fkar%20Yay%C4%B1nlar%C4%B1,%20%C4%B0l%C3%A7e%20Temsilcilik%20Ba%C5%9Fvurusu%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">WhatsApp Temsilci Hattı</span>
            </a>

            {onNavigateToBayiLogin && (
              <button
                type="button"
                onClick={onNavigateToBayiLogin}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>Mevcut Temsilci Girişi</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* HERO BÖLÜMÜ */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Eğitimde Güçlü İş Ortaklığı ve Temsilcilik Modeli</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Çevrenizdeki Öğrenci, Öğretmen ve Veliler İçin <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Aşkar Yayınları ve Not Avcısı'nın Yetkili Satış ve Danışma Noktası Olun!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-3xl">
              Aşkar Yayınları ve Not Avcısı dijital eğitim ekosistemine dahil olarak çevrenizdeki öğrenci ve velilere yeni nesil MEB yazılı simülasyonları ve koçluk kitaplarımızı güvenle ulaştırın. <strong>Kırtasiyeler, kitapevleri, kütüphane işletmecileri, eğitim danışmanları ve düzenli iş arayanlar</strong> temsilcilik için başvurabilirler. Sıfır stok riski, dijital erişim avantajı ve güçlü kurumsal altyapımızla hemen iş ortağımız olun.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kırtasiye ve Kitapevleri</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kütüphane & Etüt İşletmecileri</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Düzenli İş & Gelir Arayanlar</span>
              </div>

            </div>
          </div>
        </section>

        

        {/* 2 SÜTUNLU BAŞVURU BÖLÜMÜ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SOL KOLON: Kurallar ve İlkeler (5 Kolon) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span>3 Basit Adımda Temsilcilik Süreci</span>
              </h3>
              
              <div className="space-y-4 text-xs font-medium">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Başvuru Formunu Doldurun</h4>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      İşletme bilgilerinizi ve sorumlu olmak istediğiniz ilçeyi formdan iletin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Değerlendirme İncelemesi</h4>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Genel Merkezimiz başvurunuzu inceler; iş birliği şartları ve hak ediş modeli tarafınıza iletilir.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-black text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Karekodlu Afiş</h4>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Onay sonrası size özel karekodlu afiş PDF'iniz üretilerek WhatsApp ve e-posta ile gönderilir.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Çalışma Şartları & Pusula Junior Kuralları */}
            <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/30 space-y-3">

              <div className="text-xs text-slate-300 leading-relaxed font-medium space-y-2.5">
                <p>
                  • <strong>Güvenli ve Risk Taşımayan Sistem:</strong> Veliler tüm ödemelerini doğrudan 256-Bit SSL güvenceli dijital sistem üzerinden gerçekleştirir. Temsilcilerimiz nakit tahsilat veya stok maliyeti riski taşımaz.
                </p>
                <p>
                  • <strong>Şartlar ve Bilgilendirme Paylaşımı:</strong> Başvurunuz Genel Merkezimizce incelendikten sonra tarafınıza özel olarak iletilir.
                </p>
                <p>
                  • <strong>Kişiye Özel Tanıtım Desteği:</strong> Onaylanan temsilcilerimize karekodlu afişler, broşürler ve veli bilgilendirme dokümanları dijital olarak temin edilir.
                </p>

              </div>
            </div>
          </div>

          {/* SAĞ KOLON: Başvuru Formu (7 Kolon) */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              {isSubmitted ? (
                /* Başvuru Başarılı Ekranı */
                <div className="text-center py-8 px-4 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Başvurunuz İncelemeye Alındı!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                      Sayın <strong>{formData.adSoyad}</strong> ({formData.firmaAdi}), 
                      <strong> {formData.sehir} - {formData.ilce}</strong> bölgesi için yaptığınız temsilcilik başvurusu başarıyla Genel Merkezimize ulaşmıştır.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left leading-relaxed space-y-1">
                    <p className="font-bold">Önemli Süreç Bilgisi:</p>
                    <p>
                      Başvurunuz <strong>Genel Merkezimizce</strong> incelendikten sonra onaylanacak ve 
                      <strong> size özel üretilen karekodlu afiş PDF'iniz</strong>, sözleşme şartları ile birlikte 
                      <strong> {formData.telefon}</strong> nolu WhatsApp hattınıza ve <strong>{formData.email}</strong> adresinize bizzat gönderilecektir.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
                    >
                      Yeni Başvuru Yap
                    </button>
                    {onBackToApp && (
                      <button
                        type="button"
                        onClick={onBackToApp}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
                      >
                        Ana Sayfaya Dön
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Başvuru Formu */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-amber-600" />
                      <span>Temsilcilik Ön Başvuru Formu</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Lütfen işletme ve bölge bilgilerinizi eksiksiz doldurunuz.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kırtasiye / Firma Adı *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Başarı Kırtasiye & Kitabevi"
                        value={formData.firmaAdi}
                        onChange={(e) => setFormData({ ...formData, firmaAdi: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Yetkili Adı Soyadı *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Adınız ve Soyadınız"
                        value={formData.adSoyad}
                        onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Telefon / WhatsApp Hattı *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formData.telefon}
                        onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        E-posta Adresi *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="kirtasiye@ornek.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* SORUMLULUK ALANI SEÇİMİ */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bulunduğunuz İl *
                        </label>
                        <select
                          value={formData.sehir}
                          onChange={(e) => handleCityChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none cursor-pointer"
                        >
                          {TURKEY_CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sorumlu Olmak İstediğiniz İlçe *
                        </label>
                        <select
                          value={formData.ilce}
                          onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none cursor-pointer"
                        >
                          {availableDistricts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FİNANS & VERGİ BİLGİLERİ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Komisyon Ödemesi İçin IBAN
                      </label>
                      <input
                        type="text"
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        value={formData.iban}
                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Vergi No veya TC Kimlik No
                      </label>
                      <input
                        type="text"
                        placeholder="Fatura / Gider Pusulası İçin"
                        value={formData.vergiNo}
                        onChange={(e) => setFormData({ ...formData, vergiNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      İşletmeniz veya Çevrenizdeki Okul Potansiyeli Hakkında Notlar
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Örn: İlçemizde 8 adet ortaokul ve 4 adet lisenin tam karşısındayız..."
                      value={formData.notlar}
                      onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-900 outline-none resize-none"
                    />
                  </div>

                  {/* Kural Onay Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={formData.kurallarOnaylandi}
                        onChange={(e) => setFormData({ ...formData, kurallarOnaylandi: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                      />
                      <span className="leading-relaxed">
                        Aşkar Yayınları temsilcilik ön başvuru koşullarını ve başvurumun 
                        <strong> Genel Merkezimizce incelendikten sonra tarafıma iş ortaklığı şartları ve temsilci bilgilerinin iletileceğini</strong> kabul ediyorum. *
                      </span>
                    </label>
                  </div>

                  {/* Başvur Butonu */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition transform active:scale-[0.99] cursor-pointer"
                  >
                    Temsilcilik Başvurusunu Tamamla ve İncelemeye Gönder
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
