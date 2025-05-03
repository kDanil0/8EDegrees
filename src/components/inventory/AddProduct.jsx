import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PropTypes from "prop-types";
import { inventoryService } from "../../services/api";

const AddProduct = ({ onClose, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    quantity: "",
    price: "",
    expiryDate: "",
    description: "",
    reorderLevel: "10", // Default reorder level
  });

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

  const currentStatus = calculateStatus(
    formData.quantity,
    formData.reorderLevel
  );

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await inventoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert string values to numbers where appropriate
      const productData = {
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        category_id: formData.category_id,
        reorderLevel: parseInt(formData.reorderLevel),
        price: parseFloat(formData.price),
        expiryDate: formData.expiryDate || null,
      };

      await inventoryService.createProduct(productData);

      // Notify parent component
      if (onProductAdded) onProductAdded();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Add Product
        </Typography>
        <IconButton onClick={onClose}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Product Name *"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Product Name *"
              size="medium"
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required sx={{ mb: 1 }}>
              <InputLabel>Product Category *</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Product Category *"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="quantity"
              label="Quantity *"
              fullWidth
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="Quantity *"
              size="medium"
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="reorderLevel"
              label="Reorder Level *"
              fullWidth
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
              placeholder="Reorder Level *"
              size="medium"
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="price"
              label="Price *"
              fullWidth
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Price *"
              size="medium"
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              mb={1}
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
                Status is automatically determined based on quantity and reorder
                level.
              </Typography>
            </Box>
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
              placeholder="mm/dd/yyyy"
              size="medium"
              sx={{ mb: 1 }}
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
              placeholder="Description"
              size="medium"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "#a31515",
                "&:hover": { backgroundColor: "#7a1010" },
                py: 1.5,
              }}
            >
              {loading ? "ADDING PRODUCT..." : "ADD PRODUCT"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

AddProduct.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProductAdded: PropTypes.func,
};

export default AddProduct;
