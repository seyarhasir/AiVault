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

export const getRelatedTools = query({
  args: { category: v.string(), excludeSlug: v.string() },
  handler: async (ctx: any, args: any) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q: any) => q.eq("approved", true))
      .collect();
    return tools
      .filter((t: any) => t.category === args.category && t.slug !== args.excludeSlug)
      .sort((a: any, b: any) => b.upvotes - a.upvotes)
      .slice(0, 4);
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
    longDescription: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    pricing: v.string(),
    pricingDetails: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    useCases: v.optional(v.array(v.string())),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    platforms: v.optional(v.array(v.string())),
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    discordUrl: v.optional(v.string()),
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
      longDescription: args.longDescription,
      category: args.category,
      tags: args.tags,
      websiteUrl: args.websiteUrl,
      logoUrl: args.logoUrl,
      pricing: args.pricing,
      pricingDetails: args.pricingDetails,
      features: args.features,
      useCases: args.useCases,
      pros: args.pros,
      cons: args.cons,
      platforms: args.platforms,
      twitterUrl: args.twitterUrl,
      githubUrl: args.githubUrl,
      discordUrl: args.discordUrl,
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

export const getStats = query({
  handler: async (ctx: any) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q: any) => q.eq("approved", true))
      .collect();

    const categories = new Set(tools.map((t: any) => t.category));
    const totalUpvotes = tools.reduce((sum: number, t: any) => sum + t.upvotes, 0);
    const featured = tools.filter((t: any) => t.featured);

    return {
      totalTools: tools.length,
      totalCategories: categories.size,
      totalFeatured: featured.length,
      totalUpvotes,
    };
  },
});

export const getAdminStats = query({
  handler: async (ctx: any) => {
    const allTools = await ctx.db.query("tools").collect();
    const approved = allTools.filter((t: any) => t.approved);
    const pending = allTools.filter((t: any) => !t.approved);
    const categories = new Set(approved.map((t: any) => t.category));
    const totalUpvotes = approved.reduce((sum: number, t: any) => sum + t.upvotes, 0);
    const featured = approved.filter((t: any) => t.featured);

    return {
      totalTools: allTools.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      totalCategories: categories.size,
      totalFeatured: featured.length,
      totalUpvotes,
    };
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
