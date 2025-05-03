import React, { useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { useReactToPrint } from "react-to-print";

/**
 * Component for displaying and printing e-receipts
 */
const Receipt = ({
  open,
  onClose,
  transaction,
  customer,
  cartItems,
  subtotal,
  discount,
  total,
  pointsEarned,
  appliedReward,
}) => {
  const receiptRef = useRef();
  const currentDate = new Date().toLocaleString();

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${transaction?.id || "POS"}`,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {/* Printable receipt content */}
        <Paper
          ref={receiptRef}
          sx={{
            p: 3,
            minHeight: "60vh",
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              8E Degrees
            </Typography>
            <Typography variant="body2">123 Main Street, City</Typography>
            <Typography variant="body2">Tel: (123) 456-7890</Typography>
            <Typography variant="body2" gutterBottom>
              {currentDate}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Receipt #{transaction?.id || "POS-TEMP"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {customer && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Customer: {customer.name}</Typography>
              <Typography variant="body2">
                Phone: {customer.contactNum}
              </Typography>
              {pointsEarned > 0 && (
                <Typography variant="body2" color="primary">
                  Points Earned: {pointsEarned}
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.product_id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal:</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>

            {discount > 0 && appliedReward && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Discount ({appliedReward.name}):</Typography>
                <Typography>-${discount.toFixed(2)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2">
              Thank you for your purchase!
            </Typography>
            <Typography variant="body2">Please come again</Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<CloseIcon />} onClick={onClose}>
          Close
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handlePrint}
          variant="outlined"
        >
          Download
        </Button>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          variant="contained"
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Receipt;
