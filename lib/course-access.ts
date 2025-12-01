import { auth } from "@clerk/nextjs/server";

export type Tier = "free" | "pro" | "ultra";

/**
 * Check if the current user has access to content at the specified tier.
 * Uses Clerk's has() to check plan subscriptions.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export async function hasAccessToTier(
  requiredTier: Tier | null | undefined
): Promise<boolean> {
  // Free content or no tier = accessible to everyone
  if (!requiredTier || requiredTier === "free") return true;
  const { has } = await auth();

  console.log("requiredTier", requiredTier);
  console.log("has ultra", has({ plan: "ultra" }));
  console.log("has pro", has({ plan: "pro" }));
  console.log("has free", has({ plan: "free" }));

  // Ultra content requires ultra plan
  if (requiredTier === "ultra") {
    return has({ plan: "ultra" });
  }

  // Pro content requires pro OR ultra plan
  if (requiredTier === "pro") {
    return has({ plan: "pro" }) || has({ plan: "ultra" });
  }

  return false;
}

/**
 * Get the user's current subscription tier.
 */
export async function getUserTier(): Promise<Tier> {
  const { has } = await auth();

  if (has({ plan: "ultra" })) return "ultra";
  if (has({ plan: "pro" })) return "pro";

  return "free";
}
