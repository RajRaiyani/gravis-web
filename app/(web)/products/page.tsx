"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  productListQuerySchema,
  type ProductListQuery,
} from "@/lib/product-query-schema";
import { ProductCard } from "@/components/shared/product-card";
import {
  listProductCategoriesClient,
  listCategoryBannersClient,
  getCategoryFiltersClient,
} from "@/services/api/product-category.api.client";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { ProductsFilters } from "@/components/pages/products/products-filters";
import { CategoryFiltersSidebar } from "@/components/pages/products/category-filters-sidebar";
import { ProductsPageBanner } from "@/components/pages/products/products-page-banner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { XIcon } from "lucide-react";

function getQueryFromSearchParams(
  searchParams: ReturnType<typeof useSearchParams>,
): ProductListQuery {
  const optionIds = searchParams.getAll("option_ids");
  const raw: Record<string, string | string[]> = {
    category_id: searchParams.get("category_id") ?? "",
    search: searchParams.get("search") ?? "",
    option_ids: optionIds.length ? optionIds : [],
  };
  const parsed = productListQuerySchema.safeParse(raw);
  return parsed.success
    ? parsed.data
    : {
        category_id: undefined,
        search: undefined,
        option_ids: [],
      };
}

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto container px-4 md:px-6 lg:px-8 py-6">
        <div className="h-8 max-w-md animate-pulse rounded bg-slate-200 mb-6" />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          </div>
          <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="h-52 animate-pulse rounded-lg bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 max-w-[85%] animate-pulse rounded bg-slate-100" />
                  <div className="h-3 max-w-[50%] animate-pulse rounded bg-slate-100" />
                  <div className="h-6 max-w-[35%] animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const query = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams],
  );

  const filterParams = useMemo(() => {
    const p: Record<string, string | number | string[]> = {};
    if (query.category_id) p.category_id = query.category_id;
    if (query.search) p.search = query.search;
    if (query.option_ids?.length) p.option_ids = query.option_ids;
    return p;
  }, [query]);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: listProductCategoriesClient,
  });

  const { data: banners = [] } = useQuery({
    queryKey: ["category-banners"],
    queryFn: listCategoryBannersClient,
  });

  const {
    products,
    isLoading: productsLoading,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfiniteProducts({ filterParams });

  const { data: categoryFilters = [] } = useQuery({
    queryKey: ["category-filters", query.category_id],
    queryFn: () =>
      query.category_id
        ? getCategoryFiltersClient(query.category_id)
        : Promise.resolve([]),
    enabled: !!query.category_id,
  });

  const banner = useMemo(() => {
    if (!query.category_id) return null;
    const categoryBanner = banners.find(
      (b) => b.id === query.category_id && b.banner_image?.url,
    );
    return categoryBanner
      ? {
          url: categoryBanner.banner_image!.url,
          alt: categoryBanner.name ?? "Category banner",
        }
      : null;
  }, [query.category_id, banners]);

  const isLoading = productsLoading || categoriesLoading;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sidebarProps = {
    categories,
    currentCategoryId: query.category_id,
    categoryFilters,
    selectedOptionIds: query.option_ids ?? [],
    search: query.search,
  };
  const sidebarPropsEmbedded = {
    ...sidebarProps,
    embedded: true,
    onApplyFilters: () => setFiltersOpen(false),
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {banner ? <ProductsPageBanner url={banner.url} alt={banner.alt} /> : null}

      <div className="sticky top-22 z-40 lg:hidden bg-transparent">
        <div className="mx-2 mt-4 md:container md:mx-auto lg:py-0">
          <ProductsFilters onOpenFilters={() => setFiltersOpen(true)} />
        </div>
      </div>

      <div className="mx-auto container px-2 md:px-0 lg:px-0">
        <div className="mb-4 lg:mb-6"></div>

        {/* Bottom sheet: categories + filters (mobile only) */}
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent
            side="right"
            className="w-[88vw] max-w-[360px] rounded-md p-2"
            showCloseButton={false}
          >
            <SheetHeader className="border-b border-slate-100 px-4 py-3">
              <SheetTitle className="text-base">
                Categories & Filters
              </SheetTitle>
              <SheetClose asChild>
                <button type="button" className="absolute top-4 right-4">
                  <XIcon className="size-6" />
                </button>
              </SheetClose>
            </SheetHeader>

            <CategoryFiltersSidebar {...sidebarPropsEmbedded} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop sidebar – hidden on mobile (shown in sheet) */}
          <div className="hidden lg:block">
            <CategoryFiltersSidebar {...sidebarProps} />
          </div>

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="h-52 animate-pulse rounded-lg bg-slate-100" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                      <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !products.length ? (
              <div className="rounded-xl border border-border/60 bg-muted/30 px-6 py-16 text-center">
                <p className="text-muted-foreground">
                  No products found. Try adjusting your search or filters.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <div className="hidden lg:block lg:static top-28 z-40 w-full bg-transparent">
                  <ProductsFilters />
                </div>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div
                  ref={loadMoreRef}
                  className="flex min-h-20 items-center justify-center py-6"
                  aria-hidden
                >
                  {isFetchingNextPage && (
                    <div className="flex gap-2">
                      <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-slate-400" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
