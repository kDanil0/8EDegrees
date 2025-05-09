import React, { useState } from "react";
import { Typography, Box, Grid, Tabs, Tab } from "@mui/material";
import DailySales from "../../components/accounting/DailySales";
import MonthlySales from "../../components/accounting/MonthlySales";
import YearlySales from "../../components/accounting/YearlySales";
import TransactionHistory from "../../components/accounting/TransactionHistory";

export default function AccountingPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Accounting
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#a31515",
                },
                "& .Mui-selected": {
                  color: "#a31515 !important",
                  fontWeight: "bold",
                },
              }}
              textColor="inherit"
            >
              <Tab label="Daily Sales" />
              <Tab label="Monthly Sales" />
              <Tab label="Yearly Sales" />
              <Tab label="Transaction History" />
            </Tabs>
          </Box>

          {tabValue === 0 && <DailySales />}
          {tabValue === 1 && <MonthlySales />}
          {tabValue === 2 && <YearlySales />}
          {tabValue === 3 && <TransactionHistory />}
        </Grid>
      </Grid>
    </Box>
  );
}
