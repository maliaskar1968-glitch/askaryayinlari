import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'Sipariş & Teslimat',
    question: 'Aşkar Yayınları dijital PDF kitapları nasıl satın alınır ve indirilir?',
    answer: 'Seçtiğiniz kitabın altında yer alan "Shopier ile İndir" butonuna tıklayarak Shopier güvenli ödeme sayfasına yönlendirilirsiniz. 3D Secure güvencesiyle kredi veya banka kartınızla ödemenizi tamamladığınız anda yüksek çözünürlüklü dijital PDF kitabınız ekranda indirmeye açılır ve belirttiğiniz e-posta adresinize de anında otomatik indirme bağlantısı gönderilir.'
  },
  {
    category: 'Kullanım & Baskı',
    question: 'Satın aldığım dijital PDF kitapların çıktısını (print) alabilir miyim?',
    answer: 'Satın aldığınız PDF dosyasını bilgisayarınızdan, tabletinizden veya telefonunuzdan okuyabileceğiniz gibi, evinizdeki veya kırtasiyedeki yazıcıdan çıktı alarak spiral ciltletip fiziksel kitap haline getirebilirsiniz. Ürünlerimiz lisanslı olup PDF paylaşımı yasaktır.'
  },
  {
    category: 'Koçluk & Başarı Sistemi',
    question: "LGS'de Kendi Koçun Ol ve YKS'de Kendi Koçun Ol kitaplarının klasik kitaplardan farkı nedir?",
    answer: "Bu eserler salt soru bankası veya konu anlatımı değildir. Yazar ve eğitim koçu Mehmet Ali Askar tarafından geliştirilen 12 Adımlı Disiplin ve Başarı Sistemi; öğrencinin haftalık çalışma çizelgeleri oluşturmasını, ders çalışma bloklarını yönetmesini, eksik analizleri yapmasını ve sınav stresini aşarak kendi çalışma disiplinini inşa etmesini sağlayan kapsamlı bir yol haritasıdır."
  },
  {
    category: 'Kademe & Yaş Grubu',
    question: '5, 6 ve 7. sınıf koçluk kitapları hangi öğrencilere hitap eder?',
    answer: '5. Sınıf Koçluk ve Motivasyon kitabı ilkokuldan ortaokula geçişte adaptasyonu ve ders çalışma alışkanlığını sağlar. 6. Sınıf Disiplin ve Başarı kitabı ergenlik başlangıcında öz disiplini ve hedef odaklılığı güçlendirir. 7. Sınıf LGS Hazırlık kitabı ise öğrenciyi 8. sınıf LGS maratonuna zihinsel, akademik ve stratejik olarak 1 yıl önceden hazır hale getirir.'
  },
  {
    category: 'Çocuk & Masal',
    question: 'Sevimli Deniz Altı Kaşifleri çocuk kitabı ve interaktif web uygulaması nedir?',
    answer: '4-8 yaş grubu için hazırlanan "Sevimli Deniz Altı Kaşifleri", eğitici deniz altı masalları ile yaratıcı boyama aktivitelerini bir araya getirir. Ayrıca sitemiz üzerinden ücretsiz erişilebilen dijital çocuk oyunu ve yaratıcı boyama aracıyla çocukların hayal gücünü ve ekran süresini faydalı öğrenmeye dönüştürür.'
  },
  {
    category: 'Güvenlik',
    question: 'Shopier üzerinden yapılan ödemeler güvenli midir?',
    answer: 'Tüm ödemeleriniz Türkiye Cumhuriyet Merkez Bankası (TCMB) denetimli ve BDDK lisanslı ödeme kuruluşu Shopier altyapısında 256-bit SSL güvenlik sertifikası ve 3D Secure SMS onayıyla gerçekleşir. Kart bilgileriniz kesinlikle saklanmaz.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="my-14 bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-10 shadow-xs" id="sss" aria-label="Sıkça Sorulan Sorular">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/10 border border-[#C9A86A]/30 text-[10px] font-mono tracking-widest text-[#856526] uppercase font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>REHBER & BİLGİ MERKEZİ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
          Sıkça Sorulan Sorular
        </h2>
        <p className="text-xs sm:text-sm text-[#1A1A1A]/60 font-sans mt-2">
          Dijital PDF kitaplarımız, LGS & YKS koçluk sistemlerimiz ve sipariş süreçleri hakkında merak edilenler.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-[#C9A86A] bg-[#FFFBF5]/40 shadow-xs' : 'border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isOpen ? 'text-[#C9A86A]' : 'text-[#1A1A1A]/30'}`} />
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A]">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#1A1A1A]/50 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#C9A86A]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#1A1A1A]/70 font-sans leading-relaxed border-t border-[#C9A86A]/20">
                  <div className="inline-block text-[9px] font-mono font-semibold uppercase tracking-wider text-[#856526] bg-[#C9A86A]/15 px-2 py-0.5 rounded mb-2">
                    {faq.category}
                  </div>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
