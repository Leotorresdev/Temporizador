"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface TaskItem {
  id: string;
  title: string;
  date: string;
  time: string;
  notes: string;
  focusMinutes: number;
  completed: boolean;
  createdAt: string;
  notifiedAt: string | null;
}

interface TaskDraft {
  title: string;
  date: string;
  time: string;
  notes?: string;
  focusMinutes?: number;
}

interface TaskStore {
  tasks: TaskItem[];
  addTask: (draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  markTaskNotified: (id: string, notifiedAt: string) => void;
}

const createTaskId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getTaskDateTime = (task: Pick<TaskItem, "date" | "time">) =>
  new Date(`${task.date}T${task.time}:00`);

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (draft) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: createTaskId(),
              title: draft.title.trim(),
              date: draft.date,
              time: draft.time,
              notes: draft.notes?.trim() ?? "",
              focusMinutes: draft.focusMinutes ?? 25,
              completed: false,
              createdAt: new Date().toISOString(),
              notifiedAt: null,
            },
          ],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  notifiedAt: !task.completed ? task.notifiedAt : null,
                }
              : task,
          ),
        })),
      markTaskNotified: (id, notifiedAt) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  notifiedAt,
                }
              : task,
          ),
        })),
    }),
    {
      name: "tempo-flow-tasks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
