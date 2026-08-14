// IndexedDB store for zero-loss local image persistence

const DB_NAME = 'AskarImageStore';
const STORE_NAME = 'images';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memory cache to avoid repeated DB reads
const imageCache: Record<string, string> = {};
const listeners: Set<() => void> = new Set();

export function subscribeImageChanges(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

export async function saveImageToStore(filename: string, fileOrDataUrl: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    const processDataUrl = async (dataUrl: string) => {
      const cleanName = filename.toLowerCase().split('/').pop() || filename.toLowerCase();
      imageCache[cleanName] = dataUrl;

      // Also persist to server disk asynchronously
      try {
        fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: cleanName, dataUrl }),
        }).catch((e) => console.warn('Server upload sync warning:', e));
      } catch (err) {
        // non-blocking
      }

      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(dataUrl, cleanName);
        tx.oncomplete = () => {
          notifyListeners();
          resolve(dataUrl);
        };
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        // Fallback to memory cache
        notifyListeners();
        resolve(dataUrl);
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      processDataUrl(fileOrDataUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        processDataUrl(dataUrl);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

export async function getStoredImage(filename: string): Promise<string | null> {
  const cleanName = filename.toLowerCase().split('/').pop() || filename.toLowerCase();
  
  if (imageCache[cleanName]) {
    return imageCache[cleanName];
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(cleanName);
      request.onsuccess = () => {
        const result = request.result as string | undefined;
        if (result) {
          imageCache[cleanName] = result;
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function getCachedImageSync(filename: string): string | null {
  const cleanName = filename.toLowerCase().split('/').pop() || filename.toLowerCase();
  return imageCache[cleanName] || null;
}
