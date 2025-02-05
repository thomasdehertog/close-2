"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { TemplateList } from "./_components/template-list";
import { useRouter, useSearchParams } from "next/navigation";
import { NewTemplateTaskButton } from "./_components/new-template-task-button";

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previousMonth = searchParams.get('from') || 'July'; // Default to July if not specified

  return (
    <div className="h-full flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl font-semibold">Checklist</h2>
        </div>
        <div className="flex items-center gap-x-2">
          <NewTemplateTaskButton />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs"
            onClick={() => router.back()}
          >
            Return to {previousMonth}
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4">
        <p className="text-sm text-blue-600">
          Changes made directly in your latest open period can also be saved to this Template.
        </p>
      </div>

      <div className="px-4">
        <TemplateList />
      </div>
    </div>
  );
} 