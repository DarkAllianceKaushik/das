"use client";

import { Swords, Youtube, ExternalLink } from "lucide-react";
import { DiscordButton } from "./DiscordButton";
import { useEffect, useState } from "react";

export function Footer() {
  const [discordUrl, setDiscordUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setDiscordUrl(data.discordUrl || ""))
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-10 mt-auto border-t border-glass-border/60 bg-alliance-darker/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-glass-accent/10 ring-1 ring-glass-accent/30">
                <Swords className="h-4 w-4 text-glass-accent-bright" />
              </div>
              <p className="font-display text-sm font-bold uppercase tracking-widest text-glass-accent-bright">
                Dark Alliance
              </p>
            </div>
            <p className="text-sm leading-relaxed text-glass-muted/70 max-w-xs">
              Curated Roblox scripts for educational purposes. Browse, search, and discover scripts — all in one place.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-glass-muted">Quick Links</p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Script Store" },
                { href: "/executors", label: "Executors" },
                { href: "/obfuscator", label: "Obfuscator" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-glass-muted/60 transition hover:text-glass-accent-bright"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="size-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-glass-muted">Community</p>
            <div className="flex flex-col gap-2.5">
              {discordUrl && <DiscordButton discordUrl={discordUrl} />}
              <a
                href="https://youtube.com/@darkalliancekaushik"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-glass-border/50 bg-alliance-dark/50 px-4 py-2.5 text-sm font-medium text-glass-muted transition-all hover:border-rose-500/40 hover:bg-rose-950/20 hover:text-rose-400"
              >
                <Youtube className="size-4" />
                YouTube Channel
                <ExternalLink className="size-3 ml-auto opacity-0 transition group-hover:opacity-100" />
              </a>
            </div>
            <p className="mt-4 text-xs text-glass-muted/40">
              Roblox scripts for educational purposes. Use responsibly.
            </p>
          </div>
        </div>

        <div className="glow-line mt-10 mb-6" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-glass-muted/40">
            &copy; {new Date().getFullYear()} Dark Alliance. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-glass-muted/40">
            <a href="/privacy" className="transition hover:text-glass-accent-bright">Privacy</a>
            <a href="/terms" className="transition hover:text-glass-accent-bright">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}