import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { supplyChainService } from "../../services/api/supplyChain";

export default function LogisticsDeliveries() {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [discrepancyDialogOpen, setDiscrepancyDialogOpen] = useState(false);

  // State for API data
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [ordersWithDiscrepancies, setOrdersWithDiscrepancies] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedPODetails, setSelectedPODetails] = useState(null);

  // Inspection state
  const [inspectionPO, setInspectionPO] = useState("");
  const [inspectionItems, setInspectionItems] = useState([]);
  const [inspectionDate, setInspectionDate] = useState("");

  // Discrepancy state
  const [discrepancyPO, setDiscrepancyPO] = useState("");
  const [discrepancyItems, setDiscrepancyItems] = useState([]);
  const [discrepancyNotes, setDiscrepancyNotes] = useState("");

  // Fetch purchase orders when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Get all purchase orders
      const purchaseOrdersData = await supplyChainService.getPurchaseOrders();

      // Filter for different statuses
      const approvedPOs = purchaseOrdersData.filter(
        (po) => po.status.trim().toLowerCase() === "approved"
      );
      setPurchaseOrders(approvedPOs);

      const scheduledPOs = purchaseOrdersData.filter((po) => {
        const status = po.status.trim().toLowerCase();
        return status === "scheduled" || status === "in transit";
      });
      setDeliveries(scheduledPOs);

      // Orders with discrepancies that need documentation
      const ordersNeedingDiscrepancyReporting = purchaseOrdersData.filter(
        (po) => {
          return po.status.trim().toLowerCase() === "partially received";
        }
      );
      setOrdersWithDiscrepancies(ordersNeedingDiscrepancyReporting);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      setError("Failed to load purchase order data.");
      setLoading(false);
    }
  };

  const handleOpenScheduleDialog = () => {
    setSelectedPO("");
    setExpectedDeliveryDate("");
    setNotes("");
    setSelectedPODetails(null);
    setScheduleDialogOpen(true);
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false);
  };

  const handleOpenInspectionDialog = () => {
    setInspectionPO("");
    setInspectionItems([]);
    setInspectionDate(new Date().toISOString().split("T")[0]);
    setInspectionDialogOpen(true);
  };

  const handleCloseInspectionDialog = () => {
    setInspectionDialogOpen(false);
  };

  const handleOpenDiscrepancyDialog = () => {
    setDiscrepancyPO("");
    setDiscrepancyItems([]);
    setDiscrepancyNotes("");
    setDiscrepancyDialogOpen(true);
  };

  const handleCloseDiscrepancyDialog = () => {
    setDiscrepancyDialogOpen(false);
  };

  const handlePOChange = async (e) => {
    const poId = e.target.value;
    setSelectedPO(poId);

    if (poId) {
      try {
        setLoading(true);
        const poDetails = await supplyChainService.getPurchaseOrder(poId);
        setSelectedPODetails(poDetails);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching purchase order ${poId} details:`, err);
        setError("Failed to load purchase order details.");
        setLoading(false);
      }
    } else {
      setSelectedPODetails(null);
    }
  };

  const handleInspectionPOChange = async (e) => {
    const poId = e.target.value;
    setInspectionPO(poId);

    if (poId) {
      try {
        setLoading(true);
        const poDetails = await supplyChainService.getPurchaseOrder(poId);
        // Initialize inspection items with items from the PO
        const initializedItems = poDetails.items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product ? item.product.name : "Unknown",
          ordered_quantity: item.quantity,
          received_quantity: item.quantity, // Default to full quantity received
          rejected_quantity: 0,
        }));
        setInspectionItems(initializedItems);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching purchase order ${poId} details:`, err);
        setError("Failed to load purchase order details.");
        setLoading(false);
      }
    } else {
      setInspectionItems([]);
    }
  };

  const handleDiscrepancyPOChange = async (e) => {
    const poId = e.target.value;
    setDiscrepancyPO(poId);

    if (poId) {
      try {
        setLoading(true);
        const poDetails = await supplyChainService.getPurchaseOrder(poId);

        // Only include items that have been rejected during inspection
        const rejectedItems = poDetails.items
          .filter((item) => item.rejected_quantity > 0)
          .map((item) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product ? item.product.name : "Unknown",
            ordered_quantity: item.quantity,
            rejected_quantity: item.rejected_quantity, // Already set during inspection
            rejection_notes: item.rejection_notes || "", // May be empty, needs documentation
          }));

        if (rejectedItems.length === 0) {
          setError("No rejected items found for this purchase order.");
        }

        setDiscrepancyItems(rejectedItems);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching purchase order ${poId} details:`, err);
        setError("Failed to load purchase order details.");
        setLoading(false);
      }
    } else {
      setDiscrepancyItems([]);
    }
  };

  const handleScheduleDelivery = async () => {
    if (!selectedPO || !expectedDeliveryDate) {
      setError("Please select a purchase order and delivery date.");
      return;
    }

    try {
      setLoading(true);

      // Update the purchase order with expected delivery date and change status to Scheduled
      await supplyChainService.updatePurchaseOrder(selectedPO, {
        expected_delivery_date: expectedDeliveryDate,
        notes: notes,
        status: "Scheduled",
      });

      // Refresh the data
      await fetchData();

      setScheduleDialogOpen(false);
      setSuccess("Delivery scheduled successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error scheduling delivery:", err);
      setError("Failed to schedule delivery. Please try again.");
      setLoading(false);
    }
  };

  const handleReceivedQuantityChange = (index, value) => {
    const updatedItems = [...inspectionItems];
    updatedItems[index].received_quantity = parseInt(value) || 0;
    setInspectionItems(updatedItems);
  };

  const handleRejectedQuantityChange = (index, value) => {
    const updatedItems = [...discrepancyItems];
    updatedItems[index].rejected_quantity = parseInt(value) || 0;
    setDiscrepancyItems(updatedItems);
  };

  const handleRejectionNotesChange = (index, value) => {
    const updatedItems = [...discrepancyItems];
    updatedItems[index].rejection_notes = value;
    setDiscrepancyItems(updatedItems);
  };

  const handleSubmitInspection = async () => {
    if (!inspectionPO || !inspectionDate) {
      setError("Please select a purchase order and inspection date.");
      return;
    }

    try {
      setLoading(true);

      // Prepare items for API call
      const itemsForSubmission = inspectionItems.map((item) => ({
        id: item.id,
        received_quantity: item.received_quantity,
        rejected_quantity: item.ordered_quantity - item.received_quantity,
      }));

      // Send to API
      await supplyChainService.receivePurchaseOrder(
        inspectionPO,
        itemsForSubmission
      );

      // Refresh data
      await fetchData();

      setInspectionDialogOpen(false);
      setSuccess(
        "Inspection recorded successfully! Products have been added to inventory."
      );

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error recording inspection:", err);
      setError("Failed to record inspection. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmitDiscrepancy = async () => {
    if (!discrepancyPO) {
      setError("Please select a purchase order.");
      return;
    }

    // Check if all rejected items have notes
    if (discrepancyItems.some((item) => item.rejection_notes.trim() === "")) {
      setError("Please provide notes for all rejected items.");
      return;
    }

    try {
      setLoading(true);

      // Prepare items for API - only need id, rejection_notes since quantities are already set
      const itemsWithNotes = discrepancyItems.map((item) => ({
        id: item.id,
        rejection_notes: item.rejection_notes,
      }));

      // Send to API
      await supplyChainService.recordDiscrepancies(
        discrepancyPO,
        itemsWithNotes
      );

      // Refresh data
      await fetchData();

      setDiscrepancyDialogOpen(false);
      setSuccess("Discrepancy documentation completed successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error documenting discrepancies:", err);
      setError("Failed to document discrepancies. Please try again.");
      setLoading(false);
    }
  };

  // Delivery tracking card component
  const DeliveryCard = ({ item }) => (
    <Paper
      sx={{
        p: 2,
        mb: 1,
        borderLeft: `4px solid ${
          item.status === "Delivered"
            ? "#4caf50"
            : item.status === "Scheduled"
            ? "#ff9800"
            : "#f44336"
        }`,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6">{item.order_number}</Typography>
        <Chip
          label={item.status}
          color={
            item.status === "Delivered"
              ? "success"
              : item.status === "Scheduled"
              ? "warning"
              : "error"
          }
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        Supplier: {item.supplier ? item.supplier.name : "N/A"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Expected Delivery: {item.expected_delivery_date || "Not scheduled"}
      </Typography>
    </Paper>
  );

  if (loading && !purchaseOrders.length && !deliveries.length) {
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

      {/* Delivery Scheduling Section */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: "#FFF5F5",
          borderLeft: "4px solid #a31515",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#a31515">
          Delivery Scheduling
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Plan and track delivery dates to ensure timely arrivals of ingredients
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
          onClick={handleOpenScheduleDialog}
          disabled={purchaseOrders.length === 0}
        >
          Schedule Delivery
        </Button>
      </Paper>

      {/* Delivery Tracking Section */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: "#FFF5F5",
          borderLeft: "4px solid #a31515",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#a31515">
          Delivery Tracking
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Monitor real-time delivery status and updates upon arrival
        </Typography>
        {deliveries.length > 0 ? (
          <Grid container spacing={2}>
            {deliveries.map((item) => (
              <Grid item xs={12} sm={4} key={item.id}>
                <DeliveryCard item={item} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 2 }}
          >
            No scheduled deliveries found
          </Typography>
        )}
      </Paper>

      {/* Receiving and Inspection Section */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: "#FFF5F5",
          borderLeft: "4px solid #a31515",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#a31515">
          Receiving and Inspection
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Log received items and inspect for quality, quantity, and condition
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
          onClick={handleOpenInspectionDialog}
          disabled={
            deliveries.filter(
              (d) => d.status === "Scheduled" || d.status === "In Transit"
            ).length === 0
          }
        >
          Log Inspection
        </Button>
      </Paper>

      {/* Discrepancy Handling Section */}
      <Paper sx={{ p: 2, bgcolor: "#FFF5F5", borderLeft: "4px solid #a31515" }}>
        <Typography variant="h6" fontWeight="bold" color="#a31515">
          Discrepancy Documentation
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Document rejected items from inspections with detailed notes
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
          onClick={handleOpenDiscrepancyDialog}
          disabled={ordersWithDiscrepancies.length === 0}
        >
          Document Rejected Items
        </Button>
        {ordersWithDiscrepancies.length === 0 && (
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "text.secondary" }}
          >
            No purchase orders with rejected items require documentation
          </Typography>
        )}
      </Paper>

      {/* Schedule Delivery Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={handleCloseScheduleDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#f8f8f8" }}>
          Schedule New Delivery
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Purchase Order</InputLabel>
                    <Select
                      label="Purchase Order"
                      value={selectedPO}
                      onChange={handlePOChange}
                    >
                      <MenuItem value="">Select a purchase order</MenuItem>
                      {purchaseOrders.map((po) => (
                        <MenuItem key={po.id} value={po.id}>
                          {po.order_number} -{" "}
                          {po.supplier ? po.supplier.name : "N/A"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Expected Delivery Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Notes"
                    multiline
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
              </Grid>

              {selectedPODetails && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Purchase Order Details
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedPODetails.items &&
                          selectedPODetails.items.map((item) => (
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
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Order Date:</strong> {selectedPODetails.orderDate}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Amount:</strong> $
                      {parseFloat(selectedPODetails.totalAmount).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
            onClick={handleScheduleDelivery}
            disabled={!selectedPO || !expectedDeliveryDate || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Log Inspection Dialog */}
      <Dialog
        open={inspectionDialogOpen}
        onClose={handleCloseInspectionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#f8f8f8" }}>Log Inspection</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Purchase Order</InputLabel>
                  <Select
                    label="Purchase Order"
                    value={inspectionPO}
                    onChange={handleInspectionPOChange}
                  >
                    <MenuItem value="">Select a purchase order</MenuItem>
                    {deliveries
                      .filter(
                        (d) =>
                          d.status === "Scheduled" || d.status === "In Transit"
                      )
                      .map((delivery) => (
                        <MenuItem key={delivery.id} value={delivery.id}>
                          {delivery.order_number} -{" "}
                          {delivery.supplier ? delivery.supplier.name : "N/A"}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Inspection Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                />
              </Grid>

              {inspectionItems.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Inspection Details
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Ordered Quantity</TableCell>
                          <TableCell>Good Quantity</TableCell>
                          <TableCell>Rejected Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inspectionItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.ordered_quantity}</TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                value={item.received_quantity}
                                onChange={(e) =>
                                  handleReceivedQuantityChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                inputProps={{
                                  min: 0,
                                  max: item.ordered_quantity,
                                }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell>
                              {item.ordered_quantity - item.received_quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Adjust the "Good Quantity" to record how many items passed
                    inspection. The difference will be calculated as rejected.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInspectionDialog}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
            onClick={handleSubmitInspection}
            disabled={
              !inspectionPO ||
              !inspectionDate ||
              loading ||
              inspectionItems.length === 0
            }
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Discrepancy Dialog */}
      <Dialog
        open={discrepancyDialogOpen}
        onClose={handleCloseDiscrepancyDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#f8f8f8" }}>
          Document Rejected Items
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Purchase Order with Discrepancies</InputLabel>
                  <Select
                    label="Purchase Order with Discrepancies"
                    value={discrepancyPO}
                    onChange={handleDiscrepancyPOChange}
                  >
                    <MenuItem value="">Select a purchase order</MenuItem>
                    {ordersWithDiscrepancies.map((order) => (
                      <MenuItem key={order.id} value={order.id}>
                        {order.order_number} -{" "}
                        {order.supplier ? order.supplier.name : "N/A"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {discrepancyItems.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="General Discrepancy Notes"
                      multiline
                      rows={2}
                      sx={{ mb: 2 }}
                      value={discrepancyNotes}
                      onChange={(e) => setDiscrepancyNotes(e.target.value)}
                      placeholder="Optional general notes about all discrepancies"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Document Rejected Items
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      These items were rejected during inspection. Please
                      provide detailed notes about the rejection reason.
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Ordered Qty</TableCell>
                            <TableCell>Rejected Qty</TableCell>
                            <TableCell>Rejection Notes (Required)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {discrepancyItems.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.ordered_quantity}</TableCell>
                              <TableCell>{item.rejected_quantity}</TableCell>
                              <TableCell>
                                <TextField
                                  required
                                  size="small"
                                  placeholder="Describe why items were rejected"
                                  value={item.rejection_notes}
                                  onChange={(e) =>
                                    handleRejectionNotesChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  sx={{ width: "100%" }}
                                  error={item.rejection_notes.trim() === ""}
                                  helperText={
                                    item.rejection_notes.trim() === ""
                                      ? "Required"
                                      : ""
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiscrepancyDialog}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
            onClick={handleSubmitDiscrepancy}
            disabled={
              !discrepancyPO ||
              loading ||
              discrepancyItems.length === 0 ||
              discrepancyItems.some(
                (item) => item.rejection_notes.trim() === ""
              )
            }
          >
            {loading ? <CircularProgress size={24} /> : "Submit Documentation"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
