"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Hourglass,
  Sparkles,
} from "lucide-react";
import TaskComposer from "./TaskComposer";
import TaskBoard from "./TaskBoard";
import PomodoroStudio from "./PomodoroStudio";
import { getTaskDateTime, useTaskStore } from "@/lib/taskStore";
import { useTaskNotifications } from "@/lib/useTaskNotifications";

const formatTaskDate = (date: Date) =>
  new Intl.DateTimeFormat("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export default function ProductivityDashboard() {
  // El store evita prop drilling y mantiene sincronizados formulario, lista y avisos.
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const { notificationPermission, supportsNotifications, requestPermission, nextTask } =
    useTaskNotifications(tasks);

  const orderedTasks = [...tasks].sort(
    (left, right) => getTaskDateTime(left).getTime() - getTaskDateTime(right).getTime(),
  );
  const completedTasks = orderedTasks.filter((task) => task.completed).length;
  const pendingTasks = orderedTasks.length - completedTasks;
  const focusMinutes = orderedTasks
    .filter((task) => !task.completed)
    .reduce((total, task) => total + task.focusMinutes, 0);

  return (
    <div className="relative overflow-hidden px-4 py-8 text-slate-50 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-0 top-8 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-sky-500/14 blur-3xl" />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative mx-auto flex max-w-7xl flex-col gap-6"
      >
        <section className="glass-panel rounded-[2rem] border border-white/10 p-6 sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Dashboard creativo de enfoque
              </div>
              <div className="mt-5 flex items-start gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-3 shadow-lg shadow-cyan-950/30">
                  <Image src="/icono.png" alt="Icono Tempo Flow" width={74} height={74} priority />
                </div>
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Tempo Flow
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                    Organiza tareas con fecha y hora, recibe recordatorios y entra en foco con un
                    pomodoro visualmente mas potente.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="mesh-card rounded-[1.5rem] border border-white/10 p-4">
                  <div className="flex items-center gap-3 text-cyan-200">
                    <CalendarClock className="h-5 w-5" />
                    Proxima tarea
                  </div>
                  <p className="mt-4 text-lg font-semibold text-white">
                    {nextTask ? nextTask.title : "Agenda libre"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {nextTask
                      ? formatTaskDate(getTaskDateTime(nextTask))
                      : "Agrega una tarea para empezar a construir tu ritmo."}
                  </p>
                </div>

                <div className="mesh-card rounded-[1.5rem] border border-white/10 p-4">
                  <div className="flex items-center gap-3 text-cyan-200">
                    <CheckCircle2 className="h-5 w-5" />
                    Progreso
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-white">{completedTasks}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    tareas completadas y {pendingTasks} pendientes.
                  </p>
                </div>

                <div className="mesh-card rounded-[1.5rem] border border-white/10 p-4">
                  <div className="flex items-center gap-3 text-cyan-200">
                    <Hourglass className="h-5 w-5" />
                    Bolsa de foco
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-white">{focusMinutes}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    minutos de trabajo planificados para tus siguientes bloques.
                  </p>
                </div>
              </div>
            </div>

            <div className="mesh-card rounded-[1.75rem] border border-white/10 p-5">
              <div className="flex items-center gap-3 text-cyan-100">
                <BellRing className="h-5 w-5" />
                Recordatorios
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">
                {supportsNotifications
                  ? notificationPermission === "granted"
                    ? "Notificaciones activas"
                    : "Activa los avisos"
                  : "No disponibles"}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Las tareas te avisan al llegar la hora exacta. El pomodoro tambien notifica cuando
                toca cambiar de fase.
              </p>
              {supportsNotifications && notificationPermission !== "granted" ? (
                <button
                  onClick={() => void requestPermission()}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  Activar notificaciones
                </button>
              ) : null}
              <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-slate-300">
                <p className="font-medium text-white">Como pensar este componente:</p>
                <p className="mt-2">
                  Muestra el estado del permiso de navegador y dispara la accion de habilitarlo
                  desde un solo lugar para simplificar la experiencia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <TaskComposer onCreateTask={addTask} />
          <PomodoroStudio />
        </section>

        <TaskBoard tasks={orderedTasks} onDeleteTask={deleteTask} onToggleTask={toggleTask} />

        <section className="grid gap-4 md:grid-cols-3">
          <article className="glass-panel rounded-[1.5rem] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cyan-200">
              <Clock3 className="h-5 w-5" />
              Logica del store
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Las tareas viven en Zustand con persistencia local. Eso evita perder la agenda al
              recargar y mantiene sincronizados todos los bloques.
            </p>
          </article>
          <article className="glass-panel rounded-[1.5rem] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cyan-200">
              <Sparkles className="h-5 w-5" />
              Logica del dashboard
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Las metricas salen de ordenar las tareas por fecha. Con esa misma base calculamos la
              proxima tarea, el progreso y el tiempo total pendiente.
            </p>
          </article>
          <article className="glass-panel rounded-[1.5rem] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cyan-200">
              <BellRing className="h-5 w-5" />
              Logica de avisos
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Un hook revisa cada pocos segundos si una tarea llego a su horario. Cuando eso pasa,
              lanza la notificacion y guarda una marca para no repetirla.
            </p>
          </article>
        </section>
      </motion.div>
    </div>
  );
}
