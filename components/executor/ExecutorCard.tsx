"use client";

import { ShieldCheck, ShieldAlert, Wifi, WifiOff, ExternalLink, Disc, Smartphone, Monitor, Apple } from "lucide-react";
import type { Executor } from "@/lib/executor-types";

const platformIcon: Record<string, typeof Monitor> = {
  Windows: Monitor,
  Mac: Apple,
  Android: Smartphone,
};

export function ExecutorCard({ executor }: { executor: Executor }) {
  const Icon = platformIcon[executor.platform] || Monitor;

  return (
    <article className={`card-surface group flex flex-col p-5 transition hover:shadow-glow-sm ${
      executor.detected
        ? "hover:border-red-900/60"
        : executor.updateStatus
        ? "hover:border-emerald-900/60"
        : "hover:border-amber-900/60"
    }`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {executor.updateStatus && !executor.detected && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-800/50">
              <Wifi className="h-3 w-3" /> Working
            </span>
          )}
          {executor.detected && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-950/60 px-2 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-800/50">
              <ShieldAlert className="h-3 w-3" /> Detected
            </span>
          )}
          {!executor.updateStatus && !executor.detected && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-800/50">
              <WifiOff className="h-3 w-3" /> Outdated
            </span>
          )}
          {executor.free ? (
            <span className="rounded-full bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-800/50">Free</span>
          ) : (
            <span className="rounded-full bg-amber-950/60 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-400 ring-1 ring-amber-800/50">Paid</span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-alliance-darker px-2 py-1 text-xs text-alliance-muted">
          <Icon className="h-3 w-3" />
          {executor.platform}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-white transition group-hover:text-alliance-red-bright">
        {executor.title}
        <span className="ml-2 text-sm font-normal text-alliance-muted">v{executor.version}</span>
      </h3>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-alliance-muted">
        {executor.uncStatus && (
          <span className="inline-flex items-center gap-1 rounded bg-alliance-darker px-2 py-0.5">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> UNC
          </span>
        )}
        {executor.decompiler && (
          <span className="inline-flex items-center gap-1 rounded bg-alliance-darker px-2 py-0.5">Decompiler</span>
        )}
        {executor.multiInject && (
          <span className="inline-flex items-center gap-1 rounded bg-alliance-darker px-2 py-0.5">Multi-Inject</span>
        )}
        {executor.raknet && (
          <span className="inline-flex items-center gap-1 rounded bg-alliance-darker px-2 py-0.5">Raknet</span>
        )}
      </div>

      <p className="mt-3 text-xs text-alliance-muted">
        Updated: {executor.updatedDate}
      </p>

      {executor.cost && (
        <p className="mt-1 text-xs text-amber-400">{executor.cost}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {executor.websitelink && (
          <a href={executor.websitelink} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-xs">
            <ExternalLink className="h-3 w-3" /> Website
          </a>
        )}
        {executor.discordlink && (
          <a href={executor.discordlink} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-xs">
            <Disc className="h-3 w-3" /> Discord
          </a>
        )}
        {executor.purchaselink && (
          <a href={executor.purchaselink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-xs">
            <ExternalLink className="h-3 w-3" /> Purchase
          </a>
        )}
      </div>
    </article>
  );
}
