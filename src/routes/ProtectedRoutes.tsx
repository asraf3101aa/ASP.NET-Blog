import { RoutePath } from "@/@enums/router.enum";
import { Navigate, Outlet } from "react-router-dom";
import { useStorage } from "@/contexts/StorageContext";
import { useRepository } from "@/contexts/RepositoryContext";
import { useEffect, useState } from "react";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { UserRoles } from "@/@enums/storage.enum";
import { AdminDashboardData } from "@/@types/admin";
import _ from "lodash";
import { Container } from "@mui/material";
import { useRouter } from "@/contexts/RouterContext";
import { ErrorToast } from "@/components/shared/toasts/ErrorToast";

const ProtectedRoutes = () => {
  const localStorageClient = useStorage()!;
  const accessToken = localStorageClient.getAccessToken();
  const {
    blogs,
    blogRepository,
    adminRepository,
    isAppDataLoading,
    accountRepository,
    dashboardDataFilters,
    repositoryDataLoadingFlags,
    setUser,
    setBlogs,
    setCategories,
    setDashboardData,
    setHomepageBlogsData,
    setRepositoryDataLoadingFlags,
  } = useRepository()!;

  const [dataLoadingFlags] = useState({ ...repositoryDataLoadingFlags });

  const { handleRedirect } = useRouter()!;
  useEffect(() => {
    try {
      const accessToken = localStorageClient.getAccessToken();
      if (accessToken) {
        setRepositoryDataLoadingFlags({
          isAdminRepositoryDataLoading: true,
          isBlogRepositoryDataLoading: true,
          isAccountRepositoryDataLoading: true,
        });

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
                  .getCategories()
                  .then((categories) => {
                    if ("errors" in categories) {
                      console.error(categories);
                    } else setCategories(categories);
                  })
                  .finally(() =>
                    setRepositoryDataLoadingFlags({
                      ...dataLoadingFlags,
                      isBlogRepositoryDataLoading: false,
                    })
                  );

                const userRole = getRoleFromJwtToken(accessToken);
                if (_.isEqual(userRole, UserRoles.BLOGGER)) {
                  setRepositoryDataLoadingFlags({
                    ...dataLoadingFlags,
                    isBlogRepositoryDataLoading: true,
                  });
                  blogRepository
                    .getBlogs(blogs?.paginationMetaData.pageNumber ?? 1)
                    .then((blogs) => {
                      if ("errors" in blogs) {
                        console.error(blogs);
                      } else setBlogs(blogs);
                    })
                    .finally(() =>
                      setRepositoryDataLoadingFlags({
                        ...dataLoadingFlags,
                        isBlogRepositoryDataLoading: false,
                      })
                    );
                } else {
                  setRepositoryDataLoadingFlags({
                    ...dataLoadingFlags,
                    isAdminRepositoryDataLoading: true,
                  });
                  adminRepository
                    .getDashboardData(
                      dashboardDataFilters.duration,
                      dashboardDataFilters.month
                    )
                    .then((data: ApiResponse<AdminDashboardData>) => {
                      if ("errors" in data) {
                        console.error(data);
                      } else setDashboardData(data);
                    })
                    .finally(() =>
                      setRepositoryDataLoadingFlags({
                        ...dataLoadingFlags,
                        isAdminRepositoryDataLoading: false,
                      })
                    );
                }
              }
            }
          )
          .catch((error) => {
            console.error(error);
            ErrorToast({ Message: "Something went wrong!" });
          })
          .finally(() =>
            setRepositoryDataLoadingFlags({
              ...dataLoadingFlags,
              isAccountRepositoryDataLoading: false,
            })
          );
      }
    } catch (error) {
      console.error(error);
      handleRedirect(RoutePath.LOGIN);
    }
  }, [
    blogs?.paginationMetaData.pageNumber,
    accountRepository,
    adminRepository,
    blogRepository,
    localStorageClient,
    dashboardDataFilters,
    setBlogs,
    setCategories,
    setDashboardData,
    setHomepageBlogsData,
    setRepositoryDataLoadingFlags,
    setUser,
    handleRedirect,
    dataLoadingFlags,
  ]);
  return (
    <>
      {isAppDataLoading ? (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
        </Container>
      ) : accessToken ? (
        <Outlet />
      ) : (
        <Navigate to={RoutePath.LOGIN} replace />
      )}
    </>
  );
};

export default ProtectedRoutes;
