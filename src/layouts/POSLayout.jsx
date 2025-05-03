import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function POSLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: "calc(100vh - 64px)",
          p: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
