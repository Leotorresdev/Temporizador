"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskItem, getTaskDateTime, useTaskStore } from "./taskStore";

const browserHasNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

export function useTaskNotifications(tasks: TaskItem[]) {
  const markTaskNotified = useTaskStore((state) => state.markTaskNotified);
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    browserHasNotifications() ? Notification.permission : "default",
  );

  useEffect(() => {
    if (!browserHasNotifications() || permission !== "granted") return;

    // Revisamos periodicamente las tareas para avisar cuando llega la hora pactada.
    const interval = window.setInterval(() => {
      const now = Date.now();

      tasks.forEach((task) => {
        if (task.completed || task.notifiedAt) return;

        const taskTime = getTaskDateTime(task).getTime();
        if (taskTime > now) return;

        new Notification("Es hora de tu tarea", {
          body: `${task.title} empieza ahora. Reserva ${task.focusMinutes} min para completarla.`,
          icon: "/icono.png",
          badge: "/icono.png",
          tag: task.id,
        });

        markTaskNotified(task.id, new Date().toISOString());
      });
    }, 15000);

    return () => window.clearInterval(interval);
  }, [markTaskNotified, permission, tasks]);

  const requestPermission = async () => {
    if (!browserHasNotifications()) return "unsupported" as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const nextTask = useMemo(
    () =>
      [...tasks]
        .filter((task) => !task.completed)
        .sort(
          (left, right) => getTaskDateTime(left).getTime() - getTaskDateTime(right).getTime(),
        )[0] ?? null,
    [tasks],
  );

  return {
    notificationPermission: permission,
    supportsNotifications: browserHasNotifications(),
    requestPermission,
    nextTask,
  };
}
