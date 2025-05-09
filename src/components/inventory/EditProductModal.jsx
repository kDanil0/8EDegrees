import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LockIcon from "@mui/icons-material/Lock";
import PropTypes from "prop-types";
import StatusBadge from "../common/StatusBadge";
import { inventoryService } from "../../services/api";

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category_id: "",
    stock: "",
    price: "",
    expiryDate: "",
    description: "",
    reorderLevel: "10", // Default reorder level
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getCategories();
        setCategories(data);
        setError("");
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update formData when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        sku: product.sku || "",
        name: product.name || "",
        category_id: product.category_id || "",
        stock: product.stock?.toString() || product.quantity?.toString() || "0",
        price: product.price?.toString() || "",
        expiryDate: product.expiryDate || "",
        description: product.description || "",
        reorderLevel: product.reorderLevel?.toString() || "10",
      });
    }
  }, [product]);

  // Calculated status based on quantity and reorder level
  const calculateStatus = (quantity, reorderLevel) => {
    if (!quantity || !reorderLevel)
      return "Status will be determined automatically";

    const qtyNum = parseInt(quantity);
    const reorderNum = parseInt(reorderLevel);

    if (qtyNum <= 0) {
      return "Out of Stock";
    } else if (qtyNum <= reorderNum) {
      return "Low Stock";
    } else {
      return "In Stock";
    }
  };

  const currentStatus = calculateStatus(formData.stock, formData.reorderLevel);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the selected category object from the categories array
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(formData.category_id)
    );

    // Convert string values to numbers where appropriate and map fields to the expected structure
    const productData = {
      ...product, // Preserve original properties like id
      name: formData.name,
      description: formData.description,
      quantity: parseInt(formData.stock),
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id),
      category: selectedCategory?.name || product.category, // Include category name for UI
      reorderLevel: parseInt(formData.reorderLevel),
      price: parseFloat(formData.price),
      expiryDate: formData.expiryDate || null,
    };

    // Call the onSave function with the updated product data
    onSave(productData);
  };

  if (!product) return null;

  // Find the currently selected category
  const currentCategory = categories.find(
    (cat) => cat.id === parseInt(formData.category_id)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Edit Product
          </Typography>
          {product && (
            <Box mt={1}>
              <StatusBadge status={currentStatus} />
            </Box>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* SKU Field - Read-only */}
            <Grid item xs={12}>
              <TextField
                name="sku"
                label="SKU"
                fullWidth
                value={formData.sku}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                helperText="SKU cannot be modified"
                size="medium"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name *"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Product Name"
                size="medium"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Product Category</InputLabel>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  label="Product Category"
                  disabled={loading}
                >
                  {loading ? (
                    <MenuItem value="">
                      <CircularProgress size={20} />
                      Loading...
                    </MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {error && (
                <Typography color="error" variant="caption">
                  {error}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box
                p={2}
                bgcolor="background.paper"
                border={1}
                borderColor="divider"
                borderRadius={1}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Status:{" "}
                  <span
                    style={{
                      color: currentStatus.includes("Out")
                        ? "red"
                        : currentStatus.includes("Low")
                        ? "orange"
                        : "green",
                    }}
                  >
                    {currentStatus}
                  </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status is automatically determined based on stock quantity and
                  reorder level.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Stock *"
                fullWidth
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="reorderLevel"
                label="Reorder Level *"
                fullWidth
                type="number"
                value={formData.reorderLevel}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price *"
                fullWidth
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                size="medium"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="expiryDate"
                label="Expiry Date"
                type="date"
                fullWidth
                value={formData.expiryDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
                size="medium"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#a31515",
              "&:hover": { backgroundColor: "#7a1010" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EditProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default EditProductModal;
