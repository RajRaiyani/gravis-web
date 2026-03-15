import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import { ProductImageGallery } from "@/components/pages/products/product-image-gallery";
import { AddEnquiryButton } from "@/components/pages/products/add-enquiry-button";
import { ChevronRight, Star, MessageCircle, ShieldCheck } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import Constants from "@/config/constant";

// ─── SEO ──────────────────────────────────────────────────────────────────────

const siteUrl = "https://gravisindia.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const title = product.name;
  const rawDescription =
    product.description?.trim() ||
    (product.points?.length
      ? product.points.slice(0, 3).join(". ")
      : undefined) ||
    `${product.name} – available at Gravis India. Explore specifications, pricing, and enquire now.`;
  const description =
    rawDescription.length > 160
      ? rawDescription.slice(0, 157) + "…"
      : rawDescription;

  const canonicalUrl = `${siteUrl}/products/${id}`;
  const primaryImage =
    product.primary_image?.url ?? `${siteUrl}/logos/primary.svg`;

  const keywords = [
    product.name,
    product.category?.name,
    ...(product.tags ?? []),
    "Gravis India",
    "power solutions",
    "generators",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "Gravis India",
      title,
      description,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      countryName: "India",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  };
}

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
    (r) => r.label?.trim() || r.value?.trim(),
  );
  const filterRows = product.filter_options ?? [];
  const hasSpecs = filterRows.length > 0 || technicalRows.length > 0;
  const primarySpecs = technicalRows
    .map((row) => ({
      label: row.label,
      value: row.value,
    }))
    .filter((row) => row.label?.trim() && row.value?.trim())
    .slice(0, 6);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Gravis India",
    },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.sale_price_in_rupee,
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${product.id}`,
      seller: {
        "@type": "Organization",
        name: "Gravis India",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto container px-4 py-6 md:px-6 lg:px-8">
        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground sm:mb-6 sm:text-sm">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link
            href="/products"
            className="transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span
            className="max-w-[60%] truncate text-foreground sm:max-w-none"
            aria-current="page"
          >
            {product.name}
          </span>
        </nav>

        {/* ── Main two-column grid ─────────────────────────────────── */}
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6 xl:grid-cols-[45fr_55fr]">
          {/* ── LEFT: Image panel ───────────────────────────────────── */}
          <div className="relative rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4 md:p-5">
            <ProductImageGallery
              images={imageUrls}
              productName={product.name}
            />
          </div>

          {/* ── RIGHT: Details panel (rounded box) ───────────────────── */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border-border bg-card shadow-sm">
            {/* Block 1: Status + title + meta + price */}
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:rounded-2xl sm:p-5 md:p-6">
              {/* Title + product label row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-base font-semibold leading-snug text-foreground sm:text-[17px] md:text-lg">
                  {product.name}
                </h1>

                {product.product_label?.trim() && (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
                      {product.product_label}
                    </span>
                  </div>
                )}
              </div>

              {/* Category row */}
              {product.category && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:gap-x-8 sm:text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Category:{" "}
                    </span>
                    <Link
                      href={`/products?category_id=${product.category.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  </span>
                </div>
              )}
              {technicalRows.length > 0 && (
                <div className="">
                  <div className="border-b border-border bg-muted/30 py-3">
                    <h2 className="text-base font-bold text-primary">
                      Technical Details
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="">
                        {technicalRows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b odd:bg-gray-200 border-border"
                          >
                            <td className="py-2 px-2 font-semibold text-foreground align-top">
                              {row.label}
                            </td>
                            <td className="py-2 font-bold align-top">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* {primarySpecs.length > 0 && (
                <div className="">
                  <dl className="my-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3">
                    {primarySpecs.map((spec, index) => (
                      <div key={index} className="flex flex-col">
                        <dt className="text-base font-semibold text-foreground">
                          {spec.value}
                        </dt>
                        <dd className="mt-1 text-[12px] text-muted-foreground">
                          {spec.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )} */}
              {/* Block 3: Bullet highlights + key specifications */}
              {(product.points && product.points.length > 0) ||
              primarySpecs.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {product.points && product.points.length > 0 && (
                    <ul className="space-y-2.5">
                      {product.points.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-md font-bold leading-relaxed"
                        >
                          <CircleCheckBig className="size-5 text-green-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}

              {/* Price + warranty label */}
              <div className="flex mt-2 flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  {formatPrice(product.sale_price_in_rupee)}
                </span>
                {product.warranty_label?.trim() && (
                  <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-primary bg-primary/90 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm sm:text-md">
                    <ShieldCheck className="size-5 shrink-0" aria-hidden />
                    {product.warranty_label}
                  </span>
                )}
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1">
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
            <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:px-5 md:px-6">
              <a
                href={`https://wa.me/91${Constants.contact_details.technicalSupportPhoneNumber}?text=${encodeURIComponent(
                  `I have an enquiry about ${product.name} \n https://gravisindia.com/products/${product.id}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1ebe5a]"
              >
                <MessageCircle className="size-4" aria-hidden />
                <span>WhatsApp Enquiry</span>
              </a>
              <AddEnquiryButton
                productId={product.id}
                productName={product.name}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#1e2d4a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#253660]"
              />
            </div>
          </div>
        </div>

        {/* ── Description (rounded box) ─────────────────────────────── */}
        {product.description && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mt-10 md:p-6">
            <h2 className="inline-block border-b-2 border-primary pb-0.5 text-base font-bold text-primary">
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
            {/* {technicalRows.length > 0 && (
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
            )} */}

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
