"use client";

import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Eye, Globe, ShieldCheck, Key,
  AlertTriangle, Gamepad2,
} from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

      <Card className="mb-8 overflow-hidden">
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

        <CardContent className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`${src.bg} ${src.color} border-current/30`}>
              {src.label}
            </Badge>
            <Badge variant="outline" className={price.className}>
              {script.pricing === "key" && <Key className="mr-0.5 inline size-3" />}
              {price.label}
            </Badge>
            {script.verified && (
              <Badge variant="outline" className="border-emerald-800/40 bg-emerald-950/50 text-emerald-400 gap-1">
                <ShieldCheck className="size-3.5" /> Verified
              </Badge>
            )}
            {script.patched && (
              <Badge variant="outline" className="border-red-800/40 bg-red-950/50 text-red-400">
                Patched
              </Badge>
            )}
            {script.universal && (
              <Badge variant="outline" className="border-blue-800/40 bg-blue-950/50 text-blue-400">
                Universal
              </Badge>
            )}
          </div>

          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {script.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-glass-accent/70">
            <Gamepad2 className="size-4" />
            {script.game}
          </div>

          <p className="mt-4 text-base leading-relaxed text-glass-muted">
            {script.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-glass-muted">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" /> {script.views.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" /> Source: {src.label}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<a href={script.url} target="_blank" rel="noopener noreferrer" />}>
              <ExternalLink className="size-4" /> View on {src.label}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-start gap-3 pb-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" />
            <p className="text-xs text-glass-muted">
              This script is hosted on <strong className="text-white">{src.label}</strong>.
              Pricing, availability, and functionality are managed by the original platform.
            </p>
          </div>
          <p className="text-xs text-glass-muted/60">
            Powered by {src.label}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
