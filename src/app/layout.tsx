import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/figtree";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elev8 Radar",
  description: "Veja como seu cliente encontra, entende e escolhe sua empresa — comparado aos seus concorrentes.",
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
