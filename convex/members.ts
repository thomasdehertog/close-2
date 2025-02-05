import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export interface PendingMemberResult {
  memberId: Id<"workspaceMembers">;
}

export const createPendingMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("ADMIN"), v.literal("MEMBER")),
    email: v.string(),
    name: v.string(),
    inviterId: v.string(),
    clerkInvitationId: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    // Create the pending member record
    const memberId = await ctx.db.insert("workspaceMembers", {
      workspaceId: args.workspaceId,
      userId: `pending_${args.clerkInvitationId}`,
      email: args.email,
      name: args.name,
      role: args.role,
      status: "PENDING",
      invitedBy: args.inviterId,
      createdAt: args.now,
      updatedAt: args.now,
    });

    return { memberId };
  },
}); 