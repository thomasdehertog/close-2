import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper function to determine if a template should be included based on frequency
function shouldIncludeTemplate(
  template: any,
  month: number
) {
  switch (template.frequency) {
    case "MONTHLY":
      return true;
    case "QUARTERLY":
      return month % 3 === 0; // Include in March, June, September, December
    case "ANNUALLY":
      return month === 12; // Include only in December
    default:
      return false;
  }
}

// Helper function to clone a template into a task
async function cloneTemplateToTask(
  ctx: any,
  template: any,
  periodId: Id<"periods">,
  workspaceId: Id<"workspaces">
) {
  return await ctx.db.insert("tasks", {
    title: template.title,
    description: template.description,
    workspaceId: workspaceId.toString(),
    periodId,
    categoryId: template.categoryId,
    preparerId: template.preparerId,
    reviewerId: template.reviewerId,
    status: "PENDING",
    isTemplate: false,
    isSubtask: false,
    isArchived: false,
    parentTaskId: undefined,
    frequency: template.frequency,
    duedate_preparer: template.duedate_preparer,
    duedate_reviewer: template.duedate_reviewer,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export const createPeriod = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    year: v.float64(),
    month: v.float64(),
  },
  handler: async (ctx, args) => {
    const { workspaceId, year, month } = args;

    // Create a unique monthId for indexing
    const monthId = `${year}-${month.toString().padStart(2, '0')}`;

    // Check if period already exists
    const existingPeriod = await ctx.db
      .query("periods")
      .withIndex("by_workspace_and_month", (q) =>
        q.eq("workspaceId", workspaceId).eq("monthId", monthId)
      )
      .first();

    if (existingPeriod) {
      throw new Error("Period already exists");
    }

    // Start a transaction for atomic period creation
    try {
      // Create the period
      const period = await ctx.db.insert("periods", {
        workspaceId,
        year,
        month,
        monthId,
        period_Id: monthId,
        quarter: Math.ceil(month / 3),
        status: "OPEN",
        isArchived: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Get all templates for this workspace
      const templates = await ctx.db
        .query("tasks")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId.toString()))
        .filter((q) => 
          q.and(
            q.eq(q.field("isArchived"), false),
            q.eq(q.field("isTemplate"), true),
            q.or(
              q.eq(q.field("frequency"), "MONTHLY"),
              q.eq(q.field("frequency"), "QUARTERLY"),
              q.eq(q.field("frequency"), "ANNUALLY")
            )
          )
        )
        .collect();

      // Filter templates based on frequency and create tasks
      const relevantTemplates = templates.filter(template => 
        shouldIncludeTemplate(template, month)
      );

      // Clone each relevant template into a new task
      const clonedTasks = await Promise.all(
        relevantTemplates.map(async (template) => {
          try {
            return await cloneTemplateToTask(ctx, template, period, workspaceId);
          } catch (error) {
            console.error(`Failed to clone template ${template._id}:`, error);
            return null;
          }
        })
      );

      // Filter out any failed clones
      const successfulClones = clonedTasks.filter(task => task !== null);

      if (successfulClones.length !== relevantTemplates.length) {
        console.warn(`Some templates failed to clone. Expected: ${relevantTemplates.length}, Succeeded: ${successfulClones.length}`);
      }

      return {
        period,
        clonedTasks: successfulClones
      };
    } catch (error) {
      // Log the error and rethrow
      console.error("Failed to create period:", error);
      throw error;
    }
  }
});

export const getPeriod = query({
  args: {
    workspaceId: v.id("workspaces"),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const { workspaceId, year, month } = args;
    const monthId = `${year}-${month.toString().padStart(2, '0')}`;

    return await ctx.db
      .query("periods")
      .withIndex("by_workspace_and_month", (q) => 
        q.eq("workspaceId", workspaceId).eq("monthId", monthId)
      )
      .first();
  },
});

export const getActivePeriods = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("periods")
      .withIndex("by_workspace_and_status", (q) => 
        q.eq("workspaceId", args.workspaceId).eq("status", "OPEN")
      )
      .collect();
  },
});

export const getAllPeriods = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("periods")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const getPeriodByPeriodId = query({
  args: {
    period_Id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("periods")
      .withIndex("by_period_Id", (q) => q.eq("period_Id", args.period_Id))
      .first();
  },
});

export const closePeriod = mutation({
  args: {
    periodId: v.id("periods"),
  },
  handler: async (ctx, args) => {
    const period = await ctx.db.get(args.periodId);
    if (!period) {
      throw new Error("Period not found");
    }

    await ctx.db.patch(args.periodId, {
      status: "CLOSED",
      updatedAt: Date.now(),
    });

    return args.periodId;
  },
}); 