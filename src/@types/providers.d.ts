import { AccountModelsType } from "@/@enums/account.enum";
import { AccountModels } from "./account";
import {
  IAccountRepository,
  IAdminRepository,
  IBlogRepository,
  INotificationsRepository,
  RepositoryDataLoadingFlags,
} from "./repository";
import { BlogModels } from "./blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { AdminDashboardData, DashboardDataFilters } from "./admin";

/**
 * ProviderProps: Represents props for a provider component.
 *
 * Props:
 * - children: A React node representing the children components.
 */
declare type ProviderProps = {
  children: React.ReactNode;
};

/**
 * RouterProps: Represents the props of the router context.
 *
 * Properties:
 * - handleReload: A function to handle navigation back.
 * - handleRedirect: A function to handle navigation redirection.
 */
declare type RouterProps = {
  handleReload: () => void;
  handleRedirect: (route: string) => void;
};

/**
 * RepositoryProps: Represents the props of the Repository context.
 *
 * Properties:
 * - fetchAPI: An instance of IFetchAPI to handle API calls.
 */
declare type RepositoryProps = {
  isAppDataLoading: boolean;
  setIsAppDataLoading: (loading: boolean) => void;
  repositoryDataLoadingFlags: RepositoryDataLoadingFlags;
  setRepositoryDataLoadingFlags: (flags: RepositoryDataLoadingFlags) => void;

  user: AccountModels[AccountModelsType.USER] | null;
  setUser: (user: AccountModels[AccountModelsType.USER]) => void;
  blogs: BlogModels[BlogModelsType.BLOGS_LIST] | null;
  setBlogs: (blogs: BlogModels[BlogModelsType.BLOGS_LIST]) => void;
  blogDetails: BlogModels[BlogModelsType.BLOG] | null;
  setBlogDetails: (blog: BlogModels[BlogModelsType.BLOG]) => void;
  categories: BlogModels[BlogModelsType.CATEGORY][];
  setCategories: (categories: BlogModels[BlogModelsType.CATEGORY][]) => void;

  dashboardData: AdminDashboardData | null;
  setDashboardData: (data: AdminDashboardData) => void;
  homepageBlogsData: BlogModels[BlogModelsType.BLOGS_LIST] | null;
  setHomepageBlogsData: (blogs: BlogModels[BlogModelsType.BLOGS_LIST]) => void;
  dashboardDataFilters: DashboardDataFilters;
  setDashboardDataFilters: (dashboardDataFilters: DashboardDataFilters) => void;

  accountRepository: IAccountRepository;
  adminRepository: IAdminRepository;
  blogRepository: IBlogRepository;
  notificationsRepository: INotificationsRepository;
};
