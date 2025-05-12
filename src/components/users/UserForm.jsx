import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { userManagementService } from "../../services/api";

const UserForm = ({ open, onClose, onSuccess, embedded = false }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);

  const [roles, setRoles] = useState([
    { id: 1, roleName: "Admin" },
    { id: 2, roleName: "Cashier" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length > 10) {
      newErrors.username = "Username must be 10 characters or less";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role_id) {
      newErrors.role_id = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await userManagementService.create(formData);
      setMessage({ text: "User created successfully", type: "success" });
      setShowMessage(true);
      onSuccess();
      resetForm();
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key][0];
        });

        setErrors(formattedErrors);
      } else {
        setMessage({ text: "Failed to create user", type: "error" });
        setShowMessage(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      role_id: "",
    });
    setErrors({});

    if (!embedded && onClose) {
      onClose();
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            disabled={loading}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.role_id}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              label="Role"
              disabled={loading}
            >
              <MenuItem value="">Select Role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
            {errors.role_id && (
              <Typography variant="caption" color="error">
                {errors.role_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: embedded ? "flex-start" : "flex-end",
          }}
        >
          {!embedded && (
            <Button onClick={onClose} disabled={loading} sx={{ mr: 1 }}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ position: "relative" }}
          >
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
            Create User
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  // For notification
  const notification = (
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
  );

  // If embedded mode, render directly
  if (embedded) {
    return (
      <>
        {formContent}
        {notification}
      </>
    );
  }

  // Otherwise render in dialog
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Add New User
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>{formContent}</DialogContent>
      </Dialog>
      {notification}
    </>
  );
};

export default UserForm;
