
import PWAInstall from "@/components/PWAInstall";
import ModernPomodoro from "@/components/timer/ModernPomodoro";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PWAInstall />
      <ModernPomodoro />
    </main>
  );
}
