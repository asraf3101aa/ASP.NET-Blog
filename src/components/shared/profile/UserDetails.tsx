import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { AccountModels } from "@/@types/account";
import {
  AccountModelsType,
  RetrieveEmailForAction,
} from "@/@enums/account.enum";
import { useStorage } from "@/contexts/StorageContext";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { useRepository } from "@/contexts/RepositoryContext";
import { PersonRounded } from "@mui/icons-material";
import { useRouter } from "@/contexts/RouterContext";
import { RoutePath } from "@/@enums/router.enum";
import DeleteResourceModal from "./DeleteResourceModal";
import EditAccountModal from "./EditAccountModal";
import RetrieveEmailModal from "./RetrieveEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { DeleteModalType } from "@/@enums/components.enum";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";

// A function to display a single detail
const UserDetail = ({ title, value }: { title: string; value: string }) => (
  <Box display="flex" justifyContent="flex-start">
    <Typography variant="body1" fontWeight="bold">
      {title}:
    </Typography>
    <Typography variant="body1" marginLeft={1}>
      {value}
    </Typography>
  </Box>
);

// The UserDetails component to display user information
const UserDetails = ({
  user,
}: {
  user: AccountModels[AccountModelsType.USER];
}) => {
  const localStorageClient = useStorage()!;
  const role = getRoleFromJwtToken(localStorageClient.getAccessToken()!);
  const { isLoading, setIsLoading, accountRepository } = useRepository()!;
  const { handleRedirect } = useRouter()!;

  const handleResendMail = async () => {
    setIsLoading(true);
    accountRepository
      .confirmEmailResend()
      .then((confirmResponse) => {
        if (typeof confirmResponse === "string") {
          SuccessToast({ Message: confirmResponse });
        }
      })
      .catch((error) => {
        console.error(error);
        ErrorToast({ Message: "Something went wrong!" });
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    accountRepository
      .deleteAccount()
      .then((deleteResponse) => {
        if (typeof deleteResponse === "string") {
          localStorageClient.clearLocalStorage();
          handleRedirect(RoutePath.LOGIN);
        }
      })
      .catch((error) => {
        console.error(error);
        ErrorToast({ Message: "Something went wrong!" });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Box
      key={user.id}
      padding={2}
      border={1}
      borderRadius={2}
      borderColor="lightgray"
      sx={{ display: "flex", gap: 1, minWidth: "75%", alignItems: "start" }}
    >
      <Box
        sx={{
          width: "120px",
        }}
      >
        <PersonRounded sx={{ width: "100%", height: "100%" }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <UserDetail title="Name" value={`${user.firstName} ${user.lastName}`} />
        <UserDetail title="Role" value={role} />
        <UserDetail title="Email" value={user.email} />
        <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
          {isLoading ? (
            <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
          ) : (
            <>
              <EditAccountModal />
              <DeleteResourceModal
                resourceType={DeleteModalType.ACCOUNT}
                onDelete={handleDeleteAccount}
              />
              <RetrieveEmailModal
                retrieveEmailFor={RetrieveEmailForAction.CHANGE_EMAIL}
              />
              <ChangePasswordModal />
              {!user.emailConfirmed && (
                <Button variant="outlined" onClick={handleResendMail}>
                  Resend Verification Mail
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetails;
