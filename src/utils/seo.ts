/**
 * SEO & Dynamic Meta Tags Utility
 * Follows the applet-seo skill guidelines for single-page applications.
 */

interface SeoMetadata {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object;
}

export function updatePageSeo(meta: SeoMetadata): void {
  // 1. Update Document Title
  if (meta.title) {
    document.title = meta.title;
  }

  // Helper to set/update a meta tag
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Helper to set canonical link
  const setCanonicalLink = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };

  // 2. Standard Meta Description
  if (meta.description) {
    setMetaTag('name', 'description', meta.description);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('name', 'twitter:description', meta.description);
  }

  // 3. OpenGraph & Twitter Titles
  if (meta.title) {
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('name', 'twitter:title', meta.title);
  }

  // 4. URL & Canonical
  const fullUrl = meta.url || (typeof window !== 'undefined' ? window.location.href : 'https://www.askaryayinlari.com.tr/');
  setMetaTag('property', 'og:url', fullUrl);
  setCanonicalLink(fullUrl);

  // 5. Image & Card
  const defaultImage = meta.image || 'https://www.askaryayinlari.com.tr/resimler/logo.jpg';
  setMetaTag('property', 'og:image', defaultImage);
  setMetaTag('name', 'twitter:image', defaultImage);
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('property', 'og:type', meta.type || 'website');
  setMetaTag('property', 'og:site_name', 'Aşkar Yayınları');

  // 6. JSON-LD Schema
  const schemaScriptId = 'applet-structured-data';
  let scriptTag = document.getElementById(schemaScriptId) as HTMLScriptElement | null;

  if (meta.schema) {
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(meta.schema, null, 2);
  } else if (scriptTag) {
    scriptTag.remove();
  }
}
