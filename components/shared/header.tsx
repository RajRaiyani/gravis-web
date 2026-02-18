import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { HeaderDesktopNav } from "./header/HeaderDesktopNav";
import { HeaderMobileMenu } from "./header/HeaderMobileMenu";

export default function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-white/95 backdrop-blur-md shadow-sm",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/" className="flex flex-col leading-none">
            <Image
              src="/logos/primary.svg"
              alt="Gravis"
              height={100}
              width={250}
              className="h-auto w-auto max-w-[150px] md:max-w-[250px]"
            />
          </Link>
          <span className="hidden border-l border-slate-200 pl-3 text-xs font-medium text-[#0046B7] md:inline">
            &quot; Powering Your World, Reliably &quot;
          </span>
        </div>

        <HeaderDesktopNav />

        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/contact"
            className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 md:inline-flex md:items-center"
          >
            Contact Us
          </Link>
          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
