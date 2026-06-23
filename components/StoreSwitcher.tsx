"use client";

import { Suspense, useState } from "react";
import { StoreClient } from "./StoreClient";
import { OnlineScriptsClient } from "./OnlineScriptsClient";
import type { Script } from "@/lib/types";
import { Globe, Swords, Loader2 } from "lucide-react";

type StoreMode = "alliance" | "online";

interface StoreSwitcherProps {
  scripts: Script[];
  categories: string[];
}

export function StoreSwitcher({ scripts, categories }: StoreSwitcherProps) {
  const [mode, setMode] = useState<StoreMode>("alliance");

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="inline-flex rounded-2xl border border-glass-border bg-glass-dark/60 p-1 backdrop-blur-[16px]">
          <button
            type="button"
            onClick={() => setMode("alliance")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              mode === "alliance"
                ? "bg-glass-accent/20 text-glass-accent-bright shadow-glass-sm border border-glass-accent/30"
                : "text-glass-muted hover:text-white"
            }`}
          >
            <Swords className="h-4 w-4" />
            Dark Alliance Scripts
          </button>
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              mode === "online"
                ? "bg-glass-accent/20 text-glass-accent-bright shadow-glass-sm border border-glass-accent/30"
                : "text-glass-muted hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" />
            Online Scripts
          </button>
        </div>
      </div>

      {mode === "alliance" ? (
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-glass-accent" /></div>}>
          <StoreClient scripts={scripts} categories={categories} />
        </Suspense>
      ) : (
        <OnlineScriptsClient />
      )}
    </div>
  );
}
