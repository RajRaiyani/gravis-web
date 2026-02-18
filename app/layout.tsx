import type { Metadata, Viewport } from "next";
import { Michroma, Poppins, Gothic_A1 } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

const gothic_a1 = Gothic_A1({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-gothic-a1",
});

const siteUrl = "https://gravisindia.com";
const defaultTitle = "Gravis India | Leading Provider of Power Solutions";
const defaultDescription =
  "Gravis India – powering your world, reliably. Leading provider of generators and power solutions. Explore portable generators and industrial power equipment.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0046B7",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Gravis India",
  },
  description: defaultDescription,
  applicationName: "Gravis India",
  authors: [{ name: "Gravis India", url: siteUrl }],
  creator: "Gravis India",
  publisher: "Gravis India",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: [
    "Gravis India",
    "power solutions",
    "generators",
    "portable generator",
    "industrial generator",
    "power equipment",
    "backup power",
    "Gravis generator",
    "best generators India",
    "reliable power solutions",
  ],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Gravis India",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/logos/primary.svg",
        width: 250,
        height: 100,
        alt: "Gravis India – Powering Your World, Reliably",
      },
    ],
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logos/primary.svg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gravis India",
  url: siteUrl,
  logo: `${siteUrl}/logos/primary.svg`,
  description: defaultDescription,
  slogan: "Powering Your World, Reliably",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${poppins.variable} ${michroma.variable} ${gothic_a1.variable} flex min-h-screen flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
