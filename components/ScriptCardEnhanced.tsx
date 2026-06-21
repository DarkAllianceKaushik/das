"use client";

import { useEffect, useState, useCallback } from "react";
import { ScriptCard } from "./ScriptCard";
import type { Script } from "@/lib/types";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getViewCount, trackView } from "@/lib/analytics";
import { submitReport } from "@/lib/reporting";
import { Heart, Flag, Eye, X } from "lucide-react";

interface Props {
  script: Script;
}

export function ScriptCardEnhanced({ script }: Props) {
  const [faved, setFaved] = useState(false);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setFaved(isFavorite(script.id));
    setViews(getViewCount(script.id));
    trackView(script.id);
  }, [script.id]);

  const handleFav = useCallback(() => {
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

  return (
    <div className="relative">
      <ScriptCard script={script} />

      <div className="absolute right-3 top-3 flex gap-1">
        <button
          onClick={handleFav}
          className="rounded-md bg-alliance-black/60 p-1.5 text-alliance-muted transition hover:bg-alliance-black hover:text-alliance-red-bright"
          title={faved ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3.5 w-3.5 ${faved ? "fill-alliance-red-bright text-alliance-red-bright" : ""}`} />
        </button>
        <button
          onClick={() => setShowReport(!showReport)}
          className="rounded-md bg-alliance-black/60 p-1.5 text-alliance-muted transition hover:bg-alliance-black hover:text-amber-400"
          title="Report script"
        >
          <Flag className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="absolute bottom-20 left-4 flex items-center gap-1 rounded-md bg-alliance-black/60 px-2 py-1 text-xs text-alliance-muted">
        <Eye className="h-3 w-3" />
        {views}
      </div>

      {showReport && (
        <div className="card-surface absolute left-0 right-0 top-0 z-20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-400">Report Script</h4>
            <button onClick={() => setShowReport(false)} className="text-alliance-muted hover:text-white">
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
          <textarea
            value={reportDetail}
            onChange={e => setReportDetail(e.target.value)}
            placeholder="Additional details (optional)"
            className="input-field mb-3 h-20 resize-none text-xs"
          />
          <div className="flex gap-2">
            <button onClick={handleReport} disabled={!reportReason} className="btn-danger flex-1 text-xs">
              <Flag className="h-3 w-3" /> Submit Report
            </button>
          </div>
        </div>
      )}

      {reported && (
        <div className="absolute left-0 right-0 top-0 z-20 rounded-xl border border-emerald-800/50 bg-emerald-950/80 p-4 text-center text-sm text-emerald-400 backdrop-blur-sm">
          Report submitted. Thank you.
          <button onClick={() => setReported(false)} className="ml-2 underline">Dismiss</button>
        </div>
      )}
    </div>
  );
}
