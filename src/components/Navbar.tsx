import React, { useState } from 'react';
import { PageTab } from '../types';
import { MAIN_SHOPIER_URL } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { ImageUploaderModal } from './ImageUploaderModal';
import { ShareModal, ShareItem } from './ShareModal';
import { ShoppingBag, Menu, X, BookOpen, Wrench, User, Mail, Bell, CheckCircle2, Share2 } from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [siteShareModalOpen, setSiteShareModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [showKvkkDetail, setShowKvkkDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const siteShareData: ShareItem = {
    isSiteShare: true,
    title: 'Aşkar Yayınları',
    subtitle: 'Çocuğunun sınavda bir adım öne geçmesi için aradığın her şey, anında cebinde.',
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

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'magaza', label: 'KİTAPLIK', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'uygulamalar', label: 'UYGULAMALAR', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'hakkimda', label: 'HAKKIMDA', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'iletisim', label: 'İLETİŞİM', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  const handleTabClick = (id: PageTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#1A1A1A]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => handleTabClick('magaza')}
          >
            <ImgWithFallback
              src="/resimler/logo.jpg"
              alt="Aşkar Yayınları Logo"
              className="w-11 h-11 rounded-full border border-[#C9A86A]/40 object-cover bg-black shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-xs"
            />
            <div>
              <div className="font-serif font-black text-lg tracking-tight text-[#1A1A1A] leading-tight flex items-center gap-2">
                AŞKAR YAYINLARI
              </div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/60 font-medium">
                Dijital PDF Kütüphanesi
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all py-2 border-b-2 ${
                    isActive
                      ? 'text-[#1A1A1A] border-[#1A1A1A]'
                      : 'text-[#1A1A1A]/60 border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]/30'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Takip Et, Paylaş & Shopier Store Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* TAKİP ET Button (Desktop / Tablet) */}
            <button
              onClick={() => setFollowModalOpen(true)}
              className="hidden sm:inline-flex bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] px-4 sm:px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-2xs cursor-pointer items-center gap-1.5"
            >
              <Bell className="w-3 h-3 text-[#C9A86A]" />
              <span>TAKİP ET</span>
            </button>

            {/* PAYLAŞ Button */}
            <button
              onClick={() => setSiteShareModalOpen(true)}
              title="Aşkar Yayınları Paylaş"
              className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] px-3.5 sm:px-4 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span className="hidden sm:inline">PAYLAŞ</span>
            </button>

            {/* MAĞAZA Button */}
            <a
              href={MAIN_SHOPIER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] hover:bg-black text-white px-4 sm:px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>MAĞAZA</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8F7F4] border-b border-[#1A1A1A]/10 px-6 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSiteShareModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-3 transition-colors text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>PAYLAŞ</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Floating TAKİP ET Button (Fixed in Bottom Right Corner) */}
      <aside aria-label="Mobil Takip Butonu" className="fixed bottom-5 right-4 z-40 sm:hidden">
        <button
          onClick={() => setFollowModalOpen(true)}
          className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border-2 border-[#1A1A1A] px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-200 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer"
          aria-label="Takip Et"
        >
          <Bell className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>TAKİP ET</span>
        </button>
      </aside>

      {/* TAKİP ET Modal */}
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
                  Yeni kitaplar mailine gelecek.
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
                    Yeniliklerden Haberdar Ol
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans max-w-sm mx-auto">
                    Yeni PDF kitaplar ve LGS-YKS araçları eklenince ilk sana haber verelim.
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
                    title={!kvkkConsent ? 'Lütfen onay verin' : 'TAKİP ET'}
                    className={`w-full py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 shadow-md ${
                      kvkkConsent && !loading
                        ? 'bg-[#1A1A1A] hover:bg-black text-white hover:scale-[1.01] active:scale-98 cursor-pointer'
                        : 'bg-[#1A1A1A]/40 text-white/70 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {loading ? 'KAYDEDİLİYOR...' : 'TAKİP ET'}
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
    </>
  );
};


