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
    label: "Pomodoro",
    seconds: 1500,
    description: "25 min de trabajo intenso para mantener concentración.",
    accent: "cyan",
  },
  shortBreak: {
    label: "Descanso corto",
    seconds: 300,
    description: "5 min para recuperar energía sin perder ritmo.",
    accent: "sky",
  },
  longBreak: {
    label: "Descanso largo",
    seconds: 900,
    description: "15 min de pausa para descansar profundamente.",
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

const getNotificationSupported = () => typeof window !== "undefined" && "Notification" in window;

export function usePomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [totalTime, setTotalTime] = useState(timerModes.pomodoro.seconds);
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [supportsNotifications, setSupportsNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setRemainingTime(totalTime);
  }, [totalTime]);

  useEffect(() => {
    if (getNotificationSupported()) {
      setSupportsNotifications(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const notifyEnd = (sessionName: string) => {
    if (!getNotificationSupported()) return;

    if (Notification.permission === "granted") {
      new Notification("Sesión finalizada", {
        body: `Tu ${sessionName} ha terminado. ¡Es momento de cambiar de actividad!`,
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

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setCompletedSessions((current) => current + 1);
          notifyEnd(timerModes[mode].label);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingTime, mode]);

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

  return {
    mode,
    totalTime,
    remainingTime,
    isRunning,
    completedSessions,
    modeInfo: timerModes[mode],
    progress,
    notificationEnabled: supportsNotifications && notificationPermission === "granted",
    toggleRunning,
    resetTimer,
    selectMode,
  };
}
