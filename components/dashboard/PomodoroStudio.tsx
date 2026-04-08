"use client";

import { motion } from "framer-motion";
import { Coffee, Pause, Play, RefreshCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, usePomodoroTimer } from "@/lib/usePomodoroTimer";

export default function PomodoroStudio() {
  // El hook centraliza el reloj y las transiciones entre trabajo y descansos.
  const {
    remainingTime,
    totalTime,
    isRunning,
    completedSessions,
    modeInfo,
    progress,
    currentRound,
    nextModeLabel,
    toggleRunning,
    resetTimer,
  } = usePomodoroTimer();

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] border border-white/10 p-6">
      <div className="flex items-center gap-3 text-cyan-100">
        <Timer className="h-5 w-5" />
        <div>
          <h2 className="text-2xl font-semibold text-white">Pomodoro creativo</h2>
          <p className="text-sm leading-6 text-slate-300">
            La UI muestra el estado del hook y deja que la logica de ciclos viva separada.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="mesh-card rounded-[1.75rem] border border-white/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">{modeInfo.label}</p>
              <p className="mt-3 text-6xl font-semibold tracking-tight text-white sm:text-7xl">
                {formatTime(remainingTime)}
              </p>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">{modeInfo.description}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Meta</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatTime(totalTime)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-full bg-slate-950/60 p-2">
            <motion.div
              className="h-4 rounded-full bg-linear-to-r from-cyan-300 via-sky-400 to-blue-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="h-11 rounded-2xl px-5" onClick={() => void toggleRunning()}>
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? "Pausar ciclo" : "Iniciar ciclo"}
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl px-5" onClick={resetTimer}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <article className="mesh-card rounded-[1.5rem] border border-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-100/70">Ronda actual</p>
            <p className="mt-3 text-4xl font-semibold text-white">#{currentRound}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Despues de cada bloque de enfoque el hook decide si toca pausa corta o larga.
            </p>
          </article>
          <article className="mesh-card rounded-[1.5rem] border border-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-100/70">Siguiente fase</p>
            <p className="mt-3 text-3xl font-semibold text-white">{nextModeLabel}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Esto hace visible la decision del algoritmo sin tener que abrir el hook.
            </p>
          </article>
          <article className="mesh-card rounded-[1.5rem] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cyan-100">
              <Coffee className="h-5 w-5" />
              Sesiones completadas
            </div>
            <p className="mt-3 text-4xl font-semibold text-white">{completedSessions}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Solo contamos sesiones de enfoque para medir avance real y programar descansos largos.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
