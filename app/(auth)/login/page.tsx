import { Suspense } from "react";
import Link from "next/link";

import LoginForm from "@/components/pages/login/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 md:px-6">
      <div className="mx-auto flex h-fit max-w-lg flex-col justify-center">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="font-michroma text-3xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            Gravis
          </Link>
          <p className="text-sm text-muted-foreground">
            Log in to access your account and checkout faster.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card space-y-4 p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Log in
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and password to continue.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to home
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="mt-6 text-sm text-muted-foreground">
                Loading login form…
              </div>
            }
          >
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
