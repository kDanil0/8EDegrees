import React, { useState, useEffect } from "react";
import { Typography, Box, Grid } from "@mui/material";
import CustomerFeedbackCard from "../../components/customers/CustomerFeedbackCard";
import RecentCustomersTable from "../../components/customers/RecentCustomersTable";
import EligibleRewardsTable from "../../components/customers/EligibleRewardsTable";
import RewardsHistoryCard from "../../components/customers/RewardsHistoryCard";
import RewardDialog from "../../components/customers/RewardDialog";
import axios from "axios";

export default function CustomersPage() {
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

  // State for the reward dialog
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);

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
      setRewards(response.data);
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

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Customer Management
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          height: "calc(100% - 50px)",
          width: "100%",
        }}
      >
        {/* Left column - Feedback & History - Width increased */}
        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <CustomerFeedbackCard
                feedbacks={feedbacks}
                page={feedbackPage}
                onPageChange={handleChangeFeedbackPage}
                loading={feedbackLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <RewardsHistoryCard
                page={historyPage}
                onPageChange={handleChangeHistoryPage}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Right column - Tables - Width adjusted */}
        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={2} direction="column">
            {/* Recent Customers Table */}
            <Grid item xs={12}>
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

            {/* Eligible Rewards Table */}
            <Grid item xs={12}>
              <EligibleRewardsTable
                rewards={rewards}
                page={rewardsTablePage}
                rowsPerPage={4}
                onPageChange={handleChangeRewardsTablePage}
                onRowsPerPageChange={(event) =>
                  handleChangeRowsPerPage(event, "rewards")
                }
                onAddRewardClick={() => setRewardDialogOpen(true)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Reward Dialog */}
      <RewardDialog
        open={rewardDialogOpen}
        onClose={() => setRewardDialogOpen(false)}
        onSubmit={handleAddReward}
      />
    </Box>
  );
}
