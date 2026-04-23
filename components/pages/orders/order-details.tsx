"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useGetOrder } from "@/hooks/useOrders";
import { serverDetails } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrencyFromPaisa(paisa: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format((paisa || 0) / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getAddressText(address: Record<string, unknown>) {
  const parts = [
    address.address,
    address.city,
    address.state_name,
    address.postal_code,
  ].filter((value) => typeof value === "string" && value.trim().length > 0);
  return parts.join(", ");
}

interface Props {
  orderId: string;
}

export default function OrderDetails({ orderId }: Props) {
  const router = useRouter();
  const { isHydrated, isLoggedIn } = useAuth();
  const { data, isLoading } = useGetOrder(orderId, isHydrated && isLoggedIn);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent(`/orders/${orderId}`);
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, orderId, router]);

  if (!isHydrated || !isLoggedIn) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  const order = data?.order;
  if (!order) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="text-sm text-muted-foreground">Order not found.</p>
          <Button asChild>
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Customer Portal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{order.serial}</h1>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">Order Status</p>
              <p className="font-medium capitalize">{order.status.replaceAll("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Status</p>
              <p className="font-medium capitalize">{order.payment_status.replaceAll("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Paid Amount</p>
              <p className="font-medium">{formatCurrencyFromPaisa(order.paid_amount_in_paisa)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-semibold">{formatCurrencyFromPaisa(order.total_amount_in_paisa)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center"
              >
                {item.primary_image?.key ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
                    <Image
                      src={
                        item.primary_image.url ||
                        `${serverDetails.serverProxyURL}/files/${item.primary_image.key}`
                      }
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrencyFromPaisa(item.price_in_paisa)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {getAddressText(order.billing_address)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {getAddressText(order.shipping_address)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
