import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { customerService } from "../../services/api/customer";
import RewardManagementModal from "./RewardManagementModal";

const RewardManagementCard = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await customerService.getRewards();
      setRewards(data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchRewards(); // Refresh rewards after modal is closed
  };

  // Get statistics
  const activeRewardsCount = rewards.filter((r) => r.is_active).length;
  const percentageDiscounts = rewards.filter(
    (r) => r.type === "percentage_discount"
  ).length;
  const freeItems = rewards.filter((r) => r.type === "free_item").length;

  // Function to render the reward type icon
  const renderRewardTypeIcon = (type) => {
    switch (type) {
      case "percentage_discount":
        return <LocalOfferIcon fontSize="small" />;
      case "free_item":
        return <ShoppingBasketIcon fontSize="small" />;
      default:
        return <CardGiftcardIcon fontSize="small" />;
    }
  };

  // Function to get reward value text
  const getRewardValueText = (reward) => {
    if (reward.type === "percentage_discount") {
      return `${reward.value}% off`;
    } else if (reward.type === "free_item" && reward.product) {
      return `Free ${reward.product.name}`;
    } else {
      return `${reward.pointsNeeded} points`;
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <CardGiftcardIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Rewards</Typography>
            </Box>
          }
          action={
            <Tooltip title="Manage Rewards">
              <IconButton onClick={handleOpenModal} color="primary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Manage rewards like percentage discounts and free items that
                  customers can redeem with points
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  bgcolor="action.hover"
                  p={1.5}
                  borderRadius={1}
                  mt={1}
                >
                  <Typography>Total Rewards</Typography>
                  <Chip label={rewards.length} color="primary" size="small" />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  bgcolor="action.hover"
                  p={1.5}
                  borderRadius={1}
                  mt={1}
                >
                  <Typography>Active Rewards</Typography>
                  <Chip
                    label={activeRewardsCount}
                    color="success"
                    size="small"
                  />
                </Box>
              </Box>

              {rewards.length > 0 ? (
                <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                  <Stack spacing={1} mt={2}>
                    {rewards.map((reward) => (
                      <Box
                        key={reward.id}
                        p={1}
                        borderRadius={1}
                        border="1px solid"
                        borderColor="divider"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Box display="flex" alignItems="center">
                            {renderRewardTypeIcon(reward.type)}
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              ml={1}
                            >
                              {reward.name}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {getRewardValueText(reward)}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                        >
                          <Chip
                            label={`${reward.pointsNeeded} points`}
                            size="small"
                            color={reward.is_active ? "success" : "default"}
                          />
                          {!reward.is_active && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              mt={0.5}
                            >
                              Inactive
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Typography
                  textAlign="center"
                  sx={{ my: 4 }}
                  color="text.secondary"
                >
                  No rewards available
                </Typography>
              )}

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Manage Rewards
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {modalOpen && (
        <RewardManagementModal open={modalOpen} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default RewardManagementCard;
