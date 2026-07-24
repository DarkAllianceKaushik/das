"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface StoreFiltersProps {
  search: string;
  category: string;
  pricing: string;
  categories: string[];
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onPricingChange: (v: string) => void;
}

export function StoreFilters({
  search,
  category,
  pricing,
  categories,
  onSearchChange,
  onCategoryChange,
  onPricingChange,
}: StoreFiltersProps) {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass-card p-5 shadow-glass backdrop-blur-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-glass-muted">
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-glass-muted" />
            <Input
              id="search"
              type="search"
              placeholder="Name, description, or tags..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-10 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-glass-muted transition-colors hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full sm:w-44">
          <Label htmlFor="category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-glass-muted">
            Category
          </Label>
          <Select value={category} onValueChange={(v) => v !== null && onCategoryChange(v)}>
            <SelectTrigger id="category" className="h-10 w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-36">
          <Label htmlFor="pricing" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-glass-muted">
            Pricing
          </Label>
          <Select value={pricing} onValueChange={(v) => v !== null && onPricingChange(v)}>
            <SelectTrigger id="pricing" className="h-10 w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
