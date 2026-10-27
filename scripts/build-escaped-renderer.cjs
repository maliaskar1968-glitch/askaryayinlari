const fs = require('fs');

function esc(str) {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : c;
  }).join('');
}

const cards = [
  // --- ORTAOKUL CARDS (All 6) ---
  {
    id: 'ortaokul_matematik',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/matematik-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/matematik-1x1.jpg',
    badge: 'LGS & ORTAOKUL REHBERİ',
    title: 'MATEMATİK',
    subtitle: '5-8. SINIF & LGS • YENİ NESİL BECERİ TEMELLİ',
    steps: [
      'KAZANIM & TEMEL TANIMLAR - Temel formülleri ve işlem mantığını kendi cümlenle anlat.',
      'YENİ NESİL SORU STRATEJİSİ - Şekil, tablo ve grafik okuma sorularında verilenlerin altını çiz.',
      'YANLIŞ ANALİZİ VE TEKRAR - Yapamadığın sorulardan yanlış defteri tut ve tekrar çöz.'
    ],
    bgStart: '#031338',
    bgMid: '#1e3a8a',
    bgEnd: '#2563eb',
    accent: '#fbbf24',
    symbol: '\\u2211' // ∑
  },
  {
    id: 'ortaokul_fen',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/fen-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/fen-1x1.jpg',
    badge: 'LGS & ORTAOKUL FEN',
    title: 'FEN BİLİMLERİ',
    subtitle: 'DENEY • HİPOTEZ • DEĞİŞKENLER • MEVSİMLER & DNA',
    steps: [
      'KAVRAM VE GÜNLÜK HAYAT - Kavramları günlük hayattaki gözlem ve olaylarla eşleştir.',
      'DENEY VE DEĞİŞKEN ANALİZİ - Sabit tutulan (kontrol), bağımsız ve bağımlı değişkeni belirle.',
      'GÖRSEL VE ŞEMA ÇİZİMİ - Şema, döngü ve modelleri kendin çizerek neden-sonuç kur.'
    ],
    bgStart: '#022329',
    bgMid: '#064e52',
    bgEnd: '#0d9488',
    accent: '#34d399',
    symbol: '\\u2697' // ⚗
  },
  {
    id: 'ortaokul_turkce',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/turkce-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/turkce-1x1.jpg',
    badge: 'LGS & ORTAOKUL TÜRKÇE',
    title: 'TÜRKÇE',
    subtitle: 'PARAGRAF • SÖZCÜKTE ANLAM • DİL BİLGİSİ • MANTIK & MUHAKEME',
    steps: [
      'GÜNLÜK PARAGRAF RUTİNİ - Her gün aksatmadan 20-25 yeni nesil paragraf ve mantık sorusu çöz.',
      'KÖK VE VURGU ANALİZİ - Önce soru kökünü oku, anahtar kelimenin ve istenenin altını çiz.',
      'ÇELDİRİCİLERİ ELİNE AL - Yanlış şıkların neden yanlış olduğunu görerek doğruya git.'
    ],
    bgStart: '#2d0815',
    bgMid: '#701a2b',
    bgEnd: '#b91c1c',
    accent: '#fb923c',
    symbol: '\\u00B6' // ¶
  },
  {
    id: 'ortaokul_sosyal',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/sosyal-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/sosyal-1x1.jpg',
    badge: 'LGS & ORTAOKUL SOSYAL',
    title: 'SOSYAL BİLGİLER',
    subtitle: 'İNKILAP TARİHİ • COĞRAFYA • VATANDAŞLIK • HARİTA & KRONOLOJİ',
    steps: [
      'ZAMAN ÇİZGİSİ VE KRONOLOJİ - Olayların sıralamasını ve neden-sonuç zincirini şemalaştır.',
      'HARİTA VE GÖRSEL OKUMA - Coğrafi ve tarihi haritaları dikkatle inceleyerek çıkarım yap.',
      'KAVRAM VE İLKE BAĞLANTISI - Tarihsel terimleri Atatürk ilkeleri ve temel belgelerle pekiştir.'
    ],
    bgStart: '#271705',
    bgMid: '#63340b',
    bgEnd: '#b45309',
    accent: '#f59e0b',
    symbol: '\\u25C8' // ◈
  },
  {
    id: 'ortaokul_ingilizce',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/ingilizce-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/ingilizce-1x1.jpg',
    badge: 'LGS & ORTAOKUL İNGİLİZCE',
    title: 'İNGİLİZCE',
    subtitle: 'VOCABULARY • READING • DIALOGUE • DAILY PHRASES',
    steps: [
      'KELİME DEFTERİ VE KARTLAR - Yeni ünite kelimelerini aralıklı tekrar ve flashcard ile öğren.',
      'CÜMLE İÇİNDE KULLAN - Ezberlemek yerine her hedef kelimeyle kendi özgün cümleni yaz.',
      'DİYALOG VE GRAFİK SORULARI - LGS diyalog ve anket/grafik sorularındaki kalıpları analiz et.'
    ],
    bgStart: '#0a0e36',
    bgMid: '#1e2875',
    bgEnd: '#3730a3',
    accent: '#38bdf8',
    symbol: '\\u2726' // ✦
  },
  {
    id: 'ortaokul_din',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/din-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/din-1x1.jpg',
    badge: 'LGS & ORTAOKUL DİN KÜLTÜRÜ',
    title: 'DİN KÜLTÜRÜ',
    subtitle: 'KADER İNANCI • ZEKAT • HAC • AHLAK & PEYGAMBER KISSALARI',
    steps: [
      'KAVRAM VE TANIM HAKİMİYETİ - Kader, kaza, tevekkül, sadaka gibi ana kavramları net kavra.',
      'AYET VE HADİS ANALİZİ - Verilen ayetin hangi konuya ve temel mesaja işaret ettiğini bul.',
      'GÜNLÜK HAYATLA İLİŞKİ - Değerleri ve ahlaki ilkeleri somut olaylarla ilişkilendir.'
    ],
    bgStart: '#052119',
    bgMid: '#064e3b',
    bgEnd: '#047857',
    accent: '#a7f3d0',
    symbol: '\\u2731' // ✱
  },

  // --- LISE CARDS (6 total: Mat, Geo, Fiz, Kimya, Biyo, Edebiyat) ---
  {
    id: 'lise_matematik',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-matematik-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-matematik-1x1.jpg',
    badge: 'SAYISAL & EŞİT AĞIRLIK',
    title: 'LİSE MATEMATİK',
    subtitle: 'TYT & AYT • FONKSİYON • TÜREV • İNTEGRAL',
    steps: [
      'TEMEL KAVRAM & MANTIK - Formülü ezberleme; ispatını ve mantığını kendi cümlenle açıkla.',
      'AŞAMALI SORU PRATİĞİ - 10 kolay, 10 orta ve 5 zor soru ile kademeli ilerle.',
      'YANLIŞ DEFTERİ & SÜRE - Yapamadığın soruları haftalık analiz et ve süre tutarak çöz.'
    ],
    bgStart: '#050c26',
    bgMid: '#0f2b6b',
    bgEnd: '#1d4ed8',
    accent: '#38bdf8',
    symbol: '\\u222B' // ∫
  },
  {
    id: 'lise_geometri',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-geometri-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-geometri-1x1.jpg',
    badge: 'TYT & AYT GEOMETRİ',
    title: 'LİSE GEOMETRİ',
    subtitle: 'ÜÇGEN • ÇEMBER • ANALİTİK • KATI CİSİMLER',
    steps: [
      'GÖRME BECERİSİ & ÇİZİM - Sorudaki şekli kendin büyük çizip verilen açı ve kenarları yaz.',
      'İSPAT VE YARDIMCI ÇİZGİ - Yardımcı çizgiyi rastgele değil; benzerlik ve diklik için çek.',
      'GÜNLÜK 15 SORU RUTİNİ - Geometride süreklilik esastır; her gün aksatmadan soru çöz.'
    ],
    bgStart: '#021b24',
    bgMid: '#034e56',
    bgEnd: '#059669',
    accent: '#34d399',
    symbol: '\\u0394' // Δ
  },
  {
    id: 'lise_fizik',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-fizik-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-fizik-1x1.jpg',
    badge: 'TYT & AYT SAYISAL',
    title: 'LİSE FİZİK',
    subtitle: 'MEKANİK • ELEKTRİK & MANYETİZMA • OPTİK & DALGA',
    steps: [
      'KAVRAM YANILGISINI YOK ET - Olayı zihninde canlandır ve fiziksel modelini kendi cümlenle kur.',
      'SERBEST CİSİM DİYAGRAMI - Kuvvet yönlerini ve büyüklüklerini şekil üzerine netçe çiz.',
      'DENEY VE GÜNLÜK HAYAT - Formülün hangi varsayım ve koşullarda geçerli olduğunu kavra.'
    ],
    bgStart: '#13092b',
    bgMid: '#3b0764',
    bgEnd: '#6d28d9',
    accent: '#c084fc',
    symbol: '\\u03A9' // Ω
  },
  {
    id: 'lise_kimya',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-kimya-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-kimya-1x1.jpg',
    badge: 'TYT & AYT SAYISAL',
    title: 'LİSE KİMYA',
    subtitle: 'PERİYODİK SİSTEM • MOL • KİMYASAL TEPKİME • ORGANİK',
    steps: [
      'KAVRAM VE TEPKİME DENKLİĞİ - Atom, mol ve yük korunumunu küçük şemalarla pekiştir.',
      'MOL VE HESAPLAMA ADIMLARI - Sayısal problemlerde birimleri en başta yaz ve basamaklandır.',
      'ORGANİK KİMYA VE GRAFİKLER - Fonksiyonel grupları ve tepkime mekanizmalarını görselleştir.'
    ],
    bgStart: '#021c2d',
    bgMid: '#034c5c',
    bgEnd: '#0284c7',
    accent: '#38bdf8',
    symbol: '\\u269B' // ⚛
  },
  {
    id: 'lise_biyoloji',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-biyoloji-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-biyoloji-1x1.jpg',
    badge: 'TYT & AYT SAYISAL',
    title: 'LİSE BİYOLOJİ',
    subtitle: 'HÜCRE & SİSTEMLER • KALITIM • EKOLOJİ • BİYOTEKNOLOJİ',
    steps: [
      'SÜREÇ VE AKIŞ ŞEMALARI - Fotosentez, solunum ve bölünme evrelerini basamak basamak çiz.',
      'KAVRAM KARŞILAŞTIRMA - Benzer terimler arasındaki farkları tablo ve Venn şemasıyla ayır.',
      'DENEY VE GRAFİK YORUMU - Biyoloji sorularında enzim/substrat grafiklerini dikkatle oku.'
    ],
    bgStart: '#032115',
    bgMid: '#064e3b',
    bgEnd: '#059669',
    accent: '#34d399',
    symbol: '\\u2740' // ❀
  },
  {
    id: 'lise_turk_dili_edebiyat',
    path: 'C:/askar-yayinlari/public/assets/ders-kartlari/lise/lise-turk-dili-edebiyat-1x1.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/ders-kartlari/lise/lise-turk-dili-edebiyat-1x1.jpg',
    badge: 'AYT EŞİT AĞIRLIK & SÖZEL',
    title: 'TÜRK DİLİ & EDEBİYAT',
    subtitle: 'DİVAN • TANZİMAT • CUMHURİYET • ESER-YAZAR-DÖNEM',
    steps: [
      'ESER - YAZAR - DÖNEM HAFIZASI - Dönemlerin genel zihniyetini ve anahtar eserlerini kodla.',
      'ŞİİR VE METİN ÇÖZÜMLEME - Nazım biçimi, ölçü, ahenk ve edebi sanatları metin üzerinde gör.',
      'GÜNLÜK PARAGRAF VE ANLAM - AYT edebiyatın temelini oluşturan anlam sorularını aksatma.'
    ],
    bgStart: '#2c0612',
    bgMid: '#73132d',
    bgEnd: '#be123c',
    accent: '#fbbf24',
    symbol: '\\u270E' // ✎
  }
];

let csharpMethods = '';

cards.forEach((c, idx) => {
  const stepsArray = c.steps.map(s => `"${esc(s)}"`).join(', ');
  csharpMethods += `
    public static void RenderCard_${idx}() {
        string outputPath = @"${c.path.replace(/\//g, '\\\\')}";
        string distPath = @"${c.distPath.replace(/\//g, '\\\\')}";
        string badge = "${esc(c.badge)}";
        string title = "${esc(c.title)}";
        string subtitle = "${esc(c.subtitle)}";
        string[] steps = new string[] { ${stepsArray} };
        string bgStart = "${c.bgStart}";
        string bgMid = "${c.bgMid}";
        string bgEnd = "${c.bgEnd}";
        string accent = "${c.accent}";
        string symbol = "${c.symbol}";

        RenderCard(outputPath, badge, title, subtitle, steps, bgStart, bgMid, bgEnd, accent, symbol);
        
        try {
            string dir = Path.GetDirectoryName(distPath);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            File.Copy(outputPath, distPath, true);
        } catch {}
    }
`;
});

const renderAllCalls = cards.map((_, idx) => `        RenderCard_${idx}();`).join('\n');

const template = `using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class CardRenderer {
${csharpMethods}

    public static void RenderAll() {
${renderAllCalls}
    }

    public static void RenderCard(
        string outputPath,
        string categoryBadge,
        string subjectTitle,
        string subtitle,
        string[] strategySteps,
        string bgStartHex,
        string bgMidHex,
        string bgEndHex,
        string accentColorHex,
        string mathSymbol
    ) {
        int width = 900;
        int height = 900;

        using (Bitmap bmp = new Bitmap(width, height, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

                Color bgStart = ColorTranslator.FromHtml(bgStartHex);
                Color bgMid = ColorTranslator.FromHtml(bgMidHex);
                Color bgEnd = ColorTranslator.FromHtml(bgEndHex);
                Color accent = ColorTranslator.FromHtml(accentColorHex);

                // 1. Background Gradient
                Rectangle fullRect = new Rectangle(0, 0, width, height);
                using (LinearGradientBrush bgBrush = new LinearGradientBrush(fullRect, bgStart, bgEnd, 45f)) {
                    ColorBlend blend = new ColorBlend();
                    blend.Colors = new Color[] { bgStart, bgMid, bgEnd };
                    blend.Positions = new float[] { 0f, 0.45f, 1f };
                    bgBrush.InterpolationColors = blend;
                    g.FillRectangle(bgBrush, fullRect);
                }

                // 2. High-Tech Grid Pattern
                using (Pen gridPen = new Pen(Color.FromArgb(20, accent.R, accent.G, accent.B), 1.5f)) {
                    for (int x = 60; x < width; x += 120) {
                        g.DrawLine(gridPen, x, 0, x, height);
                    }
                    for (int y = 60; y < height; y += 120) {
                        g.DrawLine(gridPen, 0, y, width, y);
                    }
                }

                // 3. Ambient Glowing Orbs
                using (GraphicsPath path = new GraphicsPath()) {
                    path.AddEllipse(width - 320, -80, 420, 420);
                    using (PathGradientBrush pgb = new PathGradientBrush(path)) {
                        pgb.CenterColor = Color.FromArgb(75, accent);
                        pgb.SurroundColors = new Color[] { Color.FromArgb(0, accent) };
                        g.FillPath(pgb, path);
                    }
                }
                using (GraphicsPath path2 = new GraphicsPath()) {
                    path2.AddEllipse(-60, height - 360, 460, 460);
                    using (PathGradientBrush pgb2 = new PathGradientBrush(path2)) {
                        pgb2.CenterColor = Color.FromArgb(55, accent);
                        pgb2.SurroundColors = new Color[] { Color.FromArgb(0, accent) };
                        g.FillPath(pgb2, path2);
                    }
                }

                // 4. Large Watermark Math/Science Symbol in background
                using (Font symFont = new Font("Segoe UI Symbol", 190, FontStyle.Bold))
                using (SolidBrush symBrush = new SolidBrush(Color.FromArgb(24, 255, 255, 255))) {
                    g.DrawString(mathSymbol, symFont, symBrush, width - 330, 40);
                }

                // 5. Category Badge Pill (Top-Left)
                int badgeX = 64;
                int badgeY = 64;
                int badgeW = 340;
                int badgeH = 46;
                using (GraphicsPath badgePath = GetRoundedRect(new Rectangle(badgeX, badgeY, badgeW, badgeH), 23)) {
                    using (SolidBrush badgeBg = new SolidBrush(Color.FromArgb(210, 15, 23, 42))) {
                        g.FillPath(badgeBg, badgePath);
                    }
                    using (Pen badgeBorder = new Pen(Color.FromArgb(180, accent), 2f)) {
                        g.DrawPath(badgeBorder, badgePath);
                    }
                }
                // Glowing dot
                using (SolidBrush dotBrush = new SolidBrush(accent)) {
                    g.FillEllipse(dotBrush, badgeX + 16, badgeY + 16, 14, 14);
                }
                using (Font badgeFont = new Font("Segoe UI", 13, FontStyle.Bold))
                using (SolidBrush badgeText = new SolidBrush(Color.White)) {
                    g.DrawString(categoryBadge, badgeFont, badgeText, badgeX + 40, badgeY + 12);
                }

                // 6. Main Subject Title (Dynamic Font Size to NEVER clip!)
                float titleFontSize = 54f;
                using (Font probeFont = new Font("Segoe UI", titleFontSize, FontStyle.Bold)) {
                    SizeF measured = g.MeasureString(subjectTitle, probeFont);
                    while (measured.Width > 740 && titleFontSize > 34f) {
                        titleFontSize -= 2f;
                        measured = g.MeasureString(subjectTitle, new Font("Segoe UI", titleFontSize, FontStyle.Bold));
                    }
                }

                using (Font titleFont = new Font("Segoe UI", titleFontSize, FontStyle.Bold)) {
                    using (SolidBrush shadowBrush = new SolidBrush(Color.FromArgb(200, 0, 0, 0))) {
                        g.DrawString(subjectTitle, titleFont, shadowBrush, 66, 136);
                    }
                    using (SolidBrush titleBrush = new SolidBrush(Color.White)) {
                        g.DrawString(subjectTitle, titleFont, titleBrush, 64, 134);
                    }
                }

                // 7. Subtitle / Focus Topics Banner
                using (Font subFont = new Font("Segoe UI", 16, FontStyle.Bold))
                using (SolidBrush subBrush = new SolidBrush(accent)) {
                    g.DrawString(subtitle, subFont, subBrush, 68, 226);
                }

                // 8. Main Glassmorphic Container for Strategy Steps
                int glassX = 60;
                int glassY = 275;
                int glassW = 780;
                int glassH = 510;
                using (GraphicsPath glassPath = GetRoundedRect(new Rectangle(glassX, glassY, glassW, glassH), 28)) {
                    using (SolidBrush glassBg = new SolidBrush(Color.FromArgb(160, 10, 15, 30))) {
                        g.FillPath(glassBg, glassPath);
                    }
                    using (Pen glassPen = new Pen(Color.FromArgb(80, 255, 255, 255), 1.5f)) {
                        g.DrawPath(glassPen, glassPath);
                    }
                }

                // Header inside Glass Card
                using (Font cardHeadFont = new Font("Segoe UI", 15, FontStyle.Bold))
                using (SolidBrush cardHeadBrush = new SolidBrush(Color.FromArgb(235, 255, 255, 255))) {
                    g.DrawString("${esc('DERECE YAPANLARIN ÇALIŞMA STRATEJİSİ')}", cardHeadFont, cardHeadBrush, glassX + 32, glassY + 28);
                }
                using (Pen divPen = new Pen(Color.FromArgb(45, 255, 255, 255), 1f)) {
                    g.DrawLine(divPen, glassX + 32, glassY + 64, glassX + glassW - 32, glassY + 64);
                }

                // 3 Strategy Pill Rows
                int itemY = glassY + 84;
                int itemH = 120;
                for (int i = 0; i < Math.Min(3, strategySteps.Length); i++) {
                    int rowY = itemY + (i * 132);
                    Rectangle rowRect = new Rectangle(glassX + 28, rowY, glassW - 56, itemH);

                    using (GraphicsPath rowPath = GetRoundedRect(rowRect, 18)) {
                        using (SolidBrush rowBg = new SolidBrush(Color.FromArgb(80, 18, 28, 55))) {
                            g.FillPath(rowBg, rowPath);
                        }
                        using (Pen rowBorder = new Pen(Color.FromArgb(60, accent), 1.5f)) {
                            g.DrawPath(rowBorder, rowPath);
                        }
                    }

                    // Number Icon Badge
                    int numBoxX = rowRect.X + 20;
                    int numBoxY = rowRect.Y + 24;
                    int numBoxSize = 72;
                    using (GraphicsPath numPath = GetRoundedRect(new Rectangle(numBoxX, numBoxY, numBoxSize, numBoxSize), 16)) {
                        using (LinearGradientBrush numBg = new LinearGradientBrush(
                            new Rectangle(numBoxX, numBoxY, numBoxSize, numBoxSize),
                            Color.FromArgb(240, accent),
                            Color.FromArgb(190, bgMid),
                            45f)) {
                            g.FillPath(numBg, numPath);
                        }
                    }

                    using (Font numFont = new Font("Segoe UI", 26, FontStyle.Bold))
                    using (SolidBrush numText = new SolidBrush(Color.White)) {
                        string stepNum = (i + 1).ToString("D2");
                        g.DrawString(stepNum, numFont, numText, numBoxX + 11, numBoxY + 14);
                    }

                    // Step Text (Title & Short description)
                    string fullStep = strategySteps[i];
                    string stepHeading = "";
                    string stepBody = fullStep;

                    if (fullStep.Contains(" - ")) {
                        var parts = fullStep.Split(new string[] { " - " }, StringSplitOptions.None);
                        stepHeading = parts[0];
                        stepBody = parts[1];
                    } else if (i == 0) {
                        stepHeading = "${esc('KAVRAM VE TEMEL MANTIK')}";
                    } else if (i == 1) {
                        stepHeading = "${esc('SORU TİPLERİ VE PRATİK')}";
                    } else {
                        stepHeading = "${esc('YANLIŞ ANALİZİ VE TEKRAR')}";
                    }

                    using (Font hFont = new Font("Segoe UI", 16, FontStyle.Bold))
                    using (SolidBrush hBrush = new SolidBrush(Color.FromArgb(255, 255, 255, 255))) {
                        g.DrawString(stepHeading, hFont, hBrush, numBoxX + numBoxSize + 24, numBoxY + 6);
                    }

                    using (Font bFont = new Font("Segoe UI", 15, FontStyle.Regular))
                    using (SolidBrush bBrush = new SolidBrush(Color.FromArgb(220, 230, 245))) {
                        Rectangle textBounds = new Rectangle(numBoxX + numBoxSize + 24, numBoxY + 38, rowRect.Width - numBoxSize - 50, 60);
                        StringFormat sf = new StringFormat();
                        sf.Trimming = StringTrimming.EllipsisWord;
                        g.DrawString(stepBody, bFont, bBrush, textBounds, sf);
                    }
                }

                // 9. Bottom Footer Bar
                using (Font footerFont = new Font("Segoe UI", 13, FontStyle.Bold))
                using (SolidBrush footerBrush = new SolidBrush(Color.FromArgb(200, 255, 255, 255))) {
                    g.DrawString("${esc('AŞKAR YAYINLARI • BAŞARI VE GELİŞİM REHBERİ')}", footerFont, footerBrush, 64, 824);
                }

                using (Font tagFont = new Font("Segoe UI", 12, FontStyle.Bold))
                using (SolidBrush tagBrush = new SolidBrush(accent)) {
                    g.DrawString("${esc('2026 GÜNCEL MEB & ÖSYM')}", tagFont, tagBrush, width - 290, 824);
                }

                // Save as High Quality JPEG
                ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);
                System.Drawing.Imaging.Encoder myEncoder = System.Drawing.Imaging.Encoder.Quality;
                EncoderParameters myEncoderParameters = new EncoderParameters(1);
                EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 95L);
                myEncoderParameters.Param[0] = myEncoderParameter;

                string dir = Path.GetDirectoryName(outputPath);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) {
                    Directory.CreateDirectory(dir);
                }

                bmp.Save(outputPath, jpgEncoder, myEncoderParameters);
            }
        }
    }

    private static GraphicsPath GetRoundedRect(Rectangle bounds, int radius) {
        int diameter = radius * 2;
        Size size = new Size(diameter, diameter);
        Rectangle arc = new Rectangle(bounds.Location, size);
        GraphicsPath path = new GraphicsPath();

        if (radius == 0) {
            path.AddRectangle(bounds);
            return path;
        }

        path.AddArc(arc, 180, 90);
        arc.X = bounds.Right - diameter;
        path.AddArc(arc, 270, 90);
        arc.Y = bounds.Bottom - diameter;
        path.AddArc(arc, 0, 90);
        arc.X = bounds.Left;
        path.AddArc(arc, 90, 90);
        path.CloseFigure();
        return path;
    }

    private static ImageCodecInfo GetEncoder(ImageFormat format) {
        ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
        foreach (ImageCodecInfo codec in codecs) {
            if (codec.FormatID == format.Guid) {
                return codec;
            }
        }
        return null;
    }
}
`;

fs.writeFileSync('C:/askar-yayinlari/scripts/CardRenderer.cs', template);
console.log('Successfully written CardRenderer.cs for all cards including Kimya, Biyoloji, Edebiyat!');
