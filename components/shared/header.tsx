"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X, ShoppingCart, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact us" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: cart } = useGetCart();
  const cartItemCount = cart?.items.length ?? 0;
  const { authUser, isLoggedIn, logout } = useAuth();

  const userInitials = useMemo(() => {
    if (!authUser) return "";
    const first = authUser.first_name ?? "";
    const last = authUser.last_name ?? "";
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return (firstInitial + lastInitial) || (authUser.email?.[0] ?? "").toUpperCase();
  }, [authUser]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (!confirmed) return;
    }
    logout();
    router.push("/");
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "shadow-sm bg-background/95 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-michroma text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90 md:text-2xl shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          Gravis
        </Link>

        {/* Desktop nav (align right) */}
        <nav
          className="hidden md:flex flex-1 items-center justify-end gap-1"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Cart + Auth capsule */}
        <div className="flex gap-2 items-center shrink-0 rounded-full bg-muted/70 px-2 py-1 shadow-sm border border-border/50 md:px-2 md:py-1.5">
          <Link
            href="/cart"
            aria-label={`Shopping cart${
              cartItemCount > 0 ? `, ${cartItemCount} items` : ""
            }`}
            className="relative p-1.5 rounded-full text-foreground hover:bg-background/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <ShoppingCart className="size-5" />
            {cartItemCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                aria-hidden
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
          <span className="w-px h-5 bg-border/60 shrink-0" aria-hidden />
          {isLoggedIn && authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-foreground hover:bg-background/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Account menu"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials || <User className="size-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline max-w-[120px] truncate">
                    {authUser.full_name || authUser.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {authUser.full_name || authUser.email}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {authUser.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/orders")}
                  className="cursor-pointer"
                >
                  My orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/account")}
                  className="cursor-pointer"
                >
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-muted/70"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile menu trigger (inside capsule on small screens) */}
          <span
            className="md:hidden w-px h-5 bg-border/60 shrink-0"
            aria-hidden
          />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="md:hidden p-2 rounded-full text-foreground hover:bg-background/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(320px,100vw)] flex flex-col p-0 border-l border-border bg-background min-h-full"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="font-michroma text-lg font-bold text-primary">
                  Menu
                </span>
                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="p-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <X className="size-5" />
                  </button>
                </SheetClose>
              </div>
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col flex-1 p-3 gap-0.5 overflow-auto"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-3 border-t border-border">
                <SheetClose asChild>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="size-5 text-muted-foreground" />
                    <span className="font-medium">
                      Cart{cartItemCount > 0 ? ` (${cartItemCount})` : ""}
                    </span>
                  </Link>
                </SheetClose>
                {isLoggedIn && authUser ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userInitials || <User className="size-3.5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {authUser.full_name || authUser.email}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {authUser.email}
                        </span>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="mt-1 w-full justify-center"
                        onClick={() => router.push("/account")}
                      >
                        Account settings
                      </Button>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors"
                      >
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Register
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
