"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Script } from "@/lib/types";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getViewCount, trackView } from "@/lib/analytics";
import { submitReport } from "@/lib/reporting";
import { Heart, Flag, Eye, X, Copy, Check, TrendingUp, Sparkles } from "lucide-react";

const TRENDING_THRESHOLD = 10;

interface Props {
  script: Script;
  onTagClick?: (tag: string) => void;
}

export function ScriptCardEnhanced({ script, onTagClick }: Props) {
  const [faved, setFaved] = useState(false);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFaved(isFavorite(script.id));
    setViews(getViewCount(script.id));
    trackView(script.id);
  }, [script.id]);

  const handleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleFavorite(script.id);
    setFaved(now);
    setViews(getViewCount(script.id));
  }, [script.id]);

  const handleReport = useCallback(() => {
    if (!reportReason) return;
    submitReport(script.id, reportReason, reportDetail);
    setReported(true);
    setShowReport(false);
    setReportReason("");
    setReportDetail("");
  }, [script.id, reportReason, reportDetail]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(script.downloadUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
    } catch {
      await navigator.clipboard.writeText(script.downloadUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [script.downloadUrl]);

  const handleTagClickWrapper = useCallback((tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  }, [onTagClick]);

  const isTrending = views >= TRENDING_THRESHOLD;

  return (
    <div className="relative">
      <Link href={`/scripts/${script.id}`} className="block">
        <div className="card-surface group flex flex-col p-5 transition hover:border-glass-accent/30 hover:shadow-glass">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {script.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-glass-accent/20 px-2 py-0.5 text-xs font-medium text-glass-accent-bright">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
              {isTrending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-800/50">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                script.pricing === "free"
                  ? "bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-800/50"
                  : "bg-amber-950/60 text-amber-400 ring-1 ring-amber-800/50"
              }`}>
                {script.pricing === "free" ? "Free" : "Paid"}
              </span>
              {script.version && (
                <span className="rounded-full bg-glass-dark/80 px-2 py-0.5 text-xs text-glass-muted ring-1 ring-glass-border/60">
                  v{script.version}
                </span>
              )}
            </div>
            <span className="rounded-xl bg-glass-dark/80 px-2 py-1 text-xs text-glass-muted backdrop-blur-[8px]">
              {script.category}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-white transition group-hover:text-glass-accent-bright">
            {script.name}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-glass-muted line-clamp-2">
            {script.description}
          </p>

          {script.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {script.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => handleTagClickWrapper(tag, e)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-glass-dark/60 px-2 py-0.5 text-xs text-glass-muted backdrop-blur-[8px] transition hover:bg-glass-accent/20 hover:text-glass-accent-bright"
                >
                  <span className="text-glass-accent/60">#</span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-glass-muted">
            <span className="inline-flex items-center gap-1 rounded-xl bg-glass-black/60 px-2 py-1 backdrop-blur-[8px]">
              <Eye className="h-3 w-3" />
              {views}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex gap-1">
        <button onClick={handleFav} className="rounded-xl bg-glass-black/60 p-1.5 text-glass-muted backdrop-blur-[8px] transition hover:bg-glass-black hover:text-glass-accent-bright" title={faved ? "Remove from favorites" : "Add to favorites"}>
          <Heart className={`h-3.5 w-3.5 ${faved ? "fill-glass-accent-bright text-glass-accent-bright" : ""}`} />
        </button>
        <button onClick={handleCopy} className="rounded-xl bg-glass-black/60 p-1.5 text-glass-muted backdrop-blur-[8px] transition hover:bg-glass-black hover:text-sky-400" title={copied ? "Copied!" : "Copy script"}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <button onClick={() => setShowReport(!showReport)} className="rounded-xl bg-glass-black/60 p-1.5 text-glass-muted backdrop-blur-[8px] transition hover:bg-glass-black hover:text-amber-400" title="Report script">
          <Flag className="h-3.5 w-3.5" />
        </button>
      </div>

      {showReport && (
        <div className="card-surface absolute left-0 right-0 top-0 z-30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-400">Report Script</h4>
            <button onClick={() => setShowReport(false)} className="text-glass-muted hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="input-field mb-2 text-xs">
            <option value="">Select reason...</option>
            <option value="broken">Broken / Not working</option>
            <option value="outdated">Outdated</option>
            <option value="malicious">Malicious / Virus</option>
            <option value="wrong">Wrong category / Info</option>
            <option value="other">Other</option>
          </select>
          <textarea value={reportDetail} onChange={e => setReportDetail(e.target.value)} placeholder="Additional details (optional)" className="input-field mb-3 h-20 resize-none text-xs" />
          <div className="flex gap-2">
            <button onClick={handleReport} disabled={!reportReason} className="btn-danger flex-1 text-xs">
              <Flag className="h-3 w-3" /> Submit Report
            </button>
          </div>
        </div>
      )}

      {reported && (
        <div className="absolute left-0 right-0 top-0 z-30 rounded-xl border border-emerald-800/50 bg-emerald-950/80 p-4 text-center text-sm text-emerald-400 backdrop-blur-sm">
          Report submitted. Thank you.
          <button onClick={() => setReported(false)} className="ml-2 underline">Dismiss</button>
        </div>
      )}
    </div>
  );
}
