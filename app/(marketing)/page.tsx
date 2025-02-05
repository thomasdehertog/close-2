import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Zap, ChevronRight, RefreshCcw, LineChart } from "lucide-react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { ProductMenu } from "./_components/product-menu"
import { SolutionsMenu } from "./_components/solutions-menu"

function LogoCloud() {
  return (
    <div className="w-full bg-white py-24">
      <div className="container mb-10">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by leading finance teams
        </h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[100px] z-10 pointer-events-none bg-gradient-to-r from-white via-white/50 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[100px] z-10 pointer-events-none bg-gradient-to-l from-white via-white/50 to-transparent" />
        <div className="flex animate-marquee-reverse">
          <div className="flex shrink-0 gap-8">
            {[
              {
                src: "/placeholder.svg",
                alt: "Mercury",
              },
              {
                src: "/placeholder.svg",
                alt: "Plaid",
              },
              {
                src: "/placeholder.svg",
                alt: "Wealthfront",
              },
              {
                src: "/placeholder.svg",
                alt: "Betterment",
              },
              {
                src: "/placeholder.svg",
                alt: "Stripe",
              },
              {
                src: "/placeholder.svg",
                alt: "Square",
              },
              {
                src: "/placeholder.svg",
                alt: "Coinbase",
              },
              {
                src: "/placeholder.svg",
                alt: "Robinhood",
              },
            ].reverse().map((brand) => (
              <div key={brand.alt} className="flex items-center justify-center">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={120}
                  height={40}
                  className="max-h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="flex shrink-0 gap-8">
            {[
              {
                src: "/placeholder.svg",
                alt: "Mercury",
              },
              {
                src: "/placeholder.svg",
                alt: "Plaid",
              },
              {
                src: "/placeholder.svg",
                alt: "Wealthfront",
              },
              {
                src: "/placeholder.svg",
                alt: "Betterment",
              },
              {
                src: "/placeholder.svg",
                alt: "Stripe",
              },
              {
                src: "/placeholder.svg",
                alt: "Square",
              },
              {
                src: "/placeholder.svg",
                alt: "Coinbase",
              },
              {
                src: "/placeholder.svg",
                alt: "Robinhood",
              },
            ].reverse().map((brand) => (
              <div key={brand.alt} className="flex items-center justify-center">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={120}
                  height={40}
                  className="max-h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function MarketingPage() {
  const { userId } = auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/home" className="text-xl font-semibold">
              FinanceHub
            </Link>
            <nav className="hidden gap-6 md:flex">
              <ProductMenu />
              <SolutionsMenu />
              <Link href="#testimonials" className="h-10 px-3 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                Customers
              </Link>
              <Link href="#" className="h-10 px-3 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Button asChild>
              <Link href="/sign-up">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#635bff] via-[#ff7eb6] to-[#f6c177] opacity-[0.15]" />

          <div className="container relative py-24 md:py-32">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-start text-left">
                <h1 className="text-gradient-purple mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  AI-powered close automation
                </h1>
                <p className="mb-8 max-w-[600px] text-xl text-muted-foreground">
                  With FinanceHub, leading teams organize their close, streamline reconciliations, and leverage AI for
                  auto-drafted flux analysis and lightning-fast reporting.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/sign-up">
                      Schedule Demo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/sign-up">Sign Up Free</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-lg bg-white/50 shadow-2xl">
                  <Image
                    src="/placeholder.svg"
                    alt="FinanceHub Platform"
                    width={800}
                    height={600}
                    className="rounded-lg"
                    priority
                  />
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-lg bg-[#635bff]/10" />
                  <div className="absolute -right-6 -top-6 h-12 w-12 rounded-lg bg-[#635bff]/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud Section */}
        <LogoCloud />

        {/* Products Section */}
        <section id="products" className="py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-[800px] space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">One platform for your entire close</h2>
              <p className="text-lg text-muted-foreground">
                FinanceHub acts as your AI-assistant across the entire accounting lifecycle, taking work off your plate
                so you can focus on what matters.
              </p>
            </div>

            <div className="mt-16 grid gap-12">
              {/* Close Management */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    Close Management
                  </div>
                  <h3 className="text-2xl font-semibold">Design your month-end playbook</h3>
                  <p className="text-muted-foreground">
                    Organize your close, automate reconciliations, and leverage AI to spend less time on recurring
                    tasks. Close faster and more confidently with our purpose-built tools.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Automated workflows and checklists",
                      "Real-time progress tracking",
                      "AI-powered task automation",
                      "Integrated review process",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/close-management">
                      Learn more about Close Management
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <Image
                    src="/placeholder.svg"
                    alt="Close Management"
                    width={600}
                    height={400}
                    className="rounded-md"
                  />
                </div>
              </div>

              {/* Reconciliations */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="order-2 lg:order-1 rounded-lg border bg-white p-4 shadow-sm">
                  <Image
                    src="/placeholder.svg"
                    alt="Reconciliations"
                    width={600}
                    height={400}
                    className="rounded-md"
                  />
                </div>
                <div className="order-1 lg:order-2 space-y-4">
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    Reconciliations
                  </div>
                  <h3 className="text-2xl font-semibold">Automate your reconciliations</h3>
                  <p className="text-muted-foreground">
                    Streamline your reconciliation process with automated matching, variance analysis, and real-time
                    updates. Never miss a discrepancy again.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Automated transaction matching",
                      "Real-time balance monitoring",
                      "Exception flagging and routing",
                      "Historical tracking and audit trail",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <RefreshCcw className="h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/reconciliations">
                      Learn more about Reconciliations
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Flux Analysis */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    Flux Analysis
                  </div>
                  <h3 className="text-2xl font-semibold">AI-powered variance analysis</h3>
                  <p className="text-muted-foreground">
                    Let AI do the heavy lifting in your flux analysis. Get instant insights into variances and trends,
                    with automated explanations and supporting documentation.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Automated variance detection",
                      "AI-generated explanations",
                      "Trend analysis and visualization",
                      "Drill-down capabilities",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/flux-analysis">
                      Learn more about Flux Analysis
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <Image
                    src="/placeholder.svg"
                    alt="Flux Analysis"
                    width={600}
                    height={400}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="border-t bg-gray-50 py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-[800px] space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Trusted by leading finance teams</h2>
              <p className="text-lg text-muted-foreground">See what our customers are saying about FinanceHub</p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "FinanceHub has transformed our month-end close process. What used to take us weeks now takes days, with better accuracy and visibility.",
                  author: "Sarah Chen",
                  title: "Controller at TechCorp",
                  image: "/placeholder.svg",
                },
                {
                  quote:
                    "The AI-powered flux analysis is a game-changer. It catches variances we might have missed and provides detailed explanations automatically.",
                  author: "Michael Rodriguez",
                  title: "CFO at GrowthCo",
                  image: "/placeholder.svg",
                },
                {
                  quote:
                    "The automated reconciliations have saved our team countless hours. The accuracy and audit trail give us confidence in our numbers.",
                  author: "Emily Thompson",
                  title: "Accounting Manager at ScaleUp",
                  image: "/placeholder.svg",
                },
              ].map((testimonial, i) => (
                <div key={i} className="relative rounded-lg border bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                  <blockquote className="mb-4 text-muted-foreground">"{testimonial.quote}"</blockquote>
                  <div>
                    <cite className="not-italic font-semibold">{testimonial.author}</cite>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-white to-white" />
          <div className="container relative">
            <div className="mx-auto max-w-[800px] space-y-8 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to transform your close process?</h2>
              <p className="text-lg text-muted-foreground">
                Join leading finance teams who trust FinanceHub to streamline their month-end close.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/sign-up">
                    Schedule Demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Powered by FinanceHub</span>
            </div>
            <nav className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
} 