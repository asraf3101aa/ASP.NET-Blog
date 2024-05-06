import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Footer from "../components/shared/navigation/Footer";
import Header from "../components/shared/navigation/Header";
import { useRepository } from "@/contexts/RepositoryContext";
import { useEffect, useState } from "react";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType, ReactionOn, ReactionType } from "@/@enums/blog.enum";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import {
  ArrowDownward,
  ArrowUpward,
  Comment,
  Label,
  Person,
} from "@mui/icons-material";
import _ from "lodash";
import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";
import { getUserIdFromJwtToken } from "@/@utils/getRoleFromJwtToken";
import { useStorage } from "@/contexts/StorageContext";
import { useRouter } from "@/contexts/RouterContext";
import DeleteResourceModal from "@/components/shared/profile/DeleteResourceModal";
import { DeleteModalType } from "@/@enums/components.enum";
import { RoutePath } from "@/@enums/router.enum";
import EditBlogModal from "@/components/shared/blog/EditBlogModal";
import EditCommentModal from "@/components/shared/blog/EditCommentModal";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogModels[BlogModelsType.BLOG] | null>(
    null
  );
  const { isLoading, setIsLoading, blogRepository } = useRepository()!;

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element && blog) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [blog, location]);

  useEffect(() => {
    try {
      setIsLoading(true);
      blogRepository
        .getBlogDetails(id!)
        .then((blogDetailsResponse) => {
          if ("errors" in blogDetailsResponse) {
            console.error(blogDetailsResponse);
          } else {
            setBlog(blogDetailsResponse);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
    }
  }, [blogRepository, id, setIsLoading]);

  const { handleReload, handleRedirect } = useRouter()!;
  const localstorageClient = useStorage()!;
  const accessToken = localstorageClient.getAccessToken();

  let userId: string | undefined = "";
  if (accessToken) {
    userId = getUserIdFromJwtToken(accessToken);
  }

  const upvotes = _.filter(
    blog?.reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) =>
      reaction.type === ReactionType.Upvote
  );

  const downvotes = _.filter(
    blog?.reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) =>
      reaction.type === ReactionType.Downvote
  );
  const userReactionOnBlog = _.find(
    blog?.reactions,
    (reaction: BlogModels[BlogModelsType.REACTION]) => {
      const userFromReaction: AccountModels[AccountModelsType.USER] =
        reaction.user;
      return userFromReaction.id === userId;
    }
  );
  const userUpvoted = userReactionOnBlog?.type === ReactionType.Upvote;

  const handleReaction = async (
    reactionOn: ReactionOn,
    reactionType: ReactionType,
    postId: string
  ) => {
    try {
      if (_.isEqual(reactionOn, ReactionOn.BLOG)) {
        await blogRepository.reactOnBlog(id!, reactionType);
      } else {
        await blogRepository.reactOnBlogComment(id!, postId, reactionType);
      }
      handleReload();
    } catch (error) {
      console.error(error);
    }
  };

  const [newComment, setComment] = useState("");
  const handleAddComment = async () => {
    try {
      if (newComment.trim() !== "") {
        await blogRepository.commentOnBlog(id!, newComment.trim());
        handleReload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBlog = async () => {
    await blogRepository.deleteBlog(id!);
    handleRedirect(RoutePath.HOME);
  };
  const handleDeleteComment = async (commentId: string) => {
    await blogRepository.deleteBlogComment(id!, commentId);
    handleReload();
  };
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0px !important",
        maxWidth: "100% !important",
      }}
    >
      <CssBaseline />
      <Container>
        <Header />
        <main>
          {isLoading || !blog ? (
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
            <Container
              sx={{ display: "flex", flexDirection: "column", gap: 1, my: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography component="h2" variant="h5">
                  {blog.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Label sx={{ color: "black" }} />
                  <Typography variant="body1">{blog.category.name}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="subtitle2">
                  {`${blog.author.firstName} ${blog.author.lastName}`}
                </Typography>

                <Typography variant="subtitle2">
                  {`Posted on: ${moment(blog.createdAt).format(
                    "hh:MM A, DD MMM YYYY"
                  )}`}
                </Typography>

                <Typography variant="subtitle2">
                  {`Last updated: ${moment(blog.updatedAt).format(
                    "hh:MM A, DD MMM YYYY"
                  )}`}
                </Typography>
              </Box>

              <Paper sx={{ p: 2, minHeight: 100 }}>
                <Typography variant="body1">{blog.body}</Typography>
              </Paper>
              {userId && id && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {userId ? (
                      <IconButton
                        onClick={() =>
                          handleReaction(
                            ReactionOn.BLOG,
                            ReactionType.Upvote,
                            id
                          )
                        }
                      >
                        <ArrowUpward
                          sx={{
                            bgcolor:
                              userReactionOnBlog && userUpvoted
                                ? "lightgray"
                                : "white",
                            borderRadius: "100%",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <Tooltip
                        title="Please login to react"
                        placement="bottom"
                        arrow
                      >
                        <ArrowUpward
                          sx={{
                            bgcolor:
                              userReactionOnBlog && userUpvoted
                                ? "lightgray"
                                : "white",
                            borderRadius: "100%",
                          }}
                        />
                      </Tooltip>
                    )}
                    {upvotes.length}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {userId ? (
                      <IconButton
                        onClick={() =>
                          handleReaction(
                            ReactionOn.BLOG,
                            ReactionType.Downvote,
                            id
                          )
                        }
                      >
                        <ArrowDownward
                          sx={{
                            bgcolor:
                              userReactionOnBlog && !userUpvoted
                                ? "lightgray"
                                : "white",
                            borderRadius: "100%",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <Tooltip
                        title="Please login to react"
                        placement="bottom"
                        arrow
                      >
                        <ArrowDownward
                          sx={{
                            bgcolor:
                              userReactionOnBlog && !userUpvoted
                                ? "lightgray"
                                : "white",
                            borderRadius: "100%",
                          }}
                        />
                      </Tooltip>
                    )}
                    {downvotes.length}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Comment />
                    {blog.comments.length}
                  </Box>

                  {userId === blog?.authorId && <EditBlogModal blog={blog} />}
                  {userId === blog?.authorId && (
                    <DeleteResourceModal
                      resourceType={DeleteModalType.BLOG}
                      onDelete={handleDeleteBlog}
                    />
                  )}
                </Box>
              )}
              {/* New Comment */}
              <Stack spacing={2} direction="column">
                <TextField
                  id="comment"
                  label="Add a Comment"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={newComment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                />
                <Stack spacing={2} direction="row" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setComment("")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    disabled={newComment.trim() === ""}
                  >
                    Comment
                  </Button>
                </Stack>
              </Stack>

              {/* Previous Comments */}
              <Typography variant="h6">Comments</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {_.isEmpty(blog.comments) ? (
                  <Box>
                    <Typography variant="body1">
                      No comments posted yet.
                    </Typography>
                  </Box>
                ) : (
                  _.map(blog.comments, (comment) => {
                    const upvotesOnComment = _.filter(
                      comment.reactions,
                      (reaction: BlogModels[BlogModelsType.REACTION]) =>
                        reaction.type === ReactionType.Upvote
                    );

                    const downvotesOnComment = _.filter(
                      comment.reactions,
                      (reaction: BlogModels[BlogModelsType.REACTION]) =>
                        reaction.type === ReactionType.Downvote
                    );
                    const userReactionOnBlogComment = _.find(
                      comment.reactions,
                      (reaction: BlogModels[BlogModelsType.REACTION]) => {
                        const userFromReaction: AccountModels[AccountModelsType.USER] =
                          reaction.user;
                        return userFromReaction.id === userId;
                      }
                    );
                    const userUpvotedOnComment =
                      userReactionOnBlogComment?.type === ReactionType.Upvote;

                    return (
                      <Box
                        padding={2}
                        border={1}
                        borderRadius={2}
                        borderColor="lightgray"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                        key={comment.id}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box display={"flex"} gap={1}>
                            <Person />
                            <Typography variant="body1">
                              {`${comment.user.firstName} ${comment.user.lastName}`}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            gap={2}
                            mb={1}
                            borderBottom={"1px solid lightgray"}
                          >
                            <Typography variant="subtitle2">
                              {`Posted on: ${moment(comment.createdAt).format(
                                "hh:MM A, DD MMM YYYY"
                              )}`}
                            </Typography>

                            <Typography variant="subtitle2">
                              {`Last updated: ${moment(
                                comment.updatedAt
                              ).format("hh:MM A, DD MMM YYYY")}`}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2">{comment.text}</Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {userId ? (
                              <IconButton
                                onClick={() =>
                                  handleReaction(
                                    ReactionOn.COMMENT,
                                    ReactionType.Upvote,
                                    comment.id.toString()
                                  )
                                }
                              >
                                <ArrowUpward
                                  sx={{
                                    bgcolor:
                                      userReactionOnBlogComment &&
                                      userUpvotedOnComment
                                        ? "lightgray"
                                        : "white",
                                    borderRadius: "100%",
                                  }}
                                />
                              </IconButton>
                            ) : (
                              <Tooltip
                                title="Please login to react"
                                placement="bottom"
                                arrow
                              >
                                <ArrowUpward
                                  sx={{
                                    bgcolor:
                                      userReactionOnBlogComment &&
                                      userUpvotedOnComment
                                        ? "lightgray"
                                        : "white",
                                    borderRadius: "100%",
                                  }}
                                />
                              </Tooltip>
                            )}
                            {upvotesOnComment.length}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {userId ? (
                              <IconButton
                                onClick={() =>
                                  handleReaction(
                                    ReactionOn.COMMENT,
                                    ReactionType.Downvote,
                                    comment.id.toString()
                                  )
                                }
                              >
                                <ArrowDownward
                                  sx={{
                                    bgcolor:
                                      userReactionOnBlogComment &&
                                      !userUpvotedOnComment
                                        ? "lightgray"
                                        : "white",
                                    borderRadius: "100%",
                                  }}
                                />
                              </IconButton>
                            ) : (
                              <Tooltip
                                title="Please login to react"
                                placement="bottom"
                                arrow
                              >
                                <ArrowDownward
                                  sx={{
                                    bgcolor:
                                      userReactionOnBlogComment &&
                                      !userUpvotedOnComment
                                        ? "lightgray"
                                        : "white",
                                    borderRadius: "100%",
                                  }}
                                />
                              </Tooltip>
                            )}
                            {downvotesOnComment.length}
                          </Box>
                          {userId === comment?.userId && (
                            <EditCommentModal
                              blogId={id!}
                              commentId={comment.id.toString()}
                              currentText={comment.text}
                            />
                          )}
                          {userId === comment?.userId && (
                            <DeleteResourceModal
                              resourceType={DeleteModalType.COMMENT}
                              onDelete={() =>
                                handleDeleteComment(comment.id.toString())
                              }
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Container>
          )}
        </main>
      </Container>
      <Footer />
    </Container>
  );
};

export default BlogDetails;
