"use client";

import { Search, X } from "lucide-react";
import { Select, Label, ListBox, InputGroup } from "@heroui/react";

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
    <div className="rounded-2xl border border-alliance-border bg-alliance-card p-5 shadow-glass backdrop-blur-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-alliance-muted">
            Search
          </Label>
          <InputGroup fullWidth>
            <InputGroup.Prefix>
              <Search className="pointer-events-none size-4 text-alliance-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="search"
              type="search"
              placeholder="Name, description, or tags..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <InputGroup.Suffix>
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                  className="text-alliance-muted transition-colors hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </InputGroup.Suffix>
            )}
          </InputGroup>
        </div>

        <div className="w-full sm:w-44">
          <Select
            selectedKey={category}
            onSelectionChange={(k) => onCategoryChange(k === null ? "" : String(k))}
            placeholder="All categories"
            variant="primary"
          >
            <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-alliance-muted">
              Category
            </Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover placement="bottom">
              <ListBox>
                <ListBox.Item id="">All categories</ListBox.Item>
                {categories.map((c) => (
                  <ListBox.Item key={c} id={c}>
                    <Label>{c}</Label>
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="w-full sm:w-36">
          <Select
            selectedKey={pricing}
            onSelectionChange={(k) => onPricingChange(k === null ? "" : String(k))}
            placeholder="All"
            variant="primary"
          >
            <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-alliance-muted">
              Pricing
            </Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover placement="bottom">
              <ListBox>
                <ListBox.Item id="">All</ListBox.Item>
                <ListBox.Item id="free">
                  <Label>Free</Label>
                </ListBox.Item>
                <ListBox.Item id="paid">
                  <Label>Paid</Label>
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
}
