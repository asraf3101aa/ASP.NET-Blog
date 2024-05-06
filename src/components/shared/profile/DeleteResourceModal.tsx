import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DeleteModalType } from "@/@enums/components.enum";

const DeleteResourceModal = ({
  resourceType,
  onDelete,
}: {
  resourceType: DeleteModalType;
  onDelete: () => Promise<void>;
}) => {
  const [open, setIsOpen] = useState(false);
  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div>
      {/* Icon to trigger the modal */}
      <IconButton onClick={() => setIsOpen(true)}>
        <Tooltip title={`Delete ${resourceType}`} arrow placement="right">
          <Delete sx={{ color: "red", cursor: "pointer" }} />
        </Tooltip>
      </IconButton>

      {/* Modal definition */}
      <Dialog open={open} onClose={() => setIsOpen(false)}>
        <DialogTitle>Confirm {resourceType} Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your {resourceType}? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* Cancel button to close the modal without deleting */}
          <Button onClick={() => setIsOpen(false)} color="primary">
            Cancel
          </Button>
          {/* Confirm button to trigger the deletion */}
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteResourceModal;
