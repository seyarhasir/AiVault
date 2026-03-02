import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tools: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    pricing: v.string(), // "Free", "Freemium", "Paid"
    pricingDetails: v.optional(v.string()), // e.g. "Free tier available. Pro from $20/mo"
    upvotes: v.number(),
    submittedBy: v.string(), // userId
    approved: v.boolean(),
    createdAt: v.number(),
    featured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),

    // Rich fields
    features: v.optional(v.array(v.string())),
    useCases: v.optional(v.array(v.string())),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    platforms: v.optional(v.array(v.string())), // "Web", "iOS", "Android", "Desktop", "API", "Chrome Extension"
    lastUpdated: v.optional(v.string()), // "March 2026", "February 2026"
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    discordUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_approved", ["approved"])
    .index("by_submittedBy", ["submittedBy"])
    .index("by_upvotes", ["upvotes"])
    .index("by_createdAt", ["createdAt"]),

  bookmarks: defineTable({
    userId: v.string(),
    toolId: v.id("tools"),
  })
    .index("by_userId", ["userId"])
    .index("by_toolId", ["toolId"])
    .index("by_userId_and_toolId", ["userId", "toolId"]),

  reviews: defineTable({
    userId: v.string(),
    toolId: v.id("tools"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_toolId", ["toolId"])
    .index("by_userId", ["userId"]),
});
