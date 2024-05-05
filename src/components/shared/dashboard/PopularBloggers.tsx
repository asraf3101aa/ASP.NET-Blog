import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";
import { AccountModelsType } from "@/@enums/account.enum";
import { AccountModels } from "@/@types/account";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const PopularBloggers = (props: {
  popularBloggers: AccountModels[AccountModelsType.POPULAR_BLOGGER][];
}) => {
  const popularBloggers = props.popularBloggers;
  return (
    <Fragment>
      <Typography variant="h6" pb={1}>
        Recent Popular Bloggers
      </Typography>
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
            <Typography variant="body1" sx={{ mt: 1 }}>
              No blogs posted yet.
            </Typography>
          ) : (
            _.map(
              popularBloggers,
              (blogger: AccountModels[AccountModelsType.POPULAR_BLOGGER]) => (
                <TableRow key={blogger.id}>
                  <TableCell>{`${blogger.firstName} ${blogger.lastName}`}</TableCell>
                  <TableCell>{blogger.email}</TableCell>
                  <TableCell>{blogger.totalBlogs}</TableCell>
                  <TableCell>{blogger.totalUpvote}</TableCell>
                  <TableCell>{blogger.totalDownvote}</TableCell>
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
