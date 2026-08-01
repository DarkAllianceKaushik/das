"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ScriptCardEnhanced } from "./ScriptCardEnhanced";
import { StoreFilters } from "./StoreFilters";
import type { Script } from "@/lib/types";
import { PackageOpen, ChevronDown } from "lucide-react";
import { Button, Card } from "@heroui/react";
import { ScrollReveal } from "@/components/ScrollReveal";

const PAGE_SIZE = 9;

interface StoreClientProps {
  scripts: Script[];
  categories: string[];
}

export function StoreClient({ scripts, categories }: StoreClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const handleTagClick = useCallback((tag: string) => {
    setSearch(tag);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return scripts.filter((s) => {
      if (category && s.category !== category) return false;
      if (pricing && s.pricing !== pricing) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.description,
        s.category,
        ...s.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [scripts, search, category, pricing]);

  const featured = filtered.filter((s) => s.featured);
  const rest = filtered.filter((s) => !s.featured);

  const totalVisible = page * PAGE_SIZE;
  const paginatedRest = rest.slice(0, totalVisible);
  const hasMore = rest.length > totalVisible;

  function handleLoadMore() {
    setPage(p => p + 1);
  }

  useEffect(() => {
    setPage(1);
  }, [search, category, pricing]);

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <StoreFilters
          search={search}
          category={category}
          pricing={pricing}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onPricingChange={setPricing}
        />
      </ScrollReveal>

      {filtered.length === 0 ? (
        <ScrollReveal delay={1}>
          <Card className="border border-alliance-border bg-alliance-card/80">
            <Card.Content className="flex flex-col items-center justify-center py-16 text-center">
              <PackageOpen className="h-12 w-12 text-alliance-muted/40" />
              <p className="mt-4 font-display text-lg text-alliance-muted">
                No scripts found
              </p>
              <p className="mt-1 text-sm text-alliance-muted/70">
                Try adjusting your filters or check back later.
              </p>
            </Card.Content>
          </Card>
        </ScrollReveal>
      ) : (
        <>
          {featured.length > 0 && (
            <ScrollReveal delay={1}>
              <section>
                <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
                  Featured
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((script) => (
                    <ScriptCardEnhanced key={script.id} script={script} onTagClick={handleTagClick} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          <ScrollReveal delay={featured.length > 0 ? 2 : 1}>
            <section>
              {rest.length > 0 && (
                <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
                  {featured.length > 0 ? "All Scripts" : `Scripts (${filtered.length})`}
                </h2>
              )}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedRest.map((script) => (
                  <ScriptCardEnhanced key={script.id} script={script} onTagClick={handleTagClick} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 text-center">
                  <Button variant="secondary" onPress={handleLoadMore}>
                    <ChevronDown className="h-4 w-4" /> Load More ({rest.length - totalVisible} remaining)
                  </Button>
                </div>
              )}
            </section>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}
