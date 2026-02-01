"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  Settings,
  PackageSearch,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Bell,
  FileText,
} from "lucide-react";

function AccountMenu({
  customerName,
  getInitial,
  onLogout,
}: {
  customerName?: string;
  getInitial: (name: string | undefined) => string;
  onLogout: () => void;
}) {
  const firstName = customerName?.split(" ")[0] || "Customer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button
          type="button"
          aria-label="Account menu"
          className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold shadow hover:opacity-90 focus:outline-none"
        >
          {getInitial(customerName)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl border border-gray-100 shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link href="/account">
            <div className="flex items-center gap-3 hover:bg-gray-100">
              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm shadow-md">
                {getInitial(customerName)}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {firstName}
                </p>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/account"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <Settings className="h-4 w-4" />
            </span>
            <span className="text-sm">Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/orders"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <PackageSearch className="h-4 w-4" />
            </span>
            <span className="text-sm">Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/projects"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <FolderKanban className="h-4 w-4" />
            </span>
            <span className="text-sm">Projects</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <span className="text-sm">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/alerts"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <Bell className="h-4 w-4" />
            </span>
            <span className="text-sm">Custom Alerts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/reports"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <span className="text-sm">Reports</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          variant="destructive"
          className="flex items-center gap-2.5 cursor-pointer text-red-600 focus:text-red-600"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="text-sm">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navigationItems = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact us" },
  ];

  return (
    <>
      <header
        className={cn(
          "w-screen top-0 z-50 transition-all duration-300",
          "backdrop-blur-md bg-white/80 shadow-sm",
          "sticky top-0"
        )}
      >
        <div className="container mx-auto flex h-12 md:h-16 items-center justify-between px-4">
          {/* Left Side: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Toggle mobile menu"
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 sm:max-w-sm flex flex-col p-0 [&>button]:hidden bg-white"
              >
                {/* Header with Burger Button and Logo */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
                  <SheetClose asChild>
                    <button
                      type="button"
                      aria-label="Close mobile menu"
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetClose>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src="/logos/full-black.svg"
                      alt="Firelynk Logo"
                      width={120}
                      height={30}
                      className="h-6 w-auto"
                    />
                  </Link>
                </div>
                <SheetHeader className="px-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <nav className="flex flex-col">
                    {navigationItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={`px-6 py-4 text-base font-medium transition-colors border-b border-gray-100 ${"bg-gray-100 text-gray-900 font-semibold"}`}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Link
              href="/"
              className="flex text-primary font-michroma text-2xl font-extrabold items-center gap-2 z-50"
            >
              Gravis
            </Link>
          </div>

          {/* Right Side: Desktop Navigation + Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2 lg:gap-4 xl:gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md font-medium transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
