"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { clerkClient } from "@clerk/nextjs";
import { api } from "./_generated/api";

interface InvitationResult {
  success: boolean;
  memberId?: Id<"workspaceMembers">;
  invitationId?: string;
  error?: string;
}

export const createInvitation = action({
  args: {
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("MEMBER")),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<InvitationResult> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const inviterId = identity.subject;
    const now = Date.now();

    // Check if user is already a member
    const existingMembers = await ctx.runQuery(api.invitations.getWorkspaceMembers, {
      workspaceId: args.workspaceId,
      email: args.email,
    });

    if (existingMembers && existingMembers.length > 0) {
      throw new Error("User is already a member of this workspace");
    }

    // Create Clerk invitation
    const clerkInvitation = await clerkClient.invitations.createInvitation({
      emailAddress: args.email,
      publicMetadata: {
        workspaceId: args.workspaceId,
        role: args.role,
      },
      redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    });

    // Create pending workspace member
    const result = await ctx.runMutation(api.members.createPendingMember, {
      workspaceId: args.workspaceId,
      role: args.role,
      email: args.email,
      name: args.name || args.email.split("@")[0],
      inviterId,
      clerkInvitationId: clerkInvitation.id,
      now,
    });

    return {
      success: true,
      memberId: result.memberId,
      invitationId: clerkInvitation.id,
    };
  },
}); 