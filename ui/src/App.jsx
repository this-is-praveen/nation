import { CssBaseline } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import AppErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppErrorBoundary>
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
};

export default App;
