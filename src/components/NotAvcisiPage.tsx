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
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-sans pb-24 selection:bg-[#C9A86A] selection:text-[#1A1A1A]">
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

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-br from-[#1A1A1A] via-[#24221F] to-[#1A1A1A] border-b-2 border-[#C9A86A]/60 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#C9A86A]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo & Mascot Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/40 text-[#E5C98E] text-[11px] font-mono uppercase tracking-[0.2em] font-bold mb-6 shadow-sm">
            <img src="/resimler/branding/not-avcisi-logo.jpg" alt="Logo" className="w-4 h-4 rounded-full object-cover" />
            <span>NOT AVCISI • YAZILI ÖN HAZIRLIK SİMÜLASYONU</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white mb-6 leading-tight">
            Gerçek Yazılıya Girmeden Önce <br />
            <span className="text-[#C9A86A]">
              Kendini Dene, 100 Tam Puanı Avla!
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-zinc-300 mb-8 font-sans leading-relaxed">
            3. sınıftan 12. sınıfa kadar MEB formatında 40 dakikalık süreli provalar, korumalı ekran, 
            nokta atışı kazanım analizi ve Koç Baykuş'un sınav tavsiyeleriyle yazılı korkusuna son ver!
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
            <button
              onClick={() => handleStartExam(5, 'Matematik')}
              className="bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] flex items-center gap-2 shadow-lg hover:scale-102 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Matematik 1. Yazılıyı Ücretsiz Çöz</span>
            </button>

            {ogrenci ? (
              <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs tracking-wide">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Hoş geldin, {ogrenci.adSoyad} ({ogrenci.sinif}. Sınıf)</span>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C9A86A]" />
                <span>Kulübe Kaydol (Veli Onaylı)</span>
              </button>
            )}
          </div>

          {/* Bayi / İndirim Kodu Giriş Çubuğu */}
          <div className="max-w-md mx-auto p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C9A86A]/40 shadow-xl">
            <form onSubmit={handleApplyBayiKodu} className="flex gap-2">
              <input
                type="text"
                placeholder="Bayi veya İndirim Kodunuz var mı?"
                value={bayiKoduInput}
                onChange={(e) => setBayiKoduInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-[#C9A86A]"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
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

      {/* Sınıf Filtre Butonları (Kitaplık Tarzı) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-2 rounded-2xl bg-white border border-[#1A1A1A]/10 shadow-lg overflow-x-auto flex items-center gap-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedSinif('tumu')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSinif === 'tumu'
                ? 'bg-[#1A1A1A] text-white shadow-md'
                : 'bg-[#FAF9F6] border border-[#1A1A1A]/10 text-zinc-700 hover:border-[#C9A86A] hover:text-[#1A1A1A]'
            }`}
          >
            Tüm Sınıflar (3 - 12)
          </button>
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSinif(s)}
              className={`px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSinif === s
                  ? 'bg-[#C9A86A] text-[#1A1A1A] font-black shadow-sm'
                  : 'bg-[#FAF9F6] border border-[#1A1A1A]/10 text-zinc-700 hover:border-[#C9A86A] hover:text-[#1A1A1A]'
              }`}
            >
              {s}. Sınıf
            </button>
          ))}
        </div>
      </section>

      {/* Sınıf Kartları Vitrini (Kitaplık Renkleri & Genel Yapısı) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
              <span>YAZILI ÖN HAZIRLIK • 3-12. SINIF</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Sınıfını Seç, Yazılı Provalarına Hemen Başla!
            </h2>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
            Her sınıfta tüm dönemlerin yazılı sınavları, genel provalar ve çözümlü MEB kazanım raporları.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {filteredKartlar.map((kart: NotAvcisiSinifKart) => (
            <article
              key={kart.sinif}
              className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
            >
              {/* Üst Kart Alanı - TAM DAİRE GÖRÜNEN KOÇ BAYKUŞ */}
              <div className="relative aspect-square max-h-56 w-full rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300 flex items-center justify-center p-3">
                {/* Sol Üst Not Avcısı Rozeti */}
                <div className="absolute top-2.5 left-2.5 bg-white/95 border border-[#1A1A1A]/10 text-[#1A1A1A] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1 z-10">
                  <img
                    src="/resimler/branding/not-avcisi-logo.jpg"
                    alt="Not Avcısı"
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span>NOT AVCISI</span>
                </div>

                {/* Sağ Üst Sınıf Rozeti */}
                <div className="absolute top-2.5 right-2.5 bg-[#FAF6EE] text-[#856526] border border-[#C9A86A]/40 text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1 z-10">
                  <Star className="w-3 h-3 fill-[#C9A86A] text-[#C9A86A]" />
                  <span>{kart.sinif}. SINIF YAZILI</span>
                </div>

                {/* TAM DAİRE GÖRÜNEN KOÇ BAYKUŞ (Uncropped Full Circle) */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-[#C9A86A] p-0.5 bg-white shadow-md shadow-amber-500/10 overflow-hidden shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/resimler/branding/not-avcisi-baykus.jpg"
                    alt="Koç Baykuş"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="absolute bottom-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                  SİMÜLASYON + MEB RAPORU
                </div>
              </div>

              {/* Kart İçerik Bilgileri */}
              <div className="mb-4 flex-1">
                {/* NOT AVCISI LOGOSU + BAŞLIK */}
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src="/resimler/branding/not-avcisi-logo.jpg"
                    alt="Not Avcısı Logo"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#C9A86A]/50 object-cover shrink-0 shadow-2xs"
                  />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] leading-snug group-hover:text-[#856526] transition-colors">
                    {kart.baslik}
                  </h3>
                </div>

                {/* Alt Başlık Rozeti */}
                <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#856526] bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#C9A86A]/40 mb-2 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0" />
                  <span className="truncate">{kart.altBaslik}</span>
                </div>

                <p className="text-xs text-[#1A1A1A]/70 font-sans italic leading-relaxed min-h-[2.5rem]">
                  {kart.aciklama}
                </p>

                {/* Özellik Maddeleri */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-[#1A1A1A]/10">
                  {kart.ozellikler.map((oz, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#1A1A1A]/85 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{oz}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiyat ve Format Bilgileri (Kitaplık Formatında) */}
              <div className="pt-3 pb-3 border-t border-[#1A1A1A]/10 mt-auto mb-3">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 font-bold">
                      YILLIK LİSANS
                    </span>
                    <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                      Tüm Dönem Provaları
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 text-right">
                    {appliedBayiKodu ? (
                      <>
                        <span className="text-xs text-[#1A1A1A]/40 line-through font-mono">
                          790 TL
                        </span>
                        <span className="text-xl font-serif font-black tracking-tight text-emerald-700">
                          711 TL
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-serif font-black tracking-tight text-[#1A1A1A]">
                          790 TL
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {!appliedBayiKodu && (
                  <div className="mt-1 text-right">
                    <span className="text-[10px] text-[#856526] font-bold bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C9A86A]/30">
                      Bayi Koduyla 711 TL (%10 İndirim)
                    </span>
                  </div>
                )}
              </div>

              {/* Aksiyon Butonları (Kitaplık Formatında) */}
              <div className="space-y-2 mt-auto">
                <button
                  type="button"
                  onClick={() => handleStartExam(kart.sinif, 'Matematik')}
                  className="w-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#1A1A1A] border border-[#1A1A1A]/15 hover:border-[#C9A86A] text-center py-2.5 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 text-[#C9A86A] fill-current" />
                  <span>MATEMATİK 1. PROVAYI ÜCRETSİZ ÇÖZ</span>
                </button>

                <a
                  href={kart.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white hover:text-white border border-[#1A1A1A] text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>SHOPIER İLE GÜVENLİ SATIN AL</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bilgilendirici Bölüm: Neden Not Avcısı? (Kitaplık Formatında) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#C9A86A]/40 text-[#856526] shrink-0">
                <Clock className="w-5 h-5 text-[#C9A86A]" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1A1A1A] mb-1">40 Dakikalık Gerçek Simülasyon</h4>
                <p className="text-[#1A1A1A]/70 text-xs leading-relaxed">
                  Yazılı sınavlar 40 dakikadır. Erken bitirmek yok! Koç Baykuş süreyi ve kontrol disiplinini bizzat yönetir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#C9A86A]/40 text-[#856526] shrink-0">
                <Award className="w-5 h-5 text-[#C9A86A]" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1A1A1A] mb-1">Nokta Atışı MEB Kazanım Analizi</h4>
                <p className="text-[#1A1A1A]/70 text-xs leading-relaxed">
                  Hangi soruda hangi kazanımdan puan kaybettin? Sistem milimetrik analiz eder ve çalışma reçeteni önüne koyar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#C9A86A]/40 text-[#856526] shrink-0">
                <BookOpen className="w-5 h-5 text-[#C9A86A]" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1A1A1A] mb-1">Aşkar Koçluk & Kitap Desteği</h4>
                <p className="text-[#1A1A1A]/70 text-xs leading-relaxed">
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
