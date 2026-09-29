import jsPDF from 'jspdf';

let cachedRegularBase64: string | null = null;
let cachedBoldBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * jsPDF dokümanına Türkçe UTF-8 karakterleri (Ş, ş, İ, ı, Ğ, ğ, Ç, ç, Ö, ö, Ü, ü)
 * eksiksiz ve pürüzsüz basabilmesi için Roboto TTF fontunu ekler.
 */
export async function applyTurkishFont(doc: jsPDF): Promise<boolean> {
  try {
    // 1. Roboto Regular yükle ve önbelleğe al
    if (!cachedRegularBase64) {
      const res = await fetch('/fonts/Roboto-Regular.ttf');
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        cachedRegularBase64 = arrayBufferToBase64(buffer);
      }
    }

    // 2. Roboto Bold yükle ve önbelleğe al
    if (!cachedBoldBase64) {
      const resBold = await fetch('/fonts/Roboto-Bold.ttf');
      if (resBold.ok) {
        const bufferBold = await resBold.arrayBuffer();
        cachedBoldBase64 = arrayBufferToBase64(bufferBold);
      }
    }

    // 3. jsPDF VFS ve Font havuzuna kaydet
    if (cachedRegularBase64) {
      doc.addFileToVFS('Roboto-Regular.ttf', cachedRegularBase64);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    }

    if (cachedBoldBase64) {
      doc.addFileToVFS('Roboto-Bold.ttf', cachedBoldBase64);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    }

    if (cachedRegularBase64) {
      doc.setFont('Roboto', 'normal');
      return true;
    }
  } catch (err) {
    console.warn('Türkçe TTF font yüklenirken hata oluştu:', err);
  }

  return false;
}
