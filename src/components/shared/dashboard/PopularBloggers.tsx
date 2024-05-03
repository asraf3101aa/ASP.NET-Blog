import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";
import { AccountModelsType } from "@/@enums/account.enum";
import { AccountModels } from "@/@types/account";
import { Fragment } from "react";

const PopularBloggers = (popularBloggers: {
  popularBloggers: AccountModels[AccountModelsType.POPULAR_BLOGGER][];
}) => {
  return (
    <Fragment>
      <div>Recent PopularBloggers</div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Blogs</TableCell>
            <TableCell>Upvotes</TableCell>
            <TableCell>Downvotes</TableCell>
            <TableCell>Popularity</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_.isEmpty(popularBloggers) ? (
            <div>No blogs posted yet.</div>
          ) : (
            _.map(
              popularBloggers,
              (blogger: AccountModels[AccountModelsType.POPULAR_BLOGGER]) => (
                <TableRow key={blogger.id}>
                  <TableCell>{`${blogger.firstName} ${blogger.lastName}`}</TableCell>
                  <TableCell>{blogger.email}</TableCell>
                  <TableCell>{blogger.totalBlogs}</TableCell>
                  <TableCell>{blogger.totalUpvotes}</TableCell>
                  <TableCell>{blogger.totalDownvotes}</TableCell>
                  <TableCell>{blogger.totalComments}</TableCell>
                  <TableCell>{blogger.totalPopularityScore}</TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default PopularBloggers;
