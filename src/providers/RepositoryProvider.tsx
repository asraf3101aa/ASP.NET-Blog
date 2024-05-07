import { useEffect, useState } from "react";
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
import { BlogModelsType, BlogsDurationFilters } from "@/@enums/blog.enum";
import { AdminDashboardData, DashboardDataFilters } from "@/@types/admin";
import { RepositoryDataLoadingFlags } from "@/@types/repository";

/**
 * RepositoryProvider: A component to provide Repository context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
const RepositoryProvider = ({ children }: ProviderProps) => {
  const [blogs, setBlogs] = useState<
    BlogModels[BlogModelsType.BLOGS_LIST] | null
  >(null);
  const [user, setUser] = useState<
    AccountModels[AccountModelsType.USER] | null
  >(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  );
  const [homepageBlogsData, setHomepageBlogsData] = useState<
    BlogModels[BlogModelsType.BLOGS_LIST] | null
  >(null);
  const [blogDetails, setBlogDetails] = useState<
    BlogModels[BlogModelsType.BLOG] | null
  >(null);
  const [categories, setCategories] = useState<
    BlogModels[BlogModelsType.CATEGORY][]
  >([]);

  const [dashboardDataFilters, setDashboardDataFilters] =
    useState<DashboardDataFilters>({
      duration: BlogsDurationFilters.ALL,
      month: undefined,
    });

  const [repositoryDataLoadingFlags, setRepositoryDataLoadingFlags] =
    useState<RepositoryDataLoadingFlags>({
      isAccountRepositoryDataLoading: false,
      isAdminRepositoryDataLoading: false,
      isBlogRepositoryDataLoading: false,
    });

  const [isAppDataLoading, setIsAppDataLoading] = useState<boolean>(false);
  useEffect(() => {
    if (repositoryDataLoadingFlags) {
      console.log(repositoryDataLoadingFlags);
      setIsAppDataLoading(
        repositoryDataLoadingFlags.isAccountRepositoryDataLoading ||
          repositoryDataLoadingFlags.isAdminRepositoryDataLoading ||
          repositoryDataLoadingFlags.isBlogRepositoryDataLoading
      );
    }
  }, [repositoryDataLoadingFlags]);

  // Create a shared context value
  const shared: RepositoryProps = {
    isAppDataLoading,
    setIsAppDataLoading,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    homepageBlogsData,
    setHomepageBlogsData,
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
    dashboardDataFilters,
    setDashboardDataFilters,
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
