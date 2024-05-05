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
import { useRepository } from "@/contexts/RepositoryContext";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";

const ChangePasswordModal = () => {
  const { accountRepository, setIsLoading } = useRepository()!;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState<
    boolean | undefined
  >(undefined);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AccountModels[AccountModelsType.CHANGE_PASSWORD]>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<
    AccountModels[AccountModelsType.CHANGE_PASSWORD]
  > = async (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await accountRepository.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (typeof response === "string") {
        setIsPasswordChanged(true);
      } else {
        setIsPasswordChanged(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setIsPasswordChanged(false);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        Change Password
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle sx={{ px: 10 }}>
          Change Password
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isPasswordChanged === undefined ? (
            <Stack
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              <Controller
                name="currentPassword"
                control={control}
                rules={{
                  required: "Current password is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Password"
                    type="password"
                    fullWidth
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                  />
                )}
              />
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "New password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type="password"
                    fullWidth
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm password is required",
                }}
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
                Change Password
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
                {isPasswordChanged ? (
                  <>
                    <CheckCircleOutline
                      color="success"
                      style={{ fontSize: 64 }}
                    />
                    <Typography variant="body1">
                      Password Changed Successfully
                    </Typography>
                  </>
                ) : (
                  <>
                    <HighlightOff color="error" style={{ fontSize: 64 }} />
                    <Typography variant="body1">
                      Password Change Failed
                    </Typography>
                  </>
                )}
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePasswordModal;
