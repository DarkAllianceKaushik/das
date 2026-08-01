"use client";

import { ExternalLink, Swords, Youtube } from "lucide-react";
import { DiscordButton } from "./DiscordButton";
import { Separator } from "@heroui/react";
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
    <footer className="relative z-10 mt-auto border-t border-alliance-border/60 bg-alliance-darker/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-alliance-red/10 ring-1 ring-alliance-red/30">
                <Swords className="h-4 w-4 text-alliance-red-bright" />
              </div>
              <p className="font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
                Dark Alliance
              </p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-alliance-muted/70">
              Curated Roblox scripts for educational purposes. Browse, search, and discover scripts — all in one place.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-alliance-muted">Quick Links</p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Script Store" },
                { href: "/executors", label: "Executors" },
                { href: "/obfuscator", label: "Obfuscator" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-alliance-muted/60 transition hover:text-alliance-red-bright"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="size-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-alliance-muted">Community</p>
            <div className="flex flex-col items-start gap-2">
              {discordUrl && <DiscordButton discordUrl={discordUrl} />}
              <a
                href="https://youtube.com/@darkalliancekaushik"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs font-semibold"
              >
                <Youtube className="h-4 w-4" />
                YouTube Channel
              </a>
            </div>
            <p className="mt-4 text-xs text-alliance-muted/40">
              Roblox scripts for educational purposes. Use responsibly.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-alliance-muted/40">
            &copy; {new Date().getFullYear()} Dark Alliance. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-alliance-muted/40">
            <a href="/privacy" className="transition hover:text-alliance-red-bright">Privacy</a>
            <a href="/terms" className="transition hover:text-alliance-red-bright">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
