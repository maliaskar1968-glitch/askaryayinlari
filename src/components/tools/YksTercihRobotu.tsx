import React, { useState, useMemo } from 'react';
import { Compass, Search, Filter, Sparkles, Building2, MapPin, CheckCircle2, AlertTriangle, ArrowUpDown, ExternalLink, Eye, RotateCcw, BookOpen, GraduationCap, Download, Plus, Check, Trash2, Globe, FileText, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types';
import { PreviewModal } from '../PreviewModal';

export type YksScoreType = 'SAY' | 'EA' | 'SÖZ' | 'DİL';
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
  // İstanbul
  { id: 'say-1', university: 'İstanbul Üniversitesi - Cerrahpaşa', faculty: 'Cerrahpaşa Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 531.45, rank2024: 1850, quota: 300, lang: 'Türkçe' },
  { id: 'say-2', university: 'Boğaziçi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 546.80, rank2024: 310, quota: 90, lang: 'İngilizce' },
  { id: 'say-3', university: 'İstanbul Teknik Üniversitesi (İTÜ)', faculty: 'Bilgisayar ve Bilişim Fakültesi', department: 'Yapay Zeka ve Veri Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 538.90, rank2024: 1120, quota: 60, lang: 'İngilizce' },
  { id: 'say-4', university: 'İstanbul Teknik Üniversitesi (İTÜ)', faculty: 'Elektrik-Elektronik Fakültesi', department: 'Elektrik-Elektronik Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 534.20, rank2024: 1540, quota: 150, lang: 'İngilizce' },
  { id: 'say-5', university: 'Koç Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Burslu)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 552.10, rank2024: 75, quota: 15, lang: 'İngilizce' },
  { id: 'say-6', university: 'Yıldız Teknik Üniversitesi', faculty: 'Elektrik-Elektronik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 512.60, rank2024: 5900, quota: 140, lang: 'İngilizce' },
  { id: 'say-7', university: 'Marmara Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 486.30, rank2024: 26800, quota: 120, lang: 'Türkçe' },
  { id: 'say-8', university: 'İstanbul Üniversitesi', faculty: 'Eczacılık Fakültesi', department: 'Eczacılık', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 468.70, rank2024: 44200, quota: 150, lang: 'Türkçe' },
  { id: 'say-9', university: 'Yıldız Teknik Üniversitesi', faculty: 'Makine Fakültesi', department: 'Makine Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 488.50, rank2024: 24500, quota: 180, lang: 'Türkçe' },
  { id: 'say-10', university: 'İstanbul Medipol Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Yazılım Mühendisliği (Burslu)', scoreType: 'SAY', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 494.30, rank2024: 18900, quota: 20, lang: 'İngilizce' },
  { id: 'say-11', university: 'Marmara Üniversitesi', faculty: 'Sağlık Bilimleri Fakültesi', department: 'Hemşirelik', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 412.80, rank2024: 118000, quota: 170, lang: 'Türkçe' },
  { id: 'say-12', university: 'İstanbul Üniversitesi - Cerrahpaşa', faculty: 'Mühendislik Fakültesi', department: 'Endüstri Mühendisliği', scoreType: 'SAY', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 481.90, rank2024: 31500, quota: 90, lang: 'İngilizce' },

  // Ankara (SAY)
  { id: 'say-13', university: 'Hacettepe Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 539.60, rank2024: 1050, quota: 250, lang: 'Türkçe' },
  { id: 'say-14', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 544.70, rank2024: 550, quota: 110, lang: 'İngilizce' },
  { id: 'say-15', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'Mühendislik Fakültesi', department: 'Elektrik-Elektronik Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 538.10, rank2024: 1210, quota: 180, lang: 'İngilizce' },
  { id: 'say-16', university: 'Bilkent Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği (Burslu)', scoreType: 'SAY', city: 'Ankara', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 548.90, rank2024: 210, quota: 40, lang: 'İngilizce' },
  { id: 'say-17', university: 'Ankara Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp (Türkçe)', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 528.20, rank2024: 2450, quota: 300, lang: 'Türkçe' },
  { id: 'say-18', university: 'Gazi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 498.40, rank2024: 15400, quota: 100, lang: 'Türkçe' },
  { id: 'say-19', university: 'Hacettepe Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Endüstri Mühendisliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 504.60, rank2024: 10200, quota: 90, lang: 'İngilizce' },
  { id: 'say-20', university: 'Gazi Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'Ankara', uniType: 'Devlet', baseScore2024: 484.70, rank2024: 28500, quota: 140, lang: 'Türkçe' },

  // İzmir (SAY)
  { id: 'say-21', university: 'Ege Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 524.30, rank2024: 3400, quota: 350, lang: 'Türkçe' },
  { id: 'say-22', university: 'Dokuz Eylül Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 518.80, rank2024: 4600, quota: 280, lang: 'Türkçe' },
  { id: 'say-23', university: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 508.90, rank2024: 8200, quota: 90, lang: 'İngilizce' },
  { id: 'say-24', university: 'Ege Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 487.60, rank2024: 25400, quota: 150, lang: 'Türkçe' },
  { id: 'say-25', university: 'Dokuz Eylül Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Elektrik-Elektronik Mühendisliği', scoreType: 'SAY', city: 'İzmir', uniType: 'Devlet', baseScore2024: 465.10, rank2024: 48500, quota: 120, lang: 'İngilizce' },

  // Hatay (Aşkar Yayınları Özel Vurgusu - SAY)
  { id: 'say-26', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Tayfur Ata Sökmen Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 497.80, rank2024: 16100, quota: 130, lang: 'Türkçe' },
  { id: 'say-27', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Diş Hekimliği Fakültesi', department: 'Diş Hekimliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 472.40, rank2024: 40500, quota: 80, lang: 'Türkçe' },
  { id: 'say-28', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'Mühendislik ve Doğa Bilimleri', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 432.50, rank2024: 88500, quota: 90, lang: 'Türkçe' },
  { id: 'say-29', university: 'İskenderun Teknik Üniversitesi (İSTE)', faculty: 'Havacılık ve Uzay Bilimleri', department: 'Havacılık ve Uzay Mühendisliği', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 424.10, rank2024: 99400, quota: 50, lang: 'Türkçe' },
  { id: 'say-30', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Sağlık Bilimleri Fakültesi', department: 'Hemşirelik', scoreType: 'SAY', city: 'Hatay', uniType: 'Devlet', baseScore2024: 384.20, rank2024: 168000, quota: 100, lang: 'Türkçe' },

  // Adana, Bursa, Antalya, Eskişehir, Gaziantep (SAY)
  { id: 'say-31', university: 'Çukurova Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Adana', uniType: 'Devlet', baseScore2024: 512.40, rank2024: 6100, quota: 280, lang: 'Türkçe' },
  { id: 'say-32', university: 'Bursa Uludağ Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Bursa', uniType: 'Devlet', baseScore2024: 516.30, rank2024: 5200, quota: 250, lang: 'Türkçe' },
  { id: 'say-33', university: 'Akdeniz Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Antalya', uniType: 'Devlet', baseScore2024: 519.20, rank2024: 4500, quota: 260, lang: 'Türkçe' },
  { id: 'say-34', university: 'Eskişehir Osmangazi Üniversitesi', faculty: 'Mühendislik Fakültesi', department: 'Bilgisayar Mühendisliği', scoreType: 'SAY', city: 'Eskişehir', uniType: 'Devlet', baseScore2024: 479.50, rank2024: 33800, quota: 100, lang: 'İngilizce' },
  { id: 'say-35', university: 'Gaziantep Üniversitesi', faculty: 'Tıp Fakültesi', department: 'Tıp', scoreType: 'SAY', city: 'Gaziantep', uniType: 'Devlet', baseScore2024: 502.70, rank2024: 11800, quota: 220, lang: 'Türkçe' },

  // --- EŞİT AĞIRLIK (EA) ---
  // İstanbul
  { id: 'ea-1', university: 'Galatasaray Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 504.80, rank2024: 180, quota: 80, lang: 'Fransızca' },
  { id: 'ea-2', university: 'Boğaziçi Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İktisat', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 509.20, rank2024: 320, quota: 100, lang: 'İngilizce' },
  { id: 'ea-3', university: 'Boğaziçi Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İşletme', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 512.40, rank2024: 210, quota: 100, lang: 'İngilizce' },
  { id: 'ea-4', university: 'Koç Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk (Burslu)', scoreType: 'EA', city: 'İstanbul', uniType: 'Vakıf', scholarship: 'Tam Burslu', baseScore2024: 521.80, rank2024: 85, quota: 20, lang: 'Türkçe' },
  { id: 'ea-5', university: 'İstanbul Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 456.30, rank2024: 4800, quota: 550, lang: 'Türkçe' },
  { id: 'ea-6', university: 'Boğaziçi Üniversitesi', faculty: 'Fen-Edebiyat Fakültesi', department: 'Psikoloji', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 485.40, rank2024: 1200, quota: 80, lang: 'İngilizce' },
  { id: 'ea-7', university: 'Marmara Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 442.10, rank2024: 9800, quota: 400, lang: 'Türkçe' },
  { id: 'ea-8', university: 'Boğaziçi Üniversitesi', faculty: 'Uygulamalı Bilimler Fakültesi', department: 'Yönetim Bilişim Sistemleri (YBS)', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 498.70, rank2024: 580, quota: 70, lang: 'İngilizce' },
  { id: 'ea-9', university: 'Marmara Üniversitesi', faculty: 'İşletme Fakültesi', department: 'Yönetim Bilişim Sistemleri (YBS)', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 452.80, rank2024: 6100, quota: 80, lang: 'Almanca' },
  { id: 'ea-10', university: 'İstanbul Üniversitesi', faculty: 'İktisat Fakültesi', department: 'İşletme', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 418.50, rank2024: 26500, quota: 200, lang: 'Türkçe' },
  { id: 'ea-11', university: 'Yıldız Teknik Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İktisat', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 432.10, rank2024: 15400, quota: 120, lang: 'Türkçe' },
  { id: 'ea-12', university: 'İstanbul Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Psikoloji', scoreType: 'EA', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 438.90, rank2024: 11200, quota: 150, lang: 'Türkçe' },

  // Ankara & İzmir (EA)
  { id: 'ea-13', university: 'Ankara Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 462.50, rank2024: 3400, quota: 500, lang: 'Türkçe' },
  { id: 'ea-14', university: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', faculty: 'İktisadi ve İdari Bilimler', department: 'İktisat', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 489.60, rank2024: 980, quota: 110, lang: 'İngilizce' },
  { id: 'ea-15', university: 'Hacettepe Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 451.20, rank2024: 6800, quota: 180, lang: 'Türkçe' },
  { id: 'ea-16', university: 'Hacettepe Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Psikoloji', scoreType: 'EA', city: 'Ankara', uniType: 'Devlet', baseScore2024: 454.10, rank2024: 5900, quota: 100, lang: 'Türkçe' },
  { id: 'ea-17', university: 'Dokuz Eylül Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'İzmir', uniType: 'Devlet', baseScore2024: 436.40, rank2024: 12900, quota: 420, lang: 'Türkçe' },
  { id: 'ea-18', university: 'Ege Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'İşletme', scoreType: 'EA', city: 'İzmir', uniType: 'Devlet', baseScore2024: 412.30, rank2024: 34500, quota: 180, lang: 'Türkçe' },

  // Hatay (EA)
  { id: 'ea-19', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 414.80, rank2024: 31200, quota: 120, lang: 'Türkçe' },
  { id: 'ea-20', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'İktisadi ve İdari Bilimler', department: 'Yönetim Bilişim Sistemleri (YBS)', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 382.40, rank2024: 86500, quota: 70, lang: 'Türkçe' },
  { id: 'ea-21', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Sınıf Öğretmenliği', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 398.60, rank2024: 55400, quota: 60, lang: 'Türkçe' },
  { id: 'ea-22', university: 'Hatay Mustafa Kemal Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Rehberlik ve Psikolojik Danışmanlık (PDR)', scoreType: 'EA', city: 'Hatay', uniType: 'Devlet', baseScore2024: 376.90, rank2024: 98000, quota: 60, lang: 'Türkçe' },

  // Diğer İller (EA)
  { id: 'ea-23', university: 'Anadolu Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Eskişehir', uniType: 'Devlet', baseScore2024: 438.70, rank2024: 11400, quota: 300, lang: 'Türkçe' },
  { id: 'ea-24', university: 'Çukurova Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Adana', uniType: 'Devlet', baseScore2024: 429.30, rank2024: 18200, quota: 250, lang: 'Türkçe' },
  { id: 'ea-25', university: 'Akdeniz Üniversitesi', faculty: 'Hukuk Fakültesi', department: 'Hukuk', scoreType: 'EA', city: 'Antalya', uniType: 'Devlet', baseScore2024: 434.50, rank2024: 14100, quota: 280, lang: 'Türkçe' },

  // --- SÖZEL (SÖZ) ---
  // İstanbul & Ankara & İzmir
  { id: 'soz-1', university: 'Boğaziçi Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Özel Eğitim Öğretmenliği', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 462.80, rank2024: 650, quota: 40, lang: 'İngilizce' },
  { id: 'soz-2', university: 'Galatasaray Üniversitesi', faculty: 'İletişim Fakültesi', department: 'İletişim', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 456.20, rank2024: 1100, quota: 60, lang: 'Fransızca' },
  { id: 'soz-3', university: 'Hacettepe Üniversitesi', faculty: 'Eğitim Fakültesi', department: 'Türkçe Öğretmenliği', scoreType: 'SÖZ', city: 'Ankara', uniType: 'Devlet', baseScore2024: 432.50, rank2024: 4200, quota: 60, lang: 'Türkçe' },
  { id: 'soz-4', university: 'İstanbul Üniversitesi', faculty: 'Edebiyat Fakültesi', department: 'Tarih', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 408.40, rank2024: 14500, quota: 120, lang: 'Türkçe' },
  { id: 'soz-5', university: 'Marmara Üniversitesi', faculty: 'İletişim Fakültesi', department: 'Halkla İlişkiler ve Tanıtım', scoreType: 'SÖZ', city: 'İstanbul', uniType: 'Devlet', baseScore2024: 395.20, rank2024: 26800, quota: 150, lang: 'Türkçe' },
  { id: 'soz-6', university: 'Ankara Üniversitesi', faculty: 'İletişim Fakültesi', department: 'Radyo, Televizyon ve Sinema', scoreType: 'SÖZ', city: 'Ankara', uniType: 'Devlet', baseScore2024: 402.10, rank2024: 19500, quota: 90, lang: 'Türkçe' },
  { id: 'soz-7', university: 'Ege Üniversitesi', faculty: 'İletişim Fakültesi', department: 'Gazetecilik', scoreType: 'SÖZ', city: 'İzmir', uniType: 'Devlet', baseScore2024: 388.90, rank2024: 34100, quota: 100, lang: 'Türkçe' },
  { id: 'soz-8', university: 'Anadolu Üniversitesi', faculty: 'Eskişehir Meslek / Turizm', department: 'Gastronomi ve Mutfak Sanatları', scoreType: 'SÖZ', city: 'Eskişehir', uniType: 'Devlet', baseScore2024: 418.60, rank2024: 8900, quota: 70, lang: 'Türkçe' },

  // Hatay (SÖZ)
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
];

const CITIES = ['TÜMÜ', 'İstanbul', 'Ankara', 'İzmir', 'Hatay', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Eskişehir'];
const UNI_TYPES = ['TÜMÜ', 'Devlet', 'Vakıf'];

export const YksTercihRobotu: React.FC = () => {
  const [userScore, setUserScore] = useState<number>(445.00);
  const [selectedScoreType, setSelectedScoreType] = useState<YksScoreType>('SAY');
  const [selectedCity, setSelectedCity] = useState<string>('TÜMÜ');
  const [selectedUniType, setSelectedUniType] = useState<string>('TÜMÜ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<UniversityProgram[]>([]);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

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

      // 5. Yalnızca puanımın yettiği bölümler
      if (onlyEligible && userScore < prog.baseScore2024) return false;

      return true;
    }).sort((a, b) => b.baseScore2024 - a.baseScore2024);
  }, [selectedScoreType, selectedCity, selectedUniType, searchQuery, onlyEligible, userScore]);

  // Durum Belirleme: Yüksek İhtimal, İdeal, Tercih Edilebilir, Riskli
  const getEligibilityStatus = (progScore: number) => {
    const diff = userScore - progScore;
    if (diff >= 20) {
      return { text: 'Çok Güvenli (Garantiye Yakın)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (diff >= 5) {
      return { text: 'Yüksek İhtimal', color: 'text-emerald-600 bg-emerald-50/60 border-emerald-200' };
    }
    if (diff >= -5) {
      return { text: 'İdeal Tercih Aralığı', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
    if (diff >= -15) {
      return { text: 'Hafif Riskli (Girebilir)', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    }
    return { text: 'Yüksek Risk (Sürpriz Tercih)', color: 'text-red-700 bg-red-50 border-red-200' };
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
            resolve(canvas.toDataURL('image/png'));
            return;
          }
        } catch (e) {
          console.error(e);
        }
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // PDF Export Function
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const listToExport = selectedList.length > 0 ? selectedList : filteredPrograms.slice(0, 24);
      const todayStr = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

      // 1. Logo
      const logoDataUrl = await loadImageDataUrl('/logo.png');
      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, 'PNG', 14, 12, 18, 18);
        } catch (e) {
          console.warn('Logo could not be added:', e);
        }
      }

      // 2. Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(26, 26, 26);
      doc.text('AŞKAR YAYINLARI', 36, 19);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(133, 101, 38);
      doc.text('YKS DERECE & TERCİH REHBERLİĞİ SİSTEMİ', 36, 24);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(234, 88, 12); // #ea580c
      doc.text('YKS Tercih Listem 2025', 14, 38);

      // Student info bar
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Aday YKS Puanı: ${userScore.toFixed(2)}  |  Puan Türü: ${selectedScoreType}  |  Tarih: ${todayStr}`, 14, 44);
      doc.text(`Tercih Edilen Program Sayısı: ${listToExport.length}  |  2024 YÖK Atlas Resmi Taban Puanları Esas Alınmıştır.`, 14, 49);

      // Horizontal separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(14, 52, 196, 52);

      // 3. Tablo
      const tableData = listToExport.map((prog, index) => {
        const diff = userScore - prog.baseScore2024;
        let statusStr = diff >= 0 ? `+${diff.toFixed(1)} Puan` : `${diff.toFixed(1)} Puan`;
        return [
          `${index + 1}`,
          prog.university,
          `${prog.department} (${prog.lang})`,
          prog.city,
          prog.uniType + (prog.scholarship ? ` (${prog.scholarship})` : ''),
          prog.baseScore2024.toFixed(2),
          prog.rank2024.toLocaleString('tr-TR'),
          statusStr,
        ];
      });

      autoTable(doc, {
        startY: 55,
        head: [['No', 'Üniversite', 'Bölüm', 'Şehir', 'Tür', '2024 Taban', '2024 Sıra', 'Fark']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [26, 26, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'left',
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          font: 'helvetica',
          textColor: [40, 40, 40],
        },
        alternateRowStyles: {
          fillColor: [250, 249, 246],
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 42 },
          2: { cellWidth: 48 },
          3: { cellWidth: 18 },
          4: { cellWidth: 26 },
          5: { cellWidth: 16, halign: 'right' },
          6: { cellWidth: 16, halign: 'right' },
          7: { cellWidth: 18, halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      });

      // Position after table
      const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 240;
      const footerY = Math.min(270, Math.max(lastY, 240));

      // 4. Clickable Links at Bottom
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.4);
      doc.line(14, footerY - 4, 196, footerY - 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235); // #2563eb

      // Link 1: Aşkar Yayınlarına Ulaş
      doc.textWithLink('Link 1: Aşkar Yayınlarına Ulaş - https://askaryayinlari.com.tr', 14, footerY + 2, {
        url: 'https://askaryayinlari.com.tr',
      });

      // Link 2: Tercih Sihirbazına Geri Dön
      doc.textWithLink('Link 2: Tercih Sihirbazına Geri Dön - https://askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu', 14, footerY + 8, {
        url: 'https://askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('© 2025 Aşkar Yayınları. Bu tercih listesi YÖK Atlas 2024 yerleştirme verileri simülasyonudur.', 14, footerY + 14);

      // 5. Small QR Code in bottom corner
      try {
        const qrDataUrl = await QRCode.toDataURL('https://askaryayinlari.com.tr/uygulamalar/yks-tercih-robotu', {
          margin: 1,
          width: 80,
          color: {
            dark: '#1A1A1A',
            light: '#FFFFFF',
          },
        });
        doc.addImage(qrDataUrl, 'PNG', 170, footerY - 3, 20, 20);
        doc.setFontSize(6.5);
        doc.setTextColor(100, 100, 100);
        doc.text('Robotu Aç', 173, footerY + 19);
      } catch (err) {
        console.warn('QR code generation error:', err);
      }

      // Save PDF
      doc.save(`YKS_Tercih_Listem_2025_${selectedScoreType}_${userScore}.pdf`);
    } catch (err) {
      console.error('PDF creation error:', err);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReset = () => {
    setUserScore(445.00);
    setSelectedScoreType('SAY');
    setSelectedCity('TÜMÜ');
    setSelectedUniType('TÜMÜ');
    setSearchQuery('');
    setOnlyEligible(false);
    setSelectedList([]);
  };

  const yksBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'k_yks') || BOOKS_DATA.find((b) => b.id === 'k11');
  }, []);

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
      {/* 1. Başlık & Rozet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1A1A1A]/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ea580c] rounded-xl text-white shadow-2xs">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ea580c] font-bold">
              YÖK ATLAS 2024 RESMİ TABAN PUANLARI
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
              YKS Tercih Sihirbazı 2025 + PDF İndir
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors border border-[#1A1A1A]/15 cursor-pointer font-bold self-start sm:self-auto"
          title="Filtreleri ve listeyi sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Filtreleri Sıfırla</span>
        </button>
      </div>

      {/* 2. ADIM 1: PUAN & PUAN TÜRÜ GİRİŞİ */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Puan Girişi */}
        <div>
          <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
            YKS YERLEŞTİRME PUANINIZ:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="150"
              max="560"
              step="0.01"
              value={userScore}
              onChange={(e) => setUserScore(parseFloat(e.target.value) || 150)}
              className="w-36 bg-white border border-[#1A1A1A]/20 rounded-xl px-3.5 py-2 text-xl font-serif font-black text-[#1A1A1A] focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
            />
            <span className="text-xs font-mono font-semibold text-[#1A1A1A]/60">
              Puan (OBP Dahil)
            </span>
          </div>
        </div>

        {/* Puan Türü Seçimi */}
        <div>
          <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block mb-1">
            PUAN TÜRÜ SEÇİN:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['SAY', 'EA', 'SÖZ', 'DİL'] as YksScoreType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedScoreType(type)}
                className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                  selectedScoreType === type
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#FAF6EE]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ADIM 2: ŞEHİR & DEVLET/VAKIF FİLTRELERİ & ARAMA */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Şehir Filtresi */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ea580c]" />
              <span>ŞEHİR:</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'TÜMÜ' ? 'Tüm Şehirler' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Devlet / Vakıf Filtresi */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#ea580c]" />
              <span>ÜNİVERSİTE TÜRÜ:</span>
            </label>
            <select
              value={selectedUniType}
              onChange={(e) => setSelectedUniType(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c]"
            >
              {UNI_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'TÜMÜ' ? 'Devlet + Vakıf (Tümü)' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Bölüm / Üniversite Arama */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/70 block mb-1 flex items-center gap-1">
              <Search className="w-3 h-3 text-[#ea580c]" />
              <span>BÖLÜM VEYA ÜNİVERSİTE ARA:</span>
            </label>
            <input
              type="text"
              placeholder="Örn: Bilgisayar, Hukuk, Tıp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/20 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c]"
            />
          </div>
        </div>

        {/* Checkbox: Yalnızca puanımın yettiği bölümler */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]/10 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-sans text-[#1A1A1A]/80">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="w-4 h-4 rounded text-[#ea580c] focus:ring-[#ea580c]"
            />
            <span>Yalnızca puanımın yettiği (Taban Puan ≤ {userScore}) bölümleri göster</span>
          </label>

          <span className="text-[11px] font-mono font-bold text-[#ea580c]">
            {filteredPrograms.length} Bölüm Listelendi
          </span>
        </div>
      </div>

      {/* 4. TABLONUN ÜSTÜ: PDF OLARAK İNDİR BUTONU (Özel İstek: Buton siyah, yuvarlak, ikonlu) */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#FAF9F6] to-orange-50/40 rounded-2xl border border-[#1A1A1A]/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ea580c]" />
          <span className="text-xs font-serif font-bold text-[#1A1A1A]">
            {selectedList.length > 0
              ? `${selectedList.length} adet tercih listenize eklendi`
              : 'Listenizi oluşturun veya filtrelenen tüm bölümleri indirin'}
          </span>
        </div>

        {/* Buton siyah, yuvarlak, ikonlu */}
        <button
          type="button"
          id="btn-download-yks-tercih-pdf"
          disabled={isGeneratingPdf || filteredPrograms.length === 0}
          onClick={handleDownloadPdf}
          className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer border border-[#1A1A1A] disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#C9A86A]" />
          <span>{isGeneratingPdf ? 'PDF HAZIRLANIYOR...' : 'PDF OLARAK İNDİR'}</span>
        </button>
      </div>

      {/* 5. FİLTRELENEBİLİR TABLO */}
      <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden shadow-2xs bg-[#FAF9F6] mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3 sm:px-4 w-12 text-center">Seç</th>
                <th className="p-3 sm:px-4">Üniversite & Fakülte</th>
                <th className="p-3 sm:px-4">Bölüm & Öğretim Dili</th>
                <th className="p-3 sm:px-4 text-center w-20">Şehir</th>
                <th className="p-3 sm:px-4 text-center w-28">Üni Türü</th>
                <th className="p-3 sm:px-4 text-right w-24">2024 Taban</th>
                <th className="p-3 sm:px-4 text-right w-24">2024 Sıra</th>
                <th className="p-3 sm:px-4 text-center w-36">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 bg-white">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#1A1A1A]/60 font-sans">
                    Arama kriterlerinize uygun üniversite bölümü bulunamadı. Lütfen puan türü veya filtreleri değiştirin.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((prog) => {
                  const status = getEligibilityStatus(prog.baseScore2024);
                  const isSelected = selectedList.some((p) => p.id === prog.id);

                  return (
                    <tr
                      key={prog.id}
                      className={`hover:bg-[#FAF6EE]/50 transition-colors ${
                        isSelected ? 'bg-orange-50/40' : ''
                      }`}
                    >
                      <td className="p-3 sm:px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectProgram(prog)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#ea580c] text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-[#1A1A1A]/50 border border-stone-300'
                          }`}
                          title={isSelected ? 'Listemden Çıkar' : 'Tercih Listeme Ekle'}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="p-3 sm:px-4">
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] block">
                          {prog.university}
                        </span>
                        <span className="text-[10px] text-[#1A1A1A]/50 font-sans block">
                          {prog.faculty}
                        </span>
                      </td>

                      <td className="p-3 sm:px-4">
                        <span className="font-sans font-bold text-xs text-[#1A1A1A] block">
                          {prog.department}
                        </span>
                        <span className="text-[10px] font-mono text-[#ea580c] font-semibold">
                          {prog.lang} • Kont: {prog.quota}
                        </span>
                      </td>

                      <td className="p-3 sm:px-4 text-center font-sans font-semibold text-[#1A1A1A]/80">
                        {prog.city}
                      </td>

                      <td className="p-3 sm:px-4 text-center">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-[#FAF9F6] border-[#1A1A1A]/10 text-[#1A1A1A]/70">
                          {prog.uniType}
                          {prog.scholarship ? ` (${prog.scholarship})` : ''}
                        </span>
                      </td>

                      <td className="p-3 sm:px-4 text-right font-mono font-bold text-[#ea580c]">
                        {prog.baseScore2024.toFixed(2)}
                      </td>

                      <td className="p-3 sm:px-4 text-right font-mono text-[#1A1A1A]/70">
                        {prog.rank2024.toLocaleString('tr-TR')}
                      </td>

                      <td className="p-3 sm:px-4 text-center">
                        <span className={`text-[10px] font-sans font-bold px-2 py-1 rounded-lg border block text-center truncate ${status.color}`}>
                          {status.text}
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

      {/* 6. AŞKAR YKS KOÇLUK REHBERİ KARTI */}
      {yksBook && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#ea580c]/20 text-white rounded-2xl shadow-md border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-5">
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
