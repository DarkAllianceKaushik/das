"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Flame, Loader2 } from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";
import { Chip, ChipLabel } from "@heroui/react/chip";
import { Card } from "@heroui/react/card";

export function TrendingStrip() {
  const [scripts, setScripts] = useState<ExternalScript[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/external/trending")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.scripts) && data.scripts.length > 0) {
          setScripts(data.scripts);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;
  if (scripts.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <Flame className="size-5 text-alliance-red" />
          Trending Online Scripts
        </h2>
        <span className="text-xs text-alliance-muted">From ScriptBlox & RScripts</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {scripts.map((s) => (
          <Link
            key={s.id}
            href={`/scripts/external/${s.id}`}
            className="group w-[240px] shrink-0"
          >
            <Card className="h-full overflow-hidden border border-alliance-border bg-alliance-card/80 transition group-hover:border-alliance-red/40">
              {s.imageUrl && (
                <div className="relative h-24 w-full overflow-hidden bg-alliance-black">
                  <img src={s.imageUrl} alt="" className="h-full w-full object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-alliance-card to-transparent" />
                </div>
              )}
              <Card.Content className="p-3">
                <p className="truncate text-sm font-semibold text-white">{s.name}</p>
                <p className="mt-0.5 truncate text-xs text-alliance-muted">{s.game}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Chip
                    variant="soft"
                    size="sm"
                    color={s.source === "scriptblox" ? "accent" : "default"}
                    className={s.source === "rscripts" ? "border-purple-800/40 bg-purple-950/50 text-purple-400" : ""}
                  >
                    <ChipLabel className="text-[10px]">{s.source === "scriptblox" ? "ScriptBlox" : "RScripts"}</ChipLabel>
                  </Chip>
                  <span className="flex items-center gap-1 text-[11px] text-alliance-muted">
                    <Eye className="size-3" /> {s.views.toLocaleString()}
                  </span>
                </div>
              </Card.Content>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
