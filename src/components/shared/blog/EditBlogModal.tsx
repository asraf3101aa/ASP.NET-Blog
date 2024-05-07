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
import { useForm } from "react-hook-form";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import _ from "lodash";
import { Edit } from "@mui/icons-material";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";
import { useRouter } from "@/contexts/RouterContext";

interface EditBlogModalProps {
  blog: BlogModels[BlogModelsType.BLOG];
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ blog }) => {
  const [open, setOpen] = useState(false);

  const {
    blogRepository,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    categories,
    setCategories,
  } = useRepository()!;
  const [dataLoadingFlags] = useState({ ...repositoryDataLoadingFlags });

  const { handleSubmit, register, setValue, reset } = useForm<
    BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]
  >({
    defaultValues: {
      title: blog.title,
      body: blog.body,
      categoryId: blog.category.name,
    },
  });

  useEffect(() => {
    blogRepository.getCategories().then((categories) => {
      if ("errors" in categories) {
        console.error(categories);
      } else setCategories(categories);
    });
  }, [blogRepository, setCategories]);

  const { handleReload } = useRouter()!;

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const field = e.target
      .name as keyof BlogModels[BlogModelsType.BLOG_PARTIAL_DATA];

    if (file) {
      setValue(field, file);
    }
  };

  const onSubmit = (data: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]) => {
    setRepositoryDataLoadingFlags({
      ...dataLoadingFlags,
      isBlogRepositoryDataLoading: true,
    });

    const category = _.find(categories, (c) => c.name === data.categoryId);

    const blogData = new FormData();
    blogData.append("title", data.title);
    blogData.append("body", data.body);

    if (category) {
      blogData.append("categoryId", category.id.toString());
    }

    if (data.banner) {
      blogData.append("banner", data.banner);
    }

    if (data.other) {
      blogData.append("other", data.other);
    }

    blogRepository
      .updateBlog(blog.id.toString(), blogData)
      .then((response) => {
        if (typeof response === "string") {
          SuccessToast({ Message: response });
          setTimeout(() => {
            handleReload();
          }, 1000);
        } else {
          ErrorToast({ Message: "Update failed." });
        }
      })
      .catch((error) => {
        console.error(error);
        ErrorToast({ Message: "An error occurred during update." });
      })
      .finally(() => {
        setRepositoryDataLoadingFlags({
          ...dataLoadingFlags,
          isBlogRepositoryDataLoading: false,
        });
        setOpen(false);
      });
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Tooltip title="Edit Blog" arrow>
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
            <TextField
              fullWidth
              label="Title"
              required
              {...register("title")}
              margin="normal"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Body"
              required
              {...register("body")}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                {...register("categoryId")}
                defaultValue={blog.category.name}
              >
                {_.map(categories, (category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <InputLabel>Upload Banner</InputLabel>
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
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Box>

            <Box>
              <InputLabel>Body Image</InputLabel>
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
                  type="file"
                  name="other"
                  accept="image/*"
                  onChange={handleFileChange}
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
              {repositoryDataLoadingFlags.isBlogRepositoryDataLoading ? (
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
