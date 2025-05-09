import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Divider,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import PropTypes from "prop-types";
import StatusBadge from "../common/StatusBadge";

const ProductDetailsModal = ({ open, onClose, product, onEdit, onDelete }) => {
  if (!product) return null;

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not Applicable";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Product Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          {/* Product Header */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                SKU: {product.sku}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <StatusBadge
                  status={product.status || "In Stock"}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={product.category}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ₱{parseFloat(product.price).toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Product Details Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{ p: 2, height: "100%" }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Inventory Information
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <InventoryIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body2">
                    <strong>Current Stock:</strong> {product.stock} units
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CalendarTodayIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body2">
                    <strong>Expiry Date:</strong>{" "}
                    {formatDate(product.expiryDate)}
                  </Typography>
                </Box>

                {product.reorderLevel && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Reorder Level:</strong> {product.reorderLevel} units
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{ p: 2, height: "100%" }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Product Description
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {product.description ||
                    "No description available for this product."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Information */}
          {product.supplier && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Supplier Information
              </Typography>
              <Typography variant="body2">
                <strong>Supplier:</strong> {product.supplier}
              </Typography>
              {product.location && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Storage Location:</strong> {product.location}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(product)}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit(product)}
          sx={{
            backgroundColor: "#a31515",
            "&:hover": { backgroundColor: "#7a1010" },
          }}
        >
          Edit Product
        </Button>
      </Box>
    </Dialog>
  );
};

ProductDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductDetailsModal;
