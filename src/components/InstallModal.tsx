import React from 'react';
import { X, ArrowDownToLine, Smartphone, Tablet, Share2, PlusSquare, MoreVertical, CheckCircle2 } from 'lucide-react';
import { ImgWithFallback } from './ImgWithFallback';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  isAndroid: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  onDirectInstall: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  isAndroid,
  isInstallable,
  isInstalled,
  onDirectInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal"
        className="bg-[#FAF9F6] w-full max-w-lg rounded-2xl border border-[#C9A86A]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1A1A1A] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-5 flex items-center justify-between border-b border-[#C9A86A]/30">
          <div className="flex items-center gap-3">
            <ImgWithFallback
              src="/resimler/logo.jpg"
              alt="Aşkar Yayınları"
              className="w-10 h-10 rounded-full border border-[#C9A86A]/60 object-cover bg-black shrink-0"
            />
            <div>
              <h3 className="font-serif font-bold text-base text-white tracking-wide flex items-center gap-1.5">
                <ArrowDownToLine className="w-4 h-4 text-[#C9A86A]" />
                Ana Ekrana İndir
              </h3>
              <p className="text-[11px] text-[#C9A86A] font-medium tracking-wider">
                Telefon & Tablet İçin Aşkar Yayınları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed">
          {/* Status Message */}
          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Uygulama Zaten Yüklü!</div>
                <div className="text-xs mt-1 text-emerald-800">
                  Aşkar Yayınları cihazınızın ana ekranına eklenmiş durumda. Ana ekranınızdaki Aşkar simgesine tıklayarak doğrudan kullanabilirsiniz.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Direct Install CTA Button if browser supports 1-click install */}
              {isInstallable && (
                <div className="bg-[#C9A86A]/15 border border-[#C9A86A]/40 rounded-xl p-4 text-center space-y-2.5">
                  <div className="text-xs font-semibold text-[#1A1A1A]">
                    Tek Dokunuşla Ana Ekrana İndirin:
                  </div>
                  <button
                    onClick={() => {
                      onDirectInstall();
                    }}
                    className="w-full bg-[#1A1A1A] hover:bg-black text-[#C9A86A] hover:text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.01] active:scale-95"
                  >
                    <ArrowDownToLine className="w-4 h-4 text-[#C9A86A]" />
                    <span>Şimdi Ana Ekrana Ekle</span>
                  </button>
                </div>
              )}

              {/* iPhone / iPad Guide */}
              {(isIOS || (!isAndroid && !isInstallable)) && (
                <div className="bg-white rounded-xl p-4 border border-black/10 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                    <Smartphone className="w-4 h-4 text-[#C9A86A]" />
                    <span>iPhone & iPad (Safari) İçin Kurulum:</span>
                  </div>
                  <ol className="space-y-2 text-xs text-[#1A1A1A]/80 list-decimal list-inside pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">1.</span>
                      <span>
                        Safari alt veya üst menüsündeki <strong className="text-[#1A1A1A] inline-flex items-center gap-1 font-semibold">Paylaş <Share2 className="w-3.5 h-3.5 text-[#C9A86A] inline" /></strong> simgesine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">2.</span>
                      <span>
                        Menüyü aşağı kaydırarak <strong className="text-[#1A1A1A] inline-flex items-center gap-1 font-semibold">"Ana Ekrana Ekle" <PlusSquare className="w-3.5 h-3.5 text-[#C9A86A] inline" /></strong> seçeneğine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">3.</span>
                      <span>
                        Sağ üst köşedeki <strong className="text-[#1A1A1A] font-semibold">"Ekle"</strong> butonuna dokunun. Aşkar Yayınları uygulamanız anında ana ekrana inecektir!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Guide */}
              {(isAndroid || (!isIOS && !isInstallable)) && (
                <div className="bg-white rounded-xl p-4 border border-black/10 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                    <Tablet className="w-4 h-4 text-[#C9A86A]" />
                    <span>Android & Tablet (Chrome / Tarayıcı) İçin:</span>
                  </div>
                  <ol className="space-y-2 text-xs text-[#1A1A1A]/80 list-decimal list-inside pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">1.</span>
                      <span>
                        Tarayıcınızın sağ üstündeki <strong className="text-[#1A1A1A] inline-flex items-center gap-1 font-semibold">üç nokta <MoreVertical className="w-3.5 h-3.5 text-[#C9A86A] inline" /></strong> menüsüne dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">2.</span>
                      <span>
                        <strong className="text-[#1A1A1A] font-semibold">"Ana Ekrana Ekle"</strong> veya <strong className="text-[#1A1A1A] font-semibold">"Uygulamayı Yükle"</strong> seçeneğine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#1A1A1A] shrink-0">3.</span>
                      <span>
                        Gelen onay penceresinde <strong className="text-[#1A1A1A] font-semibold">"Yükle"</strong> butonuna basın.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Features Pill */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-black/5 rounded-lg p-2.5">
                  <div className="font-bold text-xs text-[#1A1A1A]">Hızlı Erişim</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 mt-0.5">Tek tıkla anında açılır</div>
                </div>
                <div className="bg-black/5 rounded-lg p-2.5">
                  <div className="font-bold text-xs text-[#1A1A1A]">Yer Kaplamaz</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 mt-0.5">Hafif ve kesintisiz</div>
                </div>
                <div className="bg-black/5 rounded-lg p-2.5">
                  <div className="font-bold text-xs text-[#1A1A1A]">Her Zaman Güncel</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 mt-0.5">Otomatik yenilenir</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/5 border-t border-black/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
