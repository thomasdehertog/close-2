"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useInbox } from "@/hooks/use-inbox";

interface NavigationItemProps {
  label: string;
  icon: LucideIcon;
  path: string;
  isInbox?: boolean;
}

interface NavigationGroupProps {
  label: string;
  children: React.ReactNode;
}

export const NavigationItem = ({
  label,
  icon: Icon,
  path,
  isInbox
}: NavigationItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const inbox = useInbox();
  
  const isActive = isInbox ? inbox.isOpen : pathname === path;

  const onClick = () => {
    if (isInbox) {
      inbox.onOpen();
    } else {
      router.push(path);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-muted-foreground text-sm font-medium px-3 py-1 hover:bg-[#F08019]/10 cursor-pointer rounded-md transition-colors",
        isActive && "text-[#F08019]"
      )}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        <Icon 
          className={cn(
            "h-4 w-4",
            isActive && "text-[#F08019]"
          )} 
        />
      </div>
      {label}
    </div>
  );
};

export const NavigationGroup = ({
  label,
  children
}: NavigationGroupProps) => {
  return (
    <div className="mb-2">
      <p className="text-sm font-medium text-muted-foreground/80 mb-1 px-3">
        {label}
      </p>
      {children}
    </div>
  );
};

export const NavigationDivider = () => {
  return (
    <div className="h-4" />
  );
};