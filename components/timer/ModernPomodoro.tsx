"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { formatTime, timerModes, type TimerMode, usePomodoroTimer } from "@/lib/usePomodoroTimer";

const modeOrder: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];

const modeStyles: Record<TimerMode, string> = {
  pomodoro: "from-fuchsia-500 via-rose-500 to-orange-400",
  shortBreak: "from-cyan-400 via-sky-500 to-blue-600",
  longBreak: "from-violet-500 via-indigo-500 to-blue-500",
};

const modeSurface: Record<TimerMode, string> = {
  pomodoro: "from-rose-500/25 to-orange-400/20",
  shortBreak: "from-cyan-400/25 to-blue-500/20",
  longBreak: "from-violet-500/25 to-indigo-500/20",
};

export default function ModernPomodoro() {
  const {
    mode,
    remainingTime,
    progress,
    isRunning,
    completedSessions,
    currentRound,
    nextModeLabel,
    toggleRunning,
    resetTimer,
    selectMode,
  } = usePomodoroTimer();

  return (
    <section className="relative flex h-dvh items-center justify-center overflow-hidden px-4 py-0 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-136 w-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-[130px]" />
        <div className="absolute left-[18%] top-[14%] h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[15%] top-[65%] h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-5xl overflow-hidden rounded-[2.2rem] border border-white/15 bg-slate-950/55 p-6 shadow-[0_30px_120px_-45px_rgba(99,102,241,0.65)] backdrop-blur-2xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
          <div className={`absolute -right-32 -top-36 h-56 w-56 rounded-full bg-linear-to-br ${modeSurface[mode]} blur-2xl`} />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-white/65">Pomodoro Focus</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Modo minimal premium</p>
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
            Progreso: {Math.round(progress)}%
          </div>
        </div>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {modeOrder.map((item) => {
                const isActive = item === mode;
                return (
                  <button
                    key={item}
                    onClick={() => selectMode(item)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-white/40 bg-white/20 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {timerModes[item].label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-5">
              <p className="text-sm text-white/75">{timerModes[mode].description}</p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => void toggleRunning()}
                  className={`inline-flex h-12 items-center gap-2 rounded-2xl px-6 text-sm font-semibold text-slate-950 transition ${
                    isRunning
                      ? "bg-rose-300 hover:bg-rose-200"
                      : "bg-linear-to-r from-cyan-300 to-fuchsia-300 hover:from-cyan-200 hover:to-fuchsia-200"
                  }`}
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? "Pausar" : "Iniciar"}
                </button>

                <button
                  onClick={resetTimer}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white/65">Ronda</p>
                <p className="mt-1 text-lg font-semibold">{currentRound}/4</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white/65">Completadas</p>
                <p className="mt-1 text-lg font-semibold">{completedSessions}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white/65">Siguiente</p>
                <p className="mt-1 text-sm font-semibold">{nextModeLabel}</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
            <motion.div
              animate={isRunning ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={isRunning ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
              className={`absolute inset-0 rounded-full bg-linear-to-br ${modeStyles[mode]} opacity-35 blur-md`}
            />

            <motion.div
              animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
              transition={isRunning ? { duration: 16, repeat: Infinity, ease: "linear" } : undefined}
              className="absolute inset-4 rounded-full border border-dashed border-white/20"
            />

            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 220 220" aria-hidden>
              <circle cx="110" cy="110" r="98" stroke="rgba(255,255,255,0.13)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="110"
                cy="110"
                r="98"
                stroke="url(#pomodoro-ring)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={615.75}
                animate={{ strokeDashoffset: 615.75 - (615.75 * progress) / 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="pomodoro-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 text-center">
              <p className="text-6xl font-semibold tracking-tight sm:text-7xl">{formatTime(remainingTime)}</p>
              <p className="mt-2 text-sm text-white/70">{mode === "pomodoro" ? "Enfocate en una sola tarea" : "Recupera energia para seguir"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
