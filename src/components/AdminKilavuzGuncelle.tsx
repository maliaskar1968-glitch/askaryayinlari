import React, { useState, useEffect } from 'react';
import { getOsymKilavuz, saveOsymKilavuz, OsymKilavuzData } from '../utils/osymKilavuz';
import { ShieldCheck, Save, CheckCircle2, RotateCcw, ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react';

interface AdminKilavuzGuncelleProps {
  onNavigateHome: () => void;
}

export const AdminKilavuzGuncelle: React.FC<AdminKilavuzGuncelleProps> = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState<OsymKilavuzData>({
    yil: 2026,
    kontenjan: 805747,
    tercih_tarih: '29 Temmuz - 10 Ağustos',
    hukuk_baraj: 100000,
    tip_baraj: 50000,
    muhendislik_baraj: 300000,
    kilavuz_link: 'https://osym.gov.tr',
    son_guncelleme: new Date().toISOString().split('T')[0],
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = getOsymKilavuz();
    setFormData(current);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const updatedData: OsymKilavuzData = {
      ...formData,
      yil: Number(formData.yil),
      kontenjan: Number(formData.kontenjan),
      hukuk_baraj: Number(formData.hukuk_baraj),
      tip_baraj: Number(formData.tip_baraj),
      muhendislik_baraj: Number(formData.muhendislik_baraj),
      son_guncelleme: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await saveOsymKilavuz(updatedData);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `ÖSYM Kılavuz verileri başarıyla güncellendi! (${updatedData.yil} yılı, /data/osym-kilavuz.json ve localStorage güncellendi).`,
        });
        // Sarı bant varsa kaldır veya yeniden kontrol et
        const banner = document.getElementById('osym-warning-banner');
        if (banner) banner.remove();
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Kayıt sırasında bir uyarı oluştu ancak yerel hafıza güncellendi: ' + (res.error || ''),
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Hata oluştu: ' + err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-6 animate-fadeIn text-[#1A1A1A]">
      {/* Üst Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ana Sayfaya Dön</span>
        </button>

        <span className="text-[10px] font-mono uppercase tracking-widest text-[#ea580c] font-black bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
          GİZLİ YÖNETİM PANELİ
        </span>
      </div>

      <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#1A1A1A]/10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A]">
              ÖSYM Kılavuz Verilerini Güncelle
            </h1>
            <p className="text-xs text-[#1A1A1A]/60 font-sans mt-0.5">
              Her yıl Temmuz ayında ÖSYM resmi kılavuzunu açıkladığında yeni verileri buradan girerek anında güncelleyebilirsiniz.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm font-sans font-bold flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kılavuz Yılı */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                KILAVUZ YILI:
              </label>
              <input
                type="number"
                min="2024"
                max="2035"
                required
                value={formData.yil}
                onChange={(e) => setFormData({ ...formData, yil: parseInt(e.target.value, 10) || 2026 })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-serif font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
              />
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">Örn: 2026 veya 2027</span>
            </div>

            {/* Yeni Kontenjan */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                TOPLAM KONTENJAN:
              </label>
              <input
                type="number"
                min="100000"
                max="3000000"
                required
                value={formData.kontenjan}
                onChange={(e) => setFormData({ ...formData, kontenjan: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-serif font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
              />
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">Örn: 805747</span>
            </div>

            {/* Tercih Tarihleri */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                TERCİH TARİHLERİ:
              </label>
              <input
                type="text"
                required
                value={formData.tercih_tarih}
                onChange={(e) => setFormData({ ...formData, tercih_tarih: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-serif font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
                placeholder="Örn: 29 Temmuz - 10 Ağustos"
              />
            </div>

            {/* Kılavuz Linki */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                RESMİ KILAVUZ LİNKİ:
              </label>
              <input
                type="url"
                required
                value={formData.kilavuz_link}
                onChange={(e) => setFormData({ ...formData, kilavuz_link: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
                placeholder="https://osym.gov.tr"
              />
            </div>

            {/* Tıp Barajı */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                TIP BARAJI (BAŞARI SIRASI):
              </label>
              <input
                type="number"
                required
                value={formData.tip_baraj}
                onChange={(e) => setFormData({ ...formData, tip_baraj: parseInt(e.target.value, 10) || 50000 })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
              />
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">Örn: 50000</span>
            </div>

            {/* Hukuk Barajı */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                HUKUK BARAJI (BAŞARI SIRASI):
              </label>
              <input
                type="number"
                required
                value={formData.hukuk_baraj}
                onChange={(e) => setFormData({ ...formData, hukuk_baraj: parseInt(e.target.value, 10) || 100000 })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
              />
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">Örn: 100000</span>
            </div>

            {/* Mühendislik Barajı */}
            <div className="sm:col-span-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
                MÜHENDİSLİK BARAJI (BAŞARI SIRASI):
              </label>
              <input
                type="number"
                required
                value={formData.muhendislik_baraj}
                onChange={(e) => setFormData({ ...formData, muhendislik_baraj: parseInt(e.target.value, 10) || 300000 })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#1A1A1A] focus:outline-hidden focus:ring-2 focus:ring-[#ea580c]"
              />
              <span className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1 block">Örn: 300000</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-[#1A1A1A]/50">
              Son Güncelleme Tarihi: {formData.son_guncelleme}
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#C9A86A]" />
              <span>{isSaving ? 'KAYDEDİLİYOR...' : 'KILAVUZ VERİLERİNİ GÜNCELLE VE KAYDET'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
