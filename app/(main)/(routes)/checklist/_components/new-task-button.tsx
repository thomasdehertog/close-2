"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TaskForm } from "./task-form";

export function NewTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="gap-x-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add task
      </Button>
      <TaskForm 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
} 