import React, { useState, useEffect } from 'react';
import { Target, Award, CheckCircle, Sparkles, Clock, BookOpen, ShieldCheck, ArrowRight, Play, Star, Building2, UserCheck } from 'lucide-react';
import { NOT_AVCISI_KARTLARI } from '../data/notAvcisiData';
import { NotAvcisiSinifKart, OgrenciProfil, BayiProfil, SinavSonuc, SinavProva } from '../types/notAvcisiTypes';
import { NotAvcisiRegisterModal } from './NotAvcisiRegisterModal';
import { NotAvcisiBayiModal } from './NotAvcisiBayiModal';
import { NotAvcisiExamSimulator } from './NotAvcisiExamSimulator';
import { NotAvcisiReportModal } from './NotAvcisiReportModal';
import { ornekSinavOlustur } from '../data/notAvcisiSampleExam';
import { ogrenciGetir, ogrenciKaydet, sonucHesapla } from '../utils/notAvcisiEngine';

export const NotAvcisiPage: React.FC = () => {
  const [selectedSinif, setSelectedSinif] = useState<number | 'tumu'>('tumu');
  const [bayiKoduInput, setBayiKoduInput] = useState<string>('');
  const [appliedBayiKodu, setAppliedBayiKodu] = useState<string | null>(null);

  // Modallar
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBayiModalOpen, setIsBayiModalOpen] = useState(false);
  
  // Aktif Sınav ve Rapor Durumu
  const [activeSinav, setActiveSinav] = useState<SinavProva | null>(null);
  const [activeSonuc, setActiveSonuc] = useState<SinavSonuc | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Kayıtlı Öğrenci
  const [ogrenci, setOgrenci] = useState<OgrenciProfil | null>(null);

  useEffect(() => {
    const kayitli = ogrenciGetir();
    if (kayitli) {
      setOgrenci(kayitli);
      if (kayitli.bayiRefKodu) {
        setAppliedBayiKodu(kayitli.bayiRefKodu);
      }
    }
  }, []);

  const filteredKartlar = selectedSinif === 'tumu'
    ? NOT_AVCISI_KARTLARI
    : NOT_AVCISI_KARTLARI.filter(k => k.sinif === selectedSinif);

  const handleApplyBayiKodu = (e: React.FormEvent) => {
    e.preventDefault();
    if (bayiKoduInput.trim()) {
      setAppliedBayiKodu(bayiKoduInput.trim().toUpperCase());
    }
  };

  const handleStartExam = (sinif: number, ders = 'Matematik') => {
    const exam = ornekSinavOlustur(sinif, ders);
    setActiveSinav(exam);
  };

  const handleExamCompleted = (puanlar: { [soruNo: number]: number }, harcananSure: number) => {
    if (!activeSinav) return;
    const ogrenciId = ogrenci ? ogrenci.id : 'misafir_ogrenci';
    const sonuc = sonucHesapla(activeSinav, puanlar, harcananSure, ogrenciId);
    setActiveSinav(null);
    setActiveSonuc(sonuc);
    setIsReportOpen(true);
  };

  const handleRegisterSuccess = (profil: OgrenciProfil) => {
    ogrenciKaydet(profil);
    setOgrenci(profil);
    if (profil.bayiRefKodu) {
      setAppliedBayiKodu(profil.bayiRefKodu);
    }
    alert(`Hoş geldin ${profil.adSoyad}! Not Avcısı kaydınız başarıyla oluşturuldu.`);
  };

  const handleBayiSuccess = (bayi: BayiProfil) => {
    alert(`Tebrikler ${bayi.yetkiliAdSoyad}! Bayi başvurunuz onaylandı. Özel Bayi Kodunuz: ${bayi.bayiKodu}. Afiş PDF'iniz e-posta adresinize iletildi.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Sınav Ekranı Aktifse Simülatörü Tam Ekran Göster */}
      {activeSinav && (
        <NotAvcisiExamSimulator
          sinav={activeSinav}
          ogrenciAdi={ogrenci ? ogrenci.adSoyad : 'Sevgili Öğrenci'}
          onFinishExam={handleExamCompleted}
          onExit={() => setActiveSinav(null)}
        />
      )}

      {/* Rapor Modalı */}
      {activeSonuc && (
        <NotAvcisiReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          sonuc={activeSonuc}
          ogrenciAdi={ogrenci ? ogrenci.adSoyad : 'Sevgili Öğrenci'}
          onRetakeExam={() => {
            setIsReportOpen(false);
            if (activeSonuc) handleStartExam(activeSonuc.sinif, activeSonuc.dersAdi);
          }}
        />
      )}

      {/* Kayıt Modalı */}
      <NotAvcisiRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
        initialBayiRef={appliedBayiKodu || ''}
      />

      {/* Bayi Başvuru Modalı */}
      <NotAvcisiBayiModal
        isOpen={isBayiModalOpen}
        onClose={() => setIsBayiModalOpen(false)}
        onSuccess={handleBayiSuccess}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-amber-500/20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo & Mascot Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm tracking-wide mb-6 shadow-lg shadow-amber-500/5">
            <Target className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>NOT AVCISI • YAZILI ÖN HAZIRLIK SİMÜLASYONU</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Gerçek Yazılıya Girmeden Önce <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Kendini Dene, 100 Tam Puanı Avla!
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
            3. sınıftan 12. sınıfa kadar MEB formatında 40 dakikalık süreli provalar, korumalı ekran, 
            nokta atışı kazanım analizi ve Koç Baykuş'un sınav tavsiyeleriyle yazılı korkusuna son ver!
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => handleStartExam(5, 'Matematik')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-lg shadow-xl shadow-amber-500/20 transform transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Matematik 1. Yazılıyı Ücretsiz Çöz</span>
            </button>

            {ogrenci ? (
              <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-base">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Hoş geldin, {ogrenci.adSoyad} ({ogrenci.sinif}. Sınıf)</span>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-lg transition cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Kulübe Kaydol (Veli Onaylı)</span>
              </button>
            )}

            <button
              onClick={() => setIsBayiModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 font-semibold text-base transition cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Bayi / Kırtasiye Başvurusu</span>
            </button>
          </div>

          {/* Bayi / İndirim Kodu Giriş Çubuğu */}
          <div className="max-w-md mx-auto p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <form onSubmit={handleApplyBayiKodu} className="flex gap-2">
              <input
                type="text"
                placeholder="Bayi veya İndirim Kodunuz var mı?"
                value={bayiKoduInput}
                onChange={(e) => setBayiKoduInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                Uygula
              </button>
            </form>
            {appliedBayiKodu && (
              <p className="mt-2 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Bayi Kodu "{appliedBayiKodu}" Tanımlandı: %10 İndirim Aktif! (711 TL)
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sınıf Filtre Sekmeleri */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-x-auto flex items-center gap-2 scrollbar-none">
          <button
            onClick={() => setSelectedSinif('tumu')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition cursor-pointer ${
              selectedSinif === 'tumu'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Tüm Sınıflar (3 - 12)
          </button>
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSinif(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSinif === s
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s}. Sınıf
            </button>
          ))}
        </div>
      </section>

      {/* Sınıf Kartları Vitrini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Sınıfını Seç, Yazılı Provalarına Hemen Başla!
          </h2>
          <p className="mt-3 text-lg text-slate-400">
            Her sınıfta tüm dönemlerin yazılı sınavları, genel provalar ve çözümlü MEB kazanım raporları.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredKartlar.map((kart: NotAvcisiSinifKart) => (
            <div
              key={kart.sinif}
              className="group rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              {/* Kart Üst Görseli */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={kart.gorselUrl}
                  alt={kart.baslik}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{kart.sinif}. SINIF YAZILI</span>
                </div>
              </div>

              {/* Kart İçerik Bilgileri */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition mb-2">
                    {kart.baslik}
                  </h3>
                  <p className="text-amber-400/90 font-semibold text-sm mb-3">
                    {kart.altBaslik}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {kart.aciklama}
                  </p>

                  {/* Özellik Maddeleri */}
                  <div className="space-y-2 mb-6">
                    {kart.ozellikler.map((oz, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{oz}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alt Fiyat ve Aksiyon Alanı */}
                <div className="pt-5 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Yıllık Lisans</span>
                      <div className="flex items-baseline gap-2">
                        {appliedBayiKodu ? (
                          <>
                            <span className="text-sm text-slate-500 line-through">790 TL</span>
                            <span className="text-2xl font-black text-emerald-400">711 TL</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl font-black text-white">790 TL</span>
                            <span className="text-xs text-amber-400 font-bold">(Bayi Koduyla 711 TL)</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartExam(kart.sinif, 'Matematik')}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Ücretsiz Dene</span>
                    </button>
                  </div>

                  {/* Shopier Satın Alma Butonu */}
                  <a
                    href={kart.shopierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition"
                  >
                    <span>Shopier ile Güvenli Satın Al</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bilgilendirici Bölüm: Neden Not Avcısı? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">40 Dakikalık Gerçek Simülasyon</h4>
                <p className="text-slate-400 text-sm">
                  Yazılı sınavlar 40 dakikadır. Erken bitirmek yok! Koç Baykuş süreyi ve kontrol disiplinini bizzat yönetir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Nokta Atışı MEB Kazanım Analizi</h4>
                <p className="text-slate-400 text-sm">
                  Hangi soruda hangi kazanımdan puan kaybettin? Sistem milimetrik analiz eder ve çalışma reçeteni önüne koyar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Aşkar Koçluk & Kitap Desteği</h4>
                <p className="text-slate-400 text-sm">
                  Sınıfına özel Aşkar Yayınları koçluk kitapları ve tarihi bilim romanlarıyla entegre, eksiksiz bir başarı ekosistemi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
