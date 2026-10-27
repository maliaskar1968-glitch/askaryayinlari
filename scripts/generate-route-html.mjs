import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const sourceRoot = path.join(projectRoot, 'src');
const siteOrigin = 'https://www.askaryayinlari.com.tr';

const escapeHtml = (value) => (value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(sourceRoot, 'data', fileName), 'utf8'));

// Extract tools data safely
const toolsSource = fs.readFileSync(path.join(sourceRoot, 'data', 'toolsData.ts'), 'utf8');
const cleanToolsJs = toolsSource
  .replace(/import\s+[^;]+;/g, '')
  .replace(/export\s+type\s+[^;]+;/g, '')
  .replace(/export\s+interface\s+[\s\S]*?\n\}/g, '')
  .replace(/export\s+const\s+TOOLS_DATA:\s*ToolDefinition\[\]\s*=/, 'const TOOLS_DATA =')
  .replace(/export\s+const\s+getToolBySlug[\s\S]*$/, '');

const getToolsData = new Function(`${cleanToolsJs}; return TOOLS_DATA;`);
const toolsData = getToolsData();

// Extract books data safely
const booksSource = fs.readFileSync(path.join(sourceRoot, 'data', 'books.ts'), 'utf8');
const cleanBooksJs = booksSource
  .replace(/import\s+[^;]+;/g, '')
  .replace(/export\s+const\s+KIDS_BOOKS_DATA[\s\S]*$/, '')
  .replace(/export\s+const\s+BOOKS_DATA:\s*Book\[\]\s*=/, 'const BOOKS_DATA =');

let booksData = [];
try {
  const getBooksData = new Function(`${cleanBooksJs}; return BOOKS_DATA;`);
  booksData = getBooksData();
} catch (e) {
  console.warn('Could not extract books dynamically, using fallback', e.message);
}

const routeMetadata = [
  {
    route: '/',
    title: 'Aşkar Yayınları | LGS ve YKS Koçluk Kitapları & Dijital Eğitim Sistemleri',
    description: 'Aşkar Yayınları resmi dijital PDF kütüphanesi. 5-8. sınıf LGS ve 9-12. sınıf YKS koçluk kitapları, MEB ve ÖSYM uyumlu ücretsiz hesaplama motorları ve ders çalışma rehberleri.'
  },
  {
    route: '/magaza',
    title: 'Aşkar Yayınları | Dijital PDF Kütüphanesi & Koçluk Kitapları',
    description: 'Aşkar Yayınları dijital PDF kitap mağazası. Ortaokul, LGS, lise ve YKS öğrenci koçluğu kitapları anında PDF teslimatı.'
  },
  {
    route: '/uygulamalar',
    title: 'Eğitim Uygulamaları ve Hesaplama Robotları 2026 | Aşkar Yayınları',
    description: '2026 LGS ve YKS TYT-AYT puan hesaplama motorları, Pomodoro ders çalışma sayacı, kelime analiz robotu, APA 7 kaynakça ve çocuk uygulaması.'
  },
  {
    route: '/rehber',
    title: 'Ders Çalışma Rehberleri ve Sınav Taktikleri | Aşkar Yayınları',
    description: 'Ortaokul, LGS, lise, TYT, AYT ve mezun hazırlığı için ders çalışma taktikleri ve haftalık program rehberleri.'
  },
  {
    route: '/hakkimizda',
    title: 'Hakkımızda | Aşkar Yayınları ve Mehmet Ali Aşkar',
    description: 'Aşkar Yayınları ve eğitim koçu Mehmet Ali Aşkar hakkında bilgi. Öğrenci koçluğu metodolojisi ve vizyonumuz.'
  },
  {
    route: '/iletisim',
    title: 'İletişim & WhatsApp Destek | Aşkar Yayınları',
    description: 'Aşkar Yayınları iletişim ve WhatsApp destek bilgileri. Dijital kitaplar ve eğitim sistemleri için anında canlı destek.'
  }
];

// Add tool routes with detailed metadata
for (const tool of toolsData) {
  routeMetadata.push({
    route: `/uygulamalar/${tool.slug}`,
    title: tool.metaTitle || `${tool.name} | Aşkar Yayınları`,
    description: tool.metaDescription || tool.tagline,
    image: tool.image ? `${siteOrigin}${tool.image.split('?')[0]}` : `${siteOrigin}/resimler/logo.jpg`,
    tool
  });
}

const guideFiles = [
  'ders-calisma-rehberi.json',
  'lgs-rehberi.json',
  'lise-dersleri.json',
  'tyt-ayt-rehberi.json',
  'mezun-rehberi.json'
];
const allGuides = [];
for (const fileName of guideFiles) {
  for (const guide of readJson(fileName)) {
    const slug = guide.slug || `ortaokul-${guide.id}-nasil-calisilir`;
    const guideTitle = /nasıl çalışılır/i.test(guide.ad) ? guide.ad : `${guide.ad} Nasıl Çalışılır?`;
    allGuides.push({ ...guide, slug, guideTitle });
    routeMetadata.push({
      route: `/rehber/${slug}`,
      title: `${guideTitle} | Aşkar Yayınları`,
      description: `${guide.ad} için ders çalışma taktikleri, konu tekrarı ve haftalık çalışma programı.`,
      image: guide.resim ? `${siteOrigin}${guide.resim.split('?')[0]}` : `${siteOrigin}/resimler/logo.jpg`,
      guide
    });
  }
}

const uniqueRoutes = [...new Map(routeMetadata.map((item) => [item.route, item])).values()];
const sourceHtml = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');

const getSchema = (metadata) => {
  if (metadata.tool) {
    const tool = metadata.tool;
    const schemas = [
      {
        '@type': 'WebApplication',
        name: tool.name,
        headline: tool.h1 || tool.name,
        description: tool.metaDescription,
        url: `${siteOrigin}${metadata.route}`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
        publisher: {
          '@type': 'Organization',
          name: 'Aşkar Yayınları',
          url: siteOrigin,
          logo: { '@type': 'ImageObject', url: `${siteOrigin}/resimler/logo.jpg` }
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Aşkar Yayınları', item: siteOrigin },
          { '@type': 'ListItem', position: 2, name: 'Uygulamalar', item: `${siteOrigin}/uygulamalar` },
          { '@type': 'ListItem', position: 3, name: tool.shortName || tool.name, item: `${siteOrigin}${metadata.route}` }
        ]
      }
    ];

    if (tool.faq && tool.faq.length > 0) {
      schemas.push({
        '@type': 'FAQPage',
        mainEntity: tool.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      });
    }

    return { '@context': 'https://schema.org', '@graph': schemas };
  }

  if (metadata.route.startsWith('/rehber/')) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: metadata.title.split(' | ')[0],
          description: metadata.description,
          mainEntityOfPage: `${siteOrigin}${metadata.route}`,
          author: { '@type': 'Person', name: 'Mehmet Ali Aşkar', jobTitle: 'Eğitim Koçu & Yazar' },
          publisher: { '@type': 'Organization', name: 'Aşkar Yayınları', url: siteOrigin, logo: { '@type': 'ImageObject', url: `${siteOrigin}/resimler/logo.jpg` } }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Aşkar Yayınları', item: siteOrigin },
            { '@type': 'ListItem', position: 2, name: 'Rehber', item: `${siteOrigin}/rehber` },
            { '@type': 'ListItem', position: 3, name: metadata.title.split(' | ')[0], item: `${siteOrigin}${metadata.route}` }
          ]
        }
      ]
    };
  }

  // Root homepage & default
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteOrigin}/#organization`,
        name: 'Aşkar Yayınları',
        url: siteOrigin,
        logo: { '@type': 'ImageObject', url: `${siteOrigin}/resimler/logo.jpg` },
        founder: { '@type': 'Person', name: 'Mehmet Ali Aşkar', jobTitle: 'Eğitim Koçu & Yazar' },
        contactPoint: { '@type': 'ContactPoint', telephone: '+905057063851', contactType: 'customer service', availableLanguage: 'Turkish' }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        url: siteOrigin,
        name: 'Aşkar Yayınları',
        description: metadata.description,
        publisher: { '@id': `${siteOrigin}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteOrigin}/uygulamalar?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
};

// Generate static pre-rendered fallback HTML for search engine crawlers (inside <div id="root">)
const getPrerenderedHtml = (metadata) => {
  // 1. Tool detail page
  if (metadata.tool) {
    const tool = metadata.tool;
    const highlightsHtml = tool.highlights && tool.highlights.length > 0
      ? `<section style="margin-top:2rem;">
          <h2 style="font-size:1.375rem;font-weight:700;color:#1A1A1A;margin-bottom:1rem;">Öne Çıkan Özellikler</h2>
          <ul style="list-style-type:disc;padding-left:1.5rem;line-height:1.8;color:#2D3748;">
            ${tool.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        </section>`
      : '';

    const howToUseHtml = tool.howToUse && tool.howToUse.length > 0
      ? `<section style="margin-top:2rem;">
          <h2 style="font-size:1.375rem;font-weight:700;color:#1A1A1A;margin-bottom:1rem;">Nasıl Kullanılır?</h2>
          <ol style="list-style-type:decimal;padding-left:1.5rem;line-height:1.8;color:#2D3748;">
            ${tool.howToUse.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>
        </section>`
      : '';

    const faqHtml = tool.faq && tool.faq.length > 0
      ? `<section style="margin-top:2rem;">
          <h2 style="font-size:1.375rem;font-weight:700;color:#1A1A1A;margin-bottom:1rem;">Sıkça Sorulan Sorular</h2>
          <dl style="line-height:1.7;">
            ${tool.faq.map(item => `
              <dt style="font-weight:700;color:#1A1A1A;margin-top:1rem;">${escapeHtml(item.q)}</dt>
              <dd style="color:#4A5568;margin-left:0;margin-top:0.25rem;">${escapeHtml(item.a)}</dd>
            `).join('')}
          </dl>
        </section>`
      : '';

    return `
      <main style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;margin-bottom:1.5rem;color:#718096;">
          <a href="/" style="color:#856526;text-decoration:none;font-weight:600;">Aşkar Yayınları</a> &gt; 
          <a href="/uygulamalar" style="color:#856526;text-decoration:none;font-weight:600;">Uygulamalar</a> &gt; 
          <span>${escapeHtml(tool.name)}</span>
        </nav>
        <header>
          <h1 style="font-size:2.25rem;font-weight:800;color:#1A1A1A;line-height:1.2;margin-bottom:1rem;">${escapeHtml(tool.h1 || tool.name)}</h1>
          <p style="font-size:1.125rem;color:#4A5568;line-height:1.6;margin-bottom:1.5rem;">${escapeHtml(tool.tagline)}</p>
        </header>
        <article style="font-size:1rem;color:#2D3748;line-height:1.8;white-space:pre-line;border-top:1px solid #E2E8F0;padding-top:1.5rem;">
          ${escapeHtml(tool.detailedDescription)}
        </article>
        ${highlightsHtml}
        ${howToUseHtml}
        ${faqHtml}
      </main>
    `;
  }

  // 2. Study guide detail page
  if (metadata.guide) {
    const guide = metadata.guide;
    return `
      <main style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;margin-bottom:1.5rem;color:#718096;">
          <a href="/" style="color:#856526;text-decoration:none;font-weight:600;">Aşkar Yayınları</a> &gt; 
          <a href="/rehber" style="color:#856526;text-decoration:none;font-weight:600;">Ders Rehberleri</a> &gt; 
          <span>${escapeHtml(guide.ad)}</span>
        </nav>
        <header>
          <h1 style="font-size:2.25rem;font-weight:800;color:#1A1A1A;line-height:1.2;margin-bottom:1rem;">${escapeHtml(guide.ad)} Nasıl Çalışılır?</h1>
          <p style="font-size:1.125rem;color:#4A5568;line-height:1.6;margin-bottom:1.5rem;">Eğitim koçu Mehmet Ali Aşkar'dan ${escapeHtml(guide.ad)} ders çalışma taktikleri, net artırma stratejileri ve haftalık plan önerileri.</p>
        </header>
        ${guide.kisa ? `
          <section style="margin-top:2rem;">
            <h2 style="font-size:1.375rem;font-weight:700;color:#1A1A1A;margin-bottom:1rem;">Kritik Taktikler</h2>
            <ul style="list-style-type:disc;padding-left:1.5rem;line-height:1.8;color:#2D3748;">
              ${guide.kisa.map(k => `<li>${escapeHtml(k)}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
      </main>
    `;
  }

  // 3. Main tools catalog page
  if (metadata.route === '/uygulamalar') {
    return `
      <main style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <header>
          <h1 style="font-size:2.25rem;font-weight:800;color:#1A1A1A;line-height:1.2;margin-bottom:1rem;">Eğitim Uygulamaları ve Hesaplama Robotları 2026</h1>
          <p style="font-size:1.125rem;color:#4A5568;line-height:1.6;margin-bottom:2rem;">2026 LGS ve YKS TYT-AYT net ve puan hesaplama motorları, Pomodoro ders çalışma sayacı, kelime analiz robotu, APA 7 kaynakça ve çocuk uygulaması.</p>
        </header>
        <section>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
            ${toolsData.map(tool => `
              <article style="border:1px solid #E2E8F0;border-radius:12px;padding:1.25rem;">
                <h2 style="font-size:1.125rem;font-weight:700;color:#1A1A1A;margin-bottom:0.5rem;">
                  <a href="/uygulamalar/${tool.slug}" style="color:#1A1A1A;text-decoration:none;">${escapeHtml(tool.name)}</a>
                </h2>
                <p style="font-size:0.875rem;color:#4A5568;line-height:1.5;margin-bottom:1rem;">${escapeHtml(tool.tagline)}</p>
                <a href="/uygulamalar/${tool.slug}" style="display:inline-block;padding:0.5rem 1rem;background:#1A1A1A;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;font-weight:600;">Uygulamayı Aç &rarr;</a>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
    `;
  }

  // 4. Homepage ('/')
  if (metadata.route === '/' || metadata.route === '/magaza') {
    const booksHtml = booksData.length > 0
      ? booksData.map(b => `
          <article style="border:1px solid #E2E8F0;border-radius:12px;padding:1.25rem;">
            <span style="font-size:0.75rem;font-weight:700;color:#856526;text-transform:uppercase;">${escapeHtml(b.badge || '')}</span>
            <h3 style="font-size:1.125rem;font-weight:700;color:#1A1A1A;margin:0.5rem 0;">${escapeHtml(b.title)}</h3>
            <p style="font-size:0.875rem;color:#4A5568;line-height:1.5;margin-bottom:1rem;">${escapeHtml(b.subtitle || '')}</p>
            <a href="${b.shopierUrl || '#'}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:0.5rem 1rem;background:#1A1A1A;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;font-weight:600;">Shopier ile İndir (${escapeHtml(b.price || 'Ücretsiz')}) &rarr;</a>
          </article>
        `).join('')
      : '';

    const toolsSummaryHtml = toolsData.slice(0, 9).map(t => `
      <article style="border:1px solid #E2E8F0;border-radius:12px;padding:1.25rem;">
        <span style="font-size:0.75rem;font-weight:700;color:#856526;text-transform:uppercase;">${escapeHtml(t.badge || '')}</span>
        <h3 style="font-size:1.125rem;font-weight:700;color:#1A1A1A;margin:0.5rem 0;">
          <a href="/uygulamalar/${t.slug}" style="color:#1A1A1A;text-decoration:none;">${escapeHtml(t.name)}</a>
        </h3>
        <p style="font-size:0.875rem;color:#4A5568;line-height:1.5;margin-bottom:1rem;">${escapeHtml(t.tagline)}</p>
        <a href="/uygulamalar/${t.slug}" style="display:inline-block;padding:0.5rem 1rem;background:#1A1A1A;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;font-weight:600;">Uygulamayı Aç &rarr;</a>
      </article>
    `).join('');

    return `
      <main style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <header style="text-align:center;margin-bottom:3rem;">
          <h1 style="font-size:2.5rem;font-weight:900;color:#1A1A1A;line-height:1.2;margin-bottom:1rem;">Doğru Sistemle Çalış, Sınavı Kazan</h1>
          <p style="font-size:1.125rem;color:#4A5568;max-width:760px;margin:0 auto;line-height:1.6;">
            Aşkar Yayınları resmi dijital PDF kütüphanesi. Eğitim koçu ve yazar Mehmet Ali Aşkar tarafından hazırlanan 5-8. sınıf LGS ve 9-12. sınıf YKS koçluk kitapları, ücretsiz MEB/ÖSYM hesaplama robotları ve sınav rehberleri.
          </p>
        </header>

        <section style="margin-bottom:3.5rem;">
          <h2 style="font-size:1.75rem;font-weight:800;color:#1A1A1A;border-bottom:2px solid #E2E8F0;padding-bottom:0.75rem;margin-bottom:1.5rem;">Dijital Koçluk ve Sınav Kitaplarımız</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
            ${booksHtml}
          </div>
        </section>

        <section style="margin-bottom:3.5rem;">
          <h2 style="font-size:1.75rem;font-weight:800;color:#1A1A1A;border-bottom:2px solid #E2E8F0;padding-bottom:0.75rem;margin-bottom:1.5rem;">Ücretsiz Eğitim Uygulamaları & Hesaplama Robotları</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
            ${toolsSummaryHtml}
          </div>
        </section>

        <section style="margin-bottom:3.5rem;">
          <h2 style="font-size:1.75rem;font-weight:800;color:#1A1A1A;border-bottom:2px solid #E2E8F0;padding-bottom:0.75rem;margin-bottom:1.5rem;">Sıkça Sorulan Sorular (SSS)</h2>
          <dl style="line-height:1.8;">
            <dt style="font-weight:700;color:#1A1A1A;margin-top:1.25rem;">Aşkar Yayınları dijital PDF kitapları nasıl teslim edilir?</dt>
            <dd style="color:#4A5568;margin-left:0;margin-top:0.25rem;">Shopier güvenli ödeme altyapısıyla satın alım tamamlandığı anda ekranda anında indirme butonu belirir ve kayıtlı e-posta adresinize otomatik indirme bağlantısı gönderilir. Cihazınıza kaydedip hemen okumaya başlayabilirsiniz.</dd>
            <dt style="font-weight:700;color:#1A1A1A;margin-top:1.25rem;">LGS ve YKS puan hesaplama araçları ücretsiz mi?</dt>
            <dd style="color:#4A5568;margin-left:0;margin-top:0.25rem;">Evet. LGS puan hesaplama, YKS puan hesaplama, tercih robotları, takdir teşekkür ve lise dönem ortalama hesaplama araçlarımızın tamamı öğrenciler ve veliler için tamamen ücretsizdir.</dd>
            <dt style="font-weight:700;color:#1A1A1A;margin-top:1.25rem;">Koçluk kitapları hangi sınıfları kapsar?</dt>
            <dd style="color:#4A5568;margin-left:0;margin-top:0.25rem;">5. sınıftan 12. sınıfa kadar her seviyeye özel koçluk kitaplarımız mevcuttur. 5, 6, 7. sınıf ortaokul koçluğu, 8. sınıf LGS hazırlık, 9, 10, 11. sınıf lise koçluğu ve 12. sınıf/mezun YKS derece sistemi kitaplarımız bulunmaktadır.</dd>
          </dl>
        </section>
      </main>
    `;
  }

  return '';
};

// Process ALL routes including '/'
for (const metadata of uniqueRoutes) {
  const canonical = `${siteOrigin}${metadata.route === '/' ? '' : metadata.route}`;
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const ogImage = metadata.image || `${siteOrigin}/resimler/logo.jpg`;
  const schema = JSON.stringify(getSchema(metadata)).replaceAll('<', '\\u003c');
  const prerenderBody = getPrerenderedHtml(metadata);

  let html = sourceHtml
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${ogImage}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${ogImage}" />`);

  if (prerenderBody) {
    html = html.replace('<div id="root"></div>', `<div id="root">${prerenderBody}</div>`);
  }

  // Inject schema if not present or replace existing
  if (!html.includes('<script type="application/ld+json">')) {
    html = html.replace('</head>', `    <script type="application/ld+json">${schema}</script>\n  </head>`);
  } else {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${schema}</script>`);
  }

  const outputPath = metadata.route === '/'
    ? path.join(distRoot, 'index.html')
    : path.join(distRoot, metadata.route.slice(1), 'index.html');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
}

const sitemapEntries = uniqueRoutes.map((metadata) => `  <url>
    <loc>${siteOrigin}${metadata.route}</loc>
    <lastmod>2026-10-27</lastmod>
    <changefreq>${metadata.route.startsWith('/uygulamalar/') || metadata.route.startsWith('/rehber/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${metadata.route === '/' ? '1.0' : metadata.route.startsWith('/uygulamalar/') ? '0.9' : metadata.route.startsWith('/rehber/') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Successfully generated SEO pre-rendered HTML for ${uniqueRoutes.length} routes (including root) and updated sitemap.xml with 2026-10-27 lastmod.`);
