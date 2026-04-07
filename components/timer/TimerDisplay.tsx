"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { usePomodoroTimer } from "@/lib/usePomodoroTimer";
import TimerActions from "./TimerActions";
import TimerCard from "./TimerCard";
import TimerModeSelector from "./TimerModeSelector";
import TimerTips from "./TimerTips";
import TimerWindow from "./TimerWindow";

export default function TimerDisplay() {
  const {
    mode,
    totalTime,
    remainingTime,
    isRunning,
    completedSessions,
    modeInfo,
    progress,
    notificationEnabled,
    toggleRunning,
    resetTimer,
    selectMode,
  } = usePomodoroTimer();

  const finished = remainingTime === 0 && !isRunning;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_25px_100px_-40px_rgba(56,189,248,0.65)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 ring-1 ring-cyan-500/20">
              <Clock3 className="h-4 w-4" />
              Temporizador Pomodoro
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Mejora tu foco con sesiones claras
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300 sm:text-lg">
              Elige una sesión de trabajo o descanso y recibe una notificación cuando termine.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-900/80 p-5 text-slate-200 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Modo activo</p>
            <p className="mt-3 text-2xl font-semibold text-white">{modeInfo.label}</p>
            <p className="mt-2 text-sm text-slate-400">{modeInfo.description}</p>
          </div>
        </div>

        <div className="mt-8">
          <TimerModeSelector currentMode={mode} onSelectMode={selectMode} disabled={isRunning} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="grid gap-6">
            <TimerCard
              remainingTime={remainingTime}
              totalTime={totalTime}
              progress={progress}
              modeLabel={modeInfo.label}
              modeDescription={modeInfo.description}
              finished={finished}
            />
            <TimerActions
              isRunning={isRunning}
              onToggle={toggleRunning}
              onReset={resetTimer}
              resetDisabled={!isRunning && remainingTime === totalTime}
              activeModeLabel={modeInfo.label}
            />
          </div>
          <TimerTips completedSessions={completedSessions} notificationEnabled={notificationEnabled} />
        </div>
      </motion.div>
      <TimerWindow
        remainingTime={remainingTime}
        totalTime={totalTime}
        isRunning={isRunning}
        onToggle={toggleRunning}
        onReset={resetTimer}
        modeLabel={modeInfo.label}
      />
    </div>
  );
}
;