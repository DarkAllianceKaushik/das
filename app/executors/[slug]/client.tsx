"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Disc, CreditCard, Check, X, Shield, Wifi, Download, Code2, Cpu, Layers, BadgeCheck, KeyRound, Terminal, AlertTriangle } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  executor: Executor;
}

const extypeLabels: Record<string, string> = {
  wexecutor: "Internal Executor",
  wexternal: "External Executor",
  aexecutor: "Android Executor",
  mexecutor: "Mac Executor",
  iexecutor: "iOS Executor",
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${
        ok
          ? "border-amber-800/40 bg-amber-950/50 text-amber-400"
          : "border-rose-800/40 bg-rose-950/50 text-rose-400"
      }`}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </Badge>
  );
}

export function ExecutorDetailClient({ executor }: Props) {
  const e = executor;
  const extypeLabel = extypeLabels[e.extype || ""] || e.extype || "N/A";

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/executors" className="mb-6 inline-flex items-center gap-1.5 text-sm text-glass-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Executors
      </Link>

      <Card className="mb-8 overflow-hidden">
        {e.slug?.logo && (
          <div className="relative h-40 w-full bg-gradient-to-b from-glass-darker to-glass-card sm:h-56">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={e.slug.logo} alt="" className="h-28 w-28 object-contain sm:h-40 sm:w-40" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-glass-card via-transparent to-transparent" />
          </div>
        )}

        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                {!e.slug?.logo && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-glass-accent/20 ring-1 ring-glass-accent/40">
                    <Wifi className="h-6 w-6 text-glass-accent-bright" />
                  </div>
                )}
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{e.title}</h1>
                  <p className="text-sm text-glass-muted">
                    v{e.version} · {extypeLabel} · {e.platform}
                    {e.slug?.owner && <span> · by {e.slug.owner}</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold ${
                  e.free
                    ? "border-amber-800/40 bg-amber-950/50 text-amber-400"
                    : "border-amber-800/40 bg-amber-950/50 text-amber-400"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                {e.cost || (e.free ? "Free" : "Paid")}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 bg-glass-dark px-3 py-1 text-xs text-glass-muted">
                <Globe className="h-3 w-3" />
                {e.platform}
              </Badge>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <StatusBadge ok={!e.detected} label={e.detected ? "Detected" : "Undetected"} />
            <StatusBadge ok={e.uncStatus} label="UNC" />
            <StatusBadge ok={e.updateStatus} label="Up to Date" />
            {e.multiInject && <StatusBadge ok label="Multi Inject" />}
            {e.decompiler && <StatusBadge ok label="Decompiler" />}
            {e.raknet && <StatusBadge ok label="RakNet" />}
            {e.clientmods && <StatusBadge ok label="Client Mods" />}
            {e.keysystem && <StatusBadge ok={false} label="Key System" />}
            {e.elementCertified && (
              <Badge variant="outline" className="flex items-center gap-1 border-sky-800/40 bg-sky-950/50 text-sky-400">
                <BadgeCheck className="h-3 w-3" /> Element Certified
              </Badge>
            )}
            {e.longestRunning && (
              <Badge variant="outline" className="flex items-center gap-1 border-purple-800/40 bg-purple-950/50 text-purple-400">
                <Terminal className="h-3 w-3" /> Longest Running
              </Badge>
            )}
            {e.beta && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-800/40 bg-amber-950/50 text-amber-400">
                Beta
              </Badge>
            )}
          </div>

          {e.slug?.fullDescription && (
            <div className="mb-6 rounded-xl border border-glass-border/60 bg-glass-darker/50 p-4">
              <p className="text-sm leading-relaxed text-glass-muted whitespace-pre-wrap">{e.slug.fullDescription}</p>
            </div>
          )}

          {e.detected && e.detectionReason && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <p className="text-sm font-semibold text-rose-400">Detected</p>
                <p className="text-xs text-rose-300/80">{e.detectionReason}</p>
              </div>
            </div>
          )}

          {typeof e.suncPercentage === "number" && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-glass-border/60 bg-glass-darker/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-glass-muted">sUNC Score</span>
                  <span className="font-bold text-amber-400">{e.suncPercentage}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-glass-dark">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-400" style={{ width: `${e.suncPercentage}%` }} />
                </div>
              </div>
              {typeof e.uncPercentage === "number" && (
                <div className="rounded-xl border border-glass-border/60 bg-glass-darker/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-glass-muted">UNC Score</span>
                    <span className="font-bold text-sky-400">{e.uncPercentage}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-glass-dark">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-700 to-sky-400" style={{ width: `${e.uncPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {e.slug?.screenshots && e.slug.screenshots.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-glass-muted">Screenshots</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {e.slug.screenshots.filter(Boolean).map((src, i) => (
                  <div key={i} className="h-40 w-72 shrink-0 overflow-hidden rounded-xl border border-glass-border/60 bg-glass-darker">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Type</dt>
              <dd className="mt-1 text-sm text-white">{extypeLabel}</dd>
            </div>
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Version</dt>
              <dd className="mt-1 text-sm text-white">{e.version || "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Last Updated</dt>
              <dd className="mt-1 text-sm text-white">{e.updatedDate || "N/A"}</dd>
            </div>
            {e.slug?.owner && (
              <div className="rounded-lg bg-glass-darker/50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Developer</dt>
                <dd className="mt-1 text-sm text-white">{e.slug.owner}</dd>
              </div>
            )}
            <div className="rounded-lg bg-glass-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-glass-muted">Pricing</dt>
              <dd className="mt-1 text-sm text-amber-400">{e.cost || (e.free ? "Free" : "Paid")}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}