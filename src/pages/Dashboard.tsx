import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PopularBlogs from "@/components/shared/dashboard/PopularBlogs";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person from "@mui/icons-material/Person";
import { Fragment } from "react";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import { useState } from "react";
import { RoutePath, RouteTitle } from "@/@enums/router.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import { BlogStatsData } from "@/@enums/blog.enum";
import PopularBloggers from "../components/shared/dashboard/PopularBloggers";
import { AppBar, Drawer } from "@/components/shared/navigation/AppBar";
import DashboardTile from "@/components/shared/dashboard/DashboardTile";
import { Home, Logout } from "@mui/icons-material";
import { handleLogout } from "@/@utils/handleLogout";
import { Tooltip } from "@mui/material";
import DashboardDataFilters from "@/components/shared/dashboard/DashboardDataFilters";
import Notifications from "@/components/shared/blog/Notifications";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const { isLoading, dashboardData } = useRepository()!;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <Notifications />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <Fragment>
            <ListItemButton
              sx={{ backgroundColor: "lightgray" }}
              onClick={() => handleRedirect(RoutePath.DASHBOARD)}
            >
              <Tooltip title={RouteTitle.DASHBOARD} arrow placement="top-start">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleRedirect(RoutePath.PROFILE)}>
              <Tooltip title={RouteTitle.PROFILE} arrow placement="top-start">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Profile" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={() => handleRedirect(RoutePath.HOME)}>
              <Tooltip title={RouteTitle.HOME} arrow placement="top-start">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleLogout(localStorageClient, handleRedirect)}
            >
              <Tooltip title="Logout" arrow placement="top-start">
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Fragment>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DashboardDataFilters />
          {isLoading ? (
            <img src="/assets/icons/Loading.svg" />
          ) : dashboardData ? (
            <>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Grid
                    container
                    sx={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.BLOG_COUNT}
                        value={dashboardData.blogStats.blogCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.COMMENT_COUNT}
                        value={dashboardData.blogStats.commentCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.UP_VOTE_COUNT}
                        value={dashboardData.blogStats.upvoteCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.DOWN_VOTE_COUNT}
                        value={dashboardData.blogStats.downvoteCount.toString()}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Container>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <PopularBlogs popularBlogs={dashboardData.popularBlogs} />
                  </Paper>
                </Grid>
              </Container>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <PopularBloggers
                      popularBloggers={dashboardData.popularBlogger}
                    />
                  </Paper>
                </Grid>
              </Container>
            </>
          ) : (
            <></>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
