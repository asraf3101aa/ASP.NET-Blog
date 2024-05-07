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
  Container,
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

const EditAccountModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    isAppDataLoading,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    accountRepository,
  } = useRepository()!;
  const [userToBeUpdated, setUserToBeUpdated] = useState<
    AccountModels[AccountModelsType.USER]
  >(user!);

  const { handleReload } = useRouter()!;

  const handleUpdate = () => {
    setRepositoryDataLoadingFlags({
      ...repositoryDataLoadingFlags,
      isAccountRepositoryDataLoading: true,
    });
    const updatedFormData = new FormData();
    updatedFormData.append("firstName", userToBeUpdated.firstName);
    if (userToBeUpdated.lastName) {
      updatedFormData.append("lastName", userToBeUpdated.lastName);
    }
    if (userToBeUpdated.avatar) {
      updatedFormData.append("avatar", userToBeUpdated.avatar);
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
          ...repositoryDataLoadingFlags,
          isAccountRepositoryDataLoading: false,
        });
        setIsOpen(false);
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setUserToBeUpdated({ ...userToBeUpdated, avatar: file });
      }
    }
  };
  return (
    user?.emailConfirmed && (
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
              <TextField
                label="First Name"
                value={userToBeUpdated.firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserToBeUpdated({
                    ...userToBeUpdated,
                    firstName: e.target.value,
                  })
                }
              />
              <TextField
                label="Last Name"
                value={userToBeUpdated.lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserToBeUpdated({
                    ...userToBeUpdated,
                    lastName: e.target.value,
                  })
                }
              />
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
                    value={""}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          {isAppDataLoading ? (
            <Container sx={{ display: "flex", justifyContent: "end", py: 2 }}>
              <img src="/assets/icons/Loading.svg" />
            </Container>
          ) : (
            <DialogActions>
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} color="primary">
                Update
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </>
    )
  );
};

export default EditAccountModal;
