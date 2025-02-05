/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accountTypeCategories from "../accountTypeCategories.js";
import type * as categories from "../categories.js";
import type * as checklistCategories from "../checklistCategories.js";
import type * as documents from "../documents.js";
import type * as invitationActions from "../invitationActions.js";
import type * as invitations from "../invitations.js";
import type * as members from "../members.js";
import type * as periods from "../periods.js";
import type * as queries from "../queries.js";
import type * as reconciliation from "../reconciliation.js";
import type * as reconciliationCategories from "../reconciliationCategories.js";
import type * as tasks from "../tasks.js";
import type * as templates from "../templates.js";
import type * as test from "../test.js";
import type * as users from "../users.js";
import type * as workspaceMembers from "../workspaceMembers.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accountTypeCategories: typeof accountTypeCategories;
  categories: typeof categories;
  checklistCategories: typeof checklistCategories;
  documents: typeof documents;
  invitationActions: typeof invitationActions;
  invitations: typeof invitations;
  members: typeof members;
  periods: typeof periods;
  queries: typeof queries;
  reconciliation: typeof reconciliation;
  reconciliationCategories: typeof reconciliationCategories;
  tasks: typeof tasks;
  templates: typeof templates;
  test: typeof test;
  users: typeof users;
  workspaceMembers: typeof workspaceMembers;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
