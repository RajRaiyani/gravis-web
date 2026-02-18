import { Suspense } from "react";
import Link from "next/link";
import RegisterForm from "@/components/pages/register/register-form";

interface RegisterPageProps {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolved = await searchParams;
  const redirectUrl = resolved.redirect_url;
  const redirectQuery = redirectUrl ? `?redirect_url=${redirectUrl}` : "";

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
            Register to save your details and checkout faster.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your details to get started.
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
                Loading registration form…
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              href={`/login${redirectQuery}`}
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
