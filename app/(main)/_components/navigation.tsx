"use client";

import { Settings, ListChecks, ChevronRight, Home, LayoutGrid, FileSpreadsheet } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { UserItem } from "./user-item";
import { useSettings } from "@/hooks/use-settings";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const params = useParams();
  const { user } = useUser();

  return (
    <div className="relative h-full">
      <Collapsible
        defaultOpen
        className="group h-full transition-all duration-300 ease-in-out data-[state=open]:w-60 data-[state=closed]:w-16"
      >
        <div className="flex h-full flex-col bg-[#F9F9FB]">
          {/* User Profile */}
          <div className="flex justify-center py-2 group-data-[state=closed]:px-3 data-[state=open]:px-4">
            <div className="w-full group-data-[state=closed]:w-10">
              <div className="group-data-[state=open]:block group-data-[state=closed]:hidden">
                <UserItem />
              </div>
              <div className="hidden group-data-[state=closed]:block">
                <div className="flex justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="mt-4 px-3">
            {/* Home */}
            <button
              onClick={() => router.push('/')}
              className={cn(
                "flex w-full items-center justify-start rounded-lg p-2",
                "hover:bg-primary/5 transition-colors",
                "group/item",
                params?.documentId === 'home' && "bg-primary/5"
              )}
            >
              <Home className="h-4 w-4 shrink-0 text-muted-foreground group-hover/item:text-primary" />
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                Home
              </span>
            </button>

            {/* Maandafsluiting Section */}
            <div className="mt-6 mb-4">
              <div className="px-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Maandafsluiting
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#F08019]">
                    JUNI 2024
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#F08019]" />
                </div>
              </div>
            </div>

            {/* Overview */}
            <button
              onClick={() => router.push('/overview')}
              className={cn(
                "flex w-full items-center justify-start rounded-lg p-2",
                "hover:bg-primary/5 transition-colors",
                "group/item",
                params?.documentId === 'overview' && "bg-primary/5"
              )}
            >
              <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground group-hover/item:text-primary" />
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                Overview
              </span>
            </button>

            {/* Checklist */}
            <button
              onClick={() => router.push('/checklist')}
              className={cn(
                "flex w-full items-center justify-center rounded-lg p-2",
                "hover:bg-primary/5 transition-colors",
                "group/item",
                "group-data-[state=open]:justify-start",
                params?.documentId === 'checklist' && "bg-primary/5"
              )}
            >
              <ListChecks 
                className="h-4 w-4 shrink-0 text-muted-foreground 
                          group-hover/item:text-primary" 
              />
              <span className="ml-2 text-sm font-medium text-muted-foreground group-data-[state=closed]:hidden">
                Checklist
              </span>
            </button>

            {/* Reconcile */}
            <button
              onClick={() => router.push('/reconcile')}
              className={cn(
                "flex w-full items-center justify-center rounded-lg p-2",
                "hover:bg-primary/5 transition-colors",
                "group/item",
                "group-data-[state=open]:justify-start",
                params?.documentId === 'reconcile' && "bg-primary/5"
              )}
            >
              <FileSpreadsheet 
                className="h-4 w-4 shrink-0 text-muted-foreground 
                          group-hover/item:text-primary" 
              />
              <span className="ml-2 text-sm font-medium text-muted-foreground group-data-[state=closed]:hidden">
                Reconcile
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={settings.onOpen}
              className={cn(
                "flex w-full items-center justify-center rounded-lg p-2 mt-2",
                "hover:bg-primary/5 transition-colors",
                "group/item",
                "group-data-[state=open]:justify-start"
              )}
            >
              <Settings 
                className="h-4 w-4 shrink-0 text-muted-foreground 
                          group-hover/item:text-primary" 
              />
              <span className="ml-2 text-sm font-medium text-muted-foreground group-data-[state=closed]:hidden">
                Settings
              </span>
            </button>
          </div>

          {/* Collapse Trigger */}
          <CollapsibleTrigger asChild>
            <button
              className="absolute -right-7 top-6 z-50 flex h-6 w-6 
                         items-center justify-center rounded-full bg-black 
                         text-white hover:bg-black/90 transition-transform
                         group-data-[state=closed]:rotate-180"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
};