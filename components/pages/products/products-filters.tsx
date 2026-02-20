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
  /** When provided, filter icon opens this (e.g. bottom sheet) instead of category dropdown. Use on mobile. */
  onOpenFiltersSheet?: () => void;
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
  onOpenFiltersSheet,
}: ProductsFiltersProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch);
  const hasCategoryFilter = categories.length > 0;
  const useSheet = Boolean(onOpenFiltersSheet);

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
    <div className="group/search relative mb-2 flex flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm ring-slate-200/50 transition-all duration-200 focus-within:border-[#0046B7] focus-within:ring-2 focus-within:ring-[#0046B7]/20 focus-within:shadow-md">
      <Search className="size-5 shrink-0 text-slate-400 transition-colors group-focus-within/search:text-[#0046B7]" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products by name..."
        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
        aria-label="Search products"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0046B7]/20 focus:ring-offset-2"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
      {hasCategoryFilter && (
        <>
          <div className="hidden h-6 w-px shrink-0 bg-slate-200 sm:block" aria-hidden />
          {useSheet ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-9 shrink-0 rounded-full transition-colors",
                categoryId ? "bg-[#0046B7]/10 text-[#0046B7]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
              aria-label="Open categories and filters"
              onClick={onOpenFiltersSheet}
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 shrink-0 rounded-full transition-colors",
                    categoryId ? "bg-[#0046B7]/10 text-[#0046B7]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
        </>
      )}
    </div>
  );
}
