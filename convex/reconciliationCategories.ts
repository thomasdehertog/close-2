import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories_reconciliation")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a unique ID with a prefix and timestamp
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const categories_reconciliation_id = `rec_cat_${timestamp}_${randomStr}`;

    return await ctx.db.insert("categories_reconciliation", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
      color: args.color,
      categories_reconciliation_id,
      showByDefault: true,
      isArchived: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories_reconciliation"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const archive = mutation({
  args: {
    id: v.id("categories_reconciliation"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isArchived: true,
    });
  },
}); 