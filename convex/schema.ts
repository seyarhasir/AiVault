import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tools: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    pricing: v.string(), // "Free", "Freemium", "Paid"
    upvotes: v.number(),
    submittedBy: v.string(), // userId
    approved: v.boolean(),
    createdAt: v.number(),
    featured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
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
