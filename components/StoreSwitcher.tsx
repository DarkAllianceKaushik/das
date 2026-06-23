"use client";

import { Suspense, useState } from "react";
import { StoreClient } from "./StoreClient";
import { OnlineScriptsClient } from "./OnlineScriptsClient";
import type { Script } from "@/lib/types";
import { Globe, Swords, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs value={mode} onValueChange={(v) => setMode(v as StoreMode)} className="w-auto">
          <TabsList className="rounded-2xl border border-glass-border bg-glass-dark/60 p-1 backdrop-blur-[16px]">
            <TabsTrigger value="alliance" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-glass-accent/20 data-[state=active]:text-glass-accent-bright data-[state=active]:shadow-glass-sm data-[state=active]:border data-[state=active]:border-glass-accent/30">
              <Swords className="h-4 w-4" />
              Dark Alliance Scripts
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-glass-accent/20 data-[state=active]:text-glass-accent-bright data-[state=active]:shadow-glass-sm data-[state=active]:border data-[state=active]:border-glass-accent/30">
              <Globe className="h-4 w-4" />
              Online Scripts
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
