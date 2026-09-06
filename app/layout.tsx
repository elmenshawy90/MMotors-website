import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const hud = JetBrains_Mono({
  variable: "--font-hud",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Modern Motors | Nissan Sales & Service Center — Egypt",
  description:
    "Modern Motors — Egypt's authorized Nissan provider. New Nissan models, genuine parts, and factory-certified maintenance in Cairo, Giza & Alexandria. Book service in 60 seconds.",
  keywords: ["Nissan Egypt", "Modern Motors", "car maintenance Cairo", "Nissan service", "Nissan Patrol Egypt"],
  openGraph: {
    title: "Modern Motors — Nissan, Mastered in Egypt",
    description: "Sales • Genuine Parts • Factory Service. 35+ years keeping Egypt moving.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${hud.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-asphalt text-platinum">{children}</body>
    </html>
  );
}
