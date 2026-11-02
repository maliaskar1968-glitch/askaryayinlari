// Not Avcısı MEB Yazılı Takvimi ve Sınav Kilit Yönetimi

export interface SinavKilitDurumu {
  id: string;             // örn: 'sinif_5_donem_1_yazili_1'
  sinif: number;          // 3 - 12
  donemYazili: string;    // '1_1' | '1_2' | '2_1' | '2_2'
  baslik: string;         // '1. Dönem 1. Yazılı Provası'
  mebAciklama: string;    // MEB takvim bilgisi
  acilisTarihi: string;   // '2026-10-20' gibi
  kilitliMi: boolean;     // Admin tarafından açılıp kapatılabilir
}

export const VARSAYILAN_YAZILI_DONEMLERI = [
  {
    kod: '1_1',
    baslik: '1. Dönem 1. Yazılı Provası',
    mebDonemi: 'Ekim Sonu - Kasım Başı',
    varsayilanAcik: true, // Şu an aktif dönem
    aciklama: 'MEB 1. yazılı haftasından 1 hafta önce açılır.'
  },
  {
    kod: '1_2',
    baslik: '1. Dönem 2. Yazılı Provası',
    mebDonemi: 'Aralık Sonu - Ocak Başı',
    varsayilanAcik: false, // Tarihi henüz gelmedi
    aciklama: 'MEB 2. yazılı takviminden 1 hafta önce açılacaktır.'
  },
  {
    kod: '2_1',
    baslik: '2. Dönem 1. Yazılı Provası',
    mebDonemi: 'Mart Sonu - Nisan Başı',
    varsayilanAcik: false,
    aciklama: '2. Dönem MEB yazılı takviminden 1 hafta önce açılacaktır.'
  },
  {
    kod: '2_2',
    baslik: '2. Dönem 2. Yazılı Provası',
    mebDonemi: 'Mayıs Sonu - Haziran Başı',
    varsayilanAcik: false,
    aciklama: 'Yıl sonu MEB yazılı takviminden 1 hafta önce açılacaktır.'
  }
];

// LocalStorage anahtarı
const STORAGE_KEY = 'askar_not_avcisi_kilit_ayarlari';

// Tüm kilit durumlarını getir
export function getSinavKilitListesi(): { [key: string]: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }

  // Varsayılan kilit haritasını üret (3-12. sınıflar için)
  const initial: { [key: string]: boolean } = {};
  for (let s = 3; s <= 12; s++) {
    for (const d of VARSAYILAN_YAZILI_DONEMLERI) {
      const key = `${s}_${d.kod}`;
      initial[key] = !d.varsayilanAcik; // varsayilanAcik true ise kilitliMi = false
    }
  }
  return initial;
}

// Belirli bir sınıf ve yazılı dönemi kilitli mi kontrol et
export function isSinavKilitli(sinif: number, donemKod: string = '1_1'): boolean {
  const kilitler = getSinavKilitListesi();
  const key = `${sinif}_${donemKod}`;
  if (kilitler[key] !== undefined) {
    return kilitler[key];
  }
  // Tanımlı değilse varsayılan mantık: 1_1 açık, diğerleri kilitli
  return donemKod !== '1_1';
}

// Admin için kilit durumunu değiştir
export function setSinavKilit(sinif: number, donemKod: string, kilitliMi: boolean) {
  const kilitler = getSinavKilitListesi();
  const key = `${sinif}_${donemKod}`;
  kilitler[key] = kilitliMi;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kilitler));
  } catch (e) {
    console.error(e);
  }
}

// Admin için toplu aç/kapat (Örn: Tüm 5. Sınıf sınavlarını aç veya 1. Dönem 1. Yazılıların hepsini aç)
export function setTopluKilit(donemKod: string, kilitliMi: boolean) {
  const kilitler = getSinavKilitListesi();
  for (let s = 3; s <= 12; s++) {
    kilitler[`${s}_${donemKod}`] = kilitliMi;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kilitler));
  } catch (e) {
    console.error(e);
  }
}
