"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useMemo } from "react";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserMenuProps {
  taskId: Id<"tasks">;
  currentUserId?: string;
  type: "preparerId" | "reviewerId";
  getInitials: (name: string) => string;
  getMemberName: (userId: string | undefined) => string;
}

const AVATAR_COLORS = [
  { bg: "bg-[#FFD4D4]", text: "text-gray-700" },  // Light pink
  { bg: "bg-[#FFE4C8]", text: "text-gray-700" },  // Light peach
  { bg: "bg-[#F3E8FF]", text: "text-gray-700" },  // Light purple
  { bg: "bg-[#FFE4E4]", text: "text-gray-700" },  // Light salmon
  { bg: "bg-[#E8F3FF]", text: "text-gray-700" },  // Light blue
  { bg: "bg-[#E2FFE7]", text: "text-gray-700" },  // Light mint
  { bg: "bg-[#FFF4E5]", text: "text-gray-700" },  // Light orange
  { bg: "bg-[#F0E8FF]", text: "text-gray-700" },  // Light violet
  { bg: "bg-[#FFE8F3]", text: "text-gray-700" },  // Light rose
  { bg: "bg-[#E8FFF4]", text: "text-gray-700" },  // Light cyan
];

export function UserMenu({ 
  taskId, 
  currentUserId, 
  type,
  getInitials,
  getMemberName
}: UserMenuProps) {
  const workspace = useQuery(api.workspaces.getUserWorkspace);
  const members = useQuery(api.workspaceMembers.getActiveMembers);
  const updateAssignee = useMutation(api.tasks.updateTaskAssignee);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Create a stable mapping of user IDs to colors
  const userColorMap = useMemo(() => {
    const map = new Map<string, typeof AVATAR_COLORS[0]>();
    if (!members) return map;
    
    let colorIndex = 0;
    members.forEach((member) => {
      if (!map.has(member.userId)) {
        map.set(member.userId, AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]);
        colorIndex++;
      }
    });
    return map;
  }, [members]);

  const getColorForUser = (userId: string | undefined) => {
    if (!userId) return null;
    return userColorMap.get(userId) || { bg: "bg-gray-100", text: "text-gray-500" };
  };

  const onSelect = async (userId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateAssignee({
        id: taskId,
        [type]: userId
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const currentMember = members?.find(m => m.userId === currentUserId);
  const memberName = currentUserId ? getMemberName(currentUserId) : "Unassigned";
  const memberInitials = currentUserId ? getInitials(memberName) : "?";
  const nameColors = getColorForUser(currentUserId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center cursor-pointer relative group">
            {currentUserId ? (
              <Avatar className="h-9 w-9">
                <AvatarFallback 
                  className={cn(
                    "text-[10px] font-medium flex items-center justify-center",
                    nameColors?.bg || "bg-gray-100",
                    nameColors?.text || "text-gray-500"
                  )}
                  title={memberName}
                >
                  {memberInitials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors group/text h-9">
                <span className="opacity-0 group-hover/text:opacity-100 transition-opacity">
                  <User className="h-4 w-4 text-gray-500" />
                </span>
                <span className="text-sm text-gray-500 opacity-0 group-hover/text:opacity-100 transition-opacity">
                  + {type === "preparerId" ? "Preparer" : "Reviewer"}
                </span>
              </div>
            )}
            {currentMember?.status === "ACTIVE" && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuItem 
            onClick={(e) => onSelect(null, e)}
          >
            Unassign user
          </DropdownMenuItem>
          {members?.map((member) => {
            const colors = getColorForUser(member.userId);
            const initials = getInitials(member.name);
            return (
              <DropdownMenuItem
                key={member.userId}
                onClick={(e) => onSelect(member.userId, e)}
                className={currentUserId === member.userId ? "bg-accent" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={cn(
                        "text-[10px] font-medium flex items-center justify-center",
                        colors?.bg || "bg-gray-100",
                        colors?.text || "text-gray-500"
                      )}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {member.status === "ACTIVE" && (
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span>{member.name}</span>
                    {member.status === "PENDING" && (
                      <span className="text-xs text-muted-foreground">Pending invitation</span>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuItem 
            className="border-t mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsInviteModalOpen(true);
            }}
          >
            Invite team member →
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
} 