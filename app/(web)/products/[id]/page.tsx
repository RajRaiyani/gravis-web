import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import { ProductImageGallery } from "@/components/pages/products/product-image-gallery";
import { AddEnquiryButton } from "@/components/pages/products/add-enquiry-button";
import { ChevronRight, Star, Truck, RefreshCcw, Gift } from "lucide-react";

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
  const validDetails = (product.technical_details ?? []).filter(
    (r) => r.label?.trim() || r.value?.trim()
  );
  const half = Math.ceil(validDetails.length / 2);
  const specsLeft  = validDetails.slice(0, half);
  const specsRight = validDetails.slice(half);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto container px-4 py-6 md:px-6 lg:px-8">

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href="/products" className="hover:text-foreground transition-colors">Product</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="text-foreground" aria-current="page">Product Description</span>
          <ChevronRight className="size-3.5 shrink-0" />
        </nav>

        {/* ── Main two-column grid ─────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6 xl:grid-cols-[45fr_55fr]">

          {/* ── LEFT: Image panel (rounded box with badges) ────────── */}
          <div className="relative rounded-2xl border border-border  bg-card p-4 shadow-sm md:p-5">
            <span className="absolute left-6 top-6 z-10 rounded-md border border-border bg-muted/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-sm md:left-7 md:top-7">
              Best Seller
            </span>
            <span className="absolute right-6 top-6 z-10 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm md:right-7 md:top-7">
              2 Year Warranty
            </span>
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

        {/* ── Perks bar (single rounded box, 3 columns) ─────────────── */}
        <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:grid-cols-3">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              sub: "On all orders over ₹500. Learn more.",
            },
            {
              icon: RefreshCcw,
              title: "Easy Returns",
              sub: "Extended returns through January 31. Returns Details.",
            },
            {
              icon: Gift,
              title: "Send It As A Gift",
              sub: "Add a free personalized note during checkout.",
            },
          ].map(({ icon: Icon, title, sub }, i) => (
            <div
              key={title}
              className={`flex items-start gap-3 bg-card px-5 py-4 ${
                i < 2
                  ? "border-b border-border sm:border-b-0 sm:border-r"
                  : ""
              }`}
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
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
            <button className="mt-5 inline-flex items-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Read More
            </button>
          </div>
        )}
      </div>

      {/* ── Specifications + Product Details (rounded boxes) ────────── */}
      {validDetails.length > 0 && (
        <div className="mx-auto container px-4 py-10 md:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">

            {/* Specifications */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h2 className="inline-block text-base font-bold text-primary border-b-2 border-primary pb-0.5">
                Specifications
              </h2>
              <div className="mt-5 divide-y divide-border">
                {specsLeft.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="font-medium text-foreground">{row.label}</span>
                    <span className="text-right text-muted-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h2 className="inline-block text-base font-bold text-primary border-b-2 border-primary pb-0.5">
                Product Details
              </h2>
              <div className="mt-5 space-y-5">
                {specsRight.map((row, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
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