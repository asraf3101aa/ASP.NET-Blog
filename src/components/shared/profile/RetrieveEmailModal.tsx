import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AccountModels } from "@/@types/account";
import {
  AccountModelsType,
  RetrieveEmailForAction,
} from "@/@enums/account.enum";
import { useRepository } from "@/contexts/RepositoryContext";

const RetrieveEmailModal = (props: {
  retrieveEmailFor: RetrieveEmailForAction;
}) => {
  const retrieveEmailForAction = props.retrieveEmailFor;
  const isEmailForChangeEmail =
    retrieveEmailForAction === RetrieveEmailForAction.CHANGE_EMAIL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountModels[AccountModelsType.EMAIL_MODEL]>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isLoading, setIsLoading, accountRepository } = useRepository()!;

  const onSubmit: SubmitHandler<
    AccountModels[AccountModelsType.EMAIL_MODEL]
  > = async (data) => {
    try {
      setIsLoading(true);
      // Simulate forgot password request
      if (isEmailForChangeEmail) {
        await accountRepository.updateEmail(data.email);
      } else {
        await accountRepository.sendForgotPasswordRequest(data.email);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        {retrieveEmailForAction}
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>
          {retrieveEmailForAction}
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            {`Enter your email address to receive ${
              isEmailForChangeEmail ? "an email change" : "password reset"
            } link.`}
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </form>
        </DialogContent>
        {isLoading ? (
          <Container sx={{ display: "flex", justifyContent: "end", py: 1 }}>
            <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
          </Container>
        ) : (
          <DialogActions>
            <Button onClick={() => setIsOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} color="primary">
              Submit
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default RetrieveEmailModal;
