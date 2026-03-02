export const api: any = {
  tools: {
    getTools: "tools:getTools",
    getToolBySlug: "tools:getToolBySlug",
    getFeaturedTools: "tools:getFeaturedTools",
    getSubmittedTools: "tools:getSubmittedTools",
    getPendingTools: "tools:getPendingTools",
    submitTool: "tools:submitTool",
    approveTool: "tools:approveTool",
    rejectTool: "tools:rejectTool",
    upvoteTool: "tools:upvoteTool",
  },
  bookmarks: {
    getBookmarks: "bookmarks:getBookmarks",
    toggleBookmark: "bookmarks:toggleBookmark",
    isBookmarked: "bookmarks:isBookmarked",
  },
  reviews: {
    getReviews: "reviews:getReviews",
    addReview: "reviews:addReview",
  },
  seed: {
    seed: "seed:seed",
  }
};
