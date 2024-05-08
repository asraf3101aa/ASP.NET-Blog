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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person from "@mui/icons-material/Person";
import { Fragment, useEffect } from "react";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import { useState } from "react";
import { RoutePath, RouteTitle } from "@/@enums/router.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import UserDetails from "@/components/shared/profile/UserDetails";
import PopularBlogs from "@/components/shared/dashboard/PopularBlogs";
import CreateBlogModal from "@/components/shared/blog/CreateBlogModal";
import { AppBar, Drawer } from "@/components/shared/navigation/AppBar";
import { Home, Logout } from "@mui/icons-material";
import { handleLogout } from "@/@utils/handleLogout";
import { Button, Tooltip } from "@mui/material";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { UserRoles } from "@/@enums/storage.enum";
import InviteAdminModal from "@/components/shared/profile/InviteAdminModal";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import Notifications from "@/components/shared/blog/Notifications";

const Profile = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const { isAppDataLoading, user, blogs, setBlogs } = useRepository()!;

  const accessToken = localStorageClient.getAccessToken();
  let userRole = "";
  if (accessToken) {
    userRole = getRoleFromJwtToken(accessToken);
  }

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    blogs?.paginationMetaData?.pageNumber ?? 1
  );
  const [blogsData] = useState<BlogModels[BlogModelsType.BLOGS_LIST] | null>(
    blogs
  );

  useEffect(() => {
    if (blogsData?.paginationMetaData) {
      blogsData.paginationMetaData.pageNumber = currentPageNumber;
      setBlogs({ ...blogsData });
    }
  }, [blogsData, currentPageNumber, setBlogs]);

  const handleNextPageChange = () => {
    if (blogs?.paginationMetaData?.hasNextPage) {
      setCurrentPageNumber(currentPageNumber + 1);
    }
  };
  const handlePreviousPageChange = () => {
    if (blogs?.paginationMetaData?.hasPreviousPage) {
      setCurrentPageNumber(currentPageNumber - 1);
    }
  };
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
            Profile
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
              sx={{ display: userRole !== UserRoles.ADMIN ? "none" : "flex" }}
              onClick={() => handleRedirect(RoutePath.DASHBOARD)}
            >
              <Tooltip title={RouteTitle.DASHBOARD} arrow placement="top-start">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              sx={{ backgroundColor: "lightgray" }}
              onClick={() => handleRedirect(RoutePath.PROFILE)}
            >
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
            alignItems: "center",
            minHeight: "80vh",
            px: 4,
            py: 2,
          }}
        >
          {isAppDataLoading || !user ? (
            <Container
              sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
            </Container>
          ) : (
            <>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                  <UserDetails user={user} />
                </Grid>
              </Container>
              <Container>
                {userRole === UserRoles.ADMIN ? (
                  <InviteAdminModal />
                ) : (
                  <CreateBlogModal />
                )}
              </Container>
              <Container
                maxWidth="lg"
                sx={{
                  display: userRole === UserRoles.ADMIN ? "none" : "flex",
                  mt: 4,
                  mb: 4,
                }}
              >
                <Grid sx={{ width: "100%" }}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <PopularBlogs popularBlogs={blogs?.blogs} />
                  </Paper>
                </Grid>
              </Container>
              <Container
                sx={{
                  display: userRole === UserRoles.BLOGGER ? "flex" : "none",
                  pb: 2,
                  gap: 2,
                }}
              >
                <Button
                  disabled={!blogs?.paginationMetaData?.hasPreviousPage}
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={handlePreviousPageChange}
                >
                  Previous
                </Button>
                <Button
                  disabled={!blogs?.paginationMetaData?.hasNextPage}
                  variant="outlined"
                  onClick={handleNextPageChange}
                >
                  Next
                </Button>
              </Container>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
