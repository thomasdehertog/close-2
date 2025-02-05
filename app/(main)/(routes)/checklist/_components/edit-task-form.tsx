"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  X, 
  ListTodo, 
  LayoutList, 
  RefreshCcw, 
  User,
  MoreHorizontal,
  Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { DatePicker } from "@/components/ui/date-picker";

type TaskFrequency = "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";

interface EditTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task: Doc<"tasks">;
  onSubmit?: () => void;
}

// Helper Components
function SummaryButton({ 
  icon: Icon, 
  label, 
  value,
  options,
  onSelect,
}: { 
  icon: any;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex justify-between items-center py-3 px-4">
      <div className="text-sm font-semibold text-muted-foreground">
        {label}
      </div>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-semibold">{value}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AssigneeButton({ 
  icon: Icon, 
  label, 
  value,
  options,
  onSelect,
  onInvite
}: { 
  icon: any;
  label: string;
  value: string | null;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  onInvite: () => void;
}) {
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className="flex justify-between items-center py-3 px-4">
      <div className="text-sm font-semibold text-muted-foreground">
        {label}
      </div>
      <Select value={value || "unassigned"} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-semibold">
              {selectedOption ? selectedOption.label : "Unassigned"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              Unassigned
            </div>
          </SelectItem>
          <SelectSeparator />
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {option.label}
              </div>
            </SelectItem>
          ))}
          <SelectSeparator />
          <div 
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              e.preventDefault();
              onInvite();
            }}
          >
            Invite team member →
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

function CategoryButton({ 
  icon: Icon, 
  label, 
  value,
  categories,
  onSelect,
}: { 
  icon: any;
  label: string;
  value: string | null;
  categories: Doc<"categories_checklist">[];
  onSelect: (value: string | null) => void;
}) {
  const selectedCategory = value ? categories?.find(cat => cat.categories_checklistId === value) : null;
  
  return (
    <div className="flex justify-between items-center py-3 px-4">
      <div className="text-sm font-semibold text-muted-foreground">
        {label}
      </div>
      <Select 
        value={value ? value : "uncategorized"} 
        onValueChange={(val) => onSelect(val === "uncategorized" ? null : val)}
      >
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            {selectedCategory ? (
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: selectedCategory.color }}
              />
            ) : (
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-sm font-semibold">
              {selectedCategory?.name || "Uncategorized"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            value="uncategorized"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              Uncategorized
            </div>
          </SelectItem>
          <SelectSeparator />
          {categories?.map((category) => (
            <SelectItem 
              key={category._id} 
              value={category.categories_checklistId}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const EditTaskForm = ({
  isOpen,
  task,
  onClose,
  onSubmit,
}: EditTaskFormProps) => {
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const members = useQuery(api.workspaceMembers.getActiveMembers);
  const categories = useQuery(api.checklistCategories.get, { 
    workspaceId: workspace?._id || ""
  });

  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  // Initialize state with task data
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [categoryId, setCategoryId] = useState<string | null>(task.categoryId || null);
  const [frequency, setFrequency] = useState<TaskFrequency>(task.frequency || "ONE_TIME");
  const [isTemplate, setIsTemplate] = useState(task.isTemplate || false);
  const [preparerId, setPreparerId] = useState(task.preparerId || null);
  const [reviewerId, setReviewerId] = useState(task.reviewerId || null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteContext, setInviteContext] = useState<"preparer" | "reviewer">("preparer");
  const [isLoading, setIsLoading] = useState(false);
  const [dueDatePreparer, setDueDatePreparer] = useState<Date | undefined>(
    task.duedate_preparer ? new Date(task.duedate_preparer) : undefined
  );
  const [dueDateReviewer, setDueDateReviewer] = useState<Date | undefined>(
    task.duedate_reviewer ? new Date(task.duedate_reviewer) : undefined
  );

  const typeOptions = [
    { label: "Task", value: "task" },
    { label: "Template", value: "template" },
  ];

  const frequencyOptions = [
    { label: "One Time", value: "ONE_TIME" },
    { label: "Monthly", value: "MONTHLY" },
    { label: "Quarterly", value: "QUARTERLY" },
    { label: "Annually", value: "ANNUALLY" },
  ];

  const assigneeOptions = members?.map(member => ({
    label: member.name,
    value: member.userId
  })) ?? [];

  const handleAssigneeSelect = (value: string, type: "preparer" | "reviewer") => {
    if (value === "invite") {
      setInviteContext(type);
      setIsInviteModalOpen(true);
      return;
    }

    const newValue = value === "unassigned" ? null : value;
    
    if (type === "preparer") {
      setPreparerId(newValue);
    } else {
      setReviewerId(newValue);
    }
  };

  const updateTask = useMutation(api.tasks.updateTask);
  const archiveTask = useMutation(api.tasks.archiveTask);

  const onArchive = async () => {
    try {
      setIsLoading(true);
      await archiveTask({ id: task._id });
      toast.success("Task archived");
      onClose();
    } catch (error) {
      console.error("Failed to archive task:", error);
      toast.error("Failed to archive task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) return;

    try {
      setIsLoading(true);
      await updateTask({
        id: task._id,
        title,
        description,
        categoryId,
        frequency,
        isTemplate,
        preparerId: preparerId || undefined,
        reviewerId: reviewerId || undefined,
        duedate_preparer: dueDatePreparer?.toISOString(),
        duedate_reviewer: dueDateReviewer?.toISOString(),
      });
      onSubmit?.();
      onClose();
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ 
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.8,
        }}
        className="fixed inset-y-0 right-0 w-[400px] bg-background border-l shadow-xl flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <div className="flex items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={onArchive}
                  className="text-destructive"
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              disabled={isLoading}
              className="h-8 w-8 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-60px)]">
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="p-4 space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task name"
                className="border-none text-lg font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0"
              />
              
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description..."
                rows={3}
                className="resize-none border-none focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold px-4 mb-2">Summary</h3>
              
              <div className="divide-y">
                <SummaryButton 
                  icon={ListTodo}
                  label="Type"
                  value={isTemplate ? "Template" : "Task"}
                  options={typeOptions}
                  onSelect={(value) => setIsTemplate(value === "template")}
                />

                <CategoryButton 
                  icon={LayoutList}
                  label="Category"
                  value={categoryId}
                  categories={categories || []}
                  onSelect={setCategoryId}
                />

                <SummaryButton 
                  icon={RefreshCcw}
                  label="Frequency"
                  value={frequency}
                  options={frequencyOptions}
                  onSelect={(value) => setFrequency(value as TaskFrequency)}
                />

                <div className="flex justify-between items-center py-3 px-4">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Due Date
                  </div>
                  <DatePicker
                    value={dueDatePreparer}
                    onChange={setDueDatePreparer}
                    className="w-[200px]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold px-4 mb-2">Assignees</h3>
              
              <div className="divide-y">
                <AssigneeButton 
                  icon={User}
                  label="Preparer"
                  value={preparerId}
                  options={assigneeOptions}
                  onSelect={(value) => handleAssigneeSelect(value, "preparer")}
                  onInvite={() => {
                    setInviteContext("preparer");
                    setIsInviteModalOpen(true);
                  }}
                />

                <AssigneeButton 
                  icon={User}
                  label="Reviewer"
                  value={reviewerId}
                  options={assigneeOptions}
                  onSelect={(value) => handleAssigneeSelect(value, "reviewer")}
                  onInvite={() => {
                    setInviteContext("reviewer");
                    setIsInviteModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t p-4 mt-auto">
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex-1"
              >
                Update Task
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          setIsInviteModalOpen(false);
        }}
      />
    </div>
  );
} 