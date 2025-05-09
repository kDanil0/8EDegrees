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
  IconButton,
  CircularProgress,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PropTypes from "prop-types";

// Import the new modal components
import EditProductModal from "./EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import StatusBadge from "../common/StatusBadge";
import { inventoryService } from "../../services/api";

const ViewProduct = ({ onClose, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // States for modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const fetchProducts = async () => {
    // Set loading state
    setLoading(true);
    setError(null);

    try {
      // Fetch products from the API
      const data = await inventoryService.getProducts();

      // Transform the data to match the component's expected format
      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category ? product.category.name : "Uncategorized",
        stock: product.quantity,
        price: product.price,
        status: product.status,
        sku: product.sku,
        expiryDate: product.expiryDate,
        description: product.description,
        reorderLevel: product.reorderLevel,
        category_id: product.category_id,
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");

      // Fallback to mock data for development if API fails
      if (process.env.NODE_ENV === "development") {
        const mockProducts = [
          {
            id: 1,
            name: "Test Product",
            category: "Bar & Beverage",
            stock: 33,
            price: 10.0,
            status: "In Stock",
            sku: "B&B-454865",
            expiryDate: "2025-09-11",
            description: "A premium quality product for bars and restaurants.",
          },
          // Keep some mock data as fallback
          {
            id: 2,
            name: "Classic Coffee",
            category: "Beverages",
            stock: 10,
            price: 7.0,
            status: "Low Stock",
            sku: "C&S-301680",
            expiryDate: null,
            description: "Premium coffee beans from selected farms.",
          },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() !== "") {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setPage(1);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (e) {
      return dateString;
    }
  };

  // Function to handle edit button click
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  // Function to handle product row click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  // Function to handle saving edited product
  const handleSaveEdit = async (updatedProduct) => {
    console.log("Saving updated product:", updatedProduct);

    try {
      // Format the data for the API
      const productData = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        category_id: updatedProduct.category_id,
        quantity: parseInt(updatedProduct.quantity || updatedProduct.stock), // Handle both field names
        stock: parseInt(updatedProduct.quantity || updatedProduct.stock), // Ensure stock is also updated
        reorderLevel: parseInt(updatedProduct.reorderLevel),
        price: parseFloat(updatedProduct.price),
        expiryDate: updatedProduct.expiryDate || null,
        // Include category data for UI purposes even if API doesn't need it
        category: updatedProduct.category,
      };

      // Update the product via API
      await inventoryService.updateProduct(productData.id, productData);
      fetchProducts(); // Refresh the product list
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      // Still update the UI even if API fails (for development)
      const updatedProducts = products.map((p) =>
        p.id === updatedProduct.id
          ? {
              ...p,
              ...updatedProduct,
              // Make sure stock is correctly represented for UI
              stock: parseInt(updatedProduct.quantity || updatedProduct.stock),
              // Ensure category is displayed correctly
              category: updatedProduct.category,
            }
          : p
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditModalOpen(false);
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (product) => {
    console.log("Deleting product:", product);

    try {
      // Delete via API
      await inventoryService.deleteProduct(product.id);
      fetchProducts(); // Refresh the product list
      setDetailsModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      // Still update the UI even if API fails (for development)
      const updatedProducts = products.filter((p) => p.id !== product.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setDetailsModalOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Products
        </Typography>
        <IconButton onClick={onClose}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      <Box mb={3}>
        <TextField
          placeholder="Search Products"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={40} sx={{ color: "#a31515" }} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              maxHeight: "none",
              overflowY: "visible",
              mb: 2,
              border: "1px solid rgba(224, 224, 224, 1)",
              borderRadius: 1,
            }}
          >
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 500, width: "15%" }}>
                    Product name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "12%" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "8%" }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "8%" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "12%" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "12%" }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "15%" }}>
                    Expiry Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, width: "12%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      hover
                      onClick={() => handleProductClick(product)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        ₱{parseFloat(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{formatDate(product.expiryDate)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          sx={{ color: "#a31515" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(product);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#a31515" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {paginatedProducts.length > 0 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography variant="body2" sx={{ mt: 1, mr: 1 }}>
                {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)}{" "}
                of {filteredProducts.length}
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveEdit}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        product={selectedProduct}
        onEdit={handleEditClick}
        onDelete={handleDeleteProduct}
      />
    </Box>
  );
};

ViewProduct.propTypes = {
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.bool,
};

export default ViewProduct;
