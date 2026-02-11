import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/api/product.api";
import type { Product } from "@/services/api/product.api";
import { ProductImageGallery } from "@/components/pages/products/product-image-gallery";
import { AddToCartButton } from "@/components/pages/products/add-to-cart-button";
import { EnquireNowButton } from "@/components/pages/products/enquire-now-button";
import { ChevronRight, Check } from "lucide-react";

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const imageUrls = getImageUrls(product);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto container px-4 py-8 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4 shrink-0" />
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="size-4 shrink-0" />
          <span className="truncate text-foreground" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image gallery */}
          <ProductImageGallery images={imageUrls} productName={product.name} />

          {/* Details */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/products?category_id=${product.category.id}`}
                className="mb-2 text-sm font-medium text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-extrabold text-foreground">
              {formatPrice(product.sale_price_in_rupee)}
            </p>

            {product.description && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h2>
                <p className="mt-2 text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.points && product.points.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Highlights
                </h2>
                <ul className="mt-3 space-y-2">
                  {product.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-foreground"
                    >
                      <span className="mt-1 shrink-0 text-primary">
                        <Check className="size-4" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
              />
              <EnquireNowButton
                productId={product.id}
                productName={product.name}
                hasPendingInquiry={product.has_pending_inquiry}
                disabled={product.has_pending_inquiry}
                className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-muted disabled:text-muted-foreground disabled:bg-muted disabled:hover:bg-muted"
              />
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Back to products
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto container p-4 py-7">
        {product.technical_details && product.technical_details.length > 0 && (
          <div className="">
            <h2 className="text-lg font-semibold text-primary uppercase tracking-wide">
              Technical details
            </h2>
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <table className="w-full font-bold min-w-[280px] border border-collapse">
                <tbody>
                  {product.technical_details.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}
                    >
                      <td className="border px-4 py-3 font-medium text-muted-foreground last:border-b-0">
                        {row.label}
                      </td>
                      <td className="border px-4 py-3 text-foreground last:border-b-0">
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
  );
}
