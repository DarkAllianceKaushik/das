"use client";

import { useMemo, useState } from "react";
import { ScriptCardEnhanced } from "./ScriptCardEnhanced";
import { StoreFilters } from "./StoreFilters";
import type { Script } from "@/lib/types";
import { PackageOpen } from "lucide-react";

interface StoreClientProps {
  scripts: Script[];
  categories: string[];
}

export function StoreClient({ scripts, categories }: StoreClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");

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

  return (
    <div className="space-y-8">
      <StoreFilters
        search={search}
        category={category}
        pricing={pricing}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onPricingChange={setPricing}
      />

      {filtered.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
          <PackageOpen className="h-12 w-12 text-alliance-muted/40" />
          <p className="mt-4 font-display text-lg text-alliance-muted">
            No scripts found
          </p>
          <p className="mt-1 text-sm text-alliance-muted/70">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
                Featured
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((script) => (
                  <ScriptCardEnhanced key={script.id} script={script} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              {featured.length > 0 && (
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
                  All Scripts
                </h2>
              )}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((script) => (
                  <ScriptCardEnhanced key={script.id} script={script} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
