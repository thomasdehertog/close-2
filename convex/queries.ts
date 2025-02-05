import { query } from "./_generated/server";

export const isCurrentUserAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const userId = identity.subject;
    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return member?.role === "ADMIN";
  },
}); 