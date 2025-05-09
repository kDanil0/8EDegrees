import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Tabs, Tab, Paper, Stack } from "@mui/material";
import CustomerFeedbackCard from "../../components/customers/CustomerFeedbackCard";
import RecentCustomersTable from "../../components/customers/RecentCustomersTable";
import RewardsHistoryCard from "../../components/customers/RewardsHistoryCard";
import PointsExchangeModal from "../../components/customers/PointsExchangeModal";
import RewardDialog from "../../components/customers/RewardDialog";
import DiscountManagementCard from "../../components/customers/DiscountManagementCard";
import RewardManagementCard from "../../components/customers/RewardManagementCard";
import PointsExchangeCard from "../../components/customers/PointsExchangeCard";
import axios from "axios";

// Tab Panel component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-management-tabpanel-${index}`}
      aria-labelledby={`customer-management-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 0, height: "100%" }}>{children}</Box>}
    </div>
  );
};

export default function CustomersPage() {
  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for pagination
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [recentTablePage, setRecentTablePage] = useState(0);
  const [rewardsTablePage, setRewardsTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for data
  const [customers, setCustomers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // State for dialogs
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [pointsRateModalOpen, setPointsRateModalOpen] = useState(false);

  useEffect(() => {
    // Fetch customers
    fetchCustomers();
    // Fetch rewards
    fetchRewards();
    // Fetch feedback
    fetchFeedback();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/customer/customers"
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/customer/rewards"
      );
      console.log("Rewards data:", response.data);

      // Ensure rewards have the correct field name for points
      const formattedRewards = response.data.map((reward) => ({
        ...reward,
        pointsNeeded: reward.points_required || reward.pointsNeeded || 0,
      }));

      setRewards(formattedRewards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/customer/feedback"
      );
      console.log("Feedback data:", response.data);

      // Sort feedback from newest to oldest
      const sortedFeedback = Array.isArray(response.data)
        ? response.data.sort((a, b) => {
            const dateA = new Date(b.date_submitted || b.created_at || 0);
            const dateB = new Date(a.date_submitted || a.created_at || 0);
            return dateA - dateB;
          })
        : [];

      setFeedbacks(sortedFeedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleAddReward = async (rewardData) => {
    try {
      await axios.post(
        "http://localhost:8000/api/customer/rewards",
        rewardData
      );
      // Refresh rewards list
      fetchRewards();
      // Close dialog
      setRewardDialogOpen(false);
    } catch (error) {
      console.error("Error adding reward:", error);
    }
  };

  const handleChangeFeedbackPage = (event, value) => {
    setFeedbackPage(value);
  };

  const handleChangeHistoryPage = (event, value) => {
    setHistoryPage(value);
  };

  const handleChangeRowsPerPage = (event, tableName) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);

    if (tableName === "recent") {
      setRecentTablePage(0);
    } else if (tableName === "rewards") {
      setRewardsTablePage(0);
    }
  };

  const handleChangeRecentTablePage = (event, newPage) => {
    setRecentTablePage(newPage);
  };

  const handleChangeRewardsTablePage = (event, newPage) => {
    setRewardsTablePage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Customer Management
      </Typography>

      {/* Tabs */}
      <Paper sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Feedback" />
          <Tab label="Discounts" />
        </Tabs>
      </Paper>

      {/* Tab Content Container */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        {/* Feedback Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid
            container
            spacing={2}
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            {/* Customer Feedback - Full Width */}
            <Grid item xs={12}>
              <CustomerFeedbackCard
                feedbacks={feedbacks}
                page={feedbackPage}
                onPageChange={handleChangeFeedbackPage}
                loading={feedbackLoading}
                sx={{ typography: "body1" }} // Increase text size for legibility
              />
            </Grid>

            {/* Bottom Row */}
            <Grid item xs={12} md={6}>
              {/* Recent Customers Table */}
              <RecentCustomersTable
                customers={customers}
                page={recentTablePage}
                rowsPerPage={4}
                onPageChange={handleChangeRecentTablePage}
                onRowsPerPageChange={(event) =>
                  handleChangeRowsPerPage(event, "recent")
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Rewards History */}
              <RewardsHistoryCard
                page={historyPage}
                onPageChange={handleChangeHistoryPage}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Discounts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid
            container
            spacing={2}
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            {/* Discounts Management */}
            <Grid item xs={12} md={6}>
              <DiscountManagementCard />
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {/* Points Exchange Card */}
                <PointsExchangeCard />

                {/* Rewards Management */}
                <RewardManagementCard />
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Dialogs */}
      <RewardDialog
        open={rewardDialogOpen}
        onClose={() => setRewardDialogOpen(false)}
        onSubmit={handleAddReward}
      />

      {/* Points Exchange Rate Modal */}
      <PointsExchangeModal
        open={pointsRateModalOpen}
        onClose={() => setPointsRateModalOpen(false)}
      />
    </Box>
  );
}
