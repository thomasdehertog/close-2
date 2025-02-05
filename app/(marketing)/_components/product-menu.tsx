import Link from "next/link"
import { CheckCircle, RefreshCcw, LineChart, Link2, BarChart3, Shield, ChevronRight } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export function ProductMenu() {
  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className="h-10 px-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 top-0 w-[400px] sm:w-[500px] lg:w-[900px]">
            <div className="grid gap-3 p-4 lg:p-6 bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <h3 className="col-span-full text-sm font-medium text-muted-foreground">Core Products</h3>
                {[
                  {
                    title: "Close Management",
                    href: "/close-management",
                    description: "Streamline your month-end close with AI-powered automation.",
                    icon: CheckCircle,
                  },
                  {
                    title: "Reconciliations",
                    href: "/reconciliations",
                    description: "Automate balance sheet reconciliations and variance analysis.",
                    icon: RefreshCcw,
                  },
                  {
                    title: "Flux Analysis",
                    href: "/flux-analysis",
                    description: "Get AI-powered insights into your financial variances.",
                    icon: LineChart,
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-md bg-primary/10 p-1.5 text-primary group-hover:bg-primary/20 transition-colors duration-200">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium group-hover:text-primary transition-colors duration-200">{item.title}</h4>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <h3 className="col-span-full text-sm font-medium text-muted-foreground">Platform</h3>
                {[
                  {
                    title: "Integrations",
                    href: "/integrations",
                    description: "Connect with your existing financial stack.",
                    icon: Link2,
                  },
                  {
                    title: "Reporting & Analytics",
                    href: "/reporting",
                    description: "Get real-time insights into your financial data.",
                    icon: BarChart3,
                  },
                  {
                    title: "Security & Compliance",
                    href: "/security",
                    description: "Enterprise-grade security and SOX compliance.",
                    icon: Shield,
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-md bg-primary/10 p-1.5 text-primary group-hover:bg-primary/20 transition-colors duration-200">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium group-hover:text-primary transition-colors duration-200">{item.title}</h4>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport 
        className="absolute left-0 top-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200" 
        style={{
          '--scale': '100%',
          '--viewport-padding': '0px',
        } as React.CSSProperties}
      />
    </NavigationMenu>
  )
} 