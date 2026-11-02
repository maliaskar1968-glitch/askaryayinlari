import { OgrenciProfil, SinavProva, SinavSonuc, SoruKazanim } from '../types/notAvcisiTypes';

const STORAGE_OGRENCI = 'notAvcisi.ogrenci';
const STORAGE_SONUCLAR = 'notAvcisi.sonuclar';

// MEB kazanım listesi (Excel'den içe aktarılınca doldurulacak). Anahtar: kazanım kodu.
let kazanimHavuzu: Record<string, SoruKazanim> = {};

export const kazanimlariYukle = (liste: SoruKazanim[]) => {
  kazanimHavuzu = {};
  for (const k of liste) kazanimHavuzu[k.kazanimKodu.trim().toUpperCase()] = k;
};

export const kazanimBul = (kod: string): SoruKazanim | undefined =>
  kazanimHavuzu[kod.trim().toUpperCase()];

export const ogrenciKaydet = (o: OgrenciProfil) => {
  try { localStorage.setItem(STORAGE_OGRENCI, JSON.stringify(o)); } catch { /* ignore */ }
};

export const ogrenciGetir = (): OgrenciProfil | null => {
  try {
    const raw = localStorage.getItem(STORAGE_OGRENCI);
    return raw ? (JSON.parse(raw) as OgrenciProfil) : null;
  } catch { return null; }
};

export const sonuclariGetir = (): SinavSonuc[] => {
  try {
    const raw = localStorage.getItem(STORAGE_SONUCLAR);
    return raw ? (JSON.parse(raw) as SinavSonuc[]) : [];
  } catch { return []; }
};

const sonucKaydet = (s: SinavSonuc) => {
  try {
    localStorage.setItem(STORAGE_SONUCLAR, JSON.stringify([...sonuclariGetir(), s]));
  } catch { /* ignore */ }
};

const varsayilanTavsiye = (konu: string) =>
  `"${konu}" kazanımını tekrar et: önce konu özetini oku, sonra bu kazanımdan 10 kolay, 10 orta soru çöz ve yanlışlarını deftere yaz.`;

/** Seçilen puanlardan sonuç raporu üretir. Puan kaybedilen her kazanım için tavsiye çıkarır. */
export const sonucHesapla = (
  sinav: SinavProva,
  puanlar: { [soruNo: number]: number },
  harcananSure: number,
  ogrenciId: string
): SinavSonuc => {
  let alinan = 0;
  let toplam = 0;
  const eksikler: SinavSonuc['eksikKazanimlar'] = [];

  for (const s of sinav.sorular) {
    const p = puanlar[s.soruNo] ?? 0;
    alinan += p;
    toplam += s.toplamPuan;
    const kayip = s.toplamPuan - p;
    if (kayip > 0) {
      const k = kazanimBul(s.kazanimKodu);
      const konu = k?.konuAdi || s.kazanimKodu;
      eksikler.push({
        kazanimKodu: s.kazanimKodu,
        konu,
        kaybedilenPuan: kayip,
        tavsiye: k?.onerilenTaktik || varsayilanTavsiye(konu),
      });
    }
  }

  eksikler.sort((a, b) => b.kaybedilenPuan - a.kaybedilenPuan);

  const sonuc: SinavSonuc = {
    id: 'sonuc_' + Date.now(),
    ogrenciId,
    sinavId: sinav.id,
    sinif: sinav.sinif,
    dersAdi: sinav.dersAdi,
    alinanPuan: alinan,
    toplamPuan: toplam,
    eksikKazanimlar: eksikler,
    tamamlanmaTarihi: new Date().toISOString(),
    harcananSureSaniye: harcananSure,
  };
  sonucKaydet(sonuc);
  return sonuc;
};

/** Bir yazılının (ders + dönem + yazılı no) tüm prova puanlarının ortalaması = karne notu. */
export const yaziliKarneNotu = (ogrenciId: string, sinavIdOnEki: string): number | null => {
  const ilgili = sonuclariGetir().filter(
    (s) => s.ogrenciId === ogrenciId && s.sinavId.startsWith(sinavIdOnEki)
  );
  if (ilgili.length === 0) return null;
  const toplam = ilgili.reduce((t, s) => t + s.alinanPuan, 0);
  return Math.round((toplam / ilgili.length) * 10) / 10;
};
