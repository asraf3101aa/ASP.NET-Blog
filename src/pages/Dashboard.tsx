import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PopularBlogs from "@/components/shared/dashboard/PopularBlogs";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person from "@mui/icons-material/Person";
import { Fragment } from "react";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import { useEffect, useState } from "react";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { UserRoles } from "@/@enums/storage.enum";
import _ from "lodash";
import { RoutePath } from "@/@enums/router.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import { AdminDashboardData } from "@/@types/admin";
import { BlogStatsData, BlogsDurationFilters } from "@/@enums/blog.enum";
import PopularBloggers from "../components/shared/dashboard/PopularBloggers";
import { AppBar, Drawer } from "@/components/shared/navigation/AppBar";
import DashboardTile from "@/components/shared/dashboard/DashboardTile";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const { adminRepository, isLoading, setIsLoading } = useRepository()!;
  const [data, setData] = useState<AdminDashboardData | null>(null);

  const handleLogout = () => {
    localStorageClient.clearLocalStorage();
    handleRedirect(RoutePath.LOGIN);
  };

  useEffect(() => {
    const accessToken = localStorageClient.getAccessToken();
    if (accessToken) {
      const userRole = getRoleFromJwtToken(accessToken);
      if (_.isEqual(userRole, UserRoles.BLOGGER)) {
        handleRedirect(RoutePath.PROFILE);
      } else {
        setIsLoading(true);
        adminRepository
          .getDashboardData(BlogsDurationFilters.MONTHLY, 5)
          .then((dashboardDataResponse: ApiResponse<AdminDashboardData>) => {
            if ("errors" in dashboardDataResponse) {
              console.log(dashboardDataResponse);
            } else setData(dashboardDataResponse);
          })
          .catch((error) => console.error(error))
          .finally(() => setIsLoading(false));
      }
    }
  }, [adminRepository, handleRedirect, localStorageClient, setIsLoading]);

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
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleRedirect(RoutePath.PROFILE)}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={() => handleRedirect(RoutePath.HOME)}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
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
            height: "90%",
          }}
        >
          {isLoading ? (
            <img src="/assets/icons/Loading.svg" />
          ) : data ? (
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
                        value={data.blogStats.blogCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.COMMENT_COUNT}
                        value={data.blogStats.commentCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.UP_VOTE_COUNT}
                        value={data.blogStats.upvoteCount.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={2.5}>
                      <DashboardTile
                        title={BlogStatsData.DOWN_VOTE_COUNT}
                        value={data.blogStats.downvoteCount.toString()}
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
                    <PopularBlogs popularBlogs={data.popularBlogs} />
                  </Paper>
                </Grid>
              </Container>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <PopularBloggers popularBloggers={data.popularBlogger} />
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
