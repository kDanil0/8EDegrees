import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  Skeleton,
  Alert,
  InputAdornment,
  Grid,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { customerService } from "../../services/api/customer";

const PointsExchangeCard = () => {
  const [pointsRate, setPointsRate] = useState({
    php_amount: 100,
    points: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialRate, setInitialRate] = useState({
    php_amount: 100,
    points: 10,
  });

  useEffect(() => {
    fetchPointsRate();
  }, []);

  const fetchPointsRate = async () => {
    setLoading(true);
    try {
      const response = await customerService.getPointsExchangeRate();
      if (response.value && typeof response.value === "object") {
        setPointsRate(response.value);
        setInitialRate(response.value);
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
      setInitialRate({ ...pointsRate });
    } catch (err) {
      setError("Failed to update points exchange rate");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    initialRate.php_amount !== pointsRate.php_amount ||
    initialRate.points !== pointsRate.points;

  return (
    <Card elevation={2}>
      <CardHeader
        title="Points Exchange Rate"
        avatar={<SettingsIcon color="primary" />}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ pt: 0.5 }}>
            <Skeleton width="100%" height={60} />
            <Skeleton width="60%" height={40} />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Set how many points customers earn for spending a specific amount
              in PHP. Current rate: ₱{initialRate.php_amount} ={" "}
              {initialRate.points} points
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
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

            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="subtitle1">
                ₱{pointsRate.php_amount} = {pointsRate.points} points
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              fullWidth
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsExchangeCard;
