"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Home, Inbox, Bot, PieChart, CheckSquare, FileSpreadsheet, HelpCircle, Settings, BarChart3, TrendingUp, Layout } from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useSearch } from "@/hooks/use-search";
import { Input } from "./ui/input";
import { NavigationItem, NavigationGroup, NavigationDivider } from "./navigation-item";

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const search = useSearch();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div>
          <UserItem />
          
          <div className="p-3">
            <Input
              placeholder="Search..."
              className="bg-white"
              onClick={search.onOpen}
            />
          </div>

          <NavigationDivider />

          <div className="space-y-1">
            <NavigationItem
              label="Home"
              icon={Home}
              path="/dashboard"
            />
            <NavigationItem
              label="Inbox"
              icon={Inbox}
              path="/inbox"
              isInbox
            />
            <NavigationItem
              label="Assistant"
              icon={Bot}
              path="/assistant"
            />
          </div>

          <NavigationDivider />

          <NavigationGroup label="Maandafsluiting">
            <div className="space-y-1">
              <NavigationItem
                label="Overview"
                icon={PieChart}
                path="/overview"
              />
              <NavigationItem
                label="Checklist"
                icon={CheckSquare}
                path="/checklist"
              />
              <NavigationItem
                label="Reconcile"
                icon={FileSpreadsheet}
                path="/reconcile"
              />
              <NavigationItem
                label="Flux Analysis"
                icon={TrendingUp}
                path="/flux-analysis"
              />
              <NavigationItem
                label="Dashboarding"
                icon={Layout}
                path="/dashboarding"
              />
            </div>
          </NavigationGroup>

          <NavigationItem
            label="Reports"
            icon={BarChart3}
            path="/reports"
          />
        </div>

        <div className="mt-auto space-y-1">
          <NavigationItem
            label="Help"
            icon={HelpCircle}
            path="/help"
          />
          <NavigationItem
            label="Settings"
            icon={Settings}
            path="/settings"
          />
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
        </nav>
      </div>
    </>
  );
}; 