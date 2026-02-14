import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Send,
  Figma,
} from "lucide-react";

// Custom Gitea-style icon (cat face) — approximate with a simple SVG
function GiteaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com",  label: "Facebook" },
  // { icon: GiteaIcon,href: "https://gitea.com",     label: "Gitea" },
  { icon: Github,   href: "https://github.com",    label: "GitHub" },
  { icon: Send,     href: "https://t.me",          label: "Telegram" },
  { icon: Instagram,href: "https://instagram.com", label: "Instagram" },
  // { icon: Figma,    href: "https://figma.com",     label: "Figma" },
];

const quickLinks = [
  { label: "Home",     href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Product",  href: "/products" },
  { label: "Career",   href: "/career" },
  { label: "Dealer",   href: "/dealer" },
];

const resourceLinks = [
  { label: "Download App",     href: "/download" },
  { label: "Email Login",      href: "/login" },
  { label: "Download Brochure",href: "/brochure" },
];

const featureLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "FAQs",         href: "/faqs" },
  { label: "News",         href: "/news" },
  { label: "What's New",   href: "/whats-new" },
];

const legalLinks = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Use",     href: "/terms" },
  { label: "Sales and Refunds",href: "/refunds" },
  { label: "Legal",            href: "/legal" },
  { label: "Site Map",         href: "/sitemap" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8">

        {/* ── Top: Logo + tagline ───────────────────────────────────── */}
        <div className="mb-2 text-center sm:text-left">
          <Link
            href="/"
            className="font-michroma text-xl font-semibold tracking-tight text-white transition-colors hover:text-primary sm:text-2xl md:text-4xl"
          >
            Gravis
          </Link>
          <p className="mt-1 text-[10px] font-medium tracking-widest text-blue-300/60 uppercase sm:text-[11px]">
            &nbsp;India
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-blue-900/60 sm:my-4" />

        {/* ── Main grid: social | quick links | resources | feature ─── */}
        <div className="grid grid-cols-2 gap-8 gap-y-10 sm:gap-10 md:grid-cols-4 md:gap-y-0 lg:gap-12">

          {/* Follow us */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Follow us
            </h3>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-900/60 text-blue-200/80 transition-colors hover:border-blue-400/60 hover:text-white sm:h-9 sm:w-9"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-xs text-blue-200/80 transition-colors hover:text-white sm:text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {resourceLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-xs text-blue-200/80 transition-colors hover:text-white sm:text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Feature */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Feature
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {featureLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-xs text-blue-200/80 transition-colors hover:text-white sm:text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center gap-4 border-blue-900/60 pt-6 sm:mt-12 sm:pt-8 md:flex-row md:items-center md:justify-between md:pt-10">
          <p className="text-center text-xs text-blue-300/70 sm:text-sm md:text-left">
            © Copyright {currentYear}, All rights Reserved by Ullas India
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 md:justify-end">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block py-1 text-xs text-blue-200/80 transition-colors hover:text-white sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}