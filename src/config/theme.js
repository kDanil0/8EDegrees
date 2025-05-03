import { createTheme } from "@mui/material/styles";

// Create a custom theme with 8E Degrees brand colors and Poppins font
const theme = createTheme({
  palette: {
    primary: {
      main: "#a31515", // Brand color based on the sidebar
    },
    secondary: {
      main: "#4A4A4A",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#a31515",
          },
        },
      },
    },
  },
});

export default theme; 