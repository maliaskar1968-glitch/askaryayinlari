import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { BayiModel, BayiBasvuruModel } from '../types/bayi';
import { applyTurkishFont } from './pdfTurkishFont';

export async function generateAskarBayiFlyerPdf(
  bayi: BayiModel | BayiBasvuruModel,
  customCode?: string,
  discountCode?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Apply true Turkish UTF-8 font (Roboto Bold & Regular)
  const fontApplied = await applyTurkishFont(doc);
  const fontName = fontApplied ? 'Roboto' : 'helvetica';

  const kod = (bayi as any).kod || customCode || (bayi as any).bayiKodu || 'ASKAR-BAYI';
  const firmaAdi = bayi.firmaAdi || 'Yetkili Kırtasiye';
  const yetkiliAdi = bayi.adSoyad || 'Temsilci Yetkilisi';
  const sehir = bayi.sehir || 'Türkiye';
  const ilce = bayi.ilce || 'Sorumlu İlçe';
  const telefon = bayi.telefon || 'İletişim Hattı';

  const activeDiscountCode = discountCode && discountCode.trim() ? discountCode.trim().toUpperCase() : '';

  // Target URL for student/parent registration
  const targetUrl = `https://www.askaryayinlari.com.tr/not-avcisi?ref=${encodeURIComponent(kod)}`;

  // Generate QR Code as base64 PNG data URL
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // Renk Paleti
  const darkNavy = [15, 23, 42];       // #0F172A
  const goldAmber = [217, 119, 6];     // #D97706
  const primaryGold = [201, 168, 106]; // #C9A86A
  const slateText = [51, 65, 85];      // #334155
  const softBg = [248, 250, 252];      // #F8FAFC

  // ==========================================
  // SAYFA 1: DETAYLI BİLGİLENDİRME & KAREKOD AFİŞİ
  // ==========================================

  // 1. Üst Başlık Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 44, 'F');

  // Altın Vurgu Şeridi
  doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Başlıklar (Kusursuz Türkçe Karakterler)
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(22);
  doc.text('AŞKAR YAYINLARI', 15, 17);

  doc.setFontSize(11);
  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.text('NOT AVCISI • YAZILI ÖN HAZIRLIK SİMÜLASYONU', 15, 26);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8.5);
  doc.setFont(fontName, 'normal');
  doc.text('MEB FORMATINDA GERÇEK SÜRELİ PROVALAR & KAZANIM RAPORU', 15, 34);

  let y = 52;

  // 2. Yetkili Temsilcilik Kartı
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, y, 180, 26, 3, 3, 'FD');

  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(13);
  doc.text(firmaAdi.toUpperCase(), 22, y + 8.5);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Resmi Sorumluluk Bölgesi: ${sehir} / ${ilce}`, 22, y + 15.5);
  doc.text(`Yetkili: ${yetkiliAdi}  |  İletişim: ${telefon}`, 22, y + 21.5);

  y += 33;

  // 3. Öğrencilere ve Velilere Çağrı
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.roundedRect(15, y, 180, 8.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(10);
  doc.text('GERÇEK YAZILIYA GİRMEDEN ÖNCE KENDİNİ DENE, 100 TAM PUANI AVLA!', 20, y + 5.8);

  y += 14;

  const features = [
    {
      title: '1. MEB Formatında 40 Dakikalık Süreli Prova:',
      desc: '3. sınıftan 12. sınıfa kadar dönem yazılılarına birebir uyumlu testler ve korumalı ekran.'
    },
    {
      title: '2. Nokta Atışı MEB Kazanım Analizi:',
      desc: 'Hangi soruda neden puan kaybettiğini anında gösteren kişiselleştirilmiş karne raporu.'
    },
    {
      title: '3. Koç Baykuş Sınav Reçetesi:',
      desc: 'Eksik konulara özel nokta atışı ders çalışma tavsiyeleri ve sınav taktikleri.'
    },
    {
      title: '4. Bu Noktaya Özel %10 İndirim Avantajı:',
      desc: activeDiscountCode
        ? `Aşağıdaki karekodu okutan veya ${activeDiscountCode} indirim kodunu kullanan velilerimize anında %10 indirim!`
        : 'Aşağıdaki karekodu okutan tüm velilerimize anında %10 veli indirimi avantajı!'
    }
  ];

  features.forEach((feat) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, y, 180, 14, 2, 2, 'F');

    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(9);
    doc.text(feat.title, 20, y + 5);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const splitDesc = doc.splitTextToSize(feat.desc, 170);
    doc.text(splitDesc, 20, y + 9.5);

    y += 16.5;
  });

  y += 3;

  // 4. KAREKOD & İNDİRİM ALANI (SAYFA 1)
  doc.setFillColor(254, 243, 199); // Amber soft
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.setLineWidth(1);
  doc.roundedRect(15, y, 180, 52, 3, 3, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont(fontName, 'bold');
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

  // Right side of QR: İndirim Kodu Alanı
  const rightX = 62;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.roundedRect(rightX, y + 12, 126, 20, 2, 2, 'FD');

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.text('Öğrenci & Veli İndirim Kodu:', rightX + 5, y + 18);

  if (activeDiscountCode) {
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(13);
    doc.text(activeDiscountCode, rightX + 5, y + 27);

    doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
    doc.setFontSize(9);
    doc.text('%10 VELİ İNDİRİMİ HEDİYELİ', rightX + 68, y + 27);
  } else {
    // İndirim kodu şimdilik boş bırakılmıştır
    doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(9);
    doc.text('%10 VELİ İNDİRİMİ KAREKODLA GEÇERLİDİR', rightX + 5, y + 26);
  }

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.text('Doğrudan bağlantı: askaryayinlari.com.tr/not-avcisi', rightX, y + 38);
  doc.text(`Bu karekod ${firmaAdi} resmi temsilcilik tezgâhı için üretilmiştir.`, rightX, y + 44);

  // 5. Alt Bilgi / Footer (Sayfa 1)
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(8.5);
  doc.text('Aşkar Yayınları Eğitim Teknolojileri  |  www.askaryayinlari.com.tr', 15, 283);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Bu tanıtım afişi resmi temsilcimiz ${yetkiliAdi} (${firmaAdi} - ${ilce}) adına Genel Merkez tarafından onaylanmıştır.`, 15, 288);

  // ==========================================
  // SAYFA 2: DEV KAREKOD & İNDİRİM KODU (CAM / VİTRİN / TEZGÂH İÇİN)
  // ==========================================
  doc.addPage();

  // 1. Üst Başlık Banner (Sayfa 2)
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.rect(0, 34, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(19);
  doc.text('AŞKAR YAYINLARI • NOT AVCISI', 105, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
  doc.text('MEB YAZILI ÖN HAZIRLIK SİMÜLASYONU', 105, 25, { align: 'center' });

  // 2. Büyük Çağrı Başlığı
  doc.setFont(fontName, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text('TELEFONUNUZUN KAMERASIYLA KAREKODU OKUTUNUZ', 105, 48, { align: 'center' });

  doc.setFont(fontName, 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('100 Tam Puanı Hedefle, MEB Yazılı Provalarına Hemen Başla!', 105, 56, { align: 'center' });

  // 3. DEVASA KAREKOD KART (115 mm x 115 mm)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(42, 62, 126, 126, 4, 4, 'FD');

  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', 48, 68, 114, 114);
    } catch (err) {
      console.error('Error adding large QR to page 2:', err);
    }
  }

  // 4. BÜYÜK İNDİRİM KODU KUTUSU (ALTTA)
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(goldAmber[0], goldAmber[1], goldAmber[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(25, 196, 160, 42, 4, 4, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(11);
  doc.text('AŞKAR YAYINLARI & NOT AVCISI VELİ İNDİRİM KODU', 105, 206, { align: 'center' });

  if (activeDiscountCode) {
    doc.setFont(fontName, 'bold');
    doc.setFontSize(26);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(activeDiscountCode, 105, 222, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9);
    doc.text('%10 ANINDA VELİ İNDİRİMİ GEÇERLİDİR', 105, 231, { align: 'center' });
  } else {
    // İndirim kodu boş
    doc.setFont(fontName, 'normal');
    doc.setFontSize(12);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text('İndirim Kodu: (Genel Merkezden Tanımlanacak)', 105, 220, { align: 'center' });

    doc.setFont(fontName, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9);
    doc.text('%10 İNDİRİM İÇİN KAREKODU OKUTMANIZ YETERLİDİR', 105, 229, { align: 'center' });
  }

  // 5. Temsilcilik Notu & Web Adresi
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Resmi Temsilci: ${firmaAdi} (${sehir} / ${ilce})`, 105, 248, { align: 'center' });

  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Doğrudan bağlantı: www.askaryayinlari.com.tr/not-avcisi', 105, 254, { align: 'center' });

  // 6. Sayfa 2 Footer
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(8.5);
  doc.text('Aşkar Yayınları Eğitim Teknolojileri  |  www.askaryayinlari.com.tr', 105, 284, { align: 'center' });

  const cleanKod = kod.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Askar_Not_Avcisi_Bayi_Afisi_${cleanKod}.pdf`);
}
