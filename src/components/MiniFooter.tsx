import { Link, Box, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
const MiniFooter = () => {
  return (
    <Box
      sx={{
        display: "flex", // Align horizontally
        justifyContent: "space-between", // Space between items
        alignItems: "center", // Align vertically
        p: 2,
        backgroundColor: "rgba(0, 0, 0, 0.1)", // Light gray background
      }}
    >
      <Typography variant="body1" component={Link} href="/" sx={{ mx: 2 }}>
        Return Home
      </Typography>
      <Typography variant="body2">&copy; Islington Blog 2024</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">Coming Soon</Typography>
        <Box>
          <FacebookIcon sx={{ mx: 1 }} />
          <InstagramIcon sx={{ mx: 1 }} />
          <TwitterIcon sx={{ mx: 1 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MiniFooter;
