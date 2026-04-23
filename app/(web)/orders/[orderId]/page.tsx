import type { Metadata } from "next";

import OrderDetails from "@/components/pages/orders/order-details";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View detailed status and items of your Gravis order.",
};

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailsPage({ params }: Props) {
  const { orderId } = await params;
  return <OrderDetails orderId={orderId} />;
}
