import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Dark Alliance Script Store",
    template: "%s | Dark Alliance Script Store",
  },
  description:
    "Premium Roblox scripts — browse curated scripts by category, tags, and free or paid access. Featuring live search from ScriptBlox & RScripts, executors, and a Lua obfuscator.",
  keywords: ["roblox", "scripts", "dark alliance", "executor", "lua", "obfuscator"],
  authors: [{ name: "Dark Alliance" }],
  creator: "Dark Alliance",
  metadataBase: new URL("https://das-vert.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Dark Alliance Script Store",
    title: "Dark Alliance Script Store",
    description: "Premium Roblox scripts — browse, search, and discover curated scripts.",
    url: "https://das-vert.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Alliance Script Store",
    description: "Premium Roblox scripts — browse, search, and discover curated scripts.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dark Alliance Script Store",
  url: "https://das-vert.vercel.app",
  description: "Premium Roblox scripts — browse, search, and discover curated scripts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-alliance-black font-body min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-b from-alliance-red/[0.03] via-transparent to-transparent pointer-events-none" />
        <Header />
        <main className="relative flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
