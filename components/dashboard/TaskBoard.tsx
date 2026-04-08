"use client";

import { CheckCheck, Clock3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskItem, getTaskDateTime } from "@/lib/taskStore";

interface TaskBoardProps {
  tasks: TaskItem[];
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

const formatFullDate = (date: Date) =>
  new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export default function TaskBoard({ tasks, onDeleteTask, onToggleTask }: TaskBoardProps) {
  // Esta vista solo renderiza y despacha acciones; la verdad de los datos sigue en el store.
  return (
    <section className="glass-panel rounded-[2rem] border border-white/10 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Agenda visual</h2>
          <p className="text-sm leading-6 text-slate-300">
            La lista ya viene ordenada por fecha, asi que la prioridad nace del tiempo real.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-300">
          {tasks.length} tareas registradas
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {tasks.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-cyan-300/20 bg-slate-950/30 p-8 text-center text-slate-300">
            No hay tareas todavia. Crea la primera y la veras aparecer aqui con su hora y acciones.
          </div>
        ) : (
          tasks.map((task) => {
            const scheduledDate = getTaskDateTime(task);

            return (
              <article
                key={task.id}
                className={`rounded-[1.5rem] border p-5 transition ${
                  task.completed
                    ? "border-emerald-400/20 bg-emerald-400/8"
                    : "border-white/10 bg-slate-950/45"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                          task.completed
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-cyan-300/10 text-cyan-100"
                        }`}
                      >
                        {task.completed ? "Completada" : "Pendiente"}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {task.focusMinutes} min
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock3 className="h-4 w-4 text-cyan-300" />
                      {formatFullDate(scheduledDate)}
                    </div>
                    {task.notes ? (
                      <p className="max-w-3xl text-sm leading-7 text-slate-300">{task.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={task.completed ? "secondary" : "default"}
                      className="h-11 rounded-2xl px-4"
                      onClick={() => onToggleTask(task.id)}
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      {task.completed ? "Marcar pendiente" : "Completar"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-11 rounded-2xl px-4"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
