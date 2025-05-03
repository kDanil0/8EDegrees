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
} from "@mui/material";

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
      <Dialog open={rewardsDialogOpen} onClose={onCloseRewardsDialog}>
        <DialogTitle>Available Rewards</DialogTitle>
        <DialogContent>
          {availableRewards.length > 0 ? (
            <List>
              {availableRewards.map((reward) => (
                <ListItem
                  key={reward.id}
                  button
                  onClick={() => onApplyReward(reward)}
                >
                  <ListItemText
                    primary={reward.name}
                    secondary={`Points needed: ${reward.pointsNeeded} • Discount: ₱${reward.pointsNeeded}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No rewards available.</Typography>
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
