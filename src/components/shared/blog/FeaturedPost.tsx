import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Comment,
  Label,
} from "@mui/icons-material";
import { RoutePath } from "@/@enums/router.enum";
import { useRouter } from "@/contexts/RouterContext";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType, ReactionType } from "@/@enums/blog.enum";
import moment from "moment";
import _ from "lodash";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { useStorage } from "@/contexts/StorageContext";
import { getUserIdFromJwtToken } from "@/@utils/getRoleFromJwtToken";

const FeaturedPost = (props: { blog: BlogModels[BlogModelsType.BLOG] }) => {
  const { handleRedirect } = useRouter()!;
  const localstorageClient = useStorage()!;
  const accessToken = localstorageClient.getAccessToken();

  let userId: string | undefined = "";
  if (accessToken) {
    userId = getUserIdFromJwtToken(accessToken);
  }

  const { id, body, images, comments, category, createdAt, reactions, title } =
    props.blog;

  const upvotes = _.filter(
    reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) =>
      reaction.type === ReactionType.Upvote
  );

  const downvotes = _.filter(
    reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) =>
      reaction.type === ReactionType.Downvote
  );
  const userReactionOnBlog = _.find(
    reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) => {
      const userFromReaction: AccountModels[AccountModelsType.USER] =
        reaction.user;
      return userFromReaction.id === userId;
    }
  );
  const userUpvoted = userReactionOnBlog?.type === ReactionType.Upvote;

  return (
    <Grid item xs={10} key={id}>
      <CardActionArea onClick={() => handleRedirect(RoutePath.DETAILS)}>
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography component="h2" variant="h5">
                {title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Label sx={{ color: "black" }} />
                <Typography variant="body1">{category.name}</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {moment(createdAt).format("DD MMM YYYY")}
            </Typography>
            <Box sx={{ display: "flex", textWrap: "pretty" }}>
              {/* Adjust maxWidth as needed */}
              <Typography
                variant="subtitle1"
                paragraph
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {body}
              </Typography>
            </Box>
            {userId && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ArrowUpward
                    sx={{
                      bgcolor:
                        userReactionOnBlog && userUpvoted
                          ? "lightgray"
                          : "white",
                      borderRadius: "100%",
                    }}
                  />
                  {upvotes.length}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ArrowDownward
                    sx={{
                      bgcolor:
                        userReactionOnBlog && !userUpvoted
                          ? "lightgray"
                          : "white",
                      borderRadius: "100%",
                    }}
                  />
                  {downvotes.length}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Comment />
                  {comments.length}
                </Box>
              </Box>
            )}
          </CardContent>
          {images.length > 0 && (
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={images[0].path}
              alt={`BlogImage-${images[0].id}`}
            />
          )}
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default FeaturedPost;
