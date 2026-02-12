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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { label: "Years of Excellence", value: "20+" },
  { label: "Happy Customers", value: "5M+" },
  { label: "Service Centers", value: "500+" },
];

const coreValues = [
  {
    icon: Shield,
    title: "Self Reliance",
    description:
      "We empower people to take ownership of their work and growth, building confidence and capability.",
  },
  {
    icon: Zap,
    title: "Hard Work",
    description:
      "We value the dedication and discipline required to deliver excellence in everything we do.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We foster a culture of teamwork, communication, and mutual respect to achieve shared goals.",
  },
  {
    icon: Award,
    title: "Innovation & Sustainability",
    description:
      "We embrace new ideas and technologies while protecting the environment for future generations.",
  },
];

const journey = [
  {
    year: "2003",
    title: "The Beginning",
    tag: "Foundation",
    description:
      "GRAVIS is founded with a vision to revolutionize power generation technology and make reliable energy accessible to all.",
  },
  {
    year: "2008",
    title: "First Major Innovation",
    tag: "EcoGen Technology",
    description:
      "Launch of our EcoGen technology, reducing emissions by 40% while improving fuel efficiency.",
  },
  {
    year: "2014",
    title: "Global Expansion",
    tag: "25 Countries",
    description:
      "Operations expand to 25 countries, establishing GRAVIS as a trusted international brand.",
  },
  {
    year: "2019",
    title: "Industry Recognition",
    tag: "Award Winner",
    description:
      "Recognized with major industry awards for hybrid solar-generator integration and sustainable solutions.",
  },
  {
    year: "2024",
    title: "Future Forward",
    tag: "AI-Powered",
    description:
      "Launch of next-generation smart generators with IoT connectivity and AI-powered optimization.",
  },
];

const whyChoose = [
  {
    title: "Superior Performance",
    description:
      "Industry-leading power output with exceptional fuel efficiency and minimal emissions.",
  },
  {
    title: "Unmatched Reliability",
    description:
      "Built with premium components and rigorous quality control for dependable performance.",
  },
  {
    title: "Easy Maintenance",
    description:
      "User-friendly design with accessible service points and comprehensive support.",
  },
  {
    title: "Eco-Friendly",
    description:
      "Advanced emission control technology and renewable integration for a greener tomorrow.",
  },
];

const testimonials = [
  {
    name: "Loe Markdo",
    role: "Co‑Founder of Company",
    quote:
      "Using this platform has completely changed the way I approach my daily habits. Each small step added up to noticeable improvements.",
  },
  {
    name: "Antonio Loeki",
    role: "Operations Lead",
    quote:
      "The support and insights kept us focused and accountable. Progress felt achievable and we finally see results we can sustain.",
  },
  {
    name: "Mack Suio Joe",
    role: "Plant Manager",
    quote:
      "Our power systems are more reliable than ever. Clear guidance and dependable equipment keep our operations running smoothly.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* About GRAVIS hero */}
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="flex flex-col justify-center gap-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
                  <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
                  About Gravis
                </h1>
                <p className="mt-2 text-sm font-semibold text-slate-700 md:text-base">
                  Holistic, personalized, and innovative power solutions for
                  lifelong reliability.
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                <p>
                  GRAVIS has been at the forefront of power generation solutions
                  in India for over two decades. We are committed to delivering
                  reliable, efficient, and innovative generator systems that
                  keep your world running smoothly.
                </p>
                <p>
                  From small portable units to large industrial power systems,
                  our comprehensive range of generators is designed to meet
                  diverse power needs across residential, commercial, and
                  industrial sectors. With a strong focus on quality,
                  innovation, and customer satisfaction, we have earned the
                  trust of millions across the nation.
                </p>
              </div>

              <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center sm:grid-cols-3 sm:text-left">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-slate-200 pb-3 last:border-b-0 sm:border-b-0 sm:border-r last:sm:border-r-0 sm:pb-0 sm:pr-4 last:sm:pr-0"
                  >
                    <div className="text-xl font-extrabold text-slate-900 md:text-2xl">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[260px] w-full max-w-md md:h-[320px]">
                <Image
                  src="/images/pages/home/about.png"
                  alt="Gravis generator system"
                  fill
                  className="rounded-[32px] object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company history */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
                <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
                Company history
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Founded in 1995, GRAVIS emerged from a powerful vision: to
                ensure that no home or business would ever be left in the dark.
              </p>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                <p>
                  What started as a small operation with a handful of dedicated
                  engineers has grown into a global powerhouse in the generator
                  industry. Our journey has been marked by continuous
                  innovation, unwavering commitment to quality, and a deep
                  understanding of our customers&apos; needs.
                </p>
                <p>
                  Today, GRAVIS generators power homes, hospitals, data centers,
                  manufacturing facilities, and critical infrastructure across
                  the world. Every product bearing the GRAVIS name represents
                  decades of engineering expertise and manufacturing excellence.
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[260px] w-full max-w-md md:h-[320px]">
                <Image
                  src="/images/pages/about/history.png"
                  alt="Gravis company history"
                  fill
                  className="rounded-[32px] object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Mission & Vision
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Clear purpose and direction guide every decision we make.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle className="font-michroma text-xl">
                  Our mission
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  To deliver innovative, reliable, and sustainable power
                  generation solutions that empower individuals, businesses, and
                  communities worldwide.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                We are committed to excellence in engineering, customer
                service, and environmental stewardship—ensuring our products not
                only meet but exceed the expectations of those who depend on us.
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <CardTitle className="font-michroma text-xl">
                  Our vision
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  To be the global leader in power generation technology,
                  recognized for innovation, sustainability, and customer
                  success.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                We envision a world where reliable, clean energy is accessible
                to all—powering progress and prosperity while protecting our
                planet for future generations.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Core values
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              These principles shape how we work, innovate, and partner with our
              customers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Journey of Gravis
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Key milestones that shaped who we are today.
            </p>
          </div>
          <div className="space-y-4 border-l border-slate-200 pl-4 md:pl-6">
            {journey.map((item) => (
              <div key={item.year} className="relative pl-4">
                <span className="absolute left-[-10px] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0046B7] shadow-sm" />
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-extrabold text-[#0046B7]">
                    {item.year}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose GRAVIS */}
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Why choose Gravis
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Reasons customers around the world trust our power solutions.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {whyChoose.map((item, index) => (
              <Card key={item.title} className="border-slate-200">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0046B7] text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs text-slate-600">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto container rounded-2xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
                <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
                Living our mission
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Real experiences from teams who rely on GRAVIS every day.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card
                key={item.name}
                className="flex flex-col justify-between border-slate-200"
              >
                <CardContent className="pt-6">
                  <Quote className="mb-3 h-5 w-5 text-[#0046B7]" />
                  <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
                    {item.quote}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center md:px-12 md:py-14">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Powering your world, reliably.
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Explore our generators and power solutions or talk to our team about
            the right system for your needs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products" className="gap-2">
                View products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

