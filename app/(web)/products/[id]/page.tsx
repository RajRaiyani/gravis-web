import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import { ProductImageGallery } from "@/components/pages/products/product-image-gallery";
import { AddEnquiryButton } from "@/components/pages/products/add-enquiry-button";
import { ChevronRight, Star, Truck, RefreshCcw, ShieldCheck } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

function getImageUrls(product: Product): string[] {
  const primary = product.primary_image?.url;
  const fromImages =
    product.images?.filter((i) => i.image?.url).map((i) => i.image!.url) ?? [];
  if (primary && !fromImages.includes(primary)) {
    return [primary, ...fromImages.filter((u) => u !== primary)];
  }
  return fromImages.length > 0 ? fromImages : [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const imageUrls = getImageUrls(product);
  const technicalRows = (product.technical_details ?? []).filter(
    (r) => r.label?.trim() || r.value?.trim()
  );
  const filterRows = product.filter_options ?? [];
  const hasSpecs = filterRows.length > 0 || technicalRows.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto container px-4 py-6 md:px-6 lg:px-8">

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="text-foreground truncate max-w-[180px] sm:max-w-none" aria-current="page">{product.name}</span>
        </nav>

        {/* ── Main two-column grid ─────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6 xl:grid-cols-[45fr_55fr]">

          {/* ── LEFT: Image panel (rounded box with badges from API) ────────── */}
          <div className="relative rounded-2xl border border-border  bg-card p-4 shadow-sm md:p-5">
            {product.product_label != null && product.product_label.trim() !== "" && (
              <span className="absolute left-6 top-6 z-10 rounded-md border border-border bg-muted/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-sm md:left-7 md:top-7">
                {product.product_label}
              </span>
            )}
            <ProductImageGallery images={imageUrls} productName={product.name} />
          </div>

          {/* ── RIGHT: Details panel (rounded box) ───────────────────── */}
          <div className="flex flex-col gap-0 rounded-2xl border-border bg-card shadow-sm overflow-hidden">

            {/* Block 1: Status + title + meta + price */}
            <div className="flex flex-col gap-3 border-b rounded-2xl border-border p-5 md:p-6">

              {/* In Stock */}
              <div>
                <span className="inline-flex items-center rounded-md border border-green-300 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  In Stock
                </span>
              </div>

              {/* Title */}
              <h1 className="text-base font-semibold leading-snug text-foreground md:text-[17px]">
                {product.name}
              </h1>

              {/* Category row */}
              {product.category && (
                <div className="flex flex-wrap items-center gap-x-8 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">Category: </span>
                    <Link
                      href={`/products?category_id=${product.category.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  </span>
                </div>
              )}

              {/* Special Price pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  ★ Special Price
                </span>

              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-foreground">
                  {formatPrice(product.sale_price_in_rupee)}
                </span>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < 4
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Perks: Shipping, Returns, Warranty */}
              <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-2xl border border-border bg-muted/20">
                <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 min-w-0" title="Free Shipping">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Truck className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">Free Shipping</span>
                </div>
                <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 min-w-0 border-x border-border" title="Easy Returns">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <RefreshCcw className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">Easy Returns</span>
                </div>
                <div className="flex items-center justify-center gap-2.5 px-4 py-3.5 min-w-0" title={product.warranty_label ?? "Warranty"}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {product.warranty_label?.trim() || "Warranty"}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Block 2: CTA buttons */}
            <div className="flex gap-3 border-b border-border px-5 py-4 md:px-6">
              {/* <AddToCartButton
                productId={product.id}
                productName={product.name}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              /> */}
              {/* <EnquireNowButton
                productId={product.id}
                productName={product.name}
                hasPendingInquiry={product.has_pending_inquiry}
                disabled={product.has_pending_inquiry}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#1e2d4a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#253660] disabled:cursor-not-allowed disabled:opacity-60"
              /> */}
              <AddEnquiryButton
                productId={product.id}
                productName={product.name}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#1e2d4a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#253660]"
              />
            </div>

            {/* Block 3: Bullet highlights (rounded box) */}
            {product.points && product.points.length > 0 && (
              <div className="m-4 rounded-2xl border border-border bg-muted/20 p-4 md:m-5 md:p-5">
                <ul className="space-y-2.5">
                  {product.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                      <span className="mt-1 shrink-0 text-foreground/60">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Description (rounded box) ─────────────────────────────── */}
        {product.description && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="inline-block text-base font-bold text-primary border-b-2 border-primary pb-0.5">
              Description
            </h2>
            <p className="mt-4 text-sm leading-7 text-foreground md:text-base md:leading-8">
              {product.description}
            </p>
           
          </div>
        )}
      </div>

      {/* ── Technical Details & Specifications (table format: key-value rows) ────────── */}
      {hasSpecs && (
        <div className="mx-auto container px-4 py-10 md:px-6 lg:px-8">
          <div
            className={`grid gap-6 md:gap-8 ${
              technicalRows.length > 0 && filterRows.length > 0
                ? "md:grid-cols-2"
                : "md:grid-cols-1 max-w-2xl"
            }`}
          >
            {/* Technical Details – table */}
            {technicalRows.length > 0 && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="border-b border-border bg-muted/30 px-5 py-3 md:px-6">
                  <h2 className="text-base font-bold text-primary">
                    Technical Details
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {technicalRows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-5 py-3 font-medium text-foreground align-top md:px-6">
                            {row.label}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground align-top md:px-6">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Specifications – table (filter_options) */}
            {filterRows.length > 0 && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="border-b border-border bg-muted/30 px-5 py-3 md:px-6">
                  <h2 className="text-base font-bold text-primary">
                    Specifications
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {filterRows.map((row, i) => (
                        <tr
                          key={row.filter_option_id ?? i}
                          className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-5 py-3 font-medium text-foreground align-top md:px-6">
                            {row.filter_name}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground align-top md:px-6">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Back to products ─────────────────────────────────────── */}
      <div className="mx-auto container px-4 pb-12 md:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <ChevronRight className="size-4 rotate-180" />
          Back to products
        </Link>
      </div>
    </div>
  );
}