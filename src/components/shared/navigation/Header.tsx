import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStorage } from "@/contexts/StorageContext";
import { useRouter } from "@/contexts/RouterContext";
import { Fragment } from "react";
import { handleLogout } from "@/@utils/handleLogout";
import { Login, Logout } from "@mui/icons-material";
import { RoutePath, RouteTitle } from "@/@enums/router.enum";
import { Box, Tooltip } from "@mui/material";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import _ from "lodash";
import { UserRoles } from "@/@enums/storage.enum";
import Notifications from "../blog/Notifications";

const Header = () => {
  const headerTitle = import.meta.env.VITE_BLOG_APP_HEADER_TITLE;

  const localStorageClient = useStorage()!;
  const accessToken = localStorageClient.getAccessToken();
  let userRole = null;
  if (accessToken) {
    userRole = getRoleFromJwtToken(accessToken);
  }
  const { handleRedirect } = useRouter()!;

  return (
    <Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          sx={{ flex: 1, letterSpacing: 1, cursor: "pointer" }}
          onClick={() => handleRedirect(RoutePath.HOME)}
        >
          {headerTitle?.toUpperCase()}
        </Typography>
        {accessToken ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Notifications />
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                handleRedirect(
                  _.isEqual(userRole, UserRoles.BLOGGER)
                    ? RoutePath.PROFILE
                    : RoutePath.DASHBOARD
                )
              }
            >
              {_.isEqual(userRole, UserRoles.BLOGGER)
                ? RouteTitle.PROFILE
                : RouteTitle.DASHBOARD}
            </Button>
            <Tooltip title="Logout" arrow placement="right">
              <Logout
                sx={{ cursor: "pointer" }}
                onClick={() => handleLogout(localStorageClient, handleRedirect)}
              />
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Login" arrow placement="right">
            <Login
              sx={{ cursor: "pointer" }}
              onClick={() => handleRedirect(RoutePath.LOGIN)}
            />
          </Tooltip>
        )}
      </Toolbar>
    </Fragment>
  );
};
export default Header;
