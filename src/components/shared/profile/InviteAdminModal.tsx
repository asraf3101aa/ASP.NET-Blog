import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRepository } from "@/contexts/RepositoryContext";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { SuccessToast } from "../toasts/SuccessToast";
import { ErrorToast } from "../toasts/ErrorToast";

const InviteAdminModal = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountModels[AccountModelsType.ACCOUNT_REGISTER]>();

  const { adminRepository } = useRepository()!;

  const onSubmit = async (
    data: AccountModels[AccountModelsType.ACCOUNT_REGISTER]
  ) => {
    try {
      const response = await adminRepository.register(data);
      if (typeof response === "string") {
        SuccessToast({ Message: response });
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      ErrorToast({ Message: "Something Went Wrorng!" });
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Invite Admin
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Invite New Admin</DialogTitle>
        <DialogContent>
          <form style={{ marginTop: "10px" }} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={!!errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={!!errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InviteAdminModal;
