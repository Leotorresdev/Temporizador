import { motion } from "framer-motion";
import { Play, Pause, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { formatTime } from "@/lib/usePomodoroTimer";

interface TimerWindowProps {
  remainingTime: number;
  totalTime: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  modeLabel: string;
}

export default function TimerWindow({
  remainingTime,
  totalTime,
  isRunning,
  onToggle,
  onReset,
  modeLabel,
}: TimerWindowProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 w-[320px] rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_35px_120px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ventana</p>
          <p className="text-xl font-semibold text-white">{modeLabel}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          {formatTime(remainingTime)}
        </div>
      </div>

      <div className="mt-4 rounded-[1.5rem] bg-slate-900/80 p-4 text-center ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Tiempo restante</p>
        <p className="mt-2 text-4xl font-semibold text-white">{formatTime(remainingTime)}</p>
        <p className="mt-1 text-sm text-slate-400">de {formatTime(totalTime)}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button variant={isRunning ? "destructive" : "default"} size="sm" onClick={onToggle}>
          {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Resetear
        </Button>
      </div>
    </motion.aside>
  );
}
