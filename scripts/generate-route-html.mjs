import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const sourceRoot = path.join(projectRoot, 'src');
const siteOrigin = 'https://www.askaryayinlari.com.tr';

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(sourceRoot, 'data', fileName), 'utf8'));

const routeMetadata = [
  {
    route: '/',
    title: 'Aşkar Yayınları | LGS ve YKS Koçluk Kitapları & Çocuk Kitaplığı',
    description: 'Aşkar Yayınları resmi dijital PDF kütüphanesi. LGS, YKS koçluk kitapları, çocuk masalları ve ücretsiz eğitim araçları.'
  },
  {
    route: '/magaza',
    title: 'Aşkar Yayınları | Dijital PDF Kütüphanesi',
    description: 'Aşkar Yayınları dijital kitap mağazası ve eğitim kaynakları.'
  },
  {
    route: '/uygulamalar',
    title: 'Uygulamalar ve Eğitim Araçları | Aşkar Yayınları',
    description: 'LGS ve YKS hesaplama araçları, Pomodoro sayacı ve ücretsiz eğitim uygulamaları.'
  },
  {
    route: '/rehber',
    title: 'Ders Çalışma Rehberleri | Aşkar Yayınları',
    description: 'Ortaokul, LGS, lise, TYT, AYT ve mezun hazırlığı için ders çalışma rehberleri.'
  },
  {
    route: '/hakkimizda',
    title: 'Hakkımızda | Aşkar Yayınları',
    description: 'Aşkar Yayınları ve eğitim koçu Mehmet Ali Aşkar hakkında bilgi.'
  },
  {
    route: '/iletisim',
    title: 'İletişim | Aşkar Yayınları',
    description: 'Aşkar Yayınları iletişim ve WhatsApp destek bilgileri.'
  }
];

const toolsSource = fs.readFileSync(path.join(sourceRoot, 'data', 'toolsData.ts'), 'utf8');
const toolSlugs = [...toolsSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
for (const slug of toolSlugs) {
  routeMetadata.push({
    route: `/uygulamalar/${slug}`,
    title: `${slug.replaceAll('-', ' ')} | Aşkar Yayınları`,
    description: 'Aşkar Yayınları ücretsiz eğitim uygulaması ve hesaplama aracı.'
  });
}

const guideFiles = [
  'ders-calisma-rehberi.json',
  'lgs-rehberi.json',
  'lise-dersleri.json',
  'tyt-ayt-rehberi.json',
  'mezun-rehberi.json'
];
for (const fileName of guideFiles) {
  for (const guide of readJson(fileName)) {
    const slug = guide.slug || `ortaokul-${guide.id}-nasil-calisilir`;
    const guideTitle = /nasıl çalışılır/i.test(guide.ad) ? guide.ad : `${guide.ad} Nasıl Çalışılır?`;
    routeMetadata.push({
      route: `/rehber/${slug}`,
      title: `${guideTitle} | Aşkar Yayınları`,
      description: `${guide.ad} için ders çalışma taktikleri, konu tekrarı ve haftalık çalışma programı.`
    });
  }
}

const uniqueRoutes = [...new Map(routeMetadata.map((item) => [item.route, item])).values()];
const sourceHtml = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');

const getSchema = (metadata) => {
  if (metadata.route.startsWith('/uygulamalar/')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: metadata.title.split(' | ')[0],
      description: metadata.description,
      url: `${siteOrigin}${metadata.route}`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      provider: { '@type': 'Organization', name: 'Aşkar Yayınları', url: siteOrigin }
    };
  }

  if (metadata.route.startsWith('/rehber/')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metadata.title.split(' | ')[0],
      description: metadata.description,
      mainEntityOfPage: `${siteOrigin}${metadata.route}`,
      author: { '@type': 'Organization', name: 'Aşkar Yayınları', url: siteOrigin },
      publisher: { '@type': 'Organization', name: 'Aşkar Yayınları', url: siteOrigin }
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: metadata.title.split(' | ')[0],
    description: metadata.description,
    url: `${siteOrigin}${metadata.route}`,
    publisher: { '@type': 'Organization', name: 'Aşkar Yayınları', url: siteOrigin }
  };
};

for (const metadata of uniqueRoutes) {
  if (metadata.route === '/') continue;

  const canonical = `${siteOrigin}${metadata.route}`;
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const schema = JSON.stringify(getSchema(metadata)).replaceAll('<', '\\u003c');
  let html = sourceHtml
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${description}" />`);

  html = html.replace('</head>', `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <script type="application/ld+json">${schema}</script>
  </head>`);

  const outputPath = path.join(distRoot, metadata.route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
}

const sitemapEntries = uniqueRoutes.map((metadata) => `  <url>
    <loc>${siteOrigin}${metadata.route}</loc>
    <lastmod>2026-09-29</lastmod>
    <changefreq>${metadata.route.startsWith('/uygulamalar/') || metadata.route.startsWith('/rehber/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${metadata.route === '/' ? '1.0' : metadata.route.startsWith('/uygulamalar/') || metadata.route.startsWith('/rehber/') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${uniqueRoutes.length - 1} route HTML files.`);