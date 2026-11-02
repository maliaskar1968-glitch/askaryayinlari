import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { BayiModel, BayiBasvuruModel } from '../types/bayi';

export async function generateAskarBayiFlyerPdf(bayi: BayiModel | BayiBasvuruModel, customCode?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const kod = (bayi as any).kod || customCode || (bayi as any).bayiKodu || 'ASKAR-BAYI';
  const firmaAdi = bayi.firmaAdi || 'Yetkili Kırtasiye';
  const yetkiliAdi = bayi.adSoyad || 'Bayi Temsilcisi';
  const sehir = bayi.sehir || 'Türkiye';
  const ilce = bayi.ilce || 'İlçe Sorumlusu';
  const telefon = bayi.telefon || 'İletişim Hattı';

  // Target URL for student/parent registration
  const targetUrl = `https://www.askaryayinlari.com.tr/not-avcisi?ref=${encodeURIComponent(kod)}`;

  // Generate QR Code as base64 PNG data URL
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // Colors
  const darkNavy = [15, 23, 42];     // #0F172A
  const goldAmber = [217, 119, 6];   // #D97706
  const primaryGold = [201, 168, 106]; // #C9A86A
  const slateText = [51, 65, 85];    // #334155
  const softBg = [248, 250, 252];    // #F8FAFC

  // 1. Üst Başlık Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 44, 'F');

  // Altın Vurgu Şeridi
  doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Başlıklar
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AŞKAR YAYINLARI', 15, 17);

  doc.setFontSize(11);
  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.text('NOT AVCISI • YAZILI ÖN HAZIRLIK SİMÜLASYONU', 15, 26);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('MEB FORMATINDA GERÇEK SÜRELİ PROVALAR & KAZANIM RAPORU', 15, 34);

  let y = 52;

  // 2. Yetkili İlçe Temsilciliği / Kırtasiye Kartı
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, y, 180, 26, 3, 3, 'FD');

  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(firmaAdi.toUpperCase(), 22, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Resmi Sorumluluk Bolgesi: ${sehir} / ${ilce}`, 22, y + 15.5);
  doc.text(`Yetkili: ${yetkiliAdi}  |  Iletisim: ${telefon}`, 22, y + 21.5);

  y += 33;

  // 3. Öğrencilere ve Velilere Çağrı
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.roundedRect(15, y, 180, 8.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GERCEK YAZILIYA GIRMEDEN ONCE KENDINI DENE, 100 TAM PUANI AVLA!', 20, y + 5.8);

  y += 14;

  const features = [
    {
      title: '1. MEB Formatinda 40 Dakikalik Sureli Prova:',
      desc: '3. siniftan 12. sinifa kadar donem yazililarina birebir uyumlu testler ve korumali ekran.'
    },
    {
      title: '2. Nokta Atisi MEB Kazanim Analizi:',
      desc: 'Hangi soruda neden puan kaybettigini aninda gosteren kisisellestirilmis karne raporu.'
    },
    {
      title: '3. Koc Baykus Sinav Recetesi:',
      desc: 'Eksik konulara ozel nokta atisi ders calisma tavsiyeleri ve sinav taktikleri.'
    },
    {
      title: '4. Bu Noktaya Ozel %10 Indirim Avantaji:',
      desc: `Asagidaki karekodu okutan veya ${kod} kodunu kullanan tum velilerimize aninda indirim!`
    }
  ];

  features.forEach((feat) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, y, 180, 14, 2, 2, 'F');

    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(feat.title, 20, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const splitDesc = doc.splitTextToSize(feat.desc, 170);
    doc.text(splitDesc, 20, y + 9.5);

    y += 16.5;
  });

  y += 3;

  // 4. KAREKOD & TEZGAH İNDİRİM ALANI
  doc.setFillColor(254, 243, 199); // Amber soft
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.setLineWidth(1);
  doc.roundedRect(15, y, 180, 52, 3, 3, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TELEFONUNUZUN KAMERASIYLA KAREKODU OKUTUNUZ', 20, y + 8);

  // Embed QR Image
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', 20, y + 12, 36, 36);
    } catch (err) {
      console.error('Error adding QR image to doc:', err);
    }
  }

  // Right side of QR: Bayi Kodu and instructions
  const rightX = 62;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.roundedRect(rightX, y + 12, 126, 20, 2, 2, 'FD');

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Size Ozel Temsilcilik & Indirim Kodu:', rightX + 5, y + 18);

  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(kod, rightX + 5, y + 27);

  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setFontSize(9);
  doc.text('%10 VELI INDIRIMI HEDIYELI', rightX + 75, y + 27);

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Dogrudan baglanti: askaryayinlari.com.tr/not-avcisi', rightX, y + 38);
  doc.text(`Bu karekod ${firmaAdi} resmi ilce temsilcilik tezgahi icin uretilmistir.`, rightX, y + 44);

  // 5. Alt Bilgi / Footer
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Askar Yayinlari Egitim Teknolojileri  |  www.askaryayinlari.com.tr', 15, 283);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Bu tanitim afisi resmi temsilcimiz ${yetkiliAdi} (${firmaAdi} - ${ilce}) adina Genel Merkez tarafindan onaylanip basilmistir.`, 15, 288);

  const cleanKod = kod.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Askar_Not_Avcisi_Bayi_Afisi_${cleanKod}.pdf`);
}
