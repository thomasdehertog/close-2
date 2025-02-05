"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const members = useQuery(api.workspaceMembers.getActiveMembers);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          Invite Member
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
          </div>
        </div>
        <div className="divide-y">
          {members?.map((member) => (
            <div key={member._id} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.name}</span>
              </div>
              <div className="text-muted-foreground">{member.email}</div>
              <div>
                <Badge variant="outline">{member.role}</Badge>
              </div>
              <div>
                <Badge 
                  variant={member.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
} 