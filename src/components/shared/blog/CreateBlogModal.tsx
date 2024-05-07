import React, { ChangeEvent, useState } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import _ from "lodash";
import { useRouter } from "@/contexts/RouterContext";
import { Info } from "@mui/icons-material";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";

const CreateBlogModal = () => {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { isLoading, categories, user, setIsLoading, blogRepository } =
    useRepository()!;

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
    setIsLoading(true);

    const blogData = new FormData();
    blogData.append("title", data.title);
    blogData.append("body", data.body);
    blogData.append("categoryId", data.categoryId!);
    if (data.banner) {
      blogData.append("banner", data.banner);
    }
    if (data.other) {
      blogData.append("other", data.other);
    }

    blogRepository
      .createBlog(blogData)
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
        setIsLoading(false);
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="contained"
          disabled={!user?.emailConfirmed}
          onClick={handleOpen}
        >
          Create New Blog
        </Button>
        {!user?.emailConfirmed && (
          <Tooltip title="Please verify email first" placement="right">
            <Info sx={{ color: "#1976d2" }} />
          </Tooltip>
        )}
      </Box>

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
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" id="blog-form-modal-title">
            Create Blog
          </Typography>

          <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
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
                  <Select {...field} label="Category ID" defaultValue="">
                    {_.map(categories, (category) => (
                      <MenuItem
                        value={category.id.toString()}
                        key={category.id}
                      >
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
