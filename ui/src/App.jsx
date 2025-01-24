import { CssBaseline } from "@mui/material";
import React from "react";
import AnimatedCursor from "react-animated-cursor";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/ErrorBoundary";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppErrorBoundary>
        <AnimatedCursor
          innerSize={8}
          outerSize={35}
          innerScale={1}
          outerScale={2}
          outerAlpha={0}
          hasBlendMode={true}
          innerStyle={{
            backgroundColor: "black",
          }}
          outerStyle={{
            border: "3px solid black",
          }}
        />

        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
};

export default App;
