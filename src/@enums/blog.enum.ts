// Enum for identifying different types within BlogModels with all-caps keys
export enum BlogModelsType {
  CATEGORY = "Category", // Represents the Category model
  BLOG_IMAGE = "BlogImage", // Represents the BlogImage model
  REACTION = "Reaction", // Represents the Reaction model
  COMMENT = "Comment", // Represents the Comment model
  BLOG = "Blog", // Represents the Blog model
  BLOG_STATS = "BlogStats",
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
