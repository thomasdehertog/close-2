import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
  .index("by_user", ["userId"])
  .index("by_user_parent", ["userId", "parentDocument"]),

  tasks: defineTable({
    categoryId: v.optional(v.string()),
    createdAt: v.float64(),
    description: v.optional(v.string()),
    duedate_preparer: v.optional(v.string()),
    duedate_reviewer: v.optional(v.string()),
    frequency: v.union(
      v.literal("ONE_TIME"),
      v.literal("MONTHLY"),
      v.literal("QUARTERLY"),
      v.literal("ANNUALLY")
    ),
    isArchived: v.boolean(),
    isSubtask: v.boolean(),
    isTemplate: v.boolean(),
    parentTaskId: v.optional(v.id("tasks")),
    periodId: v.optional(v.id("periods")),
    preparerId: v.optional(v.string()),
    reviewerId: v.optional(v.string()),
    status: v.union(
      v.literal("PENDING"),
      v.literal("SUBMITTED"),
      v.literal("COMPLETED"),
      v.literal("UNASSIGNED")
    ),
    templateId: v.optional(v.id("templates")),
    title: v.string(),
    updatedAt: v.float64(),
    workspaceId: v.string(),
  })
  .index("by_category", ["categoryId"])
  .index("by_parent", ["parentTaskId"])
  .index("by_period", ["periodId"])
  .index("by_template", ["templateId"])
  .index("by_workspace", ["workspaceId"]),

  taskHistory: defineTable({
    taskId: v.id("tasks"),
    userId: v.string(),
    action: v.union(
      v.literal("ASSIGNED"),
      v.literal("SUBMITTED"),
      v.literal("RETURNED"),
      v.literal("APPROVED"),
      v.literal("COMMENTED")
    ),
    role: v.union(
      v.literal("PREPARER"),
      v.literal("REVIEWER"),
      v.literal("OBSERVER")
    ),
    comment: v.optional(v.string()),
    createdAt: v.float64(),
  })
  .index("by_task", ["taskId"])
  .index("by_user", ["userId"]),

  userSettings: defineTable({
    userId: v.string(),
    role: v.union(
      v.literal("OWNER"),
      v.literal("ADMIN"),
      v.literal("PREPARER"),
      v.literal("REVIEWER")
    ),
    preferences: v.object({
      emailNotifications: v.boolean(),
      defaultView: v.string(),
    }),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
  .index("by_user", ["userId"]),

  workspaceMembers: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("MEMBER")),
    invitedBy: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACTIVE"),
      v.literal("INACTIVE")
    ),
    workspaceId: v.id("workspaces"),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
  .index("by_user", ["userId"])
  .index("by_email", ["email"])
  .index("by_status", ["status"])
  .index("by_workspace", ["workspaceId"]),

  workspaces: defineTable({
    name: v.string(),
    timezone: v.string(),
    fiscalYearEnd: v.string(),
    firstPeriod: v.string(),
    ownerId: v.string(),
    createdAt: v.float64(),
    members: v.optional(v.array(v.string())),
  }),

  categories_checklist: defineTable({
    color: v.string(),
    description: v.optional(v.string()),
    isArchived: v.boolean(),
    name: v.string(),
    showByDefault: v.boolean(),
    workspaceId: v.string(),
    categories_checklistId: v.string(),
  })
  .index("by_workspace", ["workspaceId"])
  .index("by_categories_checklistId", ["categories_checklistId"]),

  categories_reconciliation: defineTable({
    color: v.string(),
    description: v.optional(v.string()),
    isArchived: v.boolean(),
    name: v.string(),
    showByDefault: v.boolean(),
    workspaceId: v.string(),
    categories_reconciliation_id: v.string(),
  })
  .index("by_workspace", ["workspaceId"])
  .index("by_categories_reconciliation_id", ["categories_reconciliation_id"]),

  categories_account_type: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.string(),
    color: v.string(),
    showByDefault: v.boolean(),
    isArchived: v.boolean(),
  }).index("by_workspace", ["workspaceId"]),

  reconciliation_line_items: defineTable({
    accountNumber: v.string(),
    accountType: v.string(),
    assignees: v.array(v.string()),
    category: v.string(),
    createdAt: v.float64(),
    glBalance: v.float64(),
    isArchived: v.boolean(),
    links: v.array(v.string()),
    name: v.string(),
    recBalance: v.float64(),
    reconciliation_line_item_id: v.string(),
    source: v.union(
      v.literal("excel"),
      v.literal("sheets"),
      v.literal("manual")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive")
    ),
    updatedAt: v.float64(),
    varianceThreshold: v.float64(),
    workspaceId: v.string(),
  })
    .index("by_account_type", ["accountType"])
    .index("by_category", ["category"])
    .index("by_workspace", ["workspaceId"])
    .index("by_reconciliation_id", ["reconciliation_line_item_id"]),

  templates: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    createdBy: v.string(),
    isArchived: v.boolean(),
    category: v.optional(v.string()),
    frequency: v.union(
      v.literal("MONTHLY"),
      v.literal("QUARTERLY"),
      v.literal("ANNUALLY")
    ),
    lastUsed: v.optional(v.number()),
    usageCount: v.number(),
    tags: v.optional(v.array(v.string())),
    settings: v.optional(v.object({
      autoAssignPreparer: v.optional(v.boolean()),
      autoAssignReviewer: v.optional(v.boolean()),
      defaultPreparerId: v.optional(v.string()),
      defaultReviewerId: v.optional(v.string()),
      dueDateOffsetPreparer: v.optional(v.number()),
      dueDateOffsetReviewer: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_workspace", ["workspaceId"])
  .index("by_creator", ["createdBy"])
  .index("by_workspace_and_frequency", ["workspaceId", "frequency"]),

  periods: defineTable({
    workspaceId: v.id("workspaces"),
    monthId: v.string(),  // Format: YYYY-MM
    period_Id: v.string(), // Format: per_timestamp_random
    templateId: v.optional(v.id("templates")),
    status: v.union(
      v.literal("OPEN"),
      v.literal("CLOSED")
    ),
    year: v.number(),
    month: v.number(),  // 1-12
    quarter: v.number(), // 1-4
    isArchived: v.boolean(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
  .index("by_workspace", ["workspaceId"])
  .index("by_workspace_and_month", ["workspaceId", "monthId"])
  .index("by_workspace_and_status", ["workspaceId", "status"])
  .index("by_period_Id", ["period_Id"]),
});
