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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

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
}) => {
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
                  secondary={`$${item.price.toFixed(2)} x ${
                    item.quantity
                  } = $${(item.price * item.quantity).toFixed(2)}`}
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
            Applied Reward: {appliedReward.name} (-$
            {appliedReward.pointsNeeded.toFixed(2)})
          </Alert>
        )}
      </List>

      {/* Order Summary */}
      <Box sx={{ padding: 2, borderTop: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${calculateSubtotal().toFixed(2)}</Typography>
        </Box>

        {calculateDiscount() > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Discount:</Typography>
            <Typography>-${calculateDiscount().toFixed(2)}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
        </Box>

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
          disabled={cartItems.length === 0}
        >
          Process Order
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
