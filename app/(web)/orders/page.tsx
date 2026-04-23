import type { Metadata } from "next";

import OrdersList from "@/components/pages/orders/orders-list";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your Gravis customer portal orders.",
};

export default function OrdersPage() {
  return <OrdersList />;
}
