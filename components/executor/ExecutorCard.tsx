"use client";

import Link from "next/link";
import { ShieldCheck, ShieldAlert, Wifi, WifiOff, ExternalLink, Disc, Smartphone, Monitor, Apple, Cpu, BadgeCheck, KeyRound, Layers } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const platformIcon: Record<string, typeof Monitor> = {
  Windows: Monitor,
  Mac: Apple,
  Android: Smartphone,
};

const extypeLabels: Record<string, string> = {
  wexecutor: "Internal",
  wexternal: "External",
  aexecutor: "Android",
  mexecutor: "Mac",
  iexecutor: "iOS",
};

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ExecutorCard({ executor }: { executor: Executor }) {
  const Icon = platformIcon[executor.platform] || Monitor;
  const slug = toSlug(executor.title);
  const extypeLabel = extypeLabels[executor.extype || ""] || executor.extype || "";
  const hasSunc = typeof executor.suncPercentage === "number";

  return (
    <Link href={`/executors/${slug}`} className="block">
      <Card className={`group flex flex-col p-5 transition hover:shadow-glow-sm ${
        executor.detected
          ? "hover:border-red-900/60"
          : executor.updateStatus
          ? "hover:border-emerald-900/60"
          : "hover:border-amber-900/60"
      }`}>
        <CardContent className="flex flex-col gap-0 p-0">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {executor.updateStatus && !executor.detected && (
                <Badge variant="outline" className="flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 text-emerald-400 ring-1 ring-emerald-800/50">
                  <Wifi className="h-3 w-3" /> Working
                </Badge>
              )}
              {executor.detected && (
                <Badge variant="outline" className="flex items-center gap-1 bg-red-950/60 px-2 py-0.5 text-red-400 ring-1 ring-red-800/50">
                  <ShieldAlert className="h-3 w-3" /> Detected
                </Badge>
              )}
              {!executor.updateStatus && !executor.detected && (
                <Badge variant="outline" className="flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 text-amber-400 ring-1 ring-amber-800/50">
                  <WifiOff className="h-3 w-3" /> Outdated
                </Badge>
              )}
              {executor.free ? (
                <Badge variant="outline" className="bg-emerald-950/60 px-2.5 py-0.5 text-emerald-400 ring-1 ring-emerald-800/50 uppercase tracking-wide">Free</Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-950/60 px-2.5 py-0.5 text-amber-400 ring-1 ring-amber-800/50 uppercase tracking-wide">Paid</Badge>
              )}
              {executor.elementCertified && (
                <Badge variant="outline" className="flex items-center gap-1 bg-sky-950/60 px-2 py-0.5 text-sky-400 ring-1 ring-sky-800/50 text-[10px]">
                  <BadgeCheck className="h-2.5 w-2.5" /> Element
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {extypeLabel && (
                <span className="rounded-md bg-glass-darker px-2 py-1 text-[10px] text-glass-muted">{extypeLabel}</span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-glass-darker px-2 py-1 text-xs text-glass-muted">
                <Icon className="h-3 w-3" />
                {executor.platform}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {executor.slug?.logo && (
              <img src={executor.slug.logo} alt="" className="h-10 w-10 rounded-lg object-contain bg-glass-darker" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold text-white transition group-hover:text-glass-accent-bright">
                {executor.title}
                <span className="ml-2 text-sm font-normal text-glass-muted">v{executor.version}</span>
              </h3>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-glass-muted">
            {executor.uncStatus && (
              <span className="inline-flex items-center gap-1 rounded bg-glass-darker px-2 py-0.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> UNC
              </span>
            )}
            {executor.decompiler && (
              <span className="inline-flex items-center gap-1 rounded bg-glass-darker px-2 py-0.5">Decompiler</span>
            )}
            {executor.multiInject && (
              <span className="inline-flex items-center gap-1 rounded bg-glass-darker px-2 py-0.5">Multi-Inject</span>
            )}
            {executor.raknet && (
              <span className="inline-flex items-center gap-1 rounded bg-glass-darker px-2 py-0.5">Raknet</span>
            )}
            {executor.clientmods && (
              <span className="inline-flex items-center gap-1 rounded bg-glass-darker px-2 py-0.5">Client Mods</span>
            )}
            {executor.keysystem && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-950/50 px-2 py-0.5 text-amber-400">
                <KeyRound className="h-2.5 w-2.5" /> Key System
              </span>
            )}
          </div>

          {hasSunc && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-glass-muted">
                <span>sUNC</span>
                <span>{executor.suncPercentage}%</span>
              </div>
              <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-glass-darker">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
                  style={{ width: `${executor.suncPercentage}%` }}
                />
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-glass-muted">
            Updated: {executor.updatedDate}
          </p>

          {executor.cost && (
            <p className="mt-1 text-xs text-amber-400">{executor.cost}</p>
          )}

          {executor.detected && executor.detectionReason && (
            <p className="mt-1 text-[10px] text-red-400/70">{executor.detectionReason}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {executor.websitelink && (
              <Button variant="secondary" size="sm" render={<a href={executor.websitelink} target="_blank" rel="noopener noreferrer" onClick={(e: React.MouseEvent) => e.stopPropagation()} />} className="flex-1 text-xs">
                <ExternalLink className="h-3 w-3" /> Website
              </Button>
            )}
            {executor.discordlink && (
              <Button variant="secondary" size="sm" render={<a href={executor.discordlink} target="_blank" rel="noopener noreferrer" onClick={(e: React.MouseEvent) => e.stopPropagation()} />} className="flex-1 text-xs">
                <Disc className="h-3 w-3" /> Discord
              </Button>
            )}
            {executor.purchaselink && (
              <Button variant="default" size="sm" render={<a href={executor.purchaselink} target="_blank" rel="noopener noreferrer" onClick={(e: React.MouseEvent) => e.stopPropagation()} />} className="flex-1 text-xs">
                <ExternalLink className="h-3 w-3" /> Purchase
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}