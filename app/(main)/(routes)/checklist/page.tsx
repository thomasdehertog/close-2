"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Filter, MoreHorizontal } from "lucide-react";
import { TaskList } from "./_components/task-list";
import { NewTaskButton } from "./_components/new-task-button";
import { MonthSelectorModal } from "./_components/month-selector-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ChecklistPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodParam = searchParams.get('period');
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const monthTriggerRef = useRef<HTMLAnchorElement>(null);

  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const periods = useQuery(api.periods.getAllPeriods, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );

  // Find the most recent open period
  const mostRecentPeriod = periods?.sort((a, b) => {
    const aDate = new Date(a.year, a.month - 1);
    const bDate = new Date(b.year, b.month - 1);
    return bDate.getTime() - aDate.getTime();
  }).find(p => p.status === "OPEN");

  // Get current date as fallback
  const now = new Date();
  const defaultYear = now.getFullYear();
  const defaultMonth = now.getMonth() + 1;

  // Initialize period state
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    if (periodParam) {
      const [year, month] = periodParam.split('-').map(Number);
      return { year, month };
    }
    if (mostRecentPeriod) {
      return {
        year: mostRecentPeriod.year,
        month: mostRecentPeriod.month
      };
    }
    return {
      year: defaultYear,
      month: defaultMonth
    };
  });

  // Effect to handle URL updates
  useEffect(() => {
    if (!periodParam && mostRecentPeriod) {
      const newUrl = `/checklist?period=${mostRecentPeriod.year}-${mostRecentPeriod.month.toString().padStart(2, '0')}`;
      router.replace(newUrl);
    }
  }, [mostRecentPeriod, periodParam]);

  // Effect to handle period state updates from URL
  useEffect(() => {
    if (periodParam) {
      const [year, month] = periodParam.split('-').map(Number);
      setCurrentPeriod({ year, month });
    }
  }, [periodParam]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthName = monthNames[currentPeriod.month - 1];
  const currentYear = currentPeriod.year;

  const handleMonthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMonthSelectorOpen(true);
  };

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Header Section */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    ref={monthTriggerRef}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMonthSelectorOpen(true);
                    }}
                    className="text-muted-foreground hover:text-[#F08019] cursor-pointer"
                  >
                    {currentMonthName} {currentYear}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Checklist</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-2">
            {/* Profile Icons */}
            <div className="flex -space-x-2">
              <Avatar className="h-6 w-6 border-2 border-white">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>JH</AvatarFallback>
              </Avatar>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-0.5 rounded-full">
              <Progress value={33} className="w-3.5 h-3.5" />
              <span className="text-xs">0%</span>
            </div>

            {/* Filter Button */}
            <Button variant="outline" size="sm" className="h-8 px-3 hover:text-[#F08019] hover:border-[#F08019]">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
            </Button>

            {/* Add Task Button */}
            <div className="[&>button]:bg-[#F08019] [&>button]:hover:bg-[#F08019]/90 [&>button]:h-8 [&>button]:px-3">
              <NewTaskButton />
            </div>

            {/* More Options */}
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#F08019]">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 w-full" />

      {/* Checklist Content */}
      <div className="flex-1 p-6">
        <TaskList />
      </div>

      {/* Month Selector Modal */}
      <MonthSelectorModal
        isOpen={isMonthSelectorOpen}
        onClose={() => setIsMonthSelectorOpen(false)}
        triggerRef={monthTriggerRef}
        currentPeriod={{ year: currentPeriod.year, month: currentPeriod.month }}
      />
    </div>
  );
} 