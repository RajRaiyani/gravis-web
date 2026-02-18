import Link from "next/link";
import Image from "next/image";
import { listFeaturedProducts, type Product } from "@/services/api/product.api";

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

export const PopularProducts = async () => {
  const products = await listFeaturedProducts({ limit: 8 });

  if (!products?.length) {
    return (
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white px-5 py-8 text-center shadow-sm md:px-8">
          <h2 className="mb-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
            Special deals on best sellers
          </h2>
          <p className="text-sm text-slate-500">
            No products yet. Please check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 bg-muted">
      <div className="mx-auto container">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Special deals on best sellers
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
              Industry.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-[#0046B7] hover:underline md:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const imageUrl = getPrimaryImageUrl(product);
            const displayPrice = formatPrice(product.sale_price_in_rupee);
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
                  <div className="relative rounded-2xl bg-slate-50 px-4 pt-3 pb-4">
                    {product.product_label && (
                      <span className="absolute left-4 top-3 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                        {product.product_label}
                      </span>
                    )}
                    <div className="mt-6 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={220}
                          height={160}
                          className="h-40 w-auto object-contain"
                          unoptimized={imageUrl.startsWith("http://")}
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <span className="text-2xl font-semibold">?</span>
                        </div>
                      )}
                    </div>
                    {product.warranty_label && (
                      <span className="absolute bottom-3 right-4 rounded-full bg-[#FFD95A] px-3 py-1 text-[10px] font-bold uppercase text-slate-900">
                        {product.warranty_label}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="line-clamp-2 text-base font-bold text-slate-800 group-hover:text-[#0046B7]">
                      {product.name}
                    </p>

                    {product.points?.length > 0 && (
                      <ul className="mt-1 space-y-2">
                        {product.points.slice(0, 3).map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-1.5 text-sm text-gray-700"
                          >
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#0046B7]" />
                            <span className="line-clamp-2">{point}</span>
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
                      <span className="rounded-full bg-[#FFE5E5] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#FF4B4B]">
                        57% Off
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
