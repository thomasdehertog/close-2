import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  process.exit(1);
}

async function main() {
  console.log("Using Convex URL:", CONVEX_URL);
  const client = new ConvexClient(CONVEX_URL);
  
  console.log("Deleting all existing tasks...");
  try {
    await client.mutation(api.tasks.deleteAllTasks);
    console.log("All tasks deleted successfully!");
  } catch (error) {
    console.error("Failed to delete tasks:", error);
  }
  process.exit(0);
}

main(); 