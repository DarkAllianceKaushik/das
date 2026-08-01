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
  X,
} from "lucide-react";
import { Button, Card, Chip, InputGroup, Pagination } from "@heroui/react";

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
      <div className="rounded-2xl border border-alliance-border bg-alliance-card p-5 shadow-glass backdrop-blur-2xl">
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-alliance-border bg-alliance-dark/50 p-3 text-sm text-alliance-muted">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-alliance-red-bright" />
          <p>
            Live results from{" "}
            <strong className="text-white">ScriptBlox</strong> and{" "}
            <strong className="text-white">RScripts</strong>. Scripts open on
            their original site — Dark Alliance does not host third-party files.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <InputGroup fullWidth>
              <InputGroup.Prefix>
                <Search className="size-4 text-alliance-muted" />
              </InputGroup.Prefix>
              <InputGroup.Input
                type="search"
                placeholder="Search online scripts (game, feature, name)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <InputGroup.Suffix>
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="text-alliance-muted hover:text-white transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </InputGroup.Suffix>
              )}
            </InputGroup>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="lg" className="px-6">
              Search
            </Button>
            {query && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onPress={() => {
                  setSearch("");
                  setQuery("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
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
