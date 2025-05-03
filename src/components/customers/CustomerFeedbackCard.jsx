import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Rating,
  Pagination,
  Paper,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const CustomerFeedbackCard = ({
  feedbacks = [],
  page,
  onPageChange,
  loading = false,
}) => {
  // Calculate which items to display based on current page
  const itemsPerPage = 5;
  const pageCount = Math.ceil((feedbacks?.length || 0) / itemsPerPage);
  const displayedFeedbacks =
    feedbacks?.slice((page - 1) * itemsPerPage, page * itemsPerPage) || [];

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Convert rating to a valid value (1-5 scale)
  const normalizeRating = (rating) => {
    if (!rating) return 0;
    // Ensure rating is between 0 and 5
    return Math.max(0, Math.min(5, Number(rating)));
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          borderLeft: 4,
          borderColor: "primary.main",
          pl: 2,
          fontWeight: 500,
        }}
      >
        Customer Feedback
      </Typography>

      <Box sx={{ mb: 1, flexGrow: 1, overflow: "auto" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : displayedFeedbacks.length > 0 ? (
          displayedFeedbacks.map((feedback, index) => (
            <React.Fragment key={feedback.id}>
              <Box sx={{ display: "flex", py: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(163, 21, 21, 0.1)",
                    color: "primary.main",
                    mr: 1.5,
                    width: 28,
                    height: 28,
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {feedback.customer?.name || "Anonymous Customer"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(
                        feedback.date_submitted || feedback.created_at
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 0.5,
                    }}
                  >
                    <Rating
                      value={normalizeRating(feedback.ratings)}
                      readOnly
                      size="small"
                      max={5}
                      precision={1}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "right", display: "block" }}
                  >
                    "{feedback.comments || ""}"
                  </Typography>
                </Box>
              </Box>
              {index < displayedFeedbacks.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No feedback available
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "center", mt: "auto", pt: 0.5 }}
      >
        <Pagination
          count={pageCount}
          page={page}
          onChange={onPageChange}
          color="primary"
          size="small"
          disabled={loading || displayedFeedbacks.length === 0}
        />
      </Box>
    </Paper>
  );
};

export default CustomerFeedbackCard;
