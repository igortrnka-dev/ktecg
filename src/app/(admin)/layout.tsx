import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./admin.css";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const display = Inter_Tight({ subsets: ["latin", "latin-ext"], weight: ["600"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KTechnology – obchod a leady",
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
