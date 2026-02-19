import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import {
  listProductCategories,
  listCategoryBanners,
} from "@/services/api/product-category.api";
import {
  productListQuerySchema,
  type ProductListQuery,
} from "@/lib/product-query-schema";
import { ProductsFilters } from "@/components/pages/products/products-filters";
import { ProductCategorySidebar } from "@/components/pages/products/product-category-sidebar";
import { ProductsPageBanner } from "@/components/pages/products/products-page-banner";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

function normalizeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    const single = Array.isArray(value) ? value[0] : value;
    if (single !== undefined) out[key] = single;
  }
  return out;
}

function buildProductsQueryString(params: ProductListQuery): string {
  const q: Record<string, string> = {
    offset: String(params.offset),
    limit: String(params.limit),
  };
  if (params.category_id) q.category_id = params.category_id;
  if (params.search) q.search = params.search;
  return new URLSearchParams(q).toString();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const normalized = normalizeSearchParams(resolved);
  const parsed = productListQuerySchema.safeParse(normalized);

  const query: ProductListQuery = parsed.success
    ? parsed.data
    : {
        offset: 0,
        limit: 30,
        category_id: undefined,
        search: undefined,
      };

  const apiParams: Record<string, string | number> = {
    offset: query.offset,
    limit: query.limit,
  };
  if (query.category_id) apiParams.category_id = query.category_id;
  if (query.search) apiParams.search = query.search;

  const [products, categories, banners] = await Promise.all([
    listProducts(apiParams),
    listProductCategories(),
    listCategoryBanners().catch(() => []),
  ]);

  const defaultBanner = {
    url: "/images/pages/home/hero-banner-1.png",
    alt: "Gravis promotional banner",
  };
  const categoryBanner = query.category_id
    ? banners.find(
        (b) => b.id === query.category_id && b.banner_image?.url,
      )
    : null;
  const banner = categoryBanner
    ? {
        url: categoryBanner.banner_image!.url,
        alt: categoryBanner.name ?? "Category banner",
      }
    : defaultBanner;

  const hasNext = products.length === query.limit;
  const nextOffset = query.offset + query.limit;
  const prevOffset = Math.max(0, query.offset - query.limit);

  const nextQuery = { ...query, offset: nextOffset };
  const prevQuery = { ...query, offset: prevOffset };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* <header className="mb-8">
          <h1 className="font-michroma text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our range of generators and equipment
          </p>
        </header> */}

        <ProductsPageBanner url={banner.url} alt={banner.alt} />

        <div className="flex flex-col gap-8 lg:flex-row">
          <ProductCategorySidebar
            categories={categories}
            currentCategoryId={query.category_id}
            search={query.search}
            limit={query.limit}
          />

          <div className="min-w-0 flex-1">
            <ProductsFilters
              initialSearch={query.search ?? ""}
              categoryId={query.category_id}
              limit={query.limit}
            />

            {!products.length ? (
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
                      product.sale_price_in_rupee,
                    );
                    const mrpPrice = formatPrice(
                      Math.round(product.sale_price_in_rupee * 1.5),
                    );

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group block rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0046B7] hover:shadow-md"
                      >
                        <div className="flex h-full flex-col px-4 pt-4 pb-5">
                          <div className="relative rounded-2xl bg-slate-50 p-2">
                            {/* Product label - top left pill */}
                            {product.product_label && (
                              <div className="pointer-events-none absolute left-3 top-3">
                                <span className="pointer-events-auto inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                  {product.product_label}
                                </span>
                              </div>
                            )}

                            {/* Warranty label - bottom right pill */}
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
                                {product.points
                                  .slice(0, 3)
                                  .map((point, index) => (
                                    <li
                                      // eslint-disable-next-line react/no-array-index-key
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

                <nav
                  className="mt-10 flex items-center justify-center gap-4"
                  aria-label="Products pagination"
                >
                  {query.offset > 0 ? (
                    <Link
                      href={`/products?${buildProductsQueryString(prevQuery)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                      <ChevronLeft className="size-4" />
                      Previous
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {query.offset + 1}–{query.offset + products.length}
                  </span>
                  {hasNext ? (
                    <Link
                      href={`/products?${buildProductsQueryString(nextQuery)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                      Next
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
