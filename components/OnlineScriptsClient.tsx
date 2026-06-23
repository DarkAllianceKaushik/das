"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalScriptCard } from "./ExternalScriptCard";
import type { ExternalScript, ExternalSourceFilter } from "@/lib/external-types";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Search,
} from "lucide-react";

export function OnlineScriptsClient() {
  const [scripts, setScripts] = useState<ExternalScript[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<ExternalSourceFilter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScripts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        source,
      });
      if (query) params.set("q", query);

      const res = await fetch(`/api/external/scripts?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load scripts");
        setScripts([]);
        return;
      }

      setScripts(data.scripts || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Network error — try again.");
      setScripts([]);
    } finally {
      setLoading(false);
    }
  }, [page, query, source]);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  return (
    <div className="space-y-6">
      <div className="card-glass space-y-4 p-4">
        <div className="flex items-start gap-3 rounded-xl border border-glass-border bg-glass-dark/50 p-3 text-sm text-glass-muted">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-glass-accent-bright" />
          <p>
            Live results from{" "}
            <strong className="text-white">ScriptBlox</strong> and{" "}
            <strong className="text-white">RScripts</strong>. Scripts open on
            their original site — Dark Alliance does not host third-party files.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
            <input
              type="search"
              placeholder="Search online scripts (game, feature, name)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
          {query && (
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => {
                setSearch("");
                setQuery("");
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Both APIs"],
              ["scriptblox", "ScriptBlox"],
              ["rscripts", "RScripts"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSource(value);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                source === value
                  ? "bg-glass-accent/20 text-glass-accent-bright border border-glass-accent/30"
                  : "border border-glass-border bg-glass-dark/60 text-glass-muted hover:text-white backdrop-blur-[8px]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-glass-muted">
          <Loader2 className="h-10 w-10 animate-spin text-glass-accent" />
          <p className="mt-4">Loading from ScriptBlox & RScripts…</p>
        </div>
      ) : error ? (
        <div className="card-glass py-12 text-center text-red-300">{error}</div>
      ) : scripts.length === 0 ? (
        <div className="card-glass py-12 text-center text-glass-muted">
          No scripts found. Try another search or source.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scripts.map((script) => (
            <ExternalScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-glass-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
