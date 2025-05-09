import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

/**
 * Component that manages all dialogs used in the POS system
 */
const DialogManager = ({
  customerDialogOpen,
  rewardsDialogOpen,
  customerName,
  customerPhone,
  availableRewards,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onCloseCustomerDialog,
  onSaveCustomer,
  onCloseRewardsDialog,
  onApplyReward,
}) => {
  // Helper function to get reward type icon
  const getRewardIcon = (type) => {
    switch (type) {
      case "percentage_discount":
        return <LocalOfferIcon />;
      case "free_item":
        return <ShoppingBasketIcon />;
      default:
        return <CardGiftcardIcon />;
    }
  };

  // Helper function to get reward description
  const getRewardDescription = (reward) => {
    if (reward.type === "percentage_discount") {
      return `${reward.value}% discount • ${reward.pointsNeeded} points`;
    } else if (reward.type === "free_item" && reward.product) {
      return `Free ${reward.product.name} • ${reward.pointsNeeded} points`;
    } else {
      return `₱${reward.pointsNeeded} discount • ${reward.pointsNeeded} points`;
    }
  };

  return (
    <>
      {/* Customer Information Dialog */}
      <Dialog open={customerDialogOpen} onClose={onCloseCustomerDialog}>
        <DialogTitle>Customer Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCustomerDialog}>Cancel</Button>
          <Button onClick={onSaveCustomer} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rewards Dialog */}
      <Dialog
        open={rewardsDialogOpen}
        onClose={onCloseRewardsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CardGiftcardIcon sx={{ mr: 1 }} />
            Available Rewards
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {availableRewards && availableRewards.length > 0 ? (
            <List>
              {availableRewards.map((reward) => (
                <React.Fragment key={reward.id}>
                  <ListItem
                    button
                    onClick={() => onApplyReward(reward)}
                    sx={{
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(163, 21, 21, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon>{getRewardIcon(reward.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {reward.name}
                        </Typography>
                      }
                      secondary={getRewardDescription(reward)}
                    />
                    <Chip
                      label={`${reward.pointsNeeded} points`}
                      color="primary"
                      size="small"
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No rewards available.
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Earn more points to unlock rewards!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseRewardsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogManager;
