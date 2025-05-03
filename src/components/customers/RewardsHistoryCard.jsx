import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Pagination,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import axios from "axios";

const RewardsHistoryCard = ({ page, onPageChange }) => {
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewardHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/customer/rewards-history"
        );
        setRewardHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reward history:", error);
        setError("Failed to load reward history. Please try again later.");
        setLoading(false);
      }
    };

    fetchRewardHistory();
  }, []);

  // Items per page
  const itemsPerPage = 3;
  const pageCount = Math.ceil(rewardHistory.length / itemsPerPage);
  const displayedItems = rewardHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
        Reward Claims History
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
          {error}
        </Box>
      ) : rewardHistory.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
          No reward claims history available.
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflow: "auto", mb: 1 }}>
            {displayedItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="center" sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(163, 21, 21, 0.1)",
                        color: "primary.main",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {item.customer}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <CardGiftcardIcon
                          fontSize="small"
                          sx={{
                            color: "primary.main",
                            fontSize: "0.8rem",
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mr: 1 }}
                        >
                          {item.reward}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayedItems.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "auto",
              pt: 0.5,
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={onPageChange}
              color="primary"
              size="small"
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default RewardsHistoryCard;
