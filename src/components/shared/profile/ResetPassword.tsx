import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useRepository } from "@/contexts/RepositoryContext";
import { useRouter } from "@/contexts/RouterContext";
import { RoutePath } from "@/@enums/router.enum";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

const ResetPassword = () => {
  const [isPasswordReset, setIsPasswordReset] = useState<boolean | undefined>(
    undefined
  );

  const params = useSearchParams();
  const token = params[0].get("token");
  const email = params[0].get("email");

  const {
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    accountRepository,
  } = useRepository()!;
  const [dataLoadingFlags] = useState({ ...repositoryDataLoadingFlags });

  const { handleRedirect } = useRouter()!;

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    if (email && token) {
      setRepositoryDataLoadingFlags({
        ...dataLoadingFlags,
        isAccountRepositoryDataLoading: true,
      });
      try {
        const response = await accountRepository.confirmPassword({
          token,
          email,
          password,
          confirmPassword,
        });

        if (typeof response === "string") {
          setIsPasswordReset(true);
        } else {
          setIsPasswordReset(false);
        }
      } catch (error) {
        console.error(error);
        setIsPasswordReset(false);
      } finally {
        setRepositoryDataLoadingFlags({
          ...dataLoadingFlags,
          isAccountRepositoryDataLoading: false,
        });
      }
    }
  };

  const onClose = () => handleRedirect(RoutePath.HOME);

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle sx={{ px: 8 }}>
        Reset Password
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isPasswordReset === undefined ? (
          <Stack spacing={2} justifyContent="center" alignItems="center" mt={1}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: "Confirm Password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Stack>
        ) : (
          <>
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              style={{ minHeight: "150px" }}
            >
              {isPasswordReset ? (
                <>
                  <CheckCircleOutline
                    color="success"
                    style={{ fontSize: 64 }}
                  />
                  <Typography variant="body1">
                    Password Reset Successfully
                  </Typography>
                </>
              ) : (
                <>
                  <HighlightOff color="error" style={{ fontSize: 64 }} />
                  <Typography variant="body1">Password Reset Failed</Typography>
                </>
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ padding: "16px" }}
            >
              <Button variant="contained" color="primary" onClick={onClose}>
                Return to Home
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
