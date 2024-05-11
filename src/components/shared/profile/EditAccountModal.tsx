import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  InputLabel,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useRepository } from "@/contexts/RepositoryContext";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";
import { useRouter } from "@/contexts/RouterContext";
import { useForm } from "react-hook-form";

const EditAccountModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    isAppDataLoading,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    accountRepository,
  } = useRepository()!;
  const [dataLoadingFlags] = useState({ ...repositoryDataLoadingFlags });

  const { handleReload } = useRouter()!;
  const { register, handleSubmit, setValue } = useForm<
    AccountModels[AccountModelsType.USER]
  >({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatar: "",
    },
  });

  const handleUpdate = (data: AccountModels[AccountModelsType.USER]) => {
    setRepositoryDataLoadingFlags({
      ...dataLoadingFlags,
      isAccountRepositoryDataLoading: true,
    });

    const updatedFormData = new FormData();
    updatedFormData.append("firstName", data.firstName);

    if (data.lastName) {
      updatedFormData.append("lastName", data.lastName);
    }
    if (data.avatar) {
      updatedFormData.append("avatar", data.avatar);
    }

    accountRepository
      .userUpdate(updatedFormData)
      .then((updateResponse) => {
        if (typeof updateResponse === "string") {
          SuccessToast({ Message: updateResponse });
          setTimeout(() => {
            handleReload();
          }, 1000);
        } else {
          console.error(updateResponse);
        }
      })
      .catch((error) => {
        console.error(error);
        ErrorToast({ Message: "Something went wrong!" });
      })
      .finally(() => {
        setRepositoryDataLoadingFlags({
          ...dataLoadingFlags,
          isAccountRepositoryDataLoading: false,
        });
        setIsOpen(false);
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file);
    }
  };

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <Tooltip title="Edit Account" arrow placement="right">
          <Edit sx={{ color: "#1976d2" }} />
        </Tooltip>
      </IconButton>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Edit User Information</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField label="First Name" required {...register("firstName")} />
            <TextField label="Last Name" {...register("lastName")} />
            <Box>
              <InputLabel>Profile Picture</InputLabel>
              <Box
                sx={{
                  my: 1,
                  p: 1,
                  border: 1,
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        {isAppDataLoading ? (
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(handleUpdate)} color="primary">
              Update
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default EditAccountModal;
