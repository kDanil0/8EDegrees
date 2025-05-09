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
  CircularProgress,
} from "@mui/material";
import StatusBadge from "../common/StatusBadge";
import PropTypes from "prop-types";
import { accountingService } from "../../services/api";
import { inventoryService } from "../../services/api";

// Demo data for fallback if API fails
const DEMO_TOP_PRODUCTS = [
  {
    id: 1,
    name: "Beef Steak",
    category: "Meat",
    stock: 43,
    price: 24.99,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Wagyu A5",
    category: "Premium Meat",
    stock: 28,
    price: 89.99,
    status: "In Stock",
  },
  {
    id: 3,
    name: "Fresh Salmon",
    category: "Seafood",
    stock: 31,
    price: 18.99,
    status: "In Stock",
  },
];

const TopSellingProducts = ({ refresh }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching top selling products from API...");

        // Fetch real top selling products data from accounting service
        const data = await accountingService.getTopSellingProducts(3);
        console.log("API response:", data);

        // If no products returned or empty array, throw an error to use demo data
        if (!data?.products || data.products.length === 0) {
          console.warn("No products data returned from API");
          throw new Error("No products data available");
        }

        // Get the actual product data for each top selling product to get the real price
        const productDetails = [];
        for (const product of data.products) {
          try {
            const productData = await inventoryService.getProduct(product.id);
            productDetails.push({
              id: product.id,
              name: product.name,
              category: product.category_name,
              stock: product.total_quantity, // This is units sold
              price: productData.price, // Use the actual product price
              status: "In Stock", // Always set to "In Stock" for top selling products
            });
          } catch (err) {
            console.error(
              `Error fetching details for product ${product.id}:`,
              err
            );
            // If we can't get the product details, use what we have from the sales data
            productDetails.push({
              id: product.id,
              name: product.name,
              category: product.category_name,
              stock: product.total_quantity,
              price: 0, // Default price if we can't get the real one
              status: "In Stock",
            });
          }
        }

        console.log("Formatted products with actual prices:", productDetails);
        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
        console.log("Using demo data for top selling products");
        // Use demo data for development/testing
        setProducts(DEMO_TOP_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, [refresh]);

  // Function to determine stock status
  const getStockStatus = (quantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
  };

  // Function to format price
  const formatCurrency = (price) => {
    if (!price || isNaN(parseFloat(price))) {
      return "₱0.00";
    }
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Top Selling Products
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={2} flex="1">
          <CircularProgress size={30} sx={{ color: "#a31515" }} />
        </Box>
      ) : products.length === 0 ? (
        <Box py={2} textAlign="center" flex="1">
          <Typography variant="body2" color="text.secondary">
            No sales data available.
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" flex="1">
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#a31515" }}>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                      borderBottom: "none",
                      py: 1,
                      backgroundColor: "#a31515",
                    }}
                  >
                    Product name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                      borderBottom: "none",
                      py: 1,
                      backgroundColor: "#a31515",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                      borderBottom: "none",
                      py: 1,
                      backgroundColor: "#a31515",
                    }}
                  >
                    Units Sold
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                      borderBottom: "none",
                      py: 1,
                      backgroundColor: "#a31515",
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                      borderBottom: "none",
                      py: 1,
                      backgroundColor: "#a31515",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>{product.name}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>{product.category}</TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>
                      {product.stock}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>
                      <StatusBadge status={product.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

TopSellingProducts.propTypes = {
  refresh: PropTypes.bool,
};

export default TopSellingProducts;
