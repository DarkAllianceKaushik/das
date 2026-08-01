"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { ExternalScriptCard } from "./ExternalScriptCard";
import type { ExternalScript, ExternalSourceFilter, GameSearchResult } from "@/lib/external-types";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Search,
  X,
  Gamepad2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OnlineScriptsClient() {
  const [scripts, setScripts] = useState<ExternalScript[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [game, setGame] = useState("");
  const [source, setSource] = useState<ExternalSourceFilter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameSuggestions, setGameSuggestions] = useState<GameSearchResult[]>([]);
  const [showGames, setShowGames] = useState(false);
  const [gameSearching, setGameSearching] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (gameRef.current && !gameRef.current.contains(e.target as Node)) {
        setShowGames(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadScripts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        source,
      });
      if (query) params.set("q", query);
      if (game) params.set("game", game);

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
  }, [page, query, game, source]);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
    setGame("");
  }

  function handleGameSelect(g: GameSearchResult) {
    setGame(g.name);
    setSearch("");
    setQuery("");
    setPage(1);
    setShowGames(false);
  }

  function handleGameSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 2) { setGameSuggestions([]); setShowGames(false); return; }
    debounceRef.current = setTimeout(async () => {
      setGameSearching(true);
      try {
        const res = await fetch(`/api/external/games?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setGameSuggestions(data.games || []);
        setShowGames(true);
      } catch { setGameSuggestions([]); } finally { setGameSearching(false); }
    }, 300);
  }

  return (
    <div className="space-y-6">
      <div className="card-glass space-y-5 p-5">
        <div className="flex items-start gap-3 rounded-xl border border-glass-border bg-glass-dark/50 p-3 text-sm text-glass-muted">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-glass-accent-bright" />
          <p>
            Live results from{" "}
            <strong className="text-white">ScriptBlox</strong> and{" "}
            <strong className="text-white">RScripts</strong>. Search by keyword or browse scripts for a specific game.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1" ref={gameRef}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-glass-muted" />
            <Input
              type="search"
              placeholder="Search scripts or type a game name..."
              value={search}
              onChange={handleGameSearchInput}
              className="h-10 pl-10 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setGameSuggestions([]); setShowGames(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-glass-muted hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
            {showGames && gameSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-glass-border bg-glass-card p-1 shadow-glass backdrop-blur-2xl">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-glass-muted">Games</p>
                {gameSuggestions.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGameSelect(g)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-glass-accent/20"
                  >
                    {g.imageUrl && g.imageUrl !== "0" ? (
                      <img src={g.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <Gamepad2 className="h-5 w-5 text-glass-muted" />
                    )}
                    <div className="text-left">
                      <p className="text-sm">{g.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {gameSearching && (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-glass-muted" />
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="lg" className="px-6">
              Search
            </Button>
            {(query || game) && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setSearch("");
                  setQuery("");
                  setGame("");
                  setPage(1);
                  setGameSuggestions([]);
                  setShowGames(false);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {game && (
          <div className="flex items-center gap-2 rounded-lg bg-glass-accent/10 px-3 py-2 text-sm text-glass-accent-bright">
            <Gamepad2 className="size-4" />
            Browsing scripts for: <strong>{game}</strong>
            <button type="button" onClick={() => { setGame(""); setPage(1); }} className="ml-auto text-glass-muted hover:text-white">
              <X className="size-4" />
            </button>
          </div>
        )}

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
              onClick={() => { setSource(value); setPage(1); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                source === value
                  ? "bg-gradient-to-br from-glass-accent via-glass-accent-dim to-glass-accent text-white shadow-lg shadow-glass-accent/25"
                  : "border border-glass-border bg-glass-dark/60 text-glass-muted hover:text-white hover:border-glass-accent/30 hover:bg-glass-card/50 backdrop-blur-[8px]"
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
        <div className="card-glass py-12 text-center text-rose-300">{error}</div>
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
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-glass-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}