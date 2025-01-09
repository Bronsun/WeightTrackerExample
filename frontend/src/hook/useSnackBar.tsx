import { useState } from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<AlertColor>("success");

  const showSnackbar = (
    msg: string,
    sev: AlertColor = "success"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const snackbarElement = (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, snackbarElement };
}
