import { useForm, SubmitHandler } from "react-hook-form";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { RoutePath } from "@/@enums/router.enum";
import { AccountModels } from "@/@types/account";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import BlogLoginBg from "/assets/images/BlogLoginBg.jpg";
import {
  AccountModelsType,
  RetrieveEmailForAction,
} from "@/@enums/account.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import { LocalStorageItemsKeys } from "@/@enums/storage.enum";
import MiniFooter from "@/components/shared/navigation/MiniFooter";
import { useEffect, useState } from "react";
import RetrieveEmailModal from "@/components/shared/profile/RetrieveEmailModal";
import { ErrorToast } from "@/components/shared/toasts/ErrorToast";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AccountModels[AccountModelsType.USER_LOGIN]>();

  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const {
    isAppDataLoading,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    accountRepository,
  } = useRepository()!;
  const [dataLoadingFlags] = useState({ ...repositoryDataLoadingFlags });

  useEffect(() => {
    const accessToken = localStorageClient.getAccessToken();
    if (accessToken) {
      handleRedirect(RoutePath.PROFILE);
    }
  }, [handleRedirect, localStorageClient]);

  const onSubmit: SubmitHandler<
    AccountModels[AccountModelsType.USER_LOGIN]
  > = async (data) => {
    setRepositoryDataLoadingFlags({
      ...dataLoadingFlags,
      isAccountRepositoryDataLoading: true,
    });
    accountRepository
      .login(data)
      .then(
        (
          userSignInResponse: ApiResponse<
            AccountModels[AccountModelsType.AUTH_TOKEN]
          >
        ) => {
          if (LocalStorageItemsKeys.ACCESS_TOKEN in userSignInResponse) {
            localStorageClient.setAccessToken(userSignInResponse);
            setRepositoryDataLoadingFlags({
              ...dataLoadingFlags,
              isAccountRepositoryDataLoading: false,
            });
            handleRedirect(RoutePath.PROFILE);
          } else {
            setError("password", {
              message: userSignInResponse.errors[0].message,
            });
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
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: `url(${BlogLoginBg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={4}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  fullWidth
                  autoComplete="email"
                />
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email.message}</p>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  fullWidth
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password.message}</p>
                )}
              </Grid>
            </Grid>
            {isAppDataLoading ? (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
              >
                <img src="/assets/icons/Loading.svg" alt="Loading" />
              </Grid>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            )}

            <Grid container sx={{ alignItems: "center" }}>
              <Grid item xs>
                <RetrieveEmailModal
                  retrieveEmailFor={RetrieveEmailForAction.RESET_PASSWORD}
                />
              </Grid>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <MiniFooter />
      </Grid>
    </Grid>
  );
};

export default SignIn;
