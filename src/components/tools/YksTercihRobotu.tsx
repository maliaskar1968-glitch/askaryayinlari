import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Eye,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Download,
  Plus,
  Check,
  Trash2,
  Globe,
  FileText,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Share2,
  Copy,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

export type YksScoreType = 'SAY' | 'EA' | 'SÖZ' | 'DİL' | 'TYT';
export type UniType = 'Devlet' | 'Vakıf (Burslu)' | 'Vakıf';

export interface UniversityProgram {
  id: string;
  university: string;
  faculty: string;
  department: string;
  scoreType: YksScoreType;
  city: string;
  uniType: 'Devlet' | 'Vakıf';
  scholarship?: 'Tam Burslu' | '%50 İndirimli' | 'Ücretli';
  baseScore2024: number;
  rank2024: number;
  quota: number;
  lang: 'Türkçe' | 'İngilizce' | 'Almanca' | 'Fransızca' | string;
}

export const YKS_PROGRAMS_DATABASE: UniversityProgram[] = [
  // --- SAYISAL (SAY) ---
  // Tıp Fakülteleri
  { id: 'say-1', university: 'İstanbul Üniversitesi - Cerrahpaşa', faculty: 'Cerrahpaşa Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 531.45, rank2024: 1850, quota: 300, lang: 'Türkçe' },
  { id: 'say-5', university: 'Koç Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Burslu)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 552.10, rank2024: 75, quota: 15, lang: 'İngilizce' },
  { id: 'say-13', university: 'Hacettepe Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 539.60, rank2024: 1050, quota: 250, lang: 'Türkçe' },
  { id: 'say-17', university: 'Ankara Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 528.20, rank2024: 2450, quota: 300, lang: 'Türkçe' },
  { id: 'say-21', university: 'Ege Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 524.30, rank2024: 3400, quota: 350, lang: 'Türkçe' },
  { id: 'say-22', university: 'Dokuz Eylül Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 518.80, rank2024: 4600, quota: 280, lang: 'Türkçe' },
  { id: 'say-26', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Tayfur Ata Sökmen Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 497.80, rank2024: 16100, quota: 130, lang: 'Türkçe' },
  { id: 'say-31', university: 'Çukurova Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Adana', uniType: 'Devlet', baseScore2024: 512.40, rank2024: 6100, quota: 280, lang: 'Türkçe' },
  { id: 'say-32', university: 'Bursa Uludağ Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Bursa', uniType: 'Devlet', baseScore2024: 516.30, rank2024: 5200, quota: 250, lang: 'Türkçe' },
  { id: 'say-33', university: 'Akdeniz Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Antalya', uniType: 'Devlet', baseScore2024: 519.20, rank2024: 4500, quota: 260, lang: 'Türkçe' },
  { id: 'say-35', university: 'Gaziantep Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Gaziantep', uniType: 'Devlet', baseScore2024: 502.70, rank2024: 11800, quota: 220, lang: 'Türkçe' },

  // Mühendislik ve Bilişim
  { id: 'say-2', university: 'Boğaziçi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 546.80, rank2024: 310, quota: 90, lang: 'İngilizce' },
  { id: 'say-14', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 544.70, rank2024: 550, quota: 110, lang: 'İngilizce' },
  { id: 'say-16', university: 'Bilkent Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği (Burslu)', scoreType: 'SAY', city: 'Ankara', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 548.90, rank2024: 210, quota: 40, lang: 'İngilizce' },
  { id: 'say-3', university: 'İstanbul Teknik Üniversitesi (İTÜ)', faculty: 'Bilgisayar ve Bilişim Fakültesi', department: 'Yapay Zeka ve Veri Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 538.90, rank2024: 1120, quota: 60, lang: 'İngilizce' },
  { id: 'say-4', university: 'İstanbul Teknik Üniversitesi (İTÜ)', faculty: 'Elektrik-Elektronik Fakültesi', department: 'Elektrik-Elektronik Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 534.20, rank2024: 1540, quota: 150, lang: 'İngilizce' },
  { id: 'say-15', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'Mühendislik Fakültesi', department: 'Elektrik-Elektronik Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 538.10, rank2024: 1210, quota: 180, lang: 'İngilizce' },
  { id: 'say-6', university: 'Yıldız Teknik Üniversitesi', faculty: 'Elektrik-Elektronik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 512.60, rank2024: 5900, quota: 140, lang: 'İngilizce' },
  { id: 'say-18', university: 'Gazi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 498.40, rank2024: 15400, quota: 100, lang: 'Türkçe' },
  { id: 'say-23', university: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 508.90, rank2024: 8200, quota: 90, lang: 'İngilizce' },
  { id: 'say-28', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'Mühendislik ve Doğa Bilimleri', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 432.50, rank2024: 88500, quota: 90, lang: 'Türkçe' },
  { id: 'say-29', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'Havacılık ve Uzay Bilimleri', department: 'Havacılık ve Uzay Mühendisliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 424.10, rank2024: 99400, quota: 50, lang: 'Türkçe' },
  { id: 'say-10', university: 'İstanbul Medipol Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Yazılım Mühendisliği (Burslu)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 494.30, rank2024: 18900, quota: 20, lang: 'İngilizce' },
  { id: 'say-9', university: 'Yıldız Teknik Üniversitesi', faculty: 'Makine Fakültesi', department: 'Makine Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 488.50, rank2024: 24500, quota: 180, lang: 'Türkçe' },
  { id: 'say-19', university: 'Hacettepe Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Endüstri Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 504.60, rank2024: 10200, quota: 90, lang: 'İngilizce' },
  { id: 'say-12', university: 'İstanbul Üniversitesi - Cerrahpaşa', faculty: 'Mühendislik Fakültesi', department: 'Endüstri Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 481.90, rank2024: 31500, quota: 90, lang: 'İngilizce' },
  { id: 'say-34', university: 'Eskişehir Osmangazi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Eskişehir', uniType: 'Devlet', baseScore2024: 479.50, rank2024: 33800, quota: 100, lang: 'İngilizce' },

  // Diş Hekimliği, Eczacılık, Sağlık
  { id: 'say-7', university: 'Marmara Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 486.30, rank2024: 26800, quota: 120, lang: 'Türkçe' },
  { id: 'say-20', university: 'Gazi Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 484.70, rank2024: 28500, quota: 140, lang: 'Türkçe' },
  { id: 'say-24', university: 'Ege Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 487.60, rank2024: 25400, quota: 150, lang: 'Türkçe' },
  { id: 'say-27', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 472.40, rank2024: 40500, quota: 80, lang: 'Türkçe' },
  { id: 'say-8', university: 'İstanbul Üniversitesi', faculty: 'Eczacılık Fakültesi', department: 'Eczacılık', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 468.70, rank2024: 44200, quota: 150, lang: 'Türkçe' },
  { id: 'say-11', university: 'Marmara Üniversitesi', faculty: 'Sağlık Bilimleri Fakültesi', department: 'Hemşirelik', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 412.80, rank2024: 118000, quota: 170, lang: 'Türkçe' },
  { id: 'say-30', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Sağlık Bilimleri Fakültesi', department: 'Hemşirelik', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 384.20, rank2024: 168000, quota: 100, lang: 'Türkçe' },

  // --- EŞİT AĞIRLIK (EA) ---
  // Hukuk Fakülteleri
  { id: 'ea-1', university: 'Galatasaray Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 504.80, rank2024: 180, quota: 80, lang: 'Fransızca' },
  { id: 'ea-4', university: 'Koç Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk (Burslu)', scoreType: 'EA', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 521.80, rank2024: 85, quota: 20, lang: 'Türkçe' },
  { id: 'ea-5', university: 'Ankara Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 462.30, rank2024: 4500, quota: 500, lang: 'Türkçe' },
  { id: 'ea-6', university: 'İstanbul Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 458.70, rank2024: 5900, quota: 650, lang: 'Türkçe' },
  { id: 'ea-7', university: 'Marmara Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 446.50, rank2024: 12200, quota: 400, lang: 'Türkçe' },
  { id: 'ea-8', university: 'Dokuz Eylül Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İzmir', uniType: 'Devlet', baseScore2024: 438.20, rank2024: 18500, quota: 350, lang: 'Türkçe' },
  { id: 'ea-13', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 412.30, rank2024: 48500, quota: 80, lang: 'Türkçe' },

  // İİBF, Psikoloji, YBS
  { id: 'ea-2', university: 'Boğaziçi Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İktisat', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 509.20, rank2024: 320, quota: 100, lang: 'İngilizce' },
  { id: 'ea-3', university: 'Boğaziçi Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İşletme', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 512.40, rank2024: 210, quota: 100, lang: 'İngilizce' },
  { id: 'ea-9', university: 'Boğaziçi Üniversitesi', faculty: 'Uygulamalı Bilimler Fakültesi', department: 'Yönetim Bilişim Sistemleri (YBS)', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 498.60, rank2024: 850, quota: 80, lang: 'İngilizce' },
  { id: 'ea-10', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'İktisadi ve İdari Bilimler', department: 'İktisat', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 486.10, rank2024: 1950, quota: 110, lang: 'İngilizce' },
  { id: 'ea-11', university: 'Hacettepe Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Psikoloji', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 452.90, rank2024: 8800, quota: 120, lang: 'Türkçe' },
  { id: 'ea-12', university: 'Ege Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Psikoloji', scoreType: 'EA', city: 'İzmir', uniType: 'Devlet', baseScore2024: 441.50, rank2024: 15400, quota: 100, lang: 'Türkçe' },
  { id: 'ea-14', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İşletme', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 295.40, rank2024: 420000, quota: 80, lang: 'Türkçe' },
  { id: 'ea-15', university: 'Gazi Üniversitesi', faculty: 'Gazi Eğitim Fakültesi', department: 'Sınıf Öğretmenliği', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 418.70, rank2024: 39500, quota: 90, lang: 'Türkçe' },

  // --- SÖZEL (SÖZ) ---
  { id: 'soz-1', university: 'Boğaziçi Üniversitesi', faculty: 'Fen-Edebiyat Fakültesi', department: 'Tarih', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 482.30, rank2024: 420, quota: 60, lang: 'İngilizce' },
  { id: 'soz-2', university: 'Galatasaray Üniversitesi', faculty: 'İletişim Fakültesi', department: 'İletişim', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 468.90, rank2024: 980, quota: 60, lang: 'Fransızca' },
  { id: 'soz-3', university: 'Hacettepe Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Özel Eğitim Öğretmenliği', scoreType: 'SÖZ', city: 'Ankara', uniType: 'Devlet', baseScore2024: 454.20, rank2024: 2150, quota: 70, lang: 'Türkçe' },
  { id: 'soz-4', university: 'Gazi Üniversitesi', faculty: 'Gazi Eğitim Fakültesi', department: 'Türkçe Öğretmenliği', scoreType: 'SÖZ', city: 'Ankara', uniType: 'Devlet', baseScore2024: 436.50, rank2024: 5900, quota: 80, lang: 'Türkçe' },
  { id: 'soz-5', university: 'Marmara Üniversitesi', faculty: 'İlahiyat Fakültesi', department: 'İlahiyat', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 422.10, rank2024: 11200, quota: 250, lang: 'Türkçe' },
  { id: 'soz-6', university: 'Ankara Hacı Bayram Veli Üniversitesi', faculty: 'Turizm Fakültesi', department: 'Gastronomi ve Mutfak Sanatları', scoreType: 'SÖZ', city: 'Ankara', uniType: 'Devlet', baseScore2024: 416.70, rank2024: 14500, quota: 90, lang: 'Türkçe' },
  { id: 'soz-7', university: 'İstanbul Üniversitesi', faculty: 'İletişim Fakültesi', department: 'Halkla İlişkiler ve Tanıtım', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 388.40, rank2024: 38500, quota: 120, lang: 'Türkçe' },
  { id: 'soz-9', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Özel Eğitim Öğretmenliği', scoreType: 'SÖZ', city: 'Hatay', uniType: 'Devlet', baseScore2024: 415.40, rank2024: 10500, quota: 50, lang: 'Türkçe' },
  { id: 'soz-10', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Türkçe Öğretmenliği', scoreType: 'SÖZ', city: 'Hatay', uniType: 'Devlet', baseScore2024: 396.80, rank2024: 24800, quota: 60, lang: 'Türkçe' },
  { id: 'soz-11', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'İlahiyat Fakültesi', department: 'İlahiyat', scoreType: 'SÖZ', city: 'Hatay', uniType: 'Devlet', baseScore2024: 374.30, rank2024: 52000, quota: 150, lang: 'Türkçe' },
  { id: 'soz-12', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'Turizm Fakültesi', department: 'Gastronomi ve Mutfak Sanatları', scoreType: 'SÖZ', city: 'Hatay', uniType: 'Devlet', baseScore2024: 382.10, rank2024: 41500, quota: 60, lang: 'Türkçe' },

  // --- DİL (YDT) ---
  { id: 'dil-1', university: 'Boğaziçi Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'İngilizce Öğretmenliği', scoreType: 'DİL', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 508.40, rank2024: 680, quota: 70, lang: 'İngilizce' },
  { id: 'dil-2', university: 'Hacettepe Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Mütercim ve Tercümanlık (İngilizce)', scoreType: 'DİL', city: 'Ankara', uniType: 'Devlet', baseScore2024: 494.20, rank2024: 1850, quota: 60, lang: 'İngilizce' },
  { id: 'dil-3', university: 'İstanbul Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'İngiliz Dili ve Edebiyatı', scoreType: 'DİL', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 468.90, rank2024: 5600, quota: 90, lang: 'İngilizce' },
  { id: 'dil-4', university: 'Ege Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'İngiliz Dili ve Edebiyatı', scoreType: 'DİL', city: 'İzmir', uniType: 'Devlet', baseScore2024: 452.40, rank2024: 9200, quota: 80, lang: 'İngilizce' },
  { id: 'dil-5', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'İngilizce Öğretmenliği', scoreType: 'DİL', city: 'Hatay', uniType: 'Devlet', baseScore2024: 432.80, rank2024: 16500, quota: 60, lang: 'İngilizce' },

  // --- TYT (ÖNLİSANS - 2 YILLIK) ---
  { id: 'tyt-1', university: 'Hacettepe Üniversitesi', faculty: 'Sağlık Hizmetleri MYO', department: 'İlk ve Acil Yardım (Paramedik)', scoreType: 'TYT', city: 'Ankara', uniType: 'Devlet', baseScore2024: 412.45, rank2024: 68000, quota: 70, lang: 'Türkçe' },
  { id: 'tyt-2', university: 'Ege Üniversitesi', faculty: 'Ege Meslek Yüksekokulu', department: 'Bilgisayar Programcılığı', scoreType: 'TYT', city: 'İzmir', uniType: 'Devlet', baseScore2024: 395.80, rank2024: 115000, quota: 90, lang: 'Türkçe' },
  { id: 'tyt-3', university: 'Marmara Üniversitesi', faculty: 'Teknik Bilimler MYO', department: 'Siber Güvenlik Analistliği', scoreType: 'TYT', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 402.30, rank2024: 95000, quota: 40, lang: 'Türkçe' },
  { id: 'tyt-4', university: 'İstanbul Üniversitesi - Cerrahpaşa', faculty: 'Sağlık Hizmetleri MYO', department: 'Anestezi', scoreType: 'TYT', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 391.20, rank2024: 128000, quota: 70, lang: 'Türkçe' },
  { id: 'tyt-5', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Sağlık Hizmetleri MYO', department: 'İlk ve Acil Yardım (Paramedik)', scoreType: 'TYT', city: 'Hatay', uniType: 'Devlet', baseScore2024: 364.50, rank2024: 215000, quota: 70, lang: 'Türkçe' },
  { id: 'tyt-6', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'İskenderun MYO', department: 'Bilgisayar Programcılığı', scoreType: 'TYT', city: 'Hatay', uniType: 'Devlet', baseScore2024: 338.90, rank2024: 310000, quota: 80, lang: 'Türkçe' },
  { id: 'tyt-7', university: 'Dokuz Eylül Üniversitesi', faculty: 'Sağlık Hizmetleri MYO', department: 'Tıbbi Görüntüleme Teknikleri', scoreType: 'TYT', city: 'İzmir', uniType: 'Devlet', baseScore2024: 378.10, rank2024: 172000, quota: 65, lang: 'Türkçe' },
  { id: 'tyt-8', university: 'Ankara Üniversitesi', faculty: 'Adalet MYO', department: 'Adalet', scoreType: 'TYT', city: 'Ankara', uniType: 'Devlet', baseScore2024: 345.80, rank2024: 285000, quota: 90, lang: 'Türkçe' },
];

const CITIES = ['TÜMÜ', 'İstanbul', 'Ankara', 'İzmir', 'Hatay', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Eskişehir'];
const UNI_TYPES = ['TÜMÜ', 'Devlet', 'Vakıf'];

export const YksTercihRobotu: React.FC = () => {
  const [userScore, setUserScore] = useState<number>(445.00);
  const [userRank, setUserRank] = useState<number>(45000);
  const [filterMode, setFilterMode] = useState<'rank' | 'score'>('rank');
  const [selectedScoreType, setSelectedScoreType] = useState<YksScoreType>('SAY');
  const [selectedCity, setSelectedCity] = useState<string>('TÜMÜ');
  const [selectedUniType, setSelectedUniType] = useState<string>('TÜMÜ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'name'>('rank');
  const [selectedList, setSelectedList] = useState<UniversityProgram[]>([]);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0, 1]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Reset to first page when any search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedScoreType, selectedCity, selectedUniType, searchQuery, onlyEligible, filterMode, sortBy]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return YKS_PROGRAMS_DATABASE.filter((prog) => {
      // 1. Puan türü
      if (prog.scoreType !== selectedScoreType) return false;

      // 2. Şehir
      if (selectedCity !== 'TÜMÜ' && prog.city !== selectedCity) return false;

      // 3. Üniversite türü
      if (selectedUniType !== 'TÜMÜ' && prog.uniType !== selectedUniType) return false;

      // 4. Arama
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchUni = prog.university.toLowerCase().includes(query);
        const matchDep = prog.department.toLowerCase().includes(query);
        const matchFac = prog.faculty.toLowerCase().includes(query);
        const matchCity = prog.city.toLowerCase().includes(query);
        if (!matchUni && !matchDep && !matchFac && !matchCity) return false;
      }

      // 5. Yalnızca başarı sırasının yettiği (veya puanının yettiği) bölümler
      if (onlyEligible) {
        if (filterMode === 'rank') {
          // Öğrencinin sırası programın taban sırasından küçük veya çok yakın olmalı (örneğin %20 yukarısına kadar)
          if (userRank > prog.rank2024 * 1.25) return false;
        } else {
          if (userScore < prog.baseScore2024 - 15) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rank') {
        return a.rank2024 - b.rank2024;
      }
      if (sortBy === 'score') {
        return b.baseScore2024 - a.baseScore2024;
      }
      return a.university.localeCompare(b.university, 'tr');
    });
  }, [selectedScoreType, selectedCity, selectedUniType, searchQuery, onlyEligible, userScore, userRank, filterMode, sortBy]);

  // Sayfalama (Pagination)
  const totalPages = Math.ceil(filteredPrograms.length / pageSize) || 1;
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPrograms.slice(start, start + pageSize);
  }, [filteredPrograms, currentPage, pageSize]);

  // Durum Belirleme: Güvenli, İdeal, Riskli
  const getEligibilityStatus = (prog: UniversityProgram) => {
    if (filterMode === 'rank') {
      const ratio = userRank / prog.rank2024;
      if (ratio <= 0.8) {
        return { text: 'Çok Güvenli', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      }
      if (ratio <= 0.95) {
        return { text: 'Güvenli', color: 'text-emerald-600 bg-emerald-50/60 border-emerald-200' };
      }
      if (ratio <= 1.15) {
        return { text: 'İdeal Tercih', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      }
      if (ratio <= 1.35) {
        return { text: 'Hafif Riskli', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      }
      return { text: 'Yüksek Risk', color: 'text-red-700 bg-red-50 border-red-200' };
    } else {
      const diff = userScore - prog.baseScore2024;
      if (diff >= 20) {
        return { text: 'Çok Güvenli', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      }
      if (diff >= 5) {
        return { text: 'Güvenli', color: 'text-emerald-600 bg-emerald-50/60 border-emerald-200' };
      }
      if (diff >= -5) {
        return { text: 'İdeal Tercih', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      }
      if (diff >= -15) {
        return { text: 'Hafif Riskli', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      }
      return { text: 'Yüksek Risk', color: 'text-red-700 bg-red-50 border-red-200' };
    }
  };

  // Tercih Listeme Ekle / Çıkar
  const toggleSelectProgram = (prog: UniversityProgram) => {
    setSelectedList((prev) => {
      const exists = prev.some((p) => p.id === prog.id);
      if (exists) {
        return prev.filter((p) => p.id !== prog.id);
      } else {
        if (prev.length >= 24) {
          alert('ÖSYM kurallarına göre en fazla 24 tercih hakkınız bulunmaktadır.');
          return prev;
        }
        return [...prev, prog];
      }
    });
  };

  // Tercih Listesinde Sıra Değiştirme
  const moveProgram = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedList.length) return;
    const updated = [...selectedList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSelectedList(updated);
  };

  // SSS Akordiyon Geçişi
  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Helper to load image as base64 Data URL for jsPDF
  const loadImageDataUrl = (src: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // 24'lü Tercih Listesi Resmi PDF Çıktısı Üretme
  const generatePdfList = async () => {
    if (selectedList.length === 0) {
      alert('Lütfen önce tercih listenize en az bir üniversite bölümü ekleyin.');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Top Red/Gold Header Bar
      doc.setFillColor(26, 26, 26);
      doc.rect(0, 0, pageWidth, 26, 'F');
      doc.setFillColor(201, 168, 106);
      doc.rect(0, 26, pageWidth, 2, 'F');

      // Title & Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('AŞKAR YAYINLARI • YKS TERCİH LİSTESİ', 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 168, 106);
      doc.text('2025-2026 ÖSYM & YÖK ATLAS UYUMLU TERCİH SİHİRBAZI RAPORU', 14, 19);

      // Student and Preference Summary Card
      doc.setFillColor(250, 249, 246);
      doc.roundedRect(14, 34, pageWidth - 28, 20, 2, 2, 'F');
      doc.setDrawColor(220, 215, 200);
      doc.roundedRect(14, 34, pageWidth - 28, 20, 2, 2, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(26, 26, 26);
      doc.text(`Puan Türü: ${selectedScoreType}`, 18, 41);
      doc.text(`Başarı Sırası: ${userRank.toLocaleString('tr-TR')}`, 75, 41);
      doc.text(`YKS Yerleştirme Puanı: ${userScore.toFixed(2)}`, 135, 41);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Toplam Tercih: ${selectedList.length} / 24`, 18, 49);
      doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 75, 49);
      doc.text('Web: askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu', 135, 49);

      // Table of 24 choices
      const tableData = selectedList.map((prog, idx) => [
        String(idx + 1),
        prog.university,
        prog.faculty,
        `${prog.department} (${prog.lang})`,
        prog.city,
        prog.uniType + (prog.scholarship ? ` - ${prog.scholarship}` : ''),
        prog.baseScore2024.toFixed(2),
        prog.rank2024.toLocaleString('tr-TR')
      ]);

      autoTable(doc, {
        startY: 58,
        head: [['#', 'Üniversite', 'Fakülte', 'Bölüm & Dil', 'Şehir', 'Tür', '2024 Taban', '2024 Sıra']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          textColor: [26, 26, 26],
          lineColor: [230, 225, 215],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [26, 26, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'left'
        },
        alternateRowStyles: {
          fillColor: [250, 249, 246]
        },
        columnStyles: {
          0: { cellWidth: 7, halign: 'center' },
          1: { cellWidth: 38 },
          2: { cellWidth: 32 },
          3: { cellWidth: 40 },
          4: { cellWidth: 16 },
          5: { cellWidth: 22 },
          6: { cellWidth: 15, halign: 'right' },
          7: { cellWidth: 16, halign: 'right' }
        }
      });

      // Bottom Watermark & QR Code
      const finalY = (doc as any).lastAutoTable?.finalY || 240;
      if (finalY < 265) {
        const qrDataUrl = await QRCode.toDataURL('https://www.askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu', {
          width: 80,
          margin: 1
        });
        doc.addImage(qrDataUrl, 'PNG', 14, finalY + 4, 18, 18);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(26, 26, 26);
        doc.text('Aşkar Yayınları YKS Koçluk Sistemi', 35, finalY + 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        doc.text('Bu tercih listesi Aşkar Yayınları YÖK Atlas YKS Tercih Robotu ile üretilmiştir.', 35, finalY + 14);
        doc.text('Resmi tercihler ÖSYM ais.osym.gov.tr sistemi üzerinden onaylanmalıdır.', 35, finalY + 18);
      }

      doc.save(`Askar_Yayinlari_YKS_Tercih_Listesi_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF üretilirken hata oluştu:', err);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // WhatsApp Paylaşım Metni
  const generateShareText = () => {
    let text = `🎓 Aşkar Yayınları 2025-2026 YKS Tercih Listem:\n`;
    text += `Puan Türü: ${selectedScoreType} | Başarı Sırası: ${userRank.toLocaleString('tr-TR')} | Puan: ${userScore.toFixed(2)}\n\n`;
    selectedList.forEach((item, i) => {
      text += `${i + 1}. ${item.university} - ${item.department} (${item.city}) [2024 Sıra: ${item.rank2024.toLocaleString('tr-TR')}]\n`;
    });
    text += `\nKendi tercih listenizi oluşturun: https://www.askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu`;
    return text;
  };

  const handleCopyShareText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  const yksBook = BOOKS_DATA.find((b) => b.id === 'k_yks');

  const FAQ_ITEMS = [
    {
      q: 'YKS tercihlerinde puana mı yoksa başarı sırasına mı bakılmalıdır?',
      a: 'Kesinlikle başarı sırasına bakılmalıdır. Sınavın zorluğuna göre puanlar her yıl onlarca puan değişebilirken, başarı sıralamaları yığılmalara ve kontenjanlara bağlı olarak çok daha stabil ve güvenilir bir göstergedir. Tercihlerinizi daima başarı sıranız üzerinden planlayın.'
    },
    {
      q: 'YKS\'de kaç tercih hakkı vardır ve tamamını doldurmak zorunlu mudur?',
      a: 'YKS merkezi yerleştirmede adaylara en fazla 24 tercih hakkı tanınır. 24 tercihin tamamını doldurmak zorunlu değildir; sadece 1 tercih dahi yapabilirsiniz. Ancak yerleşme şansını artırmak ve açıkta kalmamak için uzmanlar en az 18-20 tercihin doldurulmasını önerir.'
    },
    {
      q: 'Başarı sıramın ne kadar üstündeki ve altındaki bölümleri yazmalıyım?',
      a: 'Altın kural 24 tercihi 3 ana gruba bölmektir:\n1. İlk 4-5 Tercih (Hayal/İddialı): Sıralamanızın %20-%30 üstünde yer alan prestijli programlar.\n2. Orta 10-12 Tercih (İdeal/Gerçekçi): Sıralamanızın %10 üstü ile %20 altı arasında yer alan ve yerleşme ihtimalinizin en yüksek olduğu programlar.\n3. Son 5-7 Tercih (Güvenli/Garanti): Sıralamanızın %30-%50 altında yer alan ve açıkta kalmanızı kesinlikle önleyecek güvenli programlar.'
    },
    {
      q: 'Tıp, Diş, Hukuk ve Mühendislik gibi bölümlerde başarı sırası barajı nedir?',
      a: 'YÖK tarafından uygulanan asgari başarı sırası barajları şunlardır:\n• Tıp: SAY İlk 50.000\n• Diş Hekimliği: SAY İlk 80.000\n• Eczacılık: SAY İlk 100.000\n• Hukuk: EA İlk 125.000\n• Mimarlık: SAY İlk 250.000\n• Mühendislik (Ziraat, Su Ürünleri ve Orman hariç): SAY İlk 300.000\n• Öğretmenlik Programları: İlgili puan türünde ilk 300.000.'
    },
    {
      q: 'Tercih yapıp bir bölüme yerleşirsem seneye OBP puanım kırılır mı (Kırık OBP)?',
      a: 'Evet. Tercih listenizdeki herhangi bir örgün veya uzaktan eğitim (Açıköğretim kontenjansız bölümleri hariç) programa yerleştiğinizde, kayıt yaptırsanız da yaptırmasanız da bir sonraki yıl OBP katsayınız 0,12\'den 0,06\'ya düşer (yarı yarıya kırılır). Bu nedenle gitmeyi düşünmediğiniz hiçbir bölümü tercih listenize yazmamalısınız.'
    },
    {
      q: 'Vakıf üniversitelerinde burs oranları ve tercih stratejisi nasıl olmalıdır?',
      a: 'Vakıf üniversitelerinde Tam Burslu (%100) ve %50 İndirimli kontenjanlar ayrı kodlarla yer alır. Tercih yaparken eğitim ücreti, hazırlık sınıfı şartları ve bursun kesilme koşulları (başarısızlık durumunda bursun devam edip etmediği) üniversitenin kılavuz özel koşullarından dikkatle okunmalıdır.'
    },
    {
      q: 'TYT puanıyla 2 yıllık önlisans bölümleri nasıl tercih edilir?',
      a: 'TYT oturumunda en az bir neti olan ve TYT yerleştirme puanı hesaplanan tüm adaylar, robotumuzdaki "TYT" sekmesini seçerek 2 yıllık önlisans programlarını (Paramedik, Bilgisayar Programcılığı, Siber Güvenlik, Anestezi vb.) 24 tercih hakkı kapsamında tercih edebilirler.'
    },
    {
      q: 'Tercih sırası kazanma şansını etkiler mi?',
      a: 'Hayır, tercih sırası kazanma şansını azaltmaz. ÖSYM yerleştirme algoritması puan/sıralama üstünlüğüne göre çalışır. Bir bölümü 1. sıraya yazan öğrenci ile 24. sıraya yazan öğrenciden hangisinin başarı sırası daha yüksekse o öğrenci yerleşir. Dolayısıyla listenizi puan sırasına göre değil, gerçekten en çok istediğiniz yere göre sıralamalısınız.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1A1A]">
      {/* 1. BAŞLIK VE KONTROL PANELİ */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3aed]/15 text-[#6d28d9] text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>YKS 2025-2026 TERCİH DÖNEMİ • YÖK ATLAS UYUMLU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              YKS Tercih Robotu
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans max-w-xl">
              2024-2025 resmi taban puan ve başarı sırası verileriyle SAY, EA, SÖZ, DİL ve TYT bölümlerini filtreleyin, 24'lü gerçek tercih listenizi oluşturun ve resmi PDF olarak indirin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUserScore(445.00);
                setUserRank(45000);
                setSelectedScoreType('SAY');
                setSelectedCity('TÜMÜ');
                setSelectedUniType('TÜMÜ');
                setSearchQuery('');
                setOnlyEligible(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1A1A1A]/20 bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* 2. PUAN TÜRÜ SEÇİMİ (SAY, EA, SÖZ, DİL, TYT) */}
        <div>
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 block mb-2">
            1. HEDEF PUAN TÜRÜNÜZÜ SEÇİN:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'SAY', name: 'SAYISAL (SAY)', desc: 'Tıp, Müh, Diş, Ecz' },
              { id: 'EA', name: 'EŞİT AĞIRLIK (EA)', desc: 'Hukuk, İİBF, Psikoloji' },
              { id: 'SÖZ', name: 'SÖZEL (SÖZ)', desc: 'Öğretmenlik, İlahiyat' },
              { id: 'DİL', name: 'DİL (YDT)', desc: 'İng Öğr, Tercümanlık' },
              { id: 'TYT', name: 'TYT (2 YILLIK)', desc: 'Önlisans, Paramedik' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedScoreType(st.id as YksScoreType)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedScoreType === st.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                    : 'bg-white hover:bg-neutral-50 text-[#1A1A1A] border-[#1A1A1A]/15'
                }`}
              >
                <div className="font-mono font-black text-xs sm:text-sm tracking-wide">
                  {st.name}
                </div>
                <div className={`text-[10px] mt-1 truncate ${selectedScoreType === st.id ? 'text-white/70' : 'text-[#1A1A1A]/50'}`}>
                  {st.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. ÖĞRENCİ BAŞARI SIRASI VE PUAN GİRİŞİ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Başarı Sırası Kutusu */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center justify-between">
              <span>BAŞARI SIRANIZ:</span>
              <span className="text-[10px] text-[#7c3aed] font-semibold">(Önerilen Kriter)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={3000000}
                value={userRank}
                onChange={(e) => {
                  setUserRank(Math.max(1, parseInt(e.target.value) || 1));
                  setFilterMode('rank');
                }}
                className="w-full bg-white border-2 border-[#7c3aed]/40 focus:border-[#7c3aed] rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#1A1A1A] focus:outline-hidden"
                placeholder="Örn: 45000"
              />
              <span className="absolute right-3 top-3 text-[10px] font-mono text-[#1A1A1A]/40 font-semibold">
                . SIRA
              </span>
            </div>
          </div>

          {/* YKS Puanı Kutusu */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1">
              Y-YKS PUANINIZ:
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min={100}
                max={560}
                value={userScore}
                onChange={(e) => {
                  setUserScore(parseFloat(e.target.value) || 100);
                  setFilterMode('score');
                }}
                className="w-full bg-white border border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#1A1A1A] focus:outline-hidden"
                placeholder="Örn: 445.00"
              />
              <span className="absolute right-3 top-3 text-[10px] font-mono text-[#1A1A1A]/40 font-semibold">
                PUAN
              </span>
            </div>
          </div>

          {/* Şehir Seçimi */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#7c3aed]" />
              <span>ŞEHİR:</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2.5 text-xs font-sans font-semibold text-[#1A1A1A] focus:outline-hidden"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c === 'TÜMÜ' ? 'Tüm Şehirler' : c}</option>
              ))}
            </select>
          </div>

          {/* Üniversite Türü */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#7c3aed]" />
              <span>ÜNİVERSİTE TÜRÜ:</span>
            </label>
            <select
              value={selectedUniType}
              onChange={(e) => setSelectedUniType(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2.5 text-xs font-sans font-semibold text-[#1A1A1A] focus:outline-hidden"
            >
              {UNI_TYPES.map((u) => (
                <option key={u} value={u}>{u === 'TÜMÜ' ? 'Devlet + Vakıf Tümü' : u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. ARAMA VE FİLTRE BARI */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1A1A1A]/8">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Üniversite, fakülte veya bölüm ara (Örn: Hacettepe, Tıp, Hukuk, Bilgisayar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] focus:border-[#7c3aed] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="w-4 h-4 accent-[#7c3aed] rounded"
              />
              <span>Sadece girebileceğim bölümleri göster</span>
            </label>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1A1A1A]/70">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <button
                type="button"
                onClick={() => setSortBy('rank')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  sortBy === 'rank' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-200'
                }`}
              >
                Sıralama
              </button>
              <button
                type="button"
                onClick={() => setSortBy('score')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  sortBy === 'score' ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-stone-200'
                }`}
              >
                Taban Puan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. İKİ KOLONLU DÜZEN: SOLDA BÖLÜM HAVUZU + SAĞDA 24'LÜ GERÇEK TERCİH LİSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SOL: Üniversite ve Bölüm Havuzu (Kaydırma çubuğu olmadan tam sığacak şekilde) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#7c3aed]" />
              <span className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                Uygun Üniversite Programları ({filteredPrograms.length})
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#1A1A1A]/60">
              2024 YÖK Atlas Verileri
            </span>
          </div>

          <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#1A1A1A] text-white">
                <tr className="font-mono text-[10px] uppercase tracking-wider">
                  <th className="p-3 text-center w-12 shrink-0">Ekle</th>
                  <th className="p-3">Üniversite & Bölüm</th>
                  <th className="p-3 text-center w-28 whitespace-nowrap">Şehir & Tür</th>
                  <th className="p-3 text-right w-36 whitespace-nowrap">2024 Sıra & Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
                {paginatedPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-[#1A1A1A]/60 font-sans">
                      Arama kriterlerinize uygun üniversite programı bulunamadı. Lütfen puan türü veya filtreleri değiştirin.
                    </td>
                  </tr>
                ) : (
                  paginatedPrograms.map((prog) => {
                    const status = getEligibilityStatus(prog);
                    const isSelected = selectedList.some((p) => p.id === prog.id);
                    const selectedIdx = selectedList.findIndex((p) => p.id === prog.id);

                    return (
                      <tr
                        key={prog.id}
                        className={`hover:bg-[#FAF6EE]/50 transition-colors ${
                          isSelected ? 'bg-purple-50/40' : ''
                        }`}
                      >
                        {/* 1. Seçim Butonu */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectProgram(prog)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#7c3aed] text-white shadow-2xs hover:bg-purple-800'
                                : 'bg-stone-100 hover:bg-stone-200 text-[#1A1A1A]/60 border border-stone-300'
                            }`}
                            title={isSelected ? 'Listemden Çıkar' : '24 Tercih Listeme Ekle'}
                          >
                            {isSelected ? (
                              <span className="font-mono font-bold text-[10px]">#{selectedIdx + 1}</span>
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>

                        {/* 2. Üniversite, Fakülte & Bölüm */}
                        <td className="p-3">
                          <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] block leading-tight">
                            {prog.university}
                          </span>
                          <span className="text-xs font-semibold text-[#7c3aed] block mt-0.5 leading-snug">
                            {prog.department}
                          </span>
                          <span className="text-[10px] text-[#1A1A1A]/55 font-sans block mt-0.5">
                            {prog.faculty} • <span className="font-mono text-[#1A1A1A]/70">{prog.lang} • Kont: {prog.quota}</span>
                          </span>
                        </td>

                        {/* 3. Şehir & Tür */}
                        <td className="p-3 text-center whitespace-nowrap">
                          <span className="font-bold text-xs text-[#1A1A1A] block">
                            {prog.city}
                          </span>
                          <span className="text-[9.5px] font-mono text-[#1A1A1A]/70 bg-[#FAF9F6] border border-[#1A1A1A]/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            {prog.uniType} {prog.scholarship ? `(${prog.scholarship})` : ''}
                          </span>
                        </td>

                        {/* 4. 2024 Sıra, Puan & Durum */}
                        <td className="p-3 text-right whitespace-nowrap">
                          <span className="font-mono font-black text-xs sm:text-sm text-[#1A1A1A] block">
                            {prog.rank2024.toLocaleString('tr-TR')}
                          </span>
                          <span className="text-[10.5px] font-mono font-bold text-[#7c3aed] block mt-0.5">
                            {prog.baseScore2024.toFixed(2)} Puan
                          </span>
                          <span className={`text-[9.5px] font-sans font-bold px-2 py-0.5 rounded-md border inline-block mt-1 ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredPrograms.length > pageSize && (
              <div className="p-2.5 sm:p-3 bg-[#FAF9F6] border-t border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] font-mono text-[#1A1A1A]/60">
                  Gösterilen: <strong>{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredPrograms.length)}</strong> / {filteredPrograms.length} Program
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg border border-[#1A1A1A]/15 bg-white disabled:opacity-30 hover:bg-stone-100 font-bold cursor-pointer transition-colors"
                  >
                    ◀ Önceki
                  </button>
                  <span className="px-2 font-bold text-[#1A1A1A]">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-lg border border-[#1A1A1A]/15 bg-white disabled:opacity-30 hover:bg-stone-100 font-bold cursor-pointer transition-colors"
                  >
                    Sonraki ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ: 24'LÜ GERÇEK YKS TERCİH LİSTEM */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7c3aed]" />
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                  24'lü Tercih Listem
                </h3>
              </div>
              <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full ${
                selectedList.length === 24
                  ? 'bg-red-600 text-white'
                  : 'bg-[#1A1A1A] text-white'
              }`}>
                {selectedList.length} / 24
              </span>
            </div>

            {selectedList.length === 0 ? (
              <div className="py-8 text-center space-y-2 border-2 border-dashed border-[#1A1A1A]/15 rounded-xl bg-[#FAF9F6]">
                <GraduationCap className="w-8 h-8 text-[#1A1A1A]/30 mx-auto" />
                <p className="text-xs font-bold text-[#1A1A1A]/80">
                  Tercih listeniz henüz boş
                </p>
                <p className="text-[11px] text-[#1A1A1A]/50 max-w-xs mx-auto">
                  Sol taraftaki tablodan bölümlerin yanındaki <strong>+ butonuna</strong> basarak 24'lü listenizi hazırlayın.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {selectedList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-xl flex items-center justify-between gap-2.5 text-xs hover:border-[#7c3aed]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-[#1A1A1A] truncate">
                          {item.university}
                        </div>
                        <div className="text-[11px] text-[#1A1A1A]/70 truncate">
                          {item.department} • <span className="font-mono text-[#7c3aed]">{item.rank2024.toLocaleString('tr-TR')} Sıra</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveProgram(idx, 'up')}
                        disabled={idx === 0}
                        title="Yukarı Taşı"
                        className="p-1 hover:bg-stone-200 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProgram(idx, 'down')}
                        disabled={idx === selectedList.length - 1}
                        title="Aşağı Taşı"
                        className="p-1 hover:bg-stone-200 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSelectProgram(item)}
                        title="Listeden Çıkar"
                        className="p-1 hover:bg-red-100 text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aksiyon Butonları: PDF İndir & Paylaş & Temizle */}
            {selectedList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={generatePdfList}
                  disabled={isGeneratingPdf}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#C9A86A]" />
                  <span>{isGeneratingPdf ? 'PDF HAZIRLANIYOR...' : 'RESMİ LİSTEYİ PDF İNDİR'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-[#1A1A1A]/20 py-2.5 rounded-xl text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp / Paylaş</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedList([])}
                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Listeyi Temizle</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. AŞKAR YKS KOÇLUK REHBERİ KARTI */}
      {yksBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#7c3aed]/20 text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={yksBook.image}
              alt={yksBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-lg shadow-md shrink-0 bg-white/5 p-1 border border-white/10"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>YKS DERECE & TERCİH KOÇLUĞU:</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                {yksBook.title}
              </h4>
              <p className="text-xs text-white/70 font-sans max-w-xl">
                24 tercih hakkınızı en doğru dağıtmak, ölü tercih yapmamak ve hayalinizdeki fakülteye yerleşmek için Aşkar YKS koçluk rehberini edinin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setPreviewBook(yksBook)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>ÖNİZLE</span>
            </button>

            <a
              href={yksBook.shopierUrl}
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

      {/* 7. BÖLÜM 2 - KAPSAMLI YKS TERCİH REHBERİ (SEO & EĞİTİM BÖLÜMÜ) */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#1A1A1A]/10 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#7c3aed] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YKS TERCİH VE STRATEJİ REHBERİ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight mt-1">
            YKS Tercihleri Nasıl Yapılır? 24 Tercih Yelpazesi Stratejisi
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans mt-1">
            ÖSYM merkezi yerleştirme kılavuzuna göre başarı sırası yönetimi, barajlar ve tercih mimarisi.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#1A1A1A]/85 font-sans leading-relaxed">
          <p>
            Yükseköğretim Kurumları Sınavı (YKS) tercih dönemi, bir veya birden fazla yıllık emeğin gelecekteki kariyer çizgisine dönüştüğü en stratejik aşamadır. Tercih döneminde adayların ve velilerin en sık düştüğü yanılgı, tercih listesini <strong>"YKS yerleştirme puanına"</strong> göre oluşturmaktır. Oysa sınavın yıldan yıla değişen zorluğu, yığılmalar ve aday sayısı puanları oynatırken; en güvenilir ve gerçekçi pusula <strong>"Başarı Sıralaması"</strong>dır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#7c3aed]">
                1. AŞAMA • 1-5. TERCİHLER
              </span>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                Hayal & İddialı Tercihler
              </h3>
              <p className="text-xs text-[#1A1A1A]/75">
                Başarı sıranızın <strong>%20-%30 üzerinde</strong> olan, gelme ihtimali düşük görünse de kalbinizin çok istediği prestijli fakülteleri listenin başına yazın.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#059669]">
                2. AŞAMA • 6-18. TERCİHLER
              </span>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                İdeal & Gerçekçi Çekirdek
              </h3>
              <p className="text-xs text-[#1A1A1A]/75">
                Kendi başarı sıranıza çok yakın (sıralamanızın %10 üstü ile %20 altı) olan programları bu alana yerleştirin. Yerleşme ihtimalinizin en yüksek olduğu yer burasıdır.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#1A1A1A]/10 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#ea580c]">
                3. AŞAMA • 19-24. TERCİHLER
              </span>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                Güvenli & Garanti Tercihler
              </h3>
              <p className="text-xs text-[#1A1A1A]/75">
                Başarı sıranızın <strong>%30-%50 altında</strong> yer alan, kazandığınızda severek okuyacağınız güvenli üniversiteleri yazarak açıkta kalma riskini sıfırlayın.
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1 mt-4">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>ÖSYM Başarı Sırası Barajlarına Dikkat!</span>
            </div>
            <p className="text-[11px] sm:text-xs leading-relaxed text-amber-800">
              YÖK kurallarına göre Tıp (ilk 50 bin), Diş Hekimliği (ilk 80 bin), Eczacılık (ilk 100 bin), Hukuk (ilk 125 bin), Mimarlık (ilk 250 bin), Mühendislik (ilk 300 bin) ve Öğretmenlik (ilk 300 bin) programlarında baraj sıralamasını sağlayamayan adayların bu bölümleri tercih etmesi sistem tarafından engellenir.
            </p>
          </div>
        </div>
      </section>

      {/* 8. BÖLÜM 3 - SSS (AKORDİYON) VE FAQ SCHEMA (JSON-LD) */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#1A1A1A]/10 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#7c3aed] font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>SIKÇA SORULAN SORULAR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight mt-1">
            YKS Tercih ve Yerleştirme Hakkında Merak Edilenler
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans mt-1">
            YKS tercih süreci, başarı sıralamaları, barajlar ve ÖSYM merkezi yerleştirmeye dair en çok sorulan 8 soru ve yanıtları.
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
                      isOpen ? 'rotate-180 text-[#7c3aed]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-[#1A1A1A]/80 font-sans leading-relaxed border-t border-[#1A1A1A]/5 bg-white whitespace-pre-line">
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

      {/* 9. TERCİH LİSTESİ PAYLAŞ MODALI */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#1A1A1A]/10 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#25D366] text-white">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                    YKS Tercih Listemi Paylaş
                  </h3>
                  <p className="text-[11px] text-[#1A1A1A]/60">
                    Oluşturduğunuz {selectedList.length} tercihi rehber öğretmeninizle veya ailenizle paylaşın.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#1A1A1A]/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Önizleme Metni Kutusu */}
            <div className="p-3 bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-xl max-h-48 overflow-y-auto font-mono text-[11px] text-[#1A1A1A]/80 whitespace-pre-line">
              {generateShareText()}
            </div>

            {/* Paylaş Butonları */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp'ta Gönder</span>
              </a>

              <button
                type="button"
                onClick={handleCopyShareText}
                className="bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {copiedShareText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C9A86A]" />}
                <span>{copiedShareText ? 'KOPYALANDI!' : 'METNİ KOPYALA'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
