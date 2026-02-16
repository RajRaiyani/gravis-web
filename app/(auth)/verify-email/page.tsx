"use client";

import { Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import {
  registerCustomer,
  verifyCustomerEmail,
} from "@/services/api/customers.api";
import type {
  RegisterCustomerRequest,
  VerifyCustomerEmailRequest,
} from "@/types/customer.type";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const ValidationSchema = z.object({
  token: z.string().trim().nonempty("Verification token is required"),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

const PENDING_CUSTOMER_REGISTER_KEY = "pending_customer_register";

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const rawRedirectUrl = searchParams.get("redirect_url");
  const redirectUrl = rawRedirectUrl
    ? decodeURIComponent(rawRedirectUrl)
    : null;

  const {
    mutate: verifyEmail,
    isPending: verifying,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: VerifyCustomerEmailRequest) => verifyCustomerEmail(data),
    onSuccess: (data) => {
      let nextUrl = redirectUrl ?? "/";
      
      // If redirecting to a product page after auth, add flag to auto-open enquiry
      if (redirectUrl && redirectUrl.startsWith("/products/")) {
        const separator = nextUrl.includes("?") ? "&" : "?";
        nextUrl = `${nextUrl}${separator}open_enquiry=true`;
      }
      
      login(data.customer, data.token, data.expires_at);
      localStorage.removeItem(PENDING_CUSTOMER_REGISTER_KEY);
      toast.success("Email verified! You're now signed in.");
      router.replace(nextUrl);
    },
  });

  const {
    mutate: resendRegister,
    isPending: resending,
    isError: isResendError,
    error: resendError,
  } = useMutation({
    mutationFn: (data: RegisterCustomerRequest) => registerCustomer(data),
    onSuccess: (data) => {
      const query = new URLSearchParams();
      query.set("token", data.token);
      if (redirectUrl) {
        query.set("redirect_url", redirectUrl);
      }
      router.replace(`/verify-email?${query.toString()}`);
      toast.success("A new code has been sent.");
    },
  });

  const errorMessage =
    isError || isResendError
      ? error?.message ||
        resendError?.message ||
        "Verification failed. Please try again."
      : undefined;

  const form = useForm<z.infer<typeof ValidationSchema>>({
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { handleSubmit } = form;

  function onValidSubmit(values: z.infer<typeof ValidationSchema>) {
    const token = searchParams.get("token") ?? "";
    if (!token) {
      toast.error("Verification token is required.");
      return;
    }
    verifyEmail({
      token,
      otp: values.otp,
    });
  }

  function onResendOtp() {
    if (resending || verifying) return;

    const raw = localStorage.getItem(PENDING_CUSTOMER_REGISTER_KEY);
    if (!raw) {
      toast.error("Please register again to resend the code.");
      return;
    }

    const parsedStored = JSON.parse(raw) as RegisterCustomerRequest;

    resendRegister(parsedStored);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="font-michroma text-3xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            Gravis
          </Link>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Verify your email
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ve emailed you a code. Paste it below to finish signing in.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to home
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onValidSubmit, () =>
              toast.error("Please fix the highlighted fields"),
            )}
            className="mt-6 space-y-5"
          >
            {errorMessage && (
              <p className="text-destructive text-sm font-normal">
                {errorMessage}
              </p>
            )}

            <Controller
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <FieldTitle>
                      6-digit code <span className="text-destructive">*</span>
                    </FieldTitle>
                  </FieldLabel>
                  <FieldContent>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      containerClassName="w-full justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={verifying}
              className="w-full"
            >
              {verifying ? "Verifying…" : "Verify email"}
            </Button>

            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={resending || verifying}
                onClick={onResendOtp}
              >
                {resending ? "Resending…" : "Resend OTP"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the email?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact support
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background px-4 py-12 md:px-6">
          <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm sm:p-8">
              Loading verification screen…
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  );
}
