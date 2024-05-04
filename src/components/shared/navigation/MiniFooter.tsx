import { Link, Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Home } from "@mui/icons-material";

const MiniFooter = () => {
  return (
    <Box
      sx={{
        display: "flex", // Align horizontally
        justifyContent: "space-between", // Space between items
        alignItems: "center", // Align vertically
        px: 2,
        py: 3,
        backgroundColor: "transparent", // Light gray background
      }}
    >
      <Typography
        variant="body1"
        component={Link}
        href="/"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "black",
          textDecoration: "none",
          ":hover": {
            color: "#1976d2",
          },
        }}
      >
        <Home /> HOME
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FacebookIcon />
        <InstagramIcon />
        <TwitterIcon />
      </Box>
    </Box>
  );
};

export default MiniFooter;
