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
  CATEGORIES = "categories",
  UPDATE = "update",
  DELETE = "delete",
  REACTION = "reaction",
  COMMENT = "comment",
}
