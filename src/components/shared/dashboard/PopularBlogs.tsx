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

const PopularBlogs = (popularBlogs: {
  popularBlogs: BlogModels[BlogModelsType.BLOG][];
}) => {
  return (
    <Fragment>
      <div>Recent PopularBlogs</div>
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
          {_.isEmpty(popularBlogs) ? (
            <div>No blogs posted yet.</div>
          ) : (
            _.map(popularBlogs, (blog: BlogModels[BlogModelsType.BLOG]) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.body}</TableCell>
                <TableCell>{blog.category.name}</TableCell>
                <TableCell>
                  {moment(blog.createdAt).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default PopularBlogs;
