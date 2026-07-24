"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Disc, CreditCard, Check, X, Shield, Wifi, Download, Code2, Cpu, Layers } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  executor: Executor;
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${
        ok
          ? "border-emerald-800/40 bg-emerald-950/50 text-emerald-400"
          : "border-red-800/40 bg-red-950/50 text-red-400"
      }`}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </Badge>
  );
}

export function ExecutorDetailClient({ executor }: Props) {
  const e = executor;

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/executors" className="mb-6 inline-flex items-center gap-1.5 text-sm text-glass-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Executors
      </Link>

      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-glass-accent/20 ring-1 ring-glass-accent/40">
                  <Wifi className="h-6 w-6 text-glass-accent-bright" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{e.title}</h1>
                  <p className="text-sm text-glass-muted">v{e.version}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge ok={!e.detected} label={e.detected ? "Detected" : "Undetected"} />
                <StatusBadge ok={e.uncStatus} label="UNC" />
                <StatusBadge ok={e.updateStatus} label="Up to Date" />
                {e.multiInject && <StatusBadge ok label="Multi Inject" />}
                {e.decompiler && <StatusBadge ok label="Decompiler" />}
                {e.raknet && <StatusBadge ok label="RakNet" />}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold ${
                  e.cost === "Free" || e.free
                    ? "border-emerald-800/40 bg-emerald-950/50 text-emerald-400"
                    : "border-amber-800/40 bg-amber-950/50 text-amber-400"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                {e.cost || (e.free ? "Free" : "Paid")}
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 bg-glass-dark px-3 py-1 text-xs text-glass-muted"
              >
                <Globe className="h-3 w-3" />
                {e.platform}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {e.websitelink && (
              <Button variant="secondary" render={<a href={e.websitelink} target="_blank" rel="noopener noreferrer" />} className="justify-center gap-2 text-sm">
                <Globe className="h-4 w-4" /> Website
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            {e.discordlink && (
              <Button variant="secondary" render={<a href={e.discordlink} target="_blank" rel="noopener noreferrer" />} className="justify-center gap-2 text-sm">
                <Disc className="h-4 w-4" /> Discord
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            {e.purchaselink && (
              <Button variant="default" render={<a href={e.purchaselink} target="_blank" rel="noopener noreferrer" />} className="justify-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" /> Purchase
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-glass-muted">Details</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Platform</dt>
              <dd className="mt-1 text-sm text-white">{e.platform || "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Version</dt>
              <dd className="mt-1 text-sm text-white">{e.version || "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Last Updated</dt>
              <dd className="mt-1 text-sm text-white">{e.updatedDate ? new Date(e.updatedDate).toLocaleDateString() : "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Type</dt>
              <dd className="mt-1 text-sm text-white">{e.type || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
