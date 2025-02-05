"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";

interface MonthSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLAnchorElement>;
  currentPeriod: {
    year: number;
    month: number;
  };
}

export function MonthSelectorModal({
  isOpen,
  onClose,
  triggerRef,
  currentPeriod,
}: MonthSelectorModalProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number } | null>(null);
  const [confirmChecks, setConfirmChecks] = useState({
    templateReviewed: false,
    changesUnderstand: false
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const periods = useQuery(api.periods.getAllPeriods, 
    workspace ? { workspaceId: workspace._id } : "skip"
  );
  const createPeriod = useMutation(api.periods.createPeriod);
  const closePeriod = useMutation(api.periods.closePeriod);

  // Get tasks for all periods
  const allPeriodTasks = useQuery(api.tasks.getTasks, 
    workspace ? { 
      workspaceId: workspace._id,
      parentTaskId: undefined 
    } : "skip"
  );

  const calculatePeriodCompletion = (periodId: Id<"periods">) => {
    if (!allPeriodTasks) return 0;
    
    const periodTasks = allPeriodTasks.filter(task => task.periodId === periodId);
    if (!periodTasks.length) return 0;
    
    const completedTasks = periodTasks.filter(task => 
      task.status === "COMPLETED" || task.status === "SUBMITTED"
    ).length;
    
    return Math.round((completedTasks / periodTasks.length) * 100);
  };

  const getMonthData = (year: number, month: number) => {
    if (!periods) return null;
    
    const monthId = `${year}-${month.toString().padStart(2, '0')}`;
    const period = periods.find(p => p.monthId === monthId);
    
    if (!period) return null;

    return {
      ...period,
      completion: calculatePeriodCompletion(period._id),
    };
  };

  const years = [2024, 2023, 2022];
  
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, triggerRef]);

  const handleOpenPeriod = async (year: number, month: number) => {
    setSelectedMonth({ year, month });
    setConfirmDialogOpen(true);
  };

  const handleConfirmOpen = async () => {
    if (!workspace || !selectedMonth) return;

    // Validate that both checkboxes are checked
    if (!confirmChecks.templateReviewed || !confirmChecks.changesUnderstand) {
      toast.error("Please confirm both checkboxes before proceeding");
      return;
    }

    try {
      // Create the period
      const newPeriod = await createPeriod({
        workspaceId: workspace._id,
        year: selectedMonth.year,
        month: selectedMonth.month,
      });

      if (newPeriod) {
        // Format the period for the URL
        const monthId = `${selectedMonth.year}-${selectedMonth.month.toString().padStart(2, '0')}`;
        
        // Close dialogs and reset state
        setConfirmDialogOpen(false);
        setSuccessDialogOpen(false);
        setSelectedMonth(null);
        setConfirmChecks({ templateReviewed: false, changesUnderstand: false });
        
        // Show success message
        toast.success("Period created successfully!");
        
        // Close the modal
        onClose();
        
        // Navigate to the new period
        router.push(`/checklist?period=${monthId}`);
      }
    } catch (error: any) {
      console.error("Failed to open period:", error);
      const errorMessage = error.message || "Failed to open period";
      toast.error(errorMessage);
    }
  };

  const handleClosePeriod = async (periodId: Id<"periods">) => {
    try {
      await closePeriod({ periodId });
      toast.success("Period closed successfully");
    } catch (error) {
      console.error("Failed to close period:", error);
      toast.error("Failed to close period");
    }
  };

  const handleMonthSelect = (year: number, month: number) => {
    const formattedMonth = month.toString().padStart(2, '0');
    onClose();
    router.push(`/checklist?period=${year}-${formattedMonth}`);
  };

  const canManagePeriod = (year: number, month: number, lastOpenPeriod: any) => {
    if (!lastOpenPeriod) return true;
    
    const periodDate = new Date(year, month - 1);
    const lastOpenDate = new Date(lastOpenPeriod.year, lastOpenPeriod.month - 1);
    const currentDate = new Date();
    
    // Allow reopening past periods
    if (periodDate < lastOpenDate) return true;
    
    // For future periods, only allow opening the next month after the last open period
    if (periodDate > lastOpenDate) {
      const nextMonth = new Date(lastOpenDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return periodDate.getTime() === nextMonth.getTime();
    }
    
    return false;
  };

  const getPeriodActionButton = (period: any, isOpen: boolean, year: number, month: number, lastOpenPeriod: any) => {
    if (isOpen) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={(e) => {
            e.stopPropagation();
            if (period) {
              handleClosePeriod(period._id);
            }
          }}
        >
          Close Period
        </Button>
      );
    }

    const periodDate = new Date(year, month - 1);
    const lastOpenDate = lastOpenPeriod ? new Date(lastOpenPeriod.year, lastOpenPeriod.month - 1) : new Date(0);
    const canManage = canManagePeriod(year, month, lastOpenPeriod);
    const isPastPeriod = periodDate < lastOpenDate;

    return (
      <Button
        variant="outline"
        size="sm"
        className="text-sm"
        disabled={!canManage}
        onClick={(e) => {
          e.stopPropagation();
          handleOpenPeriod(year, month);
        }}
      >
        {isPastPeriod ? "Reopen Period" : "Open Period"}
      </Button>
    );
  };

  const getMonthCardClassName = (year: number, month: number, isOpen: boolean) => {
    const isCurrentMonth = currentPeriod?.year === year && currentPeriod?.month === month;
    
    return cn(
      "bg-white rounded-lg border hover:border-[#F08019]/30 transition-colors p-3 cursor-pointer",
      {
        "border-[#F08019] bg-[#F08019]/5": isCurrentMonth,
        "opacity-75": !isOpen,
      }
    );
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthNum = i + 1;
    const isQuarterEnd = monthNum % 3 === 0;
    const monthPeriod = getMonthData(selectedYear, monthNum);

    return {
      name: monthNames[i],
      month: monthNum,
      isQuarterEnd,
      status: monthPeriod?.status || "CLOSED",
      completion: monthPeriod?.completion || 0,
      period: monthPeriod
    };
  });

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && 
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  const handleTemplateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const monthId = `${selectedYear}-${selectedMonth?.month.toString().padStart(2, '0')}`;
    router.push(`/templates?from=${selectedMonth?.month && months[selectedMonth.month - 1].name}`);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              zIndex: 51
            }}
            className="w-[500px] bg-white rounded-lg shadow-lg border"
          >
            {/* Header with Template Button */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex border-b bg-white">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={cn(
                      "flex-1 py-2 px-4 text-sm font-medium hover:text-[#F08019] transition-colors",
                      selectedYear === year && "text-[#F08019] border-b-2 border-[#F08019]",
                      selectedYear !== year && "text-muted-foreground"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleTemplateClick}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Template
              </Button>
            </div>

            {/* Months list */}
            <div className="max-h-[600px] overflow-y-auto p-4 space-y-2">
              {months.map((monthData) => {
                const isCurrentMonth = currentPeriod?.year === selectedYear && currentPeriod?.month === monthData.month;
                const period = monthData.period;
                const isOpen = period?.status === "OPEN";
                const lastOpenPeriod = periods?.sort((a, b) => {
                  if (a.year !== b.year) return b.year - a.year;
                  return b.month - a.month;
                }).find(p => p.status === "OPEN");
                
                return (
                  <div
                    key={monthData.month}
                    className={getMonthCardClassName(selectedYear, monthData.month, isOpen)}
                    onClick={() => handleMonthSelect(selectedYear, monthData.month)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CircularProgress 
                          value={monthData.completion} 
                          size="sm"
                          className={cn(
                            monthData.completion === 100 
                              ? "text-emerald-500" 
                              : "text-[#F08019]"
                          )}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-lg font-medium",
                              isCurrentMonth && "text-[#F08019]"
                            )}>
                              {monthData.name}
                            </span>
                            {monthData.isQuarterEnd && (
                              <Badge variant="secondary" className="text-xs bg-muted">
                                Quarter-End
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {monthData.completion}% completed
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPeriodActionButton(period, isOpen, selectedYear, monthData.month, lastOpenPeriod)}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            isOpen
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Open {selectedMonth?.month && months[selectedMonth.month - 1].name} {selectedMonth?.year}?</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="text-sm text-muted-foreground">
              Please confirm the following before opening a new period:
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="templateReviewed" 
                checked={confirmChecks.templateReviewed}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, templateReviewed: checked as boolean }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="templateReviewed"
                  className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have reviewed my <Button 
                    variant="link" 
                    className="h-auto p-0 text-[#F08019] hover:text-[#F08019]/90 font-medium"
                    onClick={() => {
                      window.location.href = "http://localhost:3001/templates";
                      setConfirmDialogOpen(false);
                    }}
                  >
                    Template
                  </Button> for any key task updates I want to apply in this new period
                </label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Review your template to ensure all tasks are up to date before creating a new period
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="changesUnderstand" 
                checked={confirmChecks.changesUnderstand}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, changesUnderstand: checked as boolean }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="changesUnderstand"
                  className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand that changes I make in a period only roll forward when they are made in the latest open period
                </label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Any modifications to tasks will only affect future periods if made in your most recently opened period
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setSelectedMonth(null);
                setConfirmChecks({ templateReviewed: false, changesUnderstand: false });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOpen}
              disabled={!confirmChecks.templateReviewed || !confirmChecks.changesUnderstand}
              className="bg-[#F08019] hover:bg-[#F08019]/90"
            >
              Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {selectedMonth?.month && months[selectedMonth.month - 1].name} {selectedMonth?.year} Open
            </DialogTitle>
            <p className="text-sm text-center text-muted-foreground">
              Your next period is ready! Click below to continue.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setSuccessDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOpen}
              className="flex-1 bg-[#F08019] hover:bg-[#F08019]/90 text-white"
            >
              Go to {selectedMonth?.month && months[selectedMonth.month - 1].name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 