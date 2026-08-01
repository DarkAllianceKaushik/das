"use client";

import { Swords, Youtube } from "lucide-react";
import { DiscordButton } from "./DiscordButton";
import { Button, Separator } from "@heroui/react";
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
    <footer className="relative z-10 mt-auto border-t border-alliance-border/60 bg-alliance-darker/90 backdrop-blur-sm">
      <div className="glow-line" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-alliance-red-bright" />
              <p className="font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
                Dark Alliance
              </p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-alliance-muted/80">
              Curated Roblox scripts for educational purposes. Browse, search, and discover scripts — all in one place.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-alliance-muted">Quick Links</p>
            <div className="flex flex-col gap-2">
              {["/", "/executors", "/obfuscator"].map((href) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs text-alliance-muted/70 transition hover:text-alliance-red-bright"
                >
                  {href === "/" ? "Script Store" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
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
            <p className="mt-3 text-xs text-alliance-muted/60">
              Roblox scripts for educational purposes. Use responsibly.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-alliance-muted/50">
            &copy; {new Date().getFullYear()} Dark Alliance. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-alliance-muted/50">
            <a href="/privacy" className="transition hover:text-alliance-red-bright">Privacy</a>
            <a href="/terms" className="transition hover:text-alliance-red-bright">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
