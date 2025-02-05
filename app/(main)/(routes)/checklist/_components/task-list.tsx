"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { TaskRow } from "./task-row";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  FolderIcon, 
  ChevronRight, 
  ListTodo 
} from "lucide-react";
import { useState, useEffect } from "react";
import { EditTaskForm } from "./edit-task-form";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@/components/ui/circular-progress";

export function TaskList() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const periodParam = searchParams.get('period');
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const period = useQuery(api.periods.getPeriod, 
    workspace && periodParam ? {
      workspaceId: workspace._id,
      year: parseInt(periodParam.split('-')[0]),
      month: parseInt(periodParam.split('-')[1])
    } : "skip"
  );
  
  const tasks = useQuery(api.tasks.getTasks, 
    workspace ? { 
      workspaceId: workspace._id,
      ...(period?._id ? { periodId: period._id } : {}),
      parentTaskId: undefined 
    } : "skip"
  );
  
  const categories = useQuery(api.checklistCategories.get, {
    workspaceId: workspace?._id || "",
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);

  useEffect(() => {
    if (tasks) {
      const categoryIds = tasks.reduce((acc, task) => {
        const categoryId = task.categoryId || "uncategorized";
        acc[categoryId] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setExpandedCategories(categoryIds);
    }
  }, [tasks]);

  const calculateCompletionPercentage = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => 
      task.status === "COMPLETED" || task.status === "SUBMITTED"
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Handle loading and error states after all hooks are called
  if (!workspace) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Loading workspace data...</div>
    </div>;
  }

  if (periodParam && !period) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Period not found</div>
    </div>;
  }

  if (tasks === undefined || categories === undefined) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Loading tasks...</div>
    </div>;
  }

  const tasksByCategory = tasks.reduce((acc, task) => {
    const categoryId = task.categoryId || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  // Calculate overall completion percentage
  const overallCompletion = calculateCompletionPercentage(tasks);

  const getCategoryDetails = (categoryId: string) => {
    if (categoryId === "uncategorized") {
      return {
        name: "Uncategorized",
        color: "#F08019"
      };
    }
    const category = categories.find(c => c.categories_checklistId === categoryId);
    return category ? {
      name: category.name,
      color: category.color
    } : {
      name: "Unknown Category",
      color: "#F08019"
    };
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Sort categories to always show uncategorized first, then alphabetically by name
  const sortedCategories = Object.entries(tasksByCategory).sort(([catIdA], [catIdB]) => {
    if (catIdA === "uncategorized") return -1;
    if (catIdB === "uncategorized") return 1;
    const nameA = getCategoryDetails(catIdA).name.toLowerCase();
    const nameB = getCategoryDetails(catIdB).name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <>
      <div className="flex flex-col border rounded-md">
        <div className="grid grid-cols-[2fr,1fr,0.8fr,0.8fr,1fr,0.8fr] gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b">
          <div>Name</div>
          <div className="text-center">Preparer</div>
          <div className="text-center">Due</div>
          <div className="text-center">Status</div>
          <div className="text-center">Reviewer</div>
          <div className="text-center">Due</div>
        </div>

        {sortedCategories.map(([categoryId, categoryTasks], index) => {
          const { name, color } = getCategoryDetails(categoryId);
          const categoryCompletion = calculateCompletionPercentage(categoryTasks);
          
          return (
            <div key={categoryId} className="flex flex-col">
              <button
                onClick={() => toggleCategory(categoryId)}
                className={cn(
                  "w-full bg-[#F08019]/10 hover:bg-[#F08019]/15 transition-colors border-l-2 border-[#F08019]/30",
                  index !== 0 && "border-t"
                )}
              >
                <div className="grid grid-cols-[2fr,1fr,0.8fr,0.8fr,1fr,0.8fr] gap-2 px-4 py-3">
                  <div className="col-span-6 flex items-center gap-x-2">
                    {expandedCategories[categoryId] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <FolderIcon className="h-4 w-4" style={{ color }} />
                    <span className="text-sm font-semibold text-muted-foreground">
                      {name} ({categoryTasks.length})
                    </span>
                    <div className="ml-2 flex items-center gap-1">
                      <CircularProgress 
                        value={categoryCompletion} 
                        size="sm"
                        className={cn(
                          categoryCompletion === 100 
                            ? "text-emerald-500" 
                            : "text-[#F08019]"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {categoryCompletion}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {expandedCategories[categoryId] && (
                <div className="flex flex-col divide-y divide-border">
                  {categoryTasks.map((task) => (
                    <TaskRow 
                      key={task._id} 
                      task={task}
                      icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
                      onSelect={setSelectedTask}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <EditTaskForm 
          isOpen={selectedTask !== null}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onSubmit={() => {
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
} 