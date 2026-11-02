import React, { useState } from 'react';
import { Search, X, Award, FileDown, Calendar, Clock, AlertCircle, CheckCircle2, User, Phone, Sparkles } from 'lucide-react';
import { SinavSonuc, OgrenciProfil } from '../types/notAvcisiTypes';
import { generateNotAvcisiKarnePdf } from '../utils/generateNotAvcisiKarnePdf';

interface StoredExamResult {
  id: string;
  ogrenciId: string;
  ogrenciAdi: string;
  sinif: number;
  dersAdi: string;
  sinavAdi: string;
  puan: number;
  sureDakika: number;
  tarih: string;
  tamamlanmaZamani?: string;
  eksikKazanimlar: any[];
  veliBilgisi?: {
    adSoyad?: string;
    telefon?: string;
  } | null;
  eposta?: string;
}

interface NotAvcisiVeliKarneSorguModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExamForRetake?: (sinif: number, dersAdi: string) => void;
}

export const NotAvcisiVeliKarneSorguModal: React.FC<NotAvcisiVeliKarneSorguModalProps> = ({
  isOpen,
  onClose,
  onSelectExamForRetake
}) => {
  const [telefonInput, setTelefonInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundResults, setFoundResults] = useState<StoredExamResult[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<OgrenciProfil | null>(null);

  if (!isOpen) return null;

  const normalizePhone = (p: string) => {
    return p.replace(/\D/g, '').replace(/^0/, '').replace(/^90/, '');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = normalizePhone(telefonInput);
    if (!cleanSearch || cleanSearch.length < 7) {
      alert('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    setSearched(true);

    // 1. Öğrenci profillerinden ara
    let profile: OgrenciProfil | null = null;
    try {
      const storedProfiles = localStorage.getItem('askar_ogrenci_profilleri');
      if (storedProfiles) {
        const profList: OgrenciProfil[] = JSON.parse(storedProfiles);
        profile = profList.find(p => {
          const pVeli = normalizePhone(p.veliBilgisi?.telefon || '');
          const pOgr = normalizePhone(p.telefon || '');
          return (pVeli && pVeli.includes(cleanSearch)) || (pOgr && pOgr.includes(cleanSearch));
        }) || null;
      }
    } catch (err) {
      console.error(err);
    }
    setMatchedProfile(profile);

    // 2. Sınav sonuçlarından ara
    try {
      const storedResults = localStorage.getItem('askar_ogrenci_sonuclari');
      if (storedResults) {
        const resList: StoredExamResult[] = JSON.parse(storedResults);
        const matches = resList.filter(r => {
          const rVeli = normalizePhone(r.veliBilgisi?.telefon || '');
          const matchesPhone = rVeli && (rVeli.includes(cleanSearch) || cleanSearch.includes(rVeli));
          const matchesProfile = profile && r.ogrenciId === profile.id;
          return matchesPhone || matchesProfile;
        });
        setFoundResults(matches);
      } else {
        setFoundResults([]);
      }
    } catch (err) {
      console.error(err);
      setFoundResults([]);
    }
  };

  const handleDownloadPdf = (result: StoredExamResult) => {
    const formattedSonuc: SinavSonuc = {
      sinavId: result.id,
      sinif: result.sinif,
      dersAdi: result.dersAdi,
      toplamSoru: 10,
      dogruSayisi: Math.round(result.puan / 10),
      yanlisSayisi: 10 - Math.round(result.puan / 10),
      bosSayisi: 0,
      alinanPuan: result.puan,
      harcananSureSaniye: (result.sureDakika || 40) * 60,
      eksikKazanimlar: result.eksikKazanimlar || [],
      tamamlanmaTarihi: result.tamamlanmaZamani || new Date().toISOString()
    };

    const studentProfile: OgrenciProfil = matchedProfile || {
      id: result.ogrenciId,
      adSoyad: result.ogrenciAdi,
      eposta: result.eposta || '',
      telefon: '',
      sinif: result.sinif,
      il: '',
      ilce: '',
      okul: '',
      is18Alti: true,
      veliBilgisi: {
        adSoyad: result.veliBilgisi?.adSoyad || 'Sayın Veli',
        telefon: result.veliBilgisi?.telefon || telefonInput,
        onayVerildi: true,
        onayTarihi: result.tarih
      },
      kayitTarihi: result.tarih,
      abonelikDurumu: 'ucretsiz'
    };

    generateNotAvcisiKarnePdf(formattedSonuc, studentProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık & Baykuş */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-slate-950 mb-3 shadow-lg shadow-amber-500/20">
            <img
              src="/resimler/branding/not-avcisi-baykus.jpg"
              alt="Koç Baykuş"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veli Bilgilendirme ve Karne Portalı</span>
          </div>
          <h3 className="text-2xl font-black text-white">Veli Karne & Başarı Sorgulama</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Öğrencinizin tamamladığı yazılı deneme karnelerine kayıtlı veli telefon numaranızla ücretsiz ve şifresiz ulaşabilirsiniz.
          </p>
        </div>

        {/* Arama Formu */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="Veli Telefon Numarası (Örn: 05XX XXX XX XX)"
                value={telefonInput}
                onChange={(e) => setTelefonInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Karneleri Bul</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>🔒</span>
            <span>SMS kodu veya şifre gerekmez. Tüm sonuçlar veli gizliliği kapsamında korunur.</span>
          </p>
        </form>

        {/* Sonuç Listesi */}
        {searched && (
          <div className="space-y-4">
            {matchedProfile && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold block">{matchedProfile.adSoyad}</span>
                    <span className="text-slate-400 text-[11px]">{matchedProfile.sinif}. Sınıf • {matchedProfile.okul || 'Öğrenci'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold block">Veli: {matchedProfile.veliBilgisi.adSoyad}</span>
                  <span className="text-slate-500 text-[10px]">{matchedProfile.eposta ? `E-posta: ${matchedProfile.eposta}` : 'E-posta kaydı yok'}</span>
                </div>
              </div>
            )}

            {foundResults.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Tamamlanan Sınavlar ({foundResults.length})</span>
                </div>

                {foundResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                          {item.sinif}. Sınıf
                        </span>
                        <h4 className="font-bold text-white text-sm">{item.sinavAdi || `${item.dersAdi} 1. Yazılı Provası`}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.tarih}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.sureDakika} Dakika
                        </span>
                        {item.eksikKazanimlar && (
                          <span className="text-amber-400 font-medium">
                            {item.eksikKazanimlar.length === 0 ? 'Tam Başarı (0 Eksik)' : `${item.eksikKazanimlar.length} Eksik Kazanım`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">NOT</span>
                        <span className="text-xl font-black text-amber-400">{item.puan}</span>
                        <span className="text-xs text-slate-500 font-bold">/100</span>
                      </div>
                      <button
                        onClick={() => handleDownloadPdf(item)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        title="Renkli A4 PDF Karne İndir"
                      >
                        <FileDown className="w-4 h-4 stroke-[2.5]" />
                        <span>Karnemi İndir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Bu Numaraya Ait Sınav Karnesi Henüz Yok</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Öğrenciniz ilk sınav provasını tamamladığında resmi değerlendirme karnesi burada otomatik olarak listelenecektir.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Alt Kapat */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
