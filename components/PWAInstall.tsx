"use client";

import { useEffect, useState } from "react";
import { BellRing, Download, Smartphone, X } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  // Detectamos si ya corre como app instalada para no duplicar este panel.
  const isStandalone =
    typeof window !== "undefined"
      ? window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true
      : false;

  // iOS requiere instrucciones manuales porque no expone beforeinstallprompt.
  const isIOS =
    typeof window !== "undefined" ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Limpiamos registros viejos y dejamos activo el service worker actual.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map((registration) => {
              if (registration.active?.scriptURL.includes("/sw.js")) {
                return Promise.resolve();
              }

              return registration.unregister();
            }),
          ),
        )
        .then(() => navigator.serviceWorker.register("/sw.js"))
        .catch(() => {
          // no-op
        });
    }

    const beforeInstallPromptHandler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    const showTimeout = window.setTimeout(() => {
      setShowInstall(true);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.clearTimeout(showTimeout);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowInstall(false);
    }
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Chrome")) {
      return "En Chrome abre el menu del navegador y pulsa Instalar aplicacion.";
    }

    if (userAgent.includes("Firefox")) {
      return "En Firefox abre el menu principal y usa Instalar esta aplicacion.";
    }

    if (userAgent.includes("Edg")) {
      return "En Edge usa el icono de aplicacion de la barra o el menu y luego Instalar aplicacion.";
    }

    if (userAgent.includes("Safari")) {
      return "En Safari toca Compartir y luego Agregar a pantalla de inicio.";
    }

    return "Busca la opcion Instalar aplicacion o Agregar a pantalla de inicio en el menu del navegador.";
  };

  if (isStandalone || !showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950/85 p-5 shadow-[0_28px_80px_-40px_rgba(10,16,30,0.88)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 ring-1 ring-cyan-300/20">
          <Smartphone className="h-5 w-5 text-cyan-300" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100">Instala Tempo Flow</h3>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Lleva el dashboard a tu escritorio o movil para abrir tu rutina mas rapido.
          </p>

          <div className="mt-4 space-y-3">
            {installPrompt ? (
              <Button variant="secondary" size="sm" onClick={handleInstall} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Instalar ahora
              </Button>
            ) : (
              <div className="rounded-[1rem] border border-slate-700/70 bg-slate-900/90 p-3 text-sm text-slate-300">
                <p className="mb-2 font-medium text-slate-100">Como instalarla:</p>
                <p>{getBrowserInstructions()}</p>
                {isIOS ? (
                  <p className="mt-2 text-xs text-slate-400">
                    En iOS la app quedara como acceso directo en la pantalla de inicio.
                  </p>
                ) : null}
              </div>
            )}

            <div className="rounded-[1rem] border border-cyan-400/15 bg-cyan-400/8 p-3 text-sm text-cyan-100">
              <div className="flex items-center gap-2 font-medium">
                <BellRing className="h-4 w-4" />
                Mejor para recordatorios
              </div>
              <p className="mt-1 text-cyan-50/80">
                Instalarla hace mas natural seguir tareas, pomodoros y notificaciones.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstall(false)}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
