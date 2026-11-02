import { SinavProva } from '../types/notAvcisiTypes';

/**
 * ÖRNEK sınav iskeleti. Gerçek soru/çözüm PDF'leri ve MEB kazanım kodları
 * yüklenince bu fonksiyon yerine admin panelinden gelen veri kullanılacaktır.
 */
export const ornekSinavOlustur = (sinif: number, dersAdi = 'Matematik'): SinavProva => ({
  id: `${sinif}-${dersAdi.toLowerCase()}-d1-y1-p1`,
  sinif,
  dersAdi,
  donem: 1,
  yaziliNo: 1,
  provaNo: 1,
  isGenelProva: false,
  isUcretsiz: true,
  sureDakika: 40,
  soruPdfUrl: '',
  cozumPdfUrl: '',
  sorular: [
    { soruNo: 1, kazanimKodu: `M.${sinif}.1.1.1`, toplamPuan: 10, puanSecenekleri: [0, 3, 5, 7, 10] },
    { soruNo: 2, kazanimKodu: `M.${sinif}.1.1.2`, toplamPuan: 10, puanSecenekleri: [0, 3, 5, 7, 10] },
    { soruNo: 3, kazanimKodu: `M.${sinif}.1.2.1`, toplamPuan: 20, puanSecenekleri: [0, 5, 10, 15, 20] },
    { soruNo: 4, kazanimKodu: `M.${sinif}.1.2.2`, toplamPuan: 20, puanSecenekleri: [0, 5, 10, 15, 20] },
    { soruNo: 5, kazanimKodu: `M.${sinif}.1.3.1`, toplamPuan: 20, puanSecenekleri: [0, 5, 10, 15, 20] },
    { soruNo: 6, kazanimKodu: `M.${sinif}.1.3.2`, toplamPuan: 20, puanSecenekleri: [0, 5, 10, 15, 20] },
  ],
});
