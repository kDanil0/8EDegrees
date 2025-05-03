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
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { supplyChainService } from "../../services/api/supplyChain";
import { inventoryService } from "../../services/api/inventory";

export default function PurchaseOrders() {
  const [orderItems, setOrderItems] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submittedPOs, setSubmittedPOs] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for API data
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch suppliers and products when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [suppliersData, productsData, purchaseOrdersData] =
          await Promise.all([
            supplyChainService.getSuppliers(),
            inventoryService.getProducts(),
            supplyChainService.getPurchaseOrders(),
          ]);

        setSuppliers(suppliersData);
        setProducts(productsData);
        setSubmittedPOs(purchaseOrdersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    if (supplier && item && quantity) {
      const selectedProduct = products.find((p) => p.id === parseInt(item));
      const selectedSupplier = suppliers.find(
        (s) => s.id === parseInt(supplier)
      );

      if (!selectedProduct || !selectedSupplier) {
        setError("Invalid product or supplier selected.");
        return;
      }

      const newItem = {
        product_id: selectedProduct.id,
        supplier_id: selectedSupplier.id,
        product_name: selectedProduct.name,
        supplier_name: selectedSupplier.name,
        quantity: parseInt(quantity),
        unit_price: parseFloat(selectedProduct.price),
        total_price: parseInt(quantity) * parseFloat(selectedProduct.price),
      };

      setOrderItems([...orderItems, newItem]);

      // Reset form fields
      setItem("");
      setQuantity("");

      // Clear any previous errors
      setError(null);
    }
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      setError("Please add at least one item to the order.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create purchase order data object
      const purchaseOrderData = {
        supplier_id: parseInt(supplier),
        order_number: `PO-${Date.now().toString().slice(-6)}`, // Generate a unique order number
        quantity: orderItems.reduce(
          (total, item) => total + parseInt(item.quantity),
          0
        ),
        totalAmount: orderItems.reduce(
          (total, item) => total + item.total_price,
          0
        ),
        orderDate: new Date().toISOString().split("T")[0],
        status: "Approved",
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      // Submit to API
      await supplyChainService.createPurchaseOrder(purchaseOrderData);

      // Fetch updated purchase orders
      const updatedPOs = await supplyChainService.getPurchaseOrders();
      setSubmittedPOs(updatedPOs);

      // Reset order form
      setOrderItems([]);
      setSupplier("");
      setSuccess("Purchase order created successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error submitting purchase order:", err);
      setError("Failed to submit purchase order. Please try again.");
      setLoading(false);
    }
  };

  const handleOpenDetails = async (poId) => {
    try {
      setLoading(true);
      setError(null);
      const poDetails = await supplyChainService.getPurchaseOrder(poId);
      setSelectedPO(poDetails);
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching purchase order ${poId} details:`, err);
      setError("Failed to load purchase order details.");
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPO(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate visible rows based on pagination
  const visibleSubmittedPOs = submittedPOs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && !orderItems.length && !submittedPOs.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Left column */}
        <Grid item xs={12} md={5}>
          {/* Create Order Form */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Create New Order
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={supplier}
                    label="Supplier"
                    onChange={(e) => setSupplier(e.target.value)}
                  >
                    {suppliers.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8}>
                <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                  <InputLabel>Select Product</InputLabel>
                  <Select
                    value={item}
                    label="Select Product"
                    onChange={(e) => setItem(e.target.value)}
                    disabled={!supplier}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ mb: 1 }}
                  disabled={!item}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#a31515",
                    "&:hover": { bgcolor: "#7a1010" },
                  }}
                  onClick={handleAddItem}
                  disabled={!supplier || !item || !quantity}
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Submitted POs Table */}
          <Paper sx={{ p: 2, height: "375px" }}>
            <Typography variant="h6" gutterBottom>
              Submitted Purchase Orders
            </Typography>

            <TableContainer sx={{ maxHeight: 264 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#a31515" }}>
                    <TableCell sx={{ color: "white", py: 1 }}>PO ID</TableCell>
                    <TableCell sx={{ color: "white", py: 1 }}>Date</TableCell>
                    <TableCell sx={{ color: "white", py: 1 }}>
                      Supplier
                    </TableCell>
                    <TableCell sx={{ color: "white", py: 1 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleSubmittedPOs.length > 0 ? (
                    visibleSubmittedPOs.map((po) => (
                      <TableRow
                        key={po.id}
                        hover
                        onClick={() => handleOpenDetails(po.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{po.order_number}</TableCell>
                        <TableCell>{po.orderDate}</TableCell>
                        <TableCell>
                          {po.supplier ? po.supplier.name : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetails(po.id);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No purchase orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={submittedPOs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={7}>
          {/* Order Summary */}
          <Paper sx={{ p: 2, height: "calc(100% - 16px)" }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            {orderItems.length > 0 ? (
              <>
                <TableContainer sx={{ maxHeight: 320 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#a31515" }}>
                        <TableCell sx={{ color: "white", py: 1 }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ color: "white", py: 1 }}>
                          Quantity
                        </TableCell>
                        <TableCell sx={{ color: "white", py: 1 }}>
                          Unit Price
                        </TableCell>
                        <TableCell sx={{ color: "white", py: 1 }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell>${item.total_price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Order Amount:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    $
                    {orderItems
                      .reduce((total, item) => total + item.total_price, 0)
                      .toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    bgcolor: "#a31515",
                    "&:hover": { bgcolor: "#7a1010" },
                  }}
                  onClick={handleSubmitOrder}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit Order"}
                </Button>
              </>
            ) : (
              <Box
                sx={{
                  height: "360px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No items added to this order. Add items from the left panel.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Purchase Order Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Purchase Order Details</DialogTitle>
        <DialogContent>
          {selectedPO && (
            <Box sx={{ minWidth: 400 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Order Number:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPO.order_number}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date Created:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPO.orderDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Supplier:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPO.supplier ? selectedPO.supplier.name : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPO.status}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Order Items:
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPO.items &&
                      selectedPO.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.product ? item.product.name : "N/A"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            ${parseFloat(item.unit_price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            ${parseFloat(item.total_price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Amount:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${parseFloat(selectedPO.totalAmount).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
