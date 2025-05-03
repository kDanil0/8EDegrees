import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Default data for fallback
const defaultDeliveryData = [
  { date: "Apr 30", item: "Frozen Goods", status: "On Route" },
  { date: "May 1", item: "Dairy", status: "Scheduled" },
  { date: "May 2", item: "Vegetables", status: "Pending" },
];

export default function DeliverySchedule({
  deliveryData = defaultDeliveryData,
}) {
  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="black" fontWeight="bold" sx={{ mb: 2 }}>
        Delivery Schedule
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#a31515" }}>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Item</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryData.length > 0 ? (
              deliveryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No scheduled deliveries
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
