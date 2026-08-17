import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

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

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
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
