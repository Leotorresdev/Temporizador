
import ProductivityDashboard from "@/components/dashboard/ProductivityDashboard";
import PWAInstall from "@/components/PWAInstall";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PWAInstall />
      <ProductivityDashboard />
    </main>
  );
}
