import Link from "next/link";
import {
  Target,
  Eye,
  Award,
  Zap,
  Shield,
  Users,
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

const values = [
  {
    icon: Shield,
    title: "Quality first",
    description:
      "We source and deliver equipment that meets the highest standards so your projects run reliably.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "From generators to heavy machinery, we focus on power and efficiency that gets the job done.",
  },
  {
    icon: Users,
    title: "Partnership",
    description:
      "We work with you long-term—understanding your needs and supporting you at every step.",
  },
  {
    icon: Award,
    title: "Integrity",
    description:
      "Transparent pricing, honest advice, and commitments we keep. Your trust is our priority.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-muted/20 px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-michroma text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            About Gravis
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            We power projects and partnerships with reliable equipment and
            dedicated support.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        {/* Story */}
        <section className="mx-auto max-w-3xl">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground">
            Our story
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Gravis was built on a simple idea: give businesses access to
              dependable industrial equipment and the support to use it well.
              What started as a focused effort to serve construction, events,
              and manufacturing has grown into a trusted partner for generators,
              machinery, and related solutions across India.
            </p>
            <p>
              Today we combine a wide product range with clear advice, flexible
              options, and after-sales care. Whether you need a one-off rental
              or a long-term supply relationship, we’re here to help you build
              with confidence.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mt-16 grid gap-8 sm:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="font-michroma text-xl">
                Our mission
              </CardTitle>
              <CardDescription>
                To provide reliable, efficient equipment and support so our
                customers can focus on delivering their best work—on time and on
                budget.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <CardTitle className="font-michroma text-xl">
                Our vision
              </CardTitle>
              <CardDescription>
                To be the go-to partner for industrial and power equipment in
                India—known for quality, service, and long-term relationships
                that help businesses grow.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground">
            What we stand for
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            These principles guide how we work with you and run our business.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-border bg-card transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="text-sm">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-2xl border border-border bg-muted/30 px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ready to work with us?
          </h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Explore our products or get in touch for a conversation.
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
        </section>
      </div>
    </div>
  );
}
