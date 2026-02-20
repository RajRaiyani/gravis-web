"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { ProductCategory } from "@/services/api/product-category.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

interface ProductsFiltersProps {
  initialSearch: string;
  categoryId: string | undefined;
  categories?: ProductCategory[];
}

function buildSearchUrl(params: {
  search: string;
  categoryId: string | undefined;
}): string {
  const q: Record<string, string> = {};
  if (params.categoryId) q.category_id = params.categoryId;
  if (params.search.trim()) q.search = params.search.trim().toLowerCase();
  return `/products?${new URLSearchParams(q).toString()}`;
}

function buildCategoryUrl(params: {
  categoryId?: string;
  search?: string;
}): string {
  const q: Record<string, string> = {};
  if (params.categoryId) q.category_id = params.categoryId;
  if (params.search) q.search = params.search;
  return `/products?${new URLSearchParams(q).toString()}`;
}

export function ProductsFilters({
  initialSearch,
  categoryId,
  categories = [],
}: ProductsFiltersProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch);
  const hasCategoryFilter = categories.length > 0;

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
      });
      router.push(url);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [value, initialSearch, categoryId, router]);

  const handleClear = useCallback(() => {
    setValue("");
    const url = buildSearchUrl({ search: "", categoryId });
    router.push(url);
  }, [categoryId, router]);

  const selectCategory = useCallback(
    (categoryId: string | undefined) => {
      const url = buildCategoryUrl({
        categoryId,
        search: value.trim() || undefined,
      });
      router.push(url);
    },
    [value, router]
  );

  return (
    <div className="mb-6 flex flex-row items-center gap-2 rounded-lg border border-primary/60 bg-transparent px-3 py-2">
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
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
      {hasCategoryFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "shrink-0",
                categoryId ? "text-primary" : "text-muted-foreground"
              )}
              aria-label="Filter by category"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[min(70vh,20rem)] w-56">
            <DropdownMenuItem
              onClick={() => selectCategory(undefined)}
              className={cn(!categoryId && "bg-accent")}
            >
              All categories
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={cn(categoryId === cat.id && "bg-accent")}
              >
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
