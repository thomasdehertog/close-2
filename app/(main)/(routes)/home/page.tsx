"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "../../_components/empty-state";
import { Header } from "../../_components/header";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { user } = useUser();
  const workspaceId = user?.id;
  const tasks = useQuery(api.tasks.getTasks, { 
    workspaceId: workspaceId || "",
    parentTaskId: undefined 
  });

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1">
        {(!tasks || tasks.length === 0) ? (
          <EmptyState />
        ) : (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Open Periods</h2>
            </div>
            {/* Your existing task list rendering code */}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const priority = 1 