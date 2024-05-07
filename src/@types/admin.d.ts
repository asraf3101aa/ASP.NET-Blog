import { AccountModels } from "./account";
import { AccountModelsType } from "@/@enums/account.enum";
import { BlogModels } from "./blog";
import { BlogModelsType, BlogsDurationFilters } from "@/@enums/blog.enum";

export type DashboardDataFilters = {
  duration: BlogsDurationFilters;
  month?: number;
};

// Type representing data for admin dashboard
export type AdminDashboardData = {
  duration: BlogsDurationFilters;
  month: number;
  blogStats: BlogModels[BlogModelsType.BLOG_STATS];
  popularBlogs: BlogModels[BlogModelsType.BLOG][];
  popularBlogger: AccountModels[AccountModelsType.POPULAR_BLOGGER][];
};
