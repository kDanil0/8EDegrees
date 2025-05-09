import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Typography,
  InputAdornment,
  Box,
  Grid,
} from "@mui/material";
import { customerService } from "../../services/api/customer";

const PointsExchangeModal = ({ open, onClose }) => {
  const [pointsRate, setPointsRate] = useState({
    php_amount: 100,
    points: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      fetchPointsRate();
    }
  }, [open]);

  const fetchPointsRate = async () => {
    setLoading(true);
    try {
      const response = await customerService.getPointsExchangeRate();
      if (response.value && typeof response.value === "object") {
        setPointsRate(response.value);
      }
      setError("");
    } catch (err) {
      setError("Failed to load points exchange rate");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setPointsRate((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate input
    const { php_amount, points } = pointsRate;
    if (
      isNaN(php_amount) ||
      php_amount < 1 ||
      php_amount > 10000 ||
      isNaN(points) ||
      points < 1 ||
      points > 10000
    ) {
      setError("Please enter valid numbers between 1 and 10000");
      setSaving(false);
      return;
    }

    try {
      await customerService.updatePointsExchangeRate(pointsRate);
      setSuccess("Points exchange rate updated successfully");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to update points exchange rate");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Points Exchange Rate Settings</DialogTitle>
      <DialogContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, mt: 1 }}
            >
              Set how many points customers earn for spending a specific amount
              in PHP.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="PHP Amount"
                  variant="outlined"
                  value={pointsRate.php_amount}
                  onChange={handleChange("php_amount")}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 1,
                    max: 10000,
                  }}
                  disabled={saving}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Points Earned"
                  variant="outlined"
                  value={pointsRate.points}
                  onChange={handleChange("points")}
                  fullWidth
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">points</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 1,
                    max: 10000,
                  }}
                  disabled={saving}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, mb: 1, textAlign: "center" }}>
              <Typography variant="subtitle1">
                ₱{pointsRate.php_amount} = {pointsRate.points} points
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
                {success}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={saving}>
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading || saving}
        >
          SAVE CHANGES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PointsExchangeModal;
