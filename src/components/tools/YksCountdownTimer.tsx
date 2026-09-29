import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, GraduationCap, RefreshCw, Timer } from 'lucide-react';

interface ExamCalendarResponse {
  yks: string | null;
  source: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const emptyTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };

const calculateRemaining = (target: string | null): TimeLeft => {
  if (!target) return emptyTime;
  const totalMs = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    totalMs,
    days: Math.floor(totalMs / 86400000),
    hours: Math.floor((totalMs / 3600000) % 24),
    minutes: Math.floor((totalMs / 60000) % 60),
    seconds: Math.floor((totalMs / 1000) % 60)
  };
};

export const YksCountdownTimer: React.FC = () => {
  const [examDate, setExamDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(emptyTime);

  const loadCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exam-calendar');
      if (!response.ok) throw new Error('Takvim alınamadı');
      const data = (await response.json()) as ExamCalendarResponse;
      setExamDate(data.yks);
      setTimeLeft(calculateRemaining(data.yks));
    } catch {
      setExamDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(calculateRemaining(examDate)), 1000);
    return () => window.clearInterval(interval);
  }, [examDate]);

  const formattedDate = useMemo(() => {
    if (!examDate) return null;
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(examDate));
  }, [examDate]);

  return (
    <section className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 sm:p-8 shadow-xs space-y-7">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#C9A86A]"><GraduationCap className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#856526] font-bold">ÖSYM TAKVİMİ • YKS</div>
            <h2 className="font-serif font-black text-xl sm:text-2xl">YKS Geri Sayım Sayacı</h2>
          </div>
        </div>
        <button type="button" onClick={loadCalendar} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1A1A1A]/15 px-3 py-2 text-xs font-bold hover:border-[#C9A86A]">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Takvimi Yenile
        </button>
      </header>

      {!examDate ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">
          <Calendar className="mx-auto mb-3 h-7 w-7" />
          <strong>YKS sınav tarihi henüz açıklanmadı.</strong>
          <p className="mt-2 text-xs">ÖSYM takvimi yayınlandığında bu sayaç tarihi otomatik alıp çalışmaya başlayacak.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1A1A1A] p-6 sm:p-10 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#C9A86A]"><Timer className="w-3.5 h-3.5" /> {formattedDate}</div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['GÜN', timeLeft.days],
              ['SAAT', timeLeft.hours],
              ['DAKİKA', timeLeft.minutes],
              ['SANİYE', timeLeft.seconds]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/15 bg-white/5 p-4">
                <div className="text-4xl font-black tabular-nums text-[#C9A86A]">{label === 'GÜN' ? value : String(value).padStart(2, '0')}</div>
                <div className="mt-1 text-[10px] font-mono tracking-[0.2em] text-white/60">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};