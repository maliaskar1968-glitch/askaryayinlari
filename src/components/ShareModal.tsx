import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Share2,
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Mail,
  Smartphone,
  ExternalLink,
  Globe,
  QrCode,
  Download
} from 'lucide-react';
import { ImgWithFallback } from './ImgWithFallback';

export interface ShareItem {
  title: string;
  subtitle: string;
  image: string;
  shopierUrl?: string;
  url?: string;
  badge?: string;
  isSiteShare?: boolean;
}

interface ShareModalProps {
  item: ShareItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ item, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrSharedToast, setQrSharedToast] = useState(false);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.askaryayinlari.com.tr';
  const targetUrl = item
    ? (item.isSiteShare
        ? (item.url || 'https://www.askaryayinlari.com.tr/')
        : (item.shopierUrl || currentOrigin))
    : 'https://www.askaryayinlari.com.tr/';

  const publisherName = 'AŞKAR YAYINLARI';

  // Karekod oluşturma ve merkeze logo yerleştirme
  useEffect(() => {
    if (!isOpen || !item) return;

    let isMounted = true;
    const generateQr = async () => {
      try {
        setIsGeneratingQr(true);
        // Hata toleransı 'H' (High) seviyesinde yüksek çözünürlüklü QR kod
        const rawQr = await QRCode.toDataURL(targetUrl, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#1A1A1A',
            light: '#FFFFFF',
          },
        });

        // Ortasına Aşkar Yayınları logosunu eklemek için canvas kullanımı
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (isMounted) {
            setQrDataUrl(rawQr);
            setIsGeneratingQr(false);
          }
          return;
        }

        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 0, 0, 512, 512);

          const logoImg = new Image();
          logoImg.onload = () => {
            const centerX = 256;
            const centerY = 256;
            const radius = 54;

            ctx.save();
            // Logo arkasına beyaz dairesel zemin ve altın kenarlık
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#C9A86A';
            ctx.stroke();

            // Logoyu yuvarlak maske içine çiz
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logoImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            if (isMounted) {
              setQrDataUrl(canvas.toDataURL('image/png'));
              setIsGeneratingQr(false);
            }
          };
          logoImg.onerror = () => {
            if (isMounted) {
              setQrDataUrl(rawQr);
              setIsGeneratingQr(false);
            }
          };
          logoImg.src = '/resimler/logo.jpg';
        };
        qrImg.src = rawQr;
      } catch (err) {
        console.error('Karekod oluşturma hatası:', err);
        if (isMounted) setIsGeneratingQr(false);
      }
    };

    generateQr();

    return () => {
      isMounted = false;
    };
  }, [isOpen, item, targetUrl]);

  if (!isOpen || !item) return null;

  // Karekod Paylaş Fonksiyonu
  const handleShareQrCode = async () => {
    if (!showQrCode) {
      setShowQrCode(true);
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (qrDataUrl && navigator.canShare) {
          try {
            const res = await fetch(qrDataUrl);
            const blob = await res.blob();
            const file = new File([blob], 'askar-yayinlari-karekod.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'Aşkar Yayınları - Web Sitesi Karekodu',
                text: 'Aşkar Yayınları web sitesine ulaşmak için bu karekodu telefonunuzla okutabilirsiniz:\n' + targetUrl,
                files: [file],
              });
              return;
            }
          } catch {
            // Dosya paylaşımı desteklenmiyorsa URL paylaşımına devam et
          }
        }

        await navigator.share({
          title: 'Aşkar Yayınları - Web Sitesi Karekodu',
          text: `Aşkar Yayınları web sitesi (${targetUrl}). Telefon kameranızla karekodu okutarak hemen ziyaret edebilirsiniz.`,
          url: targetUrl,
        });
      } catch {
        // İptal edildi
      }
    } else {
      await handleCopyLink();
      setQrSharedToast(true);
      setTimeout(() => setQrSharedToast(false), 3000);
    }
  };

  // Karekod İndir Fonksiyonu (PNG)
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'askar-yayinlari-karekod.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Share text template
  let shareTitle = '';
  let shareMessage = '';

  if (item.isSiteShare) {
    shareTitle = `Aşkar Yayınları - Çocuğunuz Kendi Çalışma Sistemini Kursun`;
    shareMessage = `📚 *${publisherName}* - Çocuğunuz Kendi Çalışma Sistemini Kursun\n\n"${item.subtitle}"\n\n🌐 Web Sitesi: ${targetUrl}`;
  } else {
    shareTitle = `${item.title} - ${publisherName}`;
    shareMessage = `📚 *${item.title}*\n${item.subtitle}\n\n🏛 *${publisherName}*\n🛒 Shopier Erişimi: ${targetUrl}`;
  }

  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(targetUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  // Social Links
  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20bd5a] text-white',
      url: `https://api.whatsapp.com/send?text=${encodedMessage}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#229ED9] hover:bg-[#1f8ec3] text-white',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
        item.isSiteShare
          ? `📚 ${publisherName} - Çocuğunuz Kendi Çalışma Sistemini Kursun\n"${item.subtitle}"`
          : `📚 ${item.title} - ${publisherName}\n${item.subtitle}`
      )}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-[#000000] hover:bg-[#222222] text-white',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'E-Posta',
      icon: Mail,
      color: 'bg-[#EA4335] hover:bg-[#d9382b] text-white',
      url: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${shareMessage}\n\nZiyaret Et: ${targetUrl}`)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = targetUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: item.isSiteShare
            ? `📚 ${publisherName}\nÇocuğunuz Kendi Çalışma Sistemini Kursun\n"${item.subtitle}"`
            : `📚 ${item.title} - ${publisherName}\n${item.subtitle}`,
          url: targetUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#1A1A1A]/10 relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A86A]/15 flex items-center justify-center text-[#856526]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
                {item.isSiteShare ? 'Aşkar Yayınları Paylaş' : 'Kitabı Paylaş'}
              </h3>
              <p className="text-[10px] font-mono text-[#1A1A1A]/50 uppercase tracking-wider">AŞKAR YAYINLARI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]/70 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Card */}
        {item.isSiteShare ? (
          <div className="bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl p-4 text-center mb-5">
            {/* En Üstte: Logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A86A]/50 bg-black mx-auto mb-2 shadow-xs">
              <ImgWithFallback
                src={item.image}
                alt="Aşkar Yayınları Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="font-serif font-black text-sm text-[#1A1A1A] tracking-tight">
              AŞKAR YAYINLARI
            </div>
            
            {/* Altında: Sayfanın Linki */}
            <div className="mt-1 mb-2.5">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#856526] hover:underline font-semibold bg-[#C9A86A]/15 px-2.5 py-0.5 rounded-full"
              >
                <Globe className="w-3 h-3" />
                <span>{targetUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            </div>

            {/* Büyük puntolu başlık */}
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A] tracking-tight mt-1 mb-1">
              Çocuğunuz Kendi Çalışma Sistemini Kursun
            </h4>

            {/* Küçültülmüş tek satır metin */}
            <p
              className="text-[11px] sm:text-xs text-[#1A1A1A]/70 font-medium font-sans px-1 italic truncate whitespace-nowrap overflow-hidden text-ellipsis block"
              title={item.subtitle}
            >
              "{item.subtitle}"
            </p>
          </div>
        ) : (
          <div className="bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl p-3.5 flex gap-3.5 items-center mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-[#1A1A1A]/10 bg-white shadow-xs flex items-center justify-center">
              <ImgWithFallback
                src={item.image}
                alt={`${item.title} - Aşkar Yayınları`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-mono font-bold tracking-widest text-[#856526] uppercase mb-0.5">
                AŞKAR YAYINLARI
              </div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A] truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#1A1A1A]/60 font-sans truncate mb-1">
                {item.subtitle}
              </p>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[#1A1A1A] hover:text-[#C9A86A] underline truncate"
              >
                <span>Shopier Erişim Linki</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        )}

        {/* Social Share Buttons */}
        <div className="space-y-3 mb-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 font-semibold">
            Sosyal Medyada Paylaş
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold font-sans transition-transform active:scale-95 shadow-xs ${link.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              );
            })}

            {hasNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold font-sans bg-[#1A1A1A] hover:bg-black text-white transition-transform active:scale-95 shadow-xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#C9A86A]" />
                <span>Diğer</span>
              </button>
            )}
          </div>
        </div>

        {/* Direct Link Copy */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 font-semibold mb-1.5">
            {item.isSiteShare ? 'Sayfa Bağlantısını Kopyala' : 'Shopier Bağlantısını Kopyala'}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="flex-1 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A]/80 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A1A] hover:bg-black text-white active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* KAREKOD BÖLÜMÜ: "KODU GÖSTER" VE "KAREKODU PAYLAŞ" */}
        <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 font-semibold flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>SİTE KAREKODU (QR KOD)</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-sans font-semibold">
              Kamerayla Okutun
            </span>
          </div>

          {/* İki Buton: Kodu Göster ve Karekodu Paylaş */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowQrCode((prev) => !prev)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
                showQrCode
                  ? 'bg-[#1A1A1A] hover:bg-black text-white'
                  : 'bg-[#C9A86A] hover:bg-[#b89555] text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{showQrCode ? 'Kodu Gizle' : 'Kodu Göster'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareQrCode}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition-all duration-200 active:scale-95 shadow-xs bg-[#1A1A1A] hover:bg-black text-white cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#C9A86A]" />
              <span>Karekodu Paylaş</span>
            </button>
          </div>

          {/* Açılan Karekod Kartı */}
          {showQrCode && (
            <div className="mt-3 p-4 bg-[#F8F7F4] border border-[#C9A86A]/40 rounded-2xl text-center animate-in fade-in zoom-in-95 duration-200 shadow-inner">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-[#1A1A1A]/10 mb-3 relative">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Aşkar Yayınları Karekod"
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg block object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs font-sans text-neutral-400">
                    {isGeneratingQr ? 'Karekod hazırlanıyor...' : 'Karekod yüklenemedi'}
                  </div>
                )}
              </div>

              {/* Bilgi Kutusu */}
              <div className="bg-white/90 border border-[#1A1A1A]/8 rounded-xl p-3 mb-3 text-left">
                <div className="flex items-start gap-2.5 text-xs font-sans text-[#1A1A1A]/80 leading-relaxed">
                  <span className="text-lg leading-none shrink-0">📸</span>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-[13px] mb-0.5">
                      Kameranızı Doğrultun veya Fotoğrafını Çekin
                    </span>
                    <span className="text-[11px] text-[#1A1A1A]/70">
                      Bu karekodun fotoğrafını çeken veya telefon kamerasını doğrultan kişi doğrudan <b>askaryayinlari.com.tr</b> sitesine yönlendirilir.
                    </span>
                  </div>
                </div>
              </div>

              {/* Karekod İndir ve Paylaş Butonları */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-sans font-bold bg-[#1A1A1A] hover:bg-black text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>Karekodu İndir</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareQrCode}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-sans font-bold bg-[#C9A86A] hover:bg-[#b89555] text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Karekodu Paylaş</span>
                </button>
              </div>

              {qrSharedToast && (
                <div className="mt-2 text-[11px] text-emerald-700 font-sans font-semibold">
                  ✓ Bağlantı panoya kopyalandı!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
