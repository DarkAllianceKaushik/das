"use client";

import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Eye, Globe, ShieldCheck, Key,
  AlertTriangle, Gamepad2,
} from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";
import { Button, Card, Chip, ChipLabel } from "@heroui/react";

const sourceStyles = {
  scriptblox: { label: "ScriptBlox", color: "text-sky-400", bg: "bg-sky-950/50" },
  rscripts: { label: "RScripts", color: "text-violet-400", bg: "bg-violet-950/50" },
};

interface Props {
  script: ExternalScript;
}

export function ExternalScriptDetailClient({ script }: Props) {
  const src = sourceStyles[script.source];

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <Card className="mb-8 overflow-hidden border border-alliance-border bg-alliance-card/80 shadow-glow">
        {script.imageUrl && (
          <div className="relative h-48 w-full bg-alliance-black sm:h-64">
            <img
              src={script.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-alliance-card via-alliance-card/60 to-transparent" />
          </div>
        )}

        <Card.Content className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Chip color="accent" variant="soft" size="sm">
              <ChipLabel>{src.label}</ChipLabel>
            </Chip>
            <Chip
              color={script.pricing === "free" ? "success" : script.pricing === "paid" ? "warning" : "accent"}
              variant="soft"
              size="sm"
            >
              <ChipLabel>
                {script.pricing === "key" && <Key className="mr-0.5 inline size-3" />}
                {script.pricing}
              </ChipLabel>
            </Chip>
            {script.verified && (
              <Chip color="success" variant="soft" size="sm">
                <ChipLabel><ShieldCheck className="mr-0.5 inline size-3.5" /> Verified</ChipLabel>
              </Chip>
            )}
            {script.patched && (
              <Chip color="danger" variant="soft" size="sm">
                <ChipLabel>Patched</ChipLabel>
              </Chip>
            )}
            {script.universal && (
              <Chip color="default" variant="soft" size="sm">
                <ChipLabel>Universal</ChipLabel>
              </Chip>
            )}
          </div>

          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {script.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-alliance-accent/70">
            <Gamepad2 className="size-4" />
            {script.game}
          </div>

          <p className="mt-4 text-base leading-relaxed text-alliance-muted">
            {script.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-alliance-muted">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" /> {script.views.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" /> Source: {src.label}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={script.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink className="size-4" /> View on {src.label}
            </a>
          </div>
        </Card.Content>
      </Card>

      <Card className="border border-alliance-border bg-alliance-card/80">
        <Card.Content className="p-6">
          <div className="flex items-start gap-3 pb-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" />
            <p className="text-xs text-alliance-muted">
              This script is hosted on <strong className="text-white">{src.label}</strong>.
              Pricing, availability, and functionality are managed by the original platform.
            </p>
          </div>
          <p className="text-xs text-alliance-muted/60">
            Powered by {src.label}
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
