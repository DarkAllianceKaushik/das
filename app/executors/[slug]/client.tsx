"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Disc, CreditCard, Check, X, Shield, Wifi, Download, Code2, Cpu, Layers } from "lucide-react";
import type { Executor } from "@/lib/executor-types";

interface Props {
  executor: Executor;
}

function StatusBadge({ ok, label, icon: Icon }: { ok: boolean; label: string; icon: typeof Shield }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
      ok
        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
        : "bg-red-950/50 text-red-400 border border-red-800/40"
    }`}>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function ExecutorDetailClient({ executor }: Props) {
  const e = executor;

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/executors" className="mb-6 inline-flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Executors
      </Link>

      <section className="card-surface mb-8 p-6 sm:p-8">
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
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge ok={!e.detected} label={e.detected ? "Detected" : "Undetected"} icon={Shield} />
              <StatusBadge ok={e.uncStatus} label="UNC" icon={Code2} />
              <StatusBadge ok={e.updateStatus} label="Up to Date" icon={Download} />
              {e.multiInject && <StatusBadge ok label="Multi Inject" icon={Layers} />}
              {e.decompiler && <StatusBadge ok label="Decompiler" icon={Cpu} />}
              {e.raknet && <StatusBadge ok label="RakNet" icon={Wifi} />}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
              e.cost === "Free" || e.free
                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                : "bg-amber-950/50 text-amber-400 border border-amber-800/40"
            }`}>
              <CreditCard className="h-3.5 w-3.5" />
              {e.cost || (e.free ? "Free" : "Paid")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-alliance-dark px-3 py-1 text-xs text-alliance-muted">
              <Globe className="h-3 w-3" />
              {e.platform}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {e.websitelink && (
            <a href={e.websitelink} target="_blank" rel="noopener noreferrer" className="btn-secondary justify-center gap-2 text-sm">
              <Globe className="h-4 w-4" /> Website
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {e.discordlink && (
            <a href={e.discordlink} target="_blank" rel="noopener noreferrer" className="btn-secondary justify-center gap-2 text-sm">
              <Disc className="h-4 w-4" /> Discord
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {e.purchaselink && (
            <a href={e.purchaselink} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center gap-2 text-sm">
              <CreditCard className="h-4 w-4" /> Purchase
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </section>

      <section className="card-surface p-6 sm:p-8">
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
            <dd className="mt-1 text-sm text-white">{e.type || "N/A"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
