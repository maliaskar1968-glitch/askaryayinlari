import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, CheckCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Internal WhatsApp target number (strictly kept hidden from user-visible UI)
const WA_PHONE = '905057162939';

export const WhatsAppSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStartChat = (messageText?: string) => {
    const textToSend = (messageText || customMessage.trim()) || 'Merhaba, bilgi almak istiyorum.';
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(textToSend)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const quickQuestions = [
    'Kitaplar hakkında bilgi almak istiyorum.',
    'PDF indirme sürecinde yardım alabilir miyim?',
    'Öğrenci koçluğu kitapları hakkında soru sormak istiyorum.',
  ];

  return (
    <div ref={popupRef} className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Popup Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#1A1A1A]/10 overflow-hidden text-[#1A1A1A] font-sans"
          >
            {/* Header */}
            <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-serif font-black text-lg border border-white/20">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#128C7E] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-wide leading-tight">
                    Aşkar Yayınları Destek
                  </h3>
                  <p className="text-[11px] text-emerald-100/90 font-sans flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>Çevrim içi • Canlı Destek</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#ECE5DD]/40 space-y-3 max-h-[360px] overflow-y-auto">
              {/* Automated Welcome / Prompt Message */}
              <div className="flex flex-col items-start space-y-1">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-[#1A1A1A]/5 max-w-[85%] text-left">
                  <p className="text-xs text-[#1A1A1A]/90 font-medium leading-relaxed">
                    Merhaba! 👋
                  </p>
                  <p className="text-sm font-semibold text-[#1A1A1A] mt-1 leading-snug">
                    Size nasıl yardımcı olabiliriz?
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[#1A1A1A]/40">
                    <span>Şimdi</span>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 px-1">
                  Hızlı Sorular
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleStartChat(q)}
                      className="text-left text-xs bg-white hover:bg-emerald-50 text-[#1A1A1A]/85 hover:text-emerald-800 p-2.5 rounded-xl border border-[#1A1A1A]/10 hover:border-emerald-500/40 transition-all cursor-pointer font-sans shadow-xs flex items-center justify-between group"
                    >
                      <span>{q}</span>
                      <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input & Direct Action Footer */}
            <div className="p-3 bg-white border-t border-[#1A1A1A]/10 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleStartChat();
                    }
                  }}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 text-xs bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-full px-3.5 py-2.5 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleStartChat()}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs shrink-0"
                  title="WhatsApp ile Gönder"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleStartChat()}
                  className="w-full bg-[#128C7E] hover:bg-[#0d6f63] text-white py-2 px-3 rounded-full text-[11px] font-medium tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp ile Doğrudan Bağlan</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main WhatsApp Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Canlı Destek"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40"
      >
        {/* Pulse effect rings */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping -z-10 pointer-events-none"></span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        <span className="hidden sm:inline font-sans text-xs font-bold tracking-wide text-white">
          {isOpen ? 'Kapat' : 'WhatsApp Destek'}
        </span>
      </button>
    </div>
  );
};
