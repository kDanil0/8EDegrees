import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { accountingService } from "../../services/api";

const DailySales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Today's date in YYYY-MM-DD
  const [openDialog, setOpenDialog] = useState(false);
  const [cashDrawerForm, setCashDrawerForm] = useState({
    cash_in: 0,
    cash_out: 0,
    cash_count: 0,
    notes: "",
  });

  useEffect(() => {
    fetchDailySales();
  }, [selectedDate]);

  const fetchDailySales = async () => {
    setLoading(true);
    try {
      const response = await accountingService.getDailySales(selectedDate);

      const formattedData = [
        {
          title: "Total Sales",
          value: parseFloat(response.total_sales).toLocaleString(),
        },
        {
          title: "Cash Sales",
          value: parseFloat(response.cash_sales).toLocaleString(),
        },
        {
          title: "Cash In",
          value: parseFloat(response.cash_in).toLocaleString(),
        },
        {
          title: "Cash Out",
          value: parseFloat(response.cash_out).toLocaleString(),
        },
        {
          title: "Expected Cash in Drawer",
          value: parseFloat(response.expected_cash).toLocaleString(),
        },
        {
          title: "Cash Count",
          value: parseFloat(response.cash_count).toLocaleString(),
        },
        {
          title: "Short / Over",
          value: parseFloat(response.short_over).toLocaleString(),
        },
      ];

      setSalesData(formattedData);
      setCashDrawerForm({
        cash_in: response.cash_in || 0,
        cash_out: response.cash_out || 0,
        cash_count: response.cash_count || 0,
        notes: response.notes || "",
      });
    } catch (error) {
      console.error("Error fetching daily sales:", error);
      setSalesData([
        { title: "Total Sales", value: "0" },
        { title: "Cash Sales", value: "0" },
        { title: "Cash In", value: "0" },
        { title: "Cash Out", value: "0" },
        { title: "Expected Cash in Drawer", value: "0" },
        { title: "Cash Count", value: "0" },
        { title: "Short / Over", value: "0" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCashDrawerForm({
      ...cashDrawerForm,
      [name]: name === "notes" ? value : parseFloat(value),
    });
  };

  const handleSubmit = async () => {
    try {
      await accountingService.updateCashDrawerOperations({
        operation_date: selectedDate,
        ...cashDrawerForm,
      });
      fetchDailySales();
      handleDialogClose();
    } catch (error) {
      console.error("Error updating cash drawer:", error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Paper
      elevation={2}
      sx={{ borderRadius: 2, overflow: "hidden", maxWidth: 800, mx: "auto" }}
    >
      <Box p={2} pb={0}>
        <Typography variant="h6" fontWeight="bold">
          8E Degrees Steak house Daily Sales
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={2}>
          Track and manage daily sales performance
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
          8E Degrees Daily Sales
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
            InputProps={{
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleDialogOpen}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Update Cash Drawer
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {salesData.map((item, index) => (
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
                    fontWeight={
                      item.title === "Short / Over" ? "bold" : "medium"
                    }
                    sx={{
                      color:
                        item.title === "Short / Over" &&
                        parseFloat(item.value) < 0
                          ? "#d32f2f"
                          : "inherit",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Grid>
              </Grid>
              {index < salesData.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}

      {/* Cash Drawer Update Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Update Cash Drawer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Cash In"
              type="number"
              name="cash_in"
              value={cashDrawerForm.cash_in}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Cash Out"
              type="number"
              name="cash_out"
              value={cashDrawerForm.cash_out}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Cash Count"
              type="number"
              name="cash_count"
              value={cashDrawerForm.cash_count}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Notes"
              name="notes"
              value={cashDrawerForm.notes}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: "#a31515", "&:hover": { bgcolor: "#7a1010" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DailySales;
