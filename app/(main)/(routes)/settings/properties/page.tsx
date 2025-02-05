"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Pencil, MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorOptions = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#F5FF33",
  "#33FFF5", "#FF3333", "#33FF33", "#3333FF", "#FFFF33"
];

type CategoryType = "checklist" | "reconciliation" | "account_type";

export default function PropertiesPage() {
  // Initialize all state first
  const [search, setSearch] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
    color: colorOptions[0],
    category_type: "checklist" as CategoryType
  });

  // Hooks for data fetching and mutations
  const { toast } = useToast();
  const { user } = useUser();
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const workspaceId = workspace?._id || "";
  
  const checklistCategories = useQuery(api.checklistCategories.get, { workspaceId });
  const createChecklistCategory = useMutation(api.checklistCategories.create);
  const updateChecklistCategory = useMutation(api.checklistCategories.update);
  const archiveChecklistCategory = useMutation(api.checklistCategories.archive);

  const reconciliationCategories = useQuery(api.reconciliationCategories.get, { workspaceId });
  const createReconciliationCategory = useMutation(api.reconciliationCategories.create);
  const updateReconciliationCategory = useMutation(api.reconciliationCategories.update);
  const archiveReconciliationCategory = useMutation(api.reconciliationCategories.archive);

  const accountTypeCategories = useQuery(api.accountTypeCategories.get, { workspaceId });
  const createAccountTypeCategory = useMutation(api.accountTypeCategories.create);
  const updateAccountTypeCategory = useMutation(api.accountTypeCategories.update);
  const archiveAccountTypeCategory = useMutation(api.accountTypeCategories.archive);

  // Event handlers
  const handleCreateCategory = async () => {
    try {
      switch (newCategoryData.category_type) {
        case "checklist":
          await createChecklistCategory({
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            workspaceId,
            color: newCategoryData.color,
          });
          break;
        case "reconciliation":
          await createReconciliationCategory({
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            workspaceId,
            color: newCategoryData.color,
          });
          break;
        case "account_type":
          await createAccountTypeCategory({
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            workspaceId,
            color: newCategoryData.color,
          });
          break;
      }
      
      setIsAddingCategory(false);
      setNewCategoryData({
        name: "",
        description: "",
        color: colorOptions[0],
        category_type: "checklist"
      });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return;
    try {
      switch (newCategoryData.category_type) {
        case "checklist":
          await updateChecklistCategory({
            id: editingCategoryId,
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            color: newCategoryData.color,
          });
          break;
        case "reconciliation":
          await updateReconciliationCategory({
            id: editingCategoryId,
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            color: newCategoryData.color,
          });
          break;
        case "account_type":
          await updateAccountTypeCategory({
            id: editingCategoryId,
            name: newCategoryData.name,
            description: newCategoryData.description || undefined,
            color: newCategoryData.color,
          });
          break;
      }
      
      setIsEditingCategory(false);
      setEditingCategoryId(null);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleArchiveCategory = async (id: string, type: CategoryType) => {
    try {
      switch (type) {
        case "checklist":
          await archiveChecklistCategory({ id });
          break;
        case "reconciliation":
          await archiveReconciliationCategory({ id });
          break;
        case "account_type":
          await archiveAccountTypeCategory({ id });
          break;
      }
      
      toast({
        title: "Success",
        description: "Category archived successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive category",
        variant: "destructive",
      });
    }
  };

  const filteredChecklistCategories = checklistCategories?.filter(category => 
    category.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // If workspace is not loaded yet, show nothing
  if (!workspaceId) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Properties</h1>
      </div>

      <div className="flex items-center gap-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setNewCategoryData({
            name: "",
            description: "",
            color: colorOptions[0],
            category_type: "checklist"
          });
          setIsAddingCategory(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add property
        </Button>
      </div>

      {/* Checklist Categories Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Checklist Categories</h2>
        <div className="space-y-4">
          {filteredChecklistCategories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setNewCategoryData({
                      name: category.name,
                      description: category.description || "",
                      color: category.color,
                      category_type: "checklist"
                    });
                    setEditingCategoryId(category._id);
                    setIsEditingCategory(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleArchiveCategory(category._id, "checklist")}
                      className="text-red-600"
                    >
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                placeholder="Enter category description"
              />
            </div>
            <div>
              <Label>Category Type</Label>
              <div className="flex gap-2 mt-1.5">
                <Button
                  type="button"
                  variant={newCategoryData.category_type === "checklist" ? "default" : "outline"}
                  onClick={() => setNewCategoryData({ ...newCategoryData, category_type: "checklist" })}
                >
                  Checklist
                </Button>
                <Button
                  type="button"
                  variant={newCategoryData.category_type === "reconciliation" ? "default" : "outline"}
                  onClick={() => setNewCategoryData({ ...newCategoryData, category_type: "reconciliation" })}
                >
                  Reconciliation
                </Button>
                <Button
                  type="button"
                  variant={newCategoryData.category_type === "account_type" ? "default" : "outline"}
                  onClick={() => setNewCategoryData({ ...newCategoryData, category_type: "account_type" })}
                >
                  Account Type
                </Button>
              </div>
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewCategoryData({ ...newCategoryData, color })}
                    className={`w-6 h-6 rounded cursor-pointer transition-all ${
                      newCategoryData.color === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                placeholder="Enter category description"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewCategoryData({ ...newCategoryData, color })}
                    className={`w-6 h-6 rounded cursor-pointer transition-all ${
                      newCategoryData.color === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 