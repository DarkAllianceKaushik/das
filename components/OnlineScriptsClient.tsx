"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { ExternalScriptCard } from "./ExternalScriptCard";
import type { ExternalScript, ExternalSort, ExternalSourceFilter, GameSearchResult } from "@/lib/external-types";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Search,
  X,
  Gamepad2,
} from "lucide-react";
import { Button, Card, Chip, InputGroup, Pagination, Select, Label, ListBox } from "@heroui/react";

const SORT_OPTIONS: { value: ExternalSort; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "views", label: "Most Viewed" },
  { value: "newest", label: "Latest" },
];

export function OnlineScriptsClient() {
  const [scripts, setScripts] = useState<ExternalScript[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [game, setGame] = useState("");
  const [source, setSource] = useState<ExternalSourceFilter>("all");
  const [sort, setSort] = useState<ExternalSort>("trending");
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
        sort,
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
  }, [page, query, game, source, sort]);

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
      <div className="rounded-2xl border border-alliance-border bg-alliance-card p-5 shadow-glass backdrop-blur-2xl">
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-alliance-border bg-alliance-dark/50 p-3 text-sm text-alliance-muted">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-alliance-red-bright" />
          <p>
            Live results from{" "}
            <strong className="text-white">ScriptBlox</strong> and{" "}
            <strong className="text-white">RScripts</strong>. Search by keyword or browse scripts for a specific game.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1" ref={gameRef}>
            <InputGroup fullWidth>
              <InputGroup.Prefix>
                <Search className="size-4 text-alliance-muted" />
              </InputGroup.Prefix>
              <InputGroup.Input
                type="search"
                placeholder="Search scripts or type a game name..."
                value={search}
                onChange={handleGameSearchInput}
              />
              {search && !gameSearching && (
                <InputGroup.Suffix>
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => { setSearch(""); setGameSuggestions([]); setShowGames(false); }}
                    className="text-alliance-muted hover:text-white transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </InputGroup.Suffix>
              )}
              {gameSearching && (
                <InputGroup.Suffix>
                  <Loader2 className="size-4 animate-spin text-alliance-muted" />
                </InputGroup.Suffix>
              )}
            </InputGroup>
            {showGames && gameSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-alliance-border bg-alliance-card p-1 shadow-glass backdrop-blur-2xl">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-alliance-muted">Games</p>
                {gameSuggestions.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGameSelect(g)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-alliance-red/20"
                  >
                    {g.imageUrl && g.imageUrl !== "0" ? (
                      <img src={g.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <Gamepad2 className="h-5 w-5 text-alliance-muted" />
                    )}
                    <span className="text-left">{g.name}</span>
                  </button>
                ))}
              </div>
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
                onPress={() => {
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
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-alliance-red/10 px-3 py-2 text-sm text-alliance-red-bright">
            <Gamepad2 className="size-4" />
            Browsing scripts for: <strong>{game}</strong>
            <button
              type="button"
              onClick={() => { setGame(""); setPage(1); }}
              className="ml-auto text-alliance-muted hover:text-white"
              aria-label="Clear game filter"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(
            [
              ["all", "Both APIs"],
              ["scriptblox", "ScriptBlox"],
              ["rscripts", "RScripts"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={source === value ? "primary" : "secondary"}
              className={
                source === value
                  ? "cursor-pointer bg-gradient-to-br from-alliance-red via-alliance-crimson to-alliance-red text-white shadow-lg shadow-alliance-red/25"
                  : "cursor-pointer border border-alliance-border bg-alliance-dark/60 text-alliance-muted hover:border-alliance-red/30 hover:bg-alliance-card/50"
              }
              onPress={() => {
                setSource(value);
                setPage(1);
              }}
            >
              {label}
            </Button>
          ))}
          <div className="ml-auto">
            <Select
              selectedKey={sort}
              onSelectionChange={(k) => {
                if (k === null) return;
                setSort(String(k) as ExternalSort);
                setPage(1);
              }}
              placeholder="Sort by"
              variant="primary"
              className="w-auto min-w-[150px]"
              aria-label="Sort scripts"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom">
                <ListBox>
                  {SORT_OPTIONS.map((o) => (
                    <ListBox.Item key={o.value} id={o.value}>
                      <Label>{o.label}</Label>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-alliance-muted">
          <Loader2 className="h-10 w-10 animate-spin text-alliance-red" />
          <p className="mt-4">Loading from ScriptBlox & RScripts…</p>
        </div>
      ) : error ? (
        <Card className="border border-red-900/40 bg-red-950/20">
          <Card.Content className="py-12 text-center text-red-300">{error}</Card.Content>
        </Card>
      ) : scripts.length === 0 ? (
        <Card className="border border-alliance-border bg-alliance-card/80">
          <Card.Content className="py-12 text-center text-alliance-muted">
            No scripts found. Try another search or source.
          </Card.Content>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scripts.map((script) => (
            <ExternalScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination size="md">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page <= 1}
                  onPress={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Pagination.Item key={n}>
                  <Pagination.Link
                    isActive={n === page}
                    onPress={() => setPage(n)}
                  >
                    {n}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page >= totalPages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}