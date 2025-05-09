import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { accountingService } from "../../services/api";

const YearlySales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    year: "",
    totalSales: 0,
    totalPurchase: 0,
    grossProfit: 0,
    averageMonthlySales: 0,
  });

  // Get current year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate year options (current year and 4 years back)
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - i);
  }

  useEffect(() => {
    fetchYearlySales();
  }, [selectedYear]);

  const fetchYearlySales = async () => {
    setLoading(true);
    try {
      const response = await accountingService.getYearlySales(selectedYear);

      // Get the purchase order total and average monthly sales from the response
      const totalPurchaseAmount = response.total_purchase_orders || 0;
      const totalSales = response.total_sales || 0;
      const averageMonthly = response.average_monthly_sales || 0;

      setSalesData({
        year: selectedYear.toString(),
        totalSales: totalSales,
        totalPurchase: totalPurchaseAmount,
        grossProfit: totalSales - totalPurchaseAmount,
        averageMonthlySales: averageMonthly,
      });
    } catch (error) {
      console.error("Error fetching yearly sales data:", error);
      // Default data in case of error
      setSalesData({
        year: selectedYear.toString(),
        totalSales: 0,
        totalPurchase: 0,
        grossProfit: 0,
        averageMonthlySales: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Format number as currency
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  // Is the business profitable?
  const isProfitable = salesData.grossProfit > 0;

  const displayData = [
    { title: "Year", value: salesData.year },
    { title: "Total Sales", value: formatCurrency(salesData.totalSales) },
    { title: "Total Purchase", value: formatCurrency(salesData.totalPurchase) },
    {
      title: "Gross Profit",
      value: formatCurrency(salesData.grossProfit),
      isProfit: true,
      color: isProfitable ? "#2e7d32" : "#d32f2f",
    },
    {
      title: "Average Monthly Sales",
      value: formatCurrency(salesData.averageMonthlySales),
    },
  ];

  return (
    <Paper
      elevation={2}
      sx={{ borderRadius: 2, overflow: "hidden", maxWidth: 800, mx: "auto" }}
    >
      <Box p={2} pb={0}>
        <Typography variant="h6" fontWeight="bold">
          8E Degrees Steak house Yearly Sales
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={2}>
          Track and manage annual sales performance
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#a31515",
          py: 1.5,
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" color="white" fontWeight="medium">
          8E Degrees Yearly Sales Summary
        </Typography>
        <TextField
          select
          size="small"
          value={selectedYear}
          onChange={handleYearChange}
          InputProps={{
            sx: {
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            },
          }}
          sx={{ minWidth: 100 }}
        >
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {displayData.map((item, index) => (
            <Box key={index}>
              <Grid container sx={{ py: 1.5, px: 3 }}>
                <Grid item xs={6} md={4}>
                  <Typography variant="body1" fontWeight="medium">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={8} sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{
                      color: item.isProfit ? item.color : "inherit",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Grid>
              </Grid>
              {index < displayData.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default YearlySales;
