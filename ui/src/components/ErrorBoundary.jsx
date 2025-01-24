import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button, Typography, Box } from "@mui/material";

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography variant="body1" gutterBottom>
        {error.message}
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </Box>
  );
};

const AppErrorBoundary = ({ children }) => {
  const handleError = (error, info) => {
    // Log error to an external service (e.g., Sentry, LogRocket)
    console.error("Logging error:", error, info);
  };

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
