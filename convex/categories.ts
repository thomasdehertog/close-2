import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getChecklistCategories = query({
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

export const createChecklistCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a unique ID with a prefix and timestamp for better uniqueness
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const categories_checklistId = `cat_${timestamp}_${randomStr}`;

    return await ctx.db.insert("categories_checklist", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
      color: args.color,
      showByDefault: true,
      isArchived: false,
      categories_checklistId,
    });
  },
});

export const updateChecklistCategory = mutation({
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

export const archiveChecklistCategory = mutation({
  args: {
    id: v.id("categories_checklist"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isArchived: true,
    });
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
    // Generate a unique ID with a prefix and timestamp for better uniqueness
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const categories_checklistId = `cat_${timestamp}_${randomStr}`;

    return await ctx.db.insert("categories_checklist", {
      name: args.name,
      description: args.description,
      workspaceId: args.workspaceId,
      color: args.color,
      showByDefault: true,
      isArchived: false,
      categories_checklistId,
    });
  },
});

export const getCategories = query({
  args: {
    workspaceId: v.string(),
    category_type: v.string()
  },
  handler: async (ctx, args) => {
    switch (args.category_type) {
      case "reconciliation":
        return ctx.db
          .query("categories_reconciliation")
          .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
          .filter((q) => q.eq(q.field("isArchived"), false))
          .collect();
      case "account_type":
        return ctx.db
          .query("categories_account_type")
          .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
          .filter((q) => q.eq(q.field("isArchived"), false))
          .collect();
      default:
        throw new Error(`Unsupported category type: ${args.category_type}`);
    }
  },
});

export const getReconciliationCategories = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories_reconciliation")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
    
    console.log("Fetched categories:", categories);
    return categories;
  },
});

// Helper function to generate reconciliation category ID
function generateReconciliationCategoryId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `rec_cat_${timestamp}_${randomStr}`;
}

// Update or add the mutation used by the settings interface
export const createReconciliationCategoryFromSettings = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const categories_reconciliation_id = generateReconciliationCategoryId();

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

// Update the existing createReconciliationCategory to use the same helper
export const createReconciliationCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
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

export const migrateReconciliationCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories_reconciliation")
      .collect();

    console.log(`Found ${categories.length} categories to check for migration`);

    for (const category of categories) {
      if (!category.categories_reconciliation_id) {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        const categories_reconciliation_id = `rec_cat_${timestamp}_${randomStr}`;
        
        console.log(`Migrating category ${category.name} with new ID ${categories_reconciliation_id}`);
        
        await ctx.db.patch(category._id, {
          categories_reconciliation_id
        });
      }
    }

    console.log("Migration completed");
  },
});

export const createTestCategory = mutation({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const categories_reconciliation_id = `rec_cat_${timestamp}_${randomStr}`;

    return await ctx.db.insert("categories_reconciliation", {
      name: "Assets",
      description: "Asset accounts",
      workspaceId: args.workspaceId,
      color: "#FF5733",
      categories_reconciliation_id,
      showByDefault: true,
      isArchived: false,
    });
  },
}); 