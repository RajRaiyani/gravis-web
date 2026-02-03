"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const DEBOUNCE_MS = 400;

interface ProductsFiltersProps {
  initialSearch: string;
  categoryId: string | undefined;
  limit: number;
}

function buildSearchUrl(params: {
  search: string;
  categoryId: string | undefined;
  limit: number;
}): string {
  const q: Record<string, string> = { limit: String(params.limit) };
  if (params.categoryId) q.category_id = params.categoryId;
  if (params.search.trim()) q.search = params.search.trim().toLowerCase();
  return `/products?${new URLSearchParams(q).toString()}`;
}

export function ProductsFilters({
  initialSearch,
  categoryId,
  limit,
}: ProductsFiltersProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch);

  // Sync local value when initialSearch changes (e.g. navigation back)
  useEffect(() => {
    setValue(initialSearch);
  }, [initialSearch]);

  // Debounced navigation
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === initialSearch) return;
      const url = buildSearchUrl({
        search: value,
        categoryId,
        limit,
      });
      router.push(url);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [value, initialSearch, categoryId, limit, router]);

  const handleClear = useCallback(() => {
    setValue("");
    const url = buildSearchUrl({ search: "", categoryId, limit });
    router.push(url);
  }, [categoryId, limit, router]);

  return (
    <div className="mb-6  flex items-center gap-2 rounded-lg border border-primary/60 bg-transparent px-3 py-2">
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="min-w-0  flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        aria-label="Search products"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
