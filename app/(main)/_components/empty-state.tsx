"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative h-40 w-40">
        <Image
          src="/empty.png"  // Make sure you have this image in your public folder
          fill
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/empty-dark.png"  // And this one for dark mode
          fill
          alt="Empty"
          className="hidden dark:block"
        />
      </div>
      <h2 className="text-2xl font-bold text-center">Set up close management</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Track tasks, collaborate with your team, automate email reminders, 
        build out workflows in seconds - it's all one click away!
      </p>
      <Button 
        size="lg" 
        onClick={() => router.push("/checklist")}
        className="mt-4"
      >
        Get Started
      </Button>
    </div>
  );
} 