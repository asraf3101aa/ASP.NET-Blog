import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { BlogModelsType } from "@/@enums/blog.enum";
import { BlogModels } from "@/@types/blog";
import _ from "lodash";
import moment from "moment";
import { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import { useRepository } from "@/contexts/RepositoryContext";
import { useStorage } from "@/contexts/StorageContext";
import { getRoleFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { RoutePath } from "@/@enums/router.enum";
import { UserRoles } from "@/@enums/storage.enum";

const PopularBlogs = (props: {
  popularBlogs?: BlogModels[BlogModelsType.BLOG][];
}) => {
  const popularBlogs = props.popularBlogs;
  const { isLoading } = useRepository()!;
  const localStorageClient = useStorage()!;
  const role = getRoleFromJwtToken(localStorageClient.getAccessToken()!);
  const isBloggerAtProfilePage =
    location.pathname === RoutePath.PROFILE && role === UserRoles.BLOGGER;

  return (
    <Fragment>
      <Typography variant="h6" pb={1}>
        Recent Popular Blogs
      </Typography>

      {isLoading ? (
        <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
      ) : _.isEmpty(popularBlogs) ? (
        <Typography variant="body1" sx={{ mt: 1 }}>
          No blogs posted yet.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              {!isBloggerAtProfilePage && <TableCell>Author</TableCell>}
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Posted on</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(popularBlogs, (blog: BlogModels[BlogModelsType.BLOG]) => (
              <TableRow key={blog.id}>
                <TableCell
                  sx={{ display: isBloggerAtProfilePage ? "none" : "block" }}
                >{`${blog.author.firstName} ${blog.author.lastName}`}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "block",
                      width: "500px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog.body}
                  </Box>
                </TableCell>
                <TableCell>{blog.category.name}</TableCell>
                <TableCell>
                  {moment(blog.createdAt).format("hh:MM A, DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Fragment>
  );
};

export default PopularBlogs;
