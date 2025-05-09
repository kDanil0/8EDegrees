import React, { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import Dashboard from "../../components/supply-chain/Dashboard";
import PurchaseOrders from "../../components/supply-chain/PurchaseOrders";
import LogisticsDeliveries from "../../components/supply-chain/LogisticsDeliveries";
import SupplierManager from "../../components/supply-chain/SupplierManager";

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Dashboard />;
      case 1:
        return <SupplierManager />;
      case 2:
        return <PurchaseOrders />;
      case 3:
        return <LogisticsDeliveries />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Supply Chain Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" />
          <Tab label="Supplier Management" />
          <Tab label="Purchase Orders" />
          <Tab label="Logistics & Deliveries" />
        </Tabs>
      </Box>

      {renderTabContent()}
    </Box>
  );
}
