import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: {
    name: v.string(),
    timezone: v.string(),
    fiscalYearEnd: v.string(),
    firstPeriod: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject;
    const now = Date.now();

    // Create the workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      timezone: args.timezone,
      fiscalYearEnd: args.fiscalYearEnd,
      firstPeriod: args.firstPeriod,
      ownerId: userId,
      createdAt: now,
    });

    // Create the workspace member record
    await ctx.db.insert("workspaceMembers", {
      userId,
      email: identity.email ?? "",
      name: identity.name ?? identity.email?.split("@")[0] ?? "Anonymous",
      role: "ADMIN",
      invitedBy: userId,
      status: "ACTIVE",
      workspaceId,
      createdAt: now,
      updatedAt: now,
    });

    return workspaceId;
  },
});

export const getUserWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    try {
      // Get the user's active workspace membership
      const workspaceMember = await ctx.db
        .query("workspaceMembers")
        .withIndex("by_user", (q) => q.eq("userId", identity.subject))
        .filter((q) => q.eq(q.field("status"), "ACTIVE"))
        .first();

      if (!workspaceMember) {
        return null;
      }

      // Get the actual workspace
      const workspace = await ctx.db.get(workspaceMember.workspaceId);
      return workspace;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      return null;
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("ownerId"), identity.subject))
      .collect();

    return workspaces;
  },
}); 