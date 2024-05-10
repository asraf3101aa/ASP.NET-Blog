import React, { ChangeEvent, useState, FormEvent } from "react";
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
import { useRepository } from "@/contexts/RepositoryContext";
import _ from "lodash";
import { useRouter } from "@/contexts/RouterContext";
import { Info } from "@mui/icons-material";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";
import { BlogModels } from "@/@types/blog";
import { BlogModelsType } from "@/@enums/blog.enum";

const CreateBlogModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<
    BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]
  >({
    title: "",
    body: "",
    categoryId: "",
    banner: "",
    other: "",
  });

  const {
    isAppDataLoading,
    categories,
    user,
    repositoryDataLoadingFlags,
    setRepositoryDataLoadingFlags,
    blogRepository,
  } = useRepository()!;
  const { handleReload } = useRouter()!;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormValues({
      title: "",
      body: "",
      categoryId: "",
      banner: "",
      other: "",
    });
  };

  const handleInputChange = (e: {
    target: { name: string; value: unknown };
  }) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: file,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRepositoryDataLoadingFlags({
      ...repositoryDataLoadingFlags,
      isBlogRepositoryDataLoading: true,
    });
    const category = _.find(
      categories,
      (category) => category.id.toString() === formValues.categoryId!
    );
    const categoryId = category?.id.toString();

    const blogData = new FormData();
    blogData.append("title", formValues.title);
    blogData.append("body", formValues.body);
    blogData.append("categoryId", categoryId ?? "1");

    if (formValues.banner) {
      blogData.append("banner", formValues.banner);
    }
    if (formValues.other) {
      blogData.append("other", formValues.other);
    }

    blogRepository
      .createBlog(blogData)
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
        setRepositoryDataLoadingFlags({
          ...repositoryDataLoadingFlags,
          isBlogRepositoryDataLoading: false,
        });
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={!user?.emailConfirmed}
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

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              margin="normal"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Body"
              variant="outlined"
              margin="normal"
              name="body"
              value={formValues.body}
              onChange={handleInputChange}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formValues.categoryId}
                onChange={handleInputChange}
              >
                {_.map(categories, (category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ my: 2 }}>
              <InputLabel>Upload Banner</InputLabel>
              <input
                type="file"
                name="banner"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>

            <Box sx={{ my: 2 }}>
              <InputLabel>Body Image</InputLabel>
              <input
                type="file"
                name="other"
                accept="image/*"
                onChange={handleFileChange}
              />
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
