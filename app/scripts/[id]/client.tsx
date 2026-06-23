"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Download, Tag, Clock, RefreshCw, Heart, Eye, Flag, X,
  Lock, Globe, ExternalLink, AlertTriangle, Calendar, Copy, Check,
  Share2, TrendingUp,
} from "lucide-react";
import { ScriptPreview } from "@/components/ScriptPreview";
import { ScriptCardEnhanced } from "@/components/ScriptCardEnhanced";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getViewCount, trackView } from "@/lib/analytics";
import { submitReport } from "@/lib/reporting";
import type { Script } from "@/lib/types";

const TRENDING_THRESHOLD = 10;

interface Props {
  script: Script;
  relatedScripts?: Script[];
}

const LINK_LABELS: Record<string, { label: string; color: string }> = {
  pastebin: { label: "Pastebin", color: "text-emerald-400" },
  linkvertise: { label: "Linkvertise", color: "text-amber-400" },
  direct: { label: "Direct", color: "text-sky-400" },
  other: { label: "External", color: "text-violet-400" },
};

export function ScriptDetailClient({ script, relatedScripts }: Props) {
  const [faved, setFaved] = useState(false);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setFaved(isFavorite(script.id));
    setViews(getViewCount(script.id));
    trackView(script.id);
  }, [script.id]);

  const handleFav = useCallback(() => {
    const now = toggleFavorite(script.id);
    setFaved(now);
  }, [script.id]);

  const handleReport = useCallback(() => {
    if (!reportReason) return;
    submitReport(script.id, reportReason, reportDetail);
    setReported(true);
    setShowReport(false);
    setReportReason("");
    setReportDetail("");
  }, [script.id, reportReason, reportDetail]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  const loadCode = useCallback(async () => {
    if (!script.downloadUrl || code !== null || codeLoading) return;
    setCodeLoading(true);
    try {
      const res = await fetch(script.downloadUrl);
      const text = await res.text();
      setCode(text);
    } catch {
      setCode(null);
    } finally {
      setCodeLoading(false);
    }
  }, [script.downloadUrl, code, codeLoading]);

  const linkInfo = LINK_LABELS[script.linkType] || LINK_LABELS.other;
  const isTrending = views >= TRENDING_THRESHOLD;

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-glass-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <section className="card-glass mb-8 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-lg bg-glass-darker px-3 py-1 text-xs font-semibold text-glass-muted">
                {script.category}
              </span>
              <span className={`rounded-lg px-3 py-1 text-xs font-bold ${
                script.pricing === "free"
                  ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                  : "bg-amber-950/50 text-amber-400 border border-amber-800/40"
              }`}>
                {script.pricing === "free" ? "Free" : "Paid"}
              </span>
              {script.featured && (
                <span className="rounded-lg bg-glass-accent/20 px-3 py-1 text-xs font-bold text-glass-accent-bright border border-glass-accent/30">
                  Featured
                </span>
              )}
              {isTrending && (
                <span className="rounded-lg bg-amber-950/50 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-800/40">
                  <TrendingUp className="mb-0.5 mr-1 inline h-3 w-3" />Trending
                </span>
              )}
              {script.version && (
                <span className="rounded-lg bg-glass-darker px-3 py-1 text-xs font-mono text-glass-muted border border-glass-border/50">
                  v{script.version}
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{script.name}</h1>
            {script.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {script.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-glass-darker px-3 py-1 text-xs text-glass-muted">
                    <Tag className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="rounded-lg p-2.5 text-glass-muted transition hover:bg-glass-dark hover:text-sky-400" title={linkCopied ? "Link copied!" : "Copy link"}>
              {linkCopied ? <Check className="h-5 w-5 text-emerald-400" /> : <Share2 className="h-5 w-5" />}
            </button>
            <button onClick={handleFav} className="rounded-lg p-2.5 text-glass-muted transition hover:bg-glass-dark hover:text-glass-accent-bright" title={faved ? "Remove from favorites" : "Add to favorites"}>
              <Heart className={`h-5 w-5 ${faved ? "fill-glass-accent-bright text-glass-accent-bright" : ""}`} />
            </button>
            <button onClick={() => setShowReport(!showReport)} className="rounded-lg p-2.5 text-glass-muted transition hover:bg-glass-dark hover:text-amber-400" title="Report script">
              <Flag className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-glass-muted">{script.description}</p>

        {script.changelog && (
          <div className="mb-6 rounded-lg border border-glass-border/60 bg-glass-darker/50 p-4">
            <h4 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-glass-muted">
              <Clock className="mb-0.5 mr-1.5 inline h-3 w-3" /> Changelog {script.version ? `(v${script.version})` : ""}
            </h4>
            <p className="text-sm text-glass-muted whitespace-pre-wrap">{script.changelog}</p>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-glass-muted">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> {views} views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Added {new Date(script.createdAt).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Updated {new Date(script.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={script.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary gap-2"
          >
            <Download className="h-4 w-4" /> Download
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${linkInfo.color} border-current/30`}>
            <Globe className="h-3.5 w-3.5" /> {linkInfo.label}
          </span>
        </div>
      </section>

      {showReport && (
        <div className="card-glass mb-8 border border-amber-800/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              <Flag className="mb-0.5 mr-2 inline h-4 w-4" />Report Script
            </h3>
            <button onClick={() => setShowReport(false)} className="text-glass-muted hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="input-field mb-3">
            <option value="">Select reason...</option>
            <option value="broken">Broken / Not working</option>
            <option value="outdated">Outdated</option>
            <option value="malicious">Malicious / Virus</option>
            <option value="wrong">Wrong category / Info</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={reportDetail}
            onChange={e => setReportDetail(e.target.value)}
            placeholder="Additional details (optional)"
            className="input-field mb-4 h-24 resize-none"
          />
          <div className="flex gap-3">
            <button onClick={handleReport} disabled={!reportReason} className="btn-danger text-sm">
              <Flag className="h-4 w-4" /> Submit Report
            </button>
          </div>
        </div>
      )}

      {reported && (
        <div className="card-glass mb-8 border border-emerald-800/40 bg-emerald-950/30 p-4 text-center text-sm text-emerald-400">
          Report submitted. Thank you.
          <button onClick={() => setReported(false)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <section className="card-glass overflow-hidden">
        <div className="flex items-center justify-between border-b border-glass-border/60 bg-glass-darker/80 px-4 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-glass-muted">
            <AlertTriangle className="mb-0.5 mr-2 inline h-4 w-4" /> Script Code
          </h2>
          <button onClick={loadCode} disabled={codeLoading || code !== null} className="btn-secondary text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${codeLoading ? "animate-spin" : ""}`} />
            {codeLoading ? "Loading..." : code !== null ? "Loaded" : "Load Code"}
          </button>
        </div>
        {code ? (
          <ScriptPreview code={code} title={script.name} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="mb-3 h-10 w-10 text-glass-muted/30" />
            <p className="font-display text-sm text-glass-muted">Code hidden</p>
            <p className="mt-1 text-xs text-glass-muted/60">
              Click <strong className="text-white">Load Code</strong> above to fetch the script source from {linkInfo.label}.
            </p>
          </div>
        )}
      </section>

      {relatedScripts && relatedScripts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-glass-muted">
            Related Scripts
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedScripts.map(s => (
              <ScriptCardEnhanced key={s.id} script={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
