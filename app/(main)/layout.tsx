"use client";

import { Navigation } from "@/components/navigation";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { InboxPanel } from "@/components/inbox-panel";
import { useInbox } from "@/hooks/use-inbox";

const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const inbox = useInbox();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <>
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigation />
        <main className="flex-1 h-full overflow-y-auto">
          {children}
        </main>
      </div>
      <InboxPanel 
        isOpen={inbox.isOpen}
        onClose={inbox.onClose}
      />
    </>
  );
};

export default MainLayout;