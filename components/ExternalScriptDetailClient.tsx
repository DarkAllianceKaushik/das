"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ExternalLink, Eye, Globe, ShieldCheck, Key,
  AlertTriangle, Gamepad2, Smartphone, ThumbsUp, ThumbsDown,
  User, MessageCircle, Code, Copy, Check, Loader2,
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
  const totalRatings = (script.likes ?? 0) + (script.dislikes ?? 0);
  const score = totalRatings > 0 ? Math.round(((script.likes ?? 0) / totalRatings) * 100) : 0;

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
            {script.mobileReady && (
              <Chip color="default" variant="soft" size="sm" className="border-purple-800/40 bg-purple-950/50 text-purple-400 gap-1">
                <Smartphone className="size-3" /> Mobile
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
            {totalRatings > 0 && (
              <>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3 text-amber-400" /> {script.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsDown className="size-3 text-rose-400" /> {script.dislikes}
                </span>
                <span className="text-amber-400/80">{score}% positive</span>
                {totalRatings > 0 && (
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-alliance-darker">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${score}%` }} />
                  </div>
                )}
              </>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" /> Source: {src.label}
            </span>
          </div>

          {script.author && (
            <div className="mt-4 flex items-center gap-3 text-xs text-alliance-muted">
              <User className="size-3.5" />
              <span>by <strong className="text-white">{script.author}</strong></span>
              {script.authorDiscord && (
                <span className="inline-flex items-center gap-1 text-alliance-muted/70">
                  <MessageCircle className="size-3" /> {script.authorDiscord}
                </span>
              )}
            </div>
          )}

          {script.testedExecutors && script.testedExecutors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-alliance-muted">Compatible Executors</p>
              <div className="flex flex-wrap gap-1.5">
                {script.testedExecutors.map((exe) => (
                  <Chip key={exe} variant="secondary" size="sm" className="text-[10px]">
                    {exe}
                  </Chip>
                ))}
              </div>
            </div>
          )}

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