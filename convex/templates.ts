import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    category: v.optional(v.string()),
    frequency: v.union(
      v.literal("MONTHLY"),
      v.literal("QUARTERLY"),
      v.literal("ANNUALLY")
    ),
    periodId: v.optional(v.id("periods")),
    settings: v.optional(v.object({
      autoAssignPreparer: v.optional(v.boolean()),
      autoAssignReviewer: v.optional(v.boolean()),
      defaultPreparerId: v.optional(v.string()),
      defaultReviewerId: v.optional(v.string()),
      dueDateOffsetPreparer: v.optional(v.number()),
      dueDateOffsetReviewer: v.optional(v.number()),
    })),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { workspaceId, ...rest } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const templateId = await ctx.db.insert("templates", {
      ...rest,
      workspaceId,
      createdBy: user.subject,
      isArchived: false,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return templateId;
  },
});

export const updateTemplate = mutation({
  args: {
    id: v.id("templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    frequency: v.optional(v.union(
      v.literal("MONTHLY"),
      v.literal("QUARTERLY"),
      v.literal("ANNUALLY")
    )),
    settings: v.optional(v.object({
      autoAssignPreparer: v.optional(v.boolean()),
      autoAssignReviewer: v.optional(v.boolean()),
      defaultPreparerId: v.optional(v.string()),
      defaultReviewerId: v.optional(v.string()),
      dueDateOffsetPreparer: v.optional(v.number()),
      dueDateOffsetReviewer: v.optional(v.number()),
    })),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const template = await ctx.db.get(id);
    
    if (!template) {
      throw new Error("Template not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const updateTemplateSettings = mutation({
  args: {
    id: v.id("templates"),
    settings: v.object({
      autoAssignPreparer: v.optional(v.boolean()),
      autoAssignReviewer: v.optional(v.boolean()),
      defaultPreparerId: v.optional(v.string()),
      defaultReviewerId: v.optional(v.string()),
      dueDateOffsetPreparer: v.optional(v.number()),
      dueDateOffsetReviewer: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    return await ctx.db.patch(args.id, {
      settings: {
        ...template.settings,
        ...args.settings,
      },
      updatedAt: Date.now(),
    });
  },
});

export const archiveTemplate = mutation({
  args: {
    id: v.id("templates"),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    return await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});

export const getTemplates = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("templates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

export const getTemplateById = query({
  args: {
    id: v.id("templates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getTemplateWithTasks = query({
  args: {
    templateId: v.id("templates"),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_template", (q) => q.eq("templateId", args.templateId))
      .collect();

    return {
      template,
      tasks,
    };
  },
});

export const useTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    periodId: v.id("periods"),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Get all tasks associated with this template
    const templateTasks = await ctx.db
      .query("tasks")
      .withIndex("by_template", (q) => q.eq("templateId", args.templateId))
      .collect();

    const now = Date.now();
    
    // Create new tasks based on template tasks
    const newTasks = await Promise.all(
      templateTasks.map(async (task) => {
        const { _id, _creationTime, templateId, ...taskData } = task;
        
        // Calculate due dates based on template settings
        let dueDatePreparer = undefined;
        let dueDateReviewer = undefined;
        
        if (template.settings?.dueDateOffsetPreparer !== undefined) {
          dueDatePreparer = new Date(now + template.settings.dueDateOffsetPreparer * 24 * 60 * 60 * 1000).toISOString();
        }
        
        if (template.settings?.dueDateOffsetReviewer !== undefined) {
          dueDateReviewer = new Date(now + template.settings.dueDateOffsetReviewer * 24 * 60 * 60 * 1000).toISOString();
        }

        return await ctx.db.insert("tasks", {
          ...taskData,
          periodId: args.periodId,
          preparerId: template.settings?.autoAssignPreparer ? template.settings.defaultPreparerId : undefined,
          reviewerId: template.settings?.autoAssignReviewer ? template.settings.defaultReviewerId : undefined,
          duedate_preparer: dueDatePreparer,
          duedate_reviewer: dueDateReviewer,
          createdAt: now,
          updatedAt: now,
        });
      })
    );

    // Update template usage statistics
    await ctx.db.patch(args.templateId, {
      lastUsed: now,
      usageCount: (template.usageCount || 0) + 1,
      updatedAt: now,
    });

    return newTasks;
  },
}); 