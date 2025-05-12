import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { userManagementService } from "../../services/api";

const UserList = ({ users = [], loading = false, onRefresh }) => {
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await userManagementService.delete(selectedUser.id);
      setMessage({ text: "User deleted successfully", type: "success" });
      setShowMessage(true);
      if (onRefresh) onRefresh(); // Call the refresh callback
    } catch (error) {
      setMessage({ text: "You can't delete your own account", type: "error" });
      setShowMessage(true);
    } finally {
      setDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={onRefresh} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        System Users
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role?.roleName}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.id === 1} // Prevent deleting admin user
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={message.type}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserList;
