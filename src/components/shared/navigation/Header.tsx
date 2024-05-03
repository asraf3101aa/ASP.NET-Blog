import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useStorage } from "@/contexts/StorageContext";
import { useRouter } from "@/contexts/RouterContext";
import { RoutePath } from "@/@enums/router.enum";

export default function Header(props: { title: string }) {
  const localStorageClient = useStorage()!;
  const { handleRedirect } = useRouter()!;

  const handleLogout = () => {
    localStorageClient.clearLocalStorage();
    handleRedirect(RoutePath.LOGIN);
  };
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {props.title}
        </Typography>
        {!localStorageClient.getAccessToken() ? (
          <Button variant="outlined" size="small">
            <Link href="/login" underline="none">
              Sign in
            </Link>
          </Button>
        ) : (
          <Button variant="outlined" size="small" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </React.Fragment>
  );
}
