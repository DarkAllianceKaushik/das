"use client";

import { Suspense, useState } from "react";
import { StoreClient } from "./StoreClient";
import { OnlineScriptsClient } from "./OnlineScriptsClient";
import type { Script } from "@/lib/types";
import { Globe, Swords, Loader2 } from "lucide-react";
import { Tabs } from "@heroui/react";

type StoreMode = "alliance" | "online";

interface StoreSwitcherProps {
  scripts: Script[];
  categories: string[];
}

export function StoreSwitcher({ scripts, categories }: StoreSwitcherProps) {
  const [mode, setMode] = useState<StoreMode>("alliance");

  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(key) => setMode(key as StoreMode)}
      className="w-full"
    >
      <div className="flex justify-center">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Store sources"
            className="rounded-2xl border border-alliance-border bg-alliance-dark/60 p-1 backdrop-blur-[16px]"
          >
            <Tabs.Tab id="alliance" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
              <Swords className="h-4 w-4" />
              Dark Alliance Scripts
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="online" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
              <Globe className="h-4 w-4" />
              Online Scripts
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </div>

      <Tabs.Panel id="alliance" className="pt-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-alliance-red" /></div>}>
          <StoreClient scripts={scripts} categories={categories} />
        </Suspense>
      </Tabs.Panel>
      <Tabs.Panel id="online" className="pt-8">
        <OnlineScriptsClient />
      </Tabs.Panel>
    </Tabs>
  );
}
