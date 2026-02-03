"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useGetCart, useInvalidateCart } from "@/hooks/useCart";
import { updateCartItem, type CartItem } from "@/services/api/cart.api";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

function paisaToRupee(paisa: number): number {
  return paisa / 100;
}

const MIN_QUANTITY = 0;
const MAX_QUANTITY = 100;

function CartItemRow({
  item,
  onUpdate,
}: {
  item: CartItem;
  onUpdate: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const priceRupee = paisaToRupee(item.sale_price_in_paisa);
  const lineTotal = priceRupee * item.quantity;

  async function setQuantity(newQty: number) {
    if (newQty === item.quantity) return;
    if (newQty < MIN_QUANTITY || newQty > MAX_QUANTITY) return;
    setUpdating(true);
    try {
      await updateCartItem(item.product_id, newQty);
      onUpdate();
      if (newQty === 0) {
        toast.success("Item removed from cart");
      }
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setUpdating(false);
    }
  }

  function handleDecrement() {
    const next = item.quantity - 1;
    setQuantity(next);
  }

  function handleIncrement() {
    const next = item.quantity + 1;
    setQuantity(Math.min(next, MAX_QUANTITY));
  }

  return (
    <li className="flex gap-4 rounded-lg border border-border bg-card p-4">
      <Link
        href={`/products/${item.product_id}`}
        className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted md:size-28"
      >
        {item.primary_image?.url ? (
          <Image
            src={item.primary_image.url}
            alt={item.product_name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized
          />
        ) : (
          <ShoppingCart className="size-8 text-muted-foreground" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.product_id}`}
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          {item.product_name}
        </Link>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted/50">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={updating || item.quantity <= 1}
              className="flex size-8 items-center justify-center rounded-l-md text-foreground hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span
              className="min-w-8 px-2 text-center font-medium tabular-nums"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={updating || item.quantity >= MAX_QUANTITY}
              className="flex size-8 items-center justify-center rounded-r-md text-foreground hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="font-semibold text-foreground">
            {formatPrice(lineTotal)}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(0)}
            disabled={updating}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            aria-label={`Remove ${item.product_name} from cart`}
          >
            <Trash2 className="size-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartPage() {
  const { data: cart, isLoading, error } = useGetCart();
  const invalidateCart = useInvalidateCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading cart…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <p className="text-center text-destructive">
            Failed to load cart. Please try again.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => invalidateCart()}
              className="text-sm font-medium text-primary hover:underline"
            >
              Retry
            </button>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const totalPaisa = cart?.total ?? 0;
  const totalRupee = paisaToRupee(totalPaisa);
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto container px-4 py-8 md:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Your cart
        </h1>

        {isEmpty ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
            <ShoppingCart className="size-14 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your cart is empty</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex-1">
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.product_id}
                      item={item}
                      onUpdate={invalidateCart}
                    />
                  ))}
                </ul>
              </div>
              <aside className="w-full max-w-md lg:w-80">
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                  <p className="text-lg font-semibold text-foreground">
                    Total: {formatPrice(totalRupee)}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Proceed to enquire
                  </Link>
                </div>
              </aside>
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
