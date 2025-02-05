"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Badge, DatePicker } from "@/components/ui";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface TaskRowProps {
  task: Doc<"tasks">;
  icon?: React.ReactNode;
  onSelect?: (task: Doc<"tasks">) => void;
}

export function TaskRow({ task, icon, onSelect }: TaskRowProps) {
  const { user } = useUser();
  const members = useQuery(api.workspaceMembers.getActiveMembers);
  const updateTask = useMutation(api.tasks.updateTask);

  const getMemberName = (userId: string | undefined) => {
    if (!userId || !members) return "Unassigned";
    const member = members.find(m => m.userId === userId);
    if (!member) return "Unknown";
    return member.status === "PENDING" ? `${member.name} (Pending)` : member.name;
  };

  const getInitials = (name: string) => {
    if (!name || name === "Loading..." || name === "Unknown" || name === "Unassigned") return "?";
    
    // Remove any parentheses and their contents, then trim
    const cleanName = name.replace(/\s*\([^)]*\)/g, "").trim();
    
    // Split by whitespace and filter out empty strings
    const parts = cleanName.split(/\s+/).filter(Boolean);
    
    if (parts.length === 0) return "??";
    
    if (parts.length === 1) {
      // For single word, take first two letters
      return parts[0].slice(0, 2).toUpperCase();
    }
    
    // Take first letter of first and last word
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleDateChange = async (date: Date | undefined, type: "preparer" | "reviewer", e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await updateTask({
        id: task._id,
        [`duedate_${type}`]: date?.toISOString()
      });
    } catch (error) {
      console.error(`Failed to update ${type} due date:`, error);
    }
  };

  const handleSubmitTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateTask({
        id: task._id,
        status: "SUBMITTED"
      });
      toast.success("Task submitted successfully");
    } catch (error) {
      console.error("Failed to submit task:", error);
      toast.error("Failed to submit task");
    }
  };

  const getStatusDisplay = () => {
    // Case 1: No preparer assigned
    if (!task.preparerId) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-4 text-xs bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-600 border-zinc-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            Unassigned
          </div>
        </Button>
      );
    }

    // Case 2: Current user is the preparer and task is pending
    if (task.preparerId === user?.id && task.status === "PENDING") {
      return (
        <Button
          onClick={handleSubmitTask}
          size="sm"
          variant="outline"
          className="h-8 px-4 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Submit
          </div>
        </Button>
      );
    }

    // Case 3: Task is submitted or completed
    if (task.status === "SUBMITTED" || task.status === "COMPLETED") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-4 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {task.status === "SUBMITTED" ? "Submitted" : "Completed"}
          </div>
        </Button>
      );
    }

    // Case 4: Task is assigned to someone else
    return (
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-4 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border-indigo-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Assigned
        </div>
      </Button>
    );
  };

  return (
    <div 
      role="button" 
      onClick={() => onSelect?.(task)}
      className="group grid grid-cols-[2fr,1fr,0.8fr,0.8fr,1fr,0.8fr] gap-2 px-4 py-3 hover:bg-muted/50 cursor-pointer"
    >
      <div className="flex items-center gap-x-2">
        {icon}
        <span className="truncate">{task.title}</span>
      </div>
      
      <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <UserMenu
          taskId={task._id}
          currentUserId={task.preparerId}
          type="preparerId"
          getInitials={getInitials}
          getMemberName={getMemberName}
        />
      </div>

      <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <DatePicker
          value={task.duedate_preparer ? new Date(task.duedate_preparer) : undefined}
          onChange={(date: Date | undefined) => handleDateChange(date, "preparer")}
          placeholder="Set date"
          compact
        />
      </div>

      <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        {getStatusDisplay()}
      </div>

      <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <UserMenu
          taskId={task._id}
          currentUserId={task.reviewerId}
          type="reviewerId"
          getInitials={getInitials}
          getMemberName={getMemberName}
        />
      </div>

      <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <DatePicker
          value={task.duedate_reviewer ? new Date(task.duedate_reviewer) : undefined}
          onChange={(date: Date | undefined) => handleDateChange(date, "reviewer")}
          placeholder="Set date"
          compact
        />
      </div>
    </div>
  );
} 