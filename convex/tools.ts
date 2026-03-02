import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTools = query({
  args: {
    category: v.optional(v.string()),
    pricing: v.optional(v.string()),
    search: v.optional(v.string()),
    sort: v.optional(v.string()), // "newest", "upvotes"
  },
  handler: async (ctx: any, args: any) => {
    let toolsQuery = ctx.db.query("tools").withIndex("by_approved", (q: any) => q.eq("approved", true));

    let tools = await toolsQuery.collect();

    if (args.category && args.category !== "All") {
      tools = tools.filter((t: any) => t.category === args.category);
    }

    if (args.pricing && args.pricing !== "All") {
      tools = tools.filter((t: any) => t.pricing === args.pricing);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      tools = tools.filter(
        (t: any) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag: any) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (args.sort === "upvotes") {
      tools.sort((a: any, b: any) => b.upvotes - a.upvotes);
    } else {
      // default to newest
      tools.sort((a: any, b: any) => b.createdAt - a.createdAt);
    }

    return tools;
  },
});

export const getToolBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .first();
  },
});

export const getFeaturedTools = query({
  handler: async (ctx: any) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q: any) => q.eq("approved", true))
      .collect();
    return tools.filter((t: any) => t.featured).sort((a: any, b: any) => b.createdAt - a.createdAt);
  },
});

export const getSubmittedTools = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_submittedBy", (q: any) => q.eq("submittedBy", args.userId))
      .collect();
  },
});

export const getPendingTools = query({
  handler: async (ctx: any) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_approved", (q: any) => q.eq("approved", false))
      .collect();
  },
});

export const submitTool = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    pricing: v.string(),
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Check if slug exists
    const existing = await ctx.db.query("tools").withIndex("by_slug", (q: any) => q.eq("slug", slug)).first();
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    return await ctx.db.insert("tools", {
      name: args.name,
      slug: finalSlug,
      description: args.description,
      category: args.category,
      tags: args.tags,
      websiteUrl: args.websiteUrl,
      logoUrl: args.logoUrl,
      pricing: args.pricing,
      upvotes: 0,
      submittedBy: args.userId,
      approved: false, // Requires admin approval
      createdAt: Date.now(),
      isNew: true,
    });
  },
});

export const approveTool = mutation({
  args: { toolId: v.id("tools") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.toolId, { approved: true });
  },
});

export const rejectTool = mutation({
  args: { toolId: v.id("tools") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.toolId);
  },
});

export const upvoteTool = mutation({
  args: { toolId: v.id("tools") },
  handler: async (ctx: any, args: any) => {
    const tool = await ctx.db.get(args.toolId);
    if (!tool) throw new Error("Tool not found");
    await ctx.db.patch(args.toolId, { upvotes: tool.upvotes + 1 });
  },
});
