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
  Link,
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";
import inventoryService from "../../services/api/inventory";

const OutOfStock = ({ refresh }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getLowStockProducts();

        // Process all low stock products for pagination
        const lowStockProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.quantity,
          reorderLevel: product.reorderLevel,
          // In a real app, you might want to calculate this from order history
          outOfStockSince:
            product.quantity <= 0
              ? new Date().toISOString().split("T")[0]
              : null,
        }));

        setProducts(lowStockProducts);
        setTotalPages(Math.ceil(lowStockProducts.length / rowsPerPage));
      } catch (error) {
        console.error("Error fetching low stock products:", error);
        // Set empty products array on error
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [refresh]);

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return dateString;
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current page's products
  const currentProducts = products.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6" fontWeight="bold">
          Out of Stock
        </Typography>
        <Link
          href="#"
          underline="hover"
          sx={{
            color: "#0645AD",
            fontSize: "0.875rem",
            "&:hover": { color: "#3366BB" },
          }}
        >
          VIEW ALL
        </Link>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={2} flex="1">
          <CircularProgress size={30} sx={{ color: "#a31515" }} />
        </Box>
      ) : products.length === 0 ? (
        <Box py={2} textAlign="center" flex="1">
          <Typography variant="body2" color="text.secondary">
            No products are currently out of stock or low in inventory.
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" flex="1">
          <TableContainer sx={{ flex: 1, mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      backgroundColor: "white",
                    }}
                  >
                    Product name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      backgroundColor: "white",
                    }}
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      backgroundColor: "white",
                    }}
                  >
                    Out of Stock since
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                      }}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                      }}
                    >
                      {product.sku}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                      }}
                    >
                      {formatDate(product.outOfStockSince)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" py={1} mt="auto">
            <Pagination
              count={Math.max(totalPages, 1)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
};

OutOfStock.propTypes = {
  refresh: PropTypes.bool,
};

export default OutOfStock;
