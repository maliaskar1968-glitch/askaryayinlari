import React, { useState, useEffect } from 'react';
import { saveImageToStore, getStoredImage } from '../utils/imageStore';
import { Upload, CheckCircle2, Image as ImageIcon, X, RefreshCw, FolderPlus, Download, FileUp } from 'lucide-react';

interface ImageSlot {
  key: string;
  filename: string;
  title: string;
  description: string;
}

const TARGET_IMAGES: ImageSlot[] = [
  { key: 'logo', filename: 'logo.jpg', title: 'Aşkar Yayınları Logosu', description: 'Header ve footer logosu' },
  { key: 'cocuk', filename: 'cocuk.jpg', title: 'Çocuk Kitaplığı: Sevimli Deniz Altı Kaşifleri', description: 'Sevimli Deniz Altı Kaşifleri Kitap & Uygulama Kapağı' },
  { key: 'k5', filename: 'k5.jpg', title: '5. Sınıf Ortaokul Koçu', description: '5. Sınıf Kitap Kapağı' },
  { key: 'k6', filename: 'k6.jpg', title: '6. Sınıf Ortaokul Koçu', description: '6. Sınıf Kitap Kapağı' },
  { key: 'k7', filename: 'k7.jpg', title: '7. Sınıf Ortaokul Koçu', description: '7. Sınıf Kitap Kapağı' },
  { key: 'k8', filename: 'k8.jpg', title: '8. Sınıf LGS Koçu', description: '8. Sınıf LGS Kitap Kapağı' },
  { key: 'k_yks', filename: 'k_yks.jpg', title: 'YKS Koçu', description: 'YKS Koçluk Kitap Kapağı' },
  { key: 'k_simsek', filename: 'k_simsek.jpg', title: 'Şimşeğin Efendisi', description: 'Nikola Tesla Hikayesi Kapağı' },
  { key: 'k_atom', filename: 'k_atom.jpg', title: 'Atomun Kalbi', description: 'Ernest Rutherford Roman Kapağı' },
];

interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({ isOpen, onClose }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    const statusMap: Record<string, string> = {};
    for (const slot of TARGET_IMAGES) {
      const stored = await getStoredImage(slot.filename);
      if (stored) {
        statusMap[slot.filename] = stored;
      }
    }
    setLoadedImages(statusMap);
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const processFiles = async (files: FileList | File[]) => {
    let count = 0;
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const fileNameLower = file.name.toLowerCase();

      // Find matching slot or match by keywords
      let slot = TARGET_IMAGES.find((s) => {
        const sName = s.filename.toLowerCase();
        const baseName = sName.replace('.jpg', '');
        return fileNameLower === sName || fileNameLower.includes(baseName);
      });

      // Smart fuzzy matching for commonly uploaded files
      if (!slot) {
        if (fileNameLower.includes('chatgpt') || fileNameLower.includes('deniz') || fileNameLower.includes('kasif') || fileNameLower.includes('kaşif') || fileNameLower.includes('sevimli') || fileNameLower.includes('tosis') || fileNameLower.includes('lili')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'cocuk.jpg');
        } else if (fileNameLower.includes('tesla') || fileNameLower.includes('simsek') || fileNameLower.includes('şimşek')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k_simsek.jpg');
        } else if (fileNameLower.includes('atom') || fileNameLower.includes('rutherford')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k_atom.jpg');
        } else if (fileNameLower.includes('yks') || fileNameLower.includes('tyt') || fileNameLower.includes('ayt')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k_yks.jpg');
        } else if (fileNameLower.includes('8') || fileNameLower.includes('lgs')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k8.jpg');
        } else if (fileNameLower.includes('7')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k7.jpg');
        } else if (fileNameLower.includes('6')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k6.jpg');
        } else if (fileNameLower.includes('5')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'k5.jpg');
        } else if (fileNameLower.includes('logo')) {
          slot = TARGET_IMAGES.find((s) => s.filename === 'logo.jpg');
        }
      }

      if (slot) {
        await saveImageToStore(slot.filename, file);
        count++;

        // Send to server upload API if available
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl && slot) {
              await fetch('/api/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: slot.filename, dataUrl }),
              });
            }
          };
          reader.readAsDataURL(file);
        } catch {
          // Client store handles persistence
        }
      }
    }

    await loadStatus();
    if (count > 0) {
      setUploadMessage(`${count} adet orijinal görsel başarıyla kaydedildi!`);
      setTimeout(() => setUploadMessage(null), 4000);
    } else {
      setUploadMessage('Görsel otomatik eşleştirilemedi. Lütfen ilgili kitabın yanındaki "Yükle / Değiştir" butonunu kullanın.');
      setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  const handleExportBackup = () => {
    const exportData = JSON.stringify(loadedImages, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `askar_yayinlari_gorsel_paketi_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setUploadMessage('Tüm görseller JSON yedek paketi olarak indirildi!');
    setTimeout(() => setUploadMessage(null), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const content = evt.target?.result as string;
          const parsed = JSON.parse(content);
          let restored = 0;
          for (const [filename, dataUrl] of Object.entries(parsed)) {
            if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image')) {
              await saveImageToStore(filename, dataUrl);
              restored++;
            }
          }
          await loadStatus();
          setUploadMessage(`${restored} adet görsel yedekten başarıyla yüklendi!`);
          setTimeout(() => setUploadMessage(null), 4000);
        } catch {
          setUploadMessage('Geçersiz yedek dosyası!');
          setTimeout(() => setUploadMessage(null), 4000);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleSingleSlotUpload = (filename: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const renamedFile = new File([file], filename, { type: file.type });
      processFiles([renamedFile]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F8F7F4] border border-[#1A1A1A]/20 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderPlus className="w-5 h-5 text-[#C9A86A]" />
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide text-white">
                Aşkar Yayınları – Orijinal Görsel Yöneticisi
              </h3>
              <p className="text-[10px] text-white/60 tracking-wider">
                Yüklediğiniz dosyalar sıfır kalite kaybıyla ve orijinal haliyle kaydedilir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${
              dragActive
                ? 'border-[#C9A86A] bg-[#C9A86A]/10 scale-[1.01]'
                : 'border-[#1A1A1A]/20 bg-white hover:border-[#1A1A1A]/40'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 mx-auto text-[#1A1A1A]/50 mb-2" />
            <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Tüm Kitap Kapaklarını Buraya Sürükleyin veya Seçin
            </p>
            <p className="text-[11px] text-[#1A1A1A]/60 mt-1">
              Toplu olarak tüm resimleri (cocuk.jpg, logo.jpg, k5.jpg, k6.jpg, k7.jpg, k8.jpg, k_yks.jpg, k_simsek.jpg, k_atom.jpg) tek seferde yükleyebilirsiniz.
            </p>
          </div>

          {/* Backup / Export / Import Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#1A1A1A]/10 text-xs">
            <div className="text-neutral-600 font-medium text-[11px]">
              Yedekleme & Aktarma Araçları:
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                disabled={Object.keys(loadedImages).length === 0}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] font-bold flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
                title="Tüm yüklü görselleri JSON dosyası olarak kaydedin"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Paketi İndir (JSON)</span>
              </button>

              <label className="px-3 py-1.5 rounded-lg bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 text-[#856526] font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-[#C9A86A]/40">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
                <FileUp className="w-3.5 h-3.5" />
                <span>Paketi İçe Aktar</span>
              </label>
            </div>
          </div>

          {uploadMessage && (
            <div className="bg-[#1A1A1A] text-white px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* Slot Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-3 flex items-center justify-between">
              <span>Görsel Durumları ({Object.keys(loadedImages).length} / {TARGET_IMAGES.length} Yüklendi)</span>
              <button
                onClick={loadStatus}
                className="text-[10px] normal-case flex items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Yenile
              </button>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TARGET_IMAGES.map((slot) => {
                const isUploaded = Boolean(loadedImages[slot.filename]);
                const previewSrc = loadedImages[slot.filename];

                return (
                  <div
                    key={slot.key}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 bg-white transition-all ${
                      isUploaded ? 'border-emerald-500/40 bg-emerald-50/20' : 'border-[#1A1A1A]/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {isUploaded && previewSrc ? (
                          <img src={previewSrc} alt={slot.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-[#1A1A1A]/30" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1A1A1A] truncate">{slot.title}</div>
                        <div className="text-[10px] text-[#1A1A1A]/50 font-mono">{slot.filename}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Yüklendi
                        </span>
                      )}

                      <label className="shrink-0 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSingleSlotUpload(slot.filename, e)}
                          className="hidden"
                        />
                        <span
                          className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
                            isUploaded
                              ? 'bg-[#1A1A1A] text-[#C9A86A] hover:bg-black hover:text-white border border-[#C9A86A]/40'
                              : 'bg-[#C9A86A] text-[#1A1A1A] hover:bg-[#b89557] font-extrabold'
                          }`}
                          title={isUploaded ? 'Yeni bir görsel seçerek değiştirin' : 'Görsel yükleyin'}
                        >
                          <Upload className="w-3 h-3 shrink-0" />
                          <span>{isUploaded ? 'Değiştir' : 'Yükle'}</span>
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#1A1A1A]/5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
          <span className="text-[10px] text-neutral-500 font-mono">
            Kısayol: Ctrl + Shift + U
          </span>
          <button
            onClick={onClose}
            className="bg-[#1A1A1A] text-white hover:bg-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
