import { Alert, AlertTitle } from "@mui/material";
import React, { forwardRef, useEffect } from "react";

const ErrorNotification = forwardRef(function ErrorNotification(props) {
  const { error, setError } = props;
  useEffect(() => {
    setTimeout(() => {
      if (error != null) {
        setError(null);
      }
    }, 2000);
  }, [error]);
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      Error alert — <strong>{error}</strong>
    </Alert>
  );
});

export default ErrorNotification;
