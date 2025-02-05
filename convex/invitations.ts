import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

// Query to get all members for a workspace
export const getWorkspaceMembers = query({
  args: { 
    workspaceId: v.id("workspaces"),
    email: v.optional(v.string()) 
  },
  handler: async (ctx: QueryCtx, args) => {
    let q = ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId));
    
    if (args.email) {
      q = q.filter((q) => q.eq(q.field("email"), args.email));
    }
    
    return await q.collect();
  },
});

// Update member when they accept the invitation
export const acceptInvitation = mutation({
  args: {
    email: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { email: string, clerkUserId: string }) => {
    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!member) {
      throw new Error("No invitation found for this email");
    }

    // Update the workspace member with the real Clerk userId
    await ctx.db.patch(member._id, {
      userId: args.clerkUserId,
      status: "ACTIVE",
      updatedAt: Date.now(),
    });

    return member._id;
  },
}); 