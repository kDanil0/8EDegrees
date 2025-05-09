import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Alert,
  TextField,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import DiscountIcon from "@mui/icons-material/Discount";

/**
 * Component for displaying the cart summary and order processing
 */
const CartSummary = ({
  cartItems,
  customer,
  appliedReward,
  onAddItem,
  onRemoveItem,
  onOpenCustomerDialog,
  onOpenRewardsDialog,
  onProcessOrder,
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  tenderedCash,
  onTenderedCashChange,
  change,
  paymentMode,
  onPaymentModeChange,
  referenceNumber,
  onReferenceNumberChange,
  discounts,
  selectedDiscount,
  onDiscountChange,
  calculateDiscountAmount,
}) => {
  // Calculate the total discount amount (reward + percentage discount)
  const totalDiscountAmount = appliedReward ? calculateDiscount() : 0;
  const percentageDiscountAmount = selectedDiscount
    ? (calculateSubtotal() * selectedDiscount.percentage) / 100
    : 0;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ padding: 2, backgroundColor: "#a31515", color: "white" }}>
        <Typography variant="h5">Current Order</Typography>
        {customer && (
          <Typography variant="body2">
            Customer: {customer.name} • Points: {customer.points}
          </Typography>
        )}
      </Box>

      {/* Cart Items */}
      <List sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Paper key={item.product_id} sx={{ mb: 1, p: 1 }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveItem(item.product_id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton
                      edge="end"
                      onClick={() =>
                        onAddItem({
                          id: item.product_id,
                          name: item.name,
                          sellingPrice: item.price,
                        })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={`₱${item.price.toFixed(2)} x ${
                    item.quantity
                  } = ₱${(item.price * item.quantity).toFixed(2)}`}
                />
              </ListItem>
            </Paper>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", my: 4, color: "text.secondary" }}
          >
            Cart is empty. Please add items.
          </Typography>
        )}

        {appliedReward && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Applied Reward: {appliedReward.name} (-₱
            {appliedReward.pointsNeeded.toFixed(2)})
          </Alert>
        )}
      </List>

      {/* Order Summary */}
      <Box sx={{ padding: 2, borderTop: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>₱{calculateSubtotal().toFixed(2)}</Typography>
        </Box>

        {appliedReward && calculateDiscount() > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Reward Discount:</Typography>
            <Typography>-₱{calculateDiscount().toFixed(2)}</Typography>
          </Box>
        )}

        {selectedDiscount && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>
              {selectedDiscount.name} ({selectedDiscount.percentage}%):
            </Typography>
            <Typography>-₱{percentageDiscountAmount.toFixed(2)}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">₱{calculateTotal().toFixed(2)}</Typography>
        </Box>

        {/* Discount Selector */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="discount-select-label">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DiscountIcon fontSize="small" sx={{ mr: 1 }} />
              Apply Discount
            </Box>
          </InputLabel>
          <Select
            labelId="discount-select-label"
            value={selectedDiscount ? selectedDiscount.id : ""}
            onChange={(e) => onDiscountChange(e.target.value)}
            label="Apply Discount"
            size="small"
          >
            <MenuItem value="">
              <em>No Discount</em>
            </MenuItem>
            {discounts.map((discount) => (
              <MenuItem key={discount.id} value={discount.id}>
                {discount.name} ({discount.percentage}%)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Payment Mode Selection */}
        <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
          <FormLabel component="legend">Payment Mode</FormLabel>
          <RadioGroup
            row
            value={paymentMode}
            onChange={(e) => onPaymentModeChange(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel
              value="ewallet"
              control={<Radio />}
              label="E-Wallet"
            />
          </RadioGroup>
        </FormControl>

        {/* Tendered Cash Input (Only shown for cash payment) */}
        {paymentMode === "cash" && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tendered Cash"
              type="number"
              value={tenderedCash || ""}
              onChange={(e) => onTenderedCashChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyExchangeIcon />
                  </InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  step: 0.01,
                },
              }}
              variant="outlined"
              size="small"
              placeholder={`Min: ₱${calculateTotal().toFixed(2)}`}
              error={tenderedCash > 0 && tenderedCash < calculateTotal()}
              helperText={
                tenderedCash > 0 && tenderedCash < calculateTotal()
                  ? "Amount is less than total"
                  : ""
              }
            />
            {tenderedCash > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  color: change > 0 ? "success.main" : "text.primary",
                }}
              >
                <Typography fontWeight={change > 0 ? "bold" : "normal"}>
                  Change:
                </Typography>
                <Typography fontWeight={change > 0 ? "bold" : "normal"}>
                  ₱{change.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Reference Number Input (Only shown for e-wallet payment) */}
        {paymentMode === "ewallet" && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Reference Number"
              type="text"
              value={referenceNumber || ""}
              onChange={(e) => onReferenceNumberChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              placeholder="Enter e-wallet reference number"
              required
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={onOpenCustomerDialog}
          >
            {customer ? "Update Customer" : "Add Customer"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<CreditScoreIcon />}
            onClick={onOpenRewardsDialog}
            disabled={!customer || !customer.eligibleForRewards}
          >
            Rewards
          </Button>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={onProcessOrder}
          disabled={
            cartItems.length === 0 ||
            (paymentMode === "cash" &&
              calculateTotal() > 0 &&
              tenderedCash < calculateTotal()) ||
            (paymentMode === "ewallet" && !referenceNumber)
          }
        >
          Process Order
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
