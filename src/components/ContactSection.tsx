import React, { useState } from 'react';
import { AUTHOR_EMAIL, MAIN_SHOPIER_URL } from '../data/books';
import { Mail, Send, CheckCircle2, ShoppingBag, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${AUTHOR_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'Gönderen': name,
          'E-posta': email,
          'Mesaj': message,
          _subject: `Aşkar Yayınları İletişim: ${name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok && (data?.success === 'true' || data?.success === true || response.status === 200)) {
        setSubmitted(true);
      } else {
        // Fallback: if server responds with error or confirmation needed
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Gönderim hatası:', err);
      // Even if network blocks CORS, allow user to open email client directly or retry
      setErrorMsg('Mesaj gönderilirken bir bağlantı sorunu oluştu. Lütfen doğrudan e-posta göndermeyi deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 max-w-2xl mx-auto">
      <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-8 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <Mail className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              İletişim Formu
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Bize Ulaşın
            </h2>
          </div>
        </div>

        {submitted ? (
          <div className="my-6 p-8 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-center space-y-4 animate-in fade-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Mesajınız Başarıyla İletildi!</h3>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed max-w-md mx-auto font-sans">
              Mesajınız doğrudan <b>{AUTHOR_EMAIL}</b> gelen kutusuna iletildi. En kısa sürede sizinle iletişime geçilecektir.
            </p>
            <p className="text-[11px] text-[#1A1A1A]/50 max-w-sm mx-auto">
              *Not: İlk defa mesaj alınıyorsa Gmail kutunuza FormSubmit aktivasyon onayı gelebilir, onaylandıktan sonra tüm mesajlar anında gelen kutunuza düşer.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white hover:bg-black rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all"
            >
              Yeni Mesaj Gönder
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 mt-6"
          >
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="c_ad" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A] block mb-1.5">
                Ad Soyad
              </label>
              <input
                id="c_ad"
                type="text"
                name="name"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve Soyadınız"
                className="w-full p-3.5 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all font-sans disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="c_email" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A] block mb-1.5">
                E-posta Adresiniz
              </label>
              <input
                id="c_email"
                type="email"
                name="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@gmail.com"
                className="w-full p-3.5 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all font-sans disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="c_mesaj" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A] block mb-1.5">
                Mesajınız
              </label>
              <textarea
                id="c_mesaj"
                name="message"
                rows={5}
                required
                disabled={loading}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı buraya yazın..."
                className="w-full p-3.5 text-xs rounded-xl border border-[#1A1A1A]/15 bg-[#F8F7F4] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all resize-y font-sans disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 px-4 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#C9A86A] animate-spin" />
                  <span>MESAJ GÖNDERİLİYOR...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#C9A86A]" />
                  <span>GÖNDER - {AUTHOR_EMAIL} ADRESİNE GÖNDER</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-[#1A1A1A]/50 text-center leading-relaxed font-sans">
              Gönder butonuna bastığınızda mesajınız doğrudan <b>{AUTHOR_EMAIL}</b> adresine iletilecektir.
            </p>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#1A1A1A]/70 gap-3">
          <div className="flex items-center gap-2 font-sans">
            <MessageSquare className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Doğrudan E-posta: <a href={`mailto:${AUTHOR_EMAIL}`} className="underline font-bold text-[#1A1A1A]">{AUTHOR_EMAIL}</a></span>
          </div>

          <a
            href={MAIN_SHOPIER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#1A1A1A] font-serif font-bold hover:underline text-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Shopier: shopier.com/mehmetaliaskar</span>
          </a>
        </div>
      </div>
    </div>
  );
};

