"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 700;

export function ProductsFilters({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value, DEBOUNCE_MS);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue === (searchParams.get("search") ?? "")) return;
    if (!debouncedValue && debouncedValue === "") {
      params.delete("search");
    } else {
      params.set("search", debouncedValue);
    }
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }, [debouncedValue, pathName, router, searchParams]);

  return (
    <div
      className={cn(
        "group/search relative mb-2 flex flex-row items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 shadow-sm ring-slate-200/50 transition-all duration-200 focus-within:border-[#0046B7] focus-within:ring-2 focus-within:ring-[#0046B7]/20 focus-within:shadow-md",
        className,
      )}
    >
      <Search
        className="size-5 shrink-0 text-slate-400 transition-colors group-focus-within/search:text-[#0046B7]"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products by name..."
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
        aria-label="Search products"
        autoComplete="off"
      />
    </div>
  );
}
