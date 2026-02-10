import Link from "next/link";

const quickLinks = [
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
];

const companyLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Careers", href: "/careers" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-michroma text-2xl font-semibold tracking-tight text-white transition-colors hover:text-primary md:text-4xl"
            >
              Gravis
            </Link>
            <p className="mt-4 max-w-sm text-sm text-blue-200/80">
              Built for what you build next. Discover products and categories
              that fit your workflow.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-michroma text-sm font-semibold uppercase tracking-wider text-white">
              Quick links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-blue-200/80 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-michroma text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-blue-200/80 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-michroma text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-blue-200/80 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-900/60 pt-8 md:flex-row md:pt-10">
          <p className="text-sm text-blue-300/70">
            © {currentYear} Gravis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
