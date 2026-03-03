import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

async function getIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}

export const getBookmarks = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await getIdentity(ctx);
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
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
  args: { toolId: v.id("tools") },
  handler: async (ctx: MutationCtx, args: { toolId: Id<"tools"> }) => {
    const identity = await getIdentity(ctx);
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId_and_toolId", (q) =>
        q.eq("userId", identity.subject).eq("toolId", args.toolId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // unbookmarked
    } else {
      await ctx.db.insert("bookmarks", {
        userId: identity.subject,
        toolId: args.toolId,
      });
      return true; // bookmarked
    }
  },
});

export const isBookmarked = query({
  args: { toolId: v.id("tools") },
  handler: async (ctx: QueryCtx, args: { toolId: Id<"tools"> }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_userId_and_toolId", (q) =>
        q.eq("userId", identity.subject).eq("toolId", args.toolId)
      )
      .first();
    return !!existing;
  },
});
