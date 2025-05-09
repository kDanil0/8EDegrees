import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { supplyChainService } from "../../services/api/supplyChain";

/**
 * Form component for adding or editing a supplier
 */
const SupplierForm = ({ open, onClose, onSuccess, supplierData }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactNum: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Initialize form with supplier data when editing
  useEffect(() => {
    if (supplierData) {
      setFormData({
        name: supplierData.name || "",
        contactNum: supplierData.contactNum || "",
        address: supplierData.address || "",
      });
    }
  }, [supplierData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (!formData.contactNum.trim()) {
      newErrors.contactNum = "Contact number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      let response;

      if (supplierData) {
        // Update existing supplier
        response = await supplyChainService.updateSupplier(
          supplierData.id,
          formData
        );
      } else {
        // Create new supplier
        response = await supplyChainService.createSupplier(formData);
      }

      // Clear form and show success
      setFormData({
        name: "",
        contactNum: "",
        address: "",
      });

      if (onSuccess) {
        onSuccess(response);
      }

      onClose();
    } catch (error) {
      console.error(
        supplierData ? "Error updating supplier:" : "Error creating supplier:",
        error
      );
      setSubmitError(
        error.response?.data?.message ||
          `Failed to ${
            supplierData ? "update" : "create"
          } supplier. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    // Clear form state when dialog closes
    setFormData({
      name: "",
      contactNum: "",
      address: "",
    });
    setErrors({});
    setSubmitError("");
    onClose();
  };

  // Determine if we're editing or adding
  const isEditing = !!supplierData;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Supplier" : "Add New Supplier"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="name"
              label="Supplier Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              required
              disabled={isSubmitting}
            />

            <TextField
              name="contactNum"
              label="Contact Number"
              value={formData.contactNum}
              onChange={handleChange}
              fullWidth
              error={!!errors.contactNum}
              helperText={errors.contactNum}
              required
              disabled={isSubmitting}
            />

            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              error={!!errors.address}
              helperText={errors.address}
              required
              disabled={isSubmitting}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Supplier"
              : "Add Supplier"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierForm;
