import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import AddPhotoIcon from "@mui/icons-material/AddAPhoto";
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const NavigationSidebar = () => (
  <Paper
    elevation={0}
    sx={{
      width: 80,
      height: "calc(100vh - 65px)",
      borderRadius: 0,
      backgroundColor: "background.paper",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      py: 4,
    }}
  >
    {/* Main Navigation */}
    <List sx={{ width: "100%", flexGrow: 1 }}>
      {[
        { text: "Home", path: "/", icon: <HomeIcon /> },
        { text: "Documents", path: "/document", icon: <DescriptionIcon /> },
        { text: "Add Data", path: "/add-document", icon: <AddPhotoIcon /> },
        { text: "Chat bot", path: "/chat-bot", icon: <SmartToyIcon /> },
        { text: "Settings", path: "/setup", icon: <SettingsIcon /> },
      ].map((item) => (
        <ListItem
          key={item.text}
          disablePadding
          sx={{
            display: "flex",
            justifyContent: "center",
            "&.active": {
              "& .MuiListItemButton-root": {
                backgroundColor: "primary.main",
                "& .MuiSvgIcon-root": { color: "common.black" },
              },
            },
          }}
        >
          <ListItemButton
            component={NavLink}
            to={item.path}
            sx={{
              flexDirection: "column",
              justifyContent: "center",
              height: 80,
              borderRadius: 2,
              mx: 1,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <ListItemIcon sx={{ justifyContent: "center", minWidth: "auto" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                variant: "caption",
                textAlign: "center",
                fontSize: 10,
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    {/* Developer Mode Icon at the Bottom */}
    <Box sx={{ width: "100%", pb: 2 }}>
      <ListItem disablePadding sx={{ display: "flex", justifyContent: "center" }}>
        <ListItemButton
          component={NavLink}
          to="/devtools"
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            height: 80,
            borderRadius: 2,
            mx: 1,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <ListItemIcon sx={{ justifyContent: "center", minWidth: "auto" }}>
            <DeveloperModeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dev"
            primaryTypographyProps={{
              variant: "caption",
              textAlign: "center",
              fontSize: 10,
            }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  </Paper>
);
