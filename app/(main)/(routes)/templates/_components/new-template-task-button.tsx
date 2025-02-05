"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskForm } from "../../checklist/_components/task-form";

export function NewTemplateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        size="sm"
        className="h-8 px-3 text-xs bg-[#F08019] hover:bg-[#F08019]/90 text-white"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Task
      </Button>
      <TaskForm 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
} 