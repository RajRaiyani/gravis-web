"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useListProductCategories } from "@/hooks/product-category.hook";

function ProductCategoriesMenu({ active }: { active: boolean }) {
  const { data: categories } = useListProductCategories();
  const router = useRouter();

  return (
    <NavigationMenu viewport={false} className="flex-none">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "rounded-none border-none bg-transparent px-1 py-1 text-sm font-medium shadow-none hover:bg-transparent focus:bg-transparent focus:outline-none data-[state=open]:bg-transparent",
              active ? "text-[#0046B7]" : "text-slate-600 hover:text-[#0046B7]",
            )}
            onClick={(e) => {
              e.preventDefault();
              router.push("/products");
            }}
          >
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-4 left-1/2 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="grid scrollbar-hide gap-4 p-5 grid-cols-3 min-w-[70svw] max-h-[50svh] overflow-y-auto">
              {(categories ?? []).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category_id=${category.id}`}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:border-[#0046B7] hover:bg-slate-50"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {category.image?.url ? (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized={category.image.url.startsWith("http://")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{category.name}</p>
                </Link>
              ))}
              {!categories?.length && (
                <div className="flex items-center justify-center py-4 text-xs text-slate-500">
                  Loading categories...
                </div>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function HeaderDesktopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium text-slate-700 md:flex"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className={cn(
          "inline-flex items-center gap-1.5 px-1 py-1 transition-colors",
          isActive("/") ? "text-[#0046B7]" : "text-slate-600 hover:text-[#0046B7]",
        )}
      >
        Home
      </Link>
      <span className="text-slate-300" aria-hidden>
        |
      </span>
      <Link
        href="/about"
        className={cn(
          "inline-flex items-center gap-1.5 px-1 py-1 transition-colors",
          isActive("/about") ? "text-[#0046B7]" : "text-slate-600 hover:text-[#0046B7]",
        )}
      >
        About us
      </Link>
      <span className="text-slate-300" aria-hidden>
        |
      </span>
      <ProductCategoriesMenu active={isActive("/products")} />
    </nav>
  );
}
