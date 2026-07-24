import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getScriptsData } from "@/lib/scripts";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getScriptsData();
  const discordUrl = settings.discordUrl;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dark Alliance Script Store",
    url: "https://das-vert.vercel.app",
    description: "Premium Roblox scripts — browse, search, and discover curated scripts.",
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-b from-alliance-red/[0.03] via-transparent to-transparent pointer-events-none" />
        <Header discordUrl={discordUrl} />
        <main className="relative flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer discordUrl={discordUrl} />
      </body>
    </html>
  );
}
