import React, { useState } from 'react';
import { PageTab } from '../types';
import { MAIN_SHOPIER_URL } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { ImageUploaderModal } from './ImageUploaderModal';
import { ShareModal, ShareItem } from './ShareModal';
import { Store, X, Bell, CheckCircle2, Share2, ArrowDownToLine, BookOpen, Wrench, BookOpenText, User, Mail, Menu } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [siteShareModalOpen, setSiteShareModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [showKvkkDetail, setShowKvkkDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { isInstallable, isInstalled, isIOS, isAndroid, triggerInstall } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await triggerInstall();
      if (res === 'installed') {
        return;
      }
    }
    setInstallModalOpen(true);
  };

  const siteShareData: ShareItem = {
    isSiteShare: true,
    title: 'Aşkar Yayınları',
    subtitle: 'Ezber değil, kendi sistemini kuran kazanır. Tüm araçlar anında cebinde.',
    image: '/resimler/logo.jpg',
    url: 'https://www.askaryayinlari.com.tr/',
  };

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIaY9S0jgQjzW3zfm3H-e_0-cop7k5H719YrMCufxOLOK9QTeQTPcEhxraTWO_LLCzzg/exec';

  const handleFollowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailVal = email.trim();
    if (!emailVal || !emailVal.includes('@')) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (!kvkkConsent) {
      setErrorMessage('Lütfen KVKK onayını verin.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams({ email: emailVal })
      });

      let resData = null;
      try {
        resData = await response.json();
      } catch {
        // Fallback for non-JSON responses
      }

      if (resData && resData.success === false) {
        setErrorMessage('Tekrar deneyin');
      } else {
        setIsSuccess(true);
        setEmail('');
        setKvkkConsent(false);
      }
    } catch {
      // If network / CORS prevents reading, still provide positive feedback if request was sent or show error
      setIsSuccess(true);
      setEmail('');
      setKvkkConsent(false);
    } finally {
      setLoading(false);
    }
  };

  const closeFollowModal = () => {
    setFollowModalOpen(false);
    setIsSuccess(false);
    setErrorMessage('');
    setEmail('');
    setKvkkConsent(false);
    setShowKvkkDetail(false);
  };

  const navItems: { id: PageTab; label: string }[] = [
    { id: 'magaza', label: 'KİTAPLIK' },
    { id: 'uygulamalar', label: 'UYGULAMALAR' },
    { id: 'rehber', label: 'DERS REHBERİ' },
    { id: 'hakkimizda', label: 'HAKKIMIZDA' },
    { id: 'iletisim', label: 'İLETİŞİM' },
  ];

  const handleTabClick = (id: PageTab) => {
    setActiveTab(id);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-[#F8F7F4] border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
          {/* Logo Section */}
          <button
            type="button"
            onClick={() => handleTabClick('magaza')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            aria-label="Aşkar Yayınları ana sayfa"
          >
            <ImgWithFallback
              src="/resimler/logo.jpg"
              alt="Aşkar Yayınları Logo"
              className="w-8 h-8 rounded-full border border-[#C9A86A]/40 object-cover bg-black shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-xs"
            />
            <span className="font-serif font-bold text-sm sm:text-lg tracking-wide text-[#1A1A1A] leading-tight whitespace-nowrap">
              AŞKAR YAYINLARI
            </span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="navbar-install-btn"
              onClick={handleInstallClick}
              title="Telefon ve tablet için Ana Ekrana İndir"
              aria-label="Uygulamayı Ana Ekrana İndir"
              className="hidden md:inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#1A1A1A]/20 bg-transparent px-3 text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A] transition-colors hover:bg-white"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#C9A86A]" />
              YÜKLE
            </button>
            <button
              onClick={() => setFollowModalOpen(true)}
              title="Takip Et Kazan"
              aria-label="Takip Et Kazan"
              className="hidden md:inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#1A1A1A]/20 bg-transparent px-3 text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A] transition-colors hover:bg-white"
            >
              <Bell className="h-4 w-4 text-[#C9A86A]" />
              TAKİP ET KAZAN
            </button>
            <button
              type="button"
              onClick={() => setSiteShareModalOpen(true)}
              title="Aşkar Yayınları Paylaş"
              className="hidden md:inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#1A1A1A]/20 bg-transparent px-3 text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A] transition-colors hover:bg-white"
            >
              <Share2 className="h-4 w-4 text-[#C9A86A]" />
              PAYLAŞ
            </button>
            <a
              href={MAIN_SHOPIER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-black bg-black px-3 text-[10px] uppercase tracking-wider font-semibold text-white transition-colors hover:bg-[#1A1A1A]"
            >
              <Store className="w-3.5 h-3.5 text-[#C9A86A]" />
              MAĞAZA
            </a>
          </div>
        </div>
      </header>

      <nav
        aria-label="Ana navigasyon"
        className="sticky top-0 z-50 relative bg-[#F8F7F4]/95 backdrop-blur-md border-y border-[#1A1A1A]/10 shadow-sm"
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-14 md:h-12 flex items-center">
          <div className="hidden md:flex w-full h-full items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'hakkimizda' && activeTab === 'hakkimda');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`h-full border-b-2 pt-1 text-sm uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'border-black font-bold text-black'
                      : 'border-transparent font-medium text-zinc-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="grid w-full grid-cols-4 md:hidden">
            <button
              type="button"
              onClick={() => handleTabClick('magaza')}
              aria-current={activeTab === 'magaza' ? 'page' : undefined}
              className={`flex h-12 flex-col items-center justify-center gap-0.5 border-b-2 text-[10px] font-semibold transition-colors ${activeTab === 'magaza' ? 'border-black text-black' : 'border-transparent text-zinc-500'}`}
            >
              <BookOpen className="h-4 w-4" />
              Kitaplık
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('uygulamalar')}
              aria-current={activeTab === 'uygulamalar' ? 'page' : undefined}
              className={`flex h-12 flex-col items-center justify-center gap-0.5 border-b-2 text-[10px] font-semibold transition-colors ${activeTab === 'uygulamalar' ? 'border-black text-black' : 'border-transparent text-zinc-500'}`}
            >
              <Wrench className="h-4 w-4" />
              Araçlar
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('rehber')}
              aria-current={activeTab === 'rehber' ? 'page' : undefined}
              className={`flex h-12 flex-col items-center justify-center gap-0.5 border-b-2 text-[10px] font-semibold transition-colors ${activeTab === 'rehber' ? 'border-black text-black' : 'border-transparent text-zinc-500'}`}
            >
              <BookOpenText className="h-4 w-4" />
              Rehber
            </button>
            <button
              type="button"
              onClick={() => setMobileMoreOpen((open) => !open)}
              aria-expanded={mobileMoreOpen}
              className={`flex h-12 flex-col items-center justify-center gap-0.5 border-b-2 text-[10px] font-semibold transition-colors ${mobileMoreOpen ? 'border-black text-black' : 'border-transparent text-zinc-500'}`}
            >
              {mobileMoreOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Daha Fazla
            </button>
          </div>
        </div>
        {mobileMoreOpen && (
          <div className="absolute inset-x-0 top-full border-t border-[#1A1A1A]/10 bg-[#F8F7F4] px-4 py-3 shadow-lg md:hidden">
            <div className="mx-auto grid max-w-md grid-cols-2 gap-1">
              <button type="button" onClick={() => handleTabClick('hakkimizda')} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-white">
                <User className="h-4 w-4 text-[#9A783C]" /> Hakkımızda
              </button>
              <button type="button" onClick={() => handleTabClick('iletisim')} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-white">
                <Mail className="h-4 w-4 text-[#9A783C]" /> İletişim
              </button>
              <button type="button" onClick={() => { setMobileMoreOpen(false); setSiteShareModalOpen(true); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-white">
                <Share2 className="h-4 w-4 text-[#9A783C]" /> Paylaş
              </button>
              <button type="button" onClick={() => { setMobileMoreOpen(false); handleInstallClick(); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-white">
                <ArrowDownToLine className="h-4 w-4 text-[#9A783C]" /> Yükle
              </button>
              <button type="button" onClick={() => { setMobileMoreOpen(false); setFollowModalOpen(true); }} className="col-span-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-white">
                <Bell className="h-4 w-4 text-[#9A783C]" /> Takip Et Kazan
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* TAKİP ET KAZAN Modal */}
      {followModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F8F7F4] border border-[#1A1A1A]/20 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={closeFollowModal}
              className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 rounded-lg hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  Takip için teşekkürler! ✅
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
                  Yeni kitaplar ve özel fırsatlar mailine gelecek.
                </p>
                <div className="pt-2">
                  <button
                    onClick={closeFollowModal}
                    className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/40 flex items-center justify-center mx-auto text-[#856526] mb-3">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                    Takip Et Kazan
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans max-w-sm mx-auto">
                    Yeni PDF kitaplar, özel indirimler ve LGS-YKS hazırlık fırsatlarından ilk sen haberdar ol.
                  </p>
                </div>

                <form onSubmit={handleFollowSubmit} className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="followEmail" className="block text-[11px] font-bold text-[#1A1A1A]/80 uppercase tracking-wider mb-1.5 font-sans">
                      E-posta adresiniz
                    </label>
                    <input
                      type="email"
                      id="followEmail"
                      required
                      placeholder="E-posta adresiniz"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:outline-none text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 font-sans shadow-2xs"
                    />
                  </div>

                  {/* KVKK Checkbox */}
                  <label
                    htmlFor="kvkk_onay"
                    className="flex gap-2 items-start text-[10px] text-[#555] mt-2.5 text-left cursor-pointer font-sans select-none"
                  >
                    <input
                      type="checkbox"
                      id="kvkk_onay"
                      required
                      checked={kvkkConsent}
                      onChange={(e) => {
                        setKvkkConsent(e.target.checked);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-[#1A1A1A]/30 text-[#1A1A1A] focus:ring-0 focus:outline-none accent-[#1A1A1A] cursor-pointer shrink-0"
                    />
                    <span>
                      6698 sayılı KVKK kapsamında{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowKvkkDetail((prev) => !prev);
                        }}
                        className="underline text-[#000] font-semibold hover:text-[#C9A86A] cursor-pointer inline"
                      >
                        Aydınlatma Metnini
                      </button>{' '}
                      okudum. E-posta adresimin Aşkar Yayınları (Veri Sorumlusu: Mehmet Ali Askar - Antalya) tarafından bülten ve kampanya duyuruları için işlenmesine açık rıza veriyorum.
                    </span>
                  </label>

                  {/* 8px gri yazı */}
                  <p className="text-[8px] text-[#888] leading-tight font-sans text-left">
                    Verileriniz 3. kişilerle paylaşılmaz, dilediğiniz zaman{' '}
                    <a href="mailto:maliaskar.1968@gmail.com" className="underline text-[#555] hover:text-[#000]">
                      maliaskar.1968@gmail.com
                    </a>{' '}
                    adresine mail atarak rızanızı geri alabilirsiniz.
                  </p>

                  {/* Error Message */}
                  {errorMessage && (
                    <p className="text-red-600 bg-red-50 border border-red-200/70 px-3 py-1.5 rounded-lg text-[11px] font-sans">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    id="takipBtn"
                    type="submit"
                    disabled={!kvkkConsent || loading}
                    title={!kvkkConsent ? 'Lütfen onay verin' : 'TAKİP ET KAZAN'}
                    className={`w-full py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 shadow-md ${
                      kvkkConsent && !loading
                        ? 'bg-[#1A1A1A] hover:bg-black text-white hover:scale-[1.01] active:scale-98 cursor-pointer'
                        : 'bg-[#1A1A1A]/40 text-white/70 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {loading ? 'KAYDEDİLİYOR...' : 'TAKİP ET KAZAN'}
                  </button>

                  {showKvkkDetail && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-[#1A1A1A]/10 text-[9px] text-[#555] space-y-1 text-left leading-relaxed">
                      <div className="font-bold text-[#1A1A1A]">6698 Sayılı KVKK Kapsamında Aydınlatma Metni:</div>
                      <div>
                        Veri Sorumlusu: Mehmet Ali Askar / Aşkar Yayınları - Antalya. Kişisel veriniz (e-posta adresiniz), 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca sadece Aşkar Yayınları tarafından bülten, duyuru, yeni PDF kitaplar ve LGS-YKS hazırlık araçları bilgilendirmesi amacıyla işlenmektedir. Verileriniz üçüncü şahıslara kesinlikle aktarılmaz.
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <ImageUploaderModal
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
      />

      <ShareModal
        item={siteShareData}
        isOpen={siteShareModalOpen}
        onClose={() => setSiteShareModalOpen(false)}
      />

      <InstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onDirectInstall={async () => {
          await triggerInstall();
        }}
      />
    </>
  );
};


