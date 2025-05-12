import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import UserList from "../../components/users/UserList";
import UserForm from "../../components/users/UserForm";
import { userManagementService } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userManagementService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const handleRefreshList = () => {
    // Increment trigger to force refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Container maxWidth="l" sx={{ pb: 8 }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 5 }}>
        User Management
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Main Content Section */}
      <Grid container spacing={3}>
        {/* User List (Left Side) */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <UserList
              users={users}
              loading={loading}
              onRefresh={handleRefreshList}
            />
          </Paper>
        </Grid>

        {/* User Form (Right Side) */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Create New User
            </Typography>
            <UserForm onSuccess={handleRefreshList} embedded={true} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserManagement;
