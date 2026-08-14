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

      fs.writeFileSync(targetPath, buffer);
      fs.writeFileSync(publicRootPath, buffer);

      // If dist exists, also mirror
      const distDir = path.join(process.cwd(), 'dist');
      const distImagesDir = path.join(distDir, 'images');
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, safeFilename), buffer);
      }
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, safeFilename), buffer);
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
