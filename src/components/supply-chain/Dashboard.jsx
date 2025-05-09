import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import StatsCard from "./StatsCard";
import DeliverySchedule from "./DeliverySchedule";
import PurchaseSchedule from "./PurchaseSchedule";
import { supplyChainService } from "../../services/api/supplyChain";
import { inventoryService } from "../../services/api/inventory";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [discrepancyCount, setDiscrepancyCount] = useState(0);
  const [scheduledDeliveries, setScheduledDeliveries] = useState([]);
  const [pendingPurchases, setPendingPurchases] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch purchase orders - this should always work
        let purchaseOrders = [];
        try {
          purchaseOrders = await supplyChainService.getPurchaseOrders();
        } catch (err) {
          console.warn("Error fetching purchase orders:", err);
          purchaseOrders = [];
        }

        // Fetch low stock products - this should always work
        let lowStockProducts = [];
        try {
          lowStockProducts = await inventoryService.getLowStockProducts();
        } catch (err) {
          console.warn("Error fetching low stock products:", err);
          lowStockProducts = [];
        }

        // Try to fetch delivery history - this might fail if the endpoint isn't ready
        let deliveryHistoryData = [];
        try {
          deliveryHistoryData = await supplyChainService.getDeliveryHistory();
        } catch (err) {
          console.warn("Delivery history not available yet:", err);
        }

        // Count active deliveries (scheduled or in transit)
        const scheduled = purchaseOrders.filter(
          (po) =>
            po.status?.trim().toLowerCase() === "scheduled" ||
            po.status?.trim().toLowerCase() === "in transit"
        );
        setActiveDeliveries(scheduled.length);

        // Get scheduled deliveries for the table
        const scheduledWithDetails = scheduled.map((po) => ({
          date: po.expected_delivery_date
            ? new Date(po.expected_delivery_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "N/A",
          item:
            po.items && po.items.length > 0
              ? po.items
                  .map((item) => (item.product ? item.product.name : "Unknown"))
                  .join(", ")
              : "N/A",
          status: po.status,
        }));
        setScheduledDeliveries(scheduledWithDetails);

        // Count low stock products
        setLowStockCount(lowStockProducts.length);

        // Get approved purchases for the table
        const approved = purchaseOrders.filter(
          (po) => po.status?.trim().toLowerCase() === "approved"
        );
        const approvedWithDetails = approved.map((po) => ({
          date: po.orderDate
            ? new Date(po.orderDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "N/A",
          supplier: po.supplier ? po.supplier.name : "N/A",
          amount: po.totalAmount
            ? `₱${parseFloat(po.totalAmount).toFixed(2)}`
            : "₱0.00",
        }));
        setPendingPurchases(approvedWithDetails);

        // Count discrepancies (Partially Received or Discrepancy Reported)
        const discrepancies = purchaseOrders.filter(
          (po) =>
            po.status?.trim().toLowerCase() === "partially received" ||
            po.status?.trim().toLowerCase() === "discrepancy reported"
        );
        setDiscrepancyCount(discrepancies.length);

        // Set delivery history
        setDeliveryHistory(deliveryHistoryData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Quick Stats
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3, width: "100%" }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Active Deliveries" value={activeDeliveries} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Low Stocks Alert" value={lowStockCount} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Total Discrepancies" value={discrepancyCount} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DeliverySchedule deliveryData={scheduledDeliveries} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PurchaseSchedule purchaseData={pendingPurchases} />
        </Grid>
      </Grid>

      {/* Delivery History Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Delivery History
        </Typography>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  PO Number
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Supplier
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Products
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Received Qty
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Rejected Qty
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Total Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                  Date Received
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryHistory && deliveryHistory.length > 0 ? (
                deliveryHistory.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>{po.order_number || "N/A"}</TableCell>
                    <TableCell>{po.supplier || "N/A"}</TableCell>
                    <TableCell>{po.products || "N/A"}</TableCell>
                    <TableCell>{po.received_quantity || 0}</TableCell>
                    <TableCell>{po.rejected_quantity || 0}</TableCell>
                    <TableCell>
                      ₱{parseFloat(po.total_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{po.date_received || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No delivery history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
