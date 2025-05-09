import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { customerService } from "../../services/api/customer";

const DiscountManagementModal = ({ open, onClose }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deleteConfirmDiscount, setDeleteConfirmDiscount] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    name: "",
    percentage: "",
    description: "",
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      fetchDiscounts();
    }
  }, [open]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await customerService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      showSnackbar("Failed to load discounts", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewDiscount({
      name: "",
      percentage: "",
      description: "",
      is_active: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDiscount({
      ...newDiscount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!newDiscount.name) {
      showSnackbar("Discount name is required", "error");
      return false;
    }
    if (!newDiscount.percentage || isNaN(newDiscount.percentage)) {
      showSnackbar("Percentage must be a valid number", "error");
      return false;
    }
    if (
      parseFloat(newDiscount.percentage) < 0 ||
      parseFloat(newDiscount.percentage) > 100
    ) {
      showSnackbar("Percentage must be between 0 and 100", "error");
      return false;
    }
    return true;
  };

  const handleAddDiscount = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formattedDiscount = {
        ...newDiscount,
        percentage: parseFloat(newDiscount.percentage),
      };

      await customerService.createDiscount(formattedDiscount);
      resetForm();
      setShowAddForm(false);
      fetchDiscounts();
      showSnackbar("Discount added successfully", "success");
    } catch (error) {
      console.error("Error adding discount:", error);
      showSnackbar("Failed to add discount", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (discount) => {
    setEditingDiscount(discount);
    setNewDiscount({
      name: discount.name,
      percentage: discount.percentage.toString(),
      description: discount.description || "",
      is_active: discount.is_active,
    });
    setShowAddForm(true);
  };

  const handleUpdateDiscount = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formattedDiscount = {
        ...newDiscount,
        percentage: parseFloat(newDiscount.percentage),
      };

      await customerService.updateDiscount(
        editingDiscount.id,
        formattedDiscount
      );
      resetForm();
      setShowAddForm(false);
      setEditingDiscount(null);
      fetchDiscounts();
      showSnackbar("Discount updated successfully", "success");
    } catch (error) {
      console.error("Error updating discount:", error);
      showSnackbar("Failed to update discount", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDiscount) return;

    setLoading(true);
    try {
      await customerService.deleteDiscount(deleteConfirmDiscount.id);
      setDeleteConfirmDiscount(null);
      fetchDiscounts();
      showSnackbar("Discount deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting discount:", error);
      showSnackbar("Failed to delete discount", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmDiscount(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Manage Discounts</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading && (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          )}

          {!loading && !showAddForm && (
            <>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    resetForm();
                    setEditingDiscount(null);
                    setShowAddForm(true);
                  }}
                >
                  Add New Discount
                </Button>
              </Box>

              {discounts.length === 0 ? (
                <Typography textAlign="center" sx={{ my: 4 }}>
                  No discounts found. Create your first discount!
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">Percentage</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {discounts.map((discount) => (
                        <TableRow key={discount.id}>
                          <TableCell>{discount.name}</TableCell>
                          <TableCell align="center">
                            {discount.percentage}%
                          </TableCell>
                          <TableCell>{discount.description || "-"}</TableCell>
                          <TableCell align="center">
                            {discount.is_active ? (
                              <Typography color="success.main">
                                Active
                              </Typography>
                            ) : (
                              <Typography color="error.main">
                                Inactive
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleStartEdit(discount)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setDeleteConfirmDiscount(discount)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {!loading && showAddForm && (
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Typography variant="h6" mb={2}>
                {editingDiscount ? "Edit Discount" : "Add New Discount"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Discount Name"
                    name="name"
                    autoFocus
                    value={newDiscount.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="percentage"
                    label="Percentage (%)"
                    name="percentage"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={newDiscount.percentage}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={2}
                    value={newDiscount.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newDiscount.is_active}
                        onChange={handleInputChange}
                        name="is_active"
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDiscount(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    editingDiscount ? handleUpdateDiscount : handleAddDiscount
                  }
                  disabled={loading}
                >
                  {editingDiscount ? "Update" : "Save"}
                </Button>
              </Box>
            </Box>
          )}

          {/* Delete confirmation */}
          {deleteConfirmDiscount && (
            <Box mt={3} p={2} bgcolor="background.paper" borderRadius={1}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="error"
                gutterBottom
              >
                Confirm Delete
              </Typography>
              <Typography variant="body2" mb={2}>
                Are you sure you want to delete the discount{" "}
                <strong>{deleteConfirmDiscount.name}</strong>? This action
                cannot be undone.
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DiscountManagementModal;
