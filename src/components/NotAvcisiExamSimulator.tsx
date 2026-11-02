import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, ArrowRight, BookOpen, Target, Sparkles, HelpCircle } from 'lucide-react';
import { SinavProva, SoruDetay } from '../types/notAvcisiTypes';

interface NotAvcisiExamSimulatorProps {
  sinav: SinavProva;
  ogrenciAdi?: string;
  onFinishExam: (puanlar: { [soruNo: number]: number }, harcananSure: number) => void;
  onExit: () => void;
}

export const NotAvcisiExamSimulator: React.FC<NotAvcisiExamSimulatorProps> = ({
  sinav,
  ogrenciAdi = 'Öğrenci',
  onFinishExam,
  onExit
}) => {
  // Aşama: 'hazirlik' | 'sinavda' | 'degerlendirme'
  const [stage, setStage] = useState<'hazirlik' | 'sinavda' | 'degerlendirme'>('hazirlik');
  
  // Süre: 40 dakika (2400 saniye)
  const [kalanSaniye, setKalanSaniye] = useState<number>(sinav.sureDakika * 60);
  const [harcananSure, setHarcananSure] = useState<number>(0);
  const [showErkenBitirModal, setShowErkenBitirModal] = useState<boolean>(false);

  // Öğrencinin seçtiği puanlar: { 1: 5, 2: 3, ... }
  const [selectedPuanlar, setSelectedPuanlar] = useState<{ [soruNo: number]: number }>({});

  // Kronometre
  useEffect(() => {
    let timer: any = null;
    if (stage === 'sinavda' && kalanSaniye > 0) {
      timer = setInterval(() => {
        setKalanSaniye((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage('degerlendirme');
            return 0;
          }
          return prev - 1;
        });
        setHarcananSure((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, kalanSaniye]);

  // Zaman formatlama
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Erken bitirme denemesi
  const handleAttemptFinish = () => {
    // Eğer 10 dakikadan fazla süre varsa Koç Baykuş uyarsın
    if (kalanSaniye > 10 * 60) {
      setShowErkenBitirModal(true);
    } else {
      setStage('degerlendirme');
    }
  };

  const handlePuanSec = (soruNo: number, puan: number) => {
    setSelectedPuanlar((prev) => ({
      ...prev,
      [soruNo]: puan
    }));
  };

  const toplamAlinanPuan = Object.values(selectedPuanlar).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. AŞAMA: KOÇ BAYKUŞ HAZIRLIK EKRANI */}
      {stage === 'hazirlik' && (
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl relative">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-amber-400 p-1 bg-slate-950 shadow-xl mb-6">
              <img
                src="/resimler/branding/not-avcisi-baykus.jpg"
                alt="Koç Baykuş"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KOÇ BAYKUŞ YAZILI GÖZETMENİ</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-3">
              Sınavı Başlatayım mı, {ogrenciAdi}?
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Önüne boş bir müsvedde kağıdı, kalemi ve silgini al. Soruları ekrandan okuyup kendi kağıdına çözeceksin. 
              Sınav süren tam <strong>{sinav.sureDakika} dakikadır</strong>. Gerçek bir yazılıdaymış gibi ciddiyetle odaklan!
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-8">
              <p className="flex items-center gap-2 font-medium text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Toplam {sinav.sorular.length} Soru • MEB Açık Uçlu Soru Formatı</span>
              </p>
              <p className="flex items-center gap-2 font-medium text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>PDF sorular indirilemez; ekrandan okunarak çözülür.</span>
              </p>
              <p className="flex items-center gap-2 font-medium text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Süre bitince doğru çözümler açılacak ve puanını karşılaştıracaksın.</span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onExit}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
              >
                Vazgeç
              </button>
              <button
                onClick={() => setStage('sinavda')}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base transition shadow-lg shadow-amber-500/20"
              >
                Evet, Hazırım! Başlat ⏱️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AŞAMA: 40 DAKİKALIK AKTİF SINAV EKRANI */}
      {stage === 'sinavda' && (
        <div className="flex-1 flex flex-col h-full">
          {/* Sınav Üst Kontrol Çubuğu */}
          <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="/resimler/branding/not-avcisi-logo.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-lg border border-amber-500/30"
              />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {sinav.sinif}. Sınıf {sinav.dersAdi} • {sinav.donem}. Dönem {sinav.yaziliNo}. Yazılı (Prova {sinav.provaNo})
                </h3>
                <span className="text-xs text-amber-400">Not Avcısı Yazılı Simülatörü</span>
              </div>
            </div>

            {/* Kronometre */}
            <div className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xl font-bold border shadow-inner ${
              kalanSaniye < 300 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-slate-950 border-amber-500/40 text-amber-300'
            }`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(kalanSaniye)}</span>
            </div>

            <button
              onClick={handleAttemptFinish}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold transition"
            >
              Sınavı Bitir
            </button>
          </header>

          {/* Soru Görüntüleyici (Korumalı Alan) */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center p-4">
            {/* Şeffaf Güvenlik Filigranı (Öğrencinin adı ekranın ortasında) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-5 rotate-[-25deg] select-none text-white text-6xl font-black">
              {ogrenciAdi} • NOT AVCISI • KOPYALANAMAZ
            </div>

            {/* Korumalı PDF / Soru İçerik Alanı */}
            <div className="w-full max-w-4xl h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-8 shadow-2xl relative">
              <div className="text-center pb-6 border-b border-slate-800 mb-6">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                  T.C. MİLLİ EĞİTİM BAKANLIĞI MÜFREDATI UYUMLU
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {sinav.sinif}. SINIF {sinav.dersAdi.toUpperCase()} DERSİ {sinav.donem}. DÖNEM {sinav.yaziliNo}. YAZILI PROVASI
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Yönerge: Soruları dikkatle okuyunuz. Çözüm adımlarınızı önünüzdeki kağıda açıkça yazınız. (Süre: 40 Dakika)
                </p>
              </div>

              {/* Örnek Soru Listesi (Görsel veya Metin) */}
              <div className="space-y-8">
                {sinav.sorular.map((s) => (
                  <div key={s.soruNo} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                      <span className="font-bold text-amber-400 text-base">Soru {s.soruNo}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {s.toplamPuan} Puan
                      </span>
                    </div>

                    <p className="text-slate-200 text-sm leading-relaxed mb-4">
                      {s.soruNo}. Soru Metni: MEB açık uçlu senaryolarına uygun yeni nesil kazanım sorusu. Çözüm basamaklarını kağıdınıza eksiksiz yazınız.
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-500">
                      <span>Kazanım Kodu: {s.kazanimKodu}</span>
                      <span>Önündeki kağıda çöz</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AŞAMA: KARŞILAŞTIRMA VE DİNAMİK PUANLAMA EKRANI */}
      {stage === 'degerlendirme' && (
        <div className="flex-1 flex flex-col h-full bg-slate-950">
          <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Çözümleri Karşılaştır ve Puanını Gir</h3>
                <span className="text-xs text-slate-400">Harcanan Süre: {formatTime(harcananSure)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-bold text-base">
                Toplam Puanın: <span className="text-xl font-black text-white">{toplamAlinanPuan}</span> / 100
              </div>

              <button
                onClick={() => onFinishExam(selectedPuanlar, harcananSure)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg transition"
              >
                Karneyi Gör & Bitir →
              </button>
            </div>
          </header>

          {/* İki Bölmeli Ekran: Sol Çözüm PDF'i / Sağ Puan Seçenekleri */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* Sol: Çözüm Rehberi (Korumalı) */}
            <div className="border-r border-slate-800 overflow-y-auto p-6 bg-slate-900/40">
              <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>Resmi Çözüm Anahtarı ve Puanlama Kriterleri</span>
                </h4>
                <span className="text-xs text-slate-500">Korumalı Ekran</span>
              </div>

              <div className="space-y-6">
                {sinav.sorular.map((s) => (
                  <div key={s.soruNo} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-amber-400 uppercase">Soru {s.soruNo} Çözümü:</span>
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                      Adım 1: Temel formül ve değerlerin yerine konması. (2p)<br />
                      Adım 2: İşlem önceliği ve sadeleştirme. (3p)<br />
                      Adım 3: Doğru sonuca ulaşılması. ({s.toplamPuan - 5}p)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: Dinamik Puan Seçim Çetelesi */}
            <div className="overflow-y-auto p-6 bg-slate-950">
              <div className="mb-4 pb-3 border-b border-slate-800">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span>Kendi Kağıdına Göre Puanlarını İşaretle:</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Yaptığın çözümü sol tarafla karşılaştır ve her soru için kazandığın gerçek puan butonuna dokun.
                </p>
              </div>

              <div className="space-y-4">
                {sinav.sorular.map((s) => (
                  <div key={s.soruNo} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">Soru {s.soruNo}</span>
                      <span className="text-xs text-slate-500 block">Kazanım: {s.kazanimKodu}</span>
                    </div>

                    {/* Seçenekli Puan Butonları */}
                    <div className="flex items-center gap-1.5">
                      {s.puanSecenekleri.map((p) => {
                        const isSelected = selectedPuanlar[s.soruNo] === p;
                        return (
                          <button
                            key={p}
                            onClick={() => handlePuanSec(s.soruNo, p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {p}p
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erken Bitirme Uyarısı (Koç Baykuş Modalı) */}
      {showErkenBitirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400 mb-4">
              <img
                src="/resimler/branding/not-avcisi-baykus.jpg"
                alt="Baykuş"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Dur Bakalım! Daha Süren Var! 🦉</h4>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Bitirmek için henüz çok erken. Sınavda kalan süreyi boş sorularını tekrar denemek ve 
              işlem hatalarını kontrol etmek için kullanmalısın. Acele etme!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowErkenBitirModal(false)}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
              >
                Geri Dön ve Kontrol Et
              </button>
              <button
                onClick={() => {
                  setShowErkenBitirModal(false);
                  setStage('degerlendirme');
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Yine de Bitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
