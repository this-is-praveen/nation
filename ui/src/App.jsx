import {
  Box,
  CssBaseline,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { darkTheme } from "./theme";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { HomePage } from "./pages/HomePage";
import { SetupPage } from "./pages/SetupPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppErrorBoundary from "./components/ErrorBoundary";
import DocumentsPage from "./pages/DocumentsPage";
import DevTools from "./pages/DevTools";
import { SettingsProvider } from "./contexts/SettingsContext";
import ImageUploadPage from "./pages/ImageUploadPage";

const queryClient = new QueryClient();

const SiteHeader = () => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography
        variant="h4"
        component="div"
        sx={{ flexGrow: 1, fontWeight: 700 }}
      >
        MIST
      </Typography>
    </Toolbar>
  </AppBar>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <SettingsProvider>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/document" element={<DocumentsPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/devtools" element={<DevTools />} />
          <Route path="/add-document" element={<ImageUploadPage />} />
        </Routes>
      </SettingsProvider>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <AppErrorBoundary>
          <CssBaseline />
          <Router>
            <SiteHeader />
            <Box sx={{ display: "flex", pt: "64px", maxHeight: "100vh" }}>
              <NavigationSidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <AnimatedRoutes />
              </Box>
            </Box>
          </Router>
        </AppErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
