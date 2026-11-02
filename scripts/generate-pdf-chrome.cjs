const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function getBase64(file) {
  if (!fs.existsSync(file)) return '';
  const ext = path.extname(file).replace('.', '');
  return 'data:image/' + (ext === 'jpg' ? 'jpeg' : ext) + ';base64,' + fs.readFileSync(file).toString('base64');
}

const logoBase64 = getBase64('C:/askar-yayinlari/public/resimler/branding/not-avcisi-logo.jpg');
const owlBase64 = getBase64('C:/askar-yayinlari/public/resimler/branding/not-avcisi-baykus.jpg');

const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Not Avcısı Dijital Ürün Tanıtım ve Veli Bilgilendirme Rehberi</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #FDFBF7;
      color: #1A1A1A;
      width: 210mm;
      height: 297mm;
      padding: 12mm 14mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* HEADER */
    .header {
      background: linear-gradient(135deg, #1A1A1A 0%, #2A2621 100%);
      border-radius: 14px;
      padding: 16px 20px;
      color: white;
      border: 2px solid #C9A86A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-img {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      border: 2px solid #C9A86A;
      background: white;
      object-fit: cover;
    }
    .header-titles h1 {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #FFFFFF;
      margin-bottom: 3px;
    }
    .header-titles h1 span {
      color: #E5C98E;
    }
    .header-titles p {
      font-size: 11px;
      color: #D4AF37;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .header-badge {
      background: rgba(201, 168, 106, 0.2);
      border: 1px solid #C9A86A;
      padding: 6px 14px;
      border-radius: 8px;
      text-align: right;
    }
    .header-badge .tag {
      font-size: 9.5px;
      color: #E5C98E;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-badge .sub {
      font-size: 11px;
      color: #FFFFFF;
      font-weight: 700;
    }

    /* WARNING BOX (KAYITLI E-POSTA İLE SATIN AL) */
    .warning-card {
      margin-top: 10px;
      background: #FFFBEB;
      border: 2px solid #D97706;
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .warning-icon {
      font-size: 32px;
      line-height: 1;
    }
    .warning-content h3 {
      font-size: 13px;
      color: #B45309;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.3px;
    }
    .warning-content p {
      font-size: 11px;
      color: #78350F;
      line-height: 1.45;
      font-weight: 500;
    }
    .warning-content strong {
      color: #92400E;
      text-decoration: underline;
    }

    /* SECTION TITLE */
    .section-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #1A1A1A;
      border-left: 4px solid #C9A86A;
      padding-left: 8px;
      margin-top: 10px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* GRID: SCOPE & FEATURES */
    .grid-2 {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 12px;
    }
    .card {
      background: white;
      border: 1px solid #E5E0D8;
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .card h4 {
      font-size: 12px;
      font-weight: 800;
      color: #856526;
      text-transform: uppercase;
      margin-bottom: 8px;
      border-bottom: 1px solid #F0ECE4;
      padding-bottom: 4px;
    }
    .feature-list {
      list-style: none;
    }
    .feature-list li {
      font-size: 10.8px;
      line-height: 1.45;
      color: #2D2D2D;
      margin-bottom: 6px;
      position: relative;
      padding-left: 18px;
    }
    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: #059669;
      font-weight: 900;
      font-size: 12px;
    }

    /* EXAM TABLE */
    .exam-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 10.5px;
    }
    .exam-table th {
      background: #F3EFE6;
      color: #59441B;
      padding: 5px 8px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #E5E0D8;
    }
    .exam-table td {
      padding: 5px 8px;
      border: 1px solid #EAE5DC;
      color: #333333;
    }
    .exam-table tr:nth-child(even) {
      background: #FAF8F5;
    }
    .gift-badge {
      background: #ECFDF5;
      color: #047857;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #A7F3D0;
      display: inline-block;
      font-size: 9.5px;
    }

    /* 3-STEP ACTIVATION GUIDE */
    .steps-container {
      margin-top: 10px;
      background: white;
      border: 1px solid #E5E0D8;
      border-radius: 12px;
      padding: 12px 14px;
    }
    .steps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }
    .step-box {
      background: #FAF8F5;
      border: 1px solid #EBE6DC;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }
    .step-num {
      width: 24px;
      height: 24px;
      background: #C9A86A;
      color: #1A1A1A;
      font-weight: 900;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 6px;
      font-size: 11px;
    }
    .step-box h5 {
      font-size: 11px;
      font-weight: 800;
      color: #1A1A1A;
      margin-bottom: 3px;
    }
    .step-box p {
      font-size: 10px;
      color: #555555;
      line-height: 1.35;
    }

    /* LEGAL & SHOPIER RETURN POLICY */
    .legal-card {
      margin-top: 10px;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .legal-icon {
      font-size: 26px;
    }
    .legal-text h4 {
      font-size: 11.5px;
      font-weight: 800;
      color: #1E293B;
      margin-bottom: 2px;
    }
    .legal-text p {
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }

    /* FOOTER & WHATSAPP */
    .footer {
      margin-top: 10px;
      background: #1A1A1A;
      border-radius: 12px;
      padding: 12px 18px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #C9A86A;
    }
    .footer-left {
      font-size: 10.5px;
      color: #D1D5DB;
      line-height: 1.4;
    }
    .footer-left strong {
      color: #E5C98E;
      font-size: 11.5px;
      display: block;
      margin-bottom: 2px;
    }
    .whatsapp-badge {
      background: #059669;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <img src="${logoBase64}" alt="Logo" class="logo-img">
      <div class="header-titles">
        <h1>NOT AVCISI <span>MEB YAZILI PROVALARI</span></h1>
        <p>Aşkar Yayınları • Resmî Dijital Ürün Tanıtım ve Veli Rehberi</p>
      </div>
    </div>
    <div class="header-badge">
      <div class="tag">Lisans Paketi</div>
      <div class="sub">3 - 12. Sınıf</div>
    </div>
  </div>

  <!-- UYARI KUTUSU -->
  <div class="warning-card">
    <div class="warning-icon">⚠️</div>
    <div class="warning-content">
      <h3>DİKKAT: SATIN ALIRKEN SİSTEME KAYDOLDUĞUNUZ E-POSTA ADRESİNİ GİRİNİZ!</h3>
      <p>
        Ödemeniz Shopier üzerinde tamamlandığında Not Avcısı sınav lisansınızın öğrenci hesabınızla 
        <strong>anında ve otomatik olarak eşleşebilmesi için</strong>, lütfen Shopier ödeme formundaki e-posta alanına 
        <strong>Not Avcısı'na kaydolurken kullandığınız e-posta adresini</strong> yazınız.
      </p>
    </div>
  </div>

  <!-- KAPSAM VE ÖZELLİKLER BÖLÜMÜ -->
  <div class="section-title">Yıllık Sınav Paketi Kapsamı ve Kurallar</div>
  <div class="grid-2">
    
    <!-- SOL: SINAV DÖNEMLERİ TABLOSU -->
    <div class="card">
      <h4>Dönemlik Yazılı Deneme Sayıları</h4>
      <table class="exam-table">
        <thead>
          <tr>
            <th>Dönem & Sınav</th>
            <th>Prova Tipi</th>
            <th>Erişim Durumu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Dönem 1. Yazılı</strong></td>
            <td>3 Normal Prova + 1 Genel Prova</td>
            <td><span class="gift-badge">Matematik ÜCRETSİZ Hediye</span></td>
          </tr>
          <tr>
            <td><strong>1. Dönem 2. Yazılı</strong></td>
            <td>3 Normal Prova + 1 Genel Prova</td>
            <td>MEB Takviminden 1 Hafta Önce</td>
          </tr>
          <tr>
            <td><strong>2. Dönem 1. Yazılı</strong></td>
            <td>3 Normal Prova + 1 Genel Prova</td>
            <td>MEB Takviminden 1 Hafta Önce</td>
          </tr>
          <tr>
            <td><strong>2. Dönem 2. Yazılı</strong></td>
            <td>3 Normal Prova + 1 Genel Prova</td>
            <td>MEB Takviminden 1 Hafta Önce</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size: 9.8px; color: #666; margin-top: 6px; line-height: 1.35;">
        * Her dönemde 3 adet konu odaklı yazılı provası ve 1 adet MEB formatında kapsamlı genel prova sunulur (Yılda toplam 16 yazılı simülasyonu).
      </p>
    </div>

    <!-- SAĞ: TEMEL KURALLAR VE ÖZELLİKLER -->
    <div class="card">
      <h4>Önemli Kurallar ve Güvenceler</h4>
      <ul class="feature-list">
        <li><strong>Yalnızca Kendi Sınıfı:</strong> Satın alınan paket öğrencinin kayıtlı olduğu sınıfın tüm MEB yazılılarını kapsar. Farklı bir sınıfın sınavına giriş yapılamaz.</li>
        <li><strong>Takvim Koruması:</strong> Sınavlar MEB resmî yazılı tarihlerinden tam 1 hafta önce sistemde otomatik açılır. Tarihi gelmeyen sınavlar kilitlidir.</li>
        <li><strong>40 Dakika Süreli Simülatör:</strong> Gerçek sınav ortamı, ekran koruması ve süre yönetimiyle sınav kaygısını ortadan kaldırır.</li>
        <li><strong>Koç Baykuş Raporu:</strong> Sınav bitiminde öğrencinin eksik MEB kazanımları ve veli onaylı gelişim karnesi anında listelenir.</li>
      </ul>
    </div>
  </div>

  <!-- SİSTEM NASIL ÇALIŞIR? 3 ADIM -->
  <div class="steps-container">
    <div style="font-size: 12px; font-weight: 800; color: #1A1A1A; text-transform: uppercase;">
      Not Avcısı 3 Adımda Nasıl Aktifleşir?
    </div>
    <div class="steps-grid">
      <div class="step-box">
        <div class="step-num">1</div>
        <h5>Kulübe Kaydolun</h5>
        <p>www.askaryayinlari.com.tr üzerinden Not Avcısı alanına girip öğrenci sınıfınızı seçerek veli onaylı kulüp kaydınızı tamamlayın.</p>
      </div>
      <div class="step-box">
        <div class="step-num">2</div>
        <h5>Shopier'den Satın Alın</h5>
        <p>Satın alma ekranında <strong>sisteme kayıt yaptırdığınız e-posta adresinizi</strong> girerek güvenli ödemenizi tamamlayın.</p>
      </div>
      <div class="step-box">
        <div class="step-num">3</div>
        <h5>Provalara Başlayın</h5>
        <p>Lisansınız anında hesabınızla eşleşir. MEB sınav takvimine göre aktif olan provaları çözüp karne analizinizi alın!</p>
      </div>
    </div>
  </div>

  <!-- İPTAL VE İADE KOŞULLARI (GÜVENCE) -->
  <div class="legal-card">
    <div class="legal-icon">🛡️</div>
    <div class="legal-text">
      <h4>Shopier Tüketici İptal ve İade Koşulları Geçerlidir</h4>
      <p>
        Not Avcısı ödemeleri Shopier altyapısıyla 256-Bit SSL şifrelemeli olarak güvence altındadır. 
        Satın alımlarda <strong>Shopier Tüketici İptal ve İade Koşulları</strong> ile 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 
        Mesafeli Sözleşmeler Yönetmeliği hükümleri geçerlidir. Dijital içerik ve anında ifa edilen hizmetlerde yasal mevzuata uygun işlem tesis edilir.
      </p>
    </div>
  </div>

  <!-- FOOTER & İLETİŞİM -->
  <div class="footer">
    <div class="footer-left">
      <strong>AŞKAR YAYINLARI & NOT AVCISI AKADEMİ</strong>
      Sınav Başarısında Güvenilir Rehberiniz • www.askaryayinlari.com.tr
    </div>
    <div class="whatsapp-badge">
      <span>💬 WhatsApp Destek:</span>
      <span>0505 716 29 39</span>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = 'C:/askar-yayinlari/scripts/temp-brochure.html';
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
console.log('HTML saved to:', tempHtmlPath);

const outputPdf = 'C:/askar-yayinlari/public/downloads/Not_Avcisi_Dijital_Urun_Tanitim_Rehberi.pdf';
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdf}" "${tempHtmlPath}"`;

console.log('Executing Chrome headless print-to-pdf...');
execSync(cmd);
console.log('PDF successfully generated at:', outputPdf, 'Size:', fs.statSync(outputPdf).size, 'bytes');

// Also copy to user's desktop
const desktopPdf = 'C:/Users/kalite sistem/OneDrive/Desktop/Not_Avcisi_Dijital_Urun_Tanitim_Rehberi.pdf';
fs.copyFileSync(outputPdf, desktopPdf);
console.log('Copied to Desktop:', desktopPdf);

// Also copy to brain artifact
const brainPdf = 'C:/Users/kalite sistem/.gemini/antigravity/brain/5d5f532e-514f-44b5-9713-f319ce06b3d4/Not_Avcisi_Dijital_Urun_Tanitim_Rehberi.pdf';
fs.copyFileSync(outputPdf, brainPdf);
console.log('Copied to Brain Artifacts:', brainPdf);
