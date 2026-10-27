import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Building2,
  GraduationCap,
  Download,
  Plus,
  Check,
  Trash2,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  GripVertical,
  HelpCircle,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Users,
  School,
  Share2,
  Copy,
  MessageCircle,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';
import { applyTurkishFont } from '../../utils/pdfTurkishFont';

export type LgsPercentRangeFilter = 'ALL' | '0-1' | '1-3' | '3-5' | '5-10' | '10-20' | '20-50';

export interface HighSchool {
  id: string;
  name: string;
  city: string;
  district: string;
  type: 'Fen Lisesi' | 'Anadolu Lisesi' | 'Sosyal Bilimler' | 'Proje İHL' | 'Mesleki Teknik';
  lang: string;
  baseScore2024: number;
  percentile2024: number; // e.g. 0.04%
  quota: number;
  pansiyon: 'Kız/Erkek' | 'Yok' | 'Kız' | 'Erkek';
}

const getSchoolCode = (school: HighSchool): string => school.id.toUpperCase();

export const HIGH_SCHOOLS_DATABASE: HighSchool[] = [
  // ==================== İSTANBUL ====================
  { id: 'ist-1', name: 'Galatasaray Lisesi', city: 'İstanbul', district: 'Beyoğlu', type: 'Anadolu Lisesi', lang: 'Fransızca', baseScore2024: 500.00, percentile2024: 0.04, quota: 100, pansiyon: 'Kız/Erkek' },
  { id: 'ist-2', name: 'İstanbul Erkek Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 497.45, percentile2024: 0.06, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-3', name: 'Kabataş Erkek Lisesi (İngilizce)', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 495.80, percentile2024: 0.09, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ist-4', name: 'Kabataş Erkek Lisesi (Almanca)', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 494.90, percentile2024: 0.12, quota: 60, pansiyon: 'Kız/Erkek' },
  { id: 'ist-5', name: 'İstanbul Atatürk Fen Lisesi', city: 'İstanbul', district: 'Kadıköy', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 492.50, percentile2024: 0.22, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-6', name: 'Cağaloğlu Anadolu Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'Almanca', baseScore2024: 489.15, percentile2024: 0.45, quota: 180, pansiyon: 'Kız' },
  { id: 'ist-7', name: 'Çapa Fen Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 486.30, percentile2024: 0.70, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-8', name: 'Hüseyin Avni Sözen Anadolu Lisesi', city: 'İstanbul', district: 'Üsküdar', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 483.40, percentile2024: 0.95, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-9', name: 'Kadıköy Anadolu Lisesi', city: 'İstanbul', district: 'Kadıköy', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 482.10, percentile2024: 1.10, quota: 210, pansiyon: 'Kız/Erkek' },
  { id: 'ist-10', name: 'Kartal Anadolu İmam Hatip Lisesi (İngilizce)', city: 'İstanbul', district: 'Kartal', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 479.50, percentile2024: 1.45, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-11', name: 'Beşiktaş Sakıp Sabancı Anadolu Lisesi', city: 'İstanbul', district: 'Beşiktaş', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 477.80, percentile2024: 1.65, quota: 150, pansiyon: 'Yok' },
  { id: 'ist-12', name: 'Vefa Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 474.20, percentile2024: 2.10, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-13', name: 'Bakırköy Anadolu Lisesi', city: 'İstanbul', district: 'Bakırköy', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 467.30, percentile2024: 2.85, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-14', name: 'Prof. Dr. Mümtaz Turhan Sosyal Bilimler Lisesi', city: 'İstanbul', district: 'Bahçelievler', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 454.20, percentile2024: 4.80, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ist-15', name: 'Pertevniyal Lisesi', city: 'İstanbul', district: 'Fatih', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 462.50, percentile2024: 3.50, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-16', name: 'Kadir Has Anadolu Lisesi', city: 'İstanbul', district: 'Maltepe', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 446.80, percentile2024: 6.20, quota: 180, pansiyon: 'Yok' },
  { id: 'ist-17', name: 'İstanbul Ticaret Odası MTAL (Yazılım)', city: 'İstanbul', district: 'Beşiktaş', type: 'Mesleki Teknik', lang: 'İngilizce', baseScore2024: 432.10, percentile2024: 8.80, quota: 60, pansiyon: 'Yok' },

  // ==================== ANKARA ====================
  { id: 'ank-1', name: 'Ankara Fen Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 494.60, percentile2024: 0.14, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ank-2', name: 'Prof. Dr. Aziz Sancar Fen Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 488.20, percentile2024: 0.52, quota: 90, pansiyon: 'Kız/Erkek' },
  { id: 'ank-3', name: 'Ankara Atatürk Anadolu Lisesi', city: 'Ankara', district: 'Sıhhiye', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 478.40, percentile2024: 1.55, quota: 300, pansiyon: 'Yok' },
  { id: 'ank-4', name: 'Cumhuriyet Fen Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 476.10, percentile2024: 1.85, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ank-5', name: 'Gazi Anadolu Lisesi', city: 'Ankara', district: 'Yenimahalle', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 472.90, percentile2024: 2.25, quota: 240, pansiyon: 'Yok' },
  { id: 'ank-6', name: 'Mehmet Emin Resulzade Anadolu Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 466.50, percentile2024: 3.10, quota: 180, pansiyon: 'Yok' },
  { id: 'ank-7', name: 'Ankara Sosyal Bilimler Lisesi', city: 'Ankara', district: 'Yenimahalle', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 452.10, percentile2024: 5.15, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ank-8', name: 'Tevfik İleri Anadolu İmam Hatip Lisesi', city: 'Ankara', district: 'Yenimahalle', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 458.70, percentile2024: 4.10, quota: 180, pansiyon: 'Kız/Erkek' },
  { id: 'ank-9', name: 'Ömer Seyfettin Anadolu Lisesi', city: 'Ankara', district: 'Çankaya', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 438.90, percentile2024: 7.60, quota: 200, pansiyon: 'Yok' },

  // ==================== İZMİR ====================
  { id: 'izm-1', name: 'İzmir Fen Lisesi', city: 'İzmir', district: 'Bornova', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 493.70, percentile2024: 0.18, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'izm-2', name: 'Bornova Anadolu Lisesi (İngilizce)', city: 'İzmir', district: 'Bornova', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 480.20, percentile2024: 1.35, quota: 210, pansiyon: 'Kız/Erkek' },
  { id: 'izm-3', name: 'İzmir Atatürk Lisesi (İngilizce)', city: 'İzmir', district: 'Konak', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 478.60, percentile2024: 1.50, quota: 240, pansiyon: 'Kız/Erkek' },
  { id: 'izm-4', name: 'Buca İnci-Ömer Tontu Fen Lisesi', city: 'İzmir', district: 'Buca', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 473.10, percentile2024: 2.20, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'izm-5', name: 'Karşıyaka Cihat Kora Anadolu Lisesi', city: 'İzmir', district: 'Karşıyaka', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 469.80, percentile2024: 2.65, quota: 180, pansiyon: 'Yok' },
  { id: 'izm-6', name: 'İzmir Sosyal Bilimler Lisesi', city: 'İzmir', district: 'Buca', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 448.50, percentile2024: 5.80, quota: 120, pansiyon: 'Kız/Erkek' },

  // ==================== BURSA ====================
  { id: 'bur-1', name: 'Tofaş Fen Lisesi', city: 'Bursa', district: 'Nilüfer', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 489.80, percentile2024: 0.42, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'bur-2', name: 'Nilüfer Borsa İstanbul Fen Lisesi', city: 'Bursa', district: 'Nilüfer', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 478.30, percentile2024: 1.58, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'bur-3', name: 'Bursa Anadolu Lisesi', city: 'Bursa', district: 'Osmangazi', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 471.40, percentile2024: 2.45, quota: 210, pansiyon: 'Yok' },
  { id: 'bur-4', name: 'Ahmet Erdem Anadolu Lisesi', city: 'Bursa', district: 'Nilüfer', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 462.10, percentile2024: 3.75, quota: 180, pansiyon: 'Yok' },

  // ==================== ANTALYA ====================
  { id: 'ant-1', name: 'Yusuf Ziya Öner Fen Lisesi', city: 'Antalya', district: 'Döşemealtı', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 486.20, percentile2024: 0.72, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'ant-2', name: 'Antalya Anadolu Lisesi', city: 'Antalya', district: 'Muratpaşa', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 472.50, percentile2024: 2.30, quota: 210, pansiyon: 'Yok' },
  { id: 'ant-3', name: 'Adem Tolunay Anadolu Lisesi', city: 'Antalya', district: 'Muratpaşa', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 466.80, percentile2024: 3.10, quota: 180, pansiyon: 'Yok' },
  { id: 'ant-4', name: 'Gülveren Anadolu Lisesi', city: 'Antalya', district: 'Kepez', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 442.30, percentile2024: 6.90, quota: 180, pansiyon: 'Yok' },

  // ==================== ADANA ====================
  { id: 'ada-1', name: 'Adana Fen Lisesi', city: 'Adana', district: 'Seyhan', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 485.40, percentile2024: 0.85, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'ada-2', name: 'Seyhan Rotary Anadolu Lisesi', city: 'Adana', district: 'Seyhan', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 468.90, percentile2024: 2.75, quota: 180, pansiyon: 'Yok' },
  { id: 'ada-3', name: 'İsmail Kulak Anadolu Lisesi', city: 'Adana', district: 'Seyhan', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 457.20, percentile2024: 4.40, quota: 210, pansiyon: 'Yok' },
  { id: 'ada-4', name: 'Adana Kıvanç İHL (Fen ve Sosyal)', city: 'Adana', district: 'Yüreğir', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 435.80, percentile2024: 8.10, quota: 120, pansiyon: 'Kız/Erkek' },

  // ==================== HATAY (AŞKAR YAYINLARI ÖZEL VURGUSU) ====================
  { id: 'hat-1', name: 'Hatay Fen Lisesi', city: 'Hatay', district: 'Antakya', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 478.90, percentile2024: 1.50, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'hat-2', name: 'İskenderun Tosçelik Fen Lisesi', city: 'Hatay', district: 'İskenderun', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 475.40, percentile2024: 1.95, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'hat-3', name: 'Selim Nevzat Şahin Anadolu Lisesi', city: 'Hatay', district: 'Defne', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 462.80, percentile2024: 3.65, quota: 180, pansiyon: 'Yok' },
  { id: 'hat-4', name: 'İskenderun İstiklal Makzume Anadolu Lisesi', city: 'Hatay', district: 'İskenderun', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 456.20, percentile2024: 4.55, quota: 180, pansiyon: 'Yok' },
  { id: 'hat-5', name: 'Dörtyol Fen Lisesi', city: 'Hatay', district: 'Dörtyol', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 451.70, percentile2024: 5.25, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'hat-6', name: 'Antakya Hz. Ayşe Kız Anadolu İHL (Fen ve Sosyal)', city: 'Hatay', district: 'Antakya', type: 'Proje İHL', lang: 'İngilizce', baseScore2024: 442.10, percentile2024: 7.10, quota: 90, pansiyon: 'Kız' },
  { id: 'hat-7', name: 'Karlısu Sosyal Bilimler Lisesi', city: 'Hatay', district: 'Antakya', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 435.60, percentile2024: 8.20, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'hat-8', name: 'Samandağ Yüksel Acun Anadolu Lisesi', city: 'Hatay', district: 'Samandağ', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 428.40, percentile2024: 9.60, quota: 150, pansiyon: 'Yok' },
  { id: 'hat-9', name: 'Reyhanlı Mehmet Fatih Tosyalı Fen Lisesi', city: 'Hatay', district: 'Reyhanlı', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 421.30, percentile2024: 11.20, quota: 90, pansiyon: 'Kız/Erkek' },
  { id: 'hat-10', name: 'Kırıkhan Naim Atakaş Anadolu Lisesi', city: 'Hatay', district: 'Kırıkhan', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 405.80, percentile2024: 14.80, quota: 150, pansiyon: 'Yok' },
  { id: 'hat-11', name: 'İskenderun Mesleki ve Teknik Anadolu Lisesi (Bilişim)', city: 'Hatay', district: 'İskenderun', type: 'Mesleki Teknik', lang: 'Türkçe', baseScore2024: 382.40, percentile2024: 21.50, quota: 60, pansiyon: 'Yok' },

  // ==================== GAZİANTEP ====================
  { id: 'gaz-1', name: 'Vehbi Dinçerler Fen Lisesi', city: 'Gaziantep', district: 'Şehitkamil', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 483.50, percentile2024: 1.05, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'gaz-2', name: 'TOBB Fen Lisesi', city: 'Gaziantep', district: 'Şahinbey', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 476.30, percentile2024: 1.80, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'gaz-3', name: 'Gaziantep Anadolu Lisesi', city: 'Gaziantep', district: 'Şahinbey', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 465.70, percentile2024: 3.25, quota: 210, pansiyon: 'Yok' },
  { id: 'gaz-4', name: 'Gaziantep Sosyal Bilimler Lisesi', city: 'Gaziantep', district: 'Şehitkamil', type: 'Sosyal Bilimler', lang: 'İngilizce', baseScore2024: 436.40, percentile2024: 8.00, quota: 120, pansiyon: 'Kız/Erkek' },

  // ==================== KONYA ====================
  { id: 'kon-1', name: 'Konya Meram Fen Lisesi', city: 'Konya', district: 'Meram', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 488.10, percentile2024: 0.55, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'kon-2', name: 'Selçuklu Fen Lisesi', city: 'Konya', district: 'Selçuklu', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 475.20, percentile2024: 1.98, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'kon-3', name: 'Konya Anadolu Lisesi', city: 'Konya', district: 'Selçuklu', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 463.50, percentile2024: 3.55, quota: 180, pansiyon: 'Yok' },

  // ==================== KOCAELİ ====================
  { id: 'koc-1', name: 'Kocaeli Fen Lisesi', city: 'Kocaeli', district: 'İzmit', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 487.40, percentile2024: 0.62, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'koc-2', name: 'Muammer Dereli Fen Lisesi', city: 'Kocaeli', district: 'İzmit', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 477.10, percentile2024: 1.72, quota: 150, pansiyon: 'Yok' },
  { id: 'koc-3', name: 'Kocaeli Anadolu Lisesi', city: 'Kocaeli', district: 'İzmit', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 464.30, percentile2024: 3.40, quota: 180, pansiyon: 'Yok' },

  // ==================== MERSİN ====================
  { id: 'mer-1', name: 'İçel Anadolu Lisesi', city: 'Mersin', district: 'Yenişehir', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 478.20, percentile2024: 1.60, quota: 180, pansiyon: 'Kız/Erkek' },
  { id: 'mer-2', name: 'Eyüp Aygar Fen Lisesi', city: 'Mersin', district: 'Yenişehir', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 474.90, percentile2024: 2.05, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'mer-3', name: 'Tarsus Fen Lisesi', city: 'Mersin', district: 'Tarsus', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 461.50, percentile2024: 3.85, quota: 120, pansiyon: 'Kız/Erkek' },

  // ==================== KAYSERİ ====================
  { id: 'kay-1', name: 'Kayseri Fen Lisesi', city: 'Kayseri', district: 'Kocasinan', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 484.20, percentile2024: 0.98, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'kay-2', name: 'Sümer Fen Lisesi', city: 'Kayseri', district: 'Kocasinan', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 473.80, percentile2024: 2.15, quota: 150, pansiyon: 'Kız/Erkek' },

  // ==================== SAMSUN ====================
  { id: 'sam-1', name: 'Samsun Garip Zeycan Yıldırım Fen Lisesi', city: 'Samsun', district: 'Atakum', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 483.10, percentile2024: 1.12, quota: 120, pansiyon: 'Kız/Erkek' },
  { id: 'sam-2', name: 'Aziz Atik Fen Lisesi', city: 'Samsun', district: 'İlkadım', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 471.20, percentile2024: 2.50, quota: 150, pansiyon: 'Yok' },

  // ==================== DİYARBAKIR ====================
  { id: 'diy-1', name: 'Diyarbakır Rekabet Kurumu Cumhuriyet Fen Lisesi', city: 'Diyarbakır', district: 'Yenişehir', type: 'Fen Lisesi', lang: 'İngilizce', baseScore2024: 478.40, percentile2024: 1.55, quota: 150, pansiyon: 'Kız/Erkek' },
  { id: 'diy-2', name: 'Sezai Karakoç Anadolu Lisesi', city: 'Diyarbakır', district: 'Kayapınar', type: 'Anadolu Lisesi', lang: 'İngilizce', baseScore2024: 452.80, percentile2024: 5.10, quota: 180, pansiyon: 'Yok' }
];

export const CITIES = [
  'TÜMÜ',
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Hatay',
  'Gaziantep',
  'Konya',
  'Kocaeli',
  'Mersin',
  'Kayseri',
  'Samsun',
  'Diyarbakır'
];

export const SCHOOL_TYPES = [
  'TÜMÜ',
  'Fen Lisesi',
  'Anadolu Lisesi',
  'Sosyal Bilimler',
  'Proje İHL',
  'Mesleki Teknik'
];

interface LgsTercihRobotuProps {
  onSelectBook?: (bookId: string) => void;
}

export const LgsTercihRobotu: React.FC<LgsTercihRobotuProps> = () => {
  const [userScore, setUserScore] = useState<number>(475.00);
  const [userPercentile, setUserPercentile] = useState<number>(2.00);
  const [selectedCity, setSelectedCity] = useState<string>('TÜMÜ');
  const [selectedType, setSelectedType] = useState<string>('TÜMÜ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePercentFilter, setActivePercentFilter] = useState<LgsPercentRangeFilter>('ALL');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'percentile' | 'score' | 'name'>('percentile');
  const [selectedList, setSelectedList] = useState<HighSchool[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0, 1]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);

  // Approximate conversion between score and percentile based on MEB distribution
  const handleScoreChange = (score: number) => {
    const s = Math.max(100, Math.min(500, score || 0));
    setUserScore(s);
    let estPercentile = 50;
    if (s >= 495) estPercentile = 0.10;
    else if (s >= 490) estPercentile = 0.35;
    else if (s >= 485) estPercentile = 0.75;
    else if (s >= 480) estPercentile = 1.30;
    else if (s >= 475) estPercentile = 2.00;
    else if (s >= 470) estPercentile = 2.70;
    else if (s >= 460) estPercentile = 3.90;
    else if (s >= 450) estPercentile = 5.50;
    else if (s >= 440) estPercentile = 7.30;
    else if (s >= 420) estPercentile = 11.50;
    else if (s >= 400) estPercentile = 16.00;
    else estPercentile = Math.min(100, Math.max(0.01, ((500 - s) / 5) * 1.2));
    setUserPercentile(Number(estPercentile.toFixed(2)));
  };

  const handlePercentileChange = (p: number) => {
    const val = Math.max(0.01, Math.min(100, p || 0.01));
    setUserPercentile(val);
    let estScore = 300;
    if (val <= 0.10) estScore = 496.0;
    else if (val <= 0.50) estScore = 489.0;
    else if (val <= 1.00) estScore = 483.5;
    else if (val <= 2.00) estScore = 475.0;
    else if (val <= 3.00) estScore = 468.0;
    else if (val <= 5.00) estScore = 455.0;
    else if (val <= 8.00) estScore = 438.0;
    else if (val <= 12.00) estScore = 420.0;
    else estScore = Math.max(100, 500 - (val / 1.2) * 5);
    setUserScore(Number(estScore.toFixed(2)));
  };

  const handleReset = () => {
    setUserScore(475.00);
    setUserPercentile(2.00);
    setSelectedCity('TÜMÜ');
    setSelectedType('TÜMÜ');
    setSearchQuery('');
    setActivePercentFilter('ALL');
    setOnlyEligible(false);
    setSelectedList([]);
  };

  // Add / Remove from list (max 10 preferences for LGS Central Placement)
  const handleToggleSchool = (school: HighSchool) => {
    if (selectedList.some((s) => s.id === school.id)) {
      setSelectedList((prev) => prev.filter((s) => s.id !== school.id));
    } else {
      if (selectedList.length >= 10) {
        alert('MEB LGS Merkezi Yerleştirme kurallarına göre en fazla 10 tercih yapabilirsiniz.');
        return;
      }
      setSelectedList((prev) => [...prev, school]);
    }
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...selectedList];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setSelectedList(newList);
  };

  const handleDrop = (index: number) => {
    setDraggedIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...selectedList];
    const item = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = item;
    setSelectedList(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedList.length - 1) return;
    const newList = [...selectedList];
    const item = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = item;
    setSelectedList(newList);
  };

  // Filtered and evaluated schools
  const processedSchools = useMemo(() => {
    return HIGH_SCHOOLS_DATABASE.map((school) => {
      const scoreDiff = Number((userScore - school.baseScore2024).toFixed(2));
      const percentileDiff = Number((school.percentile2024 - userPercentile).toFixed(2));

      // Likelihood evaluation
      let chance: 'GÜVENLİ' | 'İDEAL' | 'RİSKLİ' | 'ÇOK ZOR' = 'ÇOK ZOR';
      let chanceColor = 'bg-stone-500/15 text-stone-700 border-stone-400/40';
      let chanceText = 'Uzak İhtimal';

      if (userScore >= school.baseScore2024 + 4 || userPercentile <= school.percentile2024 * 0.85) {
        chance = 'GÜVENLİ';
        chanceColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40';
        chanceText = 'Güvenli / Yüksek İhtimal';
      } else if (userScore >= school.baseScore2024 - 4 || Math.abs(userPercentile - school.percentile2024) <= 0.4) {
        chance = 'İDEAL';
        chanceColor = 'bg-blue-500/15 text-blue-800 border-blue-500/40';
        chanceText = 'İdeal Tercih Aralığı';
      } else if (userScore >= school.baseScore2024 - 12) {
        chance = 'RİSKLİ';
        chanceColor = 'bg-amber-500/15 text-amber-800 border-amber-500/40';
        chanceText = 'Riskli / Üst Tercih';
      }

      const isEligible = chance === 'GÜVENLİ' || chance === 'İDEAL';

      return {
        ...school,
        scoreDiff,
        percentileDiff,
        chance,
        chanceColor,
        chanceText,
        isEligible
      };
    })
    .filter((school) => {
      if (selectedCity !== 'TÜMÜ' && school.city !== selectedCity) return false;
      if (selectedType !== 'TÜMÜ' && school.type !== selectedType) return false;
      if (onlyEligible && !school.isEligible) return false;

      // Percentile range filter
      if (activePercentFilter === '0-1' && !(school.percentile2024 <= 1.00)) return false;
      if (activePercentFilter === '1-3' && !(school.percentile2024 > 1.00 && school.percentile2024 <= 3.00)) return false;
      if (activePercentFilter === '3-5' && !(school.percentile2024 > 3.00 && school.percentile2024 <= 5.00)) return false;
      if (activePercentFilter === '5-10' && !(school.percentile2024 > 5.00 && school.percentile2024 <= 10.00)) return false;
      if (activePercentFilter === '10-20' && !(school.percentile2024 > 10.00 && school.percentile2024 <= 20.00)) return false;
      if (activePercentFilter === '20-50' && !(school.percentile2024 > 20.00 && school.percentile2024 <= 50.00)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = school.name.toLowerCase().includes(query);
        const matchDistrict = school.district.toLowerCase().includes(query);
        const matchCity = school.city.toLowerCase().includes(query);
        if (!matchName && !matchDistrict && !matchCity) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'percentile') return a.percentile2024 - b.percentile2024;
      if (sortBy === 'score') return b.baseScore2024 - a.baseScore2024;
      return a.name.localeCompare(b.name);
    });
  }, [userScore, userPercentile, selectedCity, selectedType, searchQuery, activePercentFilter, onlyEligible, sortBy]);

  const totalSelectedQuota = useMemo(() => {
    return selectedList.reduce((acc, curr) => acc + (curr.quota || 0), 0);
  }, [selectedList]);

  // PDF Generation with jsPDF & Turkish Font
  const handleDownloadPdf = async (shareFile = false): Promise<Blob | null> => {
    if (selectedList.length === 0) {
      alert('Lütfen PDF indirmeden önce sol tablodan en az 1 lise tercih listenize ekleyin.');
      return null;
    }

    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const fontLoaded = await applyTurkishFont(doc);
      const fontName = fontLoaded ? 'Roboto' : 'helvetica';

      // 1. Üst Başlık & Logo
      try {
        const logoImg = new Image();
        logoImg.src = '/logo.png';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
        });
        doc.addImage(logoImg, 'PNG', 14, 10, 24, 24);
      } catch (err) {
        console.warn('Logo could not be added:', err);
      }

      // Başlık Yazıları
      doc.setFont(fontName, 'bold');
      doc.setFontSize(14);
      doc.setTextColor(26, 26, 26);
      doc.text('AŞKAR YAYINLARI', 42, 16);

      doc.setFont(fontName, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(2, 132, 199); // Sky blue
      doc.text('MEB LGS 2025-2026 • TERCİH ÇALIŞMA LİSTESİ', 42, 22);

      doc.setFont(fontName, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Liselere Geçiş Sistemi (LGS) Merkezi Yerleştirme Simülasyonu', 42, 28);

      // Ayırıcı Çizgi
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(14, 37, 196, 37);

      // 2. Aday Bilgileri Kutusu
      doc.setFillColor(250, 249, 246);
      doc.roundedRect(14, 40, 182, 15, 2, 2, 'F');
      doc.setDrawColor(210, 210, 210);
      doc.roundedRect(14, 40, 182, 15, 2, 2, 'S');

      doc.setFont(fontName, 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 26, 26);

      const today = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.text(`LGS Puanı: ${userScore.toFixed(2)}`, 18, 46);
      doc.text(`Genel Yüzdelik Dilim: %${userPercentile.toFixed(2)}`, 68, 46);
      doc.text(`Toplam Tercih: ${selectedList.length} / 10`, 128, 46);
      doc.text(`Tarih: ${today}`, 18, 51.5);
      doc.text(`Toplam Kontenjan: ${totalSelectedQuota} Öğrenci`, 68, 51.5);
      doc.text('Sistem: MEB e-Okul Uyumlu', 128, 51.5);

      // 3. Tercih Tablosu (1-10)
      const tableData = selectedList.map((school, idx) => {
        const scoreDiff = Number((userScore - school.baseScore2024).toFixed(2));
        let chanceStr = 'İdeal';
        if (userScore >= school.baseScore2024 + 4 || userPercentile <= school.percentile2024 * 0.85) chanceStr = 'Güvenli';
        else if (userScore < school.baseScore2024 - 4) chanceStr = 'Riskli / Üst';

        return [
          (idx + 1).toString(),
          getSchoolCode(school),
          school.name,
          `${school.city} / ${school.district}`,
          school.type,
          school.lang,
          school.pansiyon,
          school.quota.toString(),
          school.baseScore2024.toFixed(2),
          `%${school.percentile2024.toFixed(2)}`,
          chanceStr
        ];
      });

      autoTable(doc, {
        startY: 59,
        head: [['No', 'Okul Kodu', 'Lise Adı', 'Şehir / İlçe', 'Okul Türü', 'Dil', 'Pansiyon', 'Kont.', '2024 Taban', '2024 Dilim', 'İhtimal']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [26, 26, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'left',
          font: fontName,
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2.5,
          font: fontName,
          textColor: [30, 30, 30],
        },
        alternateRowStyles: {
          fillColor: [250, 249, 246],
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 18, fontSize: 6.5 },
          2: { cellWidth: 58 },
          3: { cellWidth: 38 },
          4: { cellWidth: 28, fontSize: 6.5 },
          5: { cellWidth: 22, fontSize: 6.5 },
          6: { cellWidth: 24, fontSize: 6.5 },
          7: { cellWidth: 14, halign: 'center' },
          8: { cellWidth: 18, halign: 'right' },
          9: { cellWidth: 18, halign: 'right' },
          10: { cellWidth: 22, halign: 'center', fontSize: 6.5 },
        },
        margin: { left: 14, right: 14 },
      });

      const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 220;
      const footerY = Math.min(190, Math.max(lastY, 160));

      // Alt Çizgi
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.line(14, footerY - 4, 283, footerY - 4);

      // Tıklanabilir Linkler
      doc.setFont(fontName, 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(2, 132, 199);

      doc.textWithLink('Aşkar Yayınlarına Ulaş - https://askaryayinlari.com.tr', 14, footerY + 2, {
        url: 'https://askaryayinlari.com.tr',
      });

      doc.textWithLink('LGS Tercih Robotuna Dön - https://askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu', 14, footerY + 8, {
        url: 'https://askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu',
      });

      doc.setFont(fontName, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('© Aşkar Yayınları. Bu liste 2025-2026 LGS tercih dönemi için stratejik çalışma belgesidir.', 14, footerY + 14);

      // QR Kod
      try {
        const qrDataUrl = await QRCode.toDataURL('https://askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu', {
          margin: 1,
          width: 80,
          color: {
            dark: '#1A1A1A',
            light: '#FFFFFF',
          },
        });
        doc.addImage(qrDataUrl, 'PNG', 260, footerY - 2, 22, 22);
        doc.setFontSize(6.5);
        doc.setTextColor(90, 90, 90);
        doc.text('Robota Git', 264, footerY + 22);
      } catch (err) {
        console.warn('QR error:', err);
      }

      const fileName = `LGS_Tercih_Listem_Puan_${userScore.toFixed(0)}_Dilim_${userPercentile.toFixed(2)}.pdf`;
      const pdfBlob = doc.output('blob');
      if (shareFile) {
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
        const canShareFile = typeof navigator.share === 'function'
          && typeof navigator.canShare === 'function'
          && navigator.canShare({ files: [pdfFile] });

        if (canShareFile) {
          await navigator.share({
            title: 'LGS Tercih Listem - Aşkar Yayınları',
            text: 'LGS tercih listem PDF dosyası',
            files: [pdfFile]
          });
        } else {
          setShowShareModal(true);
        }
      } else {
        doc.save(fileName);
      }
      return pdfBlob;
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      return null;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSharePdf = async () => {
    if (selectedList.length === 0) {
      alert('Lütfen PDF paylaşmadan önce tercih listenize en az 1 lise ekleyin.');
      return;
    }
    await handleDownloadPdf(true);
  };

  // List Share Content
  const shareTextSummary = useMemo(() => {
    if (selectedList.length === 0) return '';
    const lines = selectedList.map((s, i) => `${i + 1}. [${getSchoolCode(s)}] ${s.name} | ${s.city}/${s.district} | ${s.type} | ${s.lang} | Pansiyon: ${s.pansiyon} | ${s.baseScore2024.toFixed(2)} puan | %${s.percentile2024.toFixed(2)} | Kont: ${s.quota}`);
    return `🎓 MEB LGS 2025-2026 Tercih Listem (Puan: ${userScore.toFixed(2)}, Dilim: %${userPercentile.toFixed(2)}):\n\n${lines.join('\n')}\n\nAşkar LGS Tercih Robotu ile hazırlandı: https://askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu`;
  }, [selectedList, userScore, userPercentile]);

  const handleShareClick = async () => {
    if (selectedList.length === 0) {
      alert('Lütfen paylaşmadan önce tercih listenize en az 1 lise ekleyin.');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LGS Tercih Listem - Aşkar Yayınları',
          text: shareTextSummary,
          url: 'https://askaryayinlari.com.tr/uygulamalar/lgs-tercih-robotu'
        });
        return;
      } catch (err) {
        // User cancelled or fallback to modal
      }
    }

    setShowShareModal(true);
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(shareTextSummary).then(() => {
      setCopiedShareText(true);
      setTimeout(() => setCopiedShareText(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareTextSummary);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const lgsCoachBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'k8');
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const FAQ_ITEMS = [
    {
      q: 'LGS tercihinde yüzdelik dilim mi puan mı önemli?',
      a: 'LGS tercihlerinde kesinlikle genel yüzdelik dilim esas alınmalıdır. Sınavın zorluk derecesine göre puanlar yıldan yıla 20-30 puan değişebilirken, adayın Türkiye genelindeki yüzdelik dilimi çok daha kararlı ve güvenilirdir.'
    },
    {
      q: 'Merkezi yerleştirmede kaç tercih hakkı vardır?',
      a: 'LGS merkezi sınav puanıyla öğrenci alan Fen, Sosyal Bilimler, Proje Anadolu ve Proje İHL liseleri için adaylara en fazla 10 tercih hakkı tanınır. Ayrıca yerel yerleştirme ile 5, pansiyonlu okullar için 5 tercih hakkı bulunur.'
    },
    {
      q: 'Tercih sıralaması önemli mi, 1. sıraya yazmak avantaj sağlar mı?',
      a: 'MEB yerleştirme algoritması puan ve yüzdelik dilim üstünlüğüne göre çalışır. Bir liseyi 1. sıraya yazmak yerleşmede puan avantajı sağlamaz; tek önemi kendi listenizdeki bölümlerden en çok istediğinizi en üste yerleştirmektir.'
    },
    {
      q: '10 tercih yelpazesi nasıl dengelenmelidir?',
      a: 'Uzmanlar ilk 2-3 tercihi yüzdelik diliminizin %20-30 üstündeki hayal liselere, orta 4-5 tercihi kendi diliminize çok yakın ideal okullara, son 2-3 tercihi ise açıkta kalmamak için diliminizin %40-50 altındaki güvenli okullara ayırmanızı önerir.'
    },
    {
      q: 'LGS tercih listemi PDF olarak nasıl indirebilirim?',
      a: 'Sol tablodaki liselerin yanındaki "+ Ekle" butonuna basarak 10 tercihinizi belirledikten sonra sağ paneldeki siyah "PDF OLARAK İNDİR" butonuna basmanız yeterlidir. Liste Aşkar logolu, Türkçe karakter uyumlu ve QR kodlu olarak kaydedilir.'
    },
    {
      q: 'Tercih listemi öğretmenim veya ailemle nasıl paylaşabilirim?',
      a: 'Tercih listenizi oluşturduktan sonra "LİSTEYİ PAYLAŞ" butonuna tıklayarak tek dokunuşla WhatsApp üzerinden gönderebilir veya düzenli numaralandırılmış liste metnini kopyalayarak mesajla iletebilirsiniz.'
    },
    {
      q: 'Pansiyonlu okullar ne anlama gelir?',
      a: 'Kendi şehriniz dışındaki liseleri tercih ederken kız/erkek devlet pansiyonu imkanı bulunan okulları seçebilirsiniz. Pansiyonlu okullar il dışından gelen başarılı öğrencilere barınma ve beslenme imkanı sunar.'
    },
    {
      q: 'Yerel yerleştirme yapmadan merkezi yerleştirme tercihi yapılabilir mi?',
      a: 'MEB e-Okul kurallarına göre adayların merkezi yerleştirme (10 lise) ekranını açabilmesi için öncelikle ikametgah adresine göre sınavsız yerel yerleştirme tercihi yapması zorunludur.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1A1A]">
      {/* ======================================================== */}
      {/* BÖLÜM 1 - UYGULAMA KARTI (Aşkar Tasarımı: Beyaz Kart, Siyah Butonlar) */}
      {/* ======================================================== */}
      <section
        id="lgs-tercih-robotu-app"
        className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs relative"
      >
        {/* Üst Başlık & Rozet */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1A1A1A] rounded-xl text-white shadow-2xs">
              <Compass className="w-6 h-6 text-[#C9A86A]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0284c7] font-bold">
                2025-2026 LGS TERCİH DÖNEMİ • TERCİH SİHİRBAZI
              </div>
              <h1 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
                LGS Tercih Sihirbazı - Yüzdelik Dilime Göre Gerçek Liste
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#FAF9F6] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold"
              title="Formu ve seçimleri sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* 1.1 Üst Giriş Alanı: Puan, Yüzdelik Dilim ve Otomatik İstatistik Kartı */}
        <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* LGS Puanınız */}
          <div className="lg:col-span-4">
            <label htmlFor="user-lgs-score-input" className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1.5">
              LGS SINAV PUANINIZI GİRİN:
            </label>
            <div className="relative">
              <input
                id="user-lgs-score-input"
                type="number"
                min="100"
                max="500"
                step="0.01"
                value={userScore}
                onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-4 py-3 text-xl font-serif font-black text-[#1A1A1A] focus:ring-2 focus:ring-[#0284c7] focus:outline-hidden pr-20"
                placeholder="Örn: 475.00"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#0284c7] pointer-events-none">
                PUAN
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#1A1A1A]/60 mt-1 block">
              100.00 ile 500.00 arasında MEB sınav puanı
            </span>
          </div>

          {/* Genel Yüzdelik Dilim */}
          <div className="lg:col-span-4">
            <label htmlFor="user-lgs-percent-input" className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1.5">
              GENEL YÜZDELİK DİLİMİNİZ:
            </label>
            <div className="relative">
              <input
                id="user-lgs-percent-input"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={userPercentile}
                onChange={(e) => handlePercentileChange(parseFloat(e.target.value) || 0.01)}
                className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-4 py-3 text-xl font-serif font-black text-[#1A1A1A] focus:ring-2 focus:ring-[#0284c7] focus:outline-hidden pr-20"
                placeholder="Örn: 2.00"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#0284c7] pointer-events-none">
                % DİLİM
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#1A1A1A]/60 mt-1 block">
              Puan veya dilim değiştikçe eşzamanlı güncellenir
            </span>
          </div>

          {/* Otomatik İstatistik & Analiz Özeti */}
          <div className="lg:col-span-4 bg-white border-2 border-[#0284c7]/30 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#0284c7] font-black block">
                TERCİH ARALIĞI
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
                  %{userPercentile.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#0284c7]">
                  (İlk %{userPercentile.toFixed(2)})
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#1A1A1A]/60 block mt-0.5">
                Hedef: %{(userPercentile * 0.75).toFixed(2)} - %{(userPercentile * 1.35).toFixed(2)} bandı
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#0284c7]" />
            </div>
          </div>
        </div>

        {/* 1.2 Yüzdelik Aralık Filtresi Butonları */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A] flex items-center gap-1.5">
              <span>YÜZDELİK ARALIK FİLTRESİ:</span>
              <span className="text-[10px] text-[#0284c7] font-normal lowercase">(liseleri dilime göre filtreler)</span>
            </span>

            {/* Hızlı Aday Dilimi Seçici */}
            <button
              type="button"
              onClick={() => {
                if (userPercentile <= 1) setActivePercentFilter('0-1');
                else if (userPercentile <= 3) setActivePercentFilter('1-3');
                else if (userPercentile <= 5) setActivePercentFilter('3-5');
                else if (userPercentile <= 10) setActivePercentFilter('5-10');
                else if (userPercentile <= 20) setActivePercentFilter('10-20');
                else setActivePercentFilter('20-50');
              }}
              className="text-[10px] font-mono font-bold text-[#0284c7] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Dilimime Uygun Aralığı Seç (%{userPercentile.toFixed(2)})</span>
            </button>
          </div>

          {/* Aralık Butonları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <button
              type="button"
              onClick={() => setActivePercentFilter('ALL')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer text-center ${
                activePercentFilter === 'ALL'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [TÜMÜ]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('0-1')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '0-1'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%0 - 1]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('1-3')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '1-3'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%1 - 3]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('3-5')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '3-5'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%3 - 5]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('5-10')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '5-10'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%5 - 10]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('10-20')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '10-20'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%10 - 20]
            </button>
            <button
              type="button"
              onClick={() => setActivePercentFilter('20-50')}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                activePercentFilter === '20-50'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F3EFE6]'
              }`}
            >
              [%20 - 50]
            </button>
          </div>

          {/* İkincil Arama, Şehir ve Okul Türü Filtresi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1A1A1A]/10">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0284c7]" />
                <span>ŞEHİR FİLTRESİ:</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-[#1A1A1A] focus:ring-1 focus:ring-[#0284c7]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'TÜMÜ' ? 'Tüm Şehirler' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
                <School className="w-3 h-3 text-[#0284c7]" />
                <span>OKUL TÜRÜ:</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-[#1A1A1A] focus:ring-1 focus:ring-[#0284c7]"
              >
                {SCHOOL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'TÜMÜ' ? 'Tüm Okul Türleri' : t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
                <Search className="w-3 h-3 text-[#0284c7]" />
                <span>LİSE VEYA İLÇE ARA:</span>
              </label>
              <input
                type="text"
                placeholder="Örn: Fen Lisesi, Kabataş, Hatay, Defne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1A1A1A]/8 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="w-4 h-4 accent-[#1A1A1A] rounded"
              />
              <span>Sadece yerleşebileceğim (Güvenli & İdeal) liseleri göster</span>
            </label>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1A1A1A]/60">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sırala:</span>
              <button
                onClick={() => setSortBy('percentile')}
                className={`px-2.5 py-0.5 rounded cursor-pointer ${
                  sortBy === 'percentile' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Yüzdelik Dilim
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-2.5 py-0.5 rounded cursor-pointer ${
                  sortBy === 'score' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Taban Puan
              </button>
            </div>
          </div>
        </div>

        {/* 1.3 İKİ KOLONLU DÜZEN: SOLDA FİLTRELENEN LİSELER TABLOSU + SAĞDA GERÇEK LGS TERCİH LİSTEM 1-10 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SOL: Lise Havuzu Tablosu */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#0284c7]" />
                <span className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Uygun Liseler ({processedSchools.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#1A1A1A]/60">
                Puan: <strong className="text-[#0284c7]">{userScore.toFixed(2)}</strong> (%{userPercentile.toFixed(2)})
              </span>
            </div>

            <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-2xs bg-[#FAF9F6]">
              <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider">
                      <th className="p-3 w-10 text-center">Ekle</th>
                      <th className="p-3">Okul Kodu</th>
                      <th className="p-3">Lise Adı & İlçe</th>
                      <th className="p-3">Şehir & Tür</th>
                      <th className="p-3 text-center w-14">Kont.</th>
                      <th className="p-3 text-right">2024 Puan</th>
                      <th className="p-3 text-right">Dilim</th>
                      <th className="p-3 text-center w-24">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
                    {processedSchools.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-xs text-[#1A1A1A]/60 font-sans">
                          Seçilen yüzdelik dilim veya arama kriterine uygun lise bulunamadı. Lütfen filtreyi genişletin.
                        </td>
                      </tr>
                    ) : (
                      processedSchools.map((school) => {
                        const isSelected = selectedList.some((s) => s.id === school.id);
                        const selectedIdx = selectedList.findIndex((s) => s.id === school.id);

                        return (
                          <tr
                            key={school.id}
                            className={`hover:bg-[#FAF9F6] transition-colors ${
                              isSelected ? 'bg-sky-50/50' : ''
                            }`}
                          >
                            <td className="p-2.5 sm:p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSchool(school)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0284c7] text-white shadow-2xs hover:bg-sky-700'
                                    : 'bg-[#1A1A1A] hover:bg-black text-white'
                                }`}
                                title={isSelected ? 'Listeden Çıkar' : '10 Tercih Listeme Ekle'}
                              >
                                {isSelected ? (
                                  <>
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>#{selectedIdx + 1}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Ekle</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="p-2.5 sm:p-3 font-mono text-[10px] font-bold text-[#0284c7] whitespace-nowrap">
                              {getSchoolCode(school)}
                            </td>

                            <td className="p-2.5 sm:p-3">
                              <span className="font-serif font-bold text-xs text-[#1A1A1A] block">
                                {school.name}
                              </span>
                              <span className="text-[10px] text-[#1A1A1A]/50 font-sans block truncate max-w-[200px]">
                                {school.city} / {school.district} • Pansiyon: {school.pansiyon}
                              </span>
                            </td>

                            <td className="p-2.5 sm:p-3">
                              <span className="font-sans font-bold text-xs text-[#1A1A1A] block">
                                {school.type}
                              </span>
                              <span className="text-[10px] font-mono text-[#0284c7] font-semibold">
                                {school.lang}
                              </span>
                            </td>

                            <td className="p-2.5 sm:p-3 text-center font-mono font-bold text-[#1A1A1A]">
                              <span className="inline-block bg-[#FAF9F6] border border-[#1A1A1A]/10 px-2 py-0.5 rounded text-[11px]">
                                {school.quota}
                              </span>
                            </td>

                            <td className="p-2.5 sm:p-3 text-right font-mono font-bold text-[#1A1A1A]">
                              {school.baseScore2024.toFixed(2)}
                            </td>

                            <td className="p-2.5 sm:p-3 text-right font-mono font-bold text-[#0284c7]">
                              %{school.percentile2024.toFixed(2)}
                            </td>

                            <td className="p-2.5 sm:p-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-mono font-bold border ${school.chanceColor}`}
                              >
                                {school.chance === 'GÜVENLİ'
                                  ? 'Güvenli'
                                  : school.chance === 'İDEAL'
                                  ? 'İdeal'
                                  : school.chance === 'RİSKLİ'
                                  ? 'Riskli'
                                  : 'Uzak'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SAĞ: Gerçek LGS Tercih Listem 1-10 (Sürükle-Bırak, PDF İndir & Paylaş) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0284c7]" />
                <h3 className="font-serif font-black text-sm sm:text-base text-[#1A1A1A]">
                  LGS Tercih Listem 1-10 ({selectedList.length} / 10)
                </h3>
              </div>

              {selectedList.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#1A1A1A]/60">
                    Toplam Kont: <strong>{totalSelectedQuota}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedList([])}
                    className="text-[10px] font-mono text-red-600 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Temizle</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tercih Listesi Kutusu */}
            <div className="border border-[#1A1A1A]/10 rounded-2xl p-4 bg-[#FAF9F6] min-h-[420px] flex flex-col justify-between shadow-2xs">
              {selectedList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#1A1A1A]/60">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#1A1A1A]/10 flex items-center justify-center mb-3 text-[#0284c7]">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                    Listeniz Henüz Boş
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/70 max-w-xs leading-relaxed">
                    Sol tablodaki liselerin yanındaki <strong>[+ Ekle]</strong> butonuna basarak en fazla 10 tercihinizi ekleyin.
                    Eklediğiniz liseleri <strong>sürükle-bırak</strong> ile istediğiniz sıraya taşıyabilir, PDF indirebilir veya paylaşabilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {selectedList.map((school, index) => {
                    return (
                      <div
                        key={school.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        className={`bg-white border rounded-xl p-2.5 transition-all flex items-center gap-2 group cursor-move ${
                          draggedIndex === index
                            ? 'opacity-40 border-dashed border-[#0284c7]'
                            : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A] shadow-2xs'
                        }`}
                      >
                        {/* Drag Handle */}
                        <div className="text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] cursor-grab">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Sıra Numarası Rozeti */}
                        <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>

                        {/* Okul Bilgisi */}
                        <div className="flex-1 min-w-0">
                          <span className="font-serif font-bold text-xs text-[#1A1A1A] truncate block">
                            {school.name}
                          </span>
                          <span className="text-[10px] text-[#1A1A1A]/60 font-sans truncate block">
                            {getSchoolCode(school)} • {school.city} / {school.district} • {school.type}
                          </span>
                          <span className="text-[9.5px] font-mono text-[#0284c7] font-semibold">
                            {school.lang} • Pansiyon: {school.pansiyon} • Puan: {school.baseScore2024.toFixed(2)} • Dilim: %{school.percentile2024.toFixed(2)} • Kont: {school.quota}
                          </span>
                        </div>

                        {/* Yukarı / Aşağı Butonları */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                            className="p-1 rounded hover:bg-[#FAF9F6] text-[#1A1A1A]/50 hover:text-[#1A1A1A] disabled:opacity-20 cursor-pointer"
                            title="Yukarı Taşı"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === selectedList.length - 1}
                            onClick={() => handleMoveDown(index)}
                            className="p-1 rounded hover:bg-[#FAF9F6] text-[#1A1A1A]/50 hover:text-[#1A1A1A] disabled:opacity-20 cursor-pointer"
                            title="Aşağı Taşı"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Sil Butonu */}
                        <button
                          type="button"
                          onClick={() => handleToggleSchool(school)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer transition-colors shrink-0"
                          title="Listeden Çıkar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Alt Butonlar: PDF OLARAK İNDİR + LİSTEYİ PAYLAŞ */}
              <div className="pt-4 border-t border-[#1A1A1A]/10 mt-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* PDF İndir */}
                  <button
                    type="button"
                    id="btn-download-lgs-tercih-pdf"
                    disabled={isGeneratingPdf}
                    onClick={handleDownloadPdf}
                    className="bg-[#1A1A1A] hover:bg-black text-white py-3 px-3 rounded-full text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A]"
                  >
                    <Download className="w-4 h-4 text-[#C9A86A]" />
                    <span>{isGeneratingPdf ? 'HAZIRLANIYOR...' : 'PDF İNDİR'}</span>
                  </button>

                  <button
                    type="button"
                    id="btn-share-lgs-tercih-pdf"
                    disabled={isGeneratingPdf}
                    onClick={handleSharePdf}
                    className="bg-[#0284c7] hover:bg-sky-700 text-white py-3 px-3 rounded-full text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer border border-[#0284c7] disabled:opacity-60"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                    <span>PDF'Yİ PAYLAŞ</span>
                  </button>

                  {/* Listeyi Paylaş */}
                  <button
                    type="button"
                    id="btn-share-lgs-tercih-list"
                    onClick={handleShareClick}
                    className="bg-white hover:bg-[#FAF6EE] text-[#1A1A1A] py-3 px-3 rounded-full text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-95 shadow-2xs cursor-pointer border border-[#1A1A1A]/20 hover:border-[#0284c7]"
                  >
                    <Share2 className="w-4 h-4 text-[#0284c7]" />
                    <span>LİSTEYİ PAYLAŞ</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-[#1A1A1A]/50 text-center">
                  Türkçe Karakter Uyumlu • Kontenjan Detaylı • QR Kodlu & Paylaşılabilir
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aşkar LGS Koçluk Kitabı Kartı */}
        {lgsCoachBook && (
          <div className="mt-8 p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#1e293b] text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={lgsCoachBook.image}
                alt={lgsCoachBook.title}
                className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
              />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>HAYALİNDEKİ LİSEYE ULAŞTIRAN LGS KOÇLUK SİSTEMİ:</span>
                </div>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                  {lgsCoachBook.title}
                </h4>
                <p className="text-xs text-white/70 font-sans max-w-xl">
                  10 tercih hakkınızı en doğru dağıtmak, açıkta kalma riskini sıfırlamak ve yüzdelik diliminizi en verimli şekilde Fen ve Anadolu liselerine dönüştürmek için Aşkar LGS Koçluk Kitabını inceleyin.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setPreviewBook(lgsCoachBook)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>ÖNİZLE</span>
              </button>

              <a
                href={lgsCoachBook.shopierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A86A] hover:bg-[#b89557] text-[#1A1A1A] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>SHOPIER İLE İNDİR</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* BÖLÜM 2 - SEO ve AÇIKLAMA: 2 BEYAZ BİLGİ KUTUSU */}
      {/* ======================================================== */}
      <section className="space-y-6">
        {/* KUTU 1: LGS Tercihlerinde En Çok Nelere Dikkat Edilmeli? */}
        <article className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#1A1A1A]/10 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0284c7] font-bold block mb-1">
              LGS REHBERLİK & TERCİH STRATEJİSİ
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
              LGS Tercihlerinde En Çok Nelere Dikkat Edilmeli?
            </h2>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-[#1A1A1A]/85 font-sans leading-relaxed space-y-4">
            <p>
              Liselere Geçiş Sistemi (LGS) sınavının tamamlanmasıyla birlikte 8. sınıf öğrencileri ve veliler için en az sınav hazırlığı kadar kritik bir dönem başlar: <strong>LGS Tercih Süreci</strong>. Bir yıl boyunca gösterilen çabanın, çözülen binlerce yeni nesil sorunun karşılığını almak ve adayın potansiyeline en uygun liseye yerleşebilmesi, bilinçli bir tercih planlamasıyla mümkündür. Yanlış hazırlanan bir liste, adayın puanı yettiği halde istemediği bir okula gitmesine ya da açıkta kalarak yerel yerleştirmeye mecbur kalmasına neden olabilir. İşte LGS tercihlerinde dikkat edilmesi gereken 5 altın kural:
            </p>

            <div className="space-y-4 pt-2">
              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Sıralama ve Yüzdelik Dilim mi Puan mı Önemli?</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  Velilerin en büyük yanılgısı, bir önceki yılın taban puanlarını referans alarak tercih yapmaktır. Oysa sınavın zorluğuna göre 460 puan alan bir öğrenci bir yıl %2'lik dilime girerken, başka bir yıl sınavın kolaylığı nedeniyle %4'lük dilime gerileyebilir. Puanlar sınavın matematik veya fen zorluğuna göre dalgalanır; ancak yüzdelik dilim öğrencinin Türkiye sıralamasındaki gerçek yerini gösterdiği için en güvenilir pusuladır. Listenizi daima genel yüzdelik diliminize göre oluşturmalısınız.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">2</span>
                  <span>10 Tercih Yelpazesi: Hayal, İdeal ve Güvenlik Dengesi</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  Merkezi sınav puanıyla öğrenci alan okullar için tanınan 10 tercih hakkı dengeli bir piramit gibi kurgulanmalıdır. İlk 2-3 tercih, yüzdelik diliminizin %20-30 üzerinde olan ve kazanmayı çok arzu ettiğiniz hayal liselere ayrılmalıdır. Orta 4-5 tercih, tam olarak kendi yüzdelik diliminize denk gelen çekirdek ideal okullardan oluşmalıdır. Son 2-3 tercih ise yüzdelik diliminizin %40-50 altında kalan, yerleşmeniz halinde mutlu olacağınız garanti okullarla kapatılmalıdır.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Fen Lisesi mi Anadolu Lisesi mi?</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  Fen Liseleri, matematik ve fen bilimleri alanında derinlemesine akademik eğitim vererek öğrencileri doğrudan Tıp, Mühendislik ve temel bilimler fakültelerine hazırlar. Anadolu Liseleri ise hem sayısal hem eşit ağırlık (Hukuk, İşletme, İktisat) hem de yabancı dil alanında esnek alan seçimi imkanı sunar. Öğrencinin ilgi alanları ve kariyer hedefi henüz kesinleşmemişse köklü bir Anadolu Lisesi daha esnek bir vizyon sağlayabilir.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Ulaşım, Pansiyon ve Fiziksel Şartların Önemi</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  Listenize ekleyeceğiniz lisenin evinize olan mesafesi 4 yıllık eğitim kalitesini doğrudan etkiler. Günde 2-3 saatini serviste geçiren bir öğrencinin ders çalışma ve sosyal aktivite enerjisi ciddi ölçüde düşer. İl dışı tercihlerde ise okulun kız veya erkek pansiyon imkanları, güvenlik şartları ve fiziki donanımı tercih öncesinde mutlaka araştırılmalıdır.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">5</span>
                  <span>Yerel Yerleştirme Kuralını İhmal Etmeyin</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  MEB mevzuatına göre merkezi yerleştirme ekranında tercih yapabilmek için her adayın ikametgah adresine göre yerel yerleştirme tercihini tamamlaması zorunludur. Yerel yerleştirmede ilk 3 okulun kayıt alanından (yeşil renk) seçilmesi kuralına dikkat edilmeli ve adayın hiçbir merkezi tercihi tutmasa dahi güvenle gidebileceği okullar yazılmalıdır.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* KUTU 2: MEB LGS Yerleştirme Nasıl Yapar? */}
        <article className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#1A1A1A]/10 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0284c7] font-bold block mb-1">
              MEB MERKEZİ YERLEŞTİRME MEVZUATI
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
              MEB LGS Yerleştirme Nasıl Yapar?
            </h2>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-[#1A1A1A]/85 font-sans leading-relaxed space-y-4">
            <p>
              Milli Eğitim Bakanlığı LGS merkezi yerleştirme işlemleri, Bakanlığın Bilgi İşlem Genel Müdürlüğü tarafından yürütülen tamamen objektif bir bilgisayar algoritmasıyla gerçekleştirilir. Sistem tüm Türkiye genelindeki 1 milyondan fazla adayı merkezi sınav puanı üstünlüğüne göre baştan sona tek bir sıralamaya dizer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                  MEB Önce Puana mı Bakar, Tercih Sırasına mı?
                </h3>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">
                  Sistem kesinlikle sınav puanı ve yüzdelik dilim üstünlüğüne bakar. Örneğin aynı liseyi 480 puanlı bir öğrenci 10. sıraya, 479.90 puanlı bir öğrenci ise 1. sıraya yazsa bile, kontenjan 480 puanlı adaya verilir. İstek sıranız sadece sizin kendi listenizdeki tercih önceliğinizi belirler.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                  Puan Eşitliği Halinde Ne Yapılır?
                </h3>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">
                  İki adayın LGS merkezi sınav puanı virgülden sonra dahil tamamen eşitse sırasıyla; Ortaokul Başarı Puanına (OBP), 8, 7 ve 6. sınıf yılsonu başarı puanı üstünlüğüne, özürsüz devamsızlık gün sayısının azlığına ve yaşça küçük olana öncelik tanınır.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                  Önceki Yılın Taban Puanı Ne Anlama Gelir?
                </h3>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">
                  Bir lisenin taban puanı ve yüzdelik dilimi, son açıklanan merkezi yerleştirme verisidir. 2025-2026 tercih döneminin kesin taban puanları, ilgili yerleştirme sonuçları açıklandığında güncellenir.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                  LGS Nakil Dönemleri Nasıl Çalışır?
                </h3>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">
                  İlk yerleştirmede istediği okula yerleşemeyen ya da daha üstteki bir liseyi denemek isteyen öğrenciler için MEB iki aşamalı nakil süreci açar. Nakil döneminde her grup için 3 yeni tercih hakkı verilir; kazanılan okul hakkı nakil çıkana kadar korunur.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* ======================================================== */}
      {/* BÖLÜM 3 - SSS (AKORDİYON) VE FAQ SCHEMA (JSON-LD) */}
      {/* ======================================================== */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#1A1A1A]/10 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#0284c7] font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>SIKÇA SORULAN SORULAR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight mt-1">
            LGS Tercih ve Yerleştirme Hakkında Merak Edilenler
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans mt-1">
            LGS tercih süreci, yüzdelik dilim hesabı ve MEB merkezi yerleştirme yönetmeliğine dair en çok sorulan 8 soru ve yanıtları.
          </p>
        </div>

        {/* Akordiyon Listesi */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndexes.includes(index);
            return (
              <div
                key={index}
                className="border border-[#1A1A1A]/10 rounded-xl overflow-hidden transition-all bg-[#FAF9F6]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                >
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{item.q}</span>
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1A1A1A]/60 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0284c7]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-[#1A1A1A]/80 font-sans leading-relaxed border-t border-[#1A1A1A]/5 bg-white">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_ITEMS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            }),
          }}
        />
      </section>

      {/* ======================================================== */}
      {/* TERCİH LİSTESİ PAYLAŞ MODALI */}
      {/* ======================================================== */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A]/10 space-y-5 relative animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0284c7] text-white">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#1A1A1A]">
                    LGS Tercih Listemi Paylaş
                  </h3>
                  <span className="text-[11px] font-mono text-[#1A1A1A]/60">
                    {selectedList.length} lise • Puan: {userScore.toFixed(2)} • Dilim: %{userPercentile.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Önizleme Alanı */}
            <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-xl p-3.5 max-h-48 overflow-y-auto space-y-1 font-mono text-xs text-[#1A1A1A]/85">
                  {selectedList.map((s, idx) => (
                <div key={s.id} className="truncate">
                  <strong>{idx + 1}.</strong> [{getSchoolCode(s)}] {s.name} ({s.city} - {s.type} - %{s.percentile2024.toFixed(2)})
                </div>
              ))}
            </div>

            {/* Paylaşım Butonları */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>WHATSAPP İLE GÖNDER</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareText}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {copiedShareText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>LİSTE METNİ KOPYALANDI!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C9A86A]" />
                    <span>TERCİH LİSTESİ METNİNİ KOPYALA</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[10px] font-mono text-center text-[#1A1A1A]/50">
              Listeyi öğretmeninize, rehber öğretmeninize veya velinize doğrudan iletebilirsiniz.
            </div>
          </div>
        </div>
      )}

      {/* Kitap Önizleme Modalı */}
      {previewBook && (
        <PreviewModal
          book={previewBook}
          isOpen={true}
          onClose={() => setPreviewBook(null)}
        />
      )}
    </div>
  );
};
