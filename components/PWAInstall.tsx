"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [installHint, setInstallHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // no-op
      });
    }

    const beforeInstallPromptHandler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    const hintTimeout = window.setTimeout(() => {
      setInstallHint(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.clearTimeout(hintTimeout);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowButton(false);
    }
  };

  if (!showButton && !installHint) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-4 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.75)] backdrop-blur-xl">
      <p className="text-sm font-medium text-slate-100">
        Instala el temporizador en tu escritorio para usarlo como una app.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {showButton ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={handleInstall}>
              Instalar app
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowButton(false)}>
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-slate-700/70 bg-slate-900/90 p-3 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Opción manual:</p>
            <p className="mt-2">
              Si no aparece el mensaje de instalación, abre el menú del navegador y busca <strong>Instalar aplicación</strong> o <strong>Añadir a escritorio</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
