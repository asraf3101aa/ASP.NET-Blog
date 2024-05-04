import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { useStorage } from "@/contexts/StorageContext";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";

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
  const handleResendMail = () => {};
  return (
    <Box
      key={user.id}
      padding={2}
      border={1}
      borderRadius={2}
      borderColor="lightgray"
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      <UserDetail title="Name" value={`${user.firstName} ${user.lastName}`} />
      <UserDetail title="Role" value={role} />
      <UserDetail title="Email" value={user.email} />
      <UserDetail
        title="Email Status"
        value={user.emailVerified ? "Verified" : "Unverified"}
      />
      <Box>
        <Button onClick={handleResendMail}>Resend Verification Mail</Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
