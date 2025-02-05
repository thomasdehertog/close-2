"use client";

import { MessageSquare, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface InboxPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InboxPanel = ({
  isOpen,
  onClose
}: InboxPanelProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[99997]" 
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={cn(
        "fixed inset-y-0 bg-white dark:bg-[#1F1F1F] w-[400px] border-r shadow-lg transition-transform duration-300 z-[99998]",
        "left-60",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Notifications</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
            <div className="flex flex-col items-center space-y-2 text-center">
              <h3 className="font-medium">No messages yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                You&apos;ll receive notifications here about:
              </p>
              <ul className="text-muted-foreground text-sm list-disc list-inside space-y-1 text-left">
                <li>Task assignments and updates</li>
                <li>Reconciliation approvals</li>
                <li>Monthly closing reminders</li>
                <li>Team mentions and comments</li>
                <li>Document sharing and updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 