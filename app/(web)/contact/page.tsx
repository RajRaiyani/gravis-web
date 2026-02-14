import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { ContactForm } from "@/components/pages/contact/contact-form";
import { Button } from "@/components/ui/button";

const contact = {
  emails: ["hello@gravis.com", "sales@gravis.com", "support@gravis.com"],
  phones: ["+91 98765 43210", "+91 98765 43211"],
};

const offices = [
  {
    name: "Head Office",
    address:
      "123 Industrial Area, Phase 2, Sector 18, Gurugram, Haryana 122015",
    phone: "+91 98765 43210",
    email: "hello@gravis.com",
    hours: "Mon – Sat: 9:00 AM – 6:00 PM",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.367889830383!2d77.0865!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDUnMTEuNCJF!5e0!3m2!1sen!2sin!4v1",
  },
  {
    name: "Branch – Mumbai",
    address: "45 Trade Center, Andheri East, Mumbai, Maharashtra 400069",
    phone: "+91 98765 43211",
    email: "mumbai@gravis.com",
    hours: "Mon – Fri: 10:00 AM – 7:00 PM",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.481734961789!2d72.8774!3d19.1136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzQ5LjAiTiA3MsKwNTInMzguNiJF!5e0!3m2!1sen!2sin!4v1",
  },
];

const socialLinks = [
  { icon: Twitter,   label: "Twitter",   href: "https://x.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com" },
  { icon: Linkedin,  label: "LinkedIn",  href: "https://linkedin.com" },
  { icon: Youtube,   label: "YouTube",   href: "https://youtube.com" },
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
                    href={`tel:${contact.phones[0].replace(/\s/g, "")}`}
                    className="flex items-center gap-4 text-sm text-white/90 transition-colors hover:text-white"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Phone className="h-4 w-4" />
                    </div>
                    {contact.phones[0]}
                  </a>

                  <a
                    href={`mailto:${contact.emails[0]}`}
                    className="flex items-center gap-4 text-sm text-white/90 transition-colors hover:text-white"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    {contact.emails[0]}
                  </a>

                  <div className="flex items-start gap-4 text-sm text-white/90">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>{offices[0].address}</span>
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
              {offices[0].name}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offices[0].address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </Link>
            </Button>
          </div>
          <div className="h-72 w-full md:h-96">
            <iframe
              src={offices[0].mapEmbedUrl}
              title="Gravis head office location"
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ── Office locations ─────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground">
            Office locations
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Visit us or give us a call at any of our offices.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {offices.map((office) => (
              <div
                key={office.name}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Office map thumbnail */}
                <div className="h-44 w-full">
                  <iframe
                    src={office.mapEmbedUrl}
                    title={`${office.name} location`}
                    className="h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Office details */}
                <div className="flex flex-col gap-3 p-5">
                  <h3 className="font-michroma text-base font-semibold text-foreground">
                    {office.name}
                  </h3>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    <span>{office.address}</span>
                  </a>

                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                    {office.phone}
                  </a>

                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                    {office.email}
                  </a>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-primary/70" />
                    {office.hours}
                  </div>

                  <Button variant="outline" size="sm" className="mt-1 w-fit" asChild>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}