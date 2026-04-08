import "./globals.css";

export const metadata = {
  title: "Tempo Flow",
  description: "Dashboard creativo con agenda, recordatorios y pomodoro para trabajar con mas enfoque.",
  manifest: "/manifest.json",
  icons: {
    favicon: "/icono.png",
    icon: "/icono.png",
    shortcut: "/icono.png",
    apple: "/icono.png",
  },
};

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
