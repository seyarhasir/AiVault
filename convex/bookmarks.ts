import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

export const getBookmarks = query({
  args: { userId: v.string() },
  handler: async (ctx: QueryCtx, args: { userId: string }) => {
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const tools = await Promise.all(
      bookmarks.map(async (b) => {
        const tool = await ctx.db.get(b.toolId);
        return tool;
      })
    );

    return tools.filter((t) => t !== null);
  },
});

export const toggleBookmark = mutation({
  args: { userId: v.string(), toolId: v.id("tools") },
  handler: async (ctx: MutationCtx, args: { userId: string; toolId: Id<"tools"> }) => {
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId_and_toolId", (q) =>
        q.eq("userId", args.userId).eq("toolId", args.toolId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // unbookmarked
    } else {
      await ctx.db.insert("bookmarks", {
        userId: args.userId,
        toolId: args.toolId,
      });
      return true; // bookmarked
    }
  },
});

export const isBookmarked = query({
  args: { userId: v.string(), toolId: v.id("tools") },
  handler: async (ctx: QueryCtx, args: { userId: string; toolId: Id<"tools"> }) => {
    if (!args.userId) return false;
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId_and_toolId", (q) =>
        q.eq("userId", args.userId).eq("toolId", args.toolId)
      )
      .first();
    return !!existing;
  },
});
