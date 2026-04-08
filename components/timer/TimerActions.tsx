import { Pause, Play, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

interface TimerActionsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  activeModeLabel: string;
}

export default function TimerActions({
  isRunning,
  onToggle,
  onReset,
  resetDisabled,
  activeModeLabel,
}: TimerActionsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {/* Botón principal para iniciar/pausar la sesión */}
      <Button variant={isRunning ? "destructive" : "default"} size="lg" onClick={onToggle}>
        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isRunning ? "Pausar" : activeModeLabel === "Pomodoro" ? "Iniciar" : "Iniciar sesión"}
      </Button>

      {/* Botón para resetear el temporizador al estado inicial del modo actual */}
      <Button variant="outline" size="lg" onClick={onReset} disabled={resetDisabled}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Resetear
      </Button>
    </div>
  );
}
