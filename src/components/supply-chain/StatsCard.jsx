import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function StatsCard({ title, value }) {
  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        bgcolor: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "left",
      }}
    >
      <Typography variant="subtitle1" color="gray" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
}
