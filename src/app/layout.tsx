import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/figtree";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elev8 Score",
  description: "Descubra o Score Digital da sua empresa: a nota de 0 a 100 que mostra se o cliente te encontra, entende e escolhe.",
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
