import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReviews = query({
  args: { toolId: v.id("tools") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_toolId", (q: any) => q.eq("toolId", args.toolId))
      .collect();
  },
});

export const addReview = mutation({
  args: {
    toolId: v.id("tools"),
    userId: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.insert("reviews", {
      toolId: args.toolId,
      userId: args.userId,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });
  },
});
