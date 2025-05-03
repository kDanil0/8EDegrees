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

const MonthlySales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    month: "",
    totalSales: 0,
    totalPurchase: 0, // This will be the total amount from purchase orders
    grossProfit: 0,
  });

  // Get current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // List of months for the dropdown
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    fetchMonthlySales();
  }, [selectedYear, selectedMonth]);

  const fetchMonthlySales = async () => {
    setLoading(true);
    try {
      const response = await accountingService.getMonthlySales(
        selectedYear,
        selectedMonth
      );

      // Get the purchase order total from the response
      const totalPurchaseAmount = response.total_purchase_orders || 0;
      const totalSales = response.total_sales || 0;

      setSalesData({
        month:
          months.find((m) => m.value === selectedMonth)?.label || "Unknown",
        totalSales: totalSales,
        totalPurchase: totalPurchaseAmount,
        grossProfit: totalSales - totalPurchaseAmount,
      });
    } catch (error) {
      console.error("Error fetching monthly sales data:", error);
      // Default data in case of error
      setSalesData({
        month:
          months.find((m) => m.value === selectedMonth)?.label || "Unknown",
        totalSales: 0,
        totalPurchase: 0,
        grossProfit: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  // Format number as currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // Is the business profitable?
  const isProfitable = salesData.grossProfit > 0;

  const displayData = [
    { title: "Month", value: `${salesData.month} ${selectedYear}` },
    { title: "Total Sales", value: formatCurrency(salesData.totalSales) },
    { title: "Total Purchase", value: formatCurrency(salesData.totalPurchase) },
    {
      title: "Gross Profit",
      value: formatCurrency(salesData.grossProfit),
      isProfit: true,
      color: isProfitable ? "#2e7d32" : "#d32f2f",
    },
  ];

  // Generate year options (current year and 4 years back)
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - i);
  }

  return (
    <Paper
      elevation={2}
      sx={{ borderRadius: 2, overflow: "hidden", maxWidth: 800, mx: "auto" }}
    >
      <Box p={2} pb={0}>
        <Typography variant="h6" fontWeight="bold">
          8E Degrees Steak house Monthly Sales
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={2}>
          Track and manage monthly sales performance
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
          8E Degrees Monthly Sales
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            size="small"
            value={selectedMonth}
            onChange={handleMonthChange}
            InputProps={{
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "& .MuiSelect-icon": { color: "white" },
              },
            }}
            sx={{ minWidth: 120 }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>

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

export default MonthlySales;
