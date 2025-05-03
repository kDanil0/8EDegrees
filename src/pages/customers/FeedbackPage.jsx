import React, { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { customerService } from "../../services/api/customer";

const FeedbackPage = () => {
  const [serviceRating, setServiceRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Calculate the average rating from the three categories
      const averageRating = Math.round(
        (serviceRating + foodRating + overallRating) / 3
      );

      // Submit the feedback
      await customerService.submitFeedback({
        ratings: averageRating,
        comments: comments,
        is_critical: averageRating <= 2, // Mark as critical if average rating is 2 or less
      });

      setSuccess(true);

      // Reset form
      setServiceRating(0);
      setFoodRating(0);
      setOverallRating(0);
      setComments("");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      console.error("Feedback submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (value, setValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box
          component="span"
          key={i}
          onClick={() => setValue(i)}
          sx={{ cursor: "pointer", mx: 0.5 }}
        >
          {i <= value ? (
            <Star sx={{ color: "#FFD700", fontSize: 30 }} />
          ) : (
            <StarBorder sx={{ color: "#e4e5e9", fontSize: 30 }} />
          )}
        </Box>
      );
    }
    return stars;
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Card elevation={3}>
            <CardHeader
              sx={{
                bgcolor: "#dc3545",
                color: "white",
                textAlign: "center",
                py: 2,
              }}
              title={
                <Box>
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    8E DEGREES
                  </Typography>
                  <Typography variant="subtitle2">STEAK HOUSE</Typography>
                </Box>
              }
            />
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                textAlign="center"
                mb={4}
                fontWeight="medium"
              >
                We Value Your Feedback
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your feedback! We appreciate your input.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Service:
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    {renderStarRating(serviceRating, setServiceRating)}
                  </Box>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Food quality:
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    {renderStarRating(foodRating, setFoodRating)}
                  </Box>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Overall experience:
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    {renderStarRating(overallRating, setOverallRating)}
                  </Box>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Additional comments:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Tell us about your experience....."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </Box>

                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={
                      submitting ||
                      !(serviceRating && foodRating && overallRating)
                    }
                    sx={{
                      bgcolor: "#dc3545",
                      "&:hover": { bgcolor: "#c82333" },
                      py: 1.5,
                    }}
                  >
                    {submitting ? "Submitting..." : "SUBMIT"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeedbackPage;
