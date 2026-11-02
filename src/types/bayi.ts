export interface BayiKomisyonOranlari {
  bireysel: number; // varsayılan %20
  kurumsal: number; // varsayılan %15
  ogretmen: number; // varsayılan %25
}

export interface BayiModel {
  bayiId: string;
  adSoyad: string;
  firmaAdi: string;
  email: string;
  telefon: string;
  sifre?: string;
  kod: string;
  link: string;
  sehir: string;
  ilce: string; // Sorumlu olduğu ilçe
  iban?: string;
  vergiNo?: string;
  komisyonOranlari: BayiKomisyonOranlari;
  durum: 'Aktif' | 'Pasif';
  createdAt: string;
  updatedAt?: string;

  // İstatistikler
  toplamTiklanma?: number;
  toplamKayit?: number;
  toplamSatis?: number;
  toplamCiro?: number;
  toplamHakEdis?: number;
  odenenTutar?: number;
  kalanBakiye?: number;
}

export interface BayiBasvuruModel {
  id: string;
  adSoyad: string;
  firmaAdi: string;
  email: string;
  telefon: string;
  sehir: string;
  ilce: string; // Sorumlu olmak istediği ilçe
  meslek?: string;
  iban?: string;
  vergiNo?: string;
  notlar?: string;
  satisKotasiOnaylandi: boolean;
  durum: 'Beklemede' | 'Onaylandi' | 'Reddedildi';
  createdAt: string;
  onaylandiAt?: string;
  bayiKodu?: string;
}

export interface BayiSiparisItem {
  id: string;
  siparisNo: string;
  bayiId: string;
  refKodu: string;
  musteriAdi: string;
  kullaniciEmail: string;
  paket: string;
  paketAdi: string;
  tutar: number;
  komisyonOrani: number; // %20
  komisyonTutari: number;
  komisyonDurumu: 'Beklemede' | 'Onaylandi' | 'Odendi';
  odemeTarihi: string;
  tarih: string;
  odenebilirMi?: boolean; // 30 gün kuralı veya EFT 7 gün
}

export interface DistrictAnalyticsItem {
  sehir: string;
  ilce: string;
  atananBayiAdi?: string;
  atananBayiId?: string;
  ogrenciSayisi: number;
  cozulenSinavSayisi: number;
  toplamSatis: number;
  toplamCiro: number;
  durum: 'BAYI_VAR' | 'BOS_BOLGE' | 'YUKSEK_POTANSIYEL';
}
