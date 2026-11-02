import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowRight, Sparkles, Tag, ChevronRight } from 'lucide-react';

export interface BlogPost {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  kategori: string;
  okumaSuresi: string;
  yazar: string;
  tarih: string;
  gorselUrl: string;
  icerikHtml: string;
}

export const BLOG_POSTLARI: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'yazili-sinavlarinda-en-sik-yapilan-5-hata',
    baslik: 'Yazılı Sınavlarında En Sık Yapılan 5 Hata ve 100 Almanın Yolları',
    ozet: 'Öğrenciler genellikle konuyu bilmediklerinden değil, sınav anındaki 5 kritik strateji hatasından dolayı puan kaybederler. İşte yazılıda derece yapmanın altın formülü!',
    kategori: 'Yazılı Taktikleri',
    okumaSuresi: '4 Dakika',
    yazar: 'Mehmet Ali AŞKAR',
    tarih: '2 Kasım 2026',
    gorselUrl: '/resimler/branding/5-sinif-not-avcisi-card.jpg',
    icerikHtml: `
      <h3>1. Soruyu Sonuna Kadar Okumadan Çözüme Başlamak</h3>
      <p>Öğrencilerin en sık yaptığı hata, soru kökündeki 'değildir', 'olamaz', 'kesinlikle' gibi anahtar kelimeleri gözden kaçırmaktır. Kaleminizle mutlaka bu kelimelerin altını çizin.</p>
      
      <h3>2. 40 Dakikalık Süreyi Kötü Yönetmek</h3>
      <p>Bir soruda takılıp 15 dakika harcamak diğer soruları yetiştirememe panığı doğurur. Yapamadığınız sorunun yanına küçük bir yıldız koyup hemen sonrakine geçin.</p>
      
      <h3>3. Çözüm Basamaklarını Kağıda Yazmamak</h3>
      <p>Özellikle MEB açık uçlu yazılı formatında öğretmenler sadece sonuca değil, gidiş yoluna da puan verir. Zihninizden yaptığınız işlemleri mutlaka kağıda dökün.</p>

      <h3>4. Sınav Kağıdını Erken Vermek</h3>
      <p>Sınavı ilk bitiren değil, en az hata yapan 100 alır. Kalan sürenizi mutlaka işlem kontrolüne ayırın.</p>

      <h3>5. Gerçek Sınavdan Önce Simülasyon Yapmamak</h3>
      <p>Sınava sadece defter okuyarak girilmez. Kendinizi süre tutarak tam 40 dakikalık bir provaya tabi tutmalısınız. <strong>Not Avcısı</strong> bu yüzden tam ihtiyacınız olan yerdir!</p>
    `
  },
  {
    id: 'blog-2',
    slug: 'lgsde-kendi-kocun-ol-haftalik-program-nasil-yapilir',
    baslik: 'LGS Maratonunda Kendi Koçun Ol: Haftalık Çalışma Programı Nasıl Yapılır?',
    ozet: 'Günde 500 soru çözmek değil, doğru soruları analiz ederek çözmek kazandırır. İşte LGS’de dereceye ulaştıran haftalık planlama rehberi.',
    kategori: 'LGS Koçluğu',
    okumaSuresi: '5 Dakika',
    yazar: 'Mehmet Ali AŞKAR',
    tarih: '1 Kasım 2026',
    gorselUrl: '/resimler/branding/5-sinif-not-avcisi-card.jpg',
    icerikHtml: `
      <h3>Masa Başına Plansız Oturmayın</h3>
      <p>Haftalık plan, hangi gün hangi dersten kaç soru çözeceğinizi değil, hangi kazanımları pekiştireceğinizi netleştirmelidir. Aşkar Yayınları 8. Sınıf LGS'de Kendi Koçun Ol kitabı bu sistemi 12 adımda öğretir.</p>
    `
  },
  {
    id: 'blog-3',
    slug: 'ortaokula-geciste-5-sinif-velilerine-altin-tavsiyeler',
    baslik: '5. Sınıfa Geçen Öğrenciler İçin Ortaokula Çevik Başlangıç Rehberi',
    ozet: 'İlkokuldan ortaokula geçişte birden fazla öğretmen ve branş dersiyle tanışan öğrencilerin motivasyonunu nasıl yüksek tutabiliriz?',
    kategori: 'Ortaokul Rehberliği',
    okumaSuresi: '3 Dakika',
    yazar: 'Mehmet Ali AŞKAR',
    tarih: '28 Ekim 2026',
    gorselUrl: '/resimler/branding/5-sinif-not-avcisi-card.jpg',
    icerikHtml: `
      <h3>Ders Takibi ve Düzenli Not Tutma</h3>
      <p>5. sınıf öğrencileri ilk kez branş öğretmenleriyle karşılaşır. Her dersin kendine has bir çalışma mantığı vardır. Yazılı öncesinde Not Avcısı simülasyonları ile çocuğun eksiklerini önceden tespit edip kapatabilirsiniz.</p>
    `
  }
];

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Blog Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AŞKAR YAYINLARI EĞİTİM & REHBERLİK BLOGU</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Başarıya Giden Yolda <span className="text-amber-400">Rehber Yazılar</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg">
            Yazılı sınav taktikleri, koçluk tavsiyeleri, LGS & YKS stratejileri ve ufkunu açacak bilim yazıları.
          </p>
        </div>
      </section>

      {/* Makale Detay Modalı veya Liste */}
      <main className="max-w-6xl mx-auto px-4 pt-12">
        {selectedPost ? (
          <article className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs inline-flex items-center gap-1 transition"
            >
              ← Tüm Yazılara Dön
            </button>

            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                {selectedPost.kategori}
              </span>
              <span>{selectedPost.tarih}</span>
              <span>• {selectedPost.okumaSuresi}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              {selectedPost.baslik}
            </h1>

            <div
              className="prose prose-invert max-w-none text-slate-300 space-y-4 text-base leading-relaxed border-t border-slate-800 pt-6"
              dangerouslySetInnerHTML={{ __html: selectedPost.icerikHtml }}
            />

            {/* Yazı Sonu Not Avcısı Çağrısı */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Taktikleri Öğrendin, Şimdi Kendini Dene! 🦉</h4>
              <p className="text-xs text-slate-300 mb-4">
                Not Avcısı'nda 40 dakikalık süreli provanı başlat, eksik kazanımlarını anında gör.
              </p>
              <a
                href="/not-avcisi"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md hover:bg-amber-400 transition"
              >
                <span>Not Avcısı'na Git</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </article>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTLARI.map((post) => (
              <div
                key={post.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">{post.kategori}</span>
                    <span>{post.okumaSuresi}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 hover:text-amber-400 transition">
                    {post.baslik}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {post.ozet}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{post.tarih}</span>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <span>Devamını Oku</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
