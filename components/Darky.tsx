"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";

const tips: Record<string, { title: string; messages: string[] }> = {
  "/": {
    title: "🏠 Home",
    messages: [
      "Welcome to Dark Alliance! Browse curated scripts or switch to Online mode for live results!",
      "Use the search bar to find scripts fast. Try typing 'admin' or 'combat'!",
      "Click a script card to see details, copy code, or favorite it ⭐",
      "Toggle between Alliance and Online tabs to discover new scripts!",
    ],
  },
  "/executors": {
    title: "⚡ Executors",
    messages: [
      "Check which Roblox executors are working or detected right now!",
      "Use the filters to find executors by platform, status, or price.",
      "Click any executor to see its details and download links!",
    ],
  },
  "/obfuscator": {
    title: "🔒 Obfuscator",
    messages: [
      "Paste your Lua script and make it unreadable! Protects your code from skids 🛡️",
      "Try the presets — 'Max Protection' is great for serious scripts!",
      "VM Encoder mode makes your script super hard to reverse-engineer!",
    ],
  },
  "/admin": {
    title: "🔐 Admin",
    messages: [
      "⚠️ Only for the store owner! Manage scripts, categories, and settings here.",
      "Add new scripts, edit existing ones, or remove outdated ones.",
      "Update the Discord link and manage categories from the dashboard.",
    ],
  },
};

const defaultTips: { title: string; messages: string[] } = {
  title: "💡 Tip",
  messages: [
    "Hey! I'm Darky 👋 Explore the site and find awesome Roblox scripts!",
    "Check out the Executors page to see which ones are working!",
    "Try the Obfuscator to protect your Lua scripts!",
    "Join the Discord for updates and community!",
  ],
};

function getPageTips(pathname: string) {
  if (pathname === "/") return tips["/"];
  if (pathname.startsWith("/executors")) return tips["/executors"];
  if (pathname.startsWith("/obfuscator")) return tips["/obfuscator"];
  if (pathname.startsWith("/admin")) return tips["/admin"];
  if (pathname.startsWith("/scripts")) {
    return {
      title: "📜 Script Details",
      messages: [
        "View script details, read the description, and check its tags!",
        "Hit the heart ❤️ to favorite a script and find it later!",
        "Click Download to get the script — some are free, some are paid!",
      ],
    };
  }
  return defaultTips;
}

export function Darky() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [wave, setWave] = useState(false);

  const pageTips = getPageTips(pathname);
  const currentTip = pageTips.messages[tipIndex % pageTips.messages.length];

  useEffect(() => {
    setTipIndex(0);
    setDismissed(false);
    setIsOpen(true);
    setWave(true);
    const w = setTimeout(() => setWave(false), 1500);
    return () => clearTimeout(w);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => setIsOpen(true), 30000);
    return () => clearTimeout(t);
  }, [isOpen]);

  const nextTip = useCallback(() => {
    setTipIndex((i) => i + 1);
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="relative animate-fade-in">
          <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 rounded-sm bg-alliance-dark" />
          <div className="max-w-[260px] rounded-2xl border border-alliance-border bg-alliance-dark p-3 shadow-glass backdrop-blur-[24px] sm:max-w-[300px]">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-alliance-red-bright">
                <Sparkles className="h-3 w-3" />
                {pageTips.title}
              </span>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-lg p-0.5 text-alliance-muted transition hover:bg-alliance-black hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-alliance-muted">
              {currentTip}
            </p>
            {pageTips.messages.length > 1 && (
              <button
                onClick={nextTip}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-alliance-red-bright/70 transition hover:text-alliance-red-bright"
              >
                More tips <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => { setIsOpen(!isOpen); setDismissed(false); }}
        className={`group relative h-14 w-14 rounded-full border-2 border-alliance-red/40 bg-alliance-darker shadow-glass-sm backdrop-blur-[16px] transition-all hover:border-alliance-red-bright/60 hover:shadow-glass hover:scale-110 active:scale-95 ${wave ? "animate-wave" : ""}`}
        title={isOpen ? "Hide Darky" : "Hey! Click me!"}
      >
        <div className="absolute inset-0 animate-pulse-slow rounded-full bg-gradient-to-br from-alliance-red/10 to-transparent" />
        <div className="relative flex h-full w-full items-center justify-center">
          <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
            <circle cx="24" cy="24" r="22" className="fill-alliance-crimson/30 stroke-alliance-red/50" strokeWidth="2" />
            <ellipse cx="24" cy="32" rx="10" ry="7" className="fill-alliance-black/60 stroke-alliance-red/40" strokeWidth="1.5" />
            <circle cx="19" cy="22" r="2.5" fill="#fff" />
            <circle cx="29" cy="22" r="2.5" fill="#fff" />
            <circle cx="19" cy="22" r="1.2" className="fill-alliance-red-bright" />
            <circle cx="29" cy="22" r="1.2" className="fill-alliance-red-bright" />
            <path d="M18 30 Q24 36 30 30" className="stroke-alliance-red-bright/60" strokeWidth="2" strokeLinecap="round" fill="none" />
            <g className={wave ? "animate-wave-hand" : ""} style={{ transformOrigin: "20px 22px" }}>
              <path d="M10 20 Q8 16 12 14" className="stroke-alliance-red/40" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-alliance-red text-[10px] font-bold text-white shadow-sm">
          D
        </span>
      </button>
    </div>
  );
}
