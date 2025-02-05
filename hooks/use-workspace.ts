"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useWorkspace = () => {
  const workspace = useQuery(api.workspaces.getUserWorkspace);

  return {
    workspace: workspace || null,
    isLoading: workspace === undefined,
  };
}; 