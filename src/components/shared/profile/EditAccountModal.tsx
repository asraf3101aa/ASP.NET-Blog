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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useRepository } from "@/contexts/RepositoryContext";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";

const EditAccountModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, setUser, isLoading, setIsLoading, accountRepository } =
    useRepository()!;
  const [userToBeUpdated, setUserToBeUpdated] = useState<
    AccountModels[AccountModelsType.USER]
  >(user!);

  const handleUpdate = () => {
    setIsLoading(true);
    accountRepository
      .userUpdate(userToBeUpdated)
      .then((updateResponse) => {
        if (typeof updateResponse === "string") {
          setUser({
            ...userToBeUpdated,
            firstName: userToBeUpdated.firstName,
            lastName: userToBeUpdated.lastName,
          });
        } else {
          console.error(updateResponse);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
        setIsOpen(false);
      });
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
          </Box>
        </DialogContent>
        {isLoading ? (
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
  );
};

export default EditAccountModal;
