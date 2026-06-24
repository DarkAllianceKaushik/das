import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Darky } from "@/components/Darky";
import { getScriptsData } from "@/lib/scripts";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getScriptsData();
  const discordUrl = settings.discordUrl;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-dot-grid pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-glass-accent-dim/10 via-glass-black to-glass-dark/80 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)] pointer-events-none" />
        <Header discordUrl={discordUrl} />
        <main className="relative flex-1">{children}</main>
        <Darky />
        <Footer discordUrl={discordUrl} />
      </body>
    </html>
  );
}
