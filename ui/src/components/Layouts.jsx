import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, CssBaseline } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      {/* App Bar (Header) */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HyperForge Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </Box>

      {/* Navigation Pane */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            py: 2,
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#1976d2" : "inherit",
              marginBottom: "1rem",
              fontSize: "1.1rem",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive ? "rgba(25, 118, 210, 0.1)" : "transparent",
            })}
          >
            <HomeIcon sx={{ mr: 1 }} />
            Home
          </NavLink>
          <NavLink
            to="/search"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#1976d2" : "inherit",
              fontSize: "1.1rem",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive ? "rgba(25, 118, 210, 0.1)" : "transparent",
            })}
          >
            <SearchIcon sx={{ mr: 1 }} />
            Search
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
