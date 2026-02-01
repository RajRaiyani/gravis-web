"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/services/api/product.api";

interface ProductCarouselProps {
  products: Product[];
}

const CARD_GAP = 24;
const CARD_WIDTH = 280;
const VISIBLE_CARDS = 4;

function getPrimaryImageUrl(product: Product): string | null {
  const primary = product?.primary_image?.url;
  return primary ?? null;
}

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const maxIndex = Math.max(0, products.length - VISIBLE_CARDS);
  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(index, maxIndex));
      const offset = clamped * (CARD_WIDTH + CARD_GAP);
      el.scrollTo({ left: offset, behavior: "smooth" });
      setScrollIndex(clamped);
    },
    [maxIndex]
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const index = Math.round(scrollLeft / (CARD_WIDTH + CARD_GAP));
    setScrollIndex(Math.min(index, maxIndex));
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, [maxIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [products.length, handleScroll]);

  if (!products.length) return null;

  return (
    <div className="relative w-full">
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth px-1 scrollbar-hide md:gap-8">
        {products.map((product) => {
          const imageUrl = getPrimaryImageUrl(product);
          return (
            <div
              key={product.id}
              className="group bg-white flex h-full flex-col overflow-hidden rounded-xl border border-border/60 transition-colors hover:border-primary/20 "
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={imageUrl.startsWith("http://")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <span className="text-4xl opacity-50">?</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col px-4 py-4">
                <p className="line-clamp-2 text-left font-semibold text-foreground group-hover:text-primary">
                  {product.name}
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  {formatPrice(product.sale_price_in_rupee)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {products.length > VISIBLE_CARDS && (
        <div className="absolute right-0 top-0 flex h-[calc(280px+5rem)] items-start pt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-border bg-background/95 shadow-sm hover:bg-muted"
            onClick={() => scrollToIndex(scrollIndex + 1)}
            disabled={!canScrollNext}
            aria-label="Next products"
          >
            <svg
              width="20"
              height="20"
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

      {products.length > 1 && (
        <div className="mt-6 flex justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className="h-1.5 rounded-full transition-all aria-[current]:w-6"
              style={{
                width: scrollIndex === i ? 24 : 6,
                backgroundColor:
                  scrollIndex === i
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                opacity: scrollIndex === i ? 1 : 0.4,
              }}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={scrollIndex === i ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
