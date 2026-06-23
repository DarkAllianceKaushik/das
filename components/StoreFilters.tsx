"use client";

import { Search } from "lucide-react";
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
    <div className="card-glass flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Search scripts</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
          <Input
            id="search"
            type="search"
            placeholder="Name, description, or tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full sm:w-44">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(v) => v !== null && onCategoryChange(v)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-36">
        <Label htmlFor="pricing">Pricing</Label>
        <Select value={pricing} onValueChange={(v) => v !== null && onPricingChange(v)}>
          <SelectTrigger id="pricing">
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
  );
}
