import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import { listProductCategories } from "@/services/api/product-category.api";
import {
  productListQuerySchema,
  type ProductListQuery,
} from "@/lib/product-query-schema";
import { ProductsFilters } from "@/components/pages/products/products-filters";
import { ProductCategorySidebar } from "@/components/pages/products/product-category-sidebar";
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
  searchParams: Record<string, string | string[] | undefined>
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

  const [products, categories] = await Promise.all([
    listProducts(apiParams),
    listProductCategories(),
  ]);

  const hasNext = products.length === query.limit;
  const nextOffset = query.offset + query.limit;
  const prevOffset = Math.max(0, query.offset - query.limit);

  const nextQuery = { ...query, offset: nextOffset };
  const prevQuery = { ...query, offset: prevOffset };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-michroma text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our range of generators and equipment
          </p>
        </header>

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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => {
                    const imageUrl = getPrimaryImageUrl(product);
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-white p-5 shadow-md transition-colors hover:border-primary/20"
                      >
                        <div className="flex px-4 justify-center">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              width={280}
                              height={280}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                              unoptimized={imageUrl.startsWith("http://")}
                            />
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                          <p className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary">
                            {product.name}
                          </p>
                          {product.category?.name && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {product.category.name}
                            </p>
                          )}
                          {product.points?.length > 0 && (
                            <ul className="mt-3 line-clamp-3 space-y-1 border-t border-border/60 pt-3">
                              {product.points.slice(0, 3).map((point, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                                  <span className="line-clamp-2">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <p className="mt-4 text-xl font-extrabold text-foreground">
                          {formatPrice(product.sale_price_in_rupee)}
                        </p>
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
