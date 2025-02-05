import Link from "next/link"
import { Building2, Buildings, Factory, Briefcase, Landmark, GraduationCap, ChevronRight } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

type IconName = keyof typeof icons

const icons = {
  Building2,
  Buildings,
  Factory,
  Briefcase,
  Landmark,
  GraduationCap,
} as const

interface MenuItem {
  title: string
  href: string
  description: string
  icon: keyof typeof icons
}

const sizeItems: MenuItem[] = [
  {
    title: "Growing Companies",
    href: "/solutions/growing-companies",
    description: "Scale your finance operations with automation.",
    icon: "Building2",
  },
  {
    title: "Small Business",
    href: "/solutions/small-business",
    description: "Streamline accounting and financial processes.",
    icon: "Buildings",
  },
  {
    title: "Enterprise",
    href: "/solutions/enterprise",
    description: "Transform operations across multiple entities.",
    icon: "Factory",
  },
]

const typeItems: MenuItem[] = [
  {
    title: "Private Equity",
    href: "/solutions/private-equity",
    description: "Optimize portfolio company operations.",
    icon: "Briefcase",
  },
  {
    title: "Public Companies",
    href: "/solutions/public-companies",
    description: "Meet SOX compliance requirements.",
    icon: "Landmark",
  },
  {
    title: "Accounting Firms",
    href: "/solutions/accounting-firms",
    description: "Enhance client services with AI tools.",
    icon: "GraduationCap",
  },
]

function MenuLink({ item }: { item: MenuItem }) {
  const Icon = icons[item.icon]
  
  if (!Icon) {
    return null
  }

  return (
    <Link
      href={item.href}
      className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-md bg-primary/10 p-1.5 text-primary group-hover:bg-primary/20 transition-colors duration-200">
          <Icon className="h-5 w-5" />
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
  )
}

export function SolutionsMenu() {
  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className="h-10 px-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Solutions
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 top-0 w-[400px] sm:w-[500px] lg:w-[800px]">
            <div className="grid gap-3 p-4 lg:p-6 bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <h3 className="col-span-full text-sm font-medium text-muted-foreground">By size</h3>
                {sizeItems.map((item) => (
                  <MenuLink key={item.title} item={item} />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <h3 className="col-span-full text-sm font-medium text-muted-foreground">By type</h3>
                {typeItems.map((item) => (
                  <MenuLink key={item.title} item={item} />
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