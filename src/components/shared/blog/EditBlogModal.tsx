import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import _ from "lodash";
import { Edit } from "@mui/icons-material";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";
import { useRouter } from "@/contexts/RouterContext";

const EditBlogModal = ({ blog }: { blog: BlogModels[BlogModelsType.BLOG] }) => {
  const [open, setOpen] = useState(false);
  const {
    blogRepository,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    categories,
    setCategories,
    isAppDataLoading,
  } = useRepository()!;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]>({
    defaultValues: {
      title: blog.title,
      body: blog.body,
      categoryId: categories.length > 0 ? blog.category.name : "",
    },
  });

  useEffect(() => {
    if (open) {
      blogRepository
        .getCategories()
        .then((response) => {
          if ("errors" in response) {
            console.error("Failed to load categories.");
          } else {
            setCategories(response);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [open, blogRepository, setCategories]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { handleReload } = useRouter()!;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const field = e.target.name as
        | "title"
        | "body"
        | "categoryId"
        | "banner"
        | "other";

      if (file) {
        setValue(field, file);
      }
    }
  };

  const onSubmit = (data: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]) => {
    setRepositoryDataLoadingFlags({
      ...repositoryDataLoadingFlags,
      isBlogRepositoryDataLoading: true,
    });

    const categoryIndex = _.findIndex(
      categories,
      (category) => category.name === data.categoryId
    );
    const blogData = new FormData();
    blogData.append("title", data.title);
    blogData.append("body", data.body);
    blogData.append("categoryId", categories[categoryIndex].id.toString());
    if (data.banner) {
      blogData.append("banner", data.banner);
    }
    if (data.other) {
      blogData.append("other", data.other);
    }

    blogRepository
      .updateBlog(blog.id.toString(), blogData)
      .then((blogResponse: ApiResponse<string>) => {
        if (typeof blogResponse === "string") {
          SuccessToast({ Message: blogResponse });
          setTimeout(() => {
            handleReload();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        ErrorToast({ Message: "Something went wrong!" });
      })
      .finally(() => {
        setRepositoryDataLoadingFlags({
          ...repositoryDataLoadingFlags,
          isBlogRepositoryDataLoading: false,
        });
      });
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Tooltip title="Edit Blog" placement="top">
          <Edit sx={{ color: "#1976d2" }} />
        </Tooltip>
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-blog-modal-title"
        aria-describedby="edit-blog-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6">Edit Blog</Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="body"
              control={control}
              rules={{ required: "Body is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Body"
                  variant="outlined"
                  error={!!errors.body}
                  helperText={errors.body?.message}
                  {...field}
                  margin="normal"
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category ID">
                    {_.map(categories, (category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Box>
              <InputLabel sx={{ mt: 2 }}>Upload Banner</InputLabel>
              <Box
                sx={{
                  my: 1,
                  p: 1,
                  border: 1,
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <input
                  name="banner"
                  type="file"
                  value={control._formValues["banner"]}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Box>
            </Box>

            <Box>
              <InputLabel sx={{ mt: 2 }}>Body Image</InputLabel>
              <Box
                sx={{
                  my: 1,
                  p: 1,
                  border: 1,
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <input
                  name="other"
                  type="file"
                  value={control._formValues["other"]}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              {isAppDataLoading ? (
                <img src="/assets/icons/Loading.svg" alt="Loading" />
              ) : (
                <Button variant="contained" color="primary" type="submit">
                  Save Changes
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditBlogModal;
