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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Twitter, label: "X (Twitter)", href: "https://x.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-michroma text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have a question or want to work together? Get in touch via form,
            email, or visit one of our offices.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        {/* Form + Contact info + Map */}
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-michroma text-xl">
                  Send a message
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill out the form and we&apos;ll get back to you within 24
                  hours.
                </p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact details + Map */}
          <div className="space-y-8 lg:col-span-2">
            {/* Email & Phone */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-michroma text-lg">
                  Get in touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <ul className="space-y-1">
                    {contact.emails.map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-primary/80" />
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <ul className="space-y-1">
                    {contact.phones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary/80" />
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Map - first office */}
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              <p className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground">
                {offices[0].name}
              </p>
              <div className="aspect-4/3 w-full">
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

            {/* Social */}
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">
                Follow us
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office locations */}
        <section className="mt-16">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground">
            Office locations
          </h2>
          <p className="mt-2 text-muted-foreground">
            Visit us or give us a call at any of our offices.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {offices.map((office) => (
              <Card key={office.name} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-michroma text-lg">
                    {office.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      office.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-left text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MapPin className="h-5 w-5 shrink-0 text-primary/80 mt-0.5" />
                    <span>{office.address}</span>
                  </a>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary/80" />
                    {office.phone}
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary/80" />
                    {office.email}
                  </a>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-primary/80" />
                    {office.hours}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        office.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
