import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Timer, Sparkles, Coffee, CheckCircle2, Volume2, VolumeX, Flame } from 'lucide-react';

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<PomodoroMode, { name: string; defaultMinutes: number; badge: string; color: string }> = {
  work: {
    name: 'Odaklanma / Çalışma',
    defaultMinutes: 25,
    badge: 'DERS ÇALIŞMA',
    color: '#1A1A1A'
  },
  shortBreak: {
    name: 'Kısa Mola',
    defaultMinutes: 5,
    badge: 'DİNLENME',
    color: '#059669'
  },
  longBreak: {
    name: 'Uzun Mola',
    defaultMinutes: 15,
    badge: 'BÜYÜK MOLA',
    color: '#0284c7'
  }
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [taskName, setTaskName] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play chime sound with Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // Play two harmonious tones
      playTone(587.33, 0, 0.4); // D5
      playTone(880.00, 0.2, 0.6); // A5
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  const getDurationForMode = (m: PomodoroMode): number => {
    if (m === 'work') return workMinutes * 60;
    if (m === 'shortBreak') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  };

  // Switch mode
  const handleModeChange = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            playChime();

            if (mode === 'work') {
              setCompletedSessions((c) => c + 1);
              // Switch to break
              const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
              setMode(nextMode);
              return getDurationForMode(nextMode);
            } else {
              setMode('work');
              return getDurationForMode('work');
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedSessions, workMinutes, shortBreakMinutes, longBreakMinutes, soundEnabled]);

  // Reset current timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  // Skip to next step
  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(getDurationForMode(nextMode));
    } else {
      setMode('work');
      setTimeLeft(getDurationForMode('work'));
    }
  };

  // Formatting minutes & seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = getDurationForMode(mode);
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-white">
            <Timer className="w-5 h-5 text-[#C9A86A]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/50">
              VERİMLİ ÇALIŞMA SİSTEMİ
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Pomodoro Odaklanma Sayacı
            </h3>
          </div>
        </div>

        {/* Sound toggle & completed stats */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-colors"
            title={soundEnabled ? 'Bildirim Sesi Açık' : 'Bildirim Sesi Kapalı'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C9A86A]" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-[11px] font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span className="text-[#1A1A1A]/60">Tamamlanan:</span>
            <span className="font-bold text-[#1A1A1A]">{completedSessions} Oturum</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center gap-2 mb-8 max-w-md mx-auto">
        <button
          onClick={() => handleModeChange('work')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-mono uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all ${
            mode === 'work'
              ? 'bg-[#1A1A1A] text-white shadow-xs font-bold'
              : 'bg-[#F8F7F4] text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/10'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#C9A86A]" />
          <span>Çalışma (25 dk)</span>
        </button>

        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-mono uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all ${
            mode === 'shortBreak'
              ? 'bg-[#059669] text-white shadow-xs font-bold'
              : 'bg-[#F8F7F4] text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/10'
          }`}
        >
          <Coffee className="w-3 h-3 text-white" />
          <span>Kısa Mola (5 dk)</span>
        </button>

        <button
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-mono uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all ${
            mode === 'longBreak'
              ? 'bg-[#0284c7] text-white shadow-xs font-bold'
              : 'bg-[#F8F7F4] text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/10'
          }`}
        >
          <Coffee className="w-3 h-3 text-white" />
          <span>Uzun Mola (15 dk)</span>
        </button>
      </div>

      {/* Main Timer Display Box */}
      <div className="max-w-md mx-auto bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xs">
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1A1A1A]/5">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: mode === 'work' ? '#C9A86A' : mode === 'shortBreak' ? '#059669' : '#0284c7'
            }}
          />
        </div>

        {/* Current Active Mode Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#1A1A1A]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-4 font-bold">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: mode === 'work' ? '#C9A86A' : mode === 'shortBreak' ? '#059669' : '#0284c7' }}
          />
          {MODE_CONFIG[mode].name}
        </div>

        {/* Time Big Display */}
        <div className="text-6xl sm:text-7xl font-mono font-black tracking-tighter text-[#1A1A1A] my-4 select-none">
          {formattedTime}
        </div>

        {/* Current Task Field */}
        <div className="mb-6">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Şu an hangi konuya odaklanıyorsunuz? (Örn: LGS Matematik)"
            className="w-full text-center px-4 py-2 text-xs bg-white border border-[#1A1A1A]/15 rounded-xl text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all font-sans"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-full bg-white hover:bg-neutral-100 border border-[#1A1A1A]/10 text-[#1A1A1A] transition-all hover:scale-105 active:scale-95 shadow-2xs"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-bold flex items-center gap-2.5 transition-all shadow-md hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#1A1A1A] hover:bg-black text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-[#C9A86A] fill-[#C9A86A]" />
                <span>DURAKLAT</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-[#C9A86A] fill-[#C9A86A]" />
                <span>BAŞLAT</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="p-3.5 rounded-full bg-white hover:bg-neutral-100 border border-[#1A1A1A]/10 text-[#1A1A1A] transition-all hover:scale-105 active:scale-95 shadow-2xs"
            title="Sonraki Aşamaya Geç"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Pomodoro Cycles Dots */}
        <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-center gap-2 text-[10px] font-mono text-[#1A1A1A]/60">
          <span>Döngü:</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = completedSessions % 4 > idx || completedSessions >= (Math.floor(completedSessions / 4) * 4 + idx + 1);
              return (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    isFilled
                      ? 'bg-[#C9A86A] border-[#C9A86A]'
                      : 'bg-white border-[#1A1A1A]/20'
                  }`}
                  title={`${idx + 1}. Oturum`}
                />
              );
            })}
          </div>
          <span className="text-[9px] text-[#1A1A1A]/40 ml-1">
            ({completedSessions % 4}/4)
          </span>
        </div>
      </div>

      {/* Info Guide Box */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
        <div className="p-4 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl space-y-1">
          <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86A]" />
            1. 25 Dakika Odaklan
          </div>
          <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
            Telefon bildirimlerini kapatın, tek bir derse veya konuya kesintisiz odaklanın.
          </p>
        </div>

        <div className="p-4 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl space-y-1">
          <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            2. 5 Dakika Mola Ver
          </div>
          <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
            Masa başından kalkın, su için veya hafif esneme hareketleri yapın.
          </p>
        </div>

        <div className="p-4 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl space-y-1">
          <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0284c7]" />
            3. 4 Tur Sonra Uzun Mola
          </div>
          <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
            Her 4 çalışma turunun ardından zihninizi tazelemek için 15-20 dk dinlenin.
          </p>
        </div>
      </div>
    </div>
  );
};
