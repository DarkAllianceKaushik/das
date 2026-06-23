"use client";

import { Search } from "lucide-react";

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
    <div className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="label-field" htmlFor="search">
          Search scripts
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
          <input
            id="search"
            type="search"
            placeholder="Name, description, or tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="w-full sm:w-44">
        <label className="label-field" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-36">
        <label className="label-field" htmlFor="pricing">
          Pricing
        </label>
        <select
          id="pricing"
          value={pricing}
          onChange={(e) => onPricingChange(e.target.value)}
          className="input-field"
        >
          <option value="">All</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>
    </div>
  );
}
