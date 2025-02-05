"use client";

import { MessageSquare } from "lucide-react";
import Image from "next/image";

const InboxPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-60 h-60">
        <Image
          src="/empty.png"
          fill
          alt="Empty"
          className="object-contain dark:hidden"
        />
        <Image
          src="/empty-dark.png"
          fill
          alt="Empty"
          className="object-contain hidden dark:block"
        />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-medium">No messages yet</h2>
        <p className="text-muted-foreground text-sm text-center max-w-sm">
          You&apos;ll receive notifications here about:
        </p>
        <ul className="text-muted-foreground text-sm list-disc list-inside space-y-1">
          <li>Task assignments and updates</li>
          <li>Reconciliation approvals</li>
          <li>Monthly closing reminders</li>
          <li>Team mentions and comments</li>
          <li>Document sharing and updates</li>
        </ul>
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground mt-4">
          <MessageSquare className="h-4 w-4" />
          <span>Messages will appear here when you receive them</span>
        </div>
      </div>
    </div>
  );
};

export default InboxPage; 