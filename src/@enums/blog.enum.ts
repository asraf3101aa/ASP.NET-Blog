// Enum for identifying different types within BlogModels with all-caps keys
export enum BlogModelsType {
  CATEGORY = "Category",
  BLOG_IMAGE = "BlogImage",
  REACTION = "Reaction",
  COMMENT = "Comment",
  BLOG = "Blog",
  BLOG_STATS = "BlogStats",
  BLOGS_LIST = "BlogsList",
  BLOG_PARTIAL_DATA = "BlogPartialData",
}

// Enum representing different image files
export enum BlogImageType {
  Banner = 0,
  Body = 1,
}

// Enum representing different types of reactions
export enum ReactionType {
  Upvote = 0,
  Downvote = 1,
}

// Enum representing different endpoints of blog controller
export enum BlogEndpointPaths {
  HOMEPAGE_BLOGS = "list",
  CATEGORIES = "categories",
  REACTION = "reaction",
  COMMENT = "comment",
}

export enum BlogStatsData {
  BLOG_COUNT = "Blog Count",
  COMMENT_COUNT = "Comment Count",
  DOWN_VOTE_COUNT = "Downvote Count",
  UP_VOTE_COUNT = "Upvote Count",
}

export enum BlogsDurationFilters {
  ALL = "all",
  MONTHLY = "monthly",
}

export enum BlogsSortingFilters {
  ALL = "all",
  RECENCY = "recency",
}
