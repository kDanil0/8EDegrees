import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ReceiptIcon from "@mui/icons-material/Receipt";

/**
 * Confirmation dialog for finalizing transactions
 */
const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  cartItems,
  subtotal,
  discount,
  total,
  tenderedCash,
  change,
  customer,
  appliedReward,
  paymentMode,
  referenceNumber,
  selectedDiscount,
}) => {
  // Calculate the percentage discount amount if a discount is selected
  const percentageDiscountAmount = selectedDiscount
    ? (subtotal * selectedDiscount.percentage) / 100
    : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Order</DialogTitle>
      <DialogContent>
        <Box>
          {/* Customer information if available */}
          {customer && (
            <Box mb={2}>
              <Typography variant="subtitle1">
                Customer: {customer.name}
              </Typography>
              <Typography variant="body2">
                Phone: {customer.contactNum}
              </Typography>
            </Box>
          )}

          {/* Payment Mode */}
          <Box mb={2} display="flex" alignItems="center">
            <PaymentIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Payment Mode:
            </Typography>
            <Chip
              label={paymentMode === "cash" ? "Cash" : "E-Wallet"}
              color="primary"
              size="small"
            />
          </Box>

          {/* Items */}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
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
                      ₱{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order summary */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal:</Typography>
              <Typography>₱{subtotal.toFixed(2)}</Typography>
            </Box>

            {discount > 0 && appliedReward && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>
                  Reward Discount{" "}
                  {appliedReward ? `(${appliedReward.name})` : ""}:
                </Typography>
                <Typography>-₱{discount.toFixed(2)}</Typography>
              </Box>
            )}

            {selectedDiscount && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>
                  {selectedDiscount.name} ({selectedDiscount.percentage}%):
                </Typography>
                <Typography>-₱{percentageDiscountAmount.toFixed(2)}</Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">Total:</Typography>
              <Typography variant="subtitle1">₱{total.toFixed(2)}</Typography>
            </Box>

            {/* Show cash details if payment mode is cash */}
            {paymentMode === "cash" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <CurrencyExchangeIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography>Tendered Cash:</Typography>
                  </Box>
                  <Typography>₱{tenderedCash.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontWeight="bold">Change:</Typography>
                  <Typography fontWeight="bold">
                    ₱{change.toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}

            {/* Show reference number if payment mode is e-wallet */}
            {paymentMode === "ewallet" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Box display="flex" alignItems="center">
                  <ReceiptIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography>Reference Number:</Typography>
                </Box>
                <Typography>{referenceNumber}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CancelIcon />}
          onClick={onClose}
          color="error"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          startIcon={<CheckCircleOutlineIcon />}
          onClick={onConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          Confirm Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
