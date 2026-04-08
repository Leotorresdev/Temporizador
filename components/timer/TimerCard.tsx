import { Sparkles } from "lucide-react";
import { formatTime } from "@/lib/usePomodoroTimer";

interface TimerCardProps {
  remainingTime: number;
  totalTime: number;
  progress: number;
  modeLabel: string;
  modeDescription: string;
  finished: boolean;
}

export default function TimerCard({
  remainingTime,
  totalTime,
  progress,
  modeLabel,
  modeDescription,
  finished,
}: TimerCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      {/* Tarjeta principal que muestra el tiempo restante y el total */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{modeLabel}</p>
          <p className="mt-2 text-6xl font-semibold text-white sm:text-7xl">
            {formatTime(remainingTime)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-right text-slate-300 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Total</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatTime(totalTime)}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-700/60 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{finished ? "Sesión completa" : "Progreso"}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 rounded-full bg-slate-800/90 p-1">
          <div
            className="h-3 rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/90 p-6 text-slate-300 shadow-inner">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-slate-500">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          {finished ? "Tiempo para cambiar" : "Continuar enfocado"}
        </div>
        <p className="mt-3 text-base leading-7 text-slate-200">{modeDescription}</p>
      </div>
    </div>
  );
}
