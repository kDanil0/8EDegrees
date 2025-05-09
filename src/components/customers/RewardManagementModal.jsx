import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { customerService } from "../../services/api/customer";
import { inventoryService } from "../../services/api/inventory";

const RewardManagementModal = ({ open, onClose }) => {
  // Form states
  const [rewards, setRewards] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "percentage_discount",
    value: "",
    product_id: "",
    pointsNeeded: "",
    is_active: true,
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRewards();
    fetchProducts();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await customerService.getRewards();
      setRewards(data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      showSnackbar("Failed to load rewards", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await inventoryService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showSnackbar("Failed to load products", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "percentage_discount",
      value: "",
      product_id: "",
      pointsNeeded: "",
      is_active: true,
    });
    setFormErrors({});
    setEditId(null);
    setFormMode("add");
  };

  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (reward) => {
    setFormData({
      name: reward.name,
      description: reward.description || "",
      type: reward.type || "percentage_discount",
      value: reward.value || "",
      product_id: reward.product_id || "",
      pointsNeeded: reward.pointsNeeded,
      is_active: reward.is_active,
    });
    setEditId(reward.id);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when field is changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.pointsNeeded) {
      errors.pointsNeeded = "Points required is required";
    } else if (
      isNaN(Number(formData.pointsNeeded)) ||
      Number(formData.pointsNeeded) <= 0
    ) {
      errors.pointsNeeded = "Points must be a positive number";
    }

    if (formData.type === "percentage_discount") {
      if (!formData.value) {
        errors.value = "Percentage value is required";
      } else if (
        isNaN(Number(formData.value)) ||
        Number(formData.value) <= 0 ||
        Number(formData.value) > 100
      ) {
        errors.value = "Percentage must be between 0 and 100";
      }
    } else if (formData.type === "free_item") {
      if (!formData.product_id) {
        errors.product_id = "Product is required for free item reward";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const rewardData = {
        ...formData,
        pointsNeeded: parseInt(formData.pointsNeeded),
        value:
          formData.type === "percentage_discount"
            ? parseFloat(formData.value)
            : null,
        product_id: formData.type === "free_item" ? formData.product_id : null,
      };

      if (formMode === "add") {
        await customerService.createReward(rewardData);
        showSnackbar("Reward created successfully");
      } else {
        await customerService.updateReward(editId, rewardData);
        showSnackbar("Reward updated successfully");
      }

      fetchRewards();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving reward:", error);
      showSnackbar("Failed to save reward", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      try {
        setLoading(true);
        await customerService.deleteReward(id);
        showSnackbar("Reward deleted successfully");
        fetchRewards();
      } catch (error) {
        console.error("Error deleting reward:", error);
        showSnackbar("Failed to delete reward", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Helper function to render reward type icon
  const renderRewardTypeIcon = (type) => {
    switch (type) {
      case "percentage_discount":
        return <LocalOfferIcon fontSize="small" />;
      case "free_item":
        return <ShoppingBasketIcon fontSize="small" />;
      default:
        return <CardGiftcardIcon fontSize="small" />;
    }
  };

  // Get product name if product_id is set
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: showForm ? "80vh" : "auto" },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Reward Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNewClick}
              disabled={showForm}
            >
              Add New Reward
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {loading && !showForm ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {!showForm ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Points Required</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rewards.length > 0 ? (
                        rewards.map((reward) => (
                          <TableRow key={reward.id}>
                            <TableCell>{reward.name}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                {renderRewardTypeIcon(reward.type)}
                                <Typography ml={1} variant="body2">
                                  {reward.type === "percentage_discount"
                                    ? "Percentage Discount"
                                    : reward.type === "free_item"
                                    ? "Free Item"
                                    : "Legacy Reward"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {reward.type === "percentage_discount"
                                ? `${reward.value}%`
                                : reward.type === "free_item" && reward.product
                                ? getProductName(reward.product_id)
                                : "-"}
                            </TableCell>
                            <TableCell>{reward.pointsNeeded} points</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={reward.is_active ? "Active" : "Inactive"}
                                color={reward.is_active ? "success" : "default"}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(reward)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(reward.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No rewards found. Create your first reward!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box my={2}>
                  <Typography variant="h6" mb={2}>
                    {formMode === "add" ? "Add New Reward" : "Edit Reward"}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Reward Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Points Required"
                        name="pointsNeeded"
                        type="number"
                        value={formData.pointsNeeded}
                        onChange={handleInputChange}
                        error={!!formErrors.pointsNeeded}
                        helperText={formErrors.pointsNeeded}
                        margin="normal"
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Reward Type</InputLabel>
                        <Select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          label="Reward Type"
                        >
                          <MenuItem value="percentage_discount">
                            <Box display="flex" alignItems="center">
                              <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
                              Percentage Discount
                            </Box>
                          </MenuItem>
                          <MenuItem value="free_item">
                            <Box display="flex" alignItems="center">
                              <ShoppingBasketIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                              />
                              Free Item
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {formData.type === "percentage_discount" && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Discount Percentage"
                          name="value"
                          type="number"
                          value={formData.value}
                          onChange={handleInputChange}
                          error={!!formErrors.value}
                          helperText={
                            formErrors.value ||
                            "Enter a value between 0.01 and 100"
                          }
                          margin="normal"
                          InputProps={{ inputProps: { min: 0.01, max: 100 } }}
                          placeholder="e.g., 10 for 10% discount"
                        />
                      </Grid>
                    )}

                    {formData.type === "free_item" && (
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!formErrors.product_id}
                        >
                          <InputLabel>Select Product</InputLabel>
                          <Select
                            name="product_id"
                            value={formData.product_id}
                            onChange={handleInputChange}
                            label="Select Product"
                          >
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name} (₱{product.price})
                              </MenuItem>
                            ))}
                          </Select>
                          {formErrors.product_id && (
                            <FormHelperText>
                              {formErrors.product_id}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            name="is_active"
                            color="primary"
                          />
                        }
                        label="Active"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          {showForm ? (
            <>
              <Button onClick={handleCloseForm}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RewardManagementModal;
