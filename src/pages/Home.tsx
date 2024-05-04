import { AccountModelsType } from "@/@enums/account.enum";
import { BlogsDurationFilters, BlogsSortingFilters } from "@/@enums/blog.enum";
import { UserRoles } from "@/@enums/storage.enum";
import { AccountModels } from "@/@types/account";
import { AdminDashboardData } from "@/@types/admin";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import Blog from "@/components/Blog";
import { useRepository } from "@/contexts/RepositoryContext";
import { useStorage } from "@/contexts/StorageContext";
import _ from "lodash";
import { useEffect } from "react";

const Home = () => {
  const localStorageClient = useStorage()!;
  const {
    isLoading,
    blogRepository,
    adminRepository,
    accountRepository,
    setUser,
    setBlogs,
    setIsLoading,
    setCategories,
    setHomepageBlogs,
    setDashboardData,
  } = useRepository()!;

  useEffect(() => {
    const accessToken = localStorageClient.getAccessToken();
    if (accessToken) {
      setIsLoading(true);
      accountRepository
        .getProfile()
        .then(
          (
            profileDataResponse: ApiResponse<
              AccountModels[AccountModelsType.USER]
            >
          ) => {
            if ("errors" in profileDataResponse) {
              console.error(profileDataResponse);
            } else {
              setUser(profileDataResponse);

              blogRepository
                .getHomepageBlogs(BlogsSortingFilters.RECENCY, 1)
                .then((blogs) => {
                  if ("errors" in blogs) {
                    console.error(blogs);
                  } else {
                    setHomepageBlogs(blogs);
                  }
                })
                .catch((error) => console.error(error));

              blogRepository
                .getCategories()
                .then((categories) => {
                  if ("errors" in categories) {
                    console.error(categories);
                  } else setCategories(categories);
                })
                .catch((error) => console.error(error));

              const userRole = getRoleFromJwtToken(accessToken);
              if (_.isEqual(userRole, UserRoles.BLOGGER)) {
                blogRepository
                  .getBlogs(1)
                  .then((blogs) => {
                    if ("errors" in blogs) {
                      console.error(blogs);
                    } else setBlogs(blogs);
                  })
                  .catch((error) => console.error(error));
              } else {
                adminRepository
                  .getDashboardData(BlogsDurationFilters.MONTHLY, 3)
                  .then((data: ApiResponse<AdminDashboardData>) => {
                    if ("errors" in data) {
                      console.error(data);
                    } else setDashboardData(data);
                  })
                  .catch((error) => console.error(error));
              }
            }
          }
        )
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [
    accountRepository,
    adminRepository,
    blogRepository,
    localStorageClient,
    setBlogs,
    setCategories,
    setDashboardData,
    setHomepageBlogs,
    setIsLoading,
    setUser,
  ]);

  return isLoading ? (
    <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
  ) : (
    <Blog />
  );
};

export default Home;
