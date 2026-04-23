"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useListOrders } from "@/hooks/useOrders";
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

const PAGE_LIMIT = 10;

export default function OrdersList() {
  const router = useRouter();
  const { isHydrated, isLoggedIn } = useAuth();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent("/orders");
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, router]);

  const offset = useMemo(() => (page - 1) * PAGE_LIMIT, [page]);

  const { data, isLoading, isFetching } = useListOrders(offset, PAGE_LIMIT);

  if (!isHydrated || !isLoggedIn) return null;

  const orders = data?.orders ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Customer Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track all your previous purchases and payment status.
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Loading orders...
            </CardContent>
          </Card>
        ) : orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    <span>{order.serial}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatDate(order.created_at)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{order.total_item_count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Order Status</p>
                      <p className="font-medium capitalize">{order.status.replaceAll("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <p className="font-medium capitalize">
                        {order.payment_status.replaceAll("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">
                        {formatCurrencyFromPaisa(order.total_amount_in_paisa)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button asChild>
                      <Link href={`/orders/${order.id}`}>View details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <PackageSearch className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You have not placed any orders yet.</p>
              <Button asChild>
                <Link href="/products">Browse products</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
