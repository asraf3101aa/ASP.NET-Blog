import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRepository } from "@/contexts/RepositoryContext";
import { Edit } from "@mui/icons-material";
import { useRouter } from "@/contexts/RouterContext";

const EditCommentModal = ({
  blogId,
  commentId,
  currentText,
}: {
  blogId: string;
  commentId: string;
  currentText: string;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ text: string }>({
    defaultValues: {
      text: currentText,
    },
  });

  const [open, setOpen] = useState(false);
  const { handleReload } = useRouter()!;
  const { isLoading, blogRepository } = useRepository()!;

  const onSubmit = async (data: { text: string }) => {
    const response = await blogRepository.updateBlogComment(
      blogId,
      commentId,
      data.text
    );
    if (response) {
      if (typeof response === "string") {
        handleReload();
      }
    }
    setOpen(false);
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
        aria-labelledby="comment-edit-modal-title"
        aria-describedby="comment-edit-modal-description"
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
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" id="comment-edit-modal-title">
            Update Comment
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="text"
              control={control}
              rules={{ required: "Comment text is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comment Text"
                  variant="outlined"
                  error={!!errors.text}
                  helperText={errors.text?.message}
                  {...field}
                  margin="normal"
                />
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
                  Update Comment
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditCommentModal;
