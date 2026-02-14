import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  Shield,
  Zap,
  Users,
  Award,
  Quote,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Years of Excellence", value: "20+" },
  { label: "Happy Customers", value: "5M+" },
  { label: "Service Centers", value: "500+" },
];

const coreValues = [
  {
    icon: Shield,
    title: "Self Reliance",
    description: "We empower people to take ownership of their work and growth, building confidence and capability.",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Hard Work",
    description: "We value the dedication and discipline required to deliver excellence in everything we do.",
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "We embrace new ideas and technologies while protecting the environment for future generations.",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We foster a culture of teamwork, communication, and mutual respect to achieve shared goals.",
    bg: "bg-green-50",
    color: "text-green-600",
  },
];

const journey = [
  { year: "2003", title: "The Beginning",        tag: "Foundation",   description: "GRAVIS is founded with a vision to revolutionize power generation technology and make reliable energy accessible to all.", side: "top" },
  { year: "2006", title: "First Innovation",     tag: "EcoGen",       description: "Launch of our EcoGen technology, reducing emissions by 40% while improving fuel efficiency.", side: "bottom" },
  { year: "2014", title: "Global Expansion",     tag: "25 Countries", description: "Operations expand to 25 countries, establishing GRAVIS as a trusted international brand.", side: "top" },
  { year: "2019", title: "Industry Recognition", tag: "Award Winner", description: "Recognized with major industry awards for hybrid solar-generator integration.", side: "bottom" },
  { year: "2024", title: "Future Forward",       tag: "AI-Powered",   description: "Launch of next-generation smart generators with IoT connectivity and AI-powered optimization.", side: "top" },
];

const whyChooseGravis = [
  { number: "01", title: "Superior Performance", description: "Industry-leading power output with exceptional fuel efficiency and minimal emissions for sustainable operation." },
  { number: "02", title: "Unmatched Reliability", description: "Built with premium components and rigorous quality control to ensure dependable performance in any condition." },
  { number: "03", title: "Easy Maintenance", description: "User-friendly design with accessible service points and comprehensive support for hassle-free maintenance." },
  { number: "04", title: "Eco-Friendly", description: "Advanced emission control technology and renewable energy integration for a greener tomorrow." },
];

const whyChooseImages = [
  { src: "/images/pages/home/about.png",    alt: "Gravis generator" },
  { src: "/images/pages/about/history.png", alt: "Generator detail" },
  { src: "/images/pages/about/history.png", alt: "Gravis equipment" },
  { src: "/images/pages/home/about.png",    alt: "Generator in use" },
];

const missionTestimonials = [
  { name: "Crystal Monica", role: "Co-Founder of Company", quote: "This platform has completely changed the way I approach my daily habits. Each small step added up to noticeable improvements in our operations." },
  { name: "Bessie Fowler",  role: "Operations Lead",       quote: "The support and insights kept us focused and accountable. Progress felt achievable and we finally see results we can sustain." },
  { name: "Marvin McKinney",role: "Plant Manager",         quote: "Our power systems are more reliable than ever. Clear guidance and dependable equipment keep our operations running smoothly." },
];

const testimonials = [
  { name: "Crystal Monica",  role: "Co-Founder",      stars: 4, initials: "CM", quote: "This platform has completely changed the way I approach my daily habits. Each small step added up to noticeable improvements." },
  { name: "Bessie Fowler",   role: "Operations Lead", stars: 5, initials: "BF", quote: "The support and insights kept us focused and accountable. Progress felt achievable and we finally see results we can sustain." },
  { name: "Marvin McKinney", role: "Plant Manager",   stars: 5, initials: "MM", quote: "Our power systems are more reliable than ever. Clear guidance and dependable equipment keep our operations running smoothly." },
  { name: "Robert Fox",      role: "Facility Manager",stars: 4, initials: "RF", quote: "Incredible service and robust equipment. GRAVIS solutions have transformed how we manage energy in our facility." },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionLabel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h2 className="font-michroma flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[#0046B7]" />
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base font-normal text-slate-600 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="mt-2 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < count ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-white font-poppins">

      {/* Page header — full bleed */}
      <div className="border-b border-slate-100 py-8 text-center">
        <h1 className="font-michroma text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">About Us</h1>
        <p className="mt-1.5 text-sm font-normal text-slate-500">
          Reliable, Efficient, And Innovative Power Solutions Powering Your World.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ABOUT GRAVIS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <SectionLabel
                title="About Gravis"
                subtitle="Holistic, Personalized, And Innovative Power Solutions For Lifelong Reliability."
              />
              <div className="space-y-4 text-sm leading-relaxed text-slate-600 md:text-base md:leading-8">
                <p>
                  GRAVIS has been at the forefront of power generation solutions in India for over
                  two decades. We are committed to delivering reliable, efficient, and innovative
                  generator systems that keep your world running smoothly.
                </p>
                <p>
                  From small portable units to large industrial power systems, our comprehensive
                  range of generators is designed to meet diverse power needs across residential,
                  commercial, and industrial sectors.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                {stats.map((s) => (
                  <div key={s.label} className="px-4 text-center">
                    <p className="text-xl font-extrabold text-slate-900 md:text-2xl">{s.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8 gap-2 rounded-lg bg-[#0046B7] hover:bg-[#003da0]" asChild>
                <Link href="/contact">
                  More Details <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative h-[360px] md:h-[440px]">
              <Image src="/images/pages/home/about.png" alt="Gravis generator" fill className="rounded-3xl object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          COMPANY HISTORY
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <SectionLabel
                title="Company History"
                subtitle="Founded in 1995, GRAVIS emerged from a powerful vision: to ensure that no home or business would ever be left in the dark."
              />
              <div className="space-y-4 text-sm leading-7 text-slate-500 md:text-base md:leading-8">
                <p>
                  What started as a small operation with a handful of dedicated engineers has grown
                  into a global powerhouse in the generator industry. Our journey has been marked by
                  continuous innovation, unwavering commitment to quality, and a deep understanding
                  of our customers&apos; needs.
                </p>
                <p>
                  Today, GRAVIS generators power homes, hospitals, data centers, manufacturing
                  facilities, and critical infrastructure across the world.
                </p>
              </div>
            </div>

            <div className="relative h-[360px] md:h-[440px]">
              <Image src="/images/pages/about/history.png" alt="Gravis company history" fill className="rounded-3xl object-cover" />
            </div>
          </div>

          {/* Pull quote */}
          <div className="mt-16 rounded-3xl bg-slate-50 px-10 py-10 md:px-14 md:py-12">
            <div className="max-w-8xl">
              <Quote className="mb-5 h-8 w-8 text-[#0046B7]/25" aria-hidden />
              <p className="text-base leading-8 text-slate-600 md:text-lg md:leading-9">
                &ldquo;Bringing the light — We are proud to offer generators that local communities can
                rely on in disaster, for hospitals, and for any power need. Our generators stand
                apart by being there when people need power most.&rdquo;
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0046B7]">
                — Rajiv Mehta, Founder &amp; CEO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MISSION & VISION
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Mission & Vision" subtitle="Clear purpose and direction guide every decision we make." />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-8 md:p-10">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0046B7]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-michroma text-lg font-bold tracking-tight text-slate-900">Our Mission</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base md:leading-8">
                To deliver innovative, reliable, and sustainable power generation solutions that
                empower individuals, businesses, and communities worldwide. We are committed to
                excellence in engineering, customer service, and environmental stewardship.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-8 md:p-10">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0046B7]">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-michroma text-lg font-bold tracking-tight text-slate-900">Our Vision</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base md:leading-8">
                To be the global leader in power generation technology, recognized for innovation,
                sustainability, and customer success. We envision a world where reliable, clean
                energy is accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Core Values" subtitle="These principles shape how we work, innovate, and partner with our customers." />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ icon: Icon, title, description, bg, color }) => (
              <div key={title} className="rounded-2xl border border-slate-100 p-6 transition-shadow hover:shadow-sm">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-michroma font-bold tracking-tight text-slate-800">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 md:text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          JOURNEY OF GRAVIS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Journey of Gravis" subtitle="Key milestones that shaped who we are today." />

          {/* Desktop alternating timeline */}
          <div className="hidden md:block">
            {/* Top cards row */}
            <div className="grid grid-cols-5 gap-5">
              {journey.map((item) =>
                item.side === "top" ? (
                  <div key={item.year} className="flex flex-col items-center">
                    <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#0046B7]">{item.year}</span>
                        <span className="rounded-full bg-[#0046B7]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0046B7]">{item.tag}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{item.description}</p>
                      <button className="mt-3 rounded-full border border-[#0046B7] px-3 py-1 text-[9px] font-semibold text-[#0046B7] transition-colors hover:bg-[#0046B7] hover:text-white">
                        Learn More
                      </button>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                  </div>
                ) : (
                  <div key={item.year} className="flex flex-col items-center">
                    {/* invisible placeholder to keep grid alignment */}
                    <div className="invisible w-full rounded-2xl border p-4">
                      <div className="h-[90px]" />
                    </div>
                    <div className="h-6 w-px bg-transparent" />
                  </div>
                )
              )}
            </div>

            {/* Centre line */}
            <div className="h-px w-full bg-slate-200" />

            {/* Bottom cards row */}
            <div className="grid grid-cols-5 gap-5">
              {journey.map((item) =>
                item.side === "bottom" ? (
                  <div key={item.year} className="flex flex-col items-center">
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#0046B7]">{item.year}</span>
                        <span className="rounded-full bg-[#0046B7]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0046B7]">{item.tag}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{item.description}</p>
                      <button className="mt-3 rounded-full border border-[#0046B7] px-3 py-1 text-[9px] font-semibold text-[#0046B7] transition-colors hover:bg-[#0046B7] hover:text-white">
                        Learn More
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.year} />
                )
              )}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="space-y-8 border-l-2 border-slate-100 pl-6 md:hidden">
            {journey.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#0046B7] bg-white" />
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-extrabold text-[#0046B7]">{item.year}</span>
                  <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.tag}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY CHOOSE GRAVIS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Why Choose Gravis" subtitle="Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry." />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Asymmetric image mosaic */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 2fr", gridTemplateRows: "auto auto" }}>
              <div className="relative overflow-hidden rounded-2xl bg-slate-100" style={{ gridRow: "1 / 3", minHeight: "300px" }}>
                <Image src={whyChooseImages[0].src} alt={whyChooseImages[0].alt} fill className="object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-slate-100" style={{ minHeight: "148px" }}>
                <Image src={whyChooseImages[1].src} alt={whyChooseImages[1].alt} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden rounded-2xl bg-slate-100" style={{ minHeight: "140px" }}>
                  <Image src={whyChooseImages[2].src} alt={whyChooseImages[2].alt} fill className="object-cover" />
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-slate-100" style={{ minHeight: "140px" }}>
                  <Image src={whyChooseImages[3].src} alt={whyChooseImages[3].alt} fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Numbered feature list */}
            <div className="grid grid-cols-2 content-center gap-x-10 gap-y-10">
              {whyChooseGravis.map((item) => (
                <div key={item.title}>
                  <p className="font-michroma text-2xl font-bold italic text-[#0046B7]">{item.number}</p>
                  <h3 className="font-michroma mt-2 font-bold tracking-tight text-slate-800">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LIVING OUR MISSION
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Living Our Mission" subtitle="Real experiences from teams who rely on GRAVIS every day." />

          <div className="grid gap-5 md:grid-cols-3">
            {missionTestimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-100 p-7">
                <Quote className="mb-4 h-5 w-5 text-[#0046B7]/30" />
                <p className="text-sm leading-7 text-slate-500">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {item.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionLabel title="Testimonials" subtitle="Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry." />

          <div className="grid gap-5 md:grid-cols-3">
            {/* Col 1 */}
            <div className="space-y-4">
              {testimonials.slice(0, 2).map((t) => (
                <div key={t.name} className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <Stars count={t.stars} />
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{t.quote}</p>
                </div>
              ))}
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              {testimonials.slice(2, 4).map((t) => (
                <div key={t.name} className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <Stars count={t.stars} />
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{t.quote}</p>
                </div>
              ))}
            </div>

            {/* Col 3 — Blue highlight card */}
            <div className="rounded-2xl bg-[#0046B7] p-7 text-white">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">JB</div>
                <div>
                  <p className="text-sm font-semibold">Jerome Bell</p>
                  <p className="text-xs text-blue-200">Technical Director</p>
                </div>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100">
                Client Mention
              </span>
              <h3 className="font-michroma mt-5 text-base font-bold leading-snug">
                What They Say After Using Our Product
              </h3>
              <p className="mt-3 text-sm leading-7 text-blue-100">
                Implementation was seamless. The team went above and beyond to ensure everything
                worked perfectly from day one.
              </p>
              <Button size="sm" className="mt-6 rounded-full bg-white px-5 text-xs font-bold text-[#0046B7] hover:bg-blue-50" asChild>
                <Link href="/testimonials">View All</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <div className="border-t border-slate-100 bg-slate-50 py-20 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-michroma text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Powering your world, reliably.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base">
            Explore our generators and power solutions or talk to our team about the right system for your needs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-[#0046B7] hover:bg-[#003da0]" asChild>
              <Link href="/products" className="gap-2">
                View products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}