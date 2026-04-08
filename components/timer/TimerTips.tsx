interface TimerTipsProps {
  completedSessions: number;
  notificationEnabled: boolean;
}

export default function TimerTips({ completedSessions, notificationEnabled }: TimerTipsProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-slate-300 shadow-[0_30px_90px_-50px_rgba(59,130,246,0.7)]">
      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Estado Pomodoro</p>
      <div className="mt-3 flex flex-col gap-4">
        {/* Muestra cuántas sesiones ya completó el usuario */}
        <div className="rounded-3xl bg-slate-950/90 p-4 text-slate-200 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sesiones completadas</p>
          <p className="mt-2 text-3xl font-semibold text-white">{completedSessions}</p>
        </div>

        {/* Muestra si las notificaciones están habilitadas */}
        <div className="rounded-3xl bg-slate-950/90 p-4 text-slate-200 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notificaciones</p>
          <p className="mt-2 text-base text-slate-200">
            {notificationEnabled
              ? "Las alertas están activas y avisarán cuando termine la sesión."
              : "Activa las notificaciones para recibir alertas al finalizar cada sesión."}
          </p>
        </div>
      </div>
    </div>
  );
}
