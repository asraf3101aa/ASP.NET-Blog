import { AccountModels } from "./account";
import { AccountModelsType } from "@/@enums/account.enum";
import { BlogModels } from "./blog";
import { BlogModelsType } from "@/@enums/blog.enum";

// Type representing data for admin dashboard
export type AdminDashboardData = {
  blogStats: BlogModels[BlogModelsType.BLOG_STATS];
  popularBlogs: BlogModels[BlogModelsType.BLOG][];
  popularBlogger: AccountModels[AccountModelsType.POPULAR_BLOGGER][];
};
