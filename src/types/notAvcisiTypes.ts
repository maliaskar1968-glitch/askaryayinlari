// Not Avcısı & Bayilik Veri Modelleri ve Tipleri

export interface VeliBilgisi {
  adSoyad: string;
  telefon: string;
  onayVerildi: boolean;
  onayTarihi: string;
}

export interface OgrenciProfil {
  id: string;
  adSoyad: string;
  eposta: string;
  telefon: string;
  sinif: number; // 3 - 12
  il: string;
  ilce: string;
  okul: string;
  is18Alti: boolean;
  veliBilgisi?: VeliBilgisi;
  bayiRefKodu?: string;
  kayitTarihi: string;
  abonelikDurumu: 'ucretsiz' | 'yillik_abone';
  abonelikBitisTarihi?: string;
}

export interface BayiProfil {
  id: string;
  bayiKodu: string; // Örn: 'KADIKOY-KIRTASIYE-101'
  firmaAdi: string;
  yetkiliAdSoyad: string;
  eposta: string;
  telefon: string;
  il: string;
  ilce: string; // Birincil Sorumluluk Alanı
  iban: string;
  vergiNoTC: string;
  komisyonOrani: number; // 0.20 (%20)
  indirimOrani: number; // 0.10 (%10)
  onaylandi: boolean;
  kayitTarihi: string;
  toplamSatisSayisi: number;
  toplamCiro: number;
  birikenHakEdis: number;
  odenenTutar: number;
}

export interface SoruKazanim {
  kazanimKodu: string; // Örn: 'M.8.1.1.3'
  dersKodu: string; // Örn: 'MAT'
  sinif: number;
  konuAdi: string;
  kazanimAciklamasi: string;
  onerilenTaktik?: string;
}

export interface SoruDetay {
  soruNo: number;
  kazanimKodu: string;
  toplamPuan: number;
  puanSecenekleri: number[]; // Örn: [0, 2, 3, 5]
}

export interface SinavProva {
  id: string;
  sinif: number;
  dersAdi: string; // 'Matematik', 'Fen Bilimleri' vb.
  donem: 1 | 2;
  yaziliNo: 1 | 2;
  provaNo: number; // 1, 2, 3... 8 (Sonuncu: Genel Prova)
  isGenelProva: boolean;
  isUcretsiz: boolean; // Sadece Matematik 1. Dönem 1. Yazılı 1. Prova true
  sureDakika: number; // 40
  sorular: SoruDetay[];
  soruPdfUrl: string;
  cozumPdfUrl: string;
  cozumKarekodUrl?: string;
}

export interface SinavSonuc {
  id?: string;
  ogrenciId?: string;
  sinavId: string;
  sinif: number;
  dersAdi: string;
  alinanPuan: number; // 0 - 100
  toplamPuan?: number;
  toplamSoru?: number;
  dogruSayisi?: number;
  yanlisSayisi?: number;
  bosSayisi?: number;
  eksikKazanimlar: {
    kazanimKodu: string;
    konu: string;
    kaybedilenPuan: number;
    tavsiye: string;
  }[];
  tamamlanmaTarihi: string;
  harcananSureSaniye: number;
}

export interface NotAvcisiSinifKart {
  sinif: number;
  baslik: string;
  altBaslik: string;
  aciklama: string;
  listeFiyati: number; // 790
  bayiFiyati: number; // 711
  gorselUrl: string;
  shopierUrl: string;
  ozellikler: string[];
}
