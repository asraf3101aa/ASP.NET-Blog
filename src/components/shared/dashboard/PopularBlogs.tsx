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
import { Typography } from "@mui/material";
import { useRepository } from "@/contexts/RepositoryContext";

const PopularBlogs = (props: {
  popularBlogs: BlogModels[BlogModelsType.BLOG][];
}) => {
  const popularBlogs = props.popularBlogs;
  const { isLoading } = useRepository()!;
  return (
    <Fragment>
      <Typography variant="h6" pb={1}>
        Recent Popular Blogs
      </Typography>

      {isLoading ? (
        <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
      ) : _.isEmpty(popularBlogs) ? (
        <Typography variant="body1">No blogs posted yet.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Posted on</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(popularBlogs, (blog: BlogModels[BlogModelsType.BLOG]) => (
              <TableRow key={blog.id}>
                <TableCell>{`${blog.author.firstName} ${blog.author.lastName}`}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.body}</TableCell>
                <TableCell>{blog.category.name}</TableCell>
                <TableCell>
                  {moment(blog.createdAt).format("DD MMM YYYY")}
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
