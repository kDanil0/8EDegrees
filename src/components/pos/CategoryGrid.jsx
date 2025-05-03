import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

/**
 * Component for displaying product categories in a grid
 */
const CategoryGrid = ({ categories, onSelectCategory }) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Card
              sx={{
                backgroundColor: "#a31515",
                color: "white",
                borderRadius: 4,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#7a1010",
                  transform: "scale(1.02)",
                  transition: "all 0.2s",
                },
              }}
              onClick={() => onSelectCategory(category.id)}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h5">{category.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CategoryGrid;
