import { Button } from "../ui/button";
import { timerModes, type TimerMode } from "@/lib/usePomodoroTimer";

interface TimerModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  disabled: boolean;
}

export default function TimerModeSelector({ currentMode, onSelectMode, disabled }: TimerModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(timerModes) as TimerMode[]).map((mode) => {
        const modeData = timerModes[mode];
        const active = mode === currentMode;

        return (
          <Button
            key={mode}
            variant={active ? "secondary" : "outline"}
            size="sm"
            className="justify-center text-sm"
            onClick={() => onSelectMode(mode)}
            disabled={disabled}
          >
            {/* Cada botón selecciona un modo de Pomodoro diferente */}
            {modeData.label}
          </Button>
        );
      })}
    </div>
  );
}
