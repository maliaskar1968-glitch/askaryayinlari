import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ASSISTANT_SYSTEM_INSTRUCTION = `
Sen Aşkar Yayınları'nın (askaryayinlari.com.tr) resmi dijital asistanısın. Adın Aşkar Asistan. Normal bir insan gibi düşün, hemen pes etme.

GÖREVİN:
1. Önce TÜM soruları sen cevapla. Asla uydurma.
2. Cevabı bilmiyorsan direkt WhatsApp'a ATMA. Önce "Bunu mu kastettiniz?" diye sor.
3. Sadece 2. denemede de cevap veremezsen WhatsApp'a yönlendir.

BİLGİ TABANI - SADECE BURADAN CEVAP VER:

[DÜKKAN] Aşkar Yayınları Dijital PDF Kütüphanesi. Tüm ürünler E-Kitap, Kargo YOK, Beklemek YOK, Shopier ile anında indir. WhatsApp: +90 505 716 29 39
Resmi Mağaza: https://www.shopier.com/mehmetaliaskar

[VAR OLAN KİTAPLAR - TAM LİSTE]

[ORTAOKUL GRUBU - 5'ten 8'e]
- 5. SINIF KOÇU: 5. Sınıf Koçluk & Motivasyon - Ortaokula Güçlü Bir Başlangıç. SİSTEMSİZLİK sorununu çözer. 10 hafta, 1 beceri 1 görev 1 rozet. Soru bankası değil, başarı alışkanlığı kitabıdır. Masada oturamama, ödev unutma, sınav kaygısı, ekran bağımlılığı sorunlarına çözüm.
- 6. SINIF KOÇU: 6. Sınıf Disiplin ve Başarı - Başarı Alışkanlıklarını Güçlendir. LGS temeli atma, hedef belirleme ve planlama, ertelememe.
- 7. SINIF KOÇU: 7. Sınıf LGS Hazırlık - LGS Yolunda Sağlam Adımlar. LGS öncesi son strateji, odaklanma ve motivasyon. Günde 30 soru alışkanlığı, yeni nesil soru mantığı.
- 8. SINIF KOÇU: 8. Sınıf LGS'DE KENDİ KOÇUN OL - 12 Adımda Disiplin, Plan ve Başarı Sistemi. LGS yolunda sağlam adımlar. Zaman yönetimi, MEB analizleri, deneme check-up.

[LİSE GRUBU - 9'dan 12'ye]
- 9. SINIF KOÇU: 9. Sınıf Lise Koçu - Liseye Güçlü Başlangıç. 8'den 9'a geçiş sistemi, liseye uyum, SMART hedefler, Pomodoro ve Cornell tekniği.
- 10. SINIF KOÇU: 10. Sınıf Lise Koçu - Başarı Alışkanlıklarını Derinleştir. Liseye uyum ve TYT temeli atma. 9'dan 10'a geçişte sistem kurma, alan seçimi rehberi.
- 11. SINIF KOÇU: 11. Sınıf Lise Koçu - YKS Yolunda Sağlam Adımlar. TYT-AYT dengesi kurma, 11. sınıfta TYT'yi bitirme sistemi.
- 12. SINIF ve MEZUN: YKS'DE KENDİ KOÇUN OL. 12. sınıf ve mezunlar için YKS koçluk kitabı. Sınav sürecini kendi koçun olarak yönetme, planlama, stres yönetimi.

[MEZUN / YKS GRUBU]
- YKS'de Kendi Koçun Ol (12. Sınıf ve Mezunlar için).

[ÇOCUK KİTAPLARI GRUBU]
- Nasrettin Hoca'nın Torunları (6-10 yaş fıkra ve değerler kitabı, 99 sayfa PDF) ve çocuk hikaye kitapları (Sevimli Deniz Altı Kaşifleri, Ormanın Minik Koruyucuları, Uykudan Önce).

[TARİHİ KURGU / BİLİM ROMANLARI]
- Şimşeğin Efendisi Tesla (Nikola Tesla romanı, 205 sayfa PDF), Atomun Kalbi Rutherford (Ernest Rutherford romanı).

AKILLI ONAY SİSTEMİ & KATEGORİ KURALLARI - BUNU MUTLAKA UYGULA:

1. Eğer müşteri "ortaokul için ne var", "ortaokul kitapları" derse:
Direkt şunu yaz:
"Ortaokul için 4 kitabımız var:
1- 5. Sınıf Koçluk & Motivasyon
2- 6. Sınıf Disiplin ve Başarı
3- 7. Sınıf LGS Hazırlık
4- 8. Sınıf LGS'DE KENDİ KOÇUN OL
Hangisinden bahsedeyim? Shopier ile anında indirebilirsiniz." ASLA WhatsApp'a atma.

2. Eğer müşteri "lise için ne var", "lise kitapları" derse:
Direkt şunu yaz:
"Lise için 4 kitabımız var:
1- 9. Sınıf Lise Koçu
2- 10. Sınıf Lise Koçu
3- 11. Sınıf Lise Koçu
4- 12. Sınıf YKS'de Kendi Koçun Ol
Hangisinden bahsedeyim? Shopier ile anında indirebilirsiniz."

3. Eğer müşteri "mezun için ne var", "YKS için ne var", "12. sınıf" derse:
Direkt şunu yaz:
"Mezunlar ve 12. Sınıf için 'YKS'de Kendi Koçun Ol' kitabımız var. YKS sürecini kendi koçun olarak yönetmeyi öğretiyor. Shopier ile anında indirebilirsiniz."

4. Eğer müşteri "çocuk için ne var", "çocuk kitapları", "ilkokul hikaye" derse:
Direkt şunu yaz:
"Çocuklar için 'Nasrettin Hoca'nın Torunları' serimiz ve hikaye kitaplarımız var. Shopier ile anında indirebilirsiniz."

5. SINIF SORULURSA (5-12 ve YKS):
Direkt o kitabın açıklamasından cevap ver. Asla "yok" deme. Hepsi var.
Örnek: "12.Sınıf için koçluk var mı" -> "Evet var! 12. Sınıf ve Mezunlar için 'YKS'de Kendi Koçun Ol' kitabımız var. YKS sürecini kendi koçun olarak yönetmeyi öğretiyor. Shopier ile anında indirebilirsiniz."
Örnek: "10. sınıf var mı" -> "Evet, 10. Sınıf Koçu kitabımız var. Liseye uyum ve TYT temeli atma üzerine. Bundan bahsedeyim mi? Shopier ile anında indirebilirsiniz."
Örnek: "YKS kitabınız var mı" -> "Evet, 12. Sınıf ve Mezunlar için 'YKS'de Kendi Koçun Ol' kitabımız var, bunu mu kastettiniz? Shopier ile anında indirebilirsiniz."

6. OLMAYAN BİR ŞEY SORULURSA (Örn: 1, 2, 3, 4. sınıf ilkokul):
Şunu de: "İlkokul 1-4 için direkt koçluk kitabımız yok, en yakın olarak 5. Sınıf Ortaokula Geçiş kitabımız var. 5. Sınıf'tan bahsedeyim mi? Shopier ile anında indirebilirsiniz."

7. MÜŞTERİ HAYIR DERSE VE YENİ SINIF YAZARSA:
Onu yeni soru olarak algıla. "hayır"a takılı kalma. Örneğin "hayır 10. sınıf" derse hemen 10. Sınıf kitabını anlat.

8. BİLMEDİĞİN BİR KAVRAM OLURSA (Sitedeki içerikle karşılaştır):
- Örn: "disiplin" yazdıysa -> 8. Sınıf LGS'de Kendi Koçun Ol (12 Adımda Disiplin Plan Başarı Sistemi) kitabını öner.
- Örn: "motivasyon" yazdıysa -> 6. Sınıf Başarı Alışkanlıklarını Güçlendir veya 5. Sınıf kitabını öner.
- Önce sor: "Bunu mu kastettiniz? [Kitap Adı] - [Açıklamadan 1 cümle özet]"
- Müşteri EVET derse o kitabın detayını ver ve sonuna "Shopier ile anında indirebilirsiniz, kargo yok." ekle.
- Müşteri HAYIR derse (yeni konu vermeden) -> "Anladım, o zaman tam olarak ne arıyordunuz, biraz daha açar mısınız?" de.
- Sadece 2 denemede de cevap veremezsen WhatsApp'a yönlendir: "Bu konuda sizi yetkilimize yönlendireyim, WhatsApp'tan anında yardımcı olalım 👉"

KONUŞMA TARZI:
- Türkçe, kısa, samimi, veliye hitap et. 3 cümle civarında tut. Listeleri maddeler halinde ver. Asla "bilmiyorum" deme.
- Cevapların başında "Merhaba", "Selam" gereksiz tekrarlama; doğrudan konuya gir.
- Sonuna hep ekle: "Shopier ile anında indirebilirsiniz."
- Asla açık telefon numarası yazma; yönlendirme gerekirse "Bu konuda sizi yetkilimize yönlendireyim, WhatsApp'tan anında yardımcı olalım 👉" de.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON with base64 images (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure public/images directory exists
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  // --- Real-time Presence & Visitor Tracking ---
  const statsFilePath = path.join(process.cwd(), 'visitor_stats.json');
  let visitorStats = { totalVisitors: 5000, uniqueSessions: [] as string[] };

  try {
    if (fs.existsSync(statsFilePath)) {
      const data = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));
      if (typeof data.totalVisitors === 'number') {
        visitorStats.totalVisitors = Math.max(5000, data.totalVisitors);
      }
      if (Array.isArray(data.uniqueSessions)) {
        visitorStats.uniqueSessions = data.uniqueSessions;
      }
    } else {
      fs.writeFileSync(statsFilePath, JSON.stringify(visitorStats, null, 2));
    }
  } catch (e) {
    console.error('[Visitor Stats Error]', e);
  }

  // In-memory active sessions tracking (sessionId -> lastSeen timestamp)
  const activeSessions = new Map<string, number>();
  const SESSION_TIMEOUT_MS = 25000; // 25 seconds timeout for inactive tabs

  const pruneStaleSessions = () => {
    const now = Date.now();
    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > SESSION_TIMEOUT_MS) {
        activeSessions.delete(id);
      }
    }
  };

  // Register a new visit (increases total visitor counter by 1 per new visitor/session)
  app.post('/api/presence/visit', (req, res) => {
    try {
      const { sessionId } = req.body;
      const cleanId = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : 'anon_' + Date.now();
      const now = Date.now();

      pruneStaleSessions();
      activeSessions.set(cleanId, now);

      if (!visitorStats.uniqueSessions) visitorStats.uniqueSessions = [];
      if (!visitorStats.uniqueSessions.includes(cleanId)) {
        visitorStats.uniqueSessions.push(cleanId);
        // Keep up to 10000 session IDs
        if (visitorStats.uniqueSessions.length > 10000) {
          visitorStats.uniqueSessions = visitorStats.uniqueSessions.slice(-10000);
        }
        visitorStats.totalVisitors = Math.max(5000, (visitorStats.totalVisitors || 5000) + 1);
        try {
          fs.writeFileSync(statsFilePath, JSON.stringify(visitorStats, null, 2));
        } catch (err) {
          console.error('Failed to write visitor_stats.json', err);
        }
      }

      res.json({
        success: true,
        onlineCount: Math.max(1, activeSessions.size),
        totalVisitors: visitorStats.totalVisitors
      });
    } catch (err) {
      res.json({
        success: true,
        onlineCount: Math.max(1, activeSessions.size),
        totalVisitors: visitorStats.totalVisitors || 5000
      });
    }
  });

  // Heartbeat endpoint for active tabs
  app.post('/api/presence/heartbeat', (req, res) => {
    try {
      const { sessionId, isNewSession } = req.body;
      const cleanId = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : 'anon_' + Date.now();
      const now = Date.now();

      pruneStaleSessions();
      activeSessions.set(cleanId, now);

      if (isNewSession) {
        if (!visitorStats.uniqueSessions) visitorStats.uniqueSessions = [];
        if (!visitorStats.uniqueSessions.includes(cleanId)) {
          visitorStats.uniqueSessions.push(cleanId);
          if (visitorStats.uniqueSessions.length > 10000) {
            visitorStats.uniqueSessions = visitorStats.uniqueSessions.slice(-10000);
          }
          visitorStats.totalVisitors = Math.max(5000, (visitorStats.totalVisitors || 5000) + 1);
          try {
            fs.writeFileSync(statsFilePath, JSON.stringify(visitorStats, null, 2));
          } catch (err) {
            console.error('Failed to write visitor_stats.json', err);
          }
        }
      }

      const onlineCount = Math.max(1, activeSessions.size);
      res.json({
        onlineCount,
        totalVisitors: visitorStats.totalVisitors
      });
    } catch (err) {
      res.json({
        onlineCount: Math.max(1, activeSessions.size),
        totalVisitors: visitorStats.totalVisitors
      });
    }
  });

  // Tab closed / leave endpoint
  app.post('/api/presence/leave', (req, res) => {
    try {
      const { sessionId } = req.body;
      if (sessionId && activeSessions.has(sessionId)) {
        activeSessions.delete(sessionId);
      }
      pruneStaleSessions();
      res.json({ success: true, onlineCount: Math.max(1, activeSessions.size) });
    } catch {
      res.json({ success: true });
    }
  });

  // Current stats query endpoint
  app.get('/api/presence/stats', (req, res) => {
    pruneStaleSessions();
    res.json({
      onlineCount: Math.max(1, activeSessions.size),
      totalVisitors: visitorStats.totalVisitors
    });
  });
  // ----------------------------------------------

  // Serve static images directly from public/images
  app.use('/images', express.static(publicImagesDir));

// Knowledge base answer helper with smart confirmation and 2nd chance logic
function getLocalKnowledgeAnswer(q: string, history: Array<{ role: string; text: string }> = []): string | null {
  const s = q.toLowerCase().trim();
  const lastBotMsg = history.filter(h => h.role === 'model').slice(-1)[0]?.text?.toLowerCase() || '';

  // 1. Direct confirmation checks if previous message was a clarification question
  if (lastBotMsg.includes('kastettiniz') || lastBotMsg.includes('bahsedeyim mi') || lastBotMsg.includes('ister misiniz') || lastBotMsg.includes('hangisinden')) {
    const hasNewSpecificTopic = s.includes('5') || s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9') || s.includes('10') || s.includes('11') || s.includes('12') || s.includes('lise') || s.includes('ortaokul') || s.includes('yks') || s.includes('mezun') || s.includes('nasrettin') || s.includes('roman');

    if (!hasNewSpecificTopic && (s.includes('evet') || s.includes('aynen') || s.includes('doğru') || s.includes('olur') || s.includes('bahset') || s.includes('anlat') || s === 'e')) {
      if (lastBotMsg.includes('5. sınıf') || lastBotMsg.includes('ortaokula güçlü') || lastBotMsg.includes('geçiş')) {
        return "5. Sınıf Koçluk & Motivasyon (Ortaokula Güçlü Başlangıç): Bu bir soru bankası değil, BAŞARI ALIŞKANLIĞI KİTABIDIR. İlkokuldan ortaokula geçen öğrencinin sorunu dersler değil, sistemsizliktir; 10 haftalık sistemle ödev unutma, sınav kaygısı ve odaklanma sorunlarını çözer. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('6. sınıf') || lastBotMsg.includes('disiplin')) {
        return "6. Sınıf Disiplin ve Başarı: LGS temelinin atıldığı yıldır. Hedef belirleme, planlama ve başarı alışkanlıklarını güçlendirir. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('7. sınıf') || lastBotMsg.includes('lgs hazırlık')) {
        return "7. Sınıf LGS Hazırlık: LGS öncesi son strateji yılıdır. Günde 30 soru alışkanlığı, odaklanma ve sınav koçluğuna odaklanır. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('8. sınıf') || lastBotMsg.includes('lgs\'de kendi koçun ol')) {
        return "8. Sınıf LGS'de Kendi Koçun Ol: 12 Adımda Disiplin, Plan ve Başarı Sistemidir. Zaman yönetimi, MEB kazanım analizi ve sınav taktiklerini içerir. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('9. sınıf') || lastBotMsg.includes('liseye güçlü')) {
        return "9. Sınıf Lise Koçu: Liseye Güçlü Başlangıç rehberimizdir; 8'den 9'a geçiş sistemi ve yeni ders temposuna uyum kazandırır. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('10. sınıf')) {
        return "10. Sınıf Lise Koçu: Liseye uyum ve TYT temeli atma üzerine, 9'dan 10'a geçişte sistem kurar ve başarı alışkanlıklarını derinleştirir. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('11. sınıf')) {
        return "11. Sınıf Lise Koçu: YKS omurgasını oluşturan kritik yıldır; TYT-AYT dengesi kurma ve 11. sınıfta TYT'yi bitirme sistemini kazandırır. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('12. sınıf') || lastBotMsg.includes('yks') || lastBotMsg.includes('mezun')) {
        return "12. Sınıf ve Mezunlar için 'YKS'de Kendi Koçun Ol': Sınav sürecini kendi koçun olarak yönetme, hedef netleştirme, TYT-AYT dengesi ve stres kontrolü rehberidir. Shopier ile anında indirebilirsiniz.";
      }
      if (lastBotMsg.includes('nasrettin') || lastBotMsg.includes('çocuk') || lastBotMsg.includes('fıkra')) {
        return "Nasrettin Hoca'nın Torunları: 6-10 yaş çocuklar için 99 sayfa, 3 MB PDF boyutunda keyifli ve öğretici bir fıkra/değerler kitabıdır. Shopier ile anında indirebilirsiniz.";
      }
      return "Koçluk kitaplarımız öğrencilerimize planlı çalışma, odaklanma ve başarı disiplini kazandırır. Shopier ile anında indirebilirsiniz.";
    }

    if (!hasNewSpecificTopic && (s === 'hayır' || s === 'hayir' || s === 'değil' || s === 'degil' || s === 'başka' || s === 'yok' || s === 'h')) {
      return "Anladım, o zaman tam olarak ne arıyordunuz, biraz daha açar mısınız?";
    }
    // If user says "hayır 10. sınıf var mı", continue below and handle 10. sınıf!
  }

  // 2. KATEGORİ KURALLARI (User specified exact outputs)
  if (s.includes('ortaokul için ne var') || s.includes('ortaokul kitapları') || s.includes('ortaokulda ne var') || (s.includes('ortaokul') && (s.includes('neler') || s.includes('hangileri') || s.includes('liste')))) {
    return "Ortaokul için 4 kitabımız var:\n1- 5. Sınıf Koçluk & Motivasyon\n2- 6. Sınıf Disiplin ve Başarı\n3- 7. Sınıf LGS Hazırlık\n4- 8. Sınıf LGS'DE KENDİ KOÇUN OL\nHangisinden bahsedeyim? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('lise için ne var') || s.includes('lise kitapları') || s.includes('lisede ne var') || (s.includes('lise') && (s.includes('neler') || s.includes('hangileri') || s.includes('liste')))) {
    return "Lise için 4 kitabımız var:\n1- 9. Sınıf Lise Koçu\n2- 10. Sınıf Lise Koçu\n3- 11. Sınıf Lise Koçu\n4- 12. Sınıf YKS'de Kendi Koçun Ol\nHangisinden bahsedeyim? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('mezun') || s.includes('yks için ne var') || s.includes('yks kitapları') || (s.includes('yks') && s.includes('var mı'))) {
    return "Mezunlar ve 12. Sınıf için 'YKS'de Kendi Koçun Ol' kitabımız var. YKS sürecini kendi koçun olarak yönetmeyi öğretiyor. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('çocuk için ne var') || s.includes('çocuk kitapları') || s.includes('ilkokul hikaye') || (s.includes('çocuk') && (s.includes('neler') || s.includes('kitap')))) {
    return "Çocuklar için 'Nasrettin Hoca'nın Torunları' serimiz ve hikaye kitaplarımız var. Shopier ile anında indirebilirsiniz.";
  }

  // 3. DOĞRUDAN SINIF SORULARI (5-12 & YKS)
  if (s.includes('12. sınıf') || s.includes('12.sınıf') || s.includes('on ikinci sınıf') || (s.includes('12') && s.includes('sınıf'))) {
    return "Evet var! 12. Sınıf ve Mezunlar için 'YKS'de Kendi Koçun Ol' kitabımız var. YKS sürecini kendi koçun olarak yönetmeyi öğretiyor. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('11. sınıf') || s.includes('11.sınıf') || s.includes('on birinci sınıf') || (s.includes('11') && s.includes('sınıf'))) {
    return "Evet, 11. Sınıf Lise Koçu kitabımız var. TYT-AYT dengesi kurma ve 11. sınıfta TYT'yi bitirme sistemi üzerine. Bundan bahsedeyim mi? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('10. sınıf') || s.includes('10.sınıf') || s.includes('onuncu sınıf') || (s.includes('10') && s.includes('sınıf'))) {
    return "Evet, 10. Sınıf Koçu kitabımız var. Liseye uyum ve TYT temeli atma üzerine. Bundan bahsedeyim mi? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('9. sınıf') || s.includes('9.sınıf') || s.includes('dokuzuncu sınıf') || (s.includes('9') && s.includes('sınıf'))) {
    return "Evet, 9. Sınıf Lise Koçu kitabımız var. Liseye Güçlü Başlangıç rehberimiz 8'den 9'a geçiş sistemi ve uyum kazandırır. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('8. sınıf') || s.includes('8.sınıf') || s.includes('sekizinci sınıf') || s.includes('lgs')) {
    return "8. Sınıf LGS'de Kendi Koçun Ol: 12 Adımda Disiplin, Plan ve Başarı Sistemidir. Zaman yönetimi, MEB kazanım analizi ve sınav taktiklerini içerir. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('7. sınıf') || s.includes('7.sınıf') || s.includes('yedinci sınıf') || (s.includes('7') && s.includes('sınıf'))) {
    return "7. Sınıf LGS Hazırlık (LGS Yolunda Sağlam Adımlar): LGS öncesi son strateji yılıdır; günde 30 soru alışkanlığı, odaklanma ve sınav koçluğu sağlar. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('6. sınıf') || s.includes('6.sınıf') || s.includes('altıncı sınıf') || (s.includes('6') && s.includes('sınıf'))) {
    return "6. Sınıf Disiplin ve Başarı: LGS temelinin atıldığı yıldır. Hedef belirleme, planlama ve başarı alışkanlıklarını güçlendirir. Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('5. sınıf') || s.includes('5.sınıf') || s.includes('beşinci sınıf') || s.includes('ortaokula güçlü') || (s.includes('5') && s.includes('sınıf'))) {
    return "ORTAOKUL KOÇU 5. SINIF: Bu bir soru bankası değil, BAŞARI ALIŞKANLIĞI KİTABIDIR. İlkokuldan ortaokula geçen öğrencinin sorunu dersler değil, SİSTEMSİZLİKTİR. Masada duramama, ödev unutma ve sınav stresi gibi 5 temel sorunu 10 haftada çözer. Shopier ile anında indirebilirsiniz.";
  }

  // 4. OLMAYAN BİR ŞEY (Örn: 1, 2, 3, 4. sınıf ilkokul)
  if (s.includes('1. sınıf') || s.includes('2. sınıf') || s.includes('3. sınıf') || s.includes('4. sınıf') || s.includes('ilkokul') || s.includes('1.sınıf') || s.includes('2.sınıf') || s.includes('3.sınıf') || s.includes('4.sınıf')) {
    return "İlkokul 1-4 için direkt koçluk kitabımız yok, en yakın olarak 5. Sınıf Ortaokula Geçiş kitabımız var. 5. Sınıf'tan bahsedeyim mi? Shopier ile anında indirebilirsiniz.";
  }

  // 5. ÖZEL KİTAP VE TESLİMAT SORULARI
  if (s.includes('kargo') || s.includes('basılı') || s.includes('fiziki') || s.includes('pdf') || s.includes('teslim') || s.includes('gönderim')) {
    return "Aşkar Yayınları Dijital PDF Kütüphanesidir. Tüm ürünlerimiz E-Kitap formatındadır, kargo ve bekleme süresi yoktur; Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('shopier') || s.includes('nasıl alırım') || s.includes('satın al') || s.includes('ödeme')) {
    return "Kitaplarımızı Shopier resmi mağazamız üzerinden kredi kartı veya banka kartı ile güvenle alıp hemen PDF olarak indirebilirsiniz, kargo yoktur.";
  }

  if (s.includes('nasrettin') || s.includes('nasreddin')) {
    return "Nasrettin Hoca'nın Torunları: Tarihi kurgu ve fıkra kitabımızdır (99 sayfa, 3 MB PDF). Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('tesla') || s.includes('şimşek') || s.includes('rutherford') || s.includes('atom')) {
    return "Tarihi kurgu ve bilim romanlarımız 'Şimşeğin Efendisi Tesla' ve 'Atomun Kalbi Rutherford' dijital PDF olarak mevcuttur. Shopier ile anında indirebilirsiniz.";
  }

  // 6. KİTAP AÇIKLAMALARI VE İÇERİK EŞLEŞTİRMESİ
  if (s.includes('disiplin') || s.includes('planlama') || s.includes('çalışma planı')) {
    return "Disiplin ve planlama için 8. Sınıf LGS'de Kendi Koçun Ol (12 Adımda Disiplin Plan Başarı Sistemi) kitabımızı mı kastettiniz? Detay vereyim mi? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('motivasyon') || s.includes('ders çalışmak istemiyor') || s.includes('masada oturmuyor')) {
    return "Motivasyon ve başarı alışkanlıkları için 5. veya 6. Sınıf Koçluk kitabımızı mı kastettiniz? Hangisinden bahsedeyim? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('tyt') || s.includes('ayt')) {
    return "TYT-AYT hazırlığı için 10. Sınıf, 11. Sınıf veya YKS'de Kendi Koçun Ol kitabımızı mı kastettiniz? Hangisinden bahsedeyim? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('tarihi kurgu') || s.includes('roman') || s.includes('hikaye') || s.includes('masal')) {
    return "Tarihi kurgu olarak 'Nasrettin Hoca'nın Torunları' serimizi mi kastettiniz? Eğer evetse detay vereyim mi? Shopier ile anında indirebilirsiniz.";
  }

  if (s.includes('koç') || s.includes('koçluk') || s.includes('kitap')) {
    return "Ortaokul veya lise koçluk serimizden bir kitabı mı kastettiniz? Örneğin 5. Sınıf Ortaokula Güçlü Başlangıç kitabımızdan bahsedeyim mi? Shopier ile anında indirebilirsiniz.";
  }

  // 7. İKİNCİ ŞANS / WHATSAPP KURALI
  const secondChanceAsked = lastBotMsg.includes('tam olarak ne arıyordunuz') || lastBotMsg.includes('biraz daha açar mısınız');
  if (secondChanceAsked) {
    return "Bu konuda sizi yetkilimize yönlendireyim, WhatsApp'tan anında yardımcı olalım 👉";
  }

  return "Anladım, o zaman tam olarak ne arıyordunuz, biraz daha açar mısınız?";
}

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Aşkar Yayınları AI Assistant API
  app.post('/api/assistant', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Mesaj metni zorunludur.' });
      }

      const q = message.trim();
      const hist = Array.isArray(history) ? history : [];
      const localAns = getLocalKnowledgeAnswer(q, hist);

      try {
        const ai = new GoogleGenAI({});
        const contents: any[] = [];

        // Add valid chat history for multi-turn conversational context
        for (const item of hist.slice(-8)) {
          if (item && item.text && typeof item.text === 'string' && item.text.trim()) {
            contents.push({
              role: item.role === 'model' ? 'model' : 'user',
              parts: [{ text: item.text.trim() }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: q }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
            temperature: 0.2,
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          return res.json({ reply });
        }
      } catch (geminiError: any) {
        console.warn('[Gemini Call Notice]: Falling back to local smart knowledge engine', geminiError?.message);
      }

      // If Gemini wasn't reached or returned empty, use knowledge base
      if (localAns) {
        return res.json({ reply: localAns });
      }

      return res.json({
        reply: "Anladım, tam olarak ne arıyordunuz, biraz daha açar mısınız?"
      });
    } catch (error: any) {
      console.error('[Assistant API Error]', error?.message || error);
      const fallbackAns = getLocalKnowledgeAnswer(req.body?.message || '', req.body?.history || []);
      res.json({
        reply: fallbackAns || "Bu konuda sizi yetkilimize yönlendireyim, WhatsApp'tan anında yardımcı olalım 👉"
      });
    }
  });

  // API to save uploaded image permanently to public/images/ on the server
  app.post('/api/upload-image', (req, res) => {
    try {
      const { filename, dataUrl } = req.body;
      if (!filename || !dataUrl) {
        return res.status(400).json({ error: 'filename and dataUrl are required' });
      }

      // Extract base64 payload
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches && matches[2]
        ? Buffer.from(matches[2], 'base64')
        : Buffer.from(dataUrl, 'base64');

      // Clean filename
      const safeFilename = path.basename(filename);
      const targetPath = path.join(publicImagesDir, safeFilename);
      const publicRootPath = path.join(process.cwd(), 'public', safeFilename);
      const publicResimlerDir = path.join(process.cwd(), 'public', 'resimler');
      if (!fs.existsSync(publicResimlerDir)) {
        fs.mkdirSync(publicResimlerDir, { recursive: true });
      }
      const publicResimlerPath = path.join(publicResimlerDir, safeFilename);

      fs.writeFileSync(targetPath, buffer);
      fs.writeFileSync(publicRootPath, buffer);
      fs.writeFileSync(publicResimlerPath, buffer);

      // If dist exists, also mirror
      const distDir = path.join(process.cwd(), 'dist');
      const distImagesDir = path.join(distDir, 'images');
      const distResimlerDir = path.join(distDir, 'resimler');
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, safeFilename), buffer);
      }
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, safeFilename), buffer);
        if (!fs.existsSync(distResimlerDir)) {
          fs.mkdirSync(distResimlerDir, { recursive: true });
        }
        fs.writeFileSync(path.join(distResimlerDir, safeFilename), buffer);
      }

      console.log(`[Upload API] Saved ${safeFilename} (${buffer.length} bytes) to disk`);
      return res.json({ success: true, filename: safeFilename, path: `/images/${safeFilename}` });
    } catch (err: any) {
      console.error('[Upload API Error]', err);
      return res.status(500).json({ error: err.message || 'Failed to save image' });
    }
  });

  // API to check available saved images
  app.get('/api/list-images', (req, res) => {
    try {
      if (!fs.existsSync(publicImagesDir)) {
        return res.json({ images: [] });
      }
      const files = fs.readdirSync(publicImagesDir);
      return res.json({ images: files });
    } catch (err) {
      return res.json({ images: [] });
    }
  });

  // --- Price Management API ---
  const pricesFilePath = path.join(process.cwd(), 'prices.json');

  app.get('/api/prices', (req, res) => {
    try {
      if (fs.existsSync(pricesFilePath)) {
        const data = JSON.parse(fs.readFileSync(pricesFilePath, 'utf-8'));
        return res.json({ success: true, prices: data });
      }
      return res.json({ success: true, prices: {} });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/prices', (req, res) => {
    try {
      const { prices } = req.body;
      if (!prices || typeof prices !== 'object') {
        return res.status(400).json({ error: 'Invalid prices object' });
      }
      let existing: Record<string, any> = {};
      if (fs.existsSync(pricesFilePath)) {
        try {
          existing = JSON.parse(fs.readFileSync(pricesFilePath, 'utf-8'));
        } catch {}
      }
      const updated = { ...existing, ...prices };
      fs.writeFileSync(pricesFilePath, JSON.stringify(updated, null, 2));

      // Also mirror to dist if exists
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'prices.json'), JSON.stringify(updated, null, 2));
      }

      return res.json({ success: true, prices: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aşkar Yayınları Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
