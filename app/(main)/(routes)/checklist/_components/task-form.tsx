"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ListTodo, 
  Building2, 
  LayoutList, 
  RefreshCcw, 
  User,
  MoreHorizontal,
  Trash,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { useUser } from "@clerk/nextjs";
import { DatePicker } from "@/components/ui/date-picker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TaskFrequency = "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Doc<"tasks"> | null;
  onSubmit?: () => void;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (member: { id: string; name: string }) => void;
}

// Helper Components
function SummaryButton({ 
  icon: Icon, 
  label, 
  value,
  options,
  onSelect,
  showManage = false
}: { 
  icon: any;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  showManage?: boolean;
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
          {showManage && (
            <>
              <SelectSeparator />
              <SelectItem value="manage" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Manage {label.toLowerCase()}</span>
                </div>
              </SelectItem>
            </>
          )}
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
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  onInvite: () => void;
}) {
  const selectedOption = options.find(opt => opt.value === value);
  const isPending = selectedOption?.label.includes("(Pending)");
  
  const getInitials = (name: string) => {
    if (!name || name === "Loading..." || name === "Unknown" || name === "Unassigned") return "?";
    const cleanName = name.replace(/\s*\([^)]*\)/g, "").trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "??";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      { bg: "bg-[#FFD4D4]", text: "text-gray-700" },  // Light pink
      { bg: "bg-[#FFE4C8]", text: "text-gray-700" },  // Light peach
      { bg: "bg-[#F3E8FF]", text: "text-gray-700" },  // Light purple
      { bg: "bg-[#FFE4E4]", text: "text-gray-700" },  // Light salmon
      { bg: "bg-[#E8F3FF]", text: "text-gray-700" },  // Light blue
      { bg: "bg-[#E2FFE7]", text: "text-gray-700" },  // Light mint
      { bg: "bg-[#FFF4E5]", text: "text-gray-700" },  // Light orange
      { bg: "bg-[#F0E8FF]", text: "text-gray-700" },  // Light violet
      { bg: "bg-[#FFE8F3]", text: "text-gray-700" },  // Light rose
      { bg: "bg-[#E8FFF4]", text: "text-gray-700" },  // Light cyan
    ];
    
    if (!name || name === "Unassigned") {
      return { bg: "bg-gray-100", text: "text-gray-500" };
    }
    
    const index = name.length % colors.length;
    return colors[index];
  };
  
  return (
    <div className="flex justify-between items-center py-3 px-4">
      <div className="text-sm font-semibold text-muted-foreground">
        {label}
      </div>
      <Select value={value || "unassigned"} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            {value && selectedOption ? (
              <Avatar className="h-9 w-9">
                <AvatarFallback 
                  className={cn(
                    "text-[10px] font-medium flex items-center justify-center",
                    getAvatarColor(selectedOption.label).bg,
                    getAvatarColor(selectedOption.label).text
                  )}
                  title={selectedOption.label}
                >
                  {getInitials(selectedOption.label)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors group/text h-9">
                <span className="opacity-0 group-hover/text:opacity-100 transition-opacity">
                  <User className="h-4 w-4 text-gray-500" />
                </span>
                <span className="text-sm text-gray-500 opacity-0 group-hover/text:opacity-100 transition-opacity">
                  + {label}
                </span>
              </div>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            value="unassigned"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              Unassign user
            </div>
          </SelectItem>
          <SelectSeparator />
          {options.filter(opt => opt.value !== "invite").map((option) => {
            const isPendingOption = option.label.includes("(Pending)");
            const cleanLabel = option.label.replace(/\s*\([^)]*\)/g, "").trim();
            const avatarColors = getAvatarColor(option.label);
            
            return (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback 
                        className={cn(
                          "text-[10px] font-medium flex items-center justify-center",
                          avatarColors.bg,
                          avatarColors.text
                        )}
                      >
                        {getInitials(cleanLabel)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>{cleanLabel}</span>
                    {isPendingOption && (
                      <span className="text-xs text-muted-foreground">Pending invitation</span>
                    )}
                  </div>
                </div>
              </SelectItem>
            );
          })}
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
          <SelectItem value="uncategorized">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm font-semibold">Uncategorized</span>
            </div>
          </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.categories_checklistId} value={category.categories_checklistId}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-semibold">{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Main TaskForm Component
export const TaskForm = ({
  isOpen,
  task,
  onClose,
  onSubmit,
}: TaskFormProps) => {
  const { user } = useUser();
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const members = useQuery(api.workspaceMembers.getActiveMembers);
  const categories = useQuery(api.checklistCategories.get, { 
    workspaceId: workspace?._id || "",
  });
  
  useEffect(() => {
    console.log("Debug - Categories updated:", {
      workspaceId: workspace?._id,
      categoriesLoaded: categories !== undefined,
      categoriesLength: categories?.length,
      categoriesData: categories,
      isQueryPending: categories === undefined
    });
  }, [categories, workspace?._id]);
  
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  // Initialize state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(
    task?.categoryId || null
  );
  const [frequency, setFrequency] = useState<TaskFrequency>("MONTHLY");
  const [isTemplate, setIsTemplate] = useState(false);
  const [isSubtask, setIsSubtask] = useState(false);
  const [preparerId, setPreparerId] = useState<string>("");
  const [reviewerId, setReviewerId] = useState<string>("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteContext, setInviteContext] = useState<"preparer" | "reviewer">("preparer");
  const [isLoading, setIsLoading] = useState(false);
  const [dueDatePreparer, setDueDatePreparer] = useState<Date | undefined>(undefined);
  const [dueDateReviewer, setDueDateReviewer] = useState<Date | undefined>(undefined);

  // Initialize with empty arrays for options
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
    label: member.status === "PENDING" ? `${member.name} (Pending)` : member.name,
    value: member.userId
  })) ?? [];

  const handleAssigneeSelect = (value: string, type: "preparer" | "reviewer") => {
    if (value === "invite") {
      setInviteContext(type);
      setIsInviteModalOpen(true);
      return;
    }

    if (type === "preparer") {
      setPreparerId(value === "unassigned" ? "" : value);
    } else {
      setReviewerId(value === "unassigned" ? "" : value);
    }
  };

  // Update state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategoryId(task.categoryId || null);
      setFrequency(task.frequency || "ONE_TIME");
      setIsTemplate(task.isTemplate || false);
      setIsSubtask(task.isSubtask || false);
      setPreparerId(task.preparerId || "");
      setReviewerId(task.reviewerId || "");
      setDueDatePreparer(task.duedate_preparer ? new Date(task.duedate_preparer) : undefined);
      setDueDateReviewer(task.duedate_reviewer ? new Date(task.duedate_reviewer) : undefined);
    } else {
      // Reset form when creating new task
      setTitle("");
      setDescription("");
      setCategoryId(null);
      setFrequency("ONE_TIME");
      setIsTemplate(false);
      setIsSubtask(false);
      setPreparerId("");
      setReviewerId("");
      setDueDatePreparer(undefined);
      setDueDateReviewer(undefined);
    }
  }, [task]);

  // Effect to log category state changes
  useEffect(() => {
    if (workspace?._id) {
      console.log("Debug - Category State:", {
        workspaceId: workspace._id,
        categoriesLoaded: categories !== undefined,
        categoriesCount: categories?.length,
        selectedCategoryId: categoryId,
        availableCategories: categories
      });
    }
  }, [categories, categoryId, workspace?._id]);

  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const archiveTask = useMutation(api.tasks.archiveTask);

  const onArchive = async () => {
    if (!task) return;

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
    if (!title || !workspace?._id) return;

    try {
      setIsLoading(true);
      if (task) {
        await updateTask({
          id: task._id,
          title,
          description,
          categoryId: categoryId || undefined,
          frequency,
          isTemplate,
          preparerId: preparerId || undefined,
          reviewerId: reviewerId || undefined,
          duedate_preparer: dueDatePreparer?.toISOString(),
          duedate_reviewer: dueDateReviewer?.toISOString(),
        });
      } else {
        const taskData = {
          title,
          description,
          frequency,
          isTemplate,
          isSubtask: false,
          preparerId: preparerId || undefined,
          reviewerId: reviewerId || undefined,
          workspaceId: workspace._id,
          duedate_preparer: dueDatePreparer?.toISOString(),
          duedate_reviewer: dueDateReviewer?.toISOString(),
        };

        // Only include categoryId if it's not null
        if (categoryId) {
          await createTask({
            ...taskData,
            categoryId,
          });
        } else {
          await createTask(taskData);
        }
      }
      onSubmit?.();
      onClose();
      toast.success(task ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error("Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
                <h2 className="text-lg font-semibold">
                  {task ? "Edit Task" : "New Task"}
                </h2>
                <div className="flex items-center gap-x-2">
                  {task && (
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
                  )}
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
                      placeholder="Begin typing task name..."
                      className="border-none text-lg font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0"
                    />
                    
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Click to add description..."
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold px-4 mb-2">Assignees</h3>
                    
                    <div className="divide-y">
                      <div className="space-y-2">
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
                      </div>

                      <div className="space-y-2">
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

                  <InviteMemberModal 
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                      setIsInviteModalOpen(false);
                    }}
                  />
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
                      {task ? "Update Task" : "Create Task"}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          setIsInviteModalOpen(false);
        }}
      />
    </>
  );
} 

