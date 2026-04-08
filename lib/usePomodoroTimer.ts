"use client";

import { useEffect, useMemo, useState } from "react";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface TimerModeDefinition {
  label: string;
  seconds: number;
  description: string;
  accent: string;
}

export const timerModes: Record<TimerMode, TimerModeDefinition> = {
  pomodoro: {
    label: "Enfoque profundo",
    seconds: 1500,
    description: "25 min para aislar distracciones y avanzar en una sola meta.",
    accent: "cyan",
  },
  shortBreak: {
    label: "Recarga rapida",
    seconds: 300,
    description: "5 min para soltar tension y volver con mas claridad.",
    accent: "sky",
  },
  longBreak: {
    label: "Reset completo",
    seconds: 900,
    description: "15 min para respirar, levantarte y reiniciar tu energia mental.",
    accent: "blue",
  },
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const getNotificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export function usePomodoroTimer() {
  // mode marca la fase actual del ciclo pomodoro.
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [totalTime, setTotalTime] = useState(timerModes.pomodoro.seconds);
  const [remainingTime, setRemainingTime] = useState(timerModes.pomodoro.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(() =>
      getNotificationSupported() ? Notification.permission : "default",
    );
  const supportsNotifications = getNotificationSupported();

  const notifyEnd = (sessionName: string) => {
    if (!getNotificationSupported()) return;

    if (Notification.permission === "granted") {
      new Notification("Ciclo completado", {
        body: `Tu fase ${sessionName} termino. Sigue el ritmo y entra en la siguiente etapa.`,
        icon: "/icono.png",
        badge: "/icono.png",
      });
    }
  };

  const requestNotificationPermission = async () => {
    if (!getNotificationSupported()) return;

    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
    }
  };

  useEffect(() => {
    if (!isRunning || remainingTime <= 0) return;

    const interval = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          notifyEnd(timerModes[mode].label);

          setCompletedSessions((current) => {
            const updatedSessions = current + (mode === "pomodoro" ? 1 : 0);
            const nextMode =
              mode === "pomodoro"
                ? updatedSessions % 4 === 0
                  ? "longBreak"
                  : "shortBreak"
                : "pomodoro";

            setMode(nextMode);
            setTotalTime(timerModes[nextMode].seconds);
            setRemainingTime(timerModes[nextMode].seconds);
            return updatedSessions;
          });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, mode, remainingTime]);

  const toggleRunning = async () => {
    if (!isRunning && supportsNotifications && notificationPermission === "default") {
      await requestNotificationPermission();
    }

    if (remainingTime === 0) {
      setRemainingTime(totalTime);
    }

    setIsRunning((current) => !current);
  };

  const resetTimer = () => {
    setRemainingTime(totalTime);
    setIsRunning(false);
  };

  const selectMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTotalTime(timerModes[newMode].seconds);
    setRemainingTime(timerModes[newMode].seconds);
    setIsRunning(false);
  };

  const progress = useMemo(() => {
    if (totalTime === 0) return 0;
    return Math.min(100, Math.max(0, ((totalTime - remainingTime) / totalTime) * 100));
  }, [remainingTime, totalTime]);

  const currentRound = (completedSessions % 4) + 1;
  const nextModeLabel =
    mode === "pomodoro"
      ? (completedSessions + 1) % 4 === 0
        ? timerModes.longBreak.label
        : timerModes.shortBreak.label
      : timerModes.pomodoro.label;

  return {
    mode,
    totalTime,
    remainingTime,
    isRunning,
    completedSessions,
    modeInfo: timerModes[mode],
    progress,
    currentRound,
    nextModeLabel,
    notificationEnabled: supportsNotifications && notificationPermission === "granted",
    toggleRunning,
    resetTimer,
    selectMode,
  };
}
