import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Dashboard from "../../components/inventory/Dashboard";

// Create a custom theme with consistent table heights
const theme = createTheme({
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: "200px", // Reduced height to ensure pagination is visible
          overflowY: "auto",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          minHeight: "320px", // Ensure enough space for pagination
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          tableLayout: "fixed",
        },
      },
    },
  },
});

export default function InventoryPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Dashboard />
      </Box>
    </ThemeProvider>
  );
}
