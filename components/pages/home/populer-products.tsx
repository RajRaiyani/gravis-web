import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/services/api/product.api";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/services/api/product.api";

function getPrimaryImageUrl(product: Product): string | null {
  const primary = product.images?.find((i) => i.is_primary)?.image;
  const first = product.images?.[0]?.image;
  return primary?.url ?? first?.url ?? null;
}

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

export const PopularProducts = async () => {
  const products = await listProducts({ limit: 8 });

  if (!products?.length) {
    return (
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Popular products
          </h2>
          <p className="mt-3 text-muted-foreground">
            No products yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 bg-muted/30 py-16 md:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col items-center gap-4 text-center md:mb-12 md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Popular Products
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground md:mx-0 md:text-lg">
              Bestsellers and customer favorites
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid grid-cols-4 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const imageUrl = getPrimaryImageUrl(product);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group shadow-md space-y-4 bg-white p-7 flex h-full flex-col overflow-hidden rounded-xl border border-border/60 transition-colors hover:border-primary/20"
              >
                <div className="px-2">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover relative"
                      unoptimized={imageUrl.startsWith("http://")}
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary">
                    {product.name}
                  </p>
                  {product.points?.length > 0 && (
                    <ul className="mt-3 line-clamp-4 space-y-1.5 border-t border-border/60 pt-3">
                      {product.points.slice(0, 4).map((point, i) => (
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
                <p className="text-xl font-extrabold">
                  {formatPrice(product.sale_price_in_rupee)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
