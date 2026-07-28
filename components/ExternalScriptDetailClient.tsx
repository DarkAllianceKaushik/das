"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ExternalLink, Eye, Globe, ShieldCheck, Key,
  AlertTriangle, Gamepad2, Smartphone, ThumbsUp, ThumbsDown,
  User, MessageCircle, Code, Copy, Check, Loader2,
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
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const totalRatings = (script.likes ?? 0) + (script.dislikes ?? 0);
  const score = totalRatings > 0 ? Math.round(((script.likes ?? 0) / totalRatings) * 100) : 0;

  const handleCopy = async () => {
    if (script.rawScript) {
      await navigator.clipboard.writeText(script.rawScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            {script.mobileReady && (
              <Badge variant="outline" className="border-purple-800/40 bg-purple-950/50 text-purple-400 gap-1">
                <Smartphone className="size-3" /> Mobile
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
            {totalRatings > 0 && (
              <>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3 text-emerald-400" /> {script.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsDown className="size-3 text-red-400" /> {script.dislikes}
                </span>
                <span className="text-emerald-400/80">{score}% positive</span>
                {totalRatings > 0 && (
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-glass-darker">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} />
                  </div>
                )}
              </>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" /> Source: {src.label}
            </span>
          </div>

          {script.author && (
            <div className="mt-4 flex items-center gap-3 text-xs text-glass-muted">
              <User className="size-3.5" />
              <span>by <strong className="text-white">{script.author}</strong></span>
              {script.authorDiscord && (
                <span className="inline-flex items-center gap-1 text-glass-muted/70">
                  <MessageCircle className="size-3" /> {script.authorDiscord}
                </span>
              )}
            </div>
          )}

          {script.testedExecutors && script.testedExecutors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-glass-muted">Compatible Executors</p>
              <div className="flex flex-wrap gap-1.5">
                {script.testedExecutors.map((exe) => (
                  <Badge key={exe} variant="secondary" className="text-[10px]">
                    {exe}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<a href={script.url} target="_blank" rel="noopener noreferrer" />}>
              <ExternalLink className="size-4" /> View on {src.label}
            </Button>
            {script.rawScript && (
              <Button variant="secondary" onClick={() => setShowCode(!showCode)}>
                <Code className="size-4" /> {showCode ? "Hide Code" : "Show Code"}
              </Button>
            )}
          </div>

          {showCode && script.rawScript && (
            <div className="mt-6">
              <div className="flex items-center justify-between rounded-t-xl border border-glass-border bg-glass-darker px-4 py-2">
                <span className="text-xs font-semibold text-glass-muted">Script Code</span>
                <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-glass-muted hover:text-white transition-colors">
                  {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="max-h-96 overflow-auto rounded-b-xl border-x border-b border-glass-border bg-alliance-black p-4 font-mono text-xs leading-relaxed text-green-400">
                {script.rawScript}
              </pre>
            </div>
          )}
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