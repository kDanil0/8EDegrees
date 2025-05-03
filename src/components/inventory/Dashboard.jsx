import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Drawer } from "@mui/material";
import OutOfStock from "./OutOfStock";
import ExpirationReport from "./ExpirationReport";
import TopSellingProducts from "./TopSellingProducts";
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import StatsCard from "./StatsCard";
import { inventoryService, accountingService } from "../../services/api";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [unitSold, setUnitSold] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBasicDashboardData = async () => {
      try {
        setLoading(true);

        // Parallel fetch for product data, sales data, and product usage data
        const [products, productUsage] = await Promise.allSettled([
          inventoryService.getProducts(),
          accountingService.getProductUsageReport(),
        ]);

        // Handle product data (for current stock)
        if (products.status === "fulfilled") {
          const totalStock = products.value.reduce(
            (sum, product) => sum + Number(product.quantity || 0),
            0
          );
          setCurrentStock(totalStock);
        } else {
          console.error("Error fetching products:", products.reason);
          setCurrentStock(0);
        }

        // Handle product usage data for total units sold
        if (
          productUsage.status === "fulfilled" &&
          productUsage.value.products
        ) {
          // Debug product usage data
          console.log("Product usage data:", productUsage.value);

          // Calculate the total quantity from all products
          const totalQuantity = productUsage.value.products.reduce(
            (sum, product) => {
              console.log(
                `Product: ${product.name}, Quantity: ${product.total_quantity}`
              );
              return sum + Number(product.total_quantity || 0);
            },
            0
          );
          console.log("Calculated units sold:", totalQuantity);
          setUnitSold(totalQuantity);

          // For total sales, we can calculate from product usage data too
          const totalSalesAmount = productUsage.value.products.reduce(
            (sum, product) => sum + Number(product.total_amount || 0),
            0
          );
          console.log("Calculated total sales:", totalSalesAmount);
          setTotalSales(totalSalesAmount);
        } else {
          console.error("Error fetching product usage:", productUsage.reason);
          // Use demo data for testing
          console.log("Using demo data for units sold and sales");
          setUnitSold(157);
          setTotalSales(8250.75);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set fallback values if API calls fail
        setCurrentStock(0);
        setTotalSales(0);
        setUnitSold(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicDashboardData();
  }, [refreshProducts]);

  return (
    <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header and action buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Overview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            track and manage inventory, sales and transactions
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#a31515",
              mr: 2,
              "&:hover": { backgroundColor: "#7a1010" },
            }}
            onClick={() => {
              setShowAddProduct(true);
              setShowViewProduct(false);
            }}
          >
            ADD PRODUCT
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#a31515",
              borderColor: "#a31515",
              "&:hover": {
                borderColor: "#7a1010",
                backgroundColor: "rgba(163, 21, 21, 0.04)",
              },
            }}
            onClick={() => {
              setShowViewProduct(true);
              setShowAddProduct(false);
            }}
          >
            VIEW PRODUCT
          </Button>
        </Box>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Sales"
            value={`$${totalSales.toLocaleString()}`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          {console.log("Rendering Unit Sold card with value:", unitSold)}
          <StatsCard
            title="Unit Sold"
            value={unitSold !== undefined ? unitSold : 0}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Current Stock"
            value={currentStock}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Out of Stock and Expiration Reports side by side */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <OutOfStock refresh={refreshProducts} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpirationReport refresh={refreshProducts} />
        </Grid>
      </Grid>

      {/* Top Selling Products below */}
      <Box sx={{ mt: 3 }}>
        <TopSellingProducts refresh={refreshProducts} />
      </Box>

      {/* Add Product Drawer */}
      <Drawer
        anchor="right"
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
      >
        <Box
          sx={{
            width: { xs: 300, sm: 400, md: 450 },
            height: "100vh",
            overflow: "auto",
            bgcolor: "white",
          }}
        >
          <AddProduct
            onClose={() => setShowAddProduct(false)}
            onProductAdded={() => setRefreshProducts((r) => !r)}
          />
        </Box>
      </Drawer>

      {/* View Product Drawer */}
      <Drawer
        anchor="right"
        open={showViewProduct}
        onClose={() => setShowViewProduct(false)}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 650, md: 900 },
            height: "100vh",
            overflow: "auto",
            bgcolor: "white",
          }}
        >
          <ViewProduct
            onClose={() => setShowViewProduct(false)}
            refresh={refreshProducts}
          />
        </Box>
      </Drawer>
    </Box>
  );
}
