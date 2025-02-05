"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Plug, 
  Users, 
  CalendarDays, 
  Building2, 
  Package, 
  User,
  HelpCircle,
  Headphones
} from "lucide-react";

const sidebarItems = [
  {
    label: "Integrations",
    icon: Plug,
    href: "/settings/integrations",
  },
  {
    label: "Team",
    icon: Users,
    href: "/settings/team",
  },
  {
    label: "Holidays",
    icon: CalendarDays,
    href: "/settings/holidays",
  },
  {
    label: "Workspace",
    icon: Building2,
    href: "/settings/workspace",
  },
  {
    label: "Properties",
    icon: Package,
    href: "/settings/properties",
  },
  {
    label: "My Profile",
    icon: User,
    href: "/settings/profile",
  },
  {
    type: "divider"
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/settings/help",
  },
  {
    label: "Support",
    icon: Headphones,
    href: "/settings/support",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background px-4 py-6">
        <div className="flex flex-col space-y-1">
          {sidebarItems.map((item, index) => {
            if (item.type === "divider") {
              return <div key={index} className="my-4 border-t" />;
            }
            
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 