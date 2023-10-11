import Box from "@mui/material/Box";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import React from "react";
import { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface State extends SnackbarOrigin {
  open: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// AlertSnack component
export default function AlertSnack({
  message,
  isOpen,
  severity,
}: {
  message: string;
  isOpen: boolean;
  severity: "success" | "info" | "warning" | "error";
}) {
  const [state, setState] = useState<State>({
    open: isOpen, // Use the provided isOpen prop
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = state;

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
      
        key={vertical + horizontal}
      >
        <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
