"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export function Header() {
  const { user } = useUser();

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
            {getInitials(user?.fullName || user?.firstName || "")}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
} 