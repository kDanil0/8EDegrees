import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

const RewardDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsNeeded: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.pointsNeeded) {
      newErrors.pointsNeeded = "Points needed is required";
    } else if (
      isNaN(formData.pointsNeeded) ||
      parseInt(formData.pointsNeeded) <= 0
    ) {
      newErrors.pointsNeeded = "Points must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        pointsNeeded: parseInt(formData.pointsNeeded),
      });
      setFormData({
        name: "",
        description: "",
        pointsNeeded: "",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Reward</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Reward Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="pointsNeeded"
            label="Points Needed"
            name="pointsNeeded"
            type="number"
            value={formData.pointsNeeded}
            onChange={handleChange}
            error={!!errors.pointsNeeded}
            helperText={errors.pointsNeeded}
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Reward
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardDialog;
