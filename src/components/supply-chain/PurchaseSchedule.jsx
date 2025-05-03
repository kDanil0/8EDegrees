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
const defaultPurchaseData = [
  { date: "Apr 30", supplier: "ABC Foods", amount: "$1,200" },
  { date: "May 1", supplier: "FreshFarm", amount: "$830" },
  { date: "May 2", supplier: "EcoFre Inc", amount: "$2,340" },
];

export default function PurchaseSchedule({
  purchaseData = defaultPurchaseData,
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
        Purchase Schedule
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#a31515" }}>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Supplier</TableCell>
              <TableCell sx={{ color: "white" }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseData.length > 0 ? (
              purchaseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.supplier}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No pending purchases
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
