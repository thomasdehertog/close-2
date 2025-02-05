"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Badge, DatePicker } from "@/components/ui";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserMenu } from "./user-menu";

interface TaskRowProps {
  task: Doc<"tasks">;
  icon?: React.ReactNode;
  onSelect?: (task: Doc<"tasks">) => void;
}

export function TaskRow({ task, icon, onSelect }: TaskRowProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30";
      case "PENDING":
        return "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30";
    }
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

      <div className="flex justify-center">
        <Badge 
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status}
        </Badge>
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