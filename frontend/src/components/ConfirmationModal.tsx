// src/components/ConfirmationModal.tsx
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  content,
}: ConfirmationModalProps) {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    minWidth: 300,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {content}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
