import React, { useState, useEffect } from 'react';
import { MAIN_SHOPIER_URL } from '../data/books';
import { ShoppingBag, ShieldCheck, Users, Eye } from 'lucide-react';
import { ImageUploaderModal } from './ImageUploaderModal';

export const Footer: React.FC = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState<number>(5007);
  const [onlineVisitors, setOnlineVisitors] = useState<number>(1);

  useEffect(() => {
    // Generate or retrieve persistent unique session ID for this browser tab/window
    let sessionId = sessionStorage.getItem('askar_presence_sid');
    let isNewSession = false;

    if (!sessionId) {
      sessionId = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('askar_presence_sid', sessionId);
      isNewSession = true;
    }

    // Function to ping heartbeat to server
    const sendHeartbeat = async (firstRun = false) => {
      try {
        const res = await fetch('/api/presence/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            isNewSession: firstRun && isNewSession,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.onlineCount === 'number') {
            setOnlineVisitors(Math.max(1, data.onlineCount));
          }
          if (typeof data.totalVisitors === 'number') {
            setTotalVisitors(data.totalVisitors);
          }
        }
      } catch {
        // Fallback: If offline or static, at least display 1 for the current active user
        setOnlineVisitors((prev) => Math.max(1, prev));
      }
    };

    // Initial heartbeat immediately
    sendHeartbeat(true);

    // Periodic heartbeat every 10 seconds to keep presence alive and fetch live numbers
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat(false);
    }, 10000);

    // Send leave signal on tab close/unload
    const handleLeave = () => {
      try {
        const payload = JSON.stringify({ sessionId });
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/presence/leave', blob);
        } else {
          fetch('/api/presence/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        // Ignore unload error
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);

    // Keyboard shortcut for image uploader
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setUploaderOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
      clearInterval(heartbeatInterval);
      handleLeave();
    };
  }, []);

  return (
    <>
      <footer className="text-center py-10 px-4 bg-[#FFFBF5] border-t border-neutral-200 mt-12 space-y-4">
        <div>
          <a
            href={MAIN_SHOPIER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C9A86A] hover:bg-amber-600 text-neutral-950 font-bold px-6 py-3 rounded-full text-xs tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>MAĞAZAMIZI ZİYARET ET</span>
          </a>
        </div>

        <div className="flex justify-center my-2">
          <div className="w-11 h-11 bg-neutral-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
            S
          </div>
        </div>

        <div className="text-xs font-bold text-neutral-700 tracking-wide">
          www.askaryayinlari.com.tr
        </div>

        <div className="text-[11px] text-neutral-500 max-w-md mx-auto leading-relaxed">
          © Aşkar Yayınları. Tüm hakları saklıdır. <br />
          <span className="inline-flex items-center gap-1 font-semibold text-neutral-700 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Shopier Güvenli Ödeme System • shopier.com/mehmetaliaskar
          </span>
        </div>

        {/* Live Visitor Counter - Subtle & Clean */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-4 sm:gap-6 px-4 py-2 bg-white/90 border border-[#C9A86A]/40 rounded-full shadow-2xs text-[11px] font-medium text-neutral-700">
            {/* Total Visitors */}
            <div className="flex items-center gap-1.5" title="Toplam Ziyaretçi Sayısı">
              <Users className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span className="text-neutral-500 hidden sm:inline">Toplam Ziyaretçi:</span>
              <span className="font-bold font-mono text-neutral-900">
                {totalVisitors.toLocaleString('tr-TR')}
              </span>
            </div>

            <div className="w-px h-3 bg-neutral-200" />

            {/* Online Visitors */}
            <div className="flex items-center gap-1.5" title="Anlık Çevrimiçi Ziyaretçi">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-neutral-500 hidden sm:inline">Çevrimiçi:</span>
              <span className="font-bold font-mono text-emerald-700 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-600 sm:hidden" />
                {onlineVisitors}
              </span>
            </div>
          </div>
        </div>
      </footer>

      <ImageUploaderModal
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
      />
    </>
  );
};
