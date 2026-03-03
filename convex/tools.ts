import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

const getAdminIds = () => (process.env.NEXT_PUBLIC_ADMIN_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

async function checkAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  if (!getAdminIds().includes(identity.subject)) {
    throw new Error("Unauthorized: Admin access required");
  }
  return identity;
}

async function getIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}


export const getTools = query({
  args: {
    category: v.optional(v.string()),
    pricing: v.optional(v.string()),
    search: v.optional(v.string()),
    sort: v.optional(v.string()), // "newest", "upvotes"
  },
  handler: async (ctx: QueryCtx, args: {
    category?: string;
    pricing?: string;
    search?: string;
    sort?: string;
  }) => {
    let toolsQuery;

    if (args.category && args.category !== "All") {
      toolsQuery = ctx.db
        .query("tools")
        .withIndex("by_category", (q) => q.eq("category", args.category!));
    } else {
      toolsQuery = ctx.db
        .query("tools")
        .withIndex("by_approved", (q) => q.eq("approved", true));
    }

    let tools = await toolsQuery.collect();

    // Secondary filters that don't have composite indices or are complex
    if (args.category && args.category !== "All") {
      // If we filtered by category first, we still need to filter by approved
      tools = tools.filter((t) => t.approved);
    }

    if (args.pricing && args.pricing !== "All") {
      tools = tools.filter((t) => t.pricing === args.pricing);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (args.sort === "upvotes") {
      tools.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      // default to newest
      tools.sort((a, b) => b.createdAt - a.createdAt);
    }

    return tools;
  },
});

export const getToolBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx: QueryCtx, args: { slug: string }) => {
    return await ctx.db
      .query("tools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getToolById = query({
  args: { toolId: v.id("tools") },
  handler: async (ctx: QueryCtx, args: { toolId: Id<"tools"> }) => {
    return await ctx.db.get(args.toolId);
  },
});

export const getRelatedTools = query({
  args: { category: v.string(), excludeSlug: v.string() },
  handler: async (ctx: QueryCtx, args: { category: string; excludeSlug: string }) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return tools
      .filter((t) => t.approved && t.slug !== args.excludeSlug)
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 4);
  },
});

export const getFeaturedTools = query({
  handler: async (ctx: QueryCtx) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .collect();
    return tools.filter((t) => t.featured).sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getSubmittedTools = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await getIdentity(ctx);
    return await ctx.db
      .query("tools")
      .withIndex("by_submittedBy", (q) => q.eq("submittedBy", identity.subject))
      .collect();
  },
});

export const getPendingTools = query({
  handler: async (ctx: QueryCtx) => {
    await checkAdmin(ctx);
    return await ctx.db
      .query("tools")
      .withIndex("by_approved", (q) => q.eq("approved", false))
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
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const identity = await getIdentity(ctx);
    const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Check if slug exists
    const existing = await ctx.db.query("tools").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const toolId = await ctx.db.insert("tools", {
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
      submittedBy: identity.subject,
      approved: false, // Requires admin approval
      createdAt: Date.now(),
      isNew: true,
    });

    return { toolId, slug: finalSlug };
  },
});

export const approveTool = mutation({
  args: {
    toolId: v.id("tools"),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx: MutationCtx, args: { toolId: Id<"tools">; sendEmail?: boolean }) => {
    await checkAdmin(ctx);
    await ctx.db.patch(args.toolId, { approved: true });
    return { success: true };
  },
});

export const rejectTool = mutation({
  args: {
    toolId: v.id("tools"),
    reason: v.optional(v.string()),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx: MutationCtx, args: { toolId: Id<"tools">; reason?: string; sendEmail?: boolean }) => {
    await checkAdmin(ctx);
    // Get tool data before deletion for email
    const tool = await ctx.db.get(args.toolId);
    await ctx.db.delete(args.toolId);
    return { success: true, tool, reason: args.reason };
  },
});

export const getStats = query({
  handler: async (ctx: QueryCtx) => {
    const approvedTools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .collect();

    const categories = new Set(approvedTools.map((t) => t.category));
    const totalUpvotes = approvedTools.reduce((sum, t) => sum + t.upvotes, 0);
    const featuredCount = approvedTools.filter((t) => t.featured).length;

    return {
      totalTools: approvedTools.length,
      totalCategories: categories.size,
      totalFeatured: featuredCount,
      totalUpvotes,
    };
  },
});

export const getAdminStats = query({
  handler: async (ctx: QueryCtx) => {
    await checkAdmin(ctx);

    // Get counts using indices where possible
    const approvedTools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .collect();

    const pendingTools = await ctx.db
      .query("tools")
      .withIndex("by_approved", (q) => q.eq("approved", false))
      .collect();

    const categories = new Set(approvedTools.map((t) => t.category));
    const totalUpvotes = approvedTools.reduce((sum, t) => sum + t.upvotes, 0);
    const featuredCount = approvedTools.filter((t) => t.featured).length;

    return {
      totalTools: approvedTools.length + pendingTools.length,
      approvedCount: approvedTools.length,
      pendingCount: pendingTools.length,
      totalCategories: categories.size,
      totalFeatured: featuredCount,
      totalUpvotes,
    };
  },
});

export const upvoteTool = mutation({
  args: { toolId: v.id("tools") },
  handler: async (ctx: MutationCtx, args: { toolId: Id<"tools"> }) => {
    const tool = await ctx.db.get(args.toolId);
    if (!tool) throw new Error("Tool not found");
    await ctx.db.patch(args.toolId, { upvotes: tool.upvotes + 1 });
  },
});
