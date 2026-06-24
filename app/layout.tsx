import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Darky } from "@/components/Darky";
import { SmoothScroll } from "@/components/SmoothScroll";
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
        <div className="fixed inset-0 bg-noise pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-glass-accent-dim/10 via-glass-black to-glass-dark/80 pointer-events-none animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)] pointer-events-none" />
        <div className="fixed left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-glass-accent/5 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-glass-accent/8 blur-[100px] pointer-events-none" />
        <SmoothScroll>
          <Header discordUrl={discordUrl} />
          <main className="relative flex-1">{children}</main>
          <Darky />
          <Footer discordUrl={discordUrl} />
        </SmoothScroll>
      </body>
    </html>
  );
}
