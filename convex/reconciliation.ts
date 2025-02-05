import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Helper function to generate a unique reconciliation line item ID
function generateReconciliationId(timestamp: number): string {
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `rec_${timestamp}_${randomPart}`;
}

export const createLineItem = mutation({
  args: {
    name: v.string(),
    accountNumber: v.string(),
    workspaceId: v.string(),
    accountType: v.string(),
    category: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    source: v.union(v.literal("excel"), v.literal("sheets"), v.literal("manual")),
    varianceThreshold: v.float64(),
    glBalance: v.float64(),
    recBalance: v.float64(),
    links: v.array(v.string()),
    assignees: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const reconciliation_line_item_id = generateReconciliationId(now);

    console.log("Creating line item with ID:", reconciliation_line_item_id);

    const lineItemId = await ctx.db.insert("reconciliation_line_items", {
      name: args.name,
      accountNumber: args.accountNumber,
      workspaceId: args.workspaceId,
      accountType: args.accountType,
      category: args.category,
      status: args.status,
      source: args.source,
      varianceThreshold: args.varianceThreshold,
      glBalance: args.glBalance,
      recBalance: args.recBalance,
      links: args.links,
      assignees: args.assignees,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      reconciliation_line_item_id,
    });

    return {
      _id: lineItemId,
      reconciliation_line_item_id,
    };
  },
});

// Define the basic account type enum
type AccountTypeEnum = "Assets" | "Liabilities";

interface CategoryData {
  name: string;
  items: Doc<"reconciliation_line_items">[];
  totalGLBalance: number;
  totalRecBalance: number;
}

interface AccountTypeGroup {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: CategoryAccount[];
}

type GroupedData = Record<AccountTypeEnum, AccountTypeGroup>;

// Define the structure for a line item
interface LineItem {
  id: string;
  name: string;
  accountNumber: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  reconciliation_line_item_id: string;
  source: "excel" | "sheets" | "manual";
  links: string[];
}

// Define the structure for a category
interface CategoryAccount {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: LineItem[];
}

// Define the main account type structure
interface AccountTypeGroup {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: CategoryAccount[];
}

export const getLineItems = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("reconciliation_line_items")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    // Group by account type and category
    const groupedData = new Map<string, Map<string, LineItem[]>>();
    const accountTypeTotals = new Map<string, { glBalance: number; recBalance: number }>();
    const categoryTotals = new Map<string, { glBalance: number; recBalance: number }>();

    // Initialize data structures
    items.forEach(item => {
      if (!groupedData.has(item.accountType)) {
        groupedData.set(item.accountType, new Map());
        accountTypeTotals.set(item.accountType, { glBalance: 0, recBalance: 0 });
      }
      
      const categoryMap = groupedData.get(item.accountType)!;
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
        categoryTotals.set(`${item.accountType}_${item.category}`, { glBalance: 0, recBalance: 0 });
      }
    });

    // Add items and calculate totals
    items.forEach(item => {
      const categoryMap = groupedData.get(item.accountType)!;
      const categoryItems = categoryMap.get(item.category)!;
      
      // Create line item with all necessary properties
      const lineItem: LineItem = {
        id: item._id,
        name: item.name,
        accountNumber: item.accountNumber,
        glBalance: item.glBalance,
        recBalance: item.recBalance,
        variance: item.glBalance - item.recBalance,
        reconciliation_line_item_id: item.reconciliation_line_item_id,
        source: item.source,
        links: item.links
      };
      
      categoryItems.push(lineItem);

      // Update totals
      const accountTypeTotal = accountTypeTotals.get(item.accountType)!;
      accountTypeTotal.glBalance += item.glBalance;
      accountTypeTotal.recBalance += item.recBalance;

      const categoryTotal = categoryTotals.get(`${item.accountType}_${item.category}`)!;
      categoryTotal.glBalance += item.glBalance;
      categoryTotal.recBalance += item.recBalance;
    });

    // Transform to final structure
    const result: AccountTypeGroup[] = Array.from(groupedData.entries()).map(([accountTypeName, categoryMap]) => {
      const accountTypeTotal = accountTypeTotals.get(accountTypeName)!;
      
      return {
        id: accountTypeName,
        name: accountTypeName,
        glBalance: accountTypeTotal.glBalance,
        recBalance: accountTypeTotal.recBalance,
        variance: accountTypeTotal.glBalance - accountTypeTotal.recBalance,
        children: Array.from(categoryMap.entries()).map(([categoryName, items]) => {
          const categoryTotal = categoryTotals.get(`${accountTypeName}_${categoryName}`)!;
          
          return {
            id: `${accountTypeName}_${categoryName}`,
            name: categoryName,
            glBalance: categoryTotal.glBalance,
            recBalance: categoryTotal.recBalance,
            variance: categoryTotal.glBalance - categoryTotal.recBalance,
            children: items.sort((a, b) => {
              const accountNumberA = parseInt(a.accountNumber);
              const accountNumberB = parseInt(b.accountNumber);
              if (accountNumberA !== accountNumberB) {
                return accountNumberA - accountNumberB;
              }
              return a.reconciliation_line_item_id.localeCompare(b.reconciliation_line_item_id);
            })
          };
        }).sort((a, b) => a.name.localeCompare(b.name))
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return result;
  },
});

export const updateLineItem = mutation({
  args: {
    id: v.id("reconciliation_line_items"),
    name: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountType: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    source: v.optional(v.union(v.literal("excel"), v.literal("sheets"), v.literal("manual"))),
    varianceThreshold: v.optional(v.float64()),
    glBalance: v.optional(v.float64()),
    recBalance: v.optional(v.float64()),
    links: v.optional(v.array(v.string())),
    assignees: v.optional(v.array(v.string())),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteLineItem = mutation({
  args: {
    id: v.id("reconciliation_line_items"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
}); 