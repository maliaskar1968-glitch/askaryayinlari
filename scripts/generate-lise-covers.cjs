const fs = require('fs');
const path = require('path');

const outDir = 'C:/askar-yayinlari/public/assets/ders-kartlari/lise';

const subjects = [
  {
    file: 'lise-matematik-1x1.svg',
    title: 'Lise Matematik',
    badge: '9-12. SINIF • TYT & AYT MATEMATİK',
    bg1: '#050c21', bg2: '#0b1d47', bg3: '#143475',
    accent: '#00f2fe', subAccent: '#38bdf8',
    cardSub: 'FONKSİYON, DENKLEM & YENİ NESİL',
    cardTitle: 'Analitik Düşünme & Soru Analizi',
    iconType: 'math',
    r1Title: 'Her Gün Farklı Seviyede Soru Çöz',
    r1Desc: 'Kolaydan zora aşamalı soru çözerek işlem refleksini canlı tut.',
    r2Title: 'Çözüm Yolunu Adım Adım Yaz',
    r2Desc: 'Fonksiyon ve denklem çözümlerinde adımları satır satır kaydet.',
    r3Title: 'Yanlışlarını Konu Bazında Sınıflandır',
    r3Desc: 'Hangi kazanımda takıldığını tespit et; 3 gün sonra yeniden çöz.'
  },
  {
    file: 'lise-geometri-1x1.svg',
    title: 'Lise Geometri',
    badge: 'ÜÇGEN • ÇEMBER • ANALİTİK',
    bg1: '#021326', bg2: '#06294f', bg3: '#0c4987',
    accent: '#38bdf8', subAccent: '#60a5fa',
    cardSub: 'GÖRSEL DÜŞÜNME VE İLİŞKİLERİ FARK ETME',
    cardTitle: 'Geometrik Çizim & Teoremler',
    iconType: 'geo',
    r1Title: 'Şekli Kendin Çiz ve İncele',
    r1Desc: 'Verilen açı ve kenar uzunluklarını şekle bizzat aktararak çalış.',
    r2Title: 'Yardımcı Çizginin Nedenini Açıkla',
    r2Desc: 'Çizdiğin ek doğrunun hangi benzerlik veya açı kuralını kurduğunu gör.',
    r3Title: 'Her Gün 10-15 Geometri Sorusu Çöz',
    r3Desc: 'Aralıksız pratikle görme refleksini ve kural algını geliştir.'
  },
  {
    file: 'lise-fizik-1x1.svg',
    title: 'Lise Fizik',
    badge: 'MEKANİK • ELEKTRİK • OPTİK',
    bg1: '#090724', bg2: '#16114a', bg3: '#291e78',
    accent: '#818cf8', subAccent: '#00f2fe',
    cardSub: 'OLAYI ANLANDIRIP MODELLEMEK',
    cardTitle: 'Fiziksel Modelleme & Formüller',
    iconType: 'atom',
    r1Title: 'Serbest Cisim Diyagramı Çiz',
    r1Desc: 'Kuvvetlerin yönlerini ve bileşenlerini şekil üzerinde göster.',
    r2Title: 'Formülün Geçerlilik Koşulunu Bil',
    r2Desc: 'Sürtünme, yer çekimi ve ideal sistem varsayımlarını kontrol et.',
    r3Title: 'Grafik Eksenlerini ve Eğimi Yorumla',
    r3Desc: 'Hız-zaman ve kuvvet-yol grafiklerinde alan ve eğim anlamını çıkar.'
  },
  {
    file: 'lise-kimya-1x1.svg',
    title: 'Lise Kimya',
    badge: 'ORGANİK • PERİYODİK TABLO • MOL',
    bg1: '#011c1c', bg2: '#043838', bg3: '#085757',
    accent: '#10b981', subAccent: '#00f2fe',
    cardSub: 'KAVRAM, SEMBOL VE İŞLEM BECERİSİ',
    cardTitle: 'Tepkimeler & Parçacık Düzeyi',
    iconType: 'flask',
    r1Title: 'Atom ve Yük Dengesini Takip Et',
    r1Desc: 'Kimyasal denklemleri denkleştirmeden asla hesaplamaya başlama.',
    r2Title: 'Periyodik Tabloyu Harita Gibi Kullan',
    r2Desc: 'Elektronegatiflik, iyonlaşma enerjisi ve çap eğilimlerini kavra.',
    r3Title: 'Mol ve Hesaplamada Birimleri Yaz',
    r3Desc: 'Gram, mol ve litre dönüşümlerini orantı ve formülle sağla.'
  },
  {
    file: 'lise-biyoloji-1x1.svg',
    title: 'Lise Biyoloji',
    badge: 'HÜCRE • KALITIM • SİSTEMLER',
    bg1: '#011e14', bg2: '#033b27', bg3: '#06593b',
    accent: '#10b981', subAccent: '#a3e635',
    cardSub: 'SİSTEMLER VE BİRBİRİNİ ETKİLEYEN SÜREÇLER',
    cardTitle: 'Hücresel Süreçler & Akış Şeması',
    iconType: 'dna',
    r1Title: 'Süreçleri Akış Şemasıyla Özetle',
    r1Desc: 'Fotosentez, solunum ve protein sentezini basamak basamak çiz.',
    r2Title: 'Benzer Yapı ve Görevleri Karşılaştır',
    r2Desc: 'Mitoz-mayoz ve hormon görevlerini iki sütunlu tablolarla ayır.',
    r3Title: 'Deney ve Şekil Sorularını İncele',
    r3Desc: 'Ok yönlerine, enzim koşullarına ve kontrol değişkenlerine dikkat et.'
  },
  {
    file: 'lise-turk-dili-edebiyat-1x1.svg',
    title: 'Türk Dili ve Edebiyatı',
    badge: 'DÖNEMLER • ESER-YAZAR • ŞİİR',
    bg1: '#1c060d', bg2: '#380e1b', bg3: '#5c172d',
    accent: '#f43f5e', subAccent: '#fbbf24',
    cardSub: 'EDEBİ AKIMLAR VE ESERLERİN BAĞLAMI',
    cardTitle: 'Eser-Yazar Eşleştirmesi & Şiir',
    iconType: 'book',
    r1Title: 'Eser-Yazar-Dönem Kartı Hazırla',
    r1Desc: 'Tanzimat, Servetifünun ve Cumhuriyet yazarlarını ana eserleriyle kodla.',
    r2Title: 'Şiirde Nazım Biçimi ve Ölçüyü Bul',
    r2Desc: 'Aruz, hece, kafiye örgüsü ve edebi sanatları metin üzerinde işaretle.',
    r3Title: 'Her Gün Paragraf ve Anlam Çöz',
    r3Desc: 'TYT Türkçe hızını korumak için günlük 20 paragraf rutini oluştur.'
  },
  {
    file: 'lise-tarih-1x1.svg',
    title: 'Lise Tarih',
    badge: 'İLK ÇAĞDAN CUMHURİYETE',
    bg1: '#081124', bg2: '#13284f', bg3: '#1f417d',
    accent: '#3b82f6', subAccent: '#fbbf24',
    cardSub: 'KOPUK EZBER DEĞİL, TARİHSEL BİLİNÇ',
    cardTitle: 'Kronoloji & Neden-Sonuç Ağı',
    iconType: 'history',
    r1Title: 'Olayları Zaman Çizelgesine Koy',
    r1Desc: 'Savaş, antlaşma ve reformları tarihsel sırasına göre yerleştir.',
    r2Title: 'Kaynak Metin ve Belge Yorumla',
    r2Desc: 'Soruda verilen ferman veya antlaşma metninin doğrudan mesajını al.',
    r3Title: 'Neden ve Sonuçları Karşılaştır',
    r3Desc: 'Bir olayın siyasi, askeri ve ekonomik sonuçlarını ayrı ayrı listele.'
  },
  {
    file: 'lise-cografya-1x1.svg',
    title: 'Lise Coğrafya',
    badge: 'İKLİM • HARİTA • DOĞAL AFETLER',
    bg1: '#021624', bg2: '#05314f', bg3: '#0a4f7d',
    accent: '#00f2fe', subAccent: '#34d399',
    cardSub: 'MEKÂN, İNSAN VE SÜREÇ İLİŞKİSİ',
    cardTitle: 'Harita Okuma & Doğal Süreçler',
    iconType: 'globe',
    r1Title: 'Haritayı Her Konuya Dahil Et',
    r1Desc: 'Dünya ve Türkiye dilsiz haritalarında dağ, iklim ve nüfus dağılışını çiz.',
    r2Title: 'İklim Grafikleri ve Eksenleri Oku',
    r2Desc: 'Sıcaklık ve yağış grafiklerinden rejimi ve yarımküreyi belirle.',
    r3Title: 'Doğal Afetler ve Risk Bölgelerini Gör',
    r3Desc: 'Fay hatları, volkanik kuşaklar ve muson alanlarını haritada tanı.'
  },
  {
    file: 'lise-felsefe-1x1.svg',
    title: 'Lise Felsefe',
    badge: 'BİLGİ • AHLAK • VARLIK FELSEFESİ',
    bg1: '#0e0621', bg2: '#210e47', bg3: '#3a1778',
    accent: '#c084fc', subAccent: '#d946ef',
    cardSub: 'KAVRAMLAR VE TEMEL İDDİALAR',
    cardTitle: 'Filozof Görüşleri & Akıl Yürütme',
    iconType: 'philosophy',
    r1Title: 'Görüşleri Karşılaştırma Tablosuna Al',
    r1Desc: 'Rasyonalizm, empirizm ve pozitivizm gibi akımları temsilcileriyle eşle.',
    r2Title: 'Paragraftaki Temel İddiayı Bul',
    r2Desc: 'Yazarın savunduğu tez ile çürüttüğü karşıt tezi metinden çekip çıkar.',
    r3Title: 'Kendi Yorumunu Metnin Önüne Koyma',
    r3Desc: 'Soruyu kendi dünya görüşüne göre değil, filozofun mantığına göre çöz.'
  },
  {
    file: 'lise-din-kulturu-1x1.svg',
    title: 'Lise Din Kültürü',
    badge: 'İSLAM DÜŞÜNCESİ • AYET YORUMU',
    bg1: '#031c21', bg2: '#063840', bg3: '#0b545e',
    accent: '#2dd4bf', subAccent: '#fbbf24',
    cardSub: 'TEMEL İLKELER VE AHLAKİ DEĞERLER',
    cardTitle: 'Ayet & Hadislerde Ana Mesaj',
    iconType: 'religion',
    r1Title: 'Kavramların Tanımlarını Netleştir',
    r1Desc: 'İhlas, ihsan, takva ve vahdet gibi terimlerin kapsamını tam kavra.',
    r2Title: 'Ayet ve Hadis Yorumunda Kanıta Bağlı Kal',
    r2Desc: 'Metnin doğrudan vurguladığı ahlaki ve itikadi ilkeyi belirle.',
    r3Title: 'Mezhepler ve Düşünce Ekollerini Ayır',
    r3Desc: 'İtikadi, fıkhi ve tasavvufi yorumların temel yaklaşımlarını öğren.'
  },
  {
    file: 'lise-ingilizce-1x1.svg',
    title: 'Lise İngilizce',
    badge: 'B1-B2 SEVİYESİ • GRAMMAR & READING',
    bg1: '#110729', bg2: '#240d54', bg3: '#45168a',
    accent: '#f43f5e', subAccent: '#38bdf8',
    cardSub: 'KELİME DAĞARCIĞI VE AKICI OKUMA',
    cardTitle: 'Bağlam & Aralıklı Kelime Tekrarı',
    iconType: 'lang',
    r1Title: 'Yeni Kelimeleri Cümle İçinde Öğren',
    r1Desc: 'Sözcüğü tek başına ezberleme; yanına aldığı edat ve fiille birlikte yaz.',
    r2Title: 'Hergün 10 Dakika Dinleme & Okuma',
    r2Desc: 'İngilizce haber, podcast ve kısa makalelerle kulak dolgunluğu sağla.',
    r3Title: 'Bağlaçlar ve Zaman Uyumuna Dikkat Et',
    r3Desc: 'However, although, since gibi geçiş sözcüklerinin anlam yönünü izle.'
  }
];

function generateSvg(s) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${s.bg1}"/>
      <stop offset="50%" stop-color="${s.bg2}"/>
      <stop offset="100%" stop-color="${s.bg3}"/>
    </linearGradient>

    <linearGradient id="glassCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>

    <linearGradient id="accGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${s.accent}"/>
      <stop offset="100%" stop-color="${s.subAccent}"/>
    </linearGradient>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Fallback solid rect then gradient -->
  <rect width="900" height="900" fill="${s.bg1}"/>
  <rect width="900" height="900" fill="url(#bgGrad)"/>

  <!-- Tech Grid Background -->
  <g opacity="0.12" stroke="${s.accent}" stroke-width="1.5">
    <line x1="0" y1="180" x2="900" y2="180"/>
    <line x1="0" y1="360" x2="900" y2="360"/>
    <line x1="0" y1="540" x2="900" y2="540"/>
    <line x1="0" y1="720" x2="900" y2="720"/>
    <line x1="180" y1="0" x2="180" y2="900"/>
    <line x1="360" y1="0" x2="360" y2="900"/>
    <line x1="540" y1="0" x2="540" y2="900"/>
    <line x1="720" y1="0" x2="720" y2="900"/>
  </g>

  <!-- Glowing Luminous Orbs -->
  <circle cx="220" cy="220" r="190" fill="${s.accent}" opacity="0.18" filter="blur(70px)"/>
  <circle cx="720" cy="650" r="230" fill="${s.subAccent}" opacity="0.15" filter="blur(75px)"/>

  <!-- Header Branding -->
  <g transform="translate(80, 95)">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="${s.accent}" letter-spacing="4">
      AŞKAR / LİSE ÇALIŞMA REHBERİ
    </text>
    <text y="55" font-family="'Cinzel', 'Times New Roman', serif" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="1">
      ${s.title}
    </text>

    <!-- Pill Badge -->
    <rect x="0" y="80" width="310" height="34" rx="17" fill="${s.accent}" fill-opacity="0.2" stroke="${s.accent}" stroke-width="1.5"/>
    <circle cx="18" cy="97" r="5" fill="${s.accent}"/>
    <text x="32" y="103" font-family="monospace" font-size="12" font-weight="700" fill="${s.accent}" letter-spacing="2">
      ${s.badge}
    </text>
  </g>

  <!-- Center Glassmorphic Card -->
  <g transform="translate(80, 270)" filter="url(#cardShadow)">
    <rect width="740" height="520" rx="32" fill="${s.bg2}" fill-opacity="0.6"/>
    <rect width="740" height="520" rx="32" fill="url(#glassCard)" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/>

    <!-- Subject Header Inside Card -->
    <g transform="translate(50, 45)">
      <rect width="64" height="64" rx="18" fill="${s.accent}" fill-opacity="0.2" stroke="${s.accent}" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="16" fill="none" stroke="${s.subAccent}" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="6" fill="${s.accent}"/>

      <text x="80" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">
        ${s.cardTitle}
      </text>
      <text x="80" y="52" font-family="monospace" font-size="13" fill="${s.accent}" letter-spacing="1">
        ${s.cardSub}
      </text>
    </g>

    <!-- Strategy Rule 1 -->
    <g transform="translate(50, 145)">
      <rect width="640" height="95" rx="18" fill="#000000" fill-opacity="0.35" stroke="${s.accent}" stroke-opacity="0.4" stroke-width="1.2"/>
      <circle cx="45" cy="48" r="20" fill="${s.accent}" fill-opacity="0.2"/>
      <text x="45" y="54" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="900" fill="${s.accent}">1</text>
      <text x="85" y="38" font-family="system-ui" font-size="16" font-weight="800" fill="#ffffff">
        ${s.r1Title}
      </text>
      <text x="85" y="64" font-family="system-ui" font-size="13" fill="#cbd5e1">
        ${s.r1Desc}
      </text>
    </g>

    <!-- Strategy Rule 2 -->
    <g transform="translate(50, 260)">
      <rect width="640" height="95" rx="18" fill="#000000" fill-opacity="0.35" stroke="${s.subAccent}" stroke-opacity="0.4" stroke-width="1.2"/>
      <circle cx="45" cy="48" r="20" fill="${s.subAccent}" fill-opacity="0.2"/>
      <text x="45" y="54" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="900" fill="${s.subAccent}">2</text>
      <text x="85" y="38" font-family="system-ui" font-size="16" font-weight="800" fill="#ffffff">
        ${s.r2Title}
      </text>
      <text x="85" y="64" font-family="system-ui" font-size="13" fill="#cbd5e1">
        ${s.r2Desc}
      </text>
    </g>

    <!-- Strategy Rule 3 -->
    <g transform="translate(50, 375)">
      <rect width="640" height="95" rx="18" fill="#000000" fill-opacity="0.35" stroke="#fbbf24" stroke-opacity="0.4" stroke-width="1.2"/>
      <circle cx="45" cy="48" r="20" fill="#fbbf24" fill-opacity="0.2"/>
      <text x="45" y="54" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="900" fill="#fbbf24">3</text>
      <text x="85" y="38" font-family="system-ui" font-size="16" font-weight="800" fill="#ffffff">
        ${s.r3Title}
      </text>
      <text x="85" y="64" font-family="system-ui" font-size="13" fill="#cbd5e1">
        ${s.r3Desc}
      </text>
    </g>
  </g>
</svg>`;
}

subjects.forEach(s => {
  const p = path.join(outDir, s.file);
  fs.writeFileSync(p, generateSvg(s), 'utf8');
  console.log('Created: ' + s.file);
});

console.log('All 11 Lise subject SVGs generated successfully!');
