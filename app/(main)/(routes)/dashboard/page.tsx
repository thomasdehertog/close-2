import { Calendar, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return (
    <div>
      {/* Header */}
      <div className="px-6 pt-4 flex justify-between items-center">
        <div className="flex items-center justify-between flex-1">
          <h1 className="text-sm font-medium text-muted-foreground/80">Home</h1>
          <div className="flex items-center gap-2">
            <span className="text-[#F08019] text-sm">JUNI 2024</span>
            <ChevronRight className="h-4 w-4 text-[#F08019]" />
          </div>
        </div>
        <div className="relative ml-4">
          <Avatar className="h-7 w-7 bg-[#F08019]/10">
            <AvatarFallback className="text-xs text-[#F08019]">JH</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500/80 ring-1 ring-white" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-muted mt-4 mb-8" />

      {/* My Apps Section */}
      <div className="px-6 space-y-6">
        <h2 className="text-base font-medium">My Apps</h2>
        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          {/* Close App */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-[80px] w-[80px] bg-[#F08019] rounded-lg flex items-center justify-center hover:bg-[#F08019]/90 transition-colors cursor-pointer">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Close</span>
          </div>

          {/* Assistant App */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-[80px] w-[80px] bg-[#F08019] rounded-lg flex items-center justify-center hover:bg-[#F08019]/90 transition-colors cursor-pointer">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Assistant</span>
          </div>

          {/* Add App Button */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-[80px] w-[80px] border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center hover:border-muted-foreground/30 transition cursor-pointer">
              <Plus className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <span className="text-sm text-muted-foreground">Add App</span>
          </div>
        </div>
      </div>
    </div>
  );
} 