"use client";

import Link from "next/link";
import { ShieldCheck, ShieldAlert, Wifi, WifiOff, ExternalLink, Disc, Smartphone, Monitor, Apple, Cpu, BadgeCheck, KeyRound, Layers } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Button, Card, Chip } from "@heroui/react";

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
    <Card className={`group flex flex-col p-5 transition hover:shadow-glow-sm ${
      executor.detected
        ? "hover:border-red-900/60"
        : executor.updateStatus
        ? "hover:border-emerald-900/60"
        : "hover:border-amber-900/60"
    }`}>
      <Card.Content className="flex flex-col gap-0 p-0">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {executor.updateStatus && !executor.detected && (
              <Chip color="success" variant="soft" size="sm" className="bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-800/50">
                <Wifi className="h-3 w-3" /> Working
              </Chip>
            )}
            {executor.detected && (
              <Chip color="danger" variant="soft" size="sm" className="bg-red-950/60 text-red-400 ring-1 ring-red-800/50">
                <ShieldAlert className="h-3 w-3" /> Detected
              </Chip>
            )}
            {!executor.updateStatus && !executor.detected && (
              <Chip color="warning" variant="soft" size="sm" className="bg-amber-950/60 text-amber-400 ring-1 ring-amber-800/50">
                <WifiOff className="h-3 w-3" /> Outdated
              </Chip>
            )}
            {executor.free ? (
              <Chip color="success" variant="soft" size="sm" className="bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-800/50 uppercase tracking-wide">
                Free
              </Chip>
            ) : (
              <Chip color="warning" variant="soft" size="sm" className="bg-amber-950/60 text-amber-400 ring-1 ring-amber-800/50 uppercase tracking-wide">
                Paid
              </Chip>
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

          {executor.possibleBanwave && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-950/50 px-2 py-0.5 text-[10px] font-semibold text-red-400 ring-1 ring-red-900/60">
              <ShieldAlert className="h-3 w-3" /> Possible Banwave
            </span>
          )}
          {executor.unknown && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold text-amber-400 ring-1 ring-amber-900/60">
              <WifiOff className="h-3 w-3" /> Unknown Status
            </span>
          )}

        <p className="mt-3 text-xs text-alliance-muted">
          Updated: {executor.updatedDate}
        </p>

          {executor.detected && executor.detectionReason && (
            <p className="mt-1 text-[10px] text-rose-400/70">{executor.detectionReason}</p>
          )}

        <div className="mt-4 flex flex-wrap gap-2">
          {executor.websitelink && (
            <a
              href={executor.websitelink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm flex-1"
            >
              <ExternalLink className="h-3 w-3" /> Website
            </a>
          )}
          {executor.discordlink && (
            <a
              href={executor.discordlink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm flex-1"
            >
              <Disc className="h-3 w-3" /> Discord
            </a>
          )}
          {executor.purchaselink && (
            <a
              href={executor.purchaselink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-sm flex-1"
            >
              <ExternalLink className="h-3 w-3" /> Purchase
            </a>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}