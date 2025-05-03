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
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";
import inventoryService from "../../services/api/inventory";

const ExpirationReport = ({ refresh }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getExpirationReport();

        // Process all products for pagination
        const expiringProducts = data.map((product) => {
          // Calculate days until expiry
          const expiryDate = new Date(product.expiryDate);
          const today = new Date();
          const diffTime = expiryDate.getTime() - today.getTime();
          const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: product.id,
            name: product.name,
            expiryDate: product.expiryDate,
            daysUntilExpiry: daysUntilExpiry,
          };
        });

        setProducts(expiringProducts);
        setTotalPages(Math.ceil(expiringProducts.length / rowsPerPage));
      } catch (error) {
        console.error("Error fetching expiring products:", error);
        // Set empty products array on error
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringProducts();
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

  // Function to determine text color based on days remaining
  const getExpiryColor = (days) => {
    if (days <= 7) return "error.main";
    if (days <= 30) return "warning.main";
    return "text.primary";
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
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Expiration Reports
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={2} flex="1">
          <CircularProgress size={30} sx={{ color: "#a31515" }} />
        </Box>
      ) : products.length === 0 ? (
        <Box py={2} textAlign="center" flex="1">
          <Typography variant="body2" color="text.secondary">
            No products are expiring soon.
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
                    Expiry Date
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
                    Days until Expiry
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
                      {formatDate(product.expiryDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        color: getExpiryColor(product.daysUntilExpiry),
                      }}
                    >
                      {product.daysUntilExpiry}
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

ExpirationReport.propTypes = {
  refresh: PropTypes.bool,
};

export default ExpirationReport;
