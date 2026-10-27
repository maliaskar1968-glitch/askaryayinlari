const http = require('http');

const urls = [
  '/assets/ders-kartlari/matematik-1x1.jpg',
  '/assets/ders-kartlari/lise/lise-matematik-1x1.jpg',
  '/assets/ders-kartlari/lise/lise-geometri-1x1.jpg',
  '/assets/ders-kartlari/lise/lise-fizik-1x1.jpg'
];

async function check() {
  for (const u of urls) {
    await new Promise(resolve => {
      const req = http.get({
        host: '127.0.0.1',
        port: 5173,
        path: u
      }, res => {
        console.log(`[STATUS] ${res.statusCode} ${res.headers['content-type']} - ${u} (size: ${res.headers['content-length']})`);
        resolve();
      });
      req.on('error', err => {
        console.log('[ERR]', err.code, err.message);
        resolve();
      });
    });
  }
}

check();
