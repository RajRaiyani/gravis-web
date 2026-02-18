import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { ContactForm } from "@/components/pages/contact/contact-form";
import { Button } from "@/components/ui/button";
import Constant from "@/config/constant";

const siteUrl = "https://gravisindia.com";
const contactUrl = `${siteUrl}/contact`;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Gravis India. Contact our sales, support, or head office in Gurugram and Mumbai. We're here for your power solution needs.",
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with Gravis India. Contact our sales, support, or head office in Gurugram and Mumbai.",
    url: contactUrl,
    type: "website",
    siteName: "Gravis India",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Gravis India",
    description:
      "Get in touch with Gravis India. Contact sales, support, or visit our offices in Gurugram and Mumbai.",
  },
  alternates: {
    canonical: contactUrl,
  },
  keywords: [
    "contact Gravis India",
    "Gravis India contact",
    "power solutions contact",
    "generator enquiry",
    "Gravis support",
    "Gravis sales",
    "Gravis office Gurugram",
    "Gravis Mumbai",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "https://x.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Page title ─────────────────────────────────────────────── */}
      <div className="py-10 text-center md:py-14">
        <h1 className="font-michroma text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
          Contact Us
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
        {/* ── Main card: blue left panel + form right panel ──────── */}
        <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[2fr_3fr]">
            {/* ── LEFT: dark blue Contact Information panel ───────── */}
            <div className="relative overflow-hidden bg-[#0a1e4e] px-8 py-10 text-white md:px-10 md:py-12">
              {/* Decorative background circles */}
              <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                <div className="h-64 w-64 rounded-full border border-white/10 bg-white/5" />
              </div>
              <div className="pointer-events-none absolute bottom-16 right-16">
                <div className="h-40 w-40 rounded-full border border-white/10 bg-white/5" />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                {/* Heading */}
                <div>
                  <h2 className="font-michroma text-2xl font-bold text-white">
                    Contact Information
                  </h2>
                  <p className="mt-2 text-sm text-blue-200/70">
                    Say something to start a live chat!
                  </p>
                </div>

                {/* Contact details */}
                <div className="mt-10 flex flex-col gap-7">
                  <a
                    href={`tel:${Constant.contact_details.phoneNumber.replace(/\s/g, "")}`}
                    className="flex items-center gap-4 text-sm text-white/90 transition-colors hover:text-white"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Phone className="h-4 w-4" />
                    </div>
                    {Constant.contact_details.phoneNumber}
                  </a>

                  <a
                    href={`mailto:${Constant.contact_details.email}`}
                    className="flex items-center gap-4 text-sm text-white/90 transition-colors hover:text-white"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    {Constant.contact_details.email}
                  </a>

                  <div className="flex items-start gap-4 text-sm text-white/90">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>{Constant.contact_details.address}</span>
                  </div>
                </div>

                {/* Social icons */}
                <div className="relative z-10 mt-auto pt-14">
                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Form panel ───────────────────────────────── */}
            <div className="bg-card px-8 py-10 md:px-10 md:py-12">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* ── Map — full width below card ──────────────────────────── */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Head Office
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://maps.app.goo.gl/WHATeWN6HA8r6Aef6`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </Link>
            </Button>
          </div>
          <div className="h-72 w-full md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.137333371668!2d70.7982783755232!3d22.291725779692754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cbaad38dff91%3A0x9c83230938175dd9!2sGRAVIS%20INDIA%20PVT%20LTD!5e1!3m2!1sen!2sin!4v1771335497899!5m2!1sen!2sin"
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
