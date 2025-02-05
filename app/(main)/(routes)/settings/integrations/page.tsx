"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

const tabs = [
  {
    label: "General Ledger",
    value: "general-ledger"
  },
  {
    label: "File Storage",
    value: "file-storage"
  },
  {
    label: "Notifications",
    value: "notifications"
  }
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("general-ledger");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-x-4">
          <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-semibold">Integrations</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex px-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.value
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <div className="relative w-[200px] h-[200px] mb-6">
            <Image
              src="/empty-dark.png"
              alt="No integration"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/empty.png"
              alt="No integration"
              fill
              className="object-contain hidden dark:block"
            />
          </div>
          <h2 className="text-xl font-medium mb-2">No integration connected</h2>
          <p className="text-muted-foreground text-sm mb-8">
            It looks like you don't yet have an integration connected here! Click below to continue.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upgrade to connect
          </Button>
        </div>
      </div>
    </div>
  );
} 