import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

/**
 * Component for displaying products in a grid
 */
const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Products
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => {
          const isOutOfStock = product.quantity <= 0;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.6 : 1,
                  backgroundColor: isOutOfStock ? "#f5f5f5" : "white",
                  "&:hover": {
                    transform: isOutOfStock ? "none" : "scale(1.02)",
                    transition: "all 0.2s",
                    boxShadow: isOutOfStock ? 1 : 3,
                  },
                }}
                onClick={() => !isOutOfStock && onAddToCart(product)}
              >
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.description || "No description"}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₱{(product.sellingPrice || product.price).toFixed(2)}
                  </Typography>

                  {isOutOfStock && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#d32f2f",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Out of Stock
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ProductGrid;
