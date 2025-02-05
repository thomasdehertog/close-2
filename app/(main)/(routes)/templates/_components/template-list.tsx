"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  FolderIcon, 
  ChevronRight, 
  ListTodo,
  CheckCircle,
  RefreshCcw,
  Calendar,
  LayoutGrid
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { TemplateUserMenu } from "./template-user-menu";

export const TemplateList = () => {
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const templates = useQuery(api.tasks.getTemplates, { 
    workspaceId: workspace?._id || ""
  });
  const categories = useQuery(api.checklistCategories.get, {
    workspaceId: workspace?._id || "",
  });
  const updateTask = useMutation(api.tasks.updateTask);
  const members = useQuery(api.workspaceMembers.getActiveMembers);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);

  useEffect(() => {
    if (templates) {
      const categoryIds = templates.reduce((acc, template) => {
        const categoryId = template.categoryId || "uncategorized";
        acc[categoryId] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setExpandedCategories(categoryIds);
    }
  }, [templates]);

  if (templates === undefined || categories === undefined) {
    return <div>Loading...</div>;
  }

  const templatesByCategory = templates.reduce((acc, template) => {
    const categoryId = template.categoryId || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

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

  const handleDateChange = async (taskId: string, date: Date | undefined, type: "preparer" | "reviewer") => {
    try {
      await updateTask({
        id: taskId,
        [`duedate_${type}`]: date?.toISOString()
      });
    } catch (error) {
      console.error(`Failed to update ${type} due date:`, error);
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "ONE_TIME":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "MONTHLY":
        return <RefreshCcw className="h-3 w-3 mr-1" />;
      case "QUARTERLY":
        return <LayoutGrid className="h-3 w-3 mr-1" />;
      case "ANNUALLY":
        return <Calendar className="h-3 w-3 mr-1" />;
      default:
        return <CheckCircle className="h-3 w-3 mr-1" />;
    }
  };

  // Sort categories to always show uncategorized first, then alphabetically by name
  const sortedCategories = Object.entries(templatesByCategory).sort(([catIdA], [catIdB]) => {
    if (catIdA === "uncategorized") return -1;
    if (catIdB === "uncategorized") return 1;
    const nameA = getCategoryDetails(catIdA).name.toLowerCase();
    const nameB = getCategoryDetails(catIdB).name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="flex flex-col border rounded-md">
      <div className="grid grid-cols-[2fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr] gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b">
        <div>Name</div>
        <div className="text-center">Category</div>
        <div className="text-center">Preparer</div>
        <div className="text-center">Due</div>
        <div className="text-center">Frequency</div>
        <div className="text-center">Reviewer</div>
        <div className="text-center">Due</div>
      </div>

      {sortedCategories.map(([categoryId, categoryTemplates], index) => {
        const { name, color } = getCategoryDetails(categoryId);
        return (
          <div key={categoryId} className="flex flex-col">
            <button
              onClick={() => toggleCategory(categoryId)}
              className={cn(
                "w-full bg-[#F08019]/10 hover:bg-[#F08019]/15 transition-colors border-l-2 border-[#F08019]/30",
                index !== 0 && "border-t"
              )}
            >
              <div className="grid grid-cols-[2fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr] gap-2 px-4 py-3">
                <div className="col-span-7 flex items-center gap-x-2">
                  {expandedCategories[categoryId] ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <FolderIcon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm font-semibold text-muted-foreground">
                    {name} ({categoryTemplates.length})
                  </span>
                </div>
              </div>
            </button>

            {expandedCategories[categoryId] && (
              <div className="flex flex-col divide-y divide-border">
                {categoryTemplates.map((template) => (
                  <div 
                    key={template._id}
                    role="button"
                    onClick={() => setSelectedTask(template)}
                    className="group grid grid-cols-[2fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr] gap-2 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-x-2">
                      <ListTodo className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{template.title}</span>
                    </div>

                    <div className="flex justify-center items-center">
                      {template.categoryId && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: getCategoryDetails(template.categoryId).color }}
                          />
                          <span className="text-sm truncate">
                            {getCategoryDetails(template.categoryId).name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                      <TemplateUserMenu
                        templateId={template._id}
                        currentUserId={template.preparerId}
                        type="preparerId"
                        getInitials={(name) => {
                          if (!name || name === "Loading..." || name === "Unknown" || name === "Unassigned") return "?";
                          const cleanName = name.replace(/\s*\([^)]*\)/g, "").trim();
                          const parts = cleanName.split(/\s+/).filter(Boolean);
                          if (parts.length === 0) return "??";
                          if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        }}
                        getMemberName={(id) => {
                          if (!id || !members) return "Unassigned";
                          const member = members.find(m => m.userId === id);
                          if (!member) return "Unknown";
                          return member.status === "PENDING" ? `${member.name} (Pending)` : member.name;
                        }}
                      />
                    </div>

                    <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                      <DatePicker
                        value={template.duedate_preparer ? new Date(template.duedate_preparer) : undefined}
                        onChange={(date) => handleDateChange(template._id, date, "preparer")}
                        placeholder="Set date"
                        compact
                      />
                    </div>

                    <div className="flex justify-center">
                      <Badge 
                        className="rounded-full px-2 py-0.5 text-xs font-medium flex items-center bg-secondary text-secondary-foreground"
                      >
                        {getFrequencyIcon(template.frequency)}
                        {template.frequency === "ONE_TIME" ? "One Time" :
                         template.frequency === "MONTHLY" ? "Monthly" :
                         template.frequency === "QUARTERLY" ? "Quarterly" :
                         template.frequency === "ANNUALLY" ? "Annually" :
                         template.frequency}
                      </Badge>
                    </div>

                    <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                      <TemplateUserMenu
                        templateId={template._id}
                        currentUserId={template.reviewerId}
                        type="reviewerId"
                        getInitials={(name) => {
                          if (!name || name === "Loading..." || name === "Unknown" || name === "Unassigned") return "?";
                          const cleanName = name.replace(/\s*\([^)]*\)/g, "").trim();
                          const parts = cleanName.split(/\s+/).filter(Boolean);
                          if (parts.length === 0) return "??";
                          if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        }}
                        getMemberName={(id) => {
                          if (!id || !members) return "Unassigned";
                          const member = members.find(m => m.userId === id);
                          if (!member) return "Unknown";
                          return member.status === "PENDING" ? `${member.name} (Pending)` : member.name;
                        }}
                      />
                    </div>

                    <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                      <DatePicker
                        value={template.duedate_reviewer ? new Date(template.duedate_reviewer) : undefined}
                        onChange={(date) => handleDateChange(template._id, date, "reviewer")}
                        placeholder="Set date"
                        compact
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 