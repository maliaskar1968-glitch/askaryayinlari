const fs = require('fs');
const path = require('path');

function esc(str) {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : c;
  }).join('');
}

const cards = [
  // 1. İOKBS Bursluluk
  {
    id: 'iokbs',
    path: 'C:/askar-yayinlari/public/assets/free-covers/iokbs.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/free-covers/iokbs.jpg',
    badge: '5, 6, 7. SINIF • İOKBS 2025',
    title: 'İOKBS BURSLULUK',
    subtitle: '100 SORU • 120 DAKİKA • 3 YANLIŞ 1 DOĞRUYU GÖTÜRÜR',
    steps: [
      '5, 6 VE 7. SINIF PUAN MOTORU - Türkçe, Mat, Fen ve Sosyal derslerinin standart sapmalı net hesabı.',
      '3 YANLIŞ 1 DOĞRU KURALI - MEB bursluluk formülüyle anlık net hesabı ve 500 üzerinden puan çıktısı.',
      'GÜNCEL TABAN VE BARAJ ANALİZİ - Kontenjan türüne göre tahmini kazanma barajı ve koçluk önerileri.'
    ],
    bgStart: '#022319',
    bgMid: '#064e3b',
    bgEnd: '#059669',
    accent: '#fbbf24',
    symbol: '\\u2605' // ★
  },
  // 2. Kelime Analizi
  {
    id: 'kelime',
    path: 'C:/askar-yayinlari/public/assets/free-covers/kelime-analizi.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/free-covers/kelime-analizi.jpg',
    badge: 'EDİTÖR & AKADEMİK ARAÇ',
    title: 'KELİME & METİN ANALİZİ',
    subtitle: 'SÖZCÜK • KARAKTER • OKUMA SÜRESİ • PARAGRAF DÜZEYİ',
    steps: [
      'ANLIK SÖZCÜK VE KARAKTER HESABI - Boşluklu ve boşluksuz net vuruş sayısını saniyede ölç.',
      'OKUMA VE KONUŞMA SÜRESİ - Metnin tahmini seslendirme ve okuma süresini anında öğren.',
      'ZENGİN METİN İSTATİSTİĞİ - Cümle ve paragraf dağılımıyla içerik akışını optimize et.'
    ],
    bgStart: '#0c0f38',
    bgMid: '#231955',
    bgEnd: '#4338ca',
    accent: '#38bdf8',
    symbol: '\\u270E' // ✎
  },
  // 3. APA Kaynakça
  {
    id: 'kaynak',
    path: 'C:/askar-yayinlari/public/assets/free-covers/apa-kaynakca.jpg',
    distPath: 'C:/askar-yayinlari/dist/assets/free-covers/apa-kaynakca.jpg',
    badge: 'AKADEMİK FORMATLAMA • APA 7',
    title: 'APA KAYNAKÇA SİHİRBAZI',
    subtitle: 'KİTAP • MAKALE • TEZ • WEB KAYNAĞI • İÇ ALINTI',
    steps: [
      'KUSURSUZ APA 7 REFERANS ÇIKTISI - Yazar, yıl, başlık ve yayıncı bilgilerini otomatik formatla.',
      'PARANTEZ İÇİ VE METİN İÇİ ALINTI - Doğrudan ve dolaylı alıntılarda doğru atıf kalıbını al.',
      'KAYNAKÇA LİSTESİ DIŞA AKTARMA - Tek tıkla kopyala ve akademik ödev/makalene hazır ekle.'
    ],
    bgStart: '#0b132b',
    bgMid: '#1c2541',
    bgEnd: '#3a506b',
    accent: '#fbbf24',
    symbol: '\\u2726' // ✦
  }
];

let csharpMethods = '';

cards.forEach((c, idx) => {
  const stepsArray = c.steps.map(s => `"${esc(s)}"`).join(', ');
  csharpMethods += `
    public static void RenderSpecialCard_${idx}() {
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

const renderAllCalls = cards.map((_, idx) => `        RenderSpecialCard_${idx}();`).join('\n');

const template = `using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class SpecialCardRenderer {
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

                // 4. Large Watermark Symbol
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
                float titleFontSize = 52f;
                using (Font probeFont = new Font("Segoe UI", titleFontSize, FontStyle.Bold)) {
                    SizeF measured = g.MeasureString(subjectTitle, probeFont);
                    while (measured.Width > 740 && titleFontSize > 32f) {
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
                    g.DrawString("${esc('ÖNE ÇIKAN DİJİTAL SİSTEM ÖZELLİKLERİ')}", cardHeadFont, cardHeadBrush, glassX + 32, glassY + 28);
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
                        stepHeading = "${esc('TEMEL ÖZELLİK')}";
                    } else if (i == 1) {
                        stepHeading = "${esc('HESAPLAMA MOTORU')}";
                    } else {
                        stepHeading = "${esc('SONUÇ VE ANALİZ')}";
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
                    g.DrawString("${esc('AŞKAR YAYINLARI • DİJİTAL EĞİTİM ARAÇLARI')}", footerFont, footerBrush, 64, 824);
                }

                using (Font tagFont = new Font("Segoe UI", 12, FontStyle.Bold))
                using (SolidBrush tagBrush = new SolidBrush(accent)) {
                    g.DrawString("${esc('2026 GÜNCEL MEB MEVZUATI')}", tagFont, tagBrush, width - 290, 824);
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

fs.writeFileSync('C:/askar-yayinlari/scripts/SpecialCardRenderer.cs', template);
console.log('Successfully written SpecialCardRenderer.cs!');

// Update toolsData.ts to ensure iokbs, kelime, and kaynak point to .jpg with cache-buster
const toolsPath = 'C:/askar-yayinlari/src/data/toolsData.ts';
let toolsContent = fs.readFileSync(toolsPath, 'utf8');
toolsContent = toolsContent.replace("image: '/assets/free-covers/kelime-analizi.svg'", "image: '/assets/free-covers/kelime-analizi.jpg'");
toolsContent = toolsContent.replace("image: '/assets/free-covers/apa-kaynakca.svg'", "image: '/assets/free-covers/apa-kaynakca.jpg'");
toolsContent = toolsContent.replace("image: '/assets/free-covers/iokbs.jpg'", "image: '/assets/free-covers/iokbs.jpg?v=2026'");
fs.writeFileSync(toolsPath, toolsContent, 'utf8');
console.log('Updated toolsData.ts with new jpg images!');
