import React, { useEffect, useState } from "react";
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
import { useRouter } from "@/contexts/RouterContext";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";

const EditBlogModal = ({ blog }: { blog: BlogModels[BlogModelsType.BLOG] }) => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]>({
    defaultValues: {
      title: blog.title,
      body: blog.body,
      categoryId: blog.categoryId.toString(),
      images: blog.images,
    },
  });

  const { isLoading, setIsLoading, blogRepository, categories, setCategories } =
    useRepository()!;

  useEffect(() => {
    if (open) {
      blogRepository
        .getCategories()
        .then((categoriesResponse) => {
          if ("errors" in categoriesResponse) {
            console.error(categoriesResponse);
          } else {
            setCategories(categoriesResponse);
          }
        })
        .catch((error) => {
          console.error(error);
          ErrorToast({ Message: "Something went wrong!" });
        });
    }
  }, [open, blogRepository, setCategories]);

  const { handleReload } = useRouter()!;
  const onSubmit = (data: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]) => {
    setIsLoading(true);
    data.images = data.images
      ? typeof data.images === "object"
        ? data.images
        : [data.images]
      : [];

    blogRepository
      .updateBlog(blog.id.toString(), data)
      .then((blogResponse) => {
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
        setIsLoading(false);
        setOpen(false);
      });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Tooltip title="Edit Blog" arrow placement="right">
          <Edit sx={{ color: "#1976d2" }} />
        </Tooltip>
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="blog-edit-modal-title"
        aria-describedby="blog-edit-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" id="blog-edit-modal-title">
            Edit Blog
          </Typography>

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
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  {...field}
                  margin="normal"
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
                      <MenuItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <InputLabel sx={{ mt: 2 }}>Upload Images</InputLabel>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <TextField
                    type="file"
                    inputProps={{ multiple: true }}
                    {...field}
                  />
                </FormControl>
              )}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {isLoading ? (
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
