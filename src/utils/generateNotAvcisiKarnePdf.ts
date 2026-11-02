import { jsPDF } from 'jspdf';
import { SinavSonuc, OgrenciProfil } from '../types/notAvcisiTypes';

export function generateNotAvcisiKarnePdf(sonuc: SinavSonuc, profil?: OgrenciProfil | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const ogrenciAdi = profil?.adSoyad || 'Değerli Öğrenci';
  const okul = profil?.okul || 'Okul Belirtilmedi';
  const sehirIlce = profil?.il && profil?.ilce ? `${profil.il} / ${profil.ilce}` : 'Türkiye';
  const sinif = sonuc.sinif || profil?.sinif || 5;
  const dersAdi = sonuc.dersAdi || 'Matematik';
  const puan = sonuc.alinanPuan;
  const sureDk = Math.floor(sonuc.harcananSureSaniye / 60);
  const sureSn = sonuc.harcananSureSaniye % 60;
  const tarih = new Date().toLocaleDateString('tr-TR');

  // Renkler
  const darkNavy = [15, 23, 42];     // #0F172A
  const primaryGold = [201, 168, 106]; // #C9A86A
  const slateText = [51, 65, 85];    // #334155
  const softBg = [248, 250, 252];    // #F8FAFC
  const emeraldGreen = [16, 185, 129]; // #10B981

  // 1. Üst Başlık Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Altın Vurgu Şeridi
  doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.rect(0, 40, 210, 2, 'F');

  // Başlık Metinleri
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AŞKAR YAYINLARI • NOT AVCISI', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.text('RESMİ MEB KAZANIM VE GELİŞİM DEĞERLENDİRME KARNESİ', 15, 26);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8.5);
  doc.text('Gerçek Yazılıya Girmeden Önce Kendini Dene, 100 Tam Puanı Avla!', 15, 33);

  let y = 50;

  // 2. Öğrenci Kimlik ve Okul Bilgileri Kartı
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, y, 180, 28, 3, 3, 'FD');

  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(ogrenciAdi.toUpperCase(), 22, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Sınıfı: ${sinif}. Sınıf  |  Ders: ${dersAdi} 1. Yazılı Provası  |  Tarih: ${tarih}`, 22, y + 15.5);
  doc.text(`Okulu: ${okul}  |  Bölge: ${sehirIlce}`, 22, y + 21.5);

  y += 34;

  // 3. Büyük Puan & Başarı Rozeti Kutusu
  doc.setFillColor(254, 243, 199); // Amber soft
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, y, 180, 26, 3, 3, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SİMÜLASYON YAZILI SINAV PUANI', 22, y + 8);

  doc.setFontSize(22);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`${puan} / 100`, 22, y + 19);

  // Sağ taraf: Derece ve Süre
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  let derece = puan >= 85 ? 'YAZILI ŞAMPİYONU ⭐' : puan >= 70 ? 'BAŞARILI AVCI 🎯' : puan >= 50 ? 'GELİŞTİRİLEBİLİR 📈' : 'TEKRAR GEREKİYOR ⚠️';
  doc.text(`Derece: ${derece}`, 115, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Kullanılan Süre: ${sureDk} Dk ${sureSn} Sn (40 Dk Üzerinden)`, 115, y + 18);

  y += 32;

  // 4. MEB Kazanım Röntgeni Başlığı
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.roundedRect(15, y, 180, 8, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('MEB KONU KAZANIM ANALİZİ & KOÇ BAYKUŞ REÇETESİ', 20, y + 5.5);

  y += 13;

  // Eksik veya tam kazanımların listelenmesi
  if (!sonuc.eksikKazanimlar || sonuc.eksikKazanimlar.length === 0) {
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(15, y, 180, 18, 2, 2, 'F');
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TEBRİKLER! TÜM KAZANIMLARI TAM PUANLA TAMAMLADIN.', 20, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text('Hiçbir konuda puan kaybın bulunmamaktadır. Gerçek yazılı sınavında 100 tam puan seni bekliyor!', 20, y + 14);
    y += 24;
  } else {
    sonuc.eksikKazanimlar.slice(0, 4).forEach((ek) => {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(15, y, 180, 18, 2, 2, 'F');

      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Kazanım: ${ek.konu} (${ek.kazanimKodu})`, 20, y + 5.5);

      doc.setTextColor(225, 29, 72);
      doc.text(`-${ek.kaybedilenPuan} Puan`, 170, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      const splitDesc = doc.splitTextToSize(`Koc Baykus Notu: ${ek.tavsiye}`, 170);
      doc.text(splitDesc, 20, y + 10.5);

      y += 21;
    });
  }

  y += 4;

  // 5. Aşkar Yayınları Koçluk Tavsiyesi Kutusu
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, y, 180, 24, 2, 2, 'FD');

  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`AŞKAR YAYINLARI ${sinif}. SINIF KOÇLUK KİTAP REHBERİ`, 22, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Bu eksik MEB kazanımlarını kalıcı olarak telafi etmek için Aşkar Yayınları ${sinif}. Sınıf Öğrenci Koçu`, 22, y + 13);
  doc.text('kitabındaki özet taktikleri ve benzer açık uçlu prova sorularını inceleyiniz. www.askaryayinlari.com.tr', 22, y + 18);

  // 6. Alt Bilgi / Footer
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Aşkar Yayınları Eğitim Teknolojileri  |  Not Avcısı Sınav Simülatörü', 15, 283);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Bu resmi karne ${ogrenciAdi} adına sistem tarafından dijital ortamda üretilmiştir. Veli Tel: ${profil?.veliBilgisi?.telefon || 'Kayıtlı'}`, 15, 288);

  const cleanName = ogrenciAdi.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Not_Avcisi_Karne_${cleanName}_${sinif}_Sinif.pdf`);
}
