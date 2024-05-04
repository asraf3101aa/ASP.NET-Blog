import React, { useState } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import _ from "lodash";
import { useRouter } from "@/contexts/RouterContext";
import { RoutePath } from "@/@enums/router.enum";

const CreateBlogModal = () => {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { isLoading, categories, setIsLoading, blogRepository } =
    useRepository()!;

  const { handleRedirect } = useRouter()!;

  const onSubmit = (data: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]) => {
    setIsLoading(true);
    data.images = data.images
      ? typeof data.images === "object"
        ? data.images
        : [data.images]
      : [];

    blogRepository
      .createBlog(data)
      .then((blogResponse: ApiResponse<BlogModels[BlogModelsType.BLOG]>) => {
        console.log(blogResponse);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        handleRedirect(RoutePath.PROFILE);
      });
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create New Blog
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="blog-form-modal-title"
        aria-describedby="blog-form-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" id="blog-form-modal-title">
            Create/Edit Blog
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
                  <InputLabel>Category ID</InputLabel>
                  <Select {...field} label="Category ID" defaultValue="">
                    {_.map(categories, (category) => (
                      <MenuItem value={category.id.toString()}>
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
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              {isLoading ? (
                <img src="/assets/icons/Loading.svg" />
              ) : (
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateBlogModal;
