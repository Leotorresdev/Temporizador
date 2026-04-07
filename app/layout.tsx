import "./globals.css";

export const metadata = {
  title: "Temporizador Pomodoro",
  description: "Temporizador Pomodoro con modos de trabajo y descanso.",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    icon: "/tempo.png",
  },
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
