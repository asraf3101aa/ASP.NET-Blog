import { useState } from "react";
import {
  blogRepository,
  adminRepository,
  accountRepository,
  RepositoryContext,
} from "@/contexts/RepositoryContext";
import { ProviderProps, RepositoryProps } from "@/@types/providers";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { AdminDashboardData } from "@/@types/admin";

/**
 * RepositoryProvider: A component to provide Repository context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
const RepositoryProvider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<BlogModels[BlogModelsType.BLOG][]>([]);
  const [user, setUser] = useState<
    AccountModels[AccountModelsType.USER] | null
  >(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  );
  const [homepageBlogs, setHomepageBlogs] = useState<
    BlogModels[BlogModelsType.BLOG][]
  >([]);
  const [blogDetails, setBlogDetails] = useState<
    BlogModels[BlogModelsType.BLOG] | null
  >(null);
  const [categories, setCategories] = useState<
    BlogModels[BlogModelsType.CATEGORY][]
  >([]);

  // Create a shared context value
  const shared: RepositoryProps = {
    isLoading,
    setIsLoading,
    homepageBlogs,
    setHomepageBlogs,
    user,
    setUser,
    blogs,
    setBlogs,
    blogDetails,
    setBlogDetails,
    dashboardData,
    setDashboardData,
    categories,
    setCategories,
    blogRepository,
    adminRepository,
    accountRepository,
  };

  // Provide the context value to its children
  return (
    <RepositoryContext.Provider value={shared}>
      {children}
    </RepositoryContext.Provider>
  );
};

export default RepositoryProvider;
