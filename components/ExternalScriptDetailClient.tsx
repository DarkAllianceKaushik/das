"use client";

import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Eye, Globe, ShieldCheck, Key,
  AlertTriangle, Gamepad2, User,
} from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";

const sourceStyles = {
  scriptblox: { label: "ScriptBlox", color: "text-sky-400", bg: "bg-sky-950/50" },
  rscripts: { label: "RScripts", color: "text-violet-400", bg: "bg-violet-950/50" },
};

const pricingStyles = {
  free: { label: "Free", className: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" },
  paid: { label: "Paid", className: "bg-amber-950/60 text-amber-400 border border-amber-800/40" },
  key: { label: "Key", className: "bg-orange-950/60 text-orange-400 border border-orange-800/40" },
};

interface Props {
  script: ExternalScript;
}

export function ExternalScriptDetailClient({ script }: Props) {
  const src = sourceStyles[script.source];
  const price = pricingStyles[script.pricing];

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-glass-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <section className="card-surface mb-8 overflow-hidden">
        {script.imageUrl && (
          <div className="relative h-48 w-full bg-glass-darker sm:h-64">
            <img
              src={script.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-glass-card via-glass-card/60 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${src.bg} ${src.color} border border-current/30`}>
              {src.label}
            </span>
            <span className={`rounded-lg px-3 py-1 text-xs font-bold ${price.className}`}>
              {script.pricing === "key" && <Key className="mr-1 inline h-3 w-3" />}
              {price.label}
            </span>
            {script.verified && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-800/40">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
            {script.patched && (
              <span className="rounded-lg bg-red-950/50 px-3 py-1 text-xs font-bold text-red-400 border border-red-800/40">
                Patched
              </span>
            )}
            {script.universal && (
              <span className="rounded-lg bg-blue-950/50 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-800/40">
                Universal
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {script.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-glass-accent/70">
            <Gamepad2 className="h-4 w-4" />
            {script.game}
          </div>

          <p className="mt-4 text-base leading-relaxed text-glass-muted">
            {script.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-glass-muted">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> {script.views.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Source: {src.label}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={script.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              <ExternalLink className="h-4 w-4" /> View on {src.label}
            </a>
          </div>
        </div>
      </section>

      <section className="card-surface p-6">
        <div className="flex items-center gap-3 border-b border-glass-border/60 pb-4">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <p className="text-xs text-glass-muted">
            This script is hosted on <strong className="text-white">{src.label}</strong>.
            Pricing, availability, and functionality are managed by the original platform.
          </p>
        </div>
        <p className="mt-4 text-xs text-glass-muted/60">
          Powered by {src.label}
        </p>
      </section>
    </div>
  );
}
