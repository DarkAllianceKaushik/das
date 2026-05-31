"use client";

import { useState } from "react";
import { StoreClient } from "./StoreClient";
import { OnlineScriptsClient } from "./OnlineScriptsClient";
import type { Script } from "@/lib/types";
import { Globe, Swords } from "lucide-react";

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
        <div className="inline-flex rounded-xl border border-alliance-border bg-alliance-darker p-1">
          <button
            type="button"
            onClick={() => setMode("alliance")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              mode === "alliance"
                ? "bg-alliance-red text-white shadow-glow-sm"
                : "text-alliance-muted hover:text-white"
            }`}
          >
            <Swords className="h-4 w-4" />
            Dark Alliance Scripts
          </button>
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              mode === "online"
                ? "bg-alliance-red text-white shadow-glow-sm"
                : "text-alliance-muted hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" />
            Online Scripts
          </button>
        </div>
      </div>

      {mode === "alliance" ? (
        <StoreClient scripts={scripts} categories={categories} />
      ) : (
        <OnlineScriptsClient />
      )}
    </div>
  );
}
