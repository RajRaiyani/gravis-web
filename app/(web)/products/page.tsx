"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  productListQuerySchema,
  type ProductListQuery,
} from "@/lib/product-query-schema";
import type { Product } from "@/services/api/product.api";
import {
  listProductCategoriesClient,
  listCategoryBannersClient,
  getCategoryFiltersClient,
} from "@/services/api/product-category.api.client";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { ProductsFilters } from "@/components/pages/products/products-filters";
import { CategoryFiltersSidebar } from "@/components/pages/products/category-filters-sidebar";
import { ProductsPageBanner } from "@/components/pages/products/products-page-banner";

function getPrimaryImageUrl(product: Product): string | null {
  return (
    product.primary_image?.url ??
    product.images?.find((i) => i.is_primary)?.image?.url ??
    product.images?.[0]?.image?.url ??
    null
  );
}

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

function getQueryFromSearchParams(
  searchParams: ReturnType<typeof useSearchParams>
): ProductListQuery {
  const optionIds = searchParams.getAll("option_id");
  const raw: Record<string, string | string[]> = {
    category_id: searchParams.get("category_id") ?? "",
    search: searchParams.get("search") ?? "",
    option_id: optionIds.length ? optionIds : [],
  };
  const parsed = productListQuerySchema.safeParse(raw);
  return parsed.success
    ? parsed.data
    : {
        category_id: undefined,
        search: undefined,
        option_id: [],
      };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const query = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams]
  );

  const filterParams = useMemo(() => {
    const p: Record<string, string | number | string[]> = {};
    if (query.category_id) p.category_id = query.category_id;
    if (query.search) p.search = query.search;
    if (query.option_id?.length) p.option_id = query.option_id;
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

  const defaultBanner = useMemo(
    () => ({
      url: "/images/pages/home/hero-banner-1.png",
      alt: "Gravis promotional banner",
    }),
    []
  );

  const banner = useMemo(() => {
    if (!query.category_id) return defaultBanner;
    const categoryBanner = banners.find(
      (b) => b.id === query.category_id && b.banner_image?.url
    );
    return categoryBanner
      ? {
          url: categoryBanner.banner_image!.url,
          alt: categoryBanner.name ?? "Category banner",
        }
      : defaultBanner;
  }, [query.category_id, banners, defaultBanner]);

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-neutral-100">
      <ProductsPageBanner url={banner.url} alt={banner.alt} />

      <div className="mx-auto container px-4 md:px-0 lg:px-0">
        <div className="mb-4 lg:mb-6">
          <ProductsFilters
            initialSearch={query.search ?? ""}
            categoryId={query.category_id}
            categories={categories}
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <CategoryFiltersSidebar
            categories={categories}
            currentCategoryId={query.category_id}
            categoryFilters={categoryFilters}
            selectedOptionIds={query.option_id ?? []}
            search={query.search}
          />

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
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
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => {
                    const imageUrl = getPrimaryImageUrl(product);
                    const displayPrice = formatPrice(
                      product.sale_price_in_rupee
                    );
                    const mrpPrice = formatPrice(
                      Math.round(product.sale_price_in_rupee * 1.5)
                    );

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group block rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0046B7] hover:shadow-md"
                      >
                        <div className="flex h-full flex-col px-4 pt-4 pb-5">
                          <div className="relative rounded-2xl bg-slate-50 p-2">
                            {product.product_label && (
                              <div className="pointer-events-none absolute left-3 top-3">
                                <span className="pointer-events-auto inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                  {product.product_label}
                                </span>
                              </div>
                            )}

                            {product.warranty_label && (
                              <div className="pointer-events-none absolute bottom-3 right-3">
                                <span className="pointer-events-auto inline-flex items-center rounded-full bg-amber-300 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-md">
                                  {product.warranty_label}
                                </span>
                              </div>
                            )}

                            <div className="flex h-52 items-center justify-center">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  width={320}
                                  height={260}
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="size-52 w-auto object-contain"
                                  unoptimized={imageUrl.startsWith("http://")}
                                />
                              ) : (
                                <div className="flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                  <span>No image</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <p className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-[#0046B7]">
                              {product.name}
                            </p>
                            {product.category?.name && (
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                {product.category.name}
                              </p>
                            )}

                            {product.points?.length > 0 && (
                              <ul className="mt-1 space-y-1">
                                {product.points.slice(0, 3).map((point, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-1.5 text-[11px] text-slate-500"
                                  >
                                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#0046B7]" />
                                    <span className="line-clamp-2">
                                      {point}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-lg font-extrabold text-slate-900">
                                {displayPrice}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                {mrpPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
