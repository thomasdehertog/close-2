import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories_checklist")
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Generate a unique ID with a prefix and timestamp for better uniqueness
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const categories_checklistId = `cat_${timestamp}_${randomStr}`;

    const category = await ctx.db.insert("categories_checklist", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
      color: args.color,
      showByDefault: true,
      isArchived: false,
      categories_checklistId,
    });

    return category;
  },
});

export const update = mutation({
  args: {
    id: v.id("categories_checklist"),
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
    id: v.id("categories_checklist"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isArchived: true,
    });
  },
}); 