import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentMember = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    console.log("Looking for member with userId:", userId);
    
    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    console.log("Found member:", member);
    return member;
  },
});

export const getActiveMembers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get all active and pending members
    const members = await ctx.db
      .query("workspaceMembers")
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "ACTIVE"),
          q.eq(q.field("status"), "PENDING")
        )
      )
      .collect();

    // Create a map to store the latest member record for each userId/email
    const latestMembersByKey = new Map();
    
    for (const member of members) {
      // Use email for pending members, userId for active ones
      const key = member.status === "PENDING" ? member.email : member.userId;
      const existingMember = latestMembersByKey.get(key);
      
      if (!existingMember || member.updatedAt > existingMember.updatedAt) {
        latestMembersByKey.set(key, member);
      }
    }

    // Convert the map values back to an array
    return Array.from(latestMembersByKey.values());
  },
});

export const updateMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("MEMBER")),
    status: v.union(v.literal("PENDING"), v.literal("ACTIVE"), v.literal("INACTIVE")),
  },
  handler: async (ctx, args) => {
    const { workspaceId, userId, role, status } = args;

    // Find the existing member record
    const existingMember = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingMember) {
      // Update existing member
      await ctx.db.patch(existingMember._id, {
        role,
        status,
        updatedAt: Date.now(),
      });
    }
  },
});

export const deactivateUserMemberships = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Find all workspace memberships for this user
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Update each membership to inactive
    for (const membership of memberships) {
      await ctx.db.patch(membership._id, {
        status: "INACTIVE",
        updatedAt: Date.now(),
      });
    }
  },
}); 