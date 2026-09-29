import { ToolTab } from '../types';

export interface ToolDefinition {
  id: ToolTab;
  slug: string;
  image: string;
  name: string;
  shortName: string;
  badge: string;
  badgeColor: string;
  category: 'LGS' | 'YKS' | 'ARAÇLAR' | 'ÇOCUK' | 'BURSLULUK';
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  detailedDescription: string;
  iconName: string;
  highlights: string[];
  howToUse: string[];
  faq: { q: string; a: string }[];
  relatedBookId?: string;
  relatedBookTitle?: string;
}

export const TOOLS_DATA: ToolDefinition[] = [
  {
    id: 'yks',
    slug: 'yks-puan-hesaplama',
    image: '/assets/free-covers/yks-hesaplama.jpg',
    name: 'YKS Puan Hesaplama 2025 TYT AYT + OBP',
    shortName: 'YKS Puan Hesaplama',
    badge: 'YKS 2025 • TYT AYT OBP',
    badgeColor: '#ea580c',
    category: 'YKS',
    metaTitle: 'YKS Puan Hesaplama 2025 - TYT AYT OBP\'li',
    metaDescription: 'ÖSYM uyumlu YKS puan hesapla, tahmini sıralamanı gör.',
    h1: 'YKS Puan Hesaplama 2025 - TYT AYT OBP\'li',
    tagline: 'ÖSYM standartlarına uygun TYT ve AYT netlerinizi ve diploma notunuzu girerek OBP katkılı SAY, EA, SÖZ ve TYT yerleştirme puanınızı ve tahmini sıralamanızı anında hesaplayın.',
    detailedDescription: "### YKS Puanı Nasıl Hesaplanır?\nYükseköğretim Kurumları Sınavı (YKS) puanı, ÖSYM tarafından her yıl iki temel oturum ve adayların lise mezuniyet başarısını temsil eden Ortaöğretim Başarı Puanı'nın (OBP) ağırlıklı birleşimiyle hesaplanır.\n\n1. Birinci Oturum: Temel Yeterlilik Testi (TYT)\nTYT oturumunda tüm adaylara ortak 120 soru (40 Türkçe, 20 Sosyal Bilimler, 40 Temel Matematik, 20 Fen Bilimleri) yöneltilir. 4 yanlış cevabın 1 doğru cevabı elediği sınavda ham netler hesaplanır. ÖSYM'nin 100 taban puanı üzerine derslerin standart sapma katsayıları eklenerek adayların TYT Ham Puanı (100-500 aralığında) elde edilir. TYT puanı tek başına 2 yıllık önlisans programlarına yerleşmede ve özel yetenek sınavlarında kullanılır.\n\n2. İkinci Oturum: Alan Yeterlilik Testleri (AYT)\n4 yıllık lisans fakültelerine yerleşmek isteyen adaylar için AYT puanı hayati önem taşır. YKS yerleştirme puanının %40'ı TYT oturumundan, %60'ı ise AYT oturumundan gelir. AYT puan türleri adayın hedeflediği alana göre üç ana grupta toplanır:\n• Sayısal (SAY): TYT katkısı (%40) + AYT Matematik (40 soru) + AYT Fen Bilimleri (14 Fizik, 13 Kimya, 13 Biyoloji).\n• Eşit Ağırlık (EA): TYT katkısı (%40) + AYT Matematik (40 soru) + AYT Türk Dili ve Edebiyatı-Sosyal-1 (24 Edebiyat, 10 Tarih-1, 6 Coğrafya-1).\n• Sözel (SÖZ): TYT katkısı (%40) + Türk Dili ve Edebiyatı-Sosyal-1 (40 soru) + Sosyal Bilimler-2 (11 Tarih-2, 11 Coğrafya-2, 12 Felsefe Grubu, 6 Din Kültürü).\n\n3. OBP (Ortaöğretim Başarı Puanı) Katkısı Nasıl Eklenir?\nAdayın lise diploma notu (50-100 aralığında) 5 ile çarpılarak 250 ile 500 arasında OBP puanına dönüştürülür. Standart yerleştirmede bu OBP puanı 0,12 katsayısıyla çarpılarak adayın ham puanına eklenir (+30 ile +60 puan arası). Ancak adayın bir önceki yıl üniversiteye yerleşip yerleşmediği kontrol edilir; bir önceki yıl merkezi yerleştirmeyle bir bölüme yerleşen adayların OBP katsayısı 0,06'ya (yarıya) düşer ve 'Kırık OBP' uygulanır.\n\n4. Tahmini Sıralama Simülasyonu\nPuanlar kadar üniversite tercihlerinde en belirleyici unsur başarı sıralamasıdır. Hesaplama motorumuz, geçmiş yılların (2023 ve 2024 ÖSYM yığılma verileri) standart sapma ve net dağılım projeksiyonlarını kullanarak hesaplanan Y-SAY, Y-EA ve Y-SÖZ puanlarına karşılık gelen tahmini başarı sıralama aralığını anında sunar.",
    iconName: 'GraduationCap',
    highlights: [
      'TYT 120 Soru & AYT 80 Soru ÖSYM Net Sihirbazı',
      'Diploma Notu ile OBP ve Kırık OBP Yerleştirme Hesabı',
      'Sayısal (SAY), Eşit Ağırlık (EA), Sözel (SÖZ) ve TYT Puanları',
      'ÖSYM 2024 Yığılma Verilerine Dayalı Tahmini Başarı Sıralaması'
    ],
    howToUse: [
      'Üstteki hedef alan butonlarından alanınızı (Sayısal, Eşit Ağırlık veya Sözel) seçin.',
      'Sol panelde 120 soruluk TYT doğru ve yanlış sayılarınızı girin.',
      'Sağ panelde alanınıza ait AYT branş testlerinin doğru ve yanlışlarını yazın.',
      'Diploma notunuzu girin; geçen yıl yerleştiyseniz "Kırık OBP" kutusunu işaretleyin.',
      'Sonuç kartında OBP eklenmiş yerleştirme puanlarınızı ve tahmini başarı sıranızı inceleyin.'
    ],
    faq: [
      {
        q: 'YKS yerleştirme puanı nasıl hesaplanır?',
        a: 'YKS yerleştirme puanı; TYT ham puanının %40\'ı, AYT ham puanının %60\'ı ve adayın Ortaöğretim Başarı Puanı\'nın (Diploma Notu x 5 x 0.12) toplanmasıyla 560 tam puan üzerinden hesaplanır.'
      },
      {
        q: 'TYT\'de 4 yanlış 1 doğruyu götürür mü?',
        a: 'Evet. ÖSYM mevzuatına göre TYT ve AYT oturumlarındaki tüm alt testlerde 4 yanlış cevap 1 doğru cevabı götürür. Net sayısı; [Doğru Sayısı - (Yanlış Sayısı / 4)] formülüyle hesaplanır.'
      },
      {
        q: 'Kırık OBP nedir ve puanı ne kadar düşürür?',
        a: 'Bir önceki yıl YKS ile bir örgün veya açıköğretim lisans/önlisans programına yerleşen adayın (kayıt yaptırsın veya yaptırmasın) takip eden yılda OBP katsayısı 0.12\'den 0.06\'ya düşer. Bu durum adayın yerleştirme puanında yaklaşık 15 ila 30 puanlık bir kayba neden olur.'
      },
      {
        q: 'YKS baraj puanı kalktı mı?',
        a: 'Evet, YÖK kararıyla TYT (eski 150 barajı) ve AYT (eski 180 barajı) puan barajları kaldırılmıştır. Ancak Tıp (ilk 50 bin), Hukuk (ilk 125 bin), Mühendislik (ilk 300 bin), Mimarlık ve Öğretmenlik gibi bölümlerde başarı sırası barajları geçerliliğini korumaktadır.'
      },
      {
        q: 'Sayısal puan için Türkçe ve Sosyal çözmek gerekir mi?',
        a: 'Evet. TYT oturumu tüm puan türlerine %40 etki ettiği için TYT Türkçe ve TYT Sosyal netleri de Sayısal puanınızı doğrudan yükseltir. Ancak AYT oturumunda yalnızca Matematik ve Fen testleri Sayısal puanına dahil edilir.'
      }
    ],
    relatedBookId: 'k_yks',
    relatedBookTitle: "YKS'de Kendi Koçun Ol (YKS Koçluk & Derece Sistemi)"
  },
  {
    id: 'lise-ortalama',
    slug: 'lise-ortalama-hesaplama',
    image: '/assets/free-covers/lise-ortalama.jpg',
    name: 'Lise Ortalama Hesaplama 9-10-11-12 - Takdir Teşekkür',
    shortName: 'Lise Ortalama & Devamsızlık',
    badge: '9-12. SINIF LİSE • MEB E-OKUL',
    badgeColor: '#7c3aed',
    category: 'ARAÇLAR',
    metaTitle: 'Lise Ortalama Hesaplama 9-10-11-12 - Takdir Teşekkür',
    metaDescription: 'Lise ortalama, takdir teşekkür ve devamsızlık hesapla.',
    h1: 'Lise Ortalama Hesaplama 9-10-11-12 - Takdir Teşekkür',
    tagline: '9, 10, 11 ve 12. sınıf dönem ortalamanızı, takdir-teşekkür belge durumunuzu ve MEB 10/30 gün devamsızlık sınırınızı saniyede hesaplayın.',
    detailedDescription: "Milli Eğitim Bakanlığı (MEB) Ortaöğretim Kurumları Yönetmeliği uyarınca, liselerde (9, 10, 11 ve 12. sınıflar) dönem sonu ağırlıklı not ortalaması, her dersin haftalık ders saati ile o dersten alınan dönem puanının çarpımlarının toplam ders saatine bölünmesiyle hesaplanır. Türk Dili ve Edebiyatı, Matematik ve Fizik gibi haftalık ders saati yüksek olan branşlar genel ortalamayı doğrudan belirler.\n\nTakdir ve teşekkür belgesi kazanımında iki kritik kural mevcuttur: Öğrencinin dönem ortalaması 70,00 ile 84,99 arasında ise Teşekkür, 85,00 ve üzerinde ise Takdir belgesi almaya hak kazanır. Ancak öğrencinin tek bir dersinin dönem puanı dahi 50,00'nin altında (zayıf) ise ortalaması ne kadar yüksek olursa olsun belge verilmez. Ayrıca yönetmeliğin 160. maddesine göre, özürsüz devamsızlık süresi 5 günü geçen öğrenciler takdir ya da teşekkür belgesi alma hakkını kaybeder.\n\nDevamsızlık ve sınıf tekrarı konusunda ise MEB yönetmeliği son derece katıdır: Liselerde özürsüz devamsızlık hakkı en fazla 10 gün, özürlü (sağlık raporu veya veli izin dilekçesi) devamsızlık hakkı 20 gün olup toplam devamsızlık süresi 30 günü geçemez. Özürsüz devamsızlığı 10 günü veya toplam devamsızlığı 30 günü aşan lise öğrencileri ders başarı durumuna bakılmaksızın doğrudan sınıf tekrarına (devamsızlıktan kalma) kalır. Aşkar Yayınları Lise Koçluk Serisi (9, 10, 11 ve YKS), lise sürecinde ders başarısını ve devam disiplinini sürdürmeniz için rehberlik eder.",
    iconName: 'Award',
    highlights: [
      '9, 10, 11 ve 12. Sınıf MEB Müfredatına Uygun Ağırlıklı Ortalama',
      'Takdir (85+) ve Teşekkür (70-84.99) Belge Kriteri Hesabı',
      '50 Puan Altı Zayıf Ders ve Özürsüz 5 Gün Belge Kuralı Denetimi',
      'Özürsüz (10 Gün) ve Toplam (30 Gün) Devamsızlık Kalan Hak Analizi'
    ],
    howToUse: [
      'Üstteki sekmelerden "Ortalama", "Takdir-Teşekkür" veya "Devamsızlık Hakkı" bölümünü seçin.',
      'Sınıfınızı (9, 10, 11 veya 12. Sınıf) seçerek ders notlarınızı ve haftalık saatlerinizi girin.',
      'Devamsızlık sekmesinde özürsüz ve raporlu gün sayılarınızı yazarak kalan günlerinizi görün.',
      'Sonuç panelinden belgenizi, ortalamanızı ve sınıfınıza özel Aşkar lise koçluk kitabını inceleyin.'
    ],
    faq: [
      {
        q: 'Kaç gün devamsızlık kalınca kalınır?',
        a: 'MEB Ortaöğretim Kurumları Yönetmeliği Madde 36 uyarınca liselerde özürsüz devamsızlık sınırı 10 gün, toplam (özürlü + özürsüz) devamsızlık sınırı ise 30 gündür. Özürsüz devamsızlığı 10 günü (10.5 gün ve üzeri) veya toplam devamsızlığı 30 günü aşan öğrenciler not ortalamaları ne olursa olsun sınıfta kalır.'
      },
      {
        q: 'Özürsüz 5 günü aşan devamsızlıkta takdir ve teşekkür belgesi alınabilir mi?',
        a: 'Hayır. MEB Ortaöğretim Kurumları Yönetmeliği Madde 160 uyarınca, dönem ortalaması 70 veya 85 üzerinde olsa dahi özürsüz devamsızlığı 5 günü geçen öğrenciler takdir ya da teşekkür belgesi alamaz.'
      },
      {
        q: '1 dersi 50 altı olan lise öğrencisi takdir veya teşekkür alabilir mi?',
        a: 'Hayır. Karne genel ortalaması 95 dahi olsa, herhangi bir dersten alınan dönem puanı 50,00 altında kalırsa E-Okul sistemi öğrenciye başarı belgesi vermez.'
      },
      {
        q: 'Lise ders ortalamasında performans ve yazılı notları nasıl hesaplanır?',
        a: 'Bir dersin dönem puanı; o dersten yapılan yazılı sınavlar ile performans çalışmalarının aritmetik ortalaması alınarak belirlenir. Ardından dersin haftalık ders saatiyle çarpılarak ağırlıklı puana dönüştürülür.'
      },
      {
        q: 'Lise ortalamasını yükseltmek için en etkili yol nedir?',
        a: 'Haftalık ders saati yüksek olan Türk Dili ve Edebiyatı (5 saat), Matematik (6 saat) veya Yabancı Dil gibi derslerin notlarını yükseltmek ortalamayı en hızlı artıran stratejidir.'
      }
    ],
    relatedBookId: 'k9',
    relatedBookTitle: '9. Sınıf Liseye Başlangıç & Uyum Rehberi'
  },
  {
    id: 'altin-is',
    slug: '3-altin-is-takip',
    image: '/assets/free-covers/3-altin-is.jpg',
    name: 'Günde 3 Altın İş Takip - Tüm Sınıflar',
    shortName: '3 Altın İş Takip',
    badge: 'TÜM SINIFLAR • DİSİPLİN UYGULAMASI',
    badgeColor: '#2563eb',
    category: 'ARAÇLAR',
    metaTitle: 'Günde 3 Altın İş Takip - 5,6,7,8, Lise ve YKS İçin Disiplin Uygulaması',
    metaDescription: "5. sınıftan YKS'ye kadar her sınıf için günde sadece 3 görevle ders disiplinini kur. AŞKAR 3 Altın İş sistemi.",
    h1: 'Günde 3 Altın İş Takip - 5,6,7,8, Lise ve YKS İçin Disiplin Uygulaması',
    tagline: "Günde sadece 3 kritik görevi tamamlayarak erteleme hastalığına son verin. 5. sınıftan YKS'ye kadar seviyenize özel görevlerle ders disiplininizi kurun.",
    detailedDescription: "### 3 Altın İş Sistemi Nedir?\nGünde 3 Altın İş Sistemi, eğitim koçu ve yazar Mehmet Ali Aşkar tarafından geliştirilen, aşırı planlama ve erteleme hastalığını kökten çözen minimal fakat yüksek etkili bir ders çalışma metodolojisidir. Birçok öğrenci her gün 10 farklı ders ve onlarca görev içeren devasa çalışma listeleri hazırlar. Günün sonunda bu hedeflerin yarısı bile tamamlanamayınca öğrenci suçluluk hisseder, özgüveni zedelenir ve zamanla masaya oturmaktan kaçınmaya başlar. 3 Altın İş felsefesinin kalbinde 'Az olan çoktur' ve 'Önceliklendirme' prensibi yatar. Bu sistemde günün başlangıcında öğrenci kendine yalnızca o günün akademik gidişatını gerçekten değiştirecek 3 hayati görev seçer. Bu 3 iş bitmeden diğer hiçbir tali işle vakit kaybedilmez. Üç görevi tamamlayan öğrenci, günün zaferini ilan eder ve iç huzuruyla dinlenir.\n\n### 5. Sınıfta Nasıl Uygulanır?\nİlkokuldan ortaokula geçen 5. sınıf öğrencileri birden fazla branş öğretmeni ve artan ödev yüküyle karşılaşır. Bu kademede çocuğa saatlerce masada oturmayı dayatmak derslerden soğumasına yol açar. 5. sınıfta 3 Altın İş sistemi, temel alışkanlık kazandırma aracıdır: Birinci altın iş her gün düzenli 20 paragraf sorusuyla okuma anlama becerisini geliştirmek; ikinci altın iş 10 beceri temelli matematik problemiyle akıl yürütmeyi pekiştirmek; üçüncü altın iş ise günün ders notlarını 15 dakika gözden geçirmektir. Bu 3 görev tamamlandığında çocuğun ortaokul başarı temeli sağlam bir disiplinle atılmış olur.\n\n### LGS'de Nasıl Uygulanır?\n8. sınıf LGS hazırlığında öğrencilerin en büyük engeli dikkat dağınıklığı ve sınav kaygısıdır. LGS'de 3 Altın İş; öğrenciyi deneme netlerini doğrudan yukarı çekecek 'ameliyatlık' noktalara odaklar. Örneğin bir LGS öğrencisinin günlük altın işleri: 30 yeni nesil Türkçe paragrafı, 20 yeni nesil matematik/fen sorusu ve yapılan son denemedeki boş/yanlış soruların video çözüm analizidir. Öğrenci sadece bu 3 çekirdek görevi eksiksiz yaparak haftada 21 kritik hamleyi başarıyla tamamlar.\n\n### YKS'de Nasıl Uygulanır?\nTYT ve AYT gibi uçsuz bucaksız bir müfredatla yarışan lise ve mezun öğrencilerinde konu yetiştirememe paniği yaygındır. YKS'de 3 Altın İş sistemi, dev müfredatı yönetilebilir parçalara böler. Birinci altın iş günlük TYT paragraf ve problem rutini, ikinci altın iş hedef branştan (örneğin AYT Matematik veya AYT Edebiyat) 30-40 nitelikli soru çözümü, üçüncü altın iş ise haftalık eksik kazanım kapatma veya branş denemesi analizidir. Her gün sadece 3 altın işi tamamlayan bir YKS adayı, yılda 1000'den fazla stratejik görevi bitirerek dereceye ulaşır.",
    iconName: 'CheckCircle2',
    highlights: [
      '5. Sınıftan Mezun YKS Seviyesine Kadar Sınıfa Özel Görev Önerileri',
      'Kişiselleştirilebilir ve Düzenlenebilir 3 Günlük Altın Görev',
      'Sınıf Bazlı Bağımsız localStorage Hafıza Kaydı',
      'Son 7 Günlük Haftalık İstikrar ve Başarı Grafiği'
    ],
    howToUse: [
      'En üstteki açılır menüden sınıfınızı (5, 6, 7, 8, 9, 10, 11, 12 veya Mezun) seçin.',
      'Sınıfınıza özel otomatik gelen 3 altın görevi inceleyin veya kalem simgesine basarak kendi hedefinizi yazın.',
      'Görevi bitirdiğinizde numaralı kutucuğa tıklayarak görevinize yeşil tik atın.',
      'Haftalık grafikten son 7 gündeki istikrarınızı izleyin ve sayfa altındaki sınıfınıza özel Aşkar kitabını edinin.'
    ],
    faq: [
      {
        q: 'Günde 3 Altın İş sistemi neden geleneksel programlardan daha etkilidir?',
        a: 'Çünkü uzun ve gerçekçi olmayan listeler erteleme ve motivasyon kaybına yol açar. 3 Altın İş ise netlik sağlar; beyin 3 göreve kolayca odaklanır ve tamamlandığında yüksek tatmin ve süreklilik yaratır.'
      },
      {
        q: '3 altın iş bittikten sonra fazladan ders çalışabilir miyim?',
        a: 'Evet, kesinlikle! Sistemin amacı minimum başarı standardını garanti etmektir. 3 altın işinizi bitirdikten sonra enerjiniz varsa ek çalışmalar yapabilirsiniz; ancak yapamadığınız günlerde bile bu 3 işi tamamlamak vicdani rahatlık ve kesintisiz disiplin sağlar.'
      },
      {
        q: 'Görevlerimi gün içinde değiştirebilir miyim?',
        a: 'Gün ortasında görev değiştirmek tavsiye edilmez. Görevlerinizi bir gün önceden veya sabah masaya otururken belirlemeli ve o gün boyunca bu 3 hedefe sadık kalmalısınız.'
      },
      {
        q: 'Haftalık takip grafiği ne işe yarar?',
        a: 'Haftalık takip grafiği, son 7 gündeki başarı yüzdenizi ve sürekliliğinizi görselleştirir. Boş günlerinizi fark etmenizi ve istikrarınızı somut olarak görmenizi sağlar.'
      },
      {
        q: 'Hangi Aşkar koçluk kaynağı benim sınıfıma uygundur?',
        a: 'Uygulama içindeki sınıf seçiminize göre sistem otomatik olarak seviyenize özel Aşkar Yayınları koçluk kitabını önerir. 5, 6, 7, 8. sınıf LGS, lise ve YKS kademeleri için hazırlanan rehberler, 3 Altın İş sistemini detaylı olarak uygulamalı sunar.'
      }
    ],
    relatedBookId: 'k8',
    relatedBookTitle: "LGS'de Kendi Koçun Ol 8.Sınıf"
  },
  {
    id: 'lgs-sayac',
    slug: 'lgs-geri-sayim',
    image: '/assets/free-covers/lgs-sayac.jpg',
    name: 'LGS 2026 Geri Sayım Sayacı',
    shortName: 'LGS Geri Sayım',
    badge: '8. SINIF LGS • 15 HAZİRAN 2026',
    badgeColor: '#dc2626',
    category: 'LGS',
    metaTitle: 'LGS 2026 Geri Sayım - Kaç Gün Kaldı?',
    metaDescription: "LGS 2026'ya kaç gün kaldı? Canlı geri sayım sayacı ve motivasyon sözleri.",
    h1: 'LGS 2026 Geri Sayım - Kaç Gün Kaldı?',
    tagline: '15 Haziran 2026 MEB LGS sınavına kaç gün, saat ve saniye kaldığını canlı takip edin, günün motivasyon sözleriyle çalışma enerjinizi artırın.',
    detailedDescription: "LGS 2026 (Liselere Geçiş Sistemi) sınavı, Milli Eğitim Bakanlığı (MEB) çalışma takvimine göre 15 Haziran 2026 Pazartesi günü iki oturum halinde uygulanacaktır. Sınav maratonunda günleri ve kalan zamanı doğru yönetmek, öğrencilerin sınav stresini azaltıp çalışma disiplinini korumalarını sağlayan en önemli motivasyon kaynaklarından biridir. Canlı LGS 2026 geri sayım sayacımız sayesinde sınava kaç gün, kaç saat ve kaç dakika kaldığını anlık olarak takip edebilirsiniz.\n\nSınava hazırlık sürecinde her yeni gün, eksik kazanımları telafi etmek ve yeni nesil soru pratiğini artırmak için kıymetli bir fırsattır. 1. oturum sözel bölüm (Türkçe, İnkılap Tarihi, Din Kültürü, Yabancı Dil) 75 dakika sürerken; 2. oturum sayısal bölüm (Matematik, Fen Bilimleri) 80 dakika olarak uygulanır. Zaman planlamasını doğru yapmak, her gün düzenli paragraf ve matematik denemesi çözmek öğrencileri rakiplerinin önüne taşır. Aşkar Yayınları LGS koçluk kaynakları ve motivasyon sistemiyle sınava adım adım hazırlanın.",
    iconName: 'Timer',
    highlights: [
      '15 Haziran 2026 LGS Sınavına Canlı Geri Sayım',
      'Gün, Saat, Dakika ve Saniye Bazında Canlı Gösterge',
      'Günün İlham Verici LGS Motivasyon Sözleri',
      'MEB LGS Sözel ve Sayısal Oturum Saatleri & Süreleri'
    ],
    howToUse: [
      'Sayfa açıldığında 15 Haziran 2026 LGS sınavına kalan gün, saat, dakika ve saniyeyi canlı izleyin.',
      '"Farklı Söz Gör" butonuna basarak çalışma isteğinizi artıracak yeni motivasyon cümleleri keşfedin.',
      'Sınav oturumları tablosundan sözel ve sayısal bölüm sürelerini ve soru sayılarını inceleyin.',
      'Kalan süreyi en verimli şekilde değerlendirmek için Aşkar LGS koçluk rehberini edinin.'
    ],
    faq: [
      {
        q: '2026 LGS sınavı ne zaman yapılacak?',
        a: 'MEB takvimine göre 2026 LGS sınavı 15 Haziran 2026 Pazartesi günü uygulanacaktır.'
      },
      {
        q: 'LGS sınav oturumları saat kaçta başlar?',
        a: "1. Oturum Sözel Bölüm saat 09:30'da (75 dakika), 2. Oturum Sayısal Bölüm ise 11:30'da (80 dakika) başlar."
      },
      {
        q: 'LGS geri sayım sürecinde nasıl çalışılmalıdır?',
        a: 'Kalan günlerde her gün en az 20 yeni nesil paragraf sorusu çözülmeli, haftalık deneme analizleri yapılmalı ve yanlış çıkan kazanımlara yönelik eksik tamamlama çalışmaları yürütülmelidir.'
      }
    ],
    relatedBookId: 'k8',
    relatedBookTitle: "LGS'de Kendi Koçun Ol 8.Sınıf"
  },
  {
    id: 'tercih',
    slug: 'lgs-tercih-robotu',
    image: '/assets/free-covers/lgs-tercih.jpg',
    name: 'LGS Tercih Sihirbazı - Yüzdelik Dilime Göre Gerçek Liste',
    shortName: 'LGS Tercih Sihirbazı',
    badge: '8. SINIF LGS • 2025-2026 TERCİH DÖNEMİ',
    badgeColor: '#0284c7',
    category: 'LGS',
    metaTitle: 'LGS Tercih Sihirbazı 2025-2026 | Yüzdelik Dilime Göre Liste',
    metaDescription: 'LGS puanınızı veya yüzdelik diliminizi girin, 10 tercih listenizi sürükle-bırak ile oluşturun, Aşkar logolu resmi PDF olarak indirin ve paylaşın.',
    h1: 'LGS Tercih Sihirbazı 2025-2026 - Yüzdelik Dilime Göre Liste',
    tagline: 'LGS puanınızı veya genel yüzdelik diliminizi girin; 2024-2025 MEB resmi taban puanlarına göre Fen, Anadolu ve Sosyal Bilimler liselerini listeleyin, 10\'lu gerçek tercih listenizi oluşturup PDF olarak indirin ve paylaşın.',
    detailedDescription: "LGS (Liselere Geçiş Sistemi) tercih süreci, bir yıl boyunca verilen emeğin en doğru şekilde geleceğe taşındığı kritik bir strateji dönemidir. Tercih döneminde velilerin ve öğrencilerin en sık yaptığı hata, yalnızca 'LGS puanı' üzerinden liste hazırlamaktır. Oysa sınavın zorluk derecesi, standart sapması ve katılımcı sayısı her yıl değişkenlik gösterdiğinden, puanlar yanıltıcı olabilir. LGS tercihlerinde tek ve en sağlıklı pusula 'Genel Yüzdelik Dilim'dir.\n\nLGS tercihleri Milli Eğitim Bakanlığı (MEB) e-Okul sistemi üzerinden üç aşamalı olarak gerçekleştirilir: Yerel Yerleştirme (ikametgaha göre sınavsız), Merkezi Yerleştirme (LGS puanıyla sınavla alan okullar) ve Pansiyonlu Okullar. Merkezi yerleştirme kapsamında öğrencilere en fazla 10 lise tercih hakkı tanınır. Bu 10 tercihi planlarken uzmanların önerdiği altın kural 'Tercih Yelpazesi' taktiğidir.\n\nBaşarılı bir tercih listesi oluşturmak için 10 tercih şu şekilde dengelenmelidir:\n1. Üst / Hayal Tercihler (İlk 2-3 Tercih): Yüzdelik diliminizin %20-%30 üzerinde olan, girme şansınız düşük görünse de çok istediğiniz Fen veya prestijli Anadolu liselerine yer verin. Örneğin diliminiz %3 ise, %2-%2.5 dilimdeki okulları yazabilirsiniz.\n2. İdeal / Gerçekçi Tercihler (Orta 4-5 Tercih): Kendi yüzdelik diliminize çok yakın (diliminizin %0.5 altı ve üstü) olan liseleri bu bölüme yazın. Yerleşme ihtimalinizin en yüksek olduğu çekirdek liste burasıdır.\n3. Güvenli / Garanti Tercihler (Son 2-3 Tercih): Yüzdelik diliminizin oldukça altında (örneğin %3 dilimdeki öğrenci için %5-%6 dilimdeki okullar) yer alan kaliteli liseleri listenizin sonuna ekleyin. Bu adım, açıkta kalma riskini tamamen ortadan kaldırır.\n\nOkul seçimi yaparken yalnızca taban puanına değil, okulun yabancı dil eğitimi, üniversiteye yerleştirme başarısı, ulaşım imkanları ve fiziki donanımına da dikkat edilmelidir. Tercih süreci bir şans oyunu değil, bilinçli bir planlama sürecidir. Aşkar Yayınları koçluk kitapları, lise hayatına adım atarken öğrencilerin vizyonunu ve hedeflerini netleştirmelerine rehberlik eder.",
    iconName: 'Compass',
    highlights: [
      '2025-2026 LGS tercih dönemi için MEB taban puanı ve yüzdelik dilim karşılaştırması',
      '10\'lu Gerçek LGS Tercih Listesi Oluşturma ve Sürükle-Bırak Sıralama',
      'Aşkar Yayınları Logolu, QR Kodlu ve Tıklanabilir Linkli Resmi PDF İndirme',
      'Tercih Listesini WhatsApp ile Tek Dokunuşla Paylaşma ve Metin Kopyalama'
    ],
    howToUse: [
      'LGS sınav puanınızı (100 - 500) veya genel yüzdelik diliminizi ilgili kutucuğa girin.',
      'Yüzdelik aralık butonlarından veya şehir/okul türü filtrelerinden hedeflediğiniz liseleri listeleyin.',
      'Sol tablodaki okulların yanındaki "+ Ekle" butonuna basarak 10 tercih listenize aktarın.',
      'Sağdaki listenizi sürükle-bırak ile veya yukarı/aşağı oklarla kişisel istek sıranıza göre düzenleyin.',
      'Siyah "PDF İNDİR" butonuyla listenizi kaydedin, "PDF\'Yİ PAYLAŞ" ile dosya olarak veya "LİSTEYİ PAYLAŞ" ile metin olarak gönderin.'
    ],
    faq: [
      {
        q: 'LGS tercihlerinde puana mı yoksa yüzdelik dilime mi bakılmalıdır?',
        a: 'Kesinlikle yüzdelik dilime bakılmalıdır. Sınavın zorluk derecesi her yıl değiştiği için puanlar yükselebilir veya düşebilir; ancak yüzdelik dilim öğrencinin Türkiye sıralamasındaki yerini gösterdiği için en güvenilir ölçüttür.'
      },
      {
        q: "LGS'de kaç tercih hakkı vardır?",
        a: 'Merkezi sınav puanıyla öğrenci alan okullar için en fazla 10 tercih hakkı bulunmaktadır. Ayrıca yerel yerleştirme ile 5 ve pansiyonlu okullar için 5 tercih yapılabilir.'
      },
      {
        q: 'Yüzdelik dilimimin ne kadar üstündeki ve altındaki okulları yazmalıyım?',
        a: 'Listenizin ilk 2-3 sırasına yüzdelik diliminizin %20-30 üstündeki okulları yazabilir; son sıralara ise açıkta kalma riskini önlemek için diliminizin %40-50 altındaki güvenli okulları eklemelisiniz.'
      }
    ],
    relatedBookId: 'k8',
    relatedBookTitle: "LGS'de Kendi Koçun Ol 8.Sınıf"
  },
  {
    id: 'yks-sayac',
    slug: 'yks-geri-sayim',
    image: '/resimler/yks-sayac.jpg',
    name: 'YKS Geri Sayım Sayacı',
    shortName: 'YKS Geri Sayım',
    badge: 'ÖSYM TAKVİMİ • YKS',
    badgeColor: '#7c3aed',
    category: 'YKS',
    metaTitle: 'YKS Geri Sayım Sayacı | ÖSYM Sınav Takvimi - Aşkar Yayınları',
    metaDescription: 'ÖSYM YKS sınav tarihi açıklandığında otomatik başlayan canlı YKS geri sayım sayacı.',
    h1: 'YKS Geri Sayım Sayacı - Sınava Ne Kadar Kaldı?',
    tagline: 'ÖSYM sınav takvimi açıklandığında tarihi otomatik alan, gün-saat-dakika-saniye canlı YKS sayacı.',
    detailedDescription: 'YKS geri sayım sayacı, ÖSYM sınav takvimi açıklandığında YKS tarihini otomatik olarak alır ve sınava kalan süreyi canlı gösterir. Tarih henüz açıklanmadıysa sayaç bekleme durumunu bildirir; takvim güncellendiğinde manuel kod değişikliği gerektirmeden çalışmaya başlar.',
    iconName: 'Timer',
    highlights: [
      'ÖSYM takviminden otomatik YKS tarihi alma',
      'Gün, saat, dakika ve saniye bazında canlı sayaç',
      'Tarih açıklanmadığında bilgilendirici bekleme durumu',
      'Takvimi manuel yenileme butonu'
    ],
    howToUse: [
      'YKS tarihi ÖSYM tarafından açıklandığında sayfa tarihi otomatik olarak alır.',
      'Sayaçtan sınava kalan gün, saat, dakika ve saniyeyi takip edin.',
      'Yeni duyuru yapıldığını düşünüyorsanız Takvimi Yenile butonuna basın.'
    ],
    faq: [
      {
        q: 'YKS tarihi açıklanmadıysa sayaç çalışır mı?',
        a: 'Hayır. Tarih açıklanana kadar sayaç bekleme durumunu gösterir; ÖSYM takviminde tarih yayınlandığında otomatik çalışır.'
      },
      {
        q: 'Sayaç tarihi nereden alıyor?',
        a: 'Tarih, sunucunun ÖSYM sınav takvimini kontrol eden otomatik takvim servisinden alınır.'
      }
    ],
    relatedBookId: 'k_yks',
    relatedBookTitle: "YKS'de Kendi Koçun Ol"
  },
  {
    id: 'kap',
    slug: 'kap-analiz-paneli',
    image: '/assets/free-covers/kap-analiz.jpg',
    name: 'KAP Dijital Kazanım Analiz Paneli',
    shortName: 'KAP Analiz Paneli',
    badge: '5-8. SINIF • DİJİTAL KOÇLUK',
    badgeColor: '#ea580c',
    category: 'LGS',
    metaTitle: 'KAP Kazanım Analiz Paneli - Eksik Konuları Bul',
    metaDescription: 'KAP deneme analizini dijital yap, eksik kazanımlarını gör.',
    h1: 'KAP Kazanım Analiz Paneli - Eksik Konuları Bul',
    tagline: 'Deneme adı ve yanlış yaptığınız konuları girin, sistem tüm denemelerinizi biriktirerek en çok eksik çıkan ilk 3 kritik kazanımı anında tespit etsin.',
    detailedDescription: "KAP (Kazanım ve Akıllı Planlama), Aşkar Yayınları kurucusu ve eğitim koçu yazar Mehmet Ali Aşkar tarafından geliştirilen, öğrencilerin deneme sınavlarında yaptıkları hataları somut bir başarı basamağına dönüştüren bilimsel bir koçluk metodolojisidir. Geleneksel sınav hazırlık sürecinde öğrencilerin en büyük yanılgısı, yalnızca test çözerek veya deneme sınavına girerek netlerinin artacağını düşünmeleridir. Oysa sınav başarısının gerçek sırrı deneme çözmekte değil, çözülen denemeyi adeta bir cerrah titizliğiyle analiz etmekte saklıdır.\n\nKAP sistemi, öğrencinin sınav sonrasında yanlış yaptığı veya boş bıraktığı her soruyu müfredatın temel yapı taşı olan 'kazanım' düzeyinde teşhis eder. Soru sadece 'Matematikten 3 yanlış yaptım' şeklinde genellenmez; 'Üslü sayılarda çarpma kuralında eksiklik var' veya 'Paragrafta ana fikir çıkarımında dikkat hatası yapıldı' şeklinde somut olarak sınıflandırılır. KAP Dijital Analiz Paneli, girilen tüm denemeleri tarayıcınızın hafızasında biriktirerek öğrencinin en sık takıldığı ilk 3 kritik kazanımı anında tespit eder.\n\nTespit edilen bu eksikler için uygulanan 'Sıfır Hata Defteri' ve 3 günlük mikro-odak döngüsü sayesinde öğrenci, enerjisini zaten bildiği konulara harcamak yerine doğrudan net kaybettiren kör noktalarına odaklar. 5, 6, 7 ve 8. sınıf LGS öğrencileri için hazırlanan Aşkar KAP koçluk kitapları; haftalık çalışma blokları, hedef rozetleri ve deneme check-up çizelgeleriyle öğrencinin motivasyonunu ve çalışma disiplinini en üst seviyeye taşır. Sürekli geribildirim ve aralıklı tekrar ilkesine dayanan KAP yaklaşımı, öğrencinin sınav kaygısını özgüvene dönüştürür. Eksiklerini bilen öğrenci korkmaz; sistemli çalışan öğrenci zirveye ulaşır.",
    iconName: 'Target',
    highlights: [
      'Deneme Yanlışlarını Kazanım Bazında Kaydetme',
      'localStorage ile Cihazda Güvenli Veri Biriktirme',
      'En Çok Yanlış Çıkan İlk 3 Kritik Konu Raporu',
      'Aşkar KAP Koçluk Kitapları ile Eksik Kapatma Rehberi'
    ],
    howToUse: [
      'Sınıfınızı (5, 6, 7 veya 8. Sınıf LGS) seçin ve girdiğiniz deneme sınavının adını yazın.',
      'Ders seçerek yanlış yaptığınız konuları hazır önerilerden seçin veya doğrudan yazın.',
      '"Listeye Ekle" dedikten sonra "Denemeyi Kaydet" butonuna basarak analizi güncelleyin.',
      'Rapor alanından en çok eksik çıkan ilk 3 kazanımınızı görün ve alt kısımdaki ilgili Aşkar KAP koçluk kaynağıyla eksiklerinizi kapatın.'
    ],
    faq: [
      {
        q: 'KAP (Kazanım ve Akıllı Planlama) nedir?',
        a: 'KAP, Aşkar Yayınları tarafından geliştirilen; öğrencilerin deneme sınavlarındaki yanlış ve boş sorularını kazanım bazında analiz ederek en zayıf oldukları 3 konuyu tespit eden ve kişiye özel çalışma stratejisi sunan akıllı bir koçluk sistemidir.'
      },
      {
        q: 'Deneme analizi netleri nasıl artırır?',
        a: 'Deneme sonrasında yanlış yapılan kazanımlar belirlenmediğinde öğrenci aynı hataları sonraki sınavlarda da tekrarlar. KAP sistemiyle eksik kazanım tespit edilip hedefe yönelik 3 günlük tekrar yapıldığında kör noktalar tamamen kapanır ve netler hızla yükselir.'
      },
      {
        q: 'KAP analiz panelindeki veriler nerede saklanır?',
        a: 'Tüm verileriniz tarayıcınızın yerel hafızasında (localStorage) güvenle saklanır. İnternetiniz olmasa dahi geçmiş denemeleriniz kaybolmaz ve her yeni denemede kümülatif başarı analizi güncellenir.'
      }
    ],
    relatedBookId: 'k8',
    relatedBookTitle: "LGS'de Kendi Koçun Ol 8.Sınıf"
  },
  {
    id: 'takdir',
    slug: 'takdir-tesekkur-hesaplama',
    image: '/assets/free-covers/takdir-hesaplama.jpg',
    name: 'Takdir Teşekkür Hesaplama',
    shortName: 'Takdir Teşekkür',
    badge: '5-8. SINIF ORTAOKUL • E-OKUL',
    badgeColor: '#2563eb',
    category: 'ARAÇLAR',
    metaTitle: 'Takdir Teşekkür Hesaplama - 5, 6, 7, 8. Sınıf E-Okul Uyumlu',
    metaDescription: 'E-Okul uyumlu takdir teşekkür hesapla.',
    h1: 'Takdir Teşekkür Hesaplama - 5, 6, 7, 8. Sınıf E-Okul Uyumlu',
    tagline: '5, 6, 7 ve 8. sınıf ders notlarınızı ve haftalık ders saatlerinizi girerek E-Okul uyumlu ağırlıklı ortalamanızı ve takdir-teşekkür belge durumunuzu saniyede hesaplayın.',
    detailedDescription: "Milli Eğitim Bakanlığı (MEB) Ortaöğretim ve İlköğretim Kurumları Yönetmeliği uyarınca, öğrencilerin dönem sonunda takdir veya teşekkür belgesi alabilmesi için belirli başarı ölçütlerini sağlaması gerekmektedir. Takdir belgesi alabilmek için öğrencinin dönem ağırlıklı genel not ortalamasının en az 85,00 ve üzeri olması şarttır. Dönem ortalaması 70,00 ile 84,99 puan arasında olan öğrenciler ise teşekkür belgesi almaya hak kazanır.\n\nAncak yalnızca genel ortalamanın 85,00 veya 70,00 puanın üzerinde olması belge almak için yeterli değildir. MEB mevzuatının en kritik kuralına göre, öğrencinin hiçbir dersinin dönem sonu puanı 50,00'nin altında (yani başarısız veya zayıf) olmamalıdır. Örneğin bir öğrencinin genel not ortalaması 88,50 olsa bile, tek bir dersten aldığı not 48,00 ise E-Okul sistemi o öğrenciye takdir veya teşekkür belgesi düzenlemez. Ayrıca öğrencinin davranış puanının da olumlu olması ve disiplin cezası almamış olması zorunludur.\n\nE-Okul sisteminde dönem not ortalaması hesaplanırken her dersin haftalık ders saati devreye girer. Haftalık ders saati fazla olan Türkçe, Matematik, Fen Bilimleri gibi derslerin ortalamaya etkisi çok daha yüksektir. Bu sebeple dönem ortalamasını yükseltmek ve takdir belgesine ulaşmak isteyen öğrencilerin öncelikle haftalık saati yüksek derslere ağırlık vermesi büyük avantaj sağlar. Düzenli çalışma disiplini, haftalık planlama ve eksik analizi için Aşkar Yayınları koçluk kitapları öğrencilere rehberlik etmektedir.",
    iconName: 'Award',
    highlights: [
      '5, 6, 7 ve 8. Sınıf E-Okul Müfredatları',
      'Haftalık Ders Saati Ağırlıklı Ortalama Hesabı',
      'Takdir (85+) ve Teşekkür (70-84.99) Belge Kriteri',
      '50 Altı Zayıf Ders Yönetmelik Kontrolü'
    ],
    howToUse: [
      'Sayfanın üst kısmından ortaokul sınıfınızı (5, 6, 7 veya 8. Sınıf) seçin.',
      'Derslerinizin haftalık ders saatlerini ve dönem sonu ders notlarınızı (0-100) ilgili kutucuklara girin.',
      'Varsa seçmeli derslerinizi "Ders Ekle" butonuyla listeye dahil edin.',
      'Sistem anlık olarak E-Okul ağırlıklı ortalamanızı ve takdir ya da teşekkür belgesi kazanma durumunuzu hesaplayacaktır.'
    ],
    faq: [
      {
        q: 'Takdir belgesi kaç puanla alınır?',
        a: 'MEB yönetmeliğine göre bir öğrencinin takdir belgesi alabilmesi için dönem sonu ağırlıklı not ortalamasının en az 85,00 ve üzeri olması, ayrıca hiçbir dersinin 50,00 puanın altında kalmaması gerekmektedir.'
      },
      {
        q: '1 dersi zayıf olan (50 altı notu olan) öğrenci takdir veya teşekkür belgesi alabilir mi?',
        a: 'Hayır. Dönem ağırlıklı genel not ortalamanız 85,00 veya 70,00 üzerinde olsa dahi, karnenizde 50,00 puanın altında herhangi bir ders bulunuyorsa MEB mevzuatı gereği takdir veya teşekkür belgesi verilemez.'
      },
      {
        q: 'Teşekkür belgesi kaç puanla alınır?',
        a: 'Dönem ağırlıklı not ortalaması 70,00 ile 84,99 arasında olan ve hiçbir dersten 50,00 altı zayıf notu bulunmayan öğrenciler teşekkür belgesi almaya hak kazanır.'
      }
    ],
    relatedBookId: 'k5',
    relatedBookTitle: '5. Sınıf Koçluk & Motivasyon (Ortaokula Güçlü Bir Başlangıç)'
  },
  {
    id: 'iokbs',
    slug: 'bursluluk-puan-hesaplama-2025',
    image: '/assets/free-covers/iokbs.jpg',
    name: 'İOKBS Bursluluk Puan Hesaplama 2025 - 5,6,7. Sınıf',
    shortName: 'İOKBS Bursluluk',
    badge: '5, 6, 7. SINIF • İOKBS 2025',
    badgeColor: '#059669',
    category: 'BURSLULUK',
    metaTitle: 'İOKBS Bursluluk Puan Hesaplama 2025 - 5,6,7. Sınıf',
    metaDescription: '2025 İOKBS puanını saniyede hesapla, kaç net kaç puan eder öğren.',
    h1: 'İOKBS Bursluluk Puan Hesaplama 2025 - 5,6,7. Sınıf',
    tagline: '5, 6 ve 7. Sınıf MEB İlköğretim ve Ortaöğretim Kurumları Bursluluk Sınavı puanınızı ve toplam netinizi saniyeler içinde hesaplayın.',
    detailedDescription: "Milli Eğitim Bakanlığı (MEB) tarafından her yıl düzenlenen İlköğretim ve Ortaöğretim Kurumları Bursluluk Sınavı (İOKBS), 5, 6 ve 7. sınıf öğrencileri için toplam 100 çoktan seçmeli sorudan oluşan kapsamlı bir başarı değerlendirmesidir. Sınavda adaylara Türkçe (25 soru), Matematik (25 soru), Fen Bilimleri (25 soru) ve Sosyal Bilgiler (25 soru) olmak üzere dört temel branştan sorular yöneltilmektedir. Öğrencilere bu 100 soruyu yanıtlamaları için tek oturumda toplam 120 dakika süre tanınmaktadır.\n\nİOKBS puan hesaplamasının temel kuralı '3 yanlış 1 doğruyu götürür' prensibidir. MEB sınav kılavuzunda belirtildiği üzere, adayın her bir dersteki ham puanı (neti), ilgili dersteki doğru cevap sayısından yanlış cevap sayısının üçte birinin (1/3) çıkarılmasıyla elde edilir (Net = Doğru - Yanlış / 3). Sınavda boş bırakılan sorular net sayısını etkilemez ve puanı düşürmez. Bu nedenle öğrencilerin kesin emin olmadıkları sorularda rastgele işaretleme yapmaktan kaçınmaları başarı şanslarını önemli ölçüde artırmaktadır.\n\nHer dersin netleri çıkarıldıktan sonra MEB Ağırlıklı Standart Puan (ASP) formülü devreye girer. 5, 6 ve 7. sınıflarda Türkçe, Matematik, Fen Bilimleri ve Sosyal Bilgiler testlerinin katsayıları eşittir (ağırlık katsayısı 3 olarak uygulanır). Testlerin Türkiye geneli aritmetik ortalaması ve standart sapması hesaplanarak ham netler standart puana dönüştürülür ve nihai puan 100 ile 500 taban-tavan aralığında belirlenir. 100 net tam puan olan 500.000 puana karşılık gelir.\n\nBursluluk sınavını kazanmak için gereken taban puanlar her yıl kontenjan türüne göre değişkenlik gösterir. 'Diğer Çocuk' genel kontenjanında 5. sınıflar için yaklaşık 458 puan (88-90 net), 6. sınıflar için 452 puan (86-89 net), 7. sınıflar için ise 447 puan (85-88 net) kazanma sınırını oluşturmaktadır. Bu puana ulaşmak isteyen öğrencilerin düzenli deneme çözümü, yanlış analiz defteri tutma ve zaman yönetimi disiplinini Aşkar KAP (Koçluk & Akıllı Planlama) kaynakları ile güçlendirmeleri tavsiye edilmektedir.",
    iconName: 'Calculator',
    highlights: [
      '5, 6 ve 7. Sınıf Seçimi ve 100 Soru Analizi',
      '3 Yanlış 1 Doğruyu Götürür MEB Kuralı',
      'Eşit Katsayılı Dört Ders (Türkçe, Mat, Fen, Sosyal)',
      'Tahmini MEB Taban Puan ve Bursluluk Baraj Analizi'
    ],
    howToUse: [
      'Sayfanın üst kısmından öğrenim gördüğünüz sınıfı (5. Sınıf, 6. Sınıf veya 7. Sınıf) seçin.',
      'Türkçe (25), Matematik (25), Fen (25) ve Sosyal Bilgiler (25) derslerindeki doğru ve yanlış sayılarınızı girin.',
      'Sistem 3 yanlış 1 doğruyu çıkararak anlık netinizi ve 500 üzerinden MEB 2025 tahmini İOKBS puanınızı hesaplar.',
      'Puan sonuç kartındaki "Bu puana uygun AŞKAR KAP Kaynakları" butonuna tıklayarak netlerinizi zirveye taşıyacak koçluk kitabını inceleyin.'
    ],
    faq: [
      {
        q: '2025 İOKBS Bursluluk sınavında 5, 6 ve 7. sınıflar için kaç net yapmak gerekir?',
        a: '5, 6 ve 7. sınıf bursluluk sınavında kontenjan türüne göre taban puanlar farklılık gösterir. Genel kontenjanda (Diğer Çocuk) bursluluğu kazanabilmek için 100 soru üzerinden 5. sınıfta yaklaşık 88-91 net (458+ puan), 6. sınıfta 86-89 net (452+ puan), 7. sınıfta ise 85-88 net (447+ puan) yapmak gerekmektedir. Öğretmen çocuğu veya köy kontenjanında 80-84 net yeterli olabilmektedir.'
      },
      {
        q: 'İOKBS Bursluluk sınavında yanlışlar doğruları götürür mü?',
        a: 'Evet, MEB İOKBS mevzuatına göre 3 yanlış cevap 1 doğru cevabı götürmektedir. Her alt testteki net sayısı; Doğru Sayısı - (Yanlış Sayısı / 3) formülü ile hesaplanır. Bu sebeple emin olunmayan sorularda boş bırakmak, netlerinizin ve puanınızın düşmesini engeller.'
      },
      {
        q: 'Bursluluk puanı nasıl hesaplanır ve hangi derslerin katsayısı daha yüksektir?',
        a: '5, 6 ve 7. sınıflar için uygulanan İOKBS\'de Türkçe (25), Matematik (25), Fen Bilimleri (25) ve Sosyal Bilgiler (25) derslerinin tamamının ağırlık katsayısı eşittir (MEB kılavuzunda her dersin ağırlık katsayısı 3 olarak belirlenmiştir). Toplam net, testlerin standart sapması ve taban puan ile birleştirilerek 100-500 puan aralığında sonuç üretilir.'
      }
    ],
    relatedBookId: 'k5',
    relatedBookTitle: '5. Sınıf Koçluk & Motivasyon (Ortaokula Güçlü Bir Başlangıç)'
  },
  {
    id: 'lgs',
    slug: 'lgs-puan-hesaplama',
    image: '/assets/free-covers/lgs-hesaplama.jpg',
    name: 'LGS Puan Hesaplama 2026 & Net Sihirbazı',
    shortName: 'LGS Puan',
    badge: '8. SINIF • LGS 2026',
    badgeColor: '#ea580c',
    category: 'LGS',
    metaTitle: 'LGS Puan Hesaplama 2026 | MEB Uyumlu LGS Net ve Standart Puan Robotu - Aşkar Yayınları',
    metaDescription: '2026 MEB güncel standart sapma ve ders katsayılarına göre LGS puanınızı ve toplam netinizi anında hesaplayın. Türkçe, Matematik ve Fen 4.33 katsayı uyumlu.',
    h1: 'LGS Puan Hesaplama ve Net Sihirbazı (2026 MEB Uyumlu)',
    tagline: 'Milli Eğitim Bakanlığı güncel ders katsayıları ve standart sapma projeksiyonuyla anında LGS puanınızı öğrenin.',
    detailedDescription: 'LGS puan hesaplama motorumuz, MEB tarafından uygulanan Liselere Geçiş Sistemi sınavındaki en güncel ders katsayılarını (Türkçe, Matematik ve Fen Bilimleri için 4.33; İnkılap Tarihi, Din Kültürü ve İngilizce için 1.66) kullanarak doğru ve yanlış sayılarınızdan netlerinizi çıkarır ve tahmini standart puanınızı hesaplar.',
    iconName: 'Calculator',
    highlights: [
      '3 Yanlış 1 Doğruyu Götürür Kuralı',
      'MEB 2026 Güncel Ders Katsayıları (4.33 ve 1.66)',
      'Standart Taban Puan (195.8 Puan) Simülasyonu',
      'Anında Toplam Net ve Ders Bazlı Net Dağılımı'
    ],
    howToUse: [
      'Her dersin karşısındaki kutucuğa doğru (D) ve yanlış (Y) sayılarınızı girin.',
      'Boş bıraktığınız sorular otomatik olarak hesaba katılmaz.',
      'Sağ panelde anlık olarak toplam netiniz ve MEB tahmini LGS puanınız hesaplanacaktır.',
      'Hedeflediğiniz lisenin taban puanıyla karşılaştırmak için netlerinizi artırıp simülasyon yapabilirsiniz.'
    ],
    faq: [
      {
        q: 'LGS puanı nasıl hesaplanır?',
        a: 'Her alt test için doğru sayısından yanlış sayısının üçte biri çıkarılarak ham puan (net) bulunur. Bu netler ilgili dersin ağırlık katsayısıyla (Türkçe 4.33, Matematik 4.33, Fen 4.33, Sosyal/Din/Yabancı Dil 1.66) çarpılarak standart puanlar toplanır.'
      },
      {
        q: 'LGS\'de yanlışlar doğruları götürür mü?',
        a: 'Evet, LGS\'de 3 yanlış 1 doğruyu götürmektedir. Bu nedenle emin olunmayan sorularda rastgele işaretleme yapılmamalıdır.'
      }
    ],
    relatedBookId: 'k8',
    relatedBookTitle: "LGS'de Kendi Koçun Ol 8.Sınıf"
  },
  {
    id: 'tyt',
    slug: 'tyt-puan-hesaplama',
    image: '/assets/free-covers/tyt-hesaplama.jpg',
    name: 'YKS TYT Puan ve Net Hesaplama Robotu',
    shortName: 'YKS - TYT',
    badge: 'YKS • TYT 2026',
    badgeColor: '#2563eb',
    category: 'YKS',
    metaTitle: 'TYT Puan Hesaplama 2026 | ÖSYM Uyumlu TYT Net ve Puan Robotu - Aşkar Yayınları',
    metaDescription: 'ÖSYM güncel standartlarında 2026 YKS TYT puanınızı hesaplayın. Türkçe, Temel Matematik, Sosyal ve Fen netlerinizle tahmini yerleştirme puanınızı hemen görün.',
    h1: 'YKS - TYT Puan ve Net Hesaplama Robotu (2026 ÖSYM Uyumlu)',
    tagline: 'Temel Yeterlilik Testi (TYT) 120 soru üzerinden anlık net ve ÖSYM tahmini ham puan hesabı.',
    detailedDescription: 'Temel Yeterlilik Testi (TYT), üniversite sınavının birinci oturumudur. Türkçe (40), Sosyal Bilimler (20), Temel Matematik (40) ve Fen Bilimleri (20) olmak üzere toplam 120 sorudan oluşur. Hesaplama robotumuz 4 yanlışın 1 doğruyu götürdüğü ÖSYM kuralına göre anlık net ve tahmini TYT puanı üretir.',
    iconName: 'GraduationCap',
    highlights: [
      '120 Soru Üzerinden ÖSYM Net Hesabı',
      '4 Yanlış 1 Doğruyu Götürür Kuralı',
      'Türkçe, Matematik, Sosyal ve Fen Testleri',
      'Tahmini ÖSYM Standart Ham Puan Hesaplaması'
    ],
    howToUse: [
      'TYT Türkçe, Matematik, Sosyal ve Fen testlerindeki doğru ve yanlış sayılarınızı girin.',
      'Sistem her ders için netlerinizi ve toplam TYT netinizi anında çıkarır.',
      'ÖSYM taban katsayılarıyla hesaplanan tahmini TYT puanınızı görün.'
    ],
    faq: [
      {
        q: 'TYT baraj puanı kalktı mı?',
        a: 'Evet, YÖK kararıyla TYT ve AYT baraj puanı uygulaması kaldırılmıştır. Ancak üniversite programlarına yerleşebilmek için ilgili puan türünde puanınızın hesaplanmış olması gerekir.'
      },
      {
        q: 'TYT puanının YKS yerleştirmedeki ağırlığı nedir?',
        a: 'TYT puanı, YKS yerleştirme puanının %40\'ını oluşturur. Kalan %60\'lık etki ise AYT oturumundan gelir.'
      }
    ],
    relatedBookId: 'k_yks',
    relatedBookTitle: "YKS'de Kendi Koçun Ol"
  },
  {
    id: 'ayt',
    slug: 'ayt-puan-hesaplama',
    image: '/assets/free-covers/ayt-hesaplama.jpg',
    name: 'YKS AYT Puan Hesaplama (SAY - EA - SÖZ)',
    shortName: 'YKS - AYT',
    badge: 'YKS • AYT 2026',
    badgeColor: '#0284c7',
    category: 'YKS',
    metaTitle: 'AYT Puan Hesaplama 2026 | Sayısal, Eşit Ağırlık, Sözel Net Hesaplama - Aşkar Yayınları',
    metaDescription: '2026 YKS Alan Yeterlilik Testi (AYT) Sayısal, Eşit Ağırlık ve Sözel puanınızı hesaplayın. Matematik, Fen, Edebiyat testleri net analizi.',
    h1: 'YKS - AYT Puan ve Net Hesaplama Motoru (SAY - EA - SÖZ)',
    tagline: 'Alan Yeterlilik Testi (AYT) 80 soru üzerinden alan bazlı net ve ÖSYM standart puan simülasyonu.',
    detailedDescription: 'Alan Yeterlilik Testleri (AYT), üniversiteye yerleşmede %60 ağırlığa sahip olan ikinci oturumdur. Sayısal (Matematik + Fen), Eşit Ağırlık (Matematik + Türk Dili ve Edebiyatı-Sosyal-1) ve Sözel (Türk Dili ve Edebiyatı-Sosyal-1 + Sosyal-2) alanları için ayrı ayrı puan hesaplamanızı sağlar.',
    iconName: 'BookMarked',
    highlights: [
      'Sayısal (SAY), Eşit Ağırlık (EA) ve Sözel (SÖZ) Çoklu Alan Desteği',
      'Matematik, Fizik, Kimya, Biyoloji, Edebiyat, Tarih, Coğrafya Testleri',
      'ÖSYM 4 Yanlış 1 Doğru Kuralı',
      'TYT Katkısı ile Birleşik YKS Puan Tahmini'
    ],
    howToUse: [
      'Kendi alanınıza (Sayısal, Eşit Ağırlık veya Sözel) ait testlerin doğru ve yanlış sayılarını girin.',
      'Sistem alanınıza göre puanınızı ve netlerinizi anında hesaplayacaktır.'
    ],
    faq: [
      {
        q: 'AYT\'de kaç soru çözülmeli?',
        a: 'Adaylar kendi alanlarına göre 80 soru çözerler. Örneğin Sayısal öğrenciler Matematik (40) ve Fen (40); Eşit Ağırlık öğrencileri Matematik (40) ve Edebiyat-Sosyal-1 (40) çözer.'
      }
    ],
    relatedBookId: 'k11',
    relatedBookTitle: "11.Sınıf Lise Koçu (YKS Yolunda Sağlam Adımlar)"
  },
  {
    id: 'pomodoro',
    slug: 'pomodoro-sayaci',
    image: '/assets/free-covers/pomodoro.jpg',
    name: 'Pomodoro Çalışma Sayacı & Odaklanma Zamanlayıcısı',
    shortName: 'Pomodoro Sayacı',
    badge: 'DİSİPLİN • KOÇLUK',
    badgeColor: '#059669',
    category: 'ARAÇLAR',
    metaTitle: 'Pomodoro Çalışma Sayacı | Odaklanma ve Ders Zamanlayıcı Robotu - Aşkar Yayınları',
    metaDescription: 'Sınavlara hazırlanan öğrenciler için ücretsiz Pomodoro ders çalışma sayacı. 25 dakikalık odak seansları ve mola sistemiyle ders veriminizi katlayın.',
    h1: 'Pomodoro Çalışma Sayacı ve Odaklanma Zamanlayıcısı',
    tagline: 'Aşkar Yayınları koçluk metodolojisine uygun 25 dakika odaklanma, 5 dakika mola sistemi.',
    detailedDescription: 'Francesco Cirillo tarafından geliştirilen Pomodoro Tekniği, zihinsel yorgunluğu önleyen ve dikkati en üst düzeyde tutan dünyaca ünlü bir zaman yönetimi metodudur. Çalışma seansınızı 25 dakikalık saf odaklanma ve 5 dakikalık dinlenme bloklarına bölerek ertelemeyi sonlandırır.',
    iconName: 'Timer',
    highlights: [
      '25 Dakika Odaklanma + 5 Dakika Dinlenme Blokları',
      'Tamamlanan Pomodoro Seansı Sayacı',
      'Görsel ve Sesli Bildirim Uyarısı',
      'Ders Çalışma Disiplinini Güçlendiren Arayüz'
    ],
    howToUse: [
      'Çalışmak istediğiniz tek bir konu veya test belirleyin.',
      '"Başlat" butonuna tıklayın ve 25 dakika boyunca telefon ve bildirimlerden uzak durun.',
      'Süre bittiğinde 5 dakikalık molanızı verip zihninizi dinlendirin.',
      'Her 4 Pomodoro sonrasında 15-20 dakikalık uzun mola verin.'
    ],
    faq: [
      {
        q: 'Pomodoro tekniği neden etkilidir?',
        a: 'Beynin odaklanma süresi sınırlıdır. 25 dakikalık kısa sprintler halinde çalışmak, tükenmişliği önler ve erteleme alışkanlığını kırar.'
      }
    ],
    relatedBookId: 'k9',
    relatedBookTitle: '9.Sınıf Lise Koçu'
  },
  {
    id: 'kelime',
    slug: 'kelime-sayaci',
    image: '/assets/free-covers/kelime-analizi.jpg',
    name: 'Kelime ve Karakter Sayacı Metin Analiz Aracı',
    shortName: 'Kelime Sayacı',
    badge: 'YAZARLIK • EDİTÖRYAL',
    badgeColor: '#7c3aed',
    category: 'ARAÇLAR',
    metaTitle: 'Kelime Sayacı ve Karakter Sayımı | Hızlı Metin Analiz Aracı - Aşkar Yayınları',
    metaDescription: 'Metinlerinizin kelime, boşluklu/boşluksuz karakter, cümle, paragraf sayısı ve tahmini sesli okuma süresini anlık olarak ücretsiz analiz edin.',
    h1: 'Online Kelime Sayacı ve Metin Analiz Aracı',
    tagline: 'Ödevler, makaleler, paragraflar ve kitap taslakları için anlık istatistiksel metin analizi.',
    detailedDescription: 'Kelime ve Karakter Sayacı, öğrencilerin Türkçe kompozisyon ve ödevlerinde, yazarların kitap ve makale taslaklarında metin uzunluğunu ve okunabilirlik parametrelerini anlık olarak takip etmelerini sağlayan pratik bir analiz aracıdır.',
    iconName: 'Type',
    highlights: [
      'Kelime ve Boşluklu/Boşluksuz Karakter Sayımı',
      'Cümle ve Paragraf Analizi',
      'Ortalama Sesli ve Sessiz Okuma Süresi Projeksiyonu',
      'Tek Tıkla Metni Kopyalama ve Temizleme'
    ],
    howToUse: [
      'Analiz etmek istediğiniz metni metin alanına yazın veya yapıştırın.',
      'İstatistikler anlık olarak üst panoda güncellenecektir.',
      'Okuma süresi dakikada 200 kelime ortalamasıyla hesaplanır.'
    ],
    faq: [
      {
        q: 'Bir A4 sayfasında yaklaşık kaç kelime vardır?',
        a: 'Standart 12 punto ve 1.5 satır aralığı ile yazılmış bir A4 sayfasında ortalama 450-500 kelime yer alır.'
      }
    ],
    relatedBookId: 'k_simsek',
    relatedBookTitle: 'Şimşeğin Efendisi Tesla'
  },
  {
    id: 'kaynak',
    slug: 'apa-kaynakca-olusturucu',
    image: '/assets/free-covers/apa-kaynakca.jpg',
    name: 'APA 7 Otomatik Kaynakça ve Alıntı Oluşturucu',
    shortName: 'Kaynakça APA',
    badge: 'AKADEMİK • BİLİMSEL',
    badgeColor: '#c026d3',
    category: 'ARAÇLAR',
    metaTitle: 'APA 7 Kaynakça Oluşturucu | Otomatik Kaynakça ve Alıntı Robotu - Aşkar Yayınları',
    metaDescription: 'Kitap, bilimsel makale ve web siteleri için uluslararası APA 7 formatında standart alıntı ve kaynakça listesi hazırlama aracı.',
    h1: 'APA 7 Formatında Otomatik Kaynakça Oluşturucu',
    tagline: 'Öğrenci ödevleri, bitirme tezleri ve akademik yayınlar için hatasız APA 7 kaynakça referansı.',
    detailedDescription: 'American Psychological Association (APA 7th Edition) formatı, dünyada bilimsel araştırmalar ve akademik ödevlerde en yaygın kullanılan kaynak gösterme standardıdır. Bu araç, yazar adı, basım yılı, eser başlığı ve yayıncı bilgilerini uluslararası kurallara göre hatasız biçimlendirir.',
    iconName: 'BookOpenText',
    highlights: [
      'Kitap, Makale ve Web Sitesi Kaynakça Desteği',
      'Metin İçi Alıntı (In-text Citation) Gösterimi',
      'Kaynakça Listesi (Reference List) İtalik ve Noktalama Kuralları',
      'Tek Tıkla Panoya Kopyalama Özelliği'
    ],
    howToUse: [
      'Kaynak türünü seçin (Kitap, Makale veya Web Sitesi).',
      'Yazar, yıl, eser başlığı ve yayıncı bilgilerini ilgili alanlara girin.',
      'Oluşan kaynakça metnini kopyalayıp ödevinizin sonuna ekleyin.'
    ],
    faq: [
      {
        q: 'APA 7 ile APA 6 arasındaki fark nedir?',
        a: 'APA 7\'de kitap kaynaklarında yayın yeri (şehir/ülke) belirtme zorunluluğu kaldırılmış, 20 yazara kadar isim listeleme ve DOI/URL bağlantı standartları sadeleştirilmiştir.'
      }
    ],
    relatedBookId: 'k_atom',
    relatedBookTitle: 'Atomun Kalbi Rutherford'
  },
  {
    id: 'cocuk',
    slug: 'sevimli-deniz-alti-kasifleri',
    image: '/assets/free-covers/cocuk-deniz-alti.jpg',
    name: 'Sevimli Deniz Altı Kaşifleri İnteraktif Çocuk Oyunu',
    shortName: 'Çocuk Uygulaması',
    badge: 'ÇOCUK DÜNYASI • ÜCRETSİZ',
    badgeColor: '#059669',
    category: 'ÇOCUK',
    metaTitle: 'Sevimli Deniz Altı Kaşifleri | Ücretsiz Çocuk Eğitici Oyunu - Aşkar Yayınları',
    metaDescription: 'Aşkar Yayınları\'nın tüm çocuklara özel ücretsiz armağanı! Mor Ahtapot Lili ve Tosbiş ile deniz altı keşfi, boyama ve eğitici mini oyunlar.',
    h1: 'Sevimli Deniz Altı Kaşifleri İnteraktif Çocuk Uygulaması',
    tagline: 'Çocukların çevre bilincini, hayal gücünü ve problem çözme yeteneğini geliştiren özel interaktif oyun.',
    detailedDescription: 'Aşkar Yayınları Çocuk Kitaplığı serimizin sevilen kahramanları Mor Ahtapot Lili ve Yeşil Kaplumbağa Tosbiş ile çocukların dijital dünyada güvenle vakit geçirebilecekleri, şiddet içermeyen, eğitici ve eğlenceli web uygulaması.',
    iconName: 'Gamepad2',
    highlights: [
      'Aşkar Yayınları\'ndan Tüm Çocuklara Tamamen Ücretsiz Armağan',
      'İnteraktif Deniz Canlıları Boyama ve Sesli Eğlence',
      'Doğa Sevgisi ve Deniz Temizliği Değerler Eğitimi',
      'Kurulum Gerektirmez, Tarayıcıda Doğrudan Çalışır'
    ],
    howToUse: [
      '"Uygulamayı Aç" butonuna tıklayarak tam ekran interaktif deneyimi başlatın.',
      'Tablet veya bilgisayar üzerinden çocuğunuzla birlikte keşfe çıkın.'
    ],
    faq: [
      {
        q: 'Uygulama ücretli mi?',
        a: 'Hayır, Sevimli Deniz Altı Kaşifleri web uygulaması Aşkar Yayınları tarafından tüm çocuklara ve ailelere ücretsiz olarak sunulmaktadır.'
      }
    ],
    relatedBookId: 'cocuk_1',
    relatedBookTitle: 'Sevimli Deniz Altı Kaşifleri Boyama Kitabı'
  }
];

export const getToolBySlug = (slug: string): ToolDefinition | undefined => {
  return TOOLS_DATA.find((t) => t.slug === slug || t.id === slug);
};

export const getToolById = (id: ToolTab): ToolDefinition | undefined => {
  return TOOLS_DATA.find((t) => t.id === id);
};
