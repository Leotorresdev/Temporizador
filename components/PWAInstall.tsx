"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Download, X, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  const isStandalone = typeof window !== "undefined" ? (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  ) : false;

  const isIOS = typeof window !== "undefined" ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false;

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
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    // Mostrar el prompt después de 2 segundos si no se ha mostrado automáticamente
    const showTimeout = setTimeout(() => {
      setShowInstall(true);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      clearTimeout(showTimeout);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowInstall(false);
    }
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Chrome")) {
      return "En Chrome: haz clic en el ícono de instalación (⊕) en la barra de direcciones, o ve a ⋮ → Instalar aplicación.";
    }

    if (userAgent.includes("Firefox")) {
      return "En Firefox: ve a ⋮ → Instalar esta aplicación...";
    }

    if (userAgent.includes("Edge")) {
      return "En Edge: haz clic en el ícono de aplicación en la barra de direcciones, o ve a ⋮ → Instalar aplicación.";
    }

    if (userAgent.includes("Safari")) {
      return "En Safari: toca el botón Compartir → Agregar a pantalla de inicio.";
    }

    return "Busca la opción 'Instalar aplicación' o 'Agregar a pantalla de inicio' en el menú de tu navegador.";
  };

  if (isStandalone || !showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.75)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
            <Monitor className="h-5 w-5 text-cyan-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100">Instala la aplicación</h3>
          <p className="mt-1 text-sm text-slate-300">
            Convierte este temporizador en una aplicación nativa para usarlo sin navegador.
          </p>

          <div className="mt-4 space-y-3">
            {installPrompt ? (
              <Button variant="secondary" size="sm" onClick={handleInstall} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Instalar ahora
              </Button>
            ) : (
              <div className="rounded-[1rem] border border-slate-700/70 bg-slate-900/90 p-3 text-sm text-slate-300">
                <p className="font-medium text-slate-100 mb-2">Instrucciones para tu navegador:</p>
                <p>{getBrowserInstructions()}</p>
                {isIOS && (
                  <p className="mt-2 text-xs text-slate-400">
                    Nota: En iOS, la aplicación se instalará en la pantalla de inicio.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstall(false)}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}