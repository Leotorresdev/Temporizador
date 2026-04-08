"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { CalendarDays, PencilLine, Plus, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskComposerProps {
  onCreateTask: (draft: {
    title: string;
    date: string;
    time: string;
    notes?: string;
    focusMinutes?: number;
  }) => void;
}

const getNowDate = () => new Date().toISOString().slice(0, 10);
const getNowTime = () => new Date().toTimeString().slice(0, 5);

export default function TaskComposer({ onCreateTask }: TaskComposerProps) {
  // El formulario usa estado local porque son datos temporales hasta que el usuario confirma.
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getNowDate);
  const [time, setTime] = useState(getNowTime);
  const [notes, setNotes] = useState("");
  const [focusMinutes, setFocusMinutes] = useState("25");

  const canSubmit = useMemo(() => Boolean(title.trim() && date && time), [date, time, title]);

  const resetForm = () => {
    setTitle("");
    setDate(getNowDate());
    setTime(getNowTime());
    setNotes("");
    setFocusMinutes("25");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    onCreateTask({
      title,
      date,
      time,
      notes,
      focusMinutes: Number(focusMinutes) || 25,
    });

    resetForm();
  };

  return (
    <section className="glass-panel rounded-[2rem] border border-white/10 p-6">
      <div className="flex items-center gap-3 text-cyan-100">
        <PencilLine className="h-5 w-5" />
        <div>
          <h2 className="text-2xl font-semibold text-white">Crear tarea con hora exacta</h2>
          <p className="text-sm text-slate-300">
            Este componente prepara los datos antes de enviarlos al store persistente.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Titulo</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Disenar landing para cliente"
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white placeholder:text-slate-500"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
              <CalendarDays className="h-4 w-4" />
              Fecha
            </span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
              <TimerReset className="h-4 w-4" />
              Hora
            </span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Notas o contexto</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Que necesitas tener listo antes de empezar"
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Minutos sugeridos de enfoque
          </span>
          <input
            type="number"
            min="5"
            max="240"
            step="5"
            value={focusMinutes}
            onChange={(event) => setFocusMinutes(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white"
          />
        </label>

        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-slate-300">
          <p className="font-medium text-white">Que aprender de este flujo:</p>
          <p className="mt-2">
            Primero capturas y validas inputs localmente. Luego delegas el guardado al store global
            para mantener responsabilidades claras.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="h-11 rounded-2xl px-5" disabled={!canSubmit}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar tarea
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl px-5"
            onClick={resetForm}
          >
            Limpiar
          </Button>
        </div>
      </form>
    </section>
  );
}
