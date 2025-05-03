import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/shared/Sidebar";
import { Outlet } from "react-router-dom";

// Import the drawer width from sidebar to keep consistent
const drawerWidth = 240;

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 1, sm: 1, md: 2 },
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
