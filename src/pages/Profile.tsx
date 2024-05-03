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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person from "@mui/icons-material/Person";
import { Fragment } from "react";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import { useEffect, useState } from "react";
import { RoutePath } from "@/@enums/router.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import UserDetails from "@/components/shared/profile/UserDetails";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import PopularBlogs from "@/components/shared/dashboard/PopularBlogs";
import CreateBlogModal from "@/components/shared/blog/CreateBlogModal";
import { AppBar, Drawer } from "@/components/shared/navigation/AppBar";

const Profile = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { handleRedirect } = useRouter()!;
  const localStorageClient = useStorage()!;
  const { accountRepository, blogRepository, isLoading, setIsLoading } =
    useRepository()!;

  const handleLogout = () => {
    localStorageClient.clearLocalStorage();
    handleRedirect(RoutePath.LOGIN);
  };

  const [data, setData] = useState<
    AccountModels[AccountModelsType.USER] | null
  >(null);

  const [blogs, setBlogs] = useState<BlogModels[BlogModelsType.BLOG][]>([]);
  useEffect(() => {
    setIsLoading(true);
    accountRepository
      .getProfile()
      .then(
        (
          profileDataResponse: ApiResponse<
            AccountModels[AccountModelsType.USER]
          >
        ) => {
          if ("errors" in profileDataResponse) {
            console.error(profileDataResponse);
          } else {
            setData(profileDataResponse);
            blogRepository
              .getBlogs(1)
              .then(
                (
                  blogsData: ApiResponse<BlogModels[BlogModelsType.BLOGS_LIST]>
                ) => {
                  if ("errors" in blogsData) {
                    console.error(blogsData);
                  } else {
                    setBlogs(blogsData.blogs);
                  }
                }
              );
          }
        }
      )
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [
    blogRepository,
    accountRepository,
    localStorageClient,
    setIsLoading,
    handleRedirect,
  ]);

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
            <ListItemButton onClick={() => handleRedirect(RoutePath.DASHBOARD)}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              sx={{ backgroundColor: "lightgray" }}
              onClick={() => handleRedirect(RoutePath.PROFILE)}
            >
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
            </ListItemButton>{" "}
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
        <CreateBlogModal />
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
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <UserDetails user={data} />
                  </Paper>
                </Grid>
              </Container>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <PopularBlogs popularBlogs={blogs} />
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

export default Profile;
