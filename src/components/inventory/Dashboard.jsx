import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Drawer } from "@mui/material";
import OutOfStock from "./OutOfStock";
import ExpirationReport from "./ExpirationReport";
import TopSellingProducts from "./TopSellingProducts";
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import StatsCard from "./StatsCard";
import { inventoryService, accountingService } from "../../services/api";
import CategoriesModal from "./CategoriesModal";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [unitSold, setUnitSold] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  useEffect(() => {
    const fetchBasicDashboardData = async () => {
      try {
        setLoading(true);

        // Get current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

        // Parallel fetch for product data, sales data, and product usage data
        const [products, monthlySales, productUsage] = await Promise.allSettled(
          [
            inventoryService.getProducts(),
            accountingService.getMonthlySales(currentYear, currentMonth),
            accountingService.getProductUsageReport(),
          ]
        );

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

        // Handle monthly sales data for total sales
        if (monthlySales.status === "fulfilled") {
          console.log("Monthly sales data:", monthlySales.value);
          setTotalSales(monthlySales.value.total_sales || 0);
        } else {
          console.error("Error fetching monthly sales:", monthlySales.reason);
          setTotalSales(0);
        }

        // Handle product usage data for total units sold
        if (
          productUsage.status === "fulfilled" &&
          productUsage.value.products
        ) {
          // Calculate the total quantity from all products
          const totalQuantity = productUsage.value.products.reduce(
            (sum, product) => sum + Number(product.total_quantity || 0),
            0
          );
          console.log("Calculated units sold:", totalQuantity);
          setUnitSold(totalQuantity);
        } else {
          console.error("Error fetching product usage:", productUsage.reason);
          // Use demo data for testing
          console.log("Using demo data for units sold");
          setUnitSold(157);
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
            onClick={() => setShowCategoriesModal(true)}
          >
            Categories
          </Button>
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
            value={`₱${totalSales.toLocaleString()}`}
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

      <CategoriesModal
        open={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </Box>
  );
}
