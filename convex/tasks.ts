import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    frequency: v.union(
      v.literal("ONE_TIME"),
      v.literal("MONTHLY"),
      v.literal("QUARTERLY"),
      v.literal("ANNUALLY")
    ),
    isTemplate: v.boolean(),
    isSubtask: v.boolean(),
    preparerId: v.optional(v.string()),
    reviewerId: v.optional(v.string()),
    duedate_preparer: v.optional(v.string()),
    duedate_reviewer: v.optional(v.string()),
    parentTaskId: v.optional(v.id("tasks")),
    periodId: v.optional(v.id("periods")),
    templateId: v.optional(v.id("templates")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // For one-off tasks, periodId is required
    if (args.frequency === "ONE_TIME" && !args.periodId) {
      throw new Error("One-time tasks must be associated with a period");
    }

    // If it's a template, periodId should not be set
    if (args.isTemplate && args.periodId) {
      throw new Error("Template tasks should not be associated with a period");
    }

    // If periodId is provided, verify it exists and belongs to the workspace
    if (args.periodId) {
      const period = await ctx.db.get(args.periodId);
      if (!period) {
        throw new Error("Period not found");
      }
      if (period.workspaceId !== args.workspaceId) {
        throw new Error("Period does not belong to the workspace");
      }
    }

    const now = Date.now();
    
    // Explicitly construct the task object with all required fields
    const task = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      categoryId: args.categoryId,
      workspaceId: args.workspaceId,
      frequency: args.frequency,
      isTemplate: args.isTemplate,
      isSubtask: args.isSubtask,
      preparerId: args.preparerId,
      reviewerId: args.reviewerId,
      status: "PENDING", // Set default status for new tasks
      duedate_preparer: args.duedate_preparer,
      duedate_reviewer: args.duedate_reviewer,
      parentTaskId: args.parentTaskId,
      periodId: args.periodId,
      templateId: args.templateId,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    return task;
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.string()),
    frequency: v.optional(v.union(v.literal("ONE_TIME"), v.literal("MONTHLY"), v.literal("QUARTERLY"), v.literal("ANNUALLY"))),
    isTemplate: v.optional(v.boolean()),
    isSubtask: v.optional(v.boolean()),
    preparerId: v.optional(v.string()),
    reviewerId: v.optional(v.string()),
    duedate_preparer: v.optional(v.string()),
    duedate_reviewer: v.optional(v.string()),
    status: v.optional(v.union(v.literal("PENDING"), v.literal("SUBMITTED"), v.literal("COMPLETED"), v.literal("UNASSIGNED"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    const updates: any = {};
    for (const [key, value] of Object.entries(args)) {
      if (key !== "id" && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = Date.now();
      return await ctx.db.patch(args.id, updates);
    }

    return task;
  },
});

export const archiveTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    return await ctx.db.patch(args.id, {
      isArchived: true,
    });
  },
});

export const deleteAllTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("tasks")
      .collect();

    console.log(`Found ${tasks.length} tasks to delete`);

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    console.log("All tasks deleted successfully");
  },
});

export const getTasks = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodId: v.optional(v.id("periods")),
    parentTaskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const query = args.periodId
      ? ctx.db
          .query("tasks")
          .withIndex("by_workspace_and_period", (q) => 
            q
              .eq("workspaceId", args.workspaceId)
              .eq("periodId", args.periodId)
          )
      : ctx.db
          .query("tasks")
          .withIndex("by_workspace", (q) => 
            q.eq("workspaceId", args.workspaceId)
          );

    return await query
      .filter((q) =>
        q.and(
          q.eq(q.field("parentTaskId"), args.parentTaskId),
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("isTemplate"), false)
        )
      )
      .order("desc")
      .collect();
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get active workspace members
    return await ctx.db
      .query("workspaceMembers")
      .filter(q => q.eq(q.field("status"), "ACTIVE"))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    preparer: v.optional(v.string()),
    reviewer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Update the task with new values
    return await ctx.db.patch(args.id, {
      ...(args.preparer !== undefined && { preparerId: args.preparer }),
      ...(args.reviewer !== undefined && { reviewerId: args.reviewer }),
    });
  },
});

export const updateTaskAssignee = mutation({
  args: {
    id: v.id("tasks"),
    preparerId: v.optional(v.string()),
    reviewerId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    const updates: { preparerId?: string | undefined, reviewerId?: string | undefined } = {};
    
    // Only include fields that are provided in the update
    if (args.preparerId !== undefined) {
      updates.preparerId = args.preparerId || undefined;
    }
    if (args.reviewerId !== undefined) {
      updates.reviewerId = args.reviewerId || undefined;
    }

    // Add updatedAt timestamp
    const now = Date.now();
    
    return await ctx.db.patch(args.id, {
      ...updates,
      updatedAt: now
    });
  }
});

export const getTemplates = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("isArchived"), false),
          q.or(
            q.eq(q.field("frequency"), "MONTHLY"),
            q.eq(q.field("frequency"), "QUARTERLY"),
            q.eq(q.field("frequency"), "ANNUALLY")
          )
        )
      )
      .collect();
  },
}); 