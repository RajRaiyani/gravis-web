"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/services/api/product-category.api";

interface CategoryCarouselProps {
  categories: ProductCategory[];
}

const CARD_GAP = 24;
const CARD_WIDTH = 280;
const VISIBLE_CARDS = 4;

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const maxIndex = Math.max(0, categories.length - VISIBLE_CARDS);
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
  }, [categories.length, handleScroll]);

  if (!categories.length) return null;

  return (
    <div className="container">
      <div className="flex gap-6 overflow-x-auto py-4 scroll-smooth snap-x snap-mandatory px-1 scrollbar-hide md:gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="min-w-80 p-7 snap-center py-10 bg-muted rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  fill
                  sizes="280px"
                  className="object-cover rounded-xl"
                  unoptimized={category.image.url.startsWith("http://")}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <span className="text-4xl opacity-50">?</span>
                </div>
              )}
            </div>
            <div className="mt-14">
              <p className="line-clamp-2 text-lg text-left font-extrabold">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {categories.length > VISIBLE_CARDS && (
        <div className="absolute right-0 top-0 flex h-[calc(280px+4rem)] items-start pt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-border bg-background/95 shadow-sm hover:bg-muted"
            onClick={() => scrollToIndex(scrollIndex + 1)}
            disabled={!canScrollNext}
            aria-label="Next categories"
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

      {categories.length > 1 && (
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
