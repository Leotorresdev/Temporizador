

import PWAInstall from "../components/PWAInstall";
import TimerDisplay from "../components/timer/TimerDisplay";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PWAInstall />
      <TimerDisplay />
    </main>
  );
}
