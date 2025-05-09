import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { supplyChainService } from "../../services/api/supplyChain";
import SupplierForm from "./SupplierForm";

/**
 * Component for managing suppliers
 */
const SupplierManager = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers from the API
  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await supplyChainService.getSuppliers();
      setSuppliers(data);
      showNotification("Supplier list refreshed successfully", "info");
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Failed to load suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Handle successful supplier creation
  const handleSupplierAdded = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
    showNotification(
      `Supplier "${newSupplier.name}" has been successfully added.`
    );
  };

  // Handle successful supplier update
  const handleSupplierUpdated = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
    showNotification(
      `Supplier "${updatedSupplier.name}" has been successfully updated.`
    );
  };

  // Open the add supplier form
  const handleOpenForm = () => {
    setEditSupplier(null);
    setFormOpen(true);
  };

  // Open the edit supplier form
  const handleEditSupplier = (supplier) => {
    setEditSupplier(supplier);
    setFormOpen(true);
  };

  // Close the supplier form
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditSupplier(null);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteConfirm = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSupplierToDelete(null);
  };

  // Handle supplier deletion
  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    try {
      await supplyChainService.deleteSupplier(supplierToDelete.id);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((s) => s.id !== supplierToDelete.id)
      );
      showNotification(`Supplier "${supplierToDelete.name}" has been deleted.`);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      showNotification("Failed to delete supplier. Please try again.", "error");
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  // Render loading state
  if (loading && suppliers.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Supplier Management
        </Typography>
        <Box>
          <Button
            startIcon={
              loading ? <CircularProgress size={20} /> : <RefreshIcon />
            }
            onClick={fetchSuppliers}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenForm}
            disabled={loading}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Suppliers Table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ position: "relative" }}
      >
        {loading && suppliers.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography>Refreshing suppliers...</Typography>
            </Box>
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contactNum}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Supplier">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditSupplier(supplier)}
                        disabled={loading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Supplier">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(supplier)}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                      }}
                    >
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      <Typography>Loading suppliers...</Typography>
                    </Box>
                  ) : (
                    "No suppliers found"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Supplier Form Dialog */}
      <SupplierForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={editSupplier ? handleSupplierUpdated : handleSupplierAdded}
        supplierData={editSupplier}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {supplierToDelete && (
            <Typography>
              Are you sure you want to delete supplier "{supplierToDelete.name}
              "? This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={handleDeleteSupplier}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notification.severity}
          onClose={handleCloseNotification}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierManager;
