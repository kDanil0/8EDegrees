import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "../../config/menuItems";
import { AuthContext } from "../../context/AuthContext";

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if current location is in customer section
  const isCustomerSection = location.pathname.includes("/customers");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#fff",
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Logo and app name */}
        <Box
          sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              background: "#fff0f0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" color="#a31515" fontWeight="bold">
              8
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="#a31515" fontWeight="bold">
            8E Degrees
          </Typography>
        </Box>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
              selected={
                item.path === "/customers"
                  ? isCustomerSection
                  : location.pathname === item.path
              }
              sx={{
                py: 1.5,
                px: 2,
                my: 0.5,
                borderRadius: 1,
                color: "text.primary",
                backgroundColor:
                  (item.path === "/customers" && isCustomerSection) ||
                  location.pathname === item.path
                    ? "#a31515"
                    : "inherit",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    (item.path === "/customers" && isCustomerSection) ||
                    location.pathname === item.path
                      ? "#a31515"
                      : "rgba(163, 21, 21, 0.1)",
                  transform: "translateX(4px)",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color:
                    (item.path === "/customers" && isCustomerSection) ||
                    location.pathname === item.path
                      ? "#fff"
                      : "#a31515",
                  transition: "all 0.2s",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                  color:
                    (item.path === "/customers" && isCustomerSection) ||
                    location.pathname === item.path
                      ? "#fff"
                      : "inherit",
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Spacer to push logout to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout section */}
        <Divider sx={{ my: 1 }} />
        <List sx={{ px: 1 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              my: 0.5,
              borderRadius: 1,
              color: "text.primary",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(163, 21, 21, 0.1)",
                transform: "translateX(4px)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#a31515" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
