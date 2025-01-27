import { Container, CssBaseline } from "@mui/material";
import React from "react";
import AnimatedCursor from "react-animated-cursor";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/ErrorBoundary";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <>
      <AnimatedCursor />

      <Container>
      <Router>
        <CssBaseline />
        <AppErrorBoundary>
          <Routes>
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </AppErrorBoundary>
      </Router>
      </Container>
    </>
  );
};

export default App;
