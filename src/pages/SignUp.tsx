import { useForm, SubmitHandler } from "react-hook-form";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import _ from "lodash";
import { RoutePath } from "@/@enums/router.enum";
import { AccountModels } from "@/@types/account";
import { useRouter } from "@/contexts/RouterContext";
import BlogLoginBg from "/assets/images/BlogLoginBg.jpg";
import { AccountModelsType } from "@/@enums/account.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import MiniFooter from "@/components/shared/navigation/MiniFooter";
import { useStorage } from "@/contexts/StorageContext";
import { useEffect } from "react";

const SignUp = () => {
  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const { isLoading, setIsLoading, accountRepository } = useRepository()!;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AccountModels[AccountModelsType.USER_REGISTER]>();

  useEffect(() => {
    const accessToken = localStorageClient.getAccessToken();
    if (accessToken) {
      handleRedirect(RoutePath.PROFILE);
    }
  }, [handleRedirect, localStorageClient]);

  const onSubmit: SubmitHandler<
    AccountModels[AccountModelsType.USER_REGISTER]
  > = async (data) => {
    setIsLoading(true);
    accountRepository
      .register(data)
      .then((userSignUpResponse: ApiResponse<string>) => {
        if (typeof userSignUpResponse === "string") {
          setIsLoading(false);
          handleRedirect(RoutePath.LOGIN);
        } else {
          _.map(userSignUpResponse.errors, (error: ApiErrorLog) => {
            setError(error.title as ErrorKey, {
              message: error.message,
            });
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0px !important",
        maxWidth: "100% !important",
        backgroundImage: `url(${BlogLoginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          marginTop: 8,
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem 0",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  fullWidth
                  autoComplete="given-name"
                  autoFocus
                />
                {errors.firstName && (
                  <p style={{ color: "red" }}>{errors.firstName.message}</p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  {...register("lastName")}
                  fullWidth
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p style={{ color: "red" }}>{errors.lastName.message}</p>
                )}
              </Grid>
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
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                  fullWidth
                />
                {errors.confirmPassword && (
                  <p style={{ color: "red" }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Grid>
            </Grid>
            {isLoading ? (
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
                Sign Up
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <MiniFooter />
    </Container>
  );
};

export default SignUp;
