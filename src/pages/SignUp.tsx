import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MiniFooter from "@/components/MiniFooter";
import { useRepository } from "@/contexts/RepositoryContext";
import { useRouter } from "@/contexts/RouterContext";
import { RoutePath } from "@/@enums/router.enum";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import _ from "lodash";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AccountModels[AccountModelsType.USER_REGISTER]>();
  const { accountRepository } = useRepository()!;
  const { handleRedirect } = useRouter()!;

  const onSubmit: SubmitHandler<
    AccountModels[AccountModelsType.USER_REGISTER]
  > = async (data) => {
    const userSignUpResponse: ApiResponse<string> =
      await accountRepository.register(data);

    if (typeof userSignUpResponse === "string") {
      handleRedirect(RoutePath.LOGIN);
    } else {
      _.map(userSignUpResponse.errors, (error: ApiErrorLog) => {
        setError(error.title as ErrorKey, {
          message: error.message,
        });
      });
    }
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
      }}
    >
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
                {errors.firstName && <p>{errors.firstName.message}</p>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  {...register("lastName")}
                  fullWidth
                  autoComplete="family-name"
                />
                {errors.lastName && <p>{errors.lastName.message}</p>}
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
                {errors.email && <p>{errors.email.message}</p>}
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
                {errors.password && <p>{errors.password.message}</p>}
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
                  <p>{errors.confirmPassword.message}</p>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
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
}
