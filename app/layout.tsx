import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Dark Alliance Script Store",
  description:
    "Premium Roblox scripts — browse by category, tags, and free or paid access.",
  keywords: ["roblox", "scripts", "dark alliance", "executor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-grid-red bg-[length:48px_48px] pointer-events-none opacity-60" />
        <div className="fixed inset-0 bg-gradient-to-b from-alliance-red/5 via-transparent to-transparent pointer-events-none" />
        <Header />
        <main className="relative flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
