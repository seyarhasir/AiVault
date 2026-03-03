import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

async function getIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}

export const getReviews = query({
  args: { toolId: v.id("tools") },
  handler: async (ctx: QueryCtx, args: { toolId: Id<"tools"> }) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_toolId", (q) => q.eq("toolId", args.toolId))
      .collect();
  },
});

export const addReview = mutation({
  args: {
    toolId: v.id("tools"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { toolId: Id<"tools">; rating: number; comment: string }) => {
    const identity = await getIdentity(ctx);
    await ctx.db.insert("reviews", {
      toolId: args.toolId,
      userId: identity.subject,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });
  },
});
