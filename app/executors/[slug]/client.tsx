"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Disc, CreditCard, Check, X, Wifi, BadgeCheck, Terminal, AlertTriangle } from "lucide-react";
import type { Executor } from "@/lib/executor-types";
import { Card, Chip } from "@heroui/react";

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
    <Chip
      color={ok ? "success" : "danger"}
      variant="soft"
      size="sm"
      className={`px-3 py-1 text-xs font-semibold ${
        ok
          ? "border-amber-800/40 bg-amber-950/50 text-amber-400"
          : "border-rose-800/40 bg-rose-950/50 text-rose-400"
      }`}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </Chip>
  );
}

export function ExecutorDetailClient({ executor }: Props) {
  const e = executor;
  const extypeLabel = extypeLabels[e.extype || ""] || e.extype || "N/A";

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/executors" className="mb-6 inline-flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Executors
      </Link>

      {e.possibleBanwave && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-900/50 bg-rose-950/25 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <p className="text-sm font-semibold text-rose-300">Possible Banwave Detected</p>
            <p className="text-xs text-rose-300/70">This executor has been flagged for a possible banwave. Use at your own risk.</p>
          </div>
        </div>
      )}

      {e.unknown && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Unknown Status</p>
            <p className="text-xs text-amber-300/70">WEAO currently has no verified status data for this executor.</p>
          </div>
        </div>
      )}

      {e.hasIssues && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-800/50 bg-orange-950/20 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
          <div>
            <p className="text-sm font-semibold text-orange-300">Known Issues</p>
            {e.detectionReason ? (
              <p className="text-xs text-orange-300/70">{e.detectionReason}</p>
            ) : (
              <p className="text-xs text-orange-300/70">This executor currently has reported issues.</p>
            )}
          </div>
        </div>
      )}

      <Card className="mb-8 border border-alliance-border bg-alliance-card/80">
        <Card.Content className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-alliance-red/20 ring-1 ring-alliance-red/40">
                  <Wifi className="h-6 w-6 text-alliance-red-bright" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{e.title}</h1>
                  <p className="text-sm text-alliance-muted">v{e.version}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Chip
                color={e.cost === "Free" || e.free ? "success" : "warning"}
                variant="soft"
                size="md"
                className={`px-4 py-1.5 text-sm font-bold ${
                  e.cost === "Free" || e.free
                    ? "border-emerald-800/40 bg-emerald-950/50 text-emerald-400"
                    : "border-amber-800/40 bg-amber-950/50 text-amber-400"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                {e.cost || (e.free ? "Free" : "Paid")}
              </Chip>
              <Chip
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5 bg-alliance-dark px-3 py-1 text-xs text-alliance-muted"
              >
                <Globe className="h-3 w-3" />
                {e.platform}
              </Chip>
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
              <Chip variant="soft" color="accent" size="sm" className="flex items-center gap-1 border-sky-800/40 bg-sky-950/50 text-sky-400">
                <BadgeCheck className="h-3 w-3" /> Element Certified
              </Chip>
            )}
            {e.longestRunning && (
              <Chip variant="soft" color="default" size="sm" className="flex items-center gap-1 border-purple-800/40 bg-purple-950/50 text-purple-400">
                <Terminal className="h-3 w-3" /> Longest Running
              </Chip>
            )}
            {e.beta && (
              <Chip variant="soft" color="warning" size="sm" className="flex items-center gap-1 border-amber-800/40 bg-amber-950/50 text-amber-400">
                Beta
              </Chip>
            )}
          </div>

          {e.slug?.fullDescription && (
            <div className="mb-6 rounded-xl border border-alliance-border/60 bg-alliance-darker/50 p-4">
              <p className="text-sm leading-relaxed text-alliance-muted whitespace-pre-wrap">{e.slug.fullDescription}</p>
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
              <div className="rounded-xl border border-alliance-border/60 bg-alliance-darker/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-alliance-muted">sUNC Score</span>
                  <span className="font-bold text-amber-400">{e.suncPercentage}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-alliance-dark">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-400" style={{ width: `${e.suncPercentage}%` }} />
                </div>
              </div>
              {typeof e.uncPercentage === "number" && (
                <div className="rounded-xl border border-alliance-border/60 bg-alliance-darker/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-alliance-muted">UNC Score</span>
                    <span className="font-bold text-sky-400">{e.uncPercentage}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-alliance-dark">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-700 to-sky-400" style={{ width: `${e.uncPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {e.slug?.screenshots && e.slug.screenshots.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-alliance-muted">Screenshots</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {e.slug.screenshots.filter(Boolean).map((src, i) => (
                  <div key={i} className="h-40 w-72 shrink-0 overflow-hidden rounded-xl border border-alliance-border/60 bg-alliance-darker">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {e.websitelink && (
              <a
                href={e.websitelink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary justify-center gap-2 text-sm"
              >
                <Globe className="h-4 w-4" /> Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {e.discordlink && (
              <a
                href={e.discordlink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary justify-center gap-2 text-sm"
              >
                <Disc className="h-4 w-4" /> Discord
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {e.purchaselink && (
              <a
                href={e.purchaselink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center gap-2 text-sm"
              >
                <CreditCard className="h-4 w-4" /> Purchase
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </Card.Content>
      </Card>

      <Card className="border border-alliance-border bg-alliance-card/80">
        <Card.Content className="p-6 sm:p-8">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">Details</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-alliance-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Platform</dt>
              <dd className="mt-1 text-sm text-white">{e.platform || "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-alliance-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Version</dt>
              <dd className="mt-1 text-sm text-white">{e.version || "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-alliance-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Last Updated</dt>
              <dd className="mt-1 text-sm text-white">{e.updatedDate ? new Date(e.updatedDate).toLocaleDateString() : "N/A"}</dd>
            </div>
            <div className="rounded-lg bg-alliance-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Type</dt>
              <dd className="mt-1 text-sm text-white">{e.type || extypeLabel || "N/A"}</dd>
            </div>
            {e.rbxversion && (
              <div className="rounded-lg bg-alliance-darker/50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Roblox Version</dt>
                <dd className="mt-1 text-sm text-white">{e.rbxversion}</dd>
              </div>
            )}
            {e.slug?.owner && (
              <div className="rounded-lg bg-alliance-darker/50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Owner</dt>
                <dd className="mt-1 text-sm text-white">{e.slug.owner}</dd>
              </div>
            )}
          </dl>

          {e.sunc && (typeof e.sunc.suncScrap === "number" || typeof e.sunc.suncKey === "number") && (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {typeof e.sunc.suncScrap === "number" && (
                <div className="rounded-lg bg-alliance-darker/50 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">sUNC (Scrap)</dt>
                  <dd className="mt-1 text-sm font-bold text-amber-400">{e.sunc.suncScrap}%</dd>
                </div>
              )}
              {typeof e.sunc.suncKey === "number" && (
                <div className="rounded-lg bg-alliance-darker/50 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">sUNC (Key)</dt>
                  <dd className="mt-1 text-sm font-bold text-amber-400">{e.sunc.suncKey}%</dd>
                </div>
              )}
            </dl>
          )}

          {e.recommendedReason && (
            <div className="mt-4 rounded-lg bg-alliance-darker/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-alliance-muted">Why Recommended</dt>
              <dd className="mt-1 text-sm text-alliance-muted">{e.recommendedReason}</dd>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}