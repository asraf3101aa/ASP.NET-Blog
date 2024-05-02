import { ReactionType, BlogImageType } from "@/@enums/blog.enum";

// Base Category type
type Category = {
  id: number; // Unique identifier for the category
  name: string; // Name of the category
};

// Base BlogImage type
type BlogImage = {
  id: number; // Unique identifier for the blog image
  blogId: number; // Foreign key to the blog
  path: string; // Path to the image
  imageType: BlogImageType; // Type of the blog image (e.g., Banner, Body)
};

// Base Reaction type
type Reaction = {
  id: number; // Unique identifier for the reaction
  type: ReactionType; // Reaction type (e.g., Upvote, Downvote)
  userId: string; // Foreign key to the user
  user: User; // Reference to the user
  blogId?: number; // Optional foreign key to the blog
  blog?: Blog; // Optional reference to the blog
  commentId?: number; // Optional foreign key to the comment
  comment?: Comment; // Optional reference to the comment
};

// Base Comment type
type Comment = {
  id: number; // Unique identifier for the comment
  text: string; // Content of the comment
  userId: string; // Foreign key to the user
  user: User; // Reference to the user
  blogId: number; // Foreign key to the blog
  blog: Blog; // Reference to the blog
  reactions: Reaction[]; // Collection of reactions on the comment
  createdAt: Date; // Timestamp when the comment was created
  updatedAt: Date; // Timestamp when the comment was last updated
};

// Base Blog type
type Blog = {
  id: number; // Unique identifier for the blog
  title: string; // Title of the blog
  body: string; // Body content of the blog
  authorId: string; // Foreign key to the author (User)
  author: User; // Reference to the author
  images: BlogImage[]; // Collection of associated blog images
  comments: Comment[]; // Collection of associated comments
  reactions: Reaction[]; // Collection of associated reactions
  createdAt: Date; // Timestamp when the blog was created
  updatedAt: Date; // Timestamp when the blog was last updated
  categoryId: number; // Foreign key to the category
  category: Category; // Reference to the category
};

type BlogStats = {
  blogCount: number; // Number of blogs
  upvoteCount: number; // Total upvotes across all blogs
  downvoteCount: number; // Total downvotes across all blogs
  commentCount: number; // Total comments across all blogs
};

// Type for Blog models, gathering all other types
export type BlogModels = {
  Category: Category;
  BlogImage: BlogImage;
  Reaction: Reaction;
  Comment: Comment;
  Blog: Blog;
  BlogStats: BlogStats;
};
