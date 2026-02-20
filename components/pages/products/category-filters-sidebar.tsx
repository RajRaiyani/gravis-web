"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type {
  ProductCategory,
  CategoryFilterWithOptions,
} from "@/services/api/product-category.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";

const ALL_CATEGORIES_VALUE = "__all__";

interface CategoryFiltersSidebarProps {
  categories: ProductCategory[];
  currentCategoryId: string | undefined;
  categoryFilters: CategoryFilterWithOptions[];
  selectedOptionIds: string[];
  search: string | undefined;
  /** When true (e.g. inside bottom sheet), use full height and no sticky so parent controls scroll */
  embedded?: boolean;
}

function buildBaseUrl(params: {
  categoryId?: string;
  search?: string;
  optionIds?: string[];
}): string {
  const sp = new URLSearchParams();
  if (params.categoryId) sp.set("category_id", params.categoryId);
  if (params.search) sp.set("search", params.search);
  if (params.optionIds?.length) {
    params.optionIds.forEach((id) => sp.append("option_id", id));
  }
  return `/products?${sp.toString()}`;
}

function buildOptionToggleUrl(
  current: string[],
  optionId: string,
  base: { categoryId?: string; search?: string }
): string {
  const next = current.includes(optionId)
    ? current.filter((id) => id !== optionId)
    : [...current, optionId];
  return buildBaseUrl({ ...base, optionIds: next.length ? next : undefined });
}

export function CategoryFiltersSidebar({
  categories,
  currentCategoryId,
  categoryFilters,
  selectedOptionIds,
  search,
  embedded = false,
}: CategoryFiltersSidebarProps) {
  const router = useRouter();
  const base = {
    categoryId: currentCategoryId,
    search,
  };

  const categoryValue = currentCategoryId ?? ALL_CATEGORIES_VALUE;
  const hasActiveFilters = selectedOptionIds.length > 0;
  const clearFiltersUrl = buildBaseUrl({ categoryId: currentCategoryId, search });

  const onCategoryChange = (value: string) => {
    const categoryId = value === ALL_CATEGORIES_VALUE ? undefined : value;
    const url = buildBaseUrl({ categoryId, search });
    router.replace(url, { scroll: false });
  };

  const onFilterOptionClick = useCallback(
    (url: string) => {
      router.replace(url, { scroll: false });
    },
    [router]
  );

  return (
    <div
      className={cn(
        "w-full shrink-0",
        !embedded && "lg:w-72 xl:w-80 lg:sticky lg:top-24 lg:self-start"
      )}
      aria-label="Category and filters"
    >
      <aside className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div
          className={cn(
            "flex flex-col",
            embedded
              ? "max-h-full overflow-y-auto"
              : "max-h-[85vh] overflow-y-auto lg:max-h-[calc(100vh-7rem)]"
          )}
        >
          {/* Category section */}
          <section
            aria-label="Category filter"
            className="border-b border-slate-100 bg-slate-50/80 px-4 py-4"
          >
            <div className="mb-2.5 flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </h2>
            </div>
            <Select value={categoryValue} onValueChange={onCategoryChange}>
              <SelectTrigger
                aria-label="Select category"
                className="h-11 w-full border-slate-200 bg-white shadow-xs transition-colors hover:border-slate-300 focus:ring-2 focus:ring-[#0046B7]/20"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent align="start" className="max-h-[min(70vh,20rem)]">
                <SelectItem value={ALL_CATEGORIES_VALUE}>
                  All categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Filters section */}
          {currentCategoryId && (
            <section aria-label="Filters" className="flex flex-1 flex-col px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <SlidersHorizontal className="size-4" aria-hidden />
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <span className="rounded-full bg-[#0046B7] px-2 py-0.5 text-[10px] font-medium text-white">
                      {selectedOptionIds.length}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => router.replace(clearFiltersUrl, { scroll: false })}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="size-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {categoryFilters.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-500">
                  No filters for this category.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {categoryFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                      <h3 className="mb-2.5 text-sm font-semibold text-slate-800">
                        {filter.name}
                      </h3>
                      <ul className="flex flex-col gap-0.5">
                        {filter.options.map((option) => {
                          const isChecked = selectedOptionIds.includes(option.id);
                          const toggleUrl = buildOptionToggleUrl(
                            selectedOptionIds,
                            option.id,
                            base
                          );
                          return (
                            <li key={option.id}>
                              <button
                                type="button"
                                onClick={() => onFilterOptionClick(toggleUrl)}
                                className={cn(
                                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                                  isChecked
                                    ? "text-[#0046B7]"
                                    : "text-slate-700 hover:bg-slate-100/80"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors",
                                    isChecked
                                      ? "border-[#0046B7] bg-[#0046B7] text-white"
                                      : "border-slate-300 bg-white"
                                  )}
                                  aria-hidden
                                >
                                  {isChecked ? (
                                    <svg
                                      className="size-3"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : null}
                                </span>
                                <span className="font-medium">{option.value}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
