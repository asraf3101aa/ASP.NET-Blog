import { Box, Typography, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useStorage } from "@/contexts/StorageContext";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { RoutePath } from "@/@enums/router.enum";
import _ from "lodash";
import { UserRoles } from "@/@enums/storage.enum";

const Footer = () => {
  const localStorageClient = useStorage()!;
  const accessToken = localStorageClient.getAccessToken();
  let userRole = null;
  if (accessToken) {
    userRole = getRoleFromJwtToken(accessToken);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "lightgray",
        px: 20,
        py: 4,
        mt: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "50%",
            textWrap: "pretty",
          }}
        >
          <Typography variant="h6">About Us</Typography>
          <Typography variant="body1">
            Welcome to the Islington Blog, your go-to source for the latest
            news, stories, and insights from Islington and the surrounding
            areas. Our blog is dedicated to delivering engaging content that
            informs, inspires, and connects our diverse community.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "40%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Navigation</Typography>
            <Link
              href={RoutePath.HOME}
              sx={{
                textDecoration: "none",
                color: "black",
                ":hover": {
                  color: "#1976d2",
                },
              }}
            >
              HOME
            </Link>
            <Link
              href={
                accessToken && userRole
                  ? _.isEqual(userRole, UserRoles.BLOGGER)
                    ? RoutePath.PROFILE
                    : RoutePath.DASHBOARD
                  : RoutePath.LOGIN
              }
              sx={{
                textDecoration: "none",
                color: "black",
                ":hover": {
                  color: "#1976d2",
                },
              }}
            >
              {accessToken && userRole
                ? _.isEqual(userRole, UserRoles.BLOGGER)
                  ? "PROFILE"
                  : "DASHBOARD"
                : "LOGIN"}
            </Link>
            <Link
              href="#"
              sx={{
                textDecoration: "none",
                color: "black",
                ":hover": {
                  color: "#1976d2",
                },
              }}
            >
              CONTACT
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6">Coming soon</Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FacebookIcon sx={{ mr: 1 }} />
                Facebook
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InstagramIcon sx={{ mr: 1 }} />
                Instagram
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TwitterIcon sx={{ mr: 1 }} />
                Twitter
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="body1">&copy; Islington Blog 2024</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
