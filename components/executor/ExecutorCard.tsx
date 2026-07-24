"use client";

import { ShieldCheck, ShieldAlert, Wifi, WifiOff, ExternalLink, Disc, Smartphone, Monitor, Apple } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const platformIcon: Record<string, typeof Monitor> = {
  Windows: Monitor,
  Mac: Apple,
  Android: Smartphone,
};

export function ExecutorCard({ executor }: { executor: Executor }) {
  const Icon = platformIcon[executor.platform] || Monitor;

  return (
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
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-glass-darker px-2 py-1 text-xs text-glass-muted">
            <Icon className="h-3 w-3" />
            {executor.platform}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-white transition group-hover:text-glass-accent-bright">
          {executor.title}
          <span className="ml-2 text-sm font-normal text-glass-muted">v{executor.version}</span>
        </h3>

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
        </div>

        <p className="mt-3 text-xs text-glass-muted">
          Updated: {executor.updatedDate}
        </p>

        {executor.cost && (
          <p className="mt-1 text-xs text-amber-400">{executor.cost}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {executor.websitelink && (
            <Button variant="secondary" size="sm" render={<a href={executor.websitelink} target="_blank" rel="noopener noreferrer" />} className="flex-1 text-xs">
              <ExternalLink className="h-3 w-3" /> Website
            </Button>
          )}
          {executor.discordlink && (
            <Button variant="secondary" size="sm" render={<a href={executor.discordlink} target="_blank" rel="noopener noreferrer" />} className="flex-1 text-xs">
              <Disc className="h-3 w-3" /> Discord
            </Button>
          )}
          {executor.purchaselink && (
            <Button variant="default" size="sm" render={<a href={executor.purchaselink} target="_blank" rel="noopener noreferrer" />} className="flex-1 text-xs">
              <ExternalLink className="h-3 w-3" /> Purchase
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
