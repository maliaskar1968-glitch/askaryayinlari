import React, { useState } from 'react';
import { KIDS_BOOKS_DATA } from '../data/books';
import { ImgWithFallback } from './ImgWithFallback';
import { Download, Sparkles, ExternalLink, Heart, Share2 } from 'lucide-react';
import { ShareModal, ShareItem } from './ShareModal';

export const KidsBookGrid: React.FC = () => {
  const [selectedShareItem, setSelectedShareItem] = useState<ShareItem | null>(null);

  return (
    <div className="my-12 pt-8 border-t border-[#1A1A1A]/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 text-[#856526] text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold">
            <Sparkles className="w-3 h-3 text-[#C9A86A]" />
            <span>ÖZEL KOLEKSİYON • ÇOCUK DÜNYASI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
            Çocuk Kitaplığı
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/70 font-sans max-w-sm">
          Çocukların hayal dünyasını zenginleştiren, değerler eğitimi ve eğlenceli boyama içeren dijital PDF kitaplar
        </p>
      </div>

      {/* Grid of Children's Books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {/* Active Book 1: Sevimli Deniz Altı Kaşifleri */}
        <article
          itemScope
          itemType="https://schema.org/Book"
          className="bg-white border border-[#1A1A1A]/10 hover:border-[#C9A86A]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
        >
          <meta itemProp="bookFormat" content="https://schema.org/EBook" />
          <meta itemProp="inLanguage" content="tr" />
          <div itemProp="author" itemScope itemType="https://schema.org/Person" className="hidden">
            <meta itemProp="name" content="Mehmet Ali Askar" />
          </div>
          <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Aşkar Yayınları" />
          </div>

          {/* Top Row: Age Badge on the Left, Share Button on the Right */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase bg-[#F8F7F4] text-[#1A1A1A] border border-[#1A1A1A]/10">
              4-8 YAŞ • MASAL & BOYAMA
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedShareItem({
                  title: 'Sevimli Deniz Altı Kaşifleri',
                  subtitle: 'Büyülü Hikayeler ve Yaratıcı Boyama Kitabı',
                  image: '/resimler/cocuk.png',
                  shopierUrl: 'https://www.shopier.com/mehmetaliaskar/49854224',
                  badge: '4-8 YAŞ',
                })
              }
              title="Sevimli Deniz Altı Kaşifleri Paylaş"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A1A1A]/5 hover:bg-[#C9A86A]/20 text-[#1A1A1A]/70 hover:text-[#856526] transition-colors cursor-pointer text-[9px] font-sans font-medium"
            >
              <Share2 className="w-3 h-3 text-[#C9A86A]" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>

          {/* Book Cover Image - 1:1 Aspect Ratio */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <ImgWithFallback
              src="/resimler/cocuk.png"
              alt="Sevimli Deniz Altı Kaşifleri Masal ve Boyama Kitabı PDF - Mehmet Ali Askar - Aşkar Yayınları"
              className="w-full h-full object-cover"
              itemProp="image"
            />
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
              PDF
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 flex-1">
            <h3 itemProp="name" className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
              Sevimli Deniz Altı Kaşifleri
            </h3>
            <p itemProp="description" className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
              Büyülü Hikayeler ve Yaratıcı Boyama Kitabı
            </p>
          </div>

          {/* Shopier Action Button */}
          <a
            href="https://www.shopier.com/mehmetaliaskar/49854224"
            target="_blank"
            rel="noopener noreferrer"
            title="Sevimli Deniz Altı Kaşifleri PDF Çocuk Kitabı Satın Al ve İndir"
            className="mt-auto w-full bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>SHOPIER İLE İNDİR</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        </article>

        {/* Active Book 2: Ormanın Minik Koruyucuları */}
        <article
          itemScope
          itemType="https://schema.org/Book"
          className="bg-white border border-[#1A1A1A]/10 hover:border-[#15803d]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
        >
          <meta itemProp="bookFormat" content="https://schema.org/EBook" />
          <meta itemProp="inLanguage" content="tr" />
          <div itemProp="author" itemScope itemType="https://schema.org/Person" className="hidden">
            <meta itemProp="name" content="Mehmet Ali Askar" />
          </div>
          <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Aşkar Yayınları" />
          </div>

          {/* Top Row: Age Badge on the Left, Share Button on the Right */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase bg-[#F8F7F4] text-[#15803d] border border-[#15803d]/20">
              6-9 YAŞ • DOĞA & DEĞERLER
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedShareItem({
                  title: 'Ormanın Minik Koruyucuları',
                  subtitle: "Elif, Mert ve Can'ın Büyülü Orman Macerası",
                  image: '/resimler/orman.png',
                  shopierUrl: 'https://www.shopier.com/mehmetaliaskar/50238751',
                  badge: '6-9 YAŞ',
                })
              }
              title="Ormanın Minik Koruyucuları Paylaş"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A1A1A]/5 hover:bg-[#15803d]/20 text-[#1A1A1A]/70 hover:text-[#15803d] transition-colors cursor-pointer text-[9px] font-sans font-medium"
            >
              <Share2 className="w-3 h-3 text-[#15803d]" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>

          {/* Book Cover Image - 1:1 Aspect Ratio */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <ImgWithFallback
              src="/resimler/orman.png"
              alt="Ormanın Minik Koruyucuları Doğa ve Dayanışma Hikayesi PDF Kitabı - Yazar Mehmet Ali Askar - Aşkar Yayınları"
              className="w-full h-full object-cover"
              itemProp="image"
            />
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
              PDF
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 flex-1">
            <h3 itemProp="name" className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
              Ormanın Minik Koruyucuları
            </h3>
            <p itemProp="description" className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
              Elif, Mert ve Can'ın Büyülü Orman Macerası (6-9 Yaş Doğa Masalı)
            </p>
          </div>

          {/* Shopier Action Button */}
          <a
            href="https://www.shopier.com/mehmetaliaskar/50238751"
            target="_blank"
            rel="noopener noreferrer"
            title="Ormanın Minik Koruyucuları PDF Çocuk Kitabı Satın Al ve İndir"
            className="mt-auto w-full bg-[#15803d] hover:bg-[#166534] text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>SHOPIER İLE İNDİR</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        </article>

        {/* Active Book 3: Uykudan Önce */}
        <article
          itemScope
          itemType="https://schema.org/Book"
          className="bg-white border border-[#1A1A1A]/10 hover:border-[#4f46e5]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
        >
          <meta itemProp="bookFormat" content="https://schema.org/EBook" />
          <meta itemProp="inLanguage" content="tr" />
          <div itemProp="author" itemScope itemType="https://schema.org/Person" className="hidden">
            <meta itemProp="name" content="Mehmet Ali Askar" />
          </div>
          <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Aşkar Yayınları" />
          </div>

          {/* Top Row: Category Badge on the Left, Share Button on the Right */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase bg-[#F8F7F4] text-[#4f46e5] border border-[#4f46e5]/20">
              MASAL & UYKU • ÇOCUK DÜNYASI
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedShareItem({
                  title: 'Uykudan Önce',
                  subtitle: 'Her Çocuk İyi Bir Hikâye Hak Eder',
                  image: '/resimler/uonce.png',
                  shopierUrl: 'https://www.shopier.com/mehmetaliaskar/50302573',
                  badge: 'MASAL & UYKU',
                })
              }
              title="Uykudan Önce Paylaş"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A1A1A]/5 hover:bg-[#4f46e5]/20 text-[#1A1A1A]/70 hover:text-[#4f46e5] transition-colors cursor-pointer text-[9px] font-sans font-medium"
            >
              <Share2 className="w-3 h-3 text-[#4f46e5]" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>

          {/* Book Cover Image - 1:1 Aspect Ratio */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <ImgWithFallback
              src="/resimler/uonce.png"
              alt="Uykudan Önce Her Çocuk İyi Bir Hikâye Hak Eder PDF Kitabı - Yazar Mehmet Ali Askar - Aşkar Yayınları"
              className="w-full h-full object-cover"
              itemProp="image"
            />
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
              PDF
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 flex-1">
            <h3 itemProp="name" className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
              Uykudan Önce
            </h3>
            <p itemProp="description" className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
              Her Çocuk İyi Bir Hikâye Hak Eder
            </p>
          </div>

          {/* Shopier Action Button */}
          <a
            href="https://www.shopier.com/mehmetaliaskar/50302573"
            target="_blank"
            rel="noopener noreferrer"
            title="Uykudan Önce PDF Çocuk Kitabı Satın Al ve İndir"
            className="mt-auto w-full bg-[#3730a3] hover:bg-[#312e81] text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>SHOPIER İLE İNDİR</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        </article>

        {/* Active Book 4: Nasrettin Hoca'nın Torunları */}
        <article
          itemScope
          itemType="https://schema.org/Book"
          className="bg-white border border-[#1A1A1A]/10 hover:border-[#d97706]/60 rounded-2xl p-4 flex flex-col h-full transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
        >
          <meta itemProp="bookFormat" content="https://schema.org/EBook" />
          <meta itemProp="inLanguage" content="tr" />
          <div itemProp="author" itemScope itemType="https://schema.org/Person" className="hidden">
            <meta itemProp="name" content="Mehmet Ali Askar" />
          </div>
          <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Aşkar Yayınları" />
          </div>

          {/* Top Row: Category Badge on the Left, Share Button on the Right */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase bg-[#F8F7F4] text-[#d97706] border border-[#d97706]/25">
              6-10 YAŞ • FIKRA & MİZAH
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedShareItem({
                  title: "Nasrettin Hoca'nın Torunları",
                  subtitle: 'Fıkra Kitabı (6-10 Yaş)',
                  image: '/resimler/nasrettintorun.png',
                  shopierUrl: 'https://www.shopier.com/mehmetaliaskar/50802783',
                  badge: '6-10 YAŞ • FIKRA',
                })
              }
              title="Nasrettin Hoca'nın Torunları Paylaş"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A1A1A]/5 hover:bg-[#d97706]/20 text-[#1A1A1A]/70 hover:text-[#d97706] transition-colors cursor-pointer text-[9px] font-sans font-medium"
            >
              <Share2 className="w-3 h-3 text-[#d97706]" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>

          {/* Book Cover Image - 1:1 Aspect Ratio */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F4] border border-[#1A1A1A]/10 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <ImgWithFallback
              src="/resimler/nasrettintorun.png"
              alt="Nasrettin Hoca'nın Torunları Fıkra Kitabı 6-10 Yaş PDF Kitabı - Yazar Mehmet Ali Askar - Aşkar Yayınları"
              className="w-full h-full object-cover"
              itemProp="image"
            />
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/75 text-white text-[8px] font-mono uppercase px-2 py-0.5 rounded backdrop-blur-xs">
              PDF
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 flex-1">
            <h3 itemProp="name" className="text-base font-serif font-bold text-[#1A1A1A] leading-snug min-h-[2.5rem]">
              Nasrettin Hoca'nın Torunları
            </h3>
            <p itemProp="description" className="text-xs text-[#1A1A1A]/60 font-sans italic mt-1.5 leading-relaxed">
              Fıkra Kitabı (6-10 Yaş)
            </p>
          </div>

          {/* Shopier Action Button */}
          <a
            href="https://www.shopier.com/mehmetaliaskar/50802783"
            target="_blank"
            rel="noopener noreferrer"
            title="Nasrettin Hoca'nın Torunları PDF Çocuk Fıkra Kitabı Satın Al ve İndir"
            className="mt-auto w-full bg-[#d97706] hover:bg-[#b45309] text-white text-center py-3 px-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>SHOPIER İLE İNDİR</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        </article>
      </div>

      {/* Share Modal */}
      <ShareModal
        item={selectedShareItem}
        isOpen={!!selectedShareItem}
        onClose={() => setSelectedShareItem(null)}
      />
    </div>
  );
};
