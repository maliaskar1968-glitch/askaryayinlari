import fs from 'node:fs';

const filePath = 'C:/askar-yayinlari/src/data/toolsData.ts';
let code = fs.readFileSync(filePath, 'utf8');

const updates = [
  {
    id: 'lise-ortalama',
    category: 'OKUL_NOT',
    metaTitle: 'Lise Dönem Ortalama Hesaplama 2026 | 9, 10, 11, 12. Sınıf Ağırlıklı Not Ortalaması',
    metaDescription: "MEB Ortaöğretim Kurumları Yönetmeliği'ne uygun lise dönem ortalaması hesaplama aracı. Sınav, performans ve proje notlarınızı girin, ağırlıklı ortalamanızı ve sınıf geçme durumunuzu görün."
  },
  {
    id: 'altin-is',
    category: 'KOCLUK',
    metaTitle: 'Günde 3 Altın İş Takip Sistemi | Derece Yapanların Odaklanma & Koçluk Metodu',
    metaDescription: 'Aşkar Yayınları Günde 3 Altın İş koçluk metodolojisi. Her gün en kritik 3 görevinizi belirleyin, odaklanarak tamamlayın ve sınav hazırlığında ivme kazanın.'
  },
  {
    id: 'takdir',
    category: 'OKUL_NOT',
    metaTitle: 'Takdir Teşekkür Hesaplama 2026 | 4, 5, 6, 7, 8, 9, 10, 11, 12. Sınıf e-Okul Uyumlu',
    metaDescription: '2026 e-Okul MEB mevzuatına %100 uyumlu Takdir Teşekkür Hesaplama Robotu. Dönem sonu ders notlarınızı ve haftalık ders saatlerinizi girerek belge durumunuzu saniyeler içinde öğrenin.'
  },
  {
    id: 'pomodoro',
    category: 'KOCLUK',
    metaTitle: 'Online Pomodoro Sayacı | 25+5 Odaklanma ve Çalışma Zamanlayıcısı',
    metaDescription: 'Ücretsiz online Pomodoro sayacı. 25 dakika kesintisiz ders çalışma ve 5 dakika mola döngüleriyle sınav hazırlığında odaklanmanızı zirveye taşıyın.'
  },
  {
    id: 'kelime',
    category: 'AKADEMIK',
    metaTitle: 'Kelime ve Karakter Sayacı | Online Metin ve Paragraf Analiz Aracı',
    metaDescription: 'Ücretsiz online kelime, karakter, cümle ve paragraf sayacı. Yazılarınızın uzunluğunu, boşluklu/boşluksuz vuruş sayısını ve tahmini okuma süresini anında ölçün.'
  },
  {
    id: 'kaynak',
    category: 'AKADEMIK',
    metaTitle: 'APA 7 Otomatik Kaynakça Oluşturucu | Kitap, Makale ve Web Alıntı Sihirbazı',
    metaDescription: 'Akademik ödev, tez ve makaleleriniz için APA 7 formatında otomatik kaynakça ve metin içi alıntı oluşturucu. Bilgileri girin, kusursuz APA referansını tek tıkla kopyalayın.'
  },
  {
    id: 'cocuk',
    category: 'COCUK',
    metaTitle: 'Sevimli Deniz Altı Kaşifleri | Eğitici Çocuk Oyunu ve Boyama Dünyası',
    metaDescription: 'Aşkar Yayınları Sevimli Deniz Altı Kaşifleri interaktif çocuk oyunu. 4-8 yaş çocukların çevre bilincini, yaratıcılığını ve problem çözme becerisini geliştiren ücretsiz eğitici oyun.'
  },
  {
    id: 'yks',
    category: 'YKS',
    metaTitle: 'YKS Puan Hesaplama 2026 | TYT AYT OBP Sıralama Robotu',
    metaDescription: 'ÖSYM 2026 uyumlu YKS puan hesaplama motoru. TYT ve AYT netlerinizle OBP katkılı SAY, EA, SÖZ yerleştirme puanınızı ve tahmini başarı sıranızı hemen hesaplayın.'
  },
  {
    id: 'yks-tercih',
    category: 'YKS',
    metaTitle: 'YKS Tercih Robotu 2026 | YÖK Atlas Üniversite Taban Puanları & Sıralamalar',
    metaDescription: 'En güncel YÖK Atlas verileriyle 2026 YKS Üniversite Tercih Robotu. Lisans ve önlisans bölümleri, taban puanlar ve başarı sıralarını anında filtreleyin.'
  },
  {
    id: 'tyt',
    category: 'YKS',
    metaTitle: 'TYT Puan Hesaplama 2026 | 120 Soru Net ve Ham Puan Sihirbazı',
    metaDescription: '2026 TYT net ve puan hesaplama aracı. 4 yanlış 1 doğruyu götürür kuralıyla Türkçe, Matematik, Fen ve Sosyal netlerinizi hesaplayıp 2 yıllık baraj durumunu öğrenin.'
  },
  {
    id: 'ayt',
    category: 'YKS',
    metaTitle: 'AYT Puan Hesaplama 2026 | Sayısal, Eşit Ağırlık ve Sözel Net Robotu',
    metaDescription: '2026 AYT net ve alan puanı hesaplama aracı. Matematik, Fen, Edebiyat-Sosyal-1 ve Sosyal-2 testleriyle alan puanınızı anında hesaplayın.'
  },
  {
    id: 'yks-sayac',
    category: 'YKS',
    metaTitle: 'YKS Geri Sayım Sayacı 2026 | Sınava Kaç Gün Kaldı? (Canlı ÖSYM)',
    metaDescription: '2026 YKS sınavına kaç gün, saat, dakika kaldı? ÖSYM sınav takvimi ile senkronize canlı TYT ve AYT geri sayım sayacı.'
  },
  {
    id: 'lgs',
    category: 'LGS',
    metaTitle: 'LGS Puan Hesaplama 2026 | MEB Katsayılı ve Yüzdelik Dilim Robotu',
    metaDescription: '2026 MEB LGS puan hesaplama motoru. Türkçe, Matematik, Fen, İnkılap, Din ve İngilizce netlerinizle 500 üzerinden LGS puanınızı ve tahmini yüzdelik diliminizi hesaplayın.'
  },
  {
    id: 'tercih',
    category: 'LGS',
    metaTitle: 'LGS Tercih Robotu 2026 | Nitelikli Liseler & Taban Puanları Yüzdelik Dilimler',
    metaDescription: '2026 LGS lise tercih sihirbazı. Fen liseleri, Anadolu liseleri ve proje okullarının güncel MEB taban puanları ve yüzdelik dilimleriyle akıllı tercih listenizi oluşturun.'
  },
  {
    id: 'lgs-sayac',
    category: 'LGS',
    metaTitle: 'LGS Geri Sayım Sayacı 2026 | LGS Sınavına Kaç Gün Kaldı?',
    metaDescription: '2026 MEB LGS sınavına kaç gün, saat ve saniye kaldı? Canlı LGS geri sayım sayacı ile kalan sürenizi anbean takip edin.'
  },
  {
    id: 'kap',
    category: 'LGS',
    metaTitle: 'KAP Dijital Kazanım Analiz Paneli | LGS & YKS Deneme Takip Sistemi',
    metaDescription: 'Aşkar KAP akıllı koçluk ve kazanım analiz paneli. Deneme sınavı sonuçlarınızı girin, eksik olduğunuz konu ve kazanımları anında tespit edip nokta atışı çalışın.'
  },
  {
    id: 'iokbs',
    category: 'BURSLULUK',
    metaTitle: 'İOKBS Bursluluk Puan Hesaplama 2026 | 5, 6, 7. Sınıf MEB Bursluluk Robotu',
    metaDescription: '2026 MEB İOKBS Bursluluk Sınavı puan hesaplama aracı. 5, 6 ve 7. sınıf için 100 soru üzerinden 3 yanlış 1 doğru kuralıyla netinizi ve tahmini burs kazanma barajını öğrenin.'
  }
];

for (const u of updates) {
  const regex = new RegExp(`id:\\s*'${u.id}',[\\s\\S]*?(?=id:\\s*'|\\n\\s*\\];\\s*$)`);
  const match = code.match(regex);
  if (match) {
    let block = match[0];
    block = block.replace(/category:\s*(?:'[^']+'|"[^"]+")/, `category: '${u.category}'`);
    block = block.replace(/metaTitle:\s*(?:'[^']*'|"[^"]*")/, `metaTitle: '${u.metaTitle.replace(/'/g, "\\'")}'`);
    block = block.replace(/metaDescription:\s*(?:'[^']*'|"[^"]*")/, `metaDescription: '${u.metaDescription.replace(/'/g, "\\'")}'`);
    code = code.replace(match[0], block);
    console.log(`Updated: ${u.id} -> ${u.category}`);
  } else {
    // special check for cocuk at the end of array
    const cocukRegex = /id:\s*'cocuk',[\s\S]*?(?=\n\];)/;
    const cocukMatch = code.match(cocukRegex);
    if (cocukMatch) {
      let b = cocukMatch[0];
      b = b.replace(/category:\s*(?:'[^']+'|"[^"]+")/, `category: '${u.category}'`);
      b = b.replace(/metaTitle:\s*(?:'[^']*'|"[^"]*")/, `metaTitle: '${u.metaTitle.replace(/'/g, "\\'")}'`);
      b = b.replace(/metaDescription:\s*(?:'[^']*'|"[^"]*")/, `metaDescription: '${u.metaDescription.replace(/'/g, "\\'")}'`);
      code = code.replace(cocukMatch[0], b);
      console.log(`Updated (end): ${u.id} -> ${u.category}`);
    } else {
      console.warn(`Could not find block for: ${u.id}`);
    }
  }
}

fs.writeFileSync('c:/psjunior/toolsData.updated.ts', code, 'utf8');
console.log('Successfully written updated code to c:/psjunior/toolsData.updated.ts!');
