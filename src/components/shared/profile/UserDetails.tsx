import React from "react";
import { Box, Typography } from "@mui/material";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";

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
}) => (
  <Box
    padding={2}
    border={1}
    borderRadius={2}
    borderColor="grey.300"
    bgcolor="grey.100"
  >
    <UserDetail title="ID" value={user.id} />
    <UserDetail title="Email" value={user.email} />
    <UserDetail title="First Name" value={user.firstName} />
    {user.lastName && <UserDetail title="Last Name" value={user.lastName} />}
    {user.avatar && <UserDetail title="Avatar" value={user.avatar} />}
  </Box>
);

export default UserDetails;
