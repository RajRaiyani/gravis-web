"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/services/api/product.api";

interface PopularProductsCarouselProps {
  products: Product[];
}

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

export function PopularProductsCarousel({
  products,
}: PopularProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      ro.disconnect();
    };
  }, [updateScrollButtons]);

  const scrollByAmount = (direction: "next" | "prev") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "next" ? 320 : -320;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-4 scroll-smooth snap-x snap-mandatory px-1 scrollbar-hide md:gap-7"
      >
        {products.map((product) => {
          const imageUrl = getPrimaryImageUrl(product);
          const displayPrice = formatPrice(product.sale_price_in_rupee);
          const mrpPrice = formatPrice(
            Math.round(product.sale_price_in_rupee * 1.5)
          );

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block min-w-[260px] max-w-[280px] snap-start rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0046B7] hover:shadow-md"
            >
              <div className="flex h-full flex-col px-4 pt-4 pb-5">
                <div className="relative rounded-2xl bg-slate-50 px-4 pt-3 pb-4">
                  <span className="absolute left-4 top-3 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                    Best Seller
                  </span>
                  <div className="mt-8 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={220}
                        height={160}
                        className="h-32 w-auto object-contain"
                        unoptimized={imageUrl.startsWith("http://")}
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <span className="text-2xl font-semibold">?</span>
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-4 rounded-full bg-[#FFD95A] px-3 py-1 text-[10px] font-bold uppercase text-slate-900">
                    2 Year Warranty
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-[#0046B7]">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        className="h-3.5 w-3.5 fill-current"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm group-hover:border-[#0046B7] group-hover:text-[#0046B7]">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <span className="flex flex-1 items-center justify-center rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors group-hover:bg-[#0046B7]">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {products.length > 3 && (
        <div className="pointer-events-none absolute -top-12 right-0 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0046B7] hover:text-[#0046B7]"
            onClick={() => scrollByAmount("prev")}
            disabled={!canScrollPrev}
            aria-label="Previous products"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0046B7] hover:text-[#0046B7]"
            onClick={() => scrollByAmount("next")}
            disabled={!canScrollNext}
            aria-label="Next products"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}

