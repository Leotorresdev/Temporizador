import "./globals.css";

export const metadata = {
  title: "Temporizador Pomodoro",
  description: "Temporizador Pomodoro con modos de trabajo y descanso.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icono.png",
    shortcut: "/icono.png",
    apple: "/icono.png",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
