import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .first();

    return member;
  },
}); 