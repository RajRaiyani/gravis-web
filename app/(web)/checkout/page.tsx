"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getCart } from "@/services/api/cart.api";
import { createOrder, verifyOrder } from "@/services/api/order.api";
import {
  getCustomerAddresses,
  getCustomerProfile,
  listCustomerStates,
} from "@/services/api/customers.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckoutAddress {
  address: string;
  city: string;
  state_id: string;
  postal_code: string;
}

interface CheckoutProfile {
  full_name: string;
  phone_number: string;
  organization_name: string;
  gst_number: string;
  pan_number: string;
}

interface CheckoutFormErrors {
  full_name?: string;
  phone_number?: string;
  gst_number?: string;
  pan_number?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state_id?: string;
  billing_postal_code?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state_id?: string;
  shipping_postal_code?: string;
}

type PaymentMode = "full" | "token";

const EMPTY_ADDRESS: CheckoutAddress = {
  address: "",
  city: "",
  state_id: "",
  postal_code: "",
};
const TOKEN_PAYMENT_PERCENTAGE = 15;
const MIN_TOKEN_PAYMENT_RUPEE = 2000;
const PHONE_NUMBER_REGEX = /^[6-9]\d{9}$/;
const PAN_NUMBER_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GST_NUMBER_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const CHECKOUT_TERMS_SECTIONS: { title: string; body: string }[] = [
  {
    title: "Order Processing",
    body: "By proceeding with this order, you agree to our terms of service and confirm that all information provided is accurate.",
  },
  {
    title: "Payment Terms",
    body: "Payment will be processed immediately upon confirmation. All transactions are secure and encrypted.",
  },
  {
    title: "Shipping and Delivery",
    body: "Delivery will be made to the shipping address provided. Please ensure the address is complete and accurate.",
  },
  {
    title: "Returns and Refunds",
    body: "Returns and refunds are subject to our return policy. Please review our return policy before placing your order.",
  },
  {
    title: "Liability",
    body: "Firelynk is not liable for any damages arising from the use of our products beyond the scope of our warranty.",
  },
];

function paisaToRupee(paisa: number): number {
  return paisa / 100;
}

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  prefill?: {
    name?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallbackMessage;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authUser, isHydrated, isLoggedIn } = useAuth();

  const [profile, setProfile] = useState<CheckoutProfile>({
    full_name: "",
    phone_number: "",
    organization_name: "",
    gst_number: "",
    pan_number: "",
  });
  const [billingAddress, setBillingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [useBillingForShipping, setUseBillingForShipping] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("full");
  const [isPaying, setIsPaying] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent("/checkout");
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, router]);

  const { data: profileResponse } = useQuery({
    queryKey: ["customer", "profile"],
    queryFn: getCustomerProfile,
    enabled: isHydrated && isLoggedIn,
  });

  const { data: addressesResponse } = useQuery({
    queryKey: ["customer", "addresses"],
    queryFn: getCustomerAddresses,
    enabled: isHydrated && isLoggedIn,
  });

  const { data: statesResponse } = useQuery({
    queryKey: ["customer", "states"],
    queryFn: listCustomerStates,
    enabled: isHydrated && isLoggedIn,
  });

  const { data: cartResponse, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isHydrated && isLoggedIn,
  });

  useEffect(() => {
    const customer = profileResponse?.customer;
    if (!customer && !authUser) return;

    const fullName = customer?.full_name ?? authUser?.full_name ?? "";
    const phoneNumber = customer?.phone_number ?? authUser?.phone_number ?? "";
    const organizationName =
      customer?.organization_name ?? authUser?.organization_name ?? "";
    const gstNumber = customer?.gst_number ?? authUser?.gst_number ?? "";
    const panNumber = customer?.pan_number ?? authUser?.pan_number ?? "";

    setProfile({
      full_name: fullName,
      phone_number: phoneNumber,
      organization_name: organizationName ?? "",
      gst_number: gstNumber ?? "",
      pan_number: panNumber ?? "",
    });
  }, [profileResponse, authUser]);

  useEffect(() => {
    const billing = addressesResponse?.billing_address;
    const shipping = addressesResponse?.shipping_address;

    setBillingAddress({
      address: billing?.address ?? "",
      city: billing?.city ?? "",
      state_id: billing?.state_id ?? "",
      postal_code: billing?.postal_code ?? "",
    });

    setShippingAddress({
      address: shipping?.address ?? "",
      city: shipping?.city ?? "",
      state_id: shipping?.state_id ?? "",
      postal_code: shipping?.postal_code ?? "",
    });
  }, [addressesResponse]);

  useEffect(() => {
    if (useBillingForShipping) {
      setShippingAddress(billingAddress);
    }
  }, [useBillingForShipping, billingAddress]);

  const stateNameById = useMemo(() => {
    const states = statesResponse?.states ?? [];
    return new Map(states.map((state) => [state.id, state.name]));
  }, [statesResponse]);

  const totalRupee = paisaToRupee(cartResponse?.total ?? 0);
  const minimumTokenPayablePaisa = Math.round(MIN_TOKEN_PAYMENT_RUPEE * 100);
  const tokenPayablePaisa = Math.min(
    cartResponse?.total ?? 0,
    Math.max(
      minimumTokenPayablePaisa,
      Math.round(((cartResponse?.total ?? 0) * TOKEN_PAYMENT_PERCENTAGE) / 100)
    )
  );
  const tokenPayableRupee = paisaToRupee(tokenPayablePaisa);
  const itemCount =
    cartResponse?.items?.reduce((total, item) => total + (item.quantity || 0), 0) ?? 0;
  const shippingCharge = 0;
  const grandTotal = totalRupee + shippingCharge;

  function validateCheckoutForm(): boolean {
    const errors: CheckoutFormErrors = {};
    const fullName = profile.full_name.trim();
    const phoneNumber = profile.phone_number.trim();
    const panNumber = profile.pan_number.trim().toUpperCase();
    const gstNumber = profile.gst_number.trim().toUpperCase();

    if (!fullName) {
      errors.full_name = "Full name is required";
    }

    if (!phoneNumber) {
      errors.phone_number = "Phone number is required";
    } else if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errors.phone_number = "Enter a valid 10-digit Indian mobile number";
    }

    if (panNumber && !PAN_NUMBER_REGEX.test(panNumber)) {
      errors.pan_number = "Enter a valid PAN number (e.g. ABCDE1234F)";
    }

    if (gstNumber && !GST_NUMBER_REGEX.test(gstNumber)) {
      errors.gst_number = "Enter a valid GST number";
    }

    if (!billingAddress.address.trim()) {
      errors.billing_address = "Billing address is required";
    }
    if (!billingAddress.city.trim()) {
      errors.billing_city = "Billing city is required";
    }
    if (!billingAddress.state_id) {
      errors.billing_state_id = "Billing state is required";
    }
    if (!billingAddress.postal_code.trim()) {
      errors.billing_postal_code = "Billing PIN code is required";
    }

    if (!shippingAddress.address.trim()) {
      errors.shipping_address = "Shipping address is required";
    }
    if (!shippingAddress.city.trim()) {
      errors.shipping_city = "Shipping city is required";
    }
    if (!shippingAddress.state_id) {
      errors.shipping_state_id = "Shipping state is required";
    }
    if (!shippingAddress.postal_code.trim()) {
      errors.shipping_postal_code = "Shipping PIN code is required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted errors");
      return false;
    }

    return true;
  }

  function handleProceedToPayment() {
    if (!validateCheckoutForm()) return;
    setTermsAccepted(false);
    setTermsOpen(true);
  }

  function handleTermsDialogOpenChange(open: boolean) {
    setTermsOpen(open);
    if (!open) setTermsAccepted(false);
  }

  async function startRazorpayPayment() {
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error("Unable to load payment gateway");
      return;
    }

    try {
      setIsPaying(true);

      const orderResponse = await createOrder({
        payment_mode: paymentMode,
        promo_code: promoCode.trim() || undefined,
        full_name: profile.full_name.trim(),
        phone_number: profile.phone_number.trim(),
        organization_name: profile.organization_name.trim() || undefined,
        gst_number: profile.gst_number.trim() || undefined,
        pan_number: profile.pan_number.trim() || undefined,
        shipping_address: shippingAddress.address.trim(),
        shipping_state_id: shippingAddress.state_id,
        shipping_city: shippingAddress.city.trim(),
        shipping_postal_code: shippingAddress.postal_code.trim(),
        billing_address: billingAddress.address.trim(),
        billing_state_id: billingAddress.state_id,
        billing_city: billingAddress.city.trim(),
        billing_postal_code: billingAddress.postal_code.trim(),
      });

      if (!orderResponse.payment || !orderResponse.razorpay_key_id) {
        toast.error("Payment service is not available right now");
        setIsPaying(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderResponse.razorpay_key_id,
        amount: orderResponse.payment.amount,
        currency: orderResponse.payment.currency,
        name: "Gravis",
        description: `Order ${orderResponse.order.serial}`,
        order_id: orderResponse.payment.id,
        prefill: {
          name: profile.full_name.trim(),
          contact: profile.phone_number.trim(),
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        handler: async (paymentResponse) => {
          try {
            await verifyOrder(paymentResponse);
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success(
              orderResponse.payment_summary.payment_mode === "token"
                ? "Token payment successful"
                : "Payment successful"
            );
            router.push(`/orders/${orderResponse.order.id}`);
          } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Payment verification failed"));
          } finally {
            setIsPaying(false);
          }
        },
      });

      razorpay.open();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to initiate payment"));
      setIsPaying(false);
    }
  }

  async function handleAgreeTermsAndPay() {
    if (!validateCheckoutForm()) {
      setTermsOpen(false);
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions to continue");
      return;
    }
    setTermsOpen(false);
    setTermsAccepted(false);
    await startRazorpayPayment();
  }

  if (!isHydrated || !isLoggedIn) return null;

  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-6 lg:px-8">
      <Dialog open={termsOpen} onOpenChange={handleTermsDialogOpenChange}>
        <DialogContent className="max-h-[min(90vh,720px)] gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="max-h-[min(50vh,420px)] space-y-4 overflow-y-auto px-6 py-4 text-sm text-foreground">
            <ol className="list-decimal space-y-4 pl-5 marker:font-medium">
              {CHECKOUT_TERMS_SECTIONS.map((section) => (
                <li key={section.title} className="pl-1">
                  <p className="font-medium text-foreground">{section.title}</p>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">{section.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <DialogFooter className="flex-col gap-4 border-t border-border bg-muted/30 px-6 py-4 sm:flex-col">
            <label className="flex cursor-pointer items-start gap-2.5 text-left text-sm text-foreground">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-input"
              />
              <span>I agree to the terms and conditions</span>
            </label>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleTermsDialogOpenChange(false)}
                disabled={isPaying}
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={!termsAccepted || isPaying}
                onClick={() => {
                  void handleAgreeTermsAndPay();
                }}
              >
                <CheckCircle2 className="size-4" />
                I Agree & Proceed
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-4">
          <Card className="gap-4 py-4">
            <CardHeader className="px-4 pb-0 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="size-4 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(event) => {
                      setProfile((prev) => ({ ...prev, full_name: event.target.value }));
                      setFormErrors((prev) => ({ ...prev, full_name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    className={formErrors.full_name ? "border-destructive" : ""}
                  />
                  {formErrors.full_name ? (
                    <p className="text-xs text-destructive">{formErrors.full_name}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="flex items-center gap-1">
                    <Phone className="size-3.5 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    value={profile.phone_number}
                    onChange={(event) => {
                      setProfile((prev) => ({ ...prev, phone_number: event.target.value }));
                      setFormErrors((prev) => ({ ...prev, phone_number: undefined }));
                    }}
                    placeholder="Enter your phone number"
                    className={formErrors.phone_number ? "border-destructive" : ""}
                  />
                  {formErrors.phone_number ? (
                    <p className="text-xs text-destructive">{formErrors.phone_number}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_name" className="flex items-center gap-1">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  Organization Name
                </Label>
                <Input
                  id="organization_name"
                  value={profile.organization_name}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      organization_name: event.target.value,
                    }))
                  }
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={profile.gst_number}
                    onChange={(event) => {
                      setProfile((prev) => ({
                        ...prev,
                        gst_number: event.target.value.toUpperCase(),
                      }));
                      setFormErrors((prev) => ({ ...prev, gst_number: undefined }));
                    }}
                    placeholder="Enter your GST number"
                    maxLength={15}
                    className={formErrors.gst_number ? "border-destructive" : ""}
                  />
                  {formErrors.gst_number ? (
                    <p className="text-xs text-destructive">{formErrors.gst_number}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan_number">PAN Number</Label>
                  <Input
                    id="pan_number"
                    value={profile.pan_number}
                    onChange={(event) => {
                      setProfile((prev) => ({
                        ...prev,
                        pan_number: event.target.value.toUpperCase(),
                      }));
                      setFormErrors((prev) => ({ ...prev, pan_number: undefined }));
                    }}
                    placeholder="Enter your PAN number"
                    maxLength={10}
                    className={formErrors.pan_number ? "border-destructive" : ""}
                  />
                  {formErrors.pan_number ? (
                    <p className="text-xs text-destructive">{formErrors.pan_number}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4 pb-0 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-primary" />
                Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="space-y-2">
                <Label htmlFor="billing_address">Address</Label>
                <Textarea
                  id="billing_address"
                  value={billingAddress.address}
                  onChange={(event) => {
                    setBillingAddress((prev) => ({ ...prev, address: event.target.value }));
                    setFormErrors((prev) => ({ ...prev, billing_address: undefined }));
                  }}
                  placeholder="Enter billing address"
                  className={`min-h-24 ${formErrors.billing_address ? "border-destructive" : ""}`}
                />
                {formErrors.billing_address ? (
                  <p className="text-xs text-destructive">{formErrors.billing_address}</p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="billing_state">State</Label>
                  <Select
                    value={billingAddress.state_id}
                    onValueChange={(value) => {
                      setBillingAddress((prev) => ({ ...prev, state_id: value }));
                      setFormErrors((prev) => ({ ...prev, billing_state_id: undefined }));
                    }}
                  >
                    <SelectTrigger
                      id="billing_state"
                      className={`w-full ${formErrors.billing_state_id ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {(statesResponse?.states ?? []).map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.billing_state_id ? (
                    <p className="text-xs text-destructive">{formErrors.billing_state_id}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_city">City</Label>
                  <Input
                    id="billing_city"
                    value={billingAddress.city}
                    onChange={(event) => {
                      setBillingAddress((prev) => ({ ...prev, city: event.target.value }));
                      setFormErrors((prev) => ({ ...prev, billing_city: undefined }));
                    }}
                    placeholder="City"
                    className={formErrors.billing_city ? "border-destructive" : ""}
                  />
                  {formErrors.billing_city ? (
                    <p className="text-xs text-destructive">{formErrors.billing_city}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_postal_code">PIN code</Label>
                  <Input
                    id="billing_postal_code"
                    value={billingAddress.postal_code}
                    onChange={(event) => {
                      setBillingAddress((prev) => ({
                        ...prev,
                        postal_code: event.target.value,
                      }));
                      setFormErrors((prev) => ({ ...prev, billing_postal_code: undefined }));
                    }}
                    placeholder="PIN code"
                    maxLength={10}
                    className={formErrors.billing_postal_code ? "border-destructive" : ""}
                  />
                  {formErrors.billing_postal_code ? (
                    <p className="text-xs text-destructive">{formErrors.billing_postal_code}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4 pb-0 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-primary" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <label className="inline-flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={useBillingForShipping}
                  onChange={(event) => setUseBillingForShipping(event.target.checked)}
                  className="size-4 rounded border-input"
                />
                Use billing address for shipping
              </label>

              <div className="space-y-2">
                <Label htmlFor="shipping_address">Address</Label>
                <Textarea
                  id="shipping_address"
                  value={shippingAddress.address}
                  onChange={(event) => {
                    setShippingAddress((prev) => ({ ...prev, address: event.target.value }));
                    setFormErrors((prev) => ({ ...prev, shipping_address: undefined }));
                  }}
                  placeholder="Enter shipping address"
                  className={`min-h-24 ${formErrors.shipping_address ? "border-destructive" : ""}`}
                  disabled={useBillingForShipping}
                />
                {formErrors.shipping_address ? (
                  <p className="text-xs text-destructive">{formErrors.shipping_address}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="shipping_state">State</Label>
                  <Select
                    value={shippingAddress.state_id}
                    onValueChange={(value) => {
                      setShippingAddress((prev) => ({ ...prev, state_id: value }));
                      setFormErrors((prev) => ({ ...prev, shipping_state_id: undefined }));
                    }}
                    disabled={useBillingForShipping}
                  >
                    <SelectTrigger
                      id="shipping_state"
                      className={`w-full ${formErrors.shipping_state_id ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {(statesResponse?.states ?? []).map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.shipping_state_id ? (
                    <p className="text-xs text-destructive">{formErrors.shipping_state_id}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_city">City</Label>
                  <Input
                    id="shipping_city"
                    value={shippingAddress.city}
                    onChange={(event) => {
                      setShippingAddress((prev) => ({ ...prev, city: event.target.value }));
                      setFormErrors((prev) => ({ ...prev, shipping_city: undefined }));
                    }}
                    placeholder="City"
                    disabled={useBillingForShipping}
                    className={formErrors.shipping_city ? "border-destructive" : ""}
                  />
                  {formErrors.shipping_city ? (
                    <p className="text-xs text-destructive">{formErrors.shipping_city}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_postal_code">PIN code</Label>
                  <Input
                    id="shipping_postal_code"
                    value={shippingAddress.postal_code}
                    onChange={(event) => {
                      setShippingAddress((prev) => ({
                        ...prev,
                        postal_code: event.target.value,
                      }));
                      setFormErrors((prev) => ({ ...prev, shipping_postal_code: undefined }));
                    }}
                    placeholder="PIN code"
                    maxLength={10}
                    disabled={useBillingForShipping}
                    className={formErrors.shipping_postal_code ? "border-destructive" : ""}
                  />
                  {formErrors.shipping_postal_code ? (
                    <p className="text-xs text-destructive">{formErrors.shipping_postal_code}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-24 gap-4 py-4">
            <CardHeader className="px-4 pb-0 sm:px-6">
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatPrice(totalRupee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-primary">
                  <span>Pay Now ({paymentMode === "full" ? "Full" : "Token"})</span>
                  <span>
                    {paymentMode === "full"
                      ? formatPrice(grandTotal)
                      : formatPrice(tokenPayableRupee)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo_code">Promo Code (Optional)</Label>
                <Input
                  id="promo_code"
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("full")}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      paymentMode === "full"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                    disabled={isPaying}
                  >
                    Full Payment
                    <div className="mt-1 font-semibold text-foreground">
                      {formatPrice(totalRupee)}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("token")}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      paymentMode === "token"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                    disabled={isPaying}
                  >
                    Token Money
                    <div className="mt-1 font-semibold text-foreground">
                      {formatPrice(tokenPayableRupee)}
                    </div>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Token amount is 15% of total or ₹2,000 (whichever is higher).
                </p>
                <p className="text-xs text-muted-foreground">
                  Final payable amount is validated on backend and cannot be modified from
                  frontend.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleProceedToPayment}
                disabled={isPaying || itemCount === 0}
              >
                <CreditCard className="size-4" />
                {isPaying ? "Processing..." : "Proceed to Payment"}
              </Button>

              <Button variant="ghost" className="w-full" asChild>
                <Link href="/cart">Cancel</Link>
              </Button>

              <div className="space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                <p>Billing state: {stateNameById.get(billingAddress.state_id) ?? "-"}</p>
                <p>Shipping state: {stateNameById.get(shippingAddress.state_id) ?? "-"}</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
