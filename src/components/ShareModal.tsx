import React, { useState } from 'react';
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
  Globe
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

  if (!isOpen || !item) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.askaryayinlari.com.tr';
  const targetUrl = item.isSiteShare
    ? (item.url || 'https://www.askaryayinlari.com.tr/')
    : (item.shopierUrl || currentOrigin);

  const publisherName = 'AŞKAR YAYINLARI';

  // Share text template
  let shareTitle = '';
  let shareMessage = '';

  if (item.isSiteShare) {
    shareTitle = `Aşkar Yayınları - Dijital PDF Kütüphanesi`;
    shareMessage = `📚 *${publisherName}* - Dijital PDF Kütüphanesi\n\n"${item.subtitle}"\n\n🌐 Web Sitesi: ${targetUrl}`;
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
          ? `📚 ${publisherName} - ${item.subtitle}`
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
            ? `📚 ${publisherName}\n"${item.subtitle}"`
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
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#1A1A1A]/10 relative animate-in zoom-in-95 duration-200"
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

            {/* Daha Altında ise Metin */}
            <p className="text-xs sm:text-[13px] text-[#1A1A1A]/85 font-medium leading-relaxed font-sans px-2 italic">
              "{item.subtitle}"
            </p>
          </div>
        ) : (
          <div className="bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl p-3.5 flex gap-3.5 items-center mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-[#1A1A1A]/10 bg-white shadow-xs">
              <ImgWithFallback
                src={item.image}
                alt={`${item.title} - Aşkar Yayınları`}
                className="w-full h-full object-cover"
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
      </div>
    </div>
  );
};
